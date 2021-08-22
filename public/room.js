const socket = io(window.location.href);
const exampleNames = ["test", "john", "default", "anykey", "subzero", "no1"];

const room = {
  players: [],
  nickname: null,
  draw: function (
    ctx = canvasContext,
    ctxWidth = canvas.width,
    ctxHeight = canvas.height,
    timePass
  ) {
    ctx.clearRect(0, 0, ctxWidth, ctxHeight);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, ctxWidth, ctxHeight);
    ctx.font = "18px Roboto Mono";

    ctx.fillStyle = "#549423";
    ctx.fillRect(20, 20, 150, 50);
    ctx.fillStyle = "#ccc";
    ctx.fillRect(20, 130, 350, 140);
    ctx.fillText("Players:", 30, 110);
    ctx.fillStyle = "#B3370B";
    ctx.fillRect(20, 430, 150, 50);

    for (let i = 0; i < this.players.length; i++) {
      ctx.fillStyle = this.players[i] == this.nickname ? "#B3370B" : "#333";
      ctx.fillText(this.players[i], 30, 160 + i * 30);
    }

    ctx.fillStyle = "#000";
    ctx.fillText("Connect", 55, 50);
    ctx.fillText("Start", 65, 460);
  },
  init: function () {
    canvas.width = 400;
    canvas.height = 500; //755;

    document.getElementById(
      "hotLog"
    ).innerHTML = `Chat (${new Date().toLocaleString()}):`;
    this.draw();

    // --- EVENTS ---

    socket.on("players_info", (players) => {
      console.log(
        `=> [players_info] players: ${players}\r\nYou nick: ${this.nickname}`
      );

      this.players = players;
      this.draw();
    });

    socket.on("chat", (message) => {
      console.log(`=> [chat] message: ${message}`);
      document.getElementById("hotLog").innerHTML += "\r\n" + message;
    });

    socket.on("registered", (regNick) => {
      console.log(`=> [registered] regNick: ${regNick}`);
      if (regNick == null) {
        alert("Wrong symbols in a nickname");
      } //something gonna wrong
      this.nickname = regNick;
    });

    socket.on("start", (GAME) => {
      console.log(`=> [start] GAME:`, GAME);
      StartGame(this.players);
    });

    socket.on("disconnect", (reason) => {
      console.log(`=> [disconnect] FAIIIIL! ${reason}`);
    });

    document.onmousedown = function (e) {
      if (e.toElement == canvas) {
        if (
          e.layerX > 20 &&
          e.layerX < 20 + 150 &&
          e.layerY > 20 &&
          e.layerY < 20 + 50
        ) {
          let item =
            exampleNames[Math.floor(Math.random() * exampleNames.length)];
          let nick = prompt(`Enter your nick:`, item);
          // let input = document.getElementById("input")
          // input.focus()
          // input.click()
          //document.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE); // can"t find more info

          if (nick != null) {
            let reg = { name: nick };
            console.log(`<= [register] reg: ${reg}`);
            socket.emit("register", reg);
          }
        } else if (
          e.layerX > 20 &&
          e.layerX < 20 + 150 &&
          e.layerY > 430 &&
          e.layerY < 430 + 50
        ) {
          console.log(`<= [start]`);
          socket.emit("start");
        }
      } else {
        let message = prompt("Enter the message:");

        if (message != null) {
          console.log(`<= [chat] message: ${message}`);
          socket.emit("chat", message);
        }
      }
    };
  },
};

room.init();
