const StartMenu = require('./start_menu.js');
const HumanPlayer = require('./player.js');
const Path = require('./path.js');

class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.difficulty = 1;
    this.humanPlayerCount = 1;
    this.running = false;

    this.startMenu = new StartMenu(this.ctx);
    this.players = [];
    this.paths = [];

    this.draw = this.draw.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.addListeners();
  }

  playerOne() {
    return this.players[0];
  }

  playerTwo() {
    return this.players[1];
  }

  start() {
    for (let i = 1; i > this.humanPlayerCount + 1; i++) {
      this.players.push(new HumanPlayer(i));
      this.paths.push(new Path(i));
    }
    window.setInterval(this.draw, 200);
  }

  draw() {
    // clear canvas
    this.clear();
    this.players.forEach((player) => player.draw());
    // iterate over paths and draw paths
    // iterate over players and draw players
  }

  clear() {
    this.ctx.clearRect(0, 0, 900, 600);
  }

  addListeners() {
    this.canvas.addEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e) {

    if (e.target === "") {
      // if space && running === false, start game
    } else if (e.target === "") {
      // if P && running === true, pause game
    } else if (e.target === "") {
      // if 1 or 2 && running === false, update num players
      // update start_menu;
    } else if (e.target === "") {
      // if a/s && player1 exists, player1.jump(a/s)
    } else if (e.target === "") {
      // if k/l, && player2 exists, player2.jump(k/l)
    }
  }

}

module.exports = Game;
