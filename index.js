var Hapi = require('hapi');
var sync = require('./lib/sync');
var store = require('./lib/store');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/sync',
    handler: function (request, reply) {
      sync.get();
      reply(new Date());
    }
});

server.route({
    method: 'GET',
    path:'/store',
    handler: function (request, reply) {
      store.get();
      reply(new Date());
    }
});

// Start the server
server.start();
