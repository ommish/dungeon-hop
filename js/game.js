const StartMenu = require('./start_menu.js');
const Player = require('./player.js');
const Path = require('./path.js');
const EndMenu = require('./end_menu.js');
const Ground = require('./ground.js');

const _easyMode = {
  oneForwardSlide: 5,
  twoForwardSlides: 7.143,
  yIncrement: 8,
  computerLevel: 1,
};

const _hardMode = {
  oneForwardSlide: 8.333,
  twoForwardSlides: 12.5,
  yIncrement: 16,
  computerLevel: 2,
};

const modes = [_easyMode, _hardMode];


class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");

    this.ctx.font = '20px Julius Sans One';
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    this.difficulty = 1;
    this.humanPlayerCount = 1;
    this.running = false;
    this.paused = false;

    this.startMenu = new StartMenu(this.ctx);
    this.players = [];

    this.drawGame = this.drawGame.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearGame = this.clearGame.bind(this);

    this.addListeners();
  }

  playerOne() {
    return this.players[0];
  }

  playerTwo() {
    return this.players[1];
  }

  startGame() {
    this.pathPattern = Path.generateRandomPath(30);

    for (let i = 1; i <= this.humanPlayerCount; i++) {
      this.players.push(new Player(i, this.ctx, new Ground(i, this.ctx, new Path(this.pathPattern)), modes[this.startMenu.level]));
    }

    if (this.players.length < 2) {
      this.players.push(new Player(2, this.ctx, new Ground(2, this.ctx, new Path(this.pathPattern)), modes[this.startMenu.level], false));
    }

    this.startMenu.clearStartMenu();
    this.running = true;
    this.interval = window.setInterval(this.drawGame, 50);
  }

  drawGame() {
    if (this.running === false) {
      window.clearInterval(this.interval);
      this.clearGame();
    }

    else if (this.playerOne().finished || this.playerTwo().finished) {
      let winner;
      if (this.playerOne().finished && this.playerTwo().finished) {
        winner = this.playerOne().timer.getTimeValues() < this.playerTwo().getTimeValues() ? this.PlayerOne() : this.playerTwo();
      }
      else {
        winner = this.playerOne().finished ? this.playerOne() : this.playerTwo();
      }
      window.clearInterval(this.interval);
      const endMenu = new EndMenu(this.ctx, winner);
      window.setTimeout(endMenu.drawEndMenu, 3000);
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
    this.ctx.clearRect(0, 0, 350, 400);
  }

  addListeners() {
    document.addEventListener("keypress", this.handleKeyPress);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 37:
      this.startMenu.level = 0;
      return;
      case 39:
      this.startMenu.level = 1;
      return;
    }
  }

  handleKeyPress(e) {
    if (this.running === false) {
      switch (e.keyCode) {
        case 49:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.humanPlayerCount = this.humanPlayerCount;
        return;
        case 50:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.humanPlayerCount = this.humanPlayerCount;
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
        if (!this.playerOne().finished) {
          this.playerOne().jump(1);
        }
        return;
        case 115:
        if (!this.playerOne().finished) {
          this.playerOne().jump(2);
        }
        return;
        case 107:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().jump(1);
        }
        return;
        case 108:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().jump(2);
        }
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
