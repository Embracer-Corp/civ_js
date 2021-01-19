const globalConfig = require('./config')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname +'/public'));

io.on('connection', (socket) => {
    console.log('a user connected, '+ socket);
  });

http.listen(globalConfig.PORT, globalConfig.HOST, () => {
  console.log(`listening on '${globalConfig.PORT}:${globalConfig.HOST}`);
});