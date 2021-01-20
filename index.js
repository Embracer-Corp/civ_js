const globalConfig = require('./config')
const express = require('express')
const app = express()
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname +'/public'));

var clients = {}

function getClientNames() {
  let players = []
  for (let key in clients) {
    if (clients[key].name == null) continue
    players.push(clients[key].name)
  }
  return players
}

function broadcast(signal, data, except = null) {
  for (let key in clients) {
    if (except==null || (typeof(except)=="string" ? clients[key].name!=except : clients[key].name in except))
    {
      clients[key].socket.emit(signal, data)
    }
  }
}

io.on('connection', (socket) => {
  clients[socket.id] = {socket: socket}
  console.log(`a user connected, id:${socket.id}, client.id:${socket.client.id}. COUNT: ${Object.keys(clients).length}`);

  socket.emit('data', {players: getClientNames()})

  socket.on('hello', data => {
    console.log(data);

    let players = getClientNames()
    if (players.includes(data.name)) {
      let fixer = 1
      while (players.includes(data.name+" ("+fixer+")")) { fixer +=1 }
      data.name += " ("+fixer+")"
      // socket.emit('registered', null)
      // return
    }

    clients[socket.id].name = data.name
    socket.emit('registered', data.name)
    broadcast('data', {players: getClientNames()})
  });

  socket.on('disconnect', (reason) => {
    console.log(`Disconnecting a user ${socket.id}, reason: '${reason}'`)
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect(); // when ???
    }
    delete clients[socket.id]
    
    broadcast('data', {players: getClientNames()})
  });
});

http.listen(globalConfig.PORT, globalConfig.HOST, () => {
  console.log(`listening on '${globalConfig.PORT}:${globalConfig.HOST}`);
});