require(`net`)
  .createServer(socket=>{
   // Событие data обрабатывается при считывании новых данных
      socket.on(`data`, data => 
         /* Данные возвращаются в виде эха обратно клиенту */
         socket.write(data)
      );
})
  .listen(2222);
