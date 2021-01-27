/*global document, addEventListener*/
/*eslint no-undef: "error"*/

function StartGame(playersNick) {
  console.log(nickname)
  const canvas = document.getElementById("canvas")
  const ctx = canvas.getContext("2d");

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

  function HotLog(txt) {
    document.getElementById("hotLog").innerHTML = txt;
  }

  function lerp(v1, v2, w) {
      return v1 + w * (v2 - v1);
  }

  // 15x12 // 24*40x22,5
  canvas.width = 960;// 960 800
  canvas.height = 540;//540 600


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
  var lps = 1000/15; // how call it right?

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
      this.activePlayer++
      if (this.activePlayer >= players.length) this.activePlayer = 0
      this.player.units.forEach((u) => {
        u.avalibleMoves = UNITS[u.type].moves
      })
    }
  }

  var players = [
    {
      name: playersNick[0],
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
        mouse: {x:0, y:0, hold: null, cell:{x:0, y:0}, polar:{angular: 0, distance: 0}}
      },
      settings: {
        tileSize: 24, // size to fullHD = 48
        tileSizeTarget: 24,
        tileScaleTimeExp: 0,
        scaleSpeed: 125, // sec to point
        showGridInfo: null
      },
      mouseCalcCell() {
        this.control.mouse.cell.x = Math.floor(((this.control.camera.x-canvas.width/2) + this.control.mouse.x) / this.settings.tileSize)
        this.control.mouse.cell.y = Math.floor(((this.control.camera.y-canvas.height/2) + this.control.mouse.y) / this.settings.tileSize)        
      },
      mouseCalcPolar() {
        let dx = - this.control.mouse.x + canvas.width/2 //this.control.camera.x
        let dy = this.control.mouse.y - canvas.height/2 //- this.control.camera.y
        let theta  = Math.atan2(dy, dx) + Math.PI
        
        this.control.mouse.polar.angular = theta;
        this.control.mouse.polar.distance = Math.sqrt(dx*dx + dy*dy)
      }
    },
    {
      name: playersNick[1],
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
        mouse: {x:0, y:0, hold: null, cell:{x:0, y:0}, polar:{angular: 0, distance: 0}}
      },
      settings: {
        tileSize: 24, // size to fullHD = 48
        tileSizeTarget: 24,
        tileScaleTimeExp: 0,
        scaleSpeed: 125, // sec to point
        showGridInfo: null
      },
      mouseCalcCell() {
        this.control.mouse.cell.x = Math.floor(((this.control.camera.x-canvas.width/2) + this.control.mouse.x) / this.settings.tileSize)
        this.control.mouse.cell.y = Math.floor(((this.control.camera.y-canvas.height/2) + this.control.mouse.y) / this.settings.tileSize)        
      },
      mouseCalcPolar() {
        let dx = - this.control.mouse.x + canvas.width/2 //this.control.camera.x
        let dy = this.control.mouse.y - canvas.height/2 //- this.control.camera.y
        let theta  = Math.atan2(dy, dx) + Math.PI
        
        this.control.mouse.polar.angular = theta;
        this.control.mouse.polar.distance = Math.sqrt(dx*dx + dy*dy)
      }
    }
  ]

  var SETTINGS = {
    tileMinSize: 48/4, // size to fullHD = 24
    tileMaxSize: 54, // size to fullHD = 108
    tileDefaultSize: 24, // fullHD x2
  }


  var lastTimeLogic = Date.now();
  setInterval(function() {
    let timePass = Date.now() - lastTimeLogic;
    
    if (timePass < lps) {
        return;
    } else if (timePass > 4 * lps) { // hard mistiming
      lastTimeLogic = Date.now();
        timePass = 4 * lps;
    }

    
    lastTimeLogic += timePass; // state logic computation completed at START of function
  }, 10);

  var lastTimeGraphic = Date.now();
  setInterval(function() {
    let timePass = Date.now() - lastTimeGraphic; // guess will better change "nextTimeRender > Date.now()"
    if (timePass < fps) {
        return;
    }

    if (game.settings.tileScaleTimeExp > 0) {
      if (game.settings.tileScaleTimeExp > game.settings.scaleSpeed/10) {
        game.settings.tileScaleTimeExp -= timePass
        if (game.settings.tileScaleTimeExp < 0) game.settings.tileScaleTimeExp = 0
        game.control.camera.x -= game.control.mouse.cell.x *lerp(0, game.settings.tileSize - game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
        game.control.camera.y -= game.control.mouse.cell.y *lerp(0, game.settings.tileSize - game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
        // not good centring on a cam, need to upgrade
        game.settings.tileSize = lerp(game.settings.tileSize, game.settings.tileSizeTarget, 1 - game.settings.tileScaleTimeExp/2/game.settings.scaleSpeed)
      } else {
        game.settings.tileSize = game.settings.tileSizeTarget
        game.settings.tileScaleTimeExp = 0
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "11px bold Lucida Console"; // need to remove bold
    for (let i = Math.floor((game.control.camera.y - canvas.height/2)/game.settings.tileSize); i < (game.control.camera.y + canvas.height/2)/game.settings.tileSize; i++) {
      for (let j = Math.floor((game.control.camera.x - canvas.width/2)/game.settings.tileSize); j < (game.control.camera.x + canvas.width/2)/game.settings.tileSize; j++) {
        if (i < 0 || i >= map.tiles.length || j < 0 || j >= map.tiles[i].length) {continue;}
        ctx.fillStyle = TILES[map.tiles[i][j]].color
        ctx.fillRect(canvas.width/2 -game.control.camera.x + j * game.settings.tileSize, canvas.height/2 -game.control.camera.y + i * game.settings.tileSize, game.settings.tileSize, game.settings.tileSize);

        if (game.settings.showGridInfo == 'num') {
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
          if (j == 0) {
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
        'Player: "' + game.player.name +'", zoom:' + (game.settings.tileSize/ SETTINGS.tileDefaultSize * 100).toFixed(2) + '%, et:' + game.settings.tileScaleTimeExp + ', tts:' + game.settings.tileSizeTarget + '\n' +
        'Cam [' + game.control.camera.x.toFixed(2) + ', ' + game.control.camera.y.toFixed(2) + '], Face ' + (180 / Math.PI * 0).toFixed(2) + '°\n' +
        'Mouse [' + game.control.mouse.x + ',' + game.control.mouse.y + '], cell[' + game.control.mouse.cell.x + ', ' + game.control.mouse.cell.y + '], polar[' + (180 / Math.PI * game.control.mouse.polar.angular).toFixed(3) + '°,' + game.control.mouse.polar.distance.toFixed(2) + ']');
    
    lastTimeGraphic += timePass; // finished drawing data at the start of the function
  }, 10);

  /// --- EVENTS ---

  document.addEventListener('mousemove', onMouseUpdate, false);
  document.addEventListener('mouseenter', onMouseUpdate, false);

  function onMouseUpdate(e) {
    // if (e.toElement != canvas) return;
    
    game.control.mouse.x = e.x - canvas.offsetLeft;
    game.control.mouse.y = e.y - canvas.offsetTop;
    
    game.player.mouseCalcCell()
    game.player.mouseCalcPolar()

    if (game.control.mouse.hold != null) {
      game.control.camera.x = game.control.mouse.hold.x - game.control.mouse.x
      game.control.camera.y = game.control.mouse.hold.y - game.control.mouse.y
    }
  }

  function moverSet(e) {
    // if (e.ctrlKey || e.altKey) return
    if ('type' in e && e['type'] == 'keydown') { console.log("key pressed '"+e.key+"'") }
    switch (e.key) {
      case ' ':
        game.settings.showGridInfo = game.settings.showGridInfo==null?'num': game.settings.showGridInfo=='num'?'type':null;
        break
      case '-':
        if (game.settings.tileSizeTarget > SETTINGS.tileMinSize) {
          game.settings.tileSizeTarget -= 2
          game.settings.tileScaleTimeExp = 250
        }
        break
      case '=': case '+':
        if (game.settings.tileSizeTarget < SETTINGS.tileMaxSize) {
          game.settings.tileSizeTarget += 2
          game.settings.tileScaleTimeExp = 250
        }
        break
      case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9': case '0':
        if (e.code.startsWith("Numpad")) {
          if (e.key % 5 != 0) {
            console.log('%%',game.player.name,nickname)
            if (game.player.activeUnit.avalibleMoves == 0 || nickname != game.player.name) { return }
            socket.emit('playerAction', { player: game.player.name, unit: game.player.control.selectedUint, action: 'move', direction: e.key })
            if (e.key % 3 == 1) { game.player.activeUnit.x-=1 }
            else if (e.key % 3 == 0) { game.player.activeUnit.x+=1 }
            if (e.key < 4) { game.player.activeUnit.y+=1 }
            else if (e.key > 6) { game.player.activeUnit.y-=1 }

            game.player.activeUnit.avalibleMoves -= 1          
            if (game.player.activeUnit.avalibleMoves == 0) { game.player.selectNextUnit() }
          }
        }
        else {
          map.tiles[game.control.mouse.cell.y][game.control.mouse.cell.x] = e.key
        }
        break
      case 'e':
        socket.emit('endTurn')
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
    game.control.mouse.hold = {x: e.layerX + game.control.camera.x , y: e.layerY + game.control.camera.y }
  }
  document.body.onmouseup = function(/*e*/) {
    game.control.mouse.hold = null

    // centring camera on a cell
    game.control.camera.x = (Math.floor(game.control.camera.x / game.settings.tileSize) + 0.5) * game.settings.tileSize
    game.control.camera.y = (Math.floor(game.control.camera.y / game.settings.tileSize) + 0.5) * game.settings.tileSize
  }

  canvas.onmousewheel = function(e) {
    moverSet({key: e.wheelDelta>0?'=':'-'})
  }

  socket.on('nextPlayer', (changes) => {
    game.endTurn()
    console.log(`now ${game.player.name} turn`)
  })

  socket.on('playerAction', (action) => {
    console.log(`!!! player: ${action.player}, unit: ${action.unit}, action: ${action.action}, direction: ${action.direction}`)
    for (let p in players) {
      if (players[p].name != action.player) continue
      if (action.action != 'move') continue
      if (action.direction % 3 == 1) { players[p].units[action.unit].x-=1 }
      else if (action.direction % 3 == 0) { players[p].units[action.unit].x+=1 }
      if (action.direction < 4) { players[p].units[action.unit].y+=1 }
      else if (action.direction > 6) { players[p].units[action.unit].y-=1 }
      
      break
    }
  })
}
