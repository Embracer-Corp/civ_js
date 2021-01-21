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

var chatLog = []

io.on('connection', (socket) => {
  clients[socket.id] = {socket: socket}
  console.log(`a user connected, id:${socket.id}, client.id:${socket.client.id}. COUNT: ${Object.keys(clients).length}`);

  socket.emit('players_info', getClientNames())
  chatLog.forEach(str => {
    socket.emit('chat', str)
  })

  socket.on('register', regData => {
    // name filtering [size, symbols, special name, ...]
    // socket.emit('registered', null)
    // return
    console.log('register:', regData);

    let players = getClientNames()
    if (players.includes(regData.name)) {
      let fixer = 1
      while (players.includes(regData.name+" ("+fixer+")")) { fixer +=1 }
      regData.name += " ("+fixer+")"
    }

    clients[socket.id].name = regData.name
    socket.emit('registered', regData.name)
    broadcast('players_info', getClientNames())
    chatLog.push(`${clients[socket.id].name} joined us.`)
    broadcast('chat', `${clients[socket.id].name} joined us.`)
  })

  socket.on('chat', message => {
    // message filtering [size, command, ...]
    console.log('chat:', message);

    if (clients[socket.id].name != null) {
      message = `[${clients[socket.id].name}]: ${message}`
      chatLog.push(message)
      broadcast('chat', message)
    }
  })

  socket.on('disconnect', (reason) => {
    console.log(`Disconnecting a user ${socket.id}, reason: '${reason}'`)
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect(); // when ???
    }

    if (clients[socket.id].name != null)
    {
      chatLog.push(`${clients[socket.id].name} left the party.`)
      broadcast('chat', `${clients[socket.id].name} left the party.`)
      delete clients[socket.id]
      broadcast('players_info', getClientNames())
    }
    else {
      delete clients[socket.id]
    }
  });
});

http.listen(globalConfig.PORT, globalConfig.HOST, () => {
  console.log(`listening on '${globalConfig.PORT}:${globalConfig.HOST}`);
});