const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:2222');
ws.on('open', () => console.log('OK'));
