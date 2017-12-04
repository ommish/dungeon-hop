const StartMenu = require('./start_menu.js');
const Player = require('./player.js');
const Path = require('./path.js');
const Ground = require('./ground.js');
const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');
const Scoreboard = require('./scoreboard.js');

const _easyMode = {
  oneSlide: 81 / 10,
  twoSlides: 162 / 14,
  yIncrement: 16,
  obstacleTypes: 2,
  randomness: 0.7,
  jumpInterval: 300,
};

const _hardMode = {
  oneSlide: 81 / 8,
  twoSlides: 162 / 10,
  yIncrement: 24,
  obstacleTypes: 3,
  randomness: 0.8,
  jumpInterval: 600,
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
    this.scoreboard = null;
    this.players = [];
    this.winner = null;
  }

  drawTimeAndRules() {
    this.ctx.font = "40px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 250, 315);

    this.ctx.font = "20px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText('\\ to restart', 10, 210);
    this.ctx.fillText('space to pause', 10, 320);
  }

  playerOne() {
    return this.players[0];
  }

  playerTwo() {
    return this.players[1];
  }

  startGame() {
    this.pathPattern = Path.generateRandomPath(30, modes[this.startMenu.level].obstacleTypes);

    for (let i = 1; i < 3; i++) {
      let human;
      if (i === 1 || this.humanPlayerCount > 1) {
        human = true;
      } else {
        human = false;
      }
      this.players.push(new Player(i, this.ctx, new Ground(i, this.ctx, new Path(this.pathPattern)), modes[this.startMenu.level], human));
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

    if (this.scoreboard) {this.scoreboard.drawScoreboard();}

    if (this.running) {this.drawTimeAndRules();}

    if ((this.playerOne().finishTime || this.playerTwo().finishTime) && this.running) {
      this.stopGame();
      this.setWinner();
      this.removeListeners();
      this.setScoreboard();
    }
  }

  togglePause() {
    if (!this.paused) {
      window.clearInterval(this.interval);
        this.timer.pause();
    } else {
      this.interval = window.setInterval(this.drawGame, 50);
        this.timer.start();
    }
    this.paused = !this.paused;
  }

  clearGame() {
    this.ctx.clearRect(0, 0, 500, 600);
  }

  stopGame() {
    this.playerTwo().stopAI();
    this.running = false;
    this.timer.pause();
  }

  setWinner() {
    if (this.playerOne().finishTime && this.playerTwo().finishTime) {
      this.winner = this.playerOne().finishTime < this.playerTwo().finishTime ? this.PlayerOne() : this.playerTwo();
    }
    else {
      this.winner = this.playerOne().finishTime ? this.playerOne() : this.playerTwo();
    }
  }

  setScoreboard() {
    const finishTime = this.timer.getTimeValues();
    const date = this.winner.finishTime;
    this.scoreboard = new Scoreboard(this.ctx, this.winner, finishTime, date);
  }

  addListeners() {
    this.keypressListener = document.addEventListener("keypress", this.handleKeyPress);
    this.keydownListener = document.addEventListener("keydown", this.handleKeyDown);
  }

  removeListeners() {
    document.removeEventListener("keypress", this.keypressListener);
    document.removeEventListener("keydown", this.keydownListener);
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
    // at start menu
    if (!this.running && !this.winner) {
      switch (e.keyCode) {
        // prevent caps lock
        case 20:
        e.preventDefault();
        return;
        // 49-50 choose one or two player mode
        case 49:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.humanPlayerCount = this.humanPlayerCount;
        return;
        case 50:
        this.humanPlayerCount = parseInt(e.key);
        this.startMenu.humanPlayerCount = this.humanPlayerCount;
        return;
        // space to start
        case 32:
        e.preventDefault();
        this.startGame();
        return;
        default:
        return;
      }
      // while game is running, unpaused
    } else if (this.running && !this.paused) {
      switch (e.keyCode) {
        // \ to restart
        case 92:
        this.reset();
        return;
        // \not sure! ...
        case 20:
        e.preventDefault();
        return;
        // space to toggle pause
        case 32:
        e.preventDefault();
        this.togglePause();
        return;
        // a for P1to jump 1
        case 97:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(1);
        }
        return;
        // s for P1 to jump 2
        case 115:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(2);
        }
        return;
        // k for P2 to jump 1
        case 107:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(1);
        }
        return;
        // l for P2 to jump 2
        case 108:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(2);
        }
        return;
        default:
        return;
      }
      // while game is running, paused
    } else if (this.running && this.paused) {
      switch (e.keyCode) {
        // space to toggle pause
        case 32:
        e.preventDefault();
        this.togglePause();
        return;
        // \ to restart
        case 92:
        this.reset();
        return;
      }
      // after game is over
    } else {
      switch (e.keyCode) {
        // \ to restart
        case 92:
        this.reset();
        return;
      }
    }
  }
}

module.exports = Game;
