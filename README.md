# nosocks

Клиентский код для https://kodaktor.ru/g/websockets_lab (продублирован: https://kodaktor.ru/g/purews)

```HTML
<!DOCTYPE html>
<html>
 <head>
  <title>Chat Form</title>
   <meta charset="utf-8"><style>* {font-family:sans-serif} span {position:fixed; right:20px; top:10px;border:double; padding: 15px; border-radius:20px;}</style>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <script>{
     const URL = 'ws://kodaktor.ru:3333';
     let socket = new WebSocket(URL);
  
     socket.onopen = () => {
       console.log('connected');
     };
     socket.onclose = () => {
       console.log('closed');
     };
     socket.onmessage = event => {
       $('ul').append  (`<li>${  $( $.parseHTML(event.data) ).text()      }</li>`);
     };
	 
     $(()=>{
        $('#b').on('click', ()=>{ 
			  socket.send( $('#i').val()  );
        });
     });
 }</script>
 </head>
 <body>
    <h1>Содержимое чата:</h1>
    <ul></ul>
    <span><h2>Введите реплику:</h2>
      <input id="i"><button id="b">Написать!</button></span>
 </body>
</html>
```
