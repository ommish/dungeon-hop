(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this.ctx.fillText('\\ to restart', 0, 210);
    this.ctx.fillText('space to pause', 0, 320);
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
    if (this.scoreboard) {this.scoreboard.drawScoreboard();}

    if ((this.playerOne().finishTime || this.playerTwo().finishTime) && this.running) {
      this.playerTwo().stopAI();
      this.running = false;
      this.timer.pause();
      if (this.playerOne().finishTime && this.playerTwo().finishTime) {
        this.winner = this.playerOne().finishTime < this.playerTwo().finishTime ? this.PlayerOne() : this.playerTwo();
      }
      else {
        this.winner = this.playerOne().finishTime ? this.playerOne() : this.playerTwo();
      }
      document.removeEventListener("keypress", this.keypressListener);
      document.removeEventListener("keydown", this.keydownListener);
      const finishTime = this.timer.getTimeValues();
      const date = this.winner.finishTime;

      this.scoreboard = new Scoreboard(this.ctx, this.winner, finishTime, date);

    } else if (this.running) {
      this.drawTimeAndRules();
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

  addListeners() {
    this.keypressListener = document.addEventListener("keypress", this.handleKeyPress);
    this.keydownListener = document.addEventListener("keydown", this.handleKeyDown);
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
        e.preventDefault();
        this.startGame();
        return;
        default:
        return;
      }
    } else if (this.running && !this.paused) {
      switch (e.keyCode) {
        case 92:
        this.reset();
        return;
        case 20:
        e.preventDefault();
        return;
        case 81: // q
        this.running = false;
        this.endGame();
        return;
        case 32: // spacebar
        e.preventDefault();
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
        case 32:
        e.preventDefault();
        this.togglePause();
        return;
        case 92:
        this.reset();
        return;
      }
    } else {
      switch (e.keyCode) {
        case 92:
        this.reset();
        return;
      }
    }
  }
}

module.exports = Game;

},{"../node_modules/easytimer.js/dist/easytimer.min.js":9,"./ground.js":2,"./path.js":4,"./player.js":5,"./scoreboard.js":6,"./start_menu.js":8}],2:[function(require,module,exports){
const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.path = path;
    // this.background = this.setBackground();
  }

  // setBackground() {
  //   const image = new Image();
  //   image.src = "./assets/ruins.jpg";
  //   return image;
  // }
  //
  drawBackground() {
    // context.drawImage(img,          sx,sy, sw, sh, dx,                             dy,      dw, dh)
    // this.ctx.drawImage(this.background, 0, 0, 500, 400, 0, this.playerNumber === 1 ? 0 : 300, 500, 219);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, this.playerNumber === 1 ? 0 : 300, 500, 219);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      // context.drawImage(img,      sx, sy, sw, sh, dx,                                dy,          dw, dh)
      this.ctx.drawImage(space.image, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 81, 81);
      if (space.dx >= 141.75 && space.dx < 222.75) {
        this.current = space;
      }
      if (space.type !== "blank") {
        // context.drawImage(img,          sx,                   sy,       sw, sh,       dx,                                      dy,    dw, dh)
        this.ctx.drawImage(space.obstacle, space.sx, space.sy, space.sw, space.sh, space.dx + 22.5, this.playerNumber === 1 ? 185 : 485, 42, 42);
        space.drawCount++;
        if (space.drawCount === 3) {
          space.drawCount = 0;
          if (space.sx <= 1500) {
            space.sx += 190;
          } else {
            space.sx = 0;
          }
        }
      }
      if (space.last) {
        this.ctx.drawImage(space.sign, 0, 0, 20, 30, space.dx + 20.5, this.playerNumber === 1 ? 178 : 478, 36, 45);
      }
    });
  }

  slide(delta) {
    this.path.spaces.forEach((space) => {
      space.dx += delta;
    });
  }

}

module.exports = Ground;

},{"./space.js":7}],3:[function(require,module,exports){
const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  new Game(canvasEl);

  let autoplay = "";
  if (localStorage.getItem('autoplay') !== "off") {
    autoplay = "autoplay";
  }
  const audio = $(`<audio ${autoplay}></audio>`);
  audio.append(
    "<source src=https://soundcloud.com/ommi-shimizu/01-1348079-filuanddina-exploring-the-dungeon-game-background/ type=audio/ogg>")
  $("head").append(audio);

  const musicButton = $("music");
  musicButton.on("click", () => {
    musicButton.toggleClass("disabled");
    if (musicButton.hasClass("disabled")) {
      localStorage.setItem('autoplay', 'off');
      audio.prop("autoplay", false);
    }
  });
});

},{"./game.js":1}],4:[function(require,module,exports){
const Space = require('./space.js');

class Path {
  constructor(spaces) {
    this.generateSpaces(spaces);
  }

  generateSpaces(spaces) {
    this.spaces = spaces.map((spaceType, i) => {
      let space = new Space(spaceType, i);
      if (i === 103) {space.last = true;}
      return space;
    });
  }

  static generateRandomPath(obstacleCount, obstacleTypes) {
    let obstacleNum = 0;
    let type;
    let firstTime = true;
    let spaceNumber;

    const spaces = [];

    while (obstacleNum < obstacleCount) {

      for (spaceNumber = 0; spaceNumber < 103; spaceNumber++) {

        if (firstTime && spaceNumber < 3) {
          spaces.push(0);

        } else if (firstTime) {

        if (spaceNumber === 102) {firstTime = false;}

          if (spaces[spaceNumber - 1] === 0) {
            if (obstacleTypes === 2) {
              type = Math.floor(Math.random() * 10) % 3;
            } else {
              type = Math.floor(Math.random() * 10) % 4;
            }
            spaces.push(type);
          } else {
            spaces.push(0);
          }
          if (type > 0) {obstacleNum++;}

        } else {

          if (obstacleNum < obstacleCount) {
            spaceNumber += 5;
            if (spaces[spaceNumber - 1] === 0) {
              spaces[spaceNumber] = 1;
              obstacleNum++;
            }
          } else {
            break;
          }
        }
      }
    }

    for(let i = 103; i < 110; i++) {
      spaces.push(0);
    }
    return spaces;
  }


}

module.exports = Path;

},{"./space.js":7}],5:[function(require,module,exports){

class Player {
  constructor(i, ctx, ground, mode, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.ground = ground;
    this.mode = mode;
    this.human = human;

    this.sx = 1500;
    this.sy = (i - 1) * 330;
    this.x = 182.25;
    this.baseY = this.playerNumber === 1 ? 160 : 460;
    this.y = this.baseY;
    this.jumpHeight = 0;

    this.character = this.setImage("./assets/marios.png");
    this.bang = this.setImage("./assets/bang.png");
    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.finishTime = null;

    this.calculateAndJump = this.calculateAndJump.bind(this);

    if (!this.human) {this.startAI();}
  }

  setImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  slideGround(direction) {
    let delta;
    if (this.jumpHeight === this.baseY - 64) {
      delta = this.mode.oneSlide;
    } else {
      delta = this.mode.twoSlides;
    }
    this.ground.slide(delta * direction);
  }

  setsx() {
    if (this.y === this.baseY) {
        this.sx = 1500;
    } else if (this.y >= this.baseY - 10) {
        this.sx = 1250;
    } else if (this.y >= this.baseY - 50) {
        this.sx = 1000;
    } else if (this.y >= this.baseY - 100) {
      this.sx = 750;
    }
  }

  land() {
    this.falling = false;
    this.jumping = false;
    this.crashing = false;
  }

  handleCollision() {
    if (this.ground.current.dx > 160 && this.ground.current.dx < 164 && this.ground.current.typeIndex > 0) {
      this.crashing = true;
      this.jumping = true;
    }
  }

  handleFinish() {
    if ((this.ground.current.dx > 160 && this.ground.current.dx < 164) && (this.ground.current.spaceNum >= 103) && (!this.finishTime)) {
      this.finishTime = new Date();
    }
  }

  incrementY(direction) {
    this.y += this.mode.yIncrement * direction;
  }

  drawPlayer() {
    // context.drawImage(img,          sx,      sy,       sw,  sh,  dx,    dy,      dw, dh)
    this.ctx.drawImage(this.character, this.sx, this.sy, 250, 330, this.x, this.y, 40.5, 66);
    this.setsx();
    if (this.crashing) {
      this.slideGround(1);
      this.jump();
      this.ctx.drawImage(this.bang, 0, 0, 300, 500, this.x - 15, this.y - 15, 15, 25);
    } else if (this.jumping) {
      this.slideGround(-1);
      this.jump();
    } else if (this.finishTime) {
      this.jump();
    }
  }

  jump() {
    if (!this.falling) {
      if (this.y > this.jumpHeight) {
        this.incrementY(-1);
      } else {
        this.falling = true;
      }
    } else {
      if (this.y < this.baseY) {
        this.incrementY(1);
      } else {
        this.land();
        this.handleCollision();
        this.handleFinish();
      }
    }
  }

  setJump(spaces) {
    if (!this.jumping) {
      this.jumping = true;
      if (spaces === 1) {
        this.jumpHeight = this.baseY - 64;
      } else {
        this.jumpHeight = this.baseY - 96;
      }
    }
  }

  startAI() {
    this.interval = window.setInterval(this.calculateAndJump, this.mode.jumpInterval);
  }

  stopAI() {
    window.clearInterval(this.interval);
  }

  calculateAndJump(){
    if (!this.jumping && !this.crashing && !this.finishTime) {
      if (Math.random() <= this.mode.randomness) {
        if (this.ground.path.spaces[this.ground.current.spaceNum + 1].typeIndex > 0) {
          this.setJump(2);
        } else if (this.ground.path.spaces[this.ground.current.spaceNum + 2].typeIndex > 0) {
          this.setJump(1);
        } else {
          let spaces = Math.floor(Math.random() * 10) % 2 + 1;
          this.setJump(spaces);
        }
      } else {
        let spaces = Math.floor(Math.random() * 10) % 2 + 1;
        this.setJump(spaces);
      }
    } else if (this.finishTime) {
      window.clearInterval(this.interval);
    }
  }
}

module.exports = Player;

},{}],6:[function(require,module,exports){
class Scoreboard {
  constructor(ctx, winner, finishTime, date) {
    this.ctx = ctx;
    this.finishTime = finishTime;
    this.date = date;
    this.winner = winner;
    this.winnerName = "";

    this.width = 500;
    this.height = 600;

    this.drawScoreboard = this.drawScoreboard.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.winnerRecorded = false;

    this.getScoreboard();

  }

  addListeners() {
    this.keypressListener = document.addEventListener("keypress", this.handleKeypress);
  }

  handleKeypress(e) {
    if (e.keyCode === 8) {
      this.winnerName = this.winnerName.slice(1);
    }
    else if (e.keyCode === 13) {
      this.saveScore();
    }
    else if (this.winnerName.length < 15) {
      this.winnerName += e.key;
    }
  }

  drawScoreboard() {
    this.ctx.font = "30px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`WINNER: Player ${this.winner.playerNumber}`, this.width / 2, 50);
    this.ctx.fillText(`TIME: ${this.finishTime.toString(['minutes', 'seconds', 'secondTenths'])}`, this.width / 2, 80);
    this.ctx.fillText("Top Scores:", this.width / 2, 140);
    if (this.winners) {
      this.winners.forEach((winner, i) => {
        this.ctx.fillText(`${i + 1}. ${winner.name}: ${winner.time}`, this.width / 2, (i + 1) * 40 + 170);
      });
    }
    if (this.isNewWinner && !this.winnerRecorded && this.winner.human) {
      this.ctx.fillText(`ENTER YOUR NAME:`, this.width / 2, 430);
      this.ctx.fillText(`${this.winnerName}`, this.width / 2, 460);
    }
    this.ctx.fillText("Hit \\ to restart", this.width / 2, 520);
  }

  getScoreboard() {
    firebase.database().ref('/scores/').once('value').then((snapshot) => {
      this.winners = this.topScores(Object.values(snapshot.val())).slice(0, 5);
      this.isNewWinner = this.winners.some((winner) => {
        return winner.time > this.finishTime.toString();
      });
      if (this.isNewWinner && !this.winnerRecorded && this.winner.human) {
        this.addListeners();
      }
    });
  }

  topScores(scores) {
    return scores.sort(this.compareScores);
  }

  compareScores(scoreA, scoreB) {
    if (scoreA.time < scoreB.time) {
      return -1;
    } else if (scoreA.time > scoreB.time) {
      return 1;
    } else {
      if (scoreA.date < scoreB.date) {
        return -1;
      } else {
        return 1;
      }
    }
  }


  saveScore() {
    const newScore = firebase.database().ref('/scores').push();
    newScore.set({
      name: this.winnerName,
      time: this.finishTime.toString(),
      date: this.date.toString(),
    });
    this.winnerRecorded = true;
    document.removeEventListener("keypress", this.handleKeypress);
    this.getScoreboard();
  }
}

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){
const _types = ["blank", "spikey", "spikeBeetle", "whacka"];
const _imageSrcs = [
  "./assets/ground.png",
  "./assets/enemies.png",
  "./assets/enemies.png",
  "./assets/enemies.png",
  "./assets/sign.png"
];

class Space {
  constructor(typeIndex, spaceNum, current = false, last = false) {
    this.spaceNum = spaceNum;
    this.typeIndex = typeIndex;
    this.type = _types[typeIndex];
    this.image = this.setTile();
    this.obstacle = this.setObstacle();
    this.dx = spaceNum * 81;
    this.sx = 0;
    this.sy = this.setSY();
    this.sh = this.setSH();
    this.sw = this.setSW();
    this.last = last;
    this.sign = this.setSign();
    this.drawCount = 0;
  }

  setTile() {
    const image = new Image();
    image.src = _imageSrcs[0];
    return image;
  }

  setObstacle() {
    const image = new Image();
    image.src =  _imageSrcs[this.typeIndex];
    return image;
  }

  setSign() {
    const image = new Image();
    image.src = _imageSrcs[4];
    return image;
  }

  setSH() {
    switch (this.typeIndex) {
      case 1:
      return 175;
      case 2:
      return 190;
      case 3:
      return 165;
      default:
      return null;
    }
  }

  setSW() {
    switch (this.typeIndex) {
      case 1:
      return 190;
      case 2:
      return 190;
      case 3:
      return 190;
      default:
      return null;
    }
  }

  setSY() {
    switch (this.typeIndex) {
      case 1:
        return 0;
      case 2:
        return 175;
      case 3:
        return 365;
      default:
        return null;
    }
  }
}

module.exports = Space;

},{}],8:[function(require,module,exports){
class StartMenu {
  constructor(ctx) {
    this.ctx = ctx;
    this.humanPlayerCount = 1;
    this.width = 500;
    this.height = 600;
    this.level = 0;

    this.drawStartMenu = this.drawStartMenu.bind(this);
    this.clear = this.clear.bind(this);

    this.start();
  }

  start() {
    this.interval = window.setInterval(this.drawStartMenu, 50);
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    window.clearInterval(this.interval);
  }

  drawStartMenu() {

    this.clear();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.font = '30px Julius Sans One';
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    this.ctx.fillText(`Num. Players (1/2):  ${this.humanPlayerCount}`, this.width / 2, 50);
    this.ctx.fillText(`Speed (← / →): ${["slow", "fast"][this.level]}`, this.width / 2, 80);

    this.ctx.fillText('Hit Space to Start', this.width / 2, 140);

    this.ctx.fillText('Player One:', this.width / 2, 200);

    this.ctx.fillText('a to jump one space', this.width / 2, 230);
    this.ctx.fillText('s to jump two spaces', this.width / 2, 260);

    this.ctx.fillText('Player Two:', this.width / 2, 320);
    this.ctx.fillText('k to jump one space', this.width / 2, 350);
    this.ctx.fillText('l to jump two spaces', this.width / 2, 380);

  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}

module.exports = StartMenu;

},{}],9:[function(require,module,exports){
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.Timer=t()}(this,function(){"use strict";function n(n,t,e){var o=void 0,i="";for(o=0;o<t;o+=1)i+=String(e);return(i+n).slice(-i.length)}function t(){this.secondTenths=0,this.seconds=0,this.minutes=0,this.hours=0,this.days=0,this.toString=function(t,e,o){t=t||["hours","minutes","seconds"],e=e||":",o=o||2;var i=[],r=void 0;for(r=0;r<t.length;r+=1)void 0!==this[t[r]]&&i.push(n(this[t[r]],o,"0"));return i.join(e)}}function e(){return"undefined"!=typeof document}function o(){return S}function i(n,t){return(n%t+t)%t}var r="undefined"!=typeof window?window.CustomEvent:void 0;"undefined"!=typeof window&&"function"!=typeof r&&((r=function(n,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var e=document.createEvent("CustomEvent");return e.initCustomEvent(n,t.bubbles,t.cancelable,t.detail),e}).prototype=window.Event.prototype,window.CustomEvent=r);var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},u=10,d=60,c=60,f=24,a=0,v=1,h=2,l=3,p=4,m="secondTenths",y="seconds",b="minutes",w="hours",g="days",E={secondTenths:100,seconds:1e3,minutes:6e4,hours:36e5,days:864e5},T={secondTenths:u,seconds:d,minutes:c,hours:f},S="undefined"!=typeof module&&module.exports&&"function"==typeof require?require("events"):void 0;return function(){function n(n,t){var e=Math.floor(t);X[n]=e,W[n]=n!==g?i(e,T[n]):e}function r(n){return U(n,g)}function j(n){return U(n,w)}function C(n){return U(n,b)}function M(n){return U(n,y)}function L(n){return U(n,m)}function U(t,e){var o=X[e];return n(e,t/E[e]),X[e]!==o}function V(){A(),z()}function A(){clearInterval(Y),Y=void 0,$=!1,_=!1}function k(n){Q()?(cn=D(),sn=F(rn.target)):R(n),x()}function x(){var n=E[nn];O(q(Date.now()))||(Y=setInterval(P,n),$=!0,_=!1)}function D(){return q(Date.now())-X.secondTenths*E[m]*tn}function P(){var n=q(Date.now()),t=tn>0?n-cn:cn-n,e={};e[m]=L(t),e[y]=M(t),e[b]=C(t),e[w]=j(t),e[g]=r(t),I(e),en(an.detail.timer),O(n)&&(K("targetAchieved",an),J())}function q(n){return Math.floor(n/E[nn])*E[nn]}function I(n){n[m]&&K("secondTenthsUpdated",an),n[y]&&K("secondsUpdated",an),n[b]&&K("minutesUpdated",an),n[w]&&K("hoursUpdated",an),n[g]&&K("daysUpdated",an)}function O(n){return sn instanceof Array&&n>=fn}function z(){for(var n in W)W.hasOwnProperty(n)&&"number"==typeof W[n]&&(W[n]=0);for(var t in X)X.hasOwnProperty(t)&&"number"==typeof X[t]&&(X[t]=0)}function R(n){nn="string"==typeof(n=n||{}).precision?n.precision:y,en="function"==typeof n.callback?n.callback:function(){},dn=!0===n.countdown,tn=!0===dn?-1:1,"object"===s(n.startValues)&&G(n.startValues),cn=D(),"object"===s(n.target)?sn=F(n.target):dn&&(n.target={seconds:0},sn=F(n.target)),on={precision:nn,callback:en,countdown:"object"===(void 0===n?"undefined":s(n))&&!0===n.countdown,target:sn,startValues:un},rn=n}function B(n){var t=void 0,e=void 0,o=void 0,i=void 0,r=void 0,m=void 0;if("object"===(void 0===n?"undefined":s(n)))if(n instanceof Array){if(5!==n.length)throw new Error("Array size not valid");m=n}else m=[n.secondTenths||0,n.seconds||0,n.minutes||0,n.hours||0,n.days||0];for(var y=0;y<n.length;y+=1)n[y]<0&&(n[y]=0);return t=m[a],e=m[v]+Math.floor(t/u),o=m[h]+Math.floor(e/d),i=m[l]+Math.floor(o/c),r=m[p]+Math.floor(i/f),m[a]=t%u,m[v]=e%d,m[h]=o%c,m[l]=i%f,m[p]=r,m}function F(n){if(n){var t=H(sn=B(n));return fn=cn+t.secondTenths*E[m]*tn,sn}}function G(n){un=B(n),W.secondTenths=un[a],W.seconds=un[v],W.minutes=un[h],W.hours=un[l],W.days=un[p],X=H(un,X)}function H(n,t){var e=t||{};return e.days=n[p],e.hours=e.days*f+n[l],e.minutes=e.hours*c+n[h],e.seconds=e.minutes*d+n[v],e.secondTenths=e.seconds*u+n[[a]],e}function J(){V(),K("stopped",an)}function K(n,t){e()?Z.dispatchEvent(new CustomEvent(n,t)):o()&&Z.emit(n,t)}function N(){return $}function Q(){return _}var W=new t,X=new t,Y=void 0,Z=e()?document.createElement("span"):o()?new S.EventEmitter:void 0,$=!1,_=!1,nn=void 0,tn=void 0,en=void 0,on={},rn=void 0,sn=void 0,un=void 0,dn=void 0,cn=void 0,fn=void 0,an={detail:{timer:this}};void 0!==this&&(this.start=function(n){N()||(k(n),K("started",an))},this.pause=function(){A(),_=!0,K("paused",an)},this.stop=J,this.reset=function(){V(),k(rn),K("reset",an)},this.isRunning=N,this.isPaused=Q,this.getTimeValues=function(){return W},this.getTotalTimeValues=function(){return X},this.getConfig=function(){return on},this.addEventListener=function(n,t){e()?Z.addEventListener(n,t):o()&&Z.on(n,t)},this.removeEventListener=function(n,t){e()?Z.removeEventListener(n,t):o()&&Z.removeListener(n,t)})}});

},{"events":10}],10:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}]},{},[3]);
