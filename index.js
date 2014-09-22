// Load module dependencies.
var express = require("express"),
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

mongoose.connect('mongodb://localhost:27017/test');
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
console.log('started');