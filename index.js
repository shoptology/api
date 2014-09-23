// ### Swagger Sample Application
//
// This is a sample application which uses the [swagger-node-express](https://github.com/wordnik/swagger-node-express)
// module.  The application is organized in the following manner:
//
// #### petResources.js
//
// All API methods for this petstore implementation live in this file and are added to the swagger middleware.
//
// #### models.js
//
// This contains all model definitions which are sent & received from the API methods.
//
// #### petData.js
//
// This is the sample implementation which deals with data for this application

// Include express and swagger in the application.
var express = require("express"),
 url = require("url"),
 json = require("express-json"),
 cors = require("cors"),
 bodyParser = require('body-parser'),
 app = express(),
 swagger = require("swagger-node-express").createNew(app);

var petResources = require("./resources.js");


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

swagger.setAppHandler(app);

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

var models = require("./models/sample.js");

// Add models and methods to swagger
swagger.addModels(models)
  .addGet(petResources.findByTags)    // - /pet/findByTags
  .addGet(petResources.findByStatus)  // - /pet/findByStatus
  .addGet(petResources.findById)      // - /pet/{petId}
  .addPost(petResources.addPet)
  .addPut(petResources.updatePet)
  .addDelete(petResources.deletePet);

swagger.configureDeclaration("pet", {
  description : "Operations about Pets",
  authorizations : ["oauth2"],
  produces: ["application/json"]
});

// set api info
swagger.setApiInfo({
  title: "Swagger Sample App",
  description: "This is a sample server Petstore server. You can find out more about Swagger at <a href=\"http://swagger.wordnik.com\">http://swagger.wordnik.com</a> or on irc.freenode.net, #swagger.  For this sample, you can use the api key \"special-key\" to test the authorization filters",
  termsOfServiceUrl: "http://helloreverb.com/terms/",
  contact: "apiteam@wordnik.com",
  license: "Apache 2.0",
  licenseUrl: "http://www.apache.org/licenses/LICENSE-2.0.html"
});

swagger.setAuthorizations({
  apiKey: {
    type: "apiKey",
    passAs: "header"
  }
});

// Configures the app's base path and api version.
swagger.configureSwaggerPaths("", "api-docs", "")
swagger.configure("http://0.0.0.0:8002", "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/../swagger-ui/');
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



/// Load module dependencies.
/*var express = require("express"),
 url = require("url"),
 bodyParser = require('body-parser'),
 session = require('express-session'),
 MongoStore = require('connect-mongo')({session:session}),
 mongoose = require('mongoose'),
 json = require('express-json'),
 swagger = require("swagger-node-express");

// Create the application.
var app = express()
	.use(json());
app.use(bodyParser.urlencoded());

/**
 * Connect to MongoDB.
 */

/*mongoose.connect('mongodb://localhost:27017/test');
mongoose.connection.on('error', function() {
    console.error('MongoDB Connection Error. Make sure MongoDB is running.');
});

// Couple the application to the Swagger module.
swagger.setAppHandler(app);

swagger.addModels({
    "Category":{
      "id":"Category",
      "required": ["id", "name"],
      "properties":{
        "id":{
          "type":"integer",
          "format": "int64",
          "description": "Category unique identifier",
          "minimum": "0.0",
          "maximum": "100.0"
        },
        "name":{
          "type":"string",
          "description": "Name of the category"
        }
      }
    },
    "Pet":{
      "id":"Pet",
      "required": ["id", "name"],
      "properties":{
        "id":{
          "type":"integer",
          "format":"int64",
          "description": "Unique identifier for the Pet",
          "minimum": "0.0",
          "maximum": "100.0"
        },
        "category":{
          "$ref":"Category",
          "description": "Category the pet is in"
        },
        "name":{
          "type":"string",
          "description": "Friendly name of the pet"
        },
        "photoUrls":{
          "type":"array",
          "description": "Image URLs",
          "items":{
            "type":"string"
          }
        },
        "tags":{
          "type":"array",
          "description": "Tags assigned to this pet",
          "items":{
            "$ref":"Tag"
          }
        },
        "status":{
          "type":"string",
          "description":"pet status in the store",
          "enum":[
            "available",
            "pending",
            "sold"
          ]
        }
      }
    },
    "Tag":{
      "id":"Tag",
      "required": ["id"],
      "properties":{
        "id":{
          "type":"integer",
          "format":"int64",
          "description": "Unique identifier for the tag"
        },
        "name":{
          "type":"string",
          "description":"Friendly name for the tag"
        }
      }
    }
});

var findById = {
  'spec': {
    "description" : "Operations about pets",
    "path" : "/pet.{format}/{petId}",
    "notes" : "Returns a pet based on ID",
    "summary" : "Find pet by ID",
    "method": "GET",
    "parameters" : [swagger.pathParam("petId", "ID of pet that needs to be fetched", "string")],
    "type" : "Pet",
    "errorResponses" : [swagger.errors.invalid('id'), swagger.errors.notFound('pet')],
    "nickname" : "getPetById"
  },
  'action': function (req,res) {
    if (!req.params.petId) {
      throw swagger.errors.invalid('id');
    }
    var id = parseInt(req.params.petId);
    var pet = petData.getPetById(id);

    if (pet) {
      res.send(JSON.stringify(pet));
    } else {
      throw swagger.errors.notFound('pet');
    }
  }
};

swagger.addGet(findById);

swagger.configure("http://0.0.0.0", "0.1");

app.listen(8002);
console.log('started');*/