const { Server } = require('ws');

const ws = new Server({ port: 2222 });
const conns = new Map();
ws.on('connection', (sock) => {
  conns.set(sock, new Date().toLocaleString());
  sock
    .on('message', (d) => {
      sock.send(d);
    })
    .on('close', () => conns.delete(sock));
});
