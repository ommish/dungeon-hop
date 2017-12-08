const StartMenu = require('./start_menu.js');
const Player = require('./player.js');
const Path = require('./path.js');
const Ground = require('./ground.js');
const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');
const Scoreboard = require('./scoreboard.js');

class Game {

  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");

    this.drawGame = this.drawGame.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.clearGameCanvas = this.clearGameCanvas.bind(this);
    this.reset = this.reset.bind(this);

    this.reset();
  }

  reset() {
    this.removeListeners();
    window.clearInterval(this.interval);
    this.running = false;
    this.paused = false;
    this.scoreboard = null;
    this.winner = null;
    this.players = [];
    this.timer = new Timer();
  }

  startGame() {
    this.pathPattern = Path.generateRandomPath();
    this.createPlayers();

    this.running = true;
    this.interval = window.setInterval(this.drawGame, 50);
    this.timer.start({precision: 'secondTenths'});
  }

  createPlayers() {
    const itemIndex = Math.floor(Math.random() * 20) + 10;
    for (let i = 1; i < 3; i++) {
      this.players.push(
        new Player(
          i,
          this.ctx,
          new Ground(i, this.ctx, new Path(this.pathPattern, itemIndex, this.settings.obstacleTypes, this.settings.items)),
          this.settings,
          i === 1 || this.settings.playerCount > 1 ? true : false
        )
      );
    }
  }

  playerOne() {
    return this.players[0];
  }
  playerTwo() {
    return this.players[1];
  }

  drawGame() {
    this.clearGameCanvas();

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

  clearGameCanvas() {
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

  addListeners() {
    document.addEventListener("keypress", this.handleKeyPress);
  }
  removeListeners() {
    document.removeEventListener("keypress", this.handleKeyPress);
  }

  handleKeyPress(e) {
    // at start menu
    if (!this.running && !this.winner) {
      switch (e.keyCode) {
        // prevent caps lock
        case 20:
        e.preventDefault();
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
        // s for P1 to jump 3
        case 100:
        if (!this.playerOne().finished) {
          if (this.settings.tripleJumps) {
            this.playerOne().setJump(3);
          }
        }
        return;
        // i for P2 to jump 1
        case 105:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(1);
        }
        return;
        // o for P2 to jump 2
        case 111:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(2);
        }
        return;
        // p for P2 to jump 3
        case 112:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          if (this.settings.tripleJumps) {
            this.playerTwo().setJump(3);
          }
        }
        return;
        default:
        return;
      }
    } else if (this.running && this.paused) {
      switch (e.keyCode) {
        // space to toggle pause
        case 32:
        e.preventDefault();
        this.togglePause();
        return;
      }
    }
  }
}

module.exports = Game;
