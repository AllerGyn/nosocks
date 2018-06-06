const PORT = 4321;
const app = require('express')();
const server = require('http').createServer(app);
const clients = [];
(new (require('ws').Server)({ server }))
 .on('connection', ws => {
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

app
  .get('/*', r => require('fs').createReadStream('./client.html').pipe(r.res))
  .use(r => r.res.set({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/html; charset=utf-8',
  }).status(404).end('Тут пока ничего нет, сорри!'))
  .use((e, r, res, n) => r.res.status(500).end(`Ошибочка: ${e}`));

  server.listen(process.env.PORT || PORT, () => console.log('Я запущен'));
