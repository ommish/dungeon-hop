const StartMenu = require('./start_menu.js');
const HumanPlayer = require('./player.js');
const Path = require('./path.js');
const EndMenu = require('./end_menu.js');

class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.difficulty = 1;
    this.humanPlayerCount = 1;
    this.running = false;

    this.startMenu = new StartMenu(this.ctx);
    this.endMenu = new EndMenu(this.ctx);
    this.players = [];
    this.paths = [];

    this.drawGame = this.drawGame.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.endGame = this.endGame.bind(this);

    this.addListeners();
  }

  playerOne() {
    return this.players[0];
  }

  playerTwo() {
    return this.players[1];
  }

  startGame() {
    for (let i = 1; i > this.humanPlayerCount + 1; i++) {
      this.players.push(new HumanPlayer(i, this.ctx));
      this.paths.push(new Path(i));
    }
    this.startMenu.clearStartMenu();
    this.running = true;
    this.interval = window.setInterval(this.drawGame, 200);
  }

  drawGame() {
    // clear canvas
    if (this.running === false) {
      window.clearInterval(this.interval);
    }
    this.clearGame();
    this.players.forEach((player) => player.draw());
    // iterate over paths and draw paths
    // iterate over players and draw players
  }

  clearGame() {
    this.ctx.clearRect(0, 0, 900, 600);
  }

  endGame() {
    this.endMenu.start();
  }

  addListeners() {
    document.addEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (this.running === false) {
      if (e.keyCode === 49 || e.keyCode === 50) {
        this.startMenu.updateHumanPlayerCount(e.key);
      }
      else if (e.keyCode === 32) {
        this.startGame();
      }
    }
    else if (this.running === true) {
      if (e.keyCode === 81) {
        this.running = false;
        this.endGame();
      }
    }
  }

  // if (e.target === "") {
  //   // if space && running === false, start game
  // } else if (e.target === "") {
  //   // if P && running === true, pause game
  // } else if (e.target === "") {
  //   // if 1 or 2 && running === false, update num players
  //   // update start_menu;
  // } else if (e.target === "") {
  //   // if a/s && player1 exists, player1.jump(a/s)
  // } else if (e.target === "") {
  //   // if k/l, && player2 exists, player2.jump(k/l)
  // }
}

module.exports = Game;
