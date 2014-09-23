var sw = require("swagger-node-express");
var param = require("../node_modules/swagger-node-express/lib/paramTypes.js");
var url = require("url");
var swe = sw.errors;

var userData = require("../services/users.js");

// the description will be picked up in the resource listing
exports.findById = {
  'spec': {
    description : "Operations about users",  
    path : "/user/{userId}",
    method: "GET",
    summary : "Find user by ID",
    notes : "Returns a user based on ID",
    type : "User",
    nickname : "getUserById",
    produces : ["application/json"],
    parameters : [param.path("userId", "ID of user that needs to be fetched", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('user')]
  },
  'action': function (req,res) {
    if (!req.params.userId) {
      throw swe.invalid('id'); }
    var id = parseInt(req.params.userId);
    var user = userData.getUserById(id);

    if(user) res.send(JSON.stringify(user));
    else throw swe.notFound('user',res);
  }
};

exports.addUser = {
  'spec': {
    path : "/user",
    notes : "adds a user to the store",
    summary : "Add a new user to the store",
    method: "POST",
    parameters : [param.body("User", "User object that needs to be added to the store", "User")],
    responseMessages : [swe.invalid('input')],
    nickname : "addUser"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('user');
    }
    else{
	    userData.addUser(body);
	    res.send(200);
	  }  
  }
};

exports.updateUser = {
  'spec': {
    path : "/user",
    notes : "updates a user in the store",
    method: "PUT",    
    summary : "Update an existing user",
    parameters : [param.body("User", "User object that needs to be updated in the store", "User")],
    responseMessages : [swe.invalid('id'), swe.notFound('user'), swe.invalid('input')],
    nickname : "addUser"
  },  
  'action': function(req, res) {
    var body = req.body;
    if(!body || !body.id){
      throw swe.invalid('user');
    }
    else {
	    userData.addUser(body);
	    res.send(200);
	  }
  }
};

exports.deleteUser = {
  'spec': {
    path : "/user/{id}",
    notes : "removes a user from the store",
    method: "DELETE",
    summary : "Remove an existing user",
    parameters : [param.path("id", "ID of user that needs to be removed", "string")],
    responseMessages : [swe.invalid('id'), swe.notFound('user')],
    nickname : "deleteUser" 
  },  
  'action': function(req, res) {
    var id = parseInt(req.params.id);
    userData.deleteUser(id)
    res.send(204);
  }
};