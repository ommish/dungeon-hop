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
    this.startGame = this.startGame.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.backgrounds = this.setBackgrounds();

    this.reset();
  }

  reset() {
    this.removeListeners();
    if (this.scoreboard) this.scoreboard.removeListeners();
    window.cancelAnimationFrame(this.interval);
    this.running = false;
    this.paused = false;
    this.scoreboard = null;
    this.winner = null;
    this.timer = new Timer();
  }

  startCountdown() {
    this.countdownSecs = 3;
    window.setTimeout(this.startGame, 3000);
    this.countdown = window.setInterval(() => {this.countdownSecs--;}, 1000);
    this.pathPattern = Path.generateRandomPath();
    this.createPlayers();
    this.interval = window.requestAnimationFrame(this.drawGame);
  }

  startGame() {
    window.clearInterval(this.countdown);
    this.countdownSecs = null;
    this.running = true;

    this.timer.start({precision: 'secondTenths'});
    if (!this.playerTwo().human) {this.playerTwo().startAI();}
  }

  createPlayers() {
    this.players = [];
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
    this.drawBackgrounds();

    this.players.forEach((player) => {
      player.ground.drawGround();
      player.drawPlayer();
    });

    if (this.scoreboard) {this.scoreboard.drawScoreboard();}

    if (this.running || this.countdownSecs) {this.drawTimeAndRules();}

    if ((this.playerOne().finishTime || this.playerTwo().finishTime) && this.running) {
      this.stopGame();
      this.setWinner();
      this.removeListeners();
      this.setScoreboard();
    }
    this.interval = window.requestAnimationFrame(this.drawGame);
  }

  drawTimeAndRules() {

    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";

    if (this.countdownSecs) {
      this.ctx.font = "80px Julius Sans One";
      this.ctx.fillText(`${this.countdownSecs}`, 250, 315);
    } else {
      this.ctx.font = "40px Julius Sans One";
      this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 250, 315);
    }

    this.ctx.font = "20px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "left";
    this.ctx.fillText('\\ to restart', 10, 210);
    this.ctx.fillText('space to pause', 10, 320);
  }

  setBackgrounds() {
    const bgImages = [];
    for (let i = 0; i < 2; i++) {
      const bgImage = new Image();
      bgImage.src = i === 0 ? "./assets/castle.png" : "./assets/hotel.png";
      bgImages.push(bgImage);
    }
    return bgImages;
  }

  drawBackgrounds() {
    this.backgrounds.forEach((bg, i) => {
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, i * 300, 500, 300);
      this.ctx.drawImage(bg, 0, 0, 352, 203, 100, i === 0 ? 70 : 375, 275, 150);
    });
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
      window.cancelAnimationFrame(this.interval);
      this.timer.pause();
    } else {
      this.interval = window.requestAnimationFrame(this.drawGame);
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
    if (!this.running && !this.winner && !this.countdownSecs) {
      switch (e.keyCode) {
        // space to start
        case 32:
        e.preventDefault();
        this.startCountdown();
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
        case 65:
        case 97:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(1);
        }
        return;
        // s for P1 to jump 2
        case 83:
        case 115:
        if (!this.playerOne().finished) {
          this.playerOne().setJump(2);
        }
        return;
        // s for P1 to jump 3
        case 68:
        case 100:
        if (!this.playerOne().finished) {
          if (this.settings.tripleJumps) {
            this.playerOne().setJump(3);
          }
        }
        return;
        // i for P2 to jump 1
        case 73:
        case 105:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(1);
        }
        return;
        // o for P2 to jump 2
        case 79:
        case 111:
        if (this.playerTwo().human && !this.playerTwo().finished) {
          this.playerTwo().setJump(2);
        }
        return;
        // p for P2 to jump 3
        case 80:
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
