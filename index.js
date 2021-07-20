var WebSocketServer = require('websocket').server;
var http = require('http');


function sendNumber() {
    if (connection.connected) {
        var number = Math.round(Math.random() * 0xFFFFFF);
        connection.sendUTF(number.toString());
        setTimeout(sendNumber, 1000);
    }
}


var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
const port = process.env.PORT || 8080;
server.listen(port, function() {
    console.log((new Date()) + `Server is listening on port ${port}`);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        console.log("got a message");
        console.log(message);
        connection.sendUTF("can you hear me2");
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
            console.log(message.utf8Data);
            connection.sendUTF("can you hear me3");
            if (message.utf8Data === "launch"){
                connection.sendUTF("can you hear me2");
                connection.sendUTF("launch");
                console.log("tired sending launch")
            }
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
    for (let index = 0; index < 100; index++) {
        connection.sendUTF("can you hear me");
    }

});
