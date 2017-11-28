const StartMenu = require('./start_menu.js');
const Player = require('./player.js');
const Path = require('./path.js');
const EndMenu = require('./end_menu.js');
const Ground = require('./ground.js');
const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

const _easyMode = {
  oneSlide: 5,
  twoSlides: 7.143,
  yIncrement: 8,
  computerLevel: 1,
  obstacleTypes: 2,
};

const _hardMode = {
  oneSlide: 8.333,
  twoSlides: 12.5,
  yIncrement: 16,
  computerLevel: 2,
  obstacleTypes: 3,
};

const modes = [_easyMode, _hardMode];


class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");

    this.drawGame = this.drawGame.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.clearGame = this.clearGame.bind(this);
    this.reset = this.reset.bind(this);

    this.reset();

    this.addListeners();
  }

  reset() {
    window.clearInterval(this.interval);
    this.difficulty = 1;
    this.humanPlayerCount = 1;
    this.running = false;
    this.paused = false;

    this.startMenu = new StartMenu(this.ctx);
    this.timer = new Timer();
    this.players = [];
    this.winner = null;
  }

  drawTime() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 175, 210);
  }

  playerOne() {
    return this.players[0];
  }

  playerTwo() {
    return this.players[1];
  }

  startGame() {
    this.pathPattern = Path.generateRandomPath(30, modes[this.startMenu.level].obstacleTypes);

    for (let i = 1; i <= this.humanPlayerCount; i++) {
      this.players.push(new Player(i, this.ctx, new Ground(i, this.ctx, new Path(this.pathPattern)), modes[this.startMenu.level]));
    }

    if (this.players.length < 2) {
      this.players.push(new Player(2, this.ctx, new Ground(2, this.ctx, new Path(this.pathPattern)), modes[this.startMenu.level], false));
    }

    this.startMenu.clearStartMenu();
    this.running = true;
    this.interval = window.setInterval(this.drawGame, 50);
    this.timer.start({precision: 'secondTenths'});
  }

  drawGame() {
    this.clearGame();
    this.players.forEach((player) => {
      player.ground.drawGround();
      player.drawPlayer();
    });

    if (this.playerOne().finished || this.playerTwo().finished) {
      this.playerTwo().stopAI();
      this.running = false;
      this.timer.pause();
      if (this.playerOne().finished && this.playerTwo().finished) {
        this.winner = this.playerOne().timer.getTimeValues() < this.playerTwo().getTimeValues() ? this.PlayerOne() : this.playerTwo();
      }
      else {
        this.winner = this.playerOne().finished ? this.playerOne() : this.playerTwo();
      }
      this.endMenu = new EndMenu(this.ctx, this.winner, this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']));
      this.endMenu.drawEndMenu();
    } else {
      this.drawTime();
    }
  }

  togglePause() {
    if (this.paused === false) {
      window.clearInterval(this.interval);
        this.timer.pause();
    } else {
      this.interval = window.setInterval(this.drawGame, 50);
        this.timer.start();
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
    if (!this.running && !this.winner) {
      switch (e.keyCode) {
        case 20:
        e.preventDefault();
        return;
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
    } else if (this.running && !this.paused) {
      switch (e.keyCode) {
        case 20:
        e.preventDefault();
        return;
        case 81: // q
        this.running = false;
        this.endGame();
        return;
        case 32: // spacebar
        this.togglePause();
        return;
        case 97:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(1);
        }
        return;
        case 115:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(2);
        }
        return;
        case 107:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(1);
        }
        return;
        case 108:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(2);
        }
        return;
        default:
        return;
      }
    } else if (this.running && this.paused) {
      switch (e.keyCode) {
        case 32: // spacebar
        this.togglePause();
        return;
        }
      } else {
        switch (e.keyCode) {
          case 114:
          // restart game;
          this.reset();
          return;
      }
    }
  }
}

module.exports = Game;
