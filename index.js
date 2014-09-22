var http = require('http');
var express = require('express');
var swaggerize = require('swaggerize-express');

app = express();

var server = http.createServer(app);

var swagger = swaggerize({
    api: require('./schema.json'),
    handlers: './handlers'
});

app.use(swagger);

server.listen(8000, 'localhost', function () {
    swagger.setHost(server.address().address + ':' + server.address().port);
});