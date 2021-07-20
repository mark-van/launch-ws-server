
const WebSocket = require('ws');

const port = process.env.PORT || 8080;

const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    console.log(data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
});