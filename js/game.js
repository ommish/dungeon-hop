const StartMenu = require('./start_menu.js');
const HumanPlayer = require('./player.js');
const Path = require('./path.js');
const EndMenu = require('./end_menu.js');
const Ground = require('./ground.js');

class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.difficulty = 1;
    this.humanPlayerCount = 1;
    this.running = false;
    this.paused = false;

    this.startMenu = new StartMenu(this.ctx);
    this.endMenu = new EndMenu(this.ctx);
    this.players = [];

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
    this.path = new Path(30);

    for (let i = 1; i <= this.humanPlayerCount; i++) {
      this.players.push(new HumanPlayer(i, this.ctx, new Ground(i, this.ctx, this.path)));
    }

    this.startMenu.clearStartMenu();
    this.running = true;
    this.interval = window.setInterval(this.drawGame, 50);
  }

  drawGame() {
    if (this.running === false) {
      window.clearInterval(this.interval);
      this.clearGame();
    } else {
      this.clearGame();
      this.players.forEach((player) => {
        player.ground.drawGround();
        player.drawPlayer();
        player.drawTime();
      }
    );}
  }

  togglePause() {
    if (this.paused === false) {
      window.clearInterval(this.interval);
      this.players.forEach((player) => {
        player.timer.pause();
      });
    } else {
      this.interval = window.setInterval(this.drawGame, 50);
      this.players.forEach((player) => {
        player.timer.start();
      });
    }
    this.paused = !this.paused;
  }

  clearGame() {
    this.ctx.clearRect(0, 0, 350, 600);
  }

  endGame() {
    this.endMenu.start();
  }

  addListeners() {
    document.addEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e) {
    if (this.running === false) {
      switch (e.keyCode) {
        case 49:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.updateHumanPlayerCount(this.humanPlayerCount);
        return;
        case 50:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.updateHumanPlayerCount(this.humanPlayerCount);
        return;
        case 32:
        this.startGame();
        return;
        default:
        return;
      }
    } else if (this.running === true && this.paused === false) {
      switch (e.keyCode) {
        case 81: // q
        this.running = false;
        this.endGame();
        return;
        case 32: // spacebar
        this.togglePause();
        return;
        case 97:
        this.playerOne().jump(1);
        return;
        case 115:
        this.playerOne().jump(2);
        return;
        default:
        return;
      }
    } else {
      switch (e.keyCode) {
        case 32: // spacebar
        this.togglePause();
        return;
      }
    }
  }

  // } else if (e.target === "") {
  //   // if a/s && player1 exists, player1.jump(a/s)
  // } else if (e.target === "") {
  //   // if k/l, && player2 exists, player2.jump(k/l)
  // }
}

module.exports = Game;
