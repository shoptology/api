// ### Swagger Sample Application
//
// This is a sample application which uses the [swagger-node-express](https://github.com/wordnik/swagger-node-express)
// module.  The application is organized in the following manner:
//
// #### userResources.js
//
// All API methods for this userstore implementation live in this file and are added to the swagger middleware.
//
// #### models.js
//
// This contains all model definitions which are sent & received from the API methods.
//
// #### userData.js
//
// This is the sample implementation which deals with data for this application

// Include express and swagger in the application.
var express = require("express"),
 url = require("url"),
 json = require("express-json"),
 cors = require("cors"),
 glob = require("glob"),
 session = require('express-session'),
 MongoStore = require('connect-mongo')({session:session}),
 mongoose = require('mongoose'),
 bodyParser = require('body-parser'),
 app = express(),
 swagger = require("swagger-node-express").createNew(app);

/**
 * Load in Resources
 */
var userResources = require("./resources/users.js");


/**
 * Connect to MongoDB.
 */

mongoose.connect('mongodb://localhost:27017/test');
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Add CORS support
var corsOptions = {
  credentials: true,
  origin: function(origin,callback) {
    if(origin===undefined) {
      callback(null,false);
    } else {
      // change wordnik.com to your allowed domain.
      var match = origin.match("^(.*)?.wordnik.com(\:[0-9]+)?");
      var allowed = (match!==null && match.length > 0);
      callback(null,allowed);
    }
  }
};

app.use(json());
app.use(bodyParser.urlencoded());
app.use(cors(corsOptions));



/**
 * Swagger
 */

swagger.setAppHandler(app);

// set api info
swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "This is a sample server Userstore server. You can find out more about Swagger at <a href=\"http://swagger.wordnik.com\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample, you can use the api key \"special-key\" to test the authorization filters",
  termsOfServiceUrl: "http://helloreverb.com/terms/",
  contact: "apiteam@wordnik.com",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

// Load any schemas in models into our models object
var models = {};    
var schemas = glob.sync("./models/*.js");
schemas.forEach(function(filename) {
    var schema = require(filename);
    models[filename.replace("./models/", "").slice(0, -3)] = schema;
});

// Add models and methods to swagger
swagger.addModels(models)
  .addGet(userResources.findById)      // - /user/{userId}
  .addPost(userResources.addUser)
  .addPut(userResources.updateUser)
  .addDelete(userResources.deleteUser);

swagger.configureDeclaration("user", {
  description : "Operations about Users",
  authorizations : ["oauth2"],
  produces: ["application/json"]
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// This is a sample validator.  It simply says that for _all_ POST, DELETE, PUT
// methods, the header `api_key` OR query param `api_key` must be equal
// to the string literal `special-key`.  All other HTTP ops are A-OK
swagger.addValidator(
  function validate(req, path, httpMethod) {
    //  example, only allow POST for api_key="special-key"
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      if (!apiKey) {
        apiKey = url.parse(req.url,true).query["api_key"]; }
      if ("special-key" == apiKey) {
        return true;
      }
      return false;
    }
    return true;
  }
);

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "docs", "")
swagger.configure("http://0.0.0.0:8002", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/node_modules/swagger-node-express/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {
  if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
    res.writeHead(302, { 'Location' : req.url + '/' });
    res.end();
    return;
  }
  // take off leading /docs so that connect locates file correctly
  req.url = req.url.substr('/docs'.length);
  return docs_handler(req, res, next);
});

app.get('/throw/some/error', function(){
  throw {
    status: 500,
    message: 'we just threw an error for a test case!'
  };
});

app.use(function(err, req, res, next){
  res.send(err.status, err.message);
});

// Start the server on port 8002
app.listen(8002);
console.log('Server started at http://0.0.0.0:8002');