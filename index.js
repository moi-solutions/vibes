var Hapi = require('hapi');
var sync = require('./lib/sync');
var player = require('./lib/player');

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: '0.0.0.0',
    port: 8000
});

// Add the route
server.route({
    method: 'GET',
    path:'/sync',
    handler: function (request, reply) {
      sync.run();
      reply(new Date());
    }
});

server.route({
    method: 'GET',
    path:'/play',
    handler: function (request, reply) {
      player.play();
      reply(new Date());
    }
});

// Start the server
server.start();
