const s = require('ws').Server;
const clients = [];
(new s({
  port: 2222
}))
 .on('connection', ws=> {
   let id = Math.random();
   clients[id] = ws;
   ws
    .on('message', message=> {
      Object.values(clients).forEach(client => client.send(message));
      if (message=='quit') {
        process.nextTick( ()=>{throw new Error('Quitting!');} );
      }
   })
    .on('close', ()=>{
      delete clients[id];
   });
});
