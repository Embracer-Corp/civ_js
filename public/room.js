const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");
const socket = io(window.location.href);
const exampleNames = ["test", "john", "default", "anykey", "subzero", "no1"]

var players = []
var nickname = null

function visual_update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = "18px Lucida Console";

  ctx.fillStyle = "#549423";
  ctx.fillRect(20,20,150,50)
  ctx.fillStyle = "#ccc";
  ctx.fillRect(20,130,350,140)
  ctx.fillText("Players:", 30, 110)
  ctx.fillStyle = "#B3370B";
  ctx.fillRect(20,430,150,50)

  for(let i = 0; i < players.length; i++)
  {
    ctx.fillStyle = players[i] == nickname?"#B3370B":"#333";
    ctx.fillText(players[i], 30, 160 + i*30)
  }

  ctx.fillStyle = "#000";
  ctx.fillText("Connect", 55, 50)
  ctx.fillText("Start", 65, 460)
}

function init()
{
  canvas.width = 400;
  canvas.height = 500;//755;

  document.getElementById("hotLog").innerHTML = `Chat (${new Date().toLocaleString()}):`
  visual_update()

  // --- EVENTS ---

  socket.on('players_info', (players) => {
    console.log(players, this.players)
    
    this.players = players
    visual_update()
  })

  socket.on('chat', (message) => {
    console.log('host->chat:', message)
    document.getElementById("hotLog").innerHTML += "\r\n" + message
  })

  socket.on('registered', (regNick) => {
    if (regNick == null) { alert("Wrong symbols in a nickname") } //something gonna wrong
    nickname = regNick
  })

  socket.on('start', () => {
    StartGame(players)
  })

  socket.on('disconnect', (reason) => { console.log("FAIIIIL! " + reason) })

  document.onmousedown = function(e) {
    if (e.toElement == canvas) {
      if (e.layerX > 20 && e.layerX < 20+150 && e.layerY > 20 && e.layerY < 20+50) {
        let item = exampleNames[Math.floor(Math.random() * exampleNames.length)];
        let nick = prompt("Enter your nick:", item)
        // let input = document.getElementById("input")
        // input.focus()
        // input.click()
        //document.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE); // can't find more info
      
        if (nick != null) {
          socket.emit('register', { name: nick })
        }
      }
      else if(e.layerX > 20 && e.layerX < 20+150 && e.layerY > 430 && e.layerY < 430+50) {
        socket.emit('start')
      }
    } else {
      let message = prompt("Enter the message:")

      if (message != null) {
        socket.emit('chat', message)
      }
    }
  }
}

init()
