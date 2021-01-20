var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;

const socket = io(window.location.href);

var players = []
function visual_update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.font = "18px Lucida Console";

  ctx.fillStyle = "#549423";
  ctx.fillRect(20,20,150,50)
  ctx.fillStyle = "#ccc";
  ctx.fillRect(20,130,400,140)
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
visual_update()

socket.on('data', (data) => {
  console.log(data)
  if ('players' in data)
  {
    players = data.players
  }
  visual_update()
})

socket.on('registered', (data) => {
  if (data == null) { alert("Wrong symbols in a nickname") } //something gonna wrong
  nickname = data
})

const names = ["test", "john", "default", "anykey", "subzero", "no1"]
var nickname = null
canvas.onmousedown = function(e) {
  if (e.layerX > 20 && e.layerX < 20+150 && e.layerY > 20 && e.layerY < 20+50) {
    let item = names[Math.floor(Math.random() * names.length)];
    let nick = prompt("Enter your nick: ", item)
    // let input = document.getElementById("input")
    // input.focus()
    // input.click()
    //document.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE); // can't find more info
  
    if (nick != null) {
      socket.emit('hello', { name: nick })
    }
  }
  else if(e.layerX > 20 && e.layerX < 20+150 && e.layerY > 430 && e.layerY < 430+50) {
    console.log("wait")
  }
}
