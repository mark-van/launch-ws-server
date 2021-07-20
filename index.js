
const WebSocket = require('ws');
const port = process.env.PORT || 8080;

function noop() {}

function heartbeat() {
    this.isAlive = true;
}



const wss = new WebSocket.Server({ port: port });

wss.on('connection', function connection(ws) {
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  ws.on('message', function incoming(data) {
    console.log(data);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  });
  ws.send('something');
});


const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) return ws.terminate();
  
      ws.isAlive = false;
      ws.ping(noop);
    });
}, 30000);

  
wss.on('close', function close() {
    clearInterval(interval);
});