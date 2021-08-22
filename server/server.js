const room = require("./room");
const { GAMES_STATES, TILES, UNITS, Game } = require("./game");

// const clients = {
//   _clients: {},
//   get names() {
//     let players = []
//     for (let key in this._clients) {
//       if (this._clients[key].name == null) continue
//       players.push(this._clients[key].name)
//     }
//     return players
//   },
//   add() {

//   }
// }

// const players = {
//   _players: {}
// }

// class Room {
//   constructor(name = '') {
//     if (name == '') { // or not valid name
//       name = ''
//     }
//     this.type = 'local' //public/private(pass)/local(wi-fi,single)
//     this.state = 'preparation' //preparation/active/abandoned
//     this.clients = {}
//     this.chat = new Chat()
//   }
// }

// const rooms = {
//   _rooms: {}, // type:public/private(pass)/local(wi-fi,single), state: preparation/active/abandoned, clients: {player:true/false, socket}, chat,
//   add(name = "") {

//   },
//   findClientRoom() {

//   },
//   findPlayerRoom() {

//   }
// }

// class Chat {

// }

// class Game {

// }

var clients = {};
var game = {};
// var rooms = {"r00001": {clients: [], activePlayer: 0}}

function getClientNames() {
  let players = [];
  for (let key in clients) {
    if (clients[key].name == null) continue;
    players.push(clients[key].name);
  }
  return players;
}

// need broadcast in room (when game started), authorized users (for starting only for them, mb other spectator?), for all (new room, server restart, ...)
function broadcast(signal, data = null, except = []) {
  for (let key in clients) {
    if (except.includes(key)) {
      continue;
    }
    clients[key].socket.emit(signal, data);
  }
}

var chatLog = [];

function init(http) {
  let io = require("socket.io")(http);

  io.on("connection", (socket) => {
    console.log(`=> [connection] socket.id: ${socket.id}`);
    clients[socket.id] = { socket: socket, name: null, room: null };

    console.log(`<= [players_info] player names: ${getClientNames()}`);
    socket.emit("players_info", getClientNames());

    console.log(`<= [chat] chatLog History...`);
    chatLog.forEach((str) => {
      socket.emit("chat", str);
    });

    socket.on("register", (regData) => {
      console.log(`=> [register] regData: ${regData}`);

      let players = getClientNames();
      if (players.includes(regData.name)) {
        let fixer = 1;
        while (players.includes(regData.name + " (" + fixer + ")")) {
          fixer += 1;
        }
        regData.name += " (" + fixer + ")";
      }

      clients[socket.id].name = regData.name;

      console.log(`<= [registered] regData.name: ${regData.name}`);
      socket.emit("registered", regData.name);

      console.log(`<=* [players_info] player names: ${getClientNames()}`);
      broadcast("players_info", getClientNames());

      let str = `${clients[socket.id].name} joined us.`;
      chatLog.push(str);
      console.log(`<=* [chat] str: '${str}'`);
      broadcast("chat", str);
    });

    socket.on("chat", (message) => {
      console.log(`=> [chat] message: '${message}'`);

      if (clients[socket.id].name != null) {
        message = `[${clients[socket.id].name}]: ${message}`;
        chatLog.push(message);

        console.log(`<=@ [chat] message: '${message}'`);
        broadcast("chat", message);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `=> [disconnect] socket.id: ${socket.id}, reason: '${reason}`
      );
      if (reason === "io server disconnect") {
        // the disconnection was initiated by the server, you need to reconnect manually
        socket.connect(); // when ???
      }

      if (clients[socket.id].name != null) {
        let str = `${clients[socket.id].name} left the party.`;
        chatLog.push(str);
        console.log(`<=* [chat] str: '${str}'`);
        broadcast("chat", `${clients[socket.id].name} left the party.`);

        delete clients[socket.id];
        console.log(`<=* [players_info] player names: ${getClientNames()}`);
        broadcast("players_info", getClientNames());
      } else {
        delete clients[socket.id];
      }
    });

    socket.on("start", () => {
      console.log(`=> [start]`);
      // for(let id in clients) {
      //   if (clients[id].name != null) {
      //     //rooms.r00001.clients.push(clients[id]) // better create game here
      //     //clients[id].room = rooms.r00001 // is cyclic ref good?
      //   }
      // }
      // console.log(`clients: `, clients);

      let config = {
        colors: [],
        mapSize: { x: 41, y: 30 },
        tilesType: "all",
        unitsType: "all"
      };

      game = new Game(config, clients);
      game.start();

      console.log(`<=* [start]`);
      broadcast("start", game);
    });

    socket.on("endTurn", () => {
      console.log(`=> [endTurn]`);
      let room = clients[socket.id].room;

      //console.log(`test ${room.activePlayer}, ${room != null && room.clients[room.activePlayer].socket == socket}, ${room.clients.length}.`)
      if (room != null && room.clients[room.activePlayer].socket == socket) {
        room.activePlayer++;
        if (room.activePlayer >= room.clients.length) room.activePlayer = 0;
        console.log(`Now '${room.activePlayer}' turn.`);

        console.log(`<=* [nextPlayer]`);
        broadcast("nextPlayer");
      }
    });

    socket.on("playerAction", (action) => {
      console.log(`=> [playerAction], action: ${action}`);
      let room = clients[socket.id].room;
      console.log(
        `${clients[socket.id].name} /${action.player}\\ -> ${action.player}, ${
          action.unit
        }, ${action.action}, ${action.direction}`
      );
      if (room != null && room.clients[room.activePlayer].socket == socket) {
        console.log(
          `<=@ [playerAction], action: ${action}, except: '${[socket.id]}'`
        );
        broadcast("playerAction", action, [socket.id]); // except himself
      }
    });
  });
}

module.exports = { init };
