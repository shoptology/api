exports.models = {
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