const ip = require('ip');
const WebSocket = require('ws');

// const openSocket = require('socket.io-client');
// const socket = openSocket('http://192.168.40.126:8000');

const port = 8080;
const wss = new WebSocket.Server({ port });

// var clients = [];
const clients = {};

wss.on('error', function error(err) {
  console.log('Error: ' + err.code);
});

wss.on('connection', function connection(ws, req) {
  console.log('connected');

  let clientID = ws._socket._handle.fd;
  // clients.push({ ws, clientID });
  clients[clientID] = ws;

  ws.on('error', function(err) {
    logger.debug('Found error: ' + err);
  });

  ws.on('message', function incoming(message) {
    console.log('received: %s', message, ' from ', clientID, Object.keys(clients));

    // for (var i = clients.length - 1; i >= 0; i--) {
      // console.log(Object.keys(clients[i]), clients[i].clientID);
      // console.log('>>>', clients[i].clientID, clients[i].ws === clients[i].clientID);
    // }

    Object.keys(clients).forEach(function(client, index) {
      if (clients[client].readyState === WebSocket.OPEN) {
        // console.log('open connection', index, client, clientID.toString());

        // send to other clients
        if ( client !== clientID.toString()) {
          console.log(clientID.toString(), '>', client, '>', message);
          clients[client].send(message);
        }
      }
    });
  });

  ws.on('close', function(connection) {
    console.log((new Date()) + " Peer " + clientID + " disconnected.");
    // const json = { type: typesDef.USER_EVENT };
    // userActivity.push(`${users[userID].username} left the document`);
    // json.data = { users, userActivity };
    delete clients[clientID];
    // delete users[userID];
    // sendMessage(JSON.stringify(json));
  });

  // ws.send('something');
});

console.log(ip.address() + ' listening on port ', port);
