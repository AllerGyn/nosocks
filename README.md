# nosocks
Веб-сокеты похожи на потоки/Obervables и другие «реактивные» структуры, связанные с мгновенным изменением одних данных в соответствии с другими. Это не единственный вариант полнодуплексного сообщения в вебе.

Альтернатива - HTTP/2+SSE

Server-Sent Events (SSE) — это механизм, который позволяет серверу асинхронно отправлять данные клиенту после установления клиент-серверного соединения. В рамках этой технологии существует стандартное клиентское API для JavaScript, называемое EventSource, реализованное в большинстве современных браузеров как часть стандарта HTML5.

Рассмотрим борд с клиентским сценарием: 
https://kodaktor.ru/sse_demo

Этот клиентский сценарий подключается к маршруту https://kodaktor.ru/api2/sse_source - можно открыть его в нескольких вкладках или окнах. Каждое такое подключение (см. код ниже) создаёт сохранённый объект Response - итого получается массив этих респонсов, фактически запоминающих подключённых клиентов.

Если параллельно (например CURL-ом) заходить на маршрут https://kodaktor.ru/api2/sse_set то на стороне сервера каждый из респонсов отправит ответ - и для подключённых клиентов это будет означать приход события от сервера. Server sent event.

Как это достигается?

Во-первых, у нас хранится массив респонсов.

Во-вторых, у нас есть middleware, которое обслуживает указанные выше два серверных маршрута.

```
 let conns = [];
 let sse = (r, res, next) => {
   res.sseSetup = () => res.writeHead(200, {
       'Content-Type': 'text/event-stream',
       'Cache-Control': 'no-cache',
       'Connection': 'keep-alive'
     });
   res.sseSend = data => res.write('data: ' + JSON.stringify(data) + '\n\n');
   next();
 };
 ```
 
 
 И наконец вот сами обработчики маршрутов:
 
 ```
 router
      .route('/sse_source')
       .get( sse, r=>{
         const z = moment().format('DD/MM/YYYY HH:mm');
         r.res.sseSetup();
         r.res.sseSend(z);
         conns.push(r.res);
     } );

router
      .route('/sse_set')
       .get( sse, r=>{
         const z = moment().format('DD/MM/YYYY HH:mm');
         conns.forEach(x=>x.sseSend(z));
     } );
 ```
 
Более интересный пример - голосовалка.

https://www.terlici.com/2015/12/04/realtime-node-expressjs-with-sse.html

Можно использовать именованные события вида onmessage как альтернативу addEventListener

- https://habrahabr.ru/company/ruvds/blog/342346/

- https://developer.mozilla.org/en-US/docs/Web/API/EventSource

