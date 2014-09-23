exports.models = {
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
    "User":{
      "id":"User",
      "required": ["id", "name"],
      "properties":{
        "id":{
          "type":"integer",
          "format":"int64",
          "description": "Unique identifier for the User",
          "minimum": "0.0",
          "maximum": "100.0"
        },
        "category":{
          "$ref":"Category",
          "description": "Category the user is in"
        },
        "name":{
          "type":"string",
          "description": "Friendly name of the user"
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
          "description": "Tags assigned to this user",
          "items":{
            "$ref":"Tag"
          }
        },
        "status":{
          "type":"string",
          "description":"user status in the store",
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
  }