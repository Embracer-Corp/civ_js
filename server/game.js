const GAMES_STATES = {
  room: 0,
  works: 1,
  pause: 2,
};

const TILES = {
  0: { name: "Ocean", color: "#404F7A" },
  1: { name: "Grassland", color: "#4D8F43", img: "grass.png" },
  2: { name: "River", color: "#24BED6" },
  3: { name: "Hills", color: "#76A86C" },
  4: { name: "Forest", color: "#2A5E24" },
  5: { name: "Plain", color: "#9DC431" },
  6: { name: "Mountain", color: "#464752" },
  7: { name: "Jungle", color: "#28704A" },
  8: { name: "Swamp", color: "#3C8F76" },
  9: { name: "Desert", color: "#C7C063" },
  //"Arctic"
  //"Tundra"
};

const MAP_TEMPLATE = [
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 8, 4, 4, 0, 0, 0, 0, 1, 1, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 5, 5, 1, 7, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 1, 5, 5, 6, 1, 1, 5, 1, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3,
    3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 1, 5, 1, 3, 5, 1, 7, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1,
    1, 1, 1, 1, 1, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 1, 5, 1, 3, 3, 9, 1, 1, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1,
    1, 1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 5, 1, 4, 1, 9, 1, 4, 4, 1, 5, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 4, 1,
    1, 1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 5, 1, 1, 8, 8, 6, 0, 1, 1, 5, 0, 1, 1, 5, 5, 0, 0, 0, 0, 0, 0, 4,
    1, 1, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 3, 5, 5, 6, 0, 0, 0, 6, 1, 1, 5, 1, 1, 7, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 1, 5, 9, 7, 5, 1, 1, 1, 8, 0, 3, 1, 5, 1, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 6, 9, 1, 1, 1, 3, 1, 5, 5, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 1, 3, 1, 1, 3, 7, 1, 1, 1, 3, 1, 5, 4, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 7, 3, 1, 5, 0, 7, 4, 6, 1, 4, 4, 0, 8, 1, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 7, 1, 5, 1, 0, 0, 7, 6, 6, 8, 0, 0, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 4, 1, 1, 1, 0, 4, 1, 1, 0, 0, 0, 0, 5, 1, 1, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 4, 1, 6, 5, 9, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 1, 5, 6, 1, 1, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 1, 5, 3, 3, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 6, 1, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 9, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
  [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ],
];

const UNITS = {
  1: { name: "settler", attack: 0, defense: 1, moves: 1 },
  2: { name: "militia", attack: 1, defense: 1, moves: 1 },
  3: { name: "phalanx", attack: 1, defense: 2, moves: 1 },
  4: { name: "cavalry", attack: 2, defense: 1, moves: 2 },
};

class Game {
  constructor(config, clients) {
    console.log(`(Game constructor) config: ${config}, clients ${clients}`);

    this.config = config;
    this.state = GAMES_STATES.room;

    let i = 0;

    this.players = [];
    for (let key in clients) {
      this.players.push({
        id: 1000 + i,
        // socket: clients[key].socket,
        name: clients[key].name,
        color: config.colors[0],
        units: [
          {
            id: 100 * i + 1,
            type: 2,
            x: 6,
            y: 7 + 3 * i,
            avalibleMoves: 0,
            custody: 0,
          },
          {
            id: 100 * i + 2,
            type: 4,
            x: 9,
            y: 8 + 3 * i,
            avalibleMoves: 0,
            custody: null,
          },
        ],
        // city: {
        //   0: {x:6,y:8, population:2}
        // }
      });
      i++;
    }

    // this.players;

    this.activePlayer = 0;

    this.map = MAP_TEMPLATE;

    // this.lps = config.lpc //1000/15;
    // this.lastTimeLogic = 0 //Date.now()
  }

  start() {
    console.log(`(start)`);

    this.state = GAMES_STATES.works;

    this.startPlayerTurn();

    // setInterval(this.logic, 10);
  }

  // logic() {
  //   let timePass = Date.now() - this.lastTimeLogic;

  //   if (timePass < lps) {
  //       return;
  //   } else if (timePass > 4 * lps) { // hard mistiming
  //     timePass = 4 * lps;
  //   }

  //   this.lastTimeLogic += timePass; // state logic computation completed at START of function
  // }

  get player() {
    return this.players[this.activePlayer];
  }

  moveUnit(unitId, direction) {
    console.log(`(moveUnit) unitId: ${unitId}, direction: ${direction}`);

    var units = this.player.units;
    for (let i = 0; i < units.length; i++) {
      if (units[i].id === unitId) {
        if (units[i].avalibleMoves <= 0) {
          console.log(
            `ERROR: Not enought move points for unit with ID: ${unitId}`
          );
          return;
        }

        if (direction % 3 == 1) {
          this.player.units[i].x -= 1;
        } else if (direction % 3 == 0) {
          this.player.units[i].x += 1;
        }
        if (direction < 4) {
          this.player.units[i].y += 1;
        } else if (direction > 6) {
          this.player.units[i].y -= 1;
        }

        units[i].avalibleMoves -= 1;

        // NOTIFY move done
        return true;
      }
    }
    console.log(`ERROR: There's no unit with ID: ${unitId}.`);
  }

  endPlayerTurn() {
    console.log(`(endPlayerTurn)`);

    this.activePlayer++;
    if (this.activePlayer >= this.players.length) this.activePlayer = 0;

    this.startPlayerTurn();

    // NOTIFY active player
    return this.player.id;
  }

  startPlayerTurn() {
    console.log(`(startPlayerTurn)`);

    // Refesh current player moves
    this.player.units.forEach((u) => {
      u.avalibleMoves = UNITS[u.type].moves;
    });
  }
}

module.exports = { GAMES_STATES, TILES, UNITS, Game };
