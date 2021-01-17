/*global document, addEventListener*/
/*eslint no-undef: "error"*/
const GAME_START_AT = new Date()

function HotLog(txt) {
  document.getElementById("hotLog").innerHTML = txt;
}

function getFormatedTime(shortMilisec = true, showZone = false)
{
  const tz = -Math.floor(GAME_START_AT.getTimezoneOffset()/60)
  const SECOND = 1000
  const MINUTE = 60* SECOND
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  
  let d = Date.now() + tz * HOUR
  d = d - Math.floor(d / DAY) * DAY
  let h = Math.floor(d / HOUR)
  d = d - h*HOUR
  let m = Math.floor(d / MINUTE)
  d = d - m*MINUTE
  let s = Math.floor(d / SECOND)
  d = d - s*SECOND

  showZone = showZone?(tz<0?"-":"+")+("00"+tz).slice(-2)+"z":""
  shortMilisec = "." + (shortMilisec?("00" + Math.floor(d/10)).slice(-2):("000" + d).slice(-3))
  return showZone+("00" + h).slice(-2)+":"+("00" + m).slice(-2)+":"+("00" + s).slice(-2)+shortMilisec
}
function LazyLog(txt, newLine = true, timeStamp = true) {
  let str = (newLine?"\r\n":"") + (timeStamp?"["+ getFormatedTime()+"]: ":"") + txt;
  document.getElementById("lazyLog").innerHTML += str;
  if(SETTINGS.autoScrollLazyLog) document.getElementById("lazyLog").scrollTo(0,document.getElementById("lazyLog").scrollHeight);
}
document.getElementById("lazyLog").addEventListener('scroll', function(/*e*/) {
  SETTINGS.autoScrollLazyLog = document.getElementById("lazyLog").scrollTop + document.getElementById("lazyLog").clientHeight == document.getElementById("lazyLog").scrollHeight
});

function lerp(v1, v2, w) {
    return v1 + w * (v2 - v1); // v1 * (1 - w) + v2 * w;
}

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d");
// 15x12 // 24*40x22,5
canvas.width = 960;// 960 800
canvas.height = 540;//540 600

const TILES = {
  0: { name: "Ocean", color: "#404F7A" },
  1: { name: "Grassland", color: "#4D8F43" },
  2: { name: "River", color: "#24BED6" },
  3: { name: "Hills", color: "#76A86C" } ,
  4: { name: "Forest", color: "#2A5E24" },
  5: { name: "Plain", color: "#9DC431" },
  6: { name: "Mountain", color: "#464752" },
  7: { name: "Jungle", color: "#28704A" },
  8: { name: "Swamp", color: "#3C8F76" },
  9: { name: "Desert", color: "#C7C063" },
  //"Arctic"
  //"Tundra"
}

var map = {
  tiles: [
    [0,1,2,3,4,5,6,7,8,9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,8,4,4,0,0,0,0,1,1,5,1,1,0,0,0,0,0,0,0,1,2,1,2,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,1,5,5,1,7,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,5,5,6,1,1,5,1,1,8,0,0,0,0,0,0,0,0,3,3,3,3,3,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,1,5,1,3,5,1,7,0,1,0,0,0,0,0,0,0,0,0,0,4,1,1,1,1,1,1,4,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,5,1,3,3,9,1,1,4,1,0,0,0,0,0,0,0,0,0,0,4,1,1,1,1,1,4,4,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,5,1,4,1,9,1,4,4,1,5,0,0,8,0,0,0,0,0,0,0,4,1,1,1,1,4,4,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,5,1,1,8,8,6,0,1,1,5,0,1,1,5,5,0,0,0,0,0,0,4,1,1,4,4,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,3,5,5,6,0,0,0,6,1,1,5,1,1,7,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,5,9,7,5,1,1,1,8,0,3,1,5,1,8,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,6,9,1,1,1,3,1,5,5,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,3,1,1,3,7,1,1,1,3,1,5,4,1,3,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,7,3,1,5,0,7,4,6,1,4,4,0,8,1,7,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,7,1,5,1,0,0,7,6,6,8,0,0,1,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,4,1,1,1,0,4,1,1,0,0,0,0,5,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,4,1,6,5,9,3,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,5,6,1,1,3,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,1,5,3,3,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,1,1,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,6,1,5,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,9,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
  ]
};

var fps = 1000/200;
var lps = 1000/15; // как правильно называть?

const UNITS = {
  1: {name: "settler", attack: 0, defense: 1, moves: 1 },
  2: {name: "militia", attack: 1, defense: 1, moves: 1 },
  3: {name: "phalanx", attack: 1, defense: 2, moves: 1 },
  4: {name: "cavalry", attack: 2, defense: 1, moves: 2 }
}

var game = {
  activePlayer: 0,
  get player() { return players[this.activePlayer] },
  get control() { return this.player.control },
  get settings() { return this.player.settings },
  endTurn() {
    this.activePlayer += 1
    if (this.activePlayer >= players.length) this.activePlayer = 0
    this.player.units.forEach((u) => {
      u.avalibleMoves = UNITS[u.type].moves
    })
  }
}

var players = [
  {
    name: "pl1",
    color: "#601E66",
    units: [
      { type: 2, x:6, y:7, avalibleMoves: 0, custody: 0 },
      { type: 4, x:9, y:8, avalibleMoves: 0, custody: null }
    ],
    get activeUnit() { return this.units[this.control.selectedUint] },
    selectNextUnit() {
      this.control.selectedUint += 1
      if (this.control.selectedUint >= this.units.length) { this.control.selectedUint = 0 }
    },
    city: {
      0: {x:6,y:8, population:2}
    },
    control: {
      selectedUint: 0,
      camera: {x:canvas.width/2, y:canvas.height/2},
      mouse: {x:0, y:0, hold: null, cell:{x:0, y:0}},
    },
    settings: {
      tileSize: 24, // size to fullHD = 48
      tileSizeTarget: 24,
      tileScaleTimeExp: 0,
      scaleSpeed: 125, // sec to point
      showGridInfo: null
    }
  },
  {
    name: "pl2",
    color: "#f01520",
    units: [
      { type: 2, x:10, y:12, avalibleMoves: 0, custody: null },
      { type: 4, x:8, y:13, avalibleMoves: 0, custody: null }
    ],
    get activeUnit() { return this.units[this.control.selectedUint] },
    selectNextUnit() {
      this.control.selectedUint += 1
      if (this.control.selectedUint >= this.units.length) { this.control.selectedUint = 0 }
    },
    city: {},
    control: {
      selectedUint: 0,
      camera: {x:canvas.width/2, y:canvas.height/2},
      mouse: {x:0, y:0, hold: null, cell:{x:0, y:0}},
    },
    settings: {
      tileSize: 24, // size to fullHD = 48
      tileSizeTarget: 24,
      tileScaleTimeExp: 0,
      scaleSpeed: 125, // sec to point
      showGridInfo: null
    }
  }
]

var SETTINGS = {
  tileMinSize: 48/4, // size to fullHD = 24
  tileMaxSize: 54, // size to fullHD = 108
  tileDefaultSize: 24, // fullHD x2
  autoScrollLazyLog: true
}


var lastTimeLogic = Date.now();
setInterval(function() {
  let timePass = Date.now() - lastTimeLogic;
  
  if (timePass < lps) {
      return;
  } else if (timePass > 4 * lps) // Жесткое отставание
  {
    lastTimeLogic = Date.now();
      timePass = 4 * lps;
  }

  
  lastTimeLogic += timePass; // завершен обсчет логики состояний на момент НАЧАЛА функции
}, 10);

document.addEventListener('mousemove', onMouseUpdate, false); // можно от канваса, но толку не много
document.addEventListener('mouseenter', onMouseUpdate, false);

// var firstDBG = true
function onMouseUpdate(e) {
  // if (e.toElement != canvas) return;
  
  game.control.mouse.x = e.x - canvas.offsetLeft;
  game.control.mouse.y = e.y - canvas.offsetTop;
  
  game.control.mouse.cell.x = Math.floor(((game.control.camera.x-canvas.width/2) + game.control.mouse.x) / game.settings.tileSize)
  game.control.mouse.cell.y = Math.floor(((game.control.camera.y-canvas.height/2) +game.control.mouse.y) / game.settings.tileSize)
  if (game.control.mouse.hold != null)
  {
    game.control.camera.x = game.control.mouse.hold.x - game.control.mouse.x
    game.control.camera.y = game.control.mouse.hold.y - game.control.mouse.y
  }
  // let dx = mouseX - hero.pos.x;
  // let dy = hero.pos.y - mouseY;
  // let tmp = Math.atan(dy / dx);
  // if (dx < 0) tmp -= Math.PI / 2;
  // else tmp += Math.PI / 2;
  // hero.faceAngle = tmp;
}

var lastTimeGraphic = Date.now();
setInterval(function() {
  let timePass = Date.now() - lastTimeGraphic; // я бы поменял на логику "nextTimeRender > Date.now()"
  if (timePass < fps) {
      return;
  }

  if (game.settings.tileScaleTimeExp > 0)
  {
    //game.control.camera.x += (settings.tileSize < settings.tileSizeTarget?1:-1) * (canvas.width/2/settings.tileSize)
    if (game.settings.tileScaleTimeExp > game.settings.scaleSpeed/10) 
    {
      game.settings.tileScaleTimeExp -= timePass
      if (game.settings.tileScaleTimeExp < 0) game.settings.tileScaleTimeExp = 0
      game.control.camera.x -= game.control.mouse.cell.x *lerp(0, game.settings.tileSize - game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
      game.control.camera.y -= game.control.mouse.cell.y *lerp(0, game.settings.tileSize - game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
      game.settings.tileSize = lerp(game.settings.tileSize, game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
      //settings.tileSize += (settings.tileSize < settings.tileSizeTarget?1:-1) * (settings.tileScaleTimeExp > 0 ? timePass / settings.scaleSpeed : (timePass - settings.tileScaleTimeExp) / settings.scaleSpeed)
    } else {
      game.settings.tileSize = game.settings.tileSizeTarget
      //if (settings.tileSize % 2 != 0) settings.tileSize -= 1;
      game.settings.tileScaleTimeExp = 0
    }
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "11px bold Lucida Console";
  for (let i = Math.floor((game.control.camera.y - canvas.height/2)/game.settings.tileSize); i < (game.control.camera.y + canvas.height/2)/game.settings.tileSize; i++) {
    for (let j = Math.floor((game.control.camera.x - canvas.width/2)/game.settings.tileSize); j < (game.control.camera.x + canvas.width/2)/game.settings.tileSize; j++) {
      //LazyLog("!!"+i+";"+j);
      if (i < 0 || i >= map.tiles.length || j < 0 || j >= map.tiles[i].length) {continue;}
      // if (map.tiles[i][j] == 1) ctx.fillStyle = "#356030";
      // else if (map.tiles[i][j] == 0) ctx.fillStyle = "#354560";
      ctx.fillStyle = TILES[map.tiles[i][j]].color
      ctx.fillRect(canvas.width/2 -game.control.camera.x + j * game.settings.tileSize, canvas.height/2 -game.control.camera.y + i * game.settings.tileSize, game.settings.tileSize, game.settings.tileSize);

      if (game.settings.showGridInfo == 'num')
      {
        ctx.fillStyle = "#00002090";
        ctx.fillText(
            ("000" + i).slice(-3),
            canvas.width/2 -game.control.camera.x + 4 + j * game.settings.tileSize,
            canvas.height/2 -game.control.camera.y + game.settings.tileSize*0.45 + i * game.settings.tileSize,
            game.settings.tileSize-2
        );
        ctx.fillStyle = "#90200090";
        ctx.fillText(
          ("000" + j).slice(-3),
          canvas.width/2 -game.control.camera.x + 6 + j * game.settings.tileSize,
          canvas.height/2 -game.control.camera.y + game.settings.tileSize*0.5 + i * game.settings.tileSize+10,
          game.settings.tileSize-2
        );
        ctx.fillStyle = "#00000050";
        if (j == 0)
        {
          ctx.fillRect(canvas.width/2 -game.control.camera.x + j * game.settings.tileSize, canvas.height/2 -game.control.camera.y + i * game.settings.tileSize, 2, 2);
        }
      }
    }
  }
  
  players.forEach((p) => {
    ctx.fillStyle = p.color
    p.units.forEach((u) => {
      ctx.fillRect(canvas.width/2 -game.control.camera.x + u.x * game.settings.tileSize, canvas.height/2 -game.control.camera.y + u.y * game.settings.tileSize, game.settings.tileSize, game.settings.tileSize);
    })
  })

  ctx.fillStyle = "#00000050"
  ctx.fillRect(-game.settings.tileSize/2 +canvas.width/2, -game.settings.tileSize/2 +canvas.height/2, game.settings.tileSize, game.settings.tileSize)
  ctx.fillRect(canvas.width/2 -game.control.camera.x + game.control.mouse.cell.x * game.settings.tileSize, canvas.height/2 -game.control.camera.y + game.control.mouse.cell.y * game.settings.tileSize, game.settings.tileSize, game.settings.tileSize)

  HotLog('Keys:\n' +
      // 'L:' + game.control.isGoLeft + ', R:' + game.control.isGoRight + ', U:' + game.control.isGoUp + ', D:' + game.control.isGoDown + '\n' +
      'Player: "' + game.player.name +'", zoom:' + (game.settings.tileSize/ SETTINGS.tileDefaultSize * 100).toFixed(2) + '%, et:' + game.settings.tileScaleTimeExp + ', tts:' + game.settings.tileSizeTarget + '\n' +
      'Cam [' + game.control.camera.x.toFixed(2) + ', ' + game.control.camera.y.toFixed(2) + '], Face ' + (180 / Math.PI * 0).toFixed(2) + '°\n' +
      'Mouse [' + game.control.mouse.x + ',' + game.control.mouse.y + '], cell[' + game.control.mouse.cell.x + ', ' + game.control.mouse.cell.y + ']');
  
  lastTimeGraphic += timePass; // закончили отрисовку данных на момент начала функции
}, 10);

function moverSet(e) {
  // if (firstDBG)
  // {
  //   firstDBG = false
  //   for (var key in e) {
  //     LazyLog(key + ": " + e[key])
  //   }
  // }
  // if (e.ctrlKey || e.altKey) return
  if ('type' in e && e['type'] == 'keydown') { LazyLog("key pressed '"+e.key+"'") }
  switch (e.key) {
    case ' ':
      game.settings.showGridInfo = game.settings.showGridInfo==null?'num': game.settings.showGridInfo=='num'?'type':null;
      // map.tiles.forEach((elem) => {
      //   LazyLog(elem.join());
      // })
      break
    case '-':
      //if (settings.tileSize > 48/4) { settings.tileSize -= 2 }
      if (game.settings.tileSizeTarget > SETTINGS.tileMinSize) {
        game.settings.tileSizeTarget -= 2
        game.settings.tileScaleTimeExp = 250
      }
      break
    case '=': case '+':
      //if (settings.tileSize < 54) { settings.tileSize += 2 }
      if (game.settings.tileSizeTarget < SETTINGS.tileMaxSize) {
        game.settings.tileSizeTarget += 2
        game.settings.tileScaleTimeExp = 250
      }
      break
    case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '0':
      if (e.code.startsWith("Numpad")) {
        if (e.key % 5 != 0) {
          if (game.player.activeUnit.avalibleMoves == 0) { return }
          if (e.key % 3 == 1) { game.player.activeUnit.x-=1}
          else if (e.key % 3 == 0) { game.player.activeUnit.x+=1}
          if (e.key < 4) { game.player.activeUnit.y+=1}
          else if (e.key > 6) { game.player.activeUnit.y-=1}

          game.player.activeUnit.avalibleMoves -= 1          
          if (game.player.activeUnit.avalibleMoves == 0) { game.player.selectNextUnit() }
        }
      }
      else {
        map.tiles[game.control.mouse.cell.y][game.control.mouse.cell.x] = e.key
      }
      break
    case 'e':
      game.endTurn()
      break
  }
}

function moverReset(/*e*/) {
  // switch (e.key) {
  //   case 'a':
  //     game.control.isGoLeft = false;
  //     break;
  //   case 'd':
  //     game.control.isGoRight = false;
  //     break;
  //   case 'w':
  //     game.control.isGoUp = false;
  //     break;
  //   case 's':
  //     game.control.isGoDown = false;
  //     break;
  // }
}

addEventListener("keydown", moverSet);
addEventListener("keyup", moverReset);

canvas.onmousedown = function(e) {
  /*if (!e.which && e.button) { // если which нет, но есть button... (IE8-)
  if (e.button & 1) e.which = 1; // левая кнопка
  else if (e.button & 4) e.which = 2; // средняя кнопка
  else if (e.button & 2) e.which = 3; // правая кнопка
  }*/
  game.control.mouse.hold = {x: e.pageX + game.control.camera.x , y: e.pageY + game.control.camera.y }
  //alert( e.which + ' (' + e.clientX + ','+ e.clientY +')' );
  //if(hero.fireCooldown <= 0) hero.isFire = true;
  // рисуем мышь
}
document.body.onmouseup = function(/*e*/) {
  game.control.mouse.hold = null
}

canvas.onmousewheel = function(e) {
  moverSet({key: e.wheelDelta>0?'=':'-'})
}

// Need:
// • uncrawl only if normal heigth is posible. else uncrawl asap
// • how to improve jump in right cave? try to rejump after getting more space? but dont forget about middle down pit -> u need to continue jump when it possible 