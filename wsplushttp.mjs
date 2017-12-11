import ws from 'ws';
import http from 'http';

const PORT = 4444,
      clients = {},
      http_ = http.createServer(),
      data = (host = '192.168.99.100') => `
 <button id="b">send</button><input value='demo' />
  <script>{
     let socket = new WebSocket('ws://${host}:${PORT}');
     socket.onopen = () => {
       console.log('connected');
     };
     socket.onclose = () => {
       console.log('closed');
     };
     socket.onmessage = event => {
       console.log(event.data);
     };

    document.querySelector('#b').addEventListener('click', ({ target }) =>{
      socket.send(target.nextSibling.value);
    });
 }</script>
 `;


(new ws.Server({
  server: http_
}))
 .on('connection', ws => {
         let id = Math.random();
         clients[id] = ws;
         console.log('New connection');
         ws
          .on('message', message=> {
            console.log('message received: ' + message);
            Object.values(clients).forEach(client => client.send(message));
            if (message == 'quit') {
              process.nextTick( () => {throw new Error('Quitting!');} );
            }
         })
          .on('close', ()=>{
            console.log('Connection closed');
            delete clients[id];
         });
    })
http_.on('request', (req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(data(process.env.HOST));
});
http_.listen(PORT);
