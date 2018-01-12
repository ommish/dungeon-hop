(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

    this.reset();
  }

  reset() {
    this.removeListeners();
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
        // prevent caps lock
        case 20:
        e.preventDefault();
        return;
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

},{"../node_modules/easytimer.js/dist/easytimer.min.js":10,"./ground.js":2,"./path.js":4,"./player.js":5,"./scoreboard.js":6,"./start_menu.js":9}],2:[function(require,module,exports){
const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.path = path;
    this.background = this.setBackground();
  }

  setBackground() {
    const image = new Image();
    image.src = this.playerNumber === 1 ? "./assets/castle.png" : "./assets/hotel.png";
    return image;
  }

  drawBackground() {
    // context.drawImage(img,           sx,sy, sw, sh, dx,                             dy,      dw, dh)
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, this.playerNumber === 1 ? 0 : 300, 500, 300);
    this.ctx.drawImage(this.background, 0, 0, 352, 203, 100, this.playerNumber === 1 ? 70 : 375, 275, 150);
  }

  drawGround() {
    this.drawBackground();
    this.path.spaces.forEach((space) => {
      if (space.dx >= -90 && space.dx <= 500) {
        if (!space.tile) {
          space.setObjectImage();
          space.setTile();
        }
        this.ctx.drawImage(space.tile, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 90, 90);
        if (space.dx >= 180 && space.dx < 270) {
          this.current = space;
        }
        if (space.type > 0) {
          this.ctx.drawImage(space.objectImage, space.sx, space.sy, space.sw, space.sh, space.dx + 22.5, this.playerNumber === 1 ? space.dy : space.dy + 300, space.dw, space.dh);
        }
        if (space.type === 1 || space.type === 4) {
          space.incrementSx();
        }
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

},{"./space.js":8}],3:[function(require,module,exports){
const Game = require('./game.js');
const SettingsForm = require('./settings_form.js');
const StartMenu = require('./start_menu.js');

document.addEventListener("DOMContentLoaded", () => {

  // const provider = new firebase.auth.GoogleAuthProvider();
  //
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     const displayName = user.displayName;
  //     const email = user.email;
  //     const emailVerified = user.emailVerified;
  //     const uid = user.uid;
  //     const providerData = user.providerData;
  //     // ...
  //   } else {
  //     // User is signed out.
  //     // ...
  //   }
  // });
  //
  // firebase.auth().signInWithPopup(provider).then(function(result) {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const token = result.credential.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   // ...
  // }).catch(function(error) {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   const credential = error.credential;
  //   // ...
  // });

  const canvasEl = document.getElementsByTagName('canvas')[0];
  const musicButton = $(".music-button");
  const settingsSubmitButton = document.getElementById("submit-settings");
  const audio = $("#bg-music");

  const settingsForm = new SettingsForm();
  const game = new Game(canvasEl);
  const startMenu = new StartMenu(canvasEl);

  autoplayMusic();
  toggleMusic();

  settingsSubmitButton.addEventListener("click", startGameWithSettings);
  document.addEventListener("keypress", reset);

  function startGameWithSettings(e) {
    e.preventDefault();
    settingsForm.toggleForm();
    settingsForm.handleSubmit();
    game.settings = settingsForm.settings;
    startMenu.settings = game.settings;
    game.addListeners();
    startMenu.drawStartMenu();
  }

  function reset(e) {
    e.preventDefault();
    if (e.keyCode === 92 && !settingsForm.isOpen() && !game.countdownSecs) {
      game.reset();
      settingsForm.toggleForm();
    }
  }

  function autoplayMusic() {
    if (localStorage.getItem('autoplay')) {
      musicButton.toggleClass("disabled");
    } else {
      audio.prop("autoplay", true);
    }
  }

  function toggleMusic() {
    musicButton.on("click", (e) => {
      musicButton.toggleClass("disabled");
      if (musicButton.hasClass("disabled")) {
        localStorage.setItem('autoplay', 'off');
        audio[0].pause();
      } else {
        localStorage.removeItem('autoplay');
        audio[0].play();
      }
    });
  }
});

},{"./game.js":1,"./settings_form.js":7,"./start_menu.js":9}],4:[function(require,module,exports){
const Space = require('./space.js');

class Path {
  constructor(path, itemIndex, enemyTypes, items) {
    this.path = path;
    this.itemIndex = itemIndex;
    this.enemyTypes = enemyTypes;
    this.items = items;
    this.generateSpaces();
  }

  generateSpaces() {
    this.spaces = this.path.map((type, spaceNum) => {
      if ((this.items.length > 0) && (spaceNum === this.itemIndex || spaceNum === this.itemIndex * 3)) {type = 2;}
      if (spaceNum === 103) {type = 3;}
      if (spaceNum === 105) {type = 4;}
      let space = new Space(type, spaceNum, this.items, this.enemyTypes);
      return space;
    });
  }

  static generateRandomPath() {
    const maxObstacles = 45;
    let obstacleCount = 0;
    let type;

    const spaces = new Array(100);
    spaces.fill(0, 0, 100);

    while (obstacleCount < maxObstacles) {
      for (let spaceNumber = 0; spaceNumber <= 100; spaceNumber++) {
        if (obstacleCount >= maxObstacles) { break;}
          if (spaces[spaceNumber - 1] > 0 || spaces[spaceNumber + 1] > 0) {
            spaces[spaceNumber] = 0;
          } else {
            type = Math.floor(Math.random() * 2);
            spaces[spaceNumber] = type;
            if (type > 0) {obstacleCount++;}
          }
        }
      }
      spaces.unshift(0, 0 , 0);
      spaces.push(0, 0, 0, 0, 0, 0);
    return spaces;
  }
}

module.exports = Path;

},{"./space.js":8}],5:[function(require,module,exports){
class Player {
  constructor(i, ctx, ground, settings, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.ground = ground;
    this.settings = settings;
    this.human = human;

    this.sx = 1500;
    this.sy = (i - 1) * 330;
    this.dx = 205;
    this.baseY = this.playerNumber === 1 ? 163 : 463;
    this.dy = this.baseY;
    this.jumpHeight = 0;

    this.character = this.setImage("./assets/marios.png");
    this.bang = this.setImage("./assets/bang.png");
    this.sparkle = this.setImage("./assets/sparkles.png");
    this.questionMarks = this.setImage("./assets/question_marks.png");

    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.invincible = false;
    this.finishTime = null;
    this.confused = false;

    this.calculateAndJump = this.calculateAndJump.bind(this);

  }

  setImage(src) {
    const image = new Image();
    image.src = src;
    return image;
  }

  drawPlayer() {
    if (this.invincible) {
      this.ctx.drawImage(this.sparkle, 300 * Math.floor(Math.random() * 4), 0, 300, 340, this.dx - 15, this.dy, 80, 80);
    }
    if (this.confused) {
      this.ctx.drawImage(this.questionMarks, 0, 0, 500, 500, this.dx + 15, this.dy - 20, 25, 25);
    }
    // context.drawImage(img,          sx,      sy,       sw,  sh,  dx,    dy,      dw, dh)
    this.ctx.drawImage(this.character, this.sx, this.sy, 250, 330, this.dx, this.dy, 40, 66);
    this.setSx();
    if (this.crashing) {
      this.slideGround(1);
      this.jump();
      this.ctx.drawImage(this.bang, 0, 0, 300, 500, this.dx - 15, this.dy - 15, 15, 25);
    } else if (this.jumping) {
      this.slideGround(-1);
      this.jump();
    } else if (this.finishTime) {
      this.jump();
    }
  }

  scrambleSpaces(spaces) {
    if (this.confused) {
      switch (spaces) {
        case 3:
        return 1;
        case 2:
        return 3;
        case 1:
        return 2;
      }
    } else {
      return spaces;
    }
  }

  setJump(spaces) {

    spaces = this.scrambleSpaces(spaces);

    if (!this.jumping) {
      this.jumping = true;
      if (spaces === 1) {
        this.jumpHeight = this.baseY - this.settings.jumpHeights.one;
      } else if (spaces === 2) {
        this.jumpHeight = this.baseY - this.settings.jumpHeights.two;
      } else if (spaces === 3) {
        this.jumpHeight = this.baseY - this.settings.jumpHeights.three;
      }
    }
  }

  jump() {
    if (!this.falling) {
      if (this.dy > this.jumpHeight) {
        this.incrementY(-1);
        if (this.dy <= this.jumpHeight) {
          this.falling = true;
        }
      }
    } else {
      if (this.dy < this.baseY) {
        this.incrementY(1);
        if (this.dy >= this.baseY) {
          this.land();
          this.handleCollision();
          this.handleFinish();
        }
      }
    }
  }

  incrementY(direction) {
    this.dy += this.settings.yIncrement * direction;
  }

  setSx() {
    if (this.dy === this.baseY) {
      this.sx = 1500;
    } else if (this.dy >= this.baseY - 10) {
      this.sx = 1250;
    } else if (this.dy >= this.baseY - 50) {
      this.sx = 1000;
    } else if (this.dy >= this.baseY - 100) {
      this.sx = 750;
    }
  }

  slideGround(direction) {
    let delta;
    if (this.jumpHeight === this.baseY - this.settings.jumpHeights.one) {
      delta = this.settings.oneSlide;
    } else if (this.jumpHeight === this.baseY - this.settings.jumpHeights.two) {
      delta = this.settings.twoSlides;
    } else {
      delta = this.settings.threeSlides;
    }
    this.ground.slide(delta * direction);
  }

  land() {
    this.falling = false;
    this.jumping = false;
    this.crashing = false;
  }

  handleCollision() {
    if (this.ground.current.dx === 180 && this.ground.current.type === 1 && !this.invincible) {
      this.crashing = true;
      this.jumping = true;
    } else if (this.ground.current.dx === 180 && this.ground.current.type === 2) {
      if (this.ground.current.typeName === "star") {
        this.startInvincible();
      } else if (this.ground.current.typeName === "mushroom"){
        this.startConfusion();
      }
    }
  }

  handleFinish() {
    if ((this.ground.current.dx === 180) && (this.ground.current.spaceNum >= 103) && (!this.finishTime)) {
      this.finishTime = new Date();
    }
  }

  startInvincible() {
    window.clearTimeout(this.invincibleTimeout);
    this.invincible = true;
    this.invincibleTimeout = window.setTimeout(() => {this.invincible = false;}, 8000);
  }

  startConfusion() {
    window.clearTimeout(this.confusionTimeout);
    this.confused = true;
    this.confusionTimeout = window.setTimeout(() => {this.confused = false;}, 8000);
  }

  startAI() {
    let AIjumpInterval;
    if (this.settings.yIncrement === 16) {
      AIjumpInterval = 200;
    } else if (this.settings.yIncrement === 24) {
      AIjumpInterval = 350;
    } else {
      AIjumpInterval = 500;
    }
    this.interval = window.setInterval(this.calculateAndJump, AIjumpInterval);
  }

  stopAI() {
    window.clearInterval(this.interval);
  }

  calculateAndJump(){
    if (!this.jumping && !this.crashing && !this.finishTime) {
      if (this.invincible) {
        if (this.settings.tripleJumps) {
          this.setJump(3);
        } else {
          this.setJump(2);
        }
      } else if (Math.random() <= this.settings.computerLevel) {
        if (this.ground.path.spaces[this.ground.current.spaceNum + 1].type === 1 || this.ground.path.spaces[this.ground.current.spaceNum + 3].type === 1) {
          this.setJump(2);
        } else if (this.ground.path.spaces[this.ground.current.spaceNum + 2].type === 1) {
          if (this.settings.tripleJumps && this.ground.path.spaces[this.ground.current.spaceNum + 3].type !== 1) {
            this.setJump(3);
          } else {
            this.setJump(1);
          }
        } else {
          let spaces = Math.floor(Math.random() * 2) + 1;
          this.setJump(spaces);
        }
      } else {
        let spaces = Math.floor(Math.random() * 2) + 1;
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
    this.handleKeydown = this.handleKeydown.bind(this);
    this.winnerRecorded = false;

    this.getScoreboard();

  }

  addListeners() {
    this.keydownListener = document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(e) {
    // backspace
    if (e.keyCode === 8) {
      this.winnerName = this.winnerName.slice(0, -1);
    }
    // enter to save
    else if (e.keyCode === 13) {
      this.saveScore();
    }
    else if ([16, 20, 9, 27, 17, 18, 57, 38, 39, 40, 38].includes(e.keyCode)) {
      return;
    }
    // type in name
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
        return winner.time > this.finishTime.toString(['minutes', 'seconds', 'secondTenths']);
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
      time: this.finishTime.toString(['minutes', 'seconds', 'secondTenths']),
      date: this.date.toString(),
    });
    this.winnerRecorded = true;
    document.removeEventListener("keydown", this.handleKeydown);
    this.getScoreboard();
  }
}

module.exports = Scoreboard;

},{}],7:[function(require,module,exports){
const upperFirst = require('../node_modules/lodash/upperFirst.js');

class SettingsForm {

  constructor() {
    this.settingsForm = $(document.getElementsByClassName("game-settings")[0]);
    this.settings = {};
  }

  toggleForm() {
    this.settingsForm.toggleClass("hidden");
  }

  isOpen() {
    return !this.settingsForm.hasClass("hidden");
  }

  handleSubmit() {
    const speed = $("#speed-slider")[0].value;
    const computerLevel = $("#computer-level-slider")[0].value;
    const obstacleTypes = $("#obstacle-types-slider")[0].value;

    this.formData = {
      speed: parseInt(speed),
      computerLevel: parseInt(computerLevel),
      obstacleTypes: parseInt(obstacleTypes),
      items: [],
      playerCount: null,
      jumpDistances: null,
      jumpHeights: null,
    };
    const formData = this.settingsForm.serializeArray();
    formData.forEach((input) => {
      if (input.name === "items") {
        this.formData.items.push(parseInt(input.value));
      } else {
        this.formData[input.name] = parseInt(input.value);
      }
    });
    this.setSettings();
  }


  setSettings() {
    Object.keys(this.formData).forEach((setting) => {
      let selection = this.formData[setting];
      this[`set${upperFirst(setting)}`](selection);
    });
  }

  setItems(itemChoices) {
    this.settings.items = itemChoices;
  }

  setJumpDistances(distances) {
    this.settings.tripleJumps = distances === 1 ? false : true;
  }
// draw every 60 frames, move 81 slides in that amount of time
  setYIncrement(speed) {
    let yIncrement;
    switch (speed) {
      case 0:
      yIncrement = 4;
      break;
      case 50:
      yIncrement = 6;
      break;
      case 100:
      yIncrement = 8;
      break;
      default:
      return;
    }
    this.settings.yIncrement = yIncrement;
  }

  setJumpHeights() {
    this.settings.jumpHeights = {
      one: 72,
      two: 96,
      three: 120,
    }
  }

  setSpeed(speed) {
    this.setYIncrement(speed);
    this.setSlides(speed);
  }

  setComputerLevel(level) {
    // lands in range of 0.6 ~ 1.0
    this.settings.computerLevel = 0.5 + ((level + 25)/250);
  }

  setSlides(speed) {
    let oneSlide;
    let twoSlides;
    let threeSlides;
    switch (speed) {
      case 0:
      oneSlide = 90/36;
      twoSlides = 180/48;
      threeSlides = 270/60;
      break;
      case 50:
      oneSlide = 90/24;
      twoSlides = 180/32
      threeSlides = 270/40;
      break;
      case 100:
      oneSlide = 90/18;
      twoSlides = 180/24;
      threeSlides = 270/30;
      break;
      default:
      return;
    }
    this.settings.oneSlide = oneSlide;
    this.settings.twoSlides = twoSlides;
    this.settings.threeSlides = threeSlides;
  }

  setPlayerCount(count) {
    this.settings.playerCount = count;
  }

  setObstacleTypes(types) {
    this.settings.obstacleTypes = (types + 25) / 25;
  }

}




module.exports = SettingsForm;

},{"../node_modules/lodash/upperFirst.js":31}],8:[function(require,module,exports){
const _imageSrcs = { 0: ["./assets/ground.png"], 1: ["./assets/enemies.png"], 2: ["./assets/items.png"], 3: ["./assets/sign.png"], 4: ["./assets/peach.png"]};

const obstacles = {
  0: {
    typeName: "spiny",
    sh: 175,
    sw: 195,
    sy: 0,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,
  },
  1: {
    typeName: "spiketop",
    sh: 190,
    sw: 192,
    sy: 175,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,
  },
  2: {
    typeName: "whacka",
    sh: 165,
    sw: 195,
    sy: 365,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,
  },
  3: {
    typeName: "shuyguy",
    sh: 200,
    sw: 190,
    sy: 695,
    sx: 0,
    dw: 50,
    dh: 50,
    dy: 180,
    maxX: 1500,
  },
  4: {
    typeName: "ice",
    sh: 150,
    sw: 194,
    sy: 540,
    sx: 0,
    dw: 50,
    dh: 42,
    dy: 200,
    maxX: 1500,
  },
};

const items = {
  0: {
    typeName: "star",
    sh: 50,
    sw: 50,
    sy: 245,
    sx: 660,
    dw: 36,
    dh: 36,
    dy: 187,
  },
  1: {
    typeName: "mushroom",
    sh: 43,
    sw: 43,
    sy: 40,
    sx: 164,
    dw: 36,
    dh: 36,
    dy: 187,
  }
};

const sign = {
  0: {
    typeName: "sign",
    sh: 30,
    sw: 20,
    sy: 0,
    sx: 0,
    dw: 36,
    dh: 45,
    dy: 178,
  }
};

const princess = {
  0: {
    typeName: "princess",
    sh: 110,
    sw: 72,
    sy: 3,
    sx: 0,
    dw: 43,
    dh: 68,
    dy: 165,
    maxX: 550,
  }
};

const objectParameters = [obstacles, items, sign, princess];
const parametersToSet = ['typeName', 'sh', 'sw', 'sy', 'sx', 'dw', 'dh', 'dy', 'maxX'];

class Space {
  constructor(type, spaceNum, items, obstacleTypes = 0, current = false, last = false) {
    this.type = type;
    this.spaceNum = spaceNum;
    this.dx = spaceNum * 90;
    this.last = last;
    this.drawCount = 0;
    if (this.type > 0) {
      this.setObjectParameters(items, obstacleTypes);
    }
  }

  setObjectParameters(items, obstacleTypes) {
    let typeNum;
    if (this.type === 2) {
      typeNum = items[Math.floor(Math.random() * items.length)];
    }
    else if (this.type === 1) {
      typeNum = Math.floor(Math.random() * obstacleTypes);
    } else {
      typeNum = 0;
    }

    parametersToSet.forEach((parameter) => {
      this[parameter] = objectParameters[this.type - 1][typeNum][parameter];
    });

    this.originalSx = objectParameters[this.type - 1][typeNum].sx;
    this.moveDir = 1;
  }

  setTile() {
    const image = new Image();
    image.src = _imageSrcs[0][0];
    this.tile = image;
  }

  setObjectImage() {
    if (this.type === 0) {return null;}
    const image = new Image();
    image.src = _imageSrcs[this.type][0];
    this.objectImage = image;
  }

  incrementSx() {
    this.drawCount++;
    if (this.drawCount === 6) {
      if (this.type === 1 ||  this.type === 4) {
        this.drawCount = 0;
        this.sx += this.sw * this.moveDir;
        if (this.sx < 10 || this.sx >= this.maxX - this.sw) {
          this.moveDir *= -1;
        }
      }
    }
  }
}

module.exports = Space;

},{}],9:[function(require,module,exports){
class StartMenu {
  constructor(canvasEl) {
    this.ctx = canvasEl.getContext("2d");
    this.width = 500;
    this.height = 600;
  }

  drawStartMenu() {

    this.clearStartMenu();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.font = '30px Julius Sans One';
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    this.ctx.fillText('Hit Space to Start', this.width / 2, 140);

    this.ctx.fillText('a to jump one space', this.width / 2, 230);
    this.ctx.fillText('s to jump two spaces', this.width / 2, 260);
    if (this.settings.tripleJumps) {
      this.ctx.fillText('d to jump three spaces', this.width / 2, 290);
    }

    if (this.settings.playerCount > 1) {
      this.ctx.fillText('Player One:', this.width / 2, 200);
      this.ctx.fillText('Player Two:', this.width / 2, 350);
      this.ctx.fillText('i to jump one space', this.width / 2, 380);
      this.ctx.fillText('o to jump two spaces', this.width / 2, 410);
      if (this.settings.tripleJumps) {
        this.ctx.fillText('p to jump three spaces', this.width / 2, 440);
      }
    }
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}

module.exports = StartMenu;

},{}],10:[function(require,module,exports){
!function(n,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):n.Timer=t()}(this,function(){"use strict";function n(n,t,e){var o=void 0,i="";for(o=0;o<t;o+=1)i+=String(e);return(i+n).slice(-i.length)}function t(){this.secondTenths=0,this.seconds=0,this.minutes=0,this.hours=0,this.days=0,this.toString=function(t,e,o){t=t||["hours","minutes","seconds"],e=e||":",o=o||2;var i=[],r=void 0;for(r=0;r<t.length;r+=1)void 0!==this[t[r]]&&i.push(n(this[t[r]],o,"0"));return i.join(e)}}function e(){return"undefined"!=typeof document}function o(){return S}function i(n,t){return(n%t+t)%t}var r="undefined"!=typeof window?window.CustomEvent:void 0;"undefined"!=typeof window&&"function"!=typeof r&&((r=function(n,t){t=t||{bubbles:!1,cancelable:!1,detail:void 0};var e=document.createEvent("CustomEvent");return e.initCustomEvent(n,t.bubbles,t.cancelable,t.detail),e}).prototype=window.Event.prototype,window.CustomEvent=r);var s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},u=10,d=60,c=60,f=24,a=0,v=1,h=2,l=3,p=4,m="secondTenths",y="seconds",b="minutes",w="hours",g="days",E={secondTenths:100,seconds:1e3,minutes:6e4,hours:36e5,days:864e5},T={secondTenths:u,seconds:d,minutes:c,hours:f},S="undefined"!=typeof module&&module.exports&&"function"==typeof require?require("events"):void 0;return function(){function n(n,t){var e=Math.floor(t);X[n]=e,W[n]=n!==g?i(e,T[n]):e}function r(n){return U(n,g)}function j(n){return U(n,w)}function C(n){return U(n,b)}function M(n){return U(n,y)}function L(n){return U(n,m)}function U(t,e){var o=X[e];return n(e,t/E[e]),X[e]!==o}function V(){A(),z()}function A(){clearInterval(Y),Y=void 0,$=!1,_=!1}function k(n){Q()?(cn=D(),sn=F(rn.target)):R(n),x()}function x(){var n=E[nn];O(q(Date.now()))||(Y=setInterval(P,n),$=!0,_=!1)}function D(){return q(Date.now())-X.secondTenths*E[m]*tn}function P(){var n=q(Date.now()),t=tn>0?n-cn:cn-n,e={};e[m]=L(t),e[y]=M(t),e[b]=C(t),e[w]=j(t),e[g]=r(t),I(e),en(an.detail.timer),O(n)&&(K("targetAchieved",an),J())}function q(n){return Math.floor(n/E[nn])*E[nn]}function I(n){n[m]&&K("secondTenthsUpdated",an),n[y]&&K("secondsUpdated",an),n[b]&&K("minutesUpdated",an),n[w]&&K("hoursUpdated",an),n[g]&&K("daysUpdated",an)}function O(n){return sn instanceof Array&&n>=fn}function z(){for(var n in W)W.hasOwnProperty(n)&&"number"==typeof W[n]&&(W[n]=0);for(var t in X)X.hasOwnProperty(t)&&"number"==typeof X[t]&&(X[t]=0)}function R(n){nn="string"==typeof(n=n||{}).precision?n.precision:y,en="function"==typeof n.callback?n.callback:function(){},dn=!0===n.countdown,tn=!0===dn?-1:1,"object"===s(n.startValues)&&G(n.startValues),cn=D(),"object"===s(n.target)?sn=F(n.target):dn&&(n.target={seconds:0},sn=F(n.target)),on={precision:nn,callback:en,countdown:"object"===(void 0===n?"undefined":s(n))&&!0===n.countdown,target:sn,startValues:un},rn=n}function B(n){var t=void 0,e=void 0,o=void 0,i=void 0,r=void 0,m=void 0;if("object"===(void 0===n?"undefined":s(n)))if(n instanceof Array){if(5!==n.length)throw new Error("Array size not valid");m=n}else m=[n.secondTenths||0,n.seconds||0,n.minutes||0,n.hours||0,n.days||0];for(var y=0;y<n.length;y+=1)n[y]<0&&(n[y]=0);return t=m[a],e=m[v]+Math.floor(t/u),o=m[h]+Math.floor(e/d),i=m[l]+Math.floor(o/c),r=m[p]+Math.floor(i/f),m[a]=t%u,m[v]=e%d,m[h]=o%c,m[l]=i%f,m[p]=r,m}function F(n){if(n){var t=H(sn=B(n));return fn=cn+t.secondTenths*E[m]*tn,sn}}function G(n){un=B(n),W.secondTenths=un[a],W.seconds=un[v],W.minutes=un[h],W.hours=un[l],W.days=un[p],X=H(un,X)}function H(n,t){var e=t||{};return e.days=n[p],e.hours=e.days*f+n[l],e.minutes=e.hours*c+n[h],e.seconds=e.minutes*d+n[v],e.secondTenths=e.seconds*u+n[[a]],e}function J(){V(),K("stopped",an)}function K(n,t){e()?Z.dispatchEvent(new CustomEvent(n,t)):o()&&Z.emit(n,t)}function N(){return $}function Q(){return _}var W=new t,X=new t,Y=void 0,Z=e()?document.createElement("span"):o()?new S.EventEmitter:void 0,$=!1,_=!1,nn=void 0,tn=void 0,en=void 0,on={},rn=void 0,sn=void 0,un=void 0,dn=void 0,cn=void 0,fn=void 0,an={detail:{timer:this}};void 0!==this&&(this.start=function(n){N()||(k(n),K("started",an))},this.pause=function(){A(),_=!0,K("paused",an)},this.stop=J,this.reset=function(){V(),k(rn),K("reset",an)},this.isRunning=N,this.isPaused=Q,this.getTimeValues=function(){return W},this.getTotalTimeValues=function(){return X},this.getConfig=function(){return on},this.addEventListener=function(n,t){e()?Z.addEventListener(n,t):o()&&Z.on(n,t)},this.removeEventListener=function(n,t){e()?Z.removeEventListener(n,t):o()&&Z.removeListener(n,t)})}});

},{"events":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":24}],13:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],14:[function(require,module,exports){
/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;

},{}],15:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    getRawTag = require('./_getRawTag'),
    objectToString = require('./_objectToString');

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;

},{"./_Symbol":12,"./_getRawTag":21,"./_objectToString":23}],16:[function(require,module,exports){
/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;

},{}],17:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    arrayMap = require('./_arrayMap'),
    isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":12,"./_arrayMap":13,"./isArray":27,"./isSymbol":29}],18:[function(require,module,exports){
var baseSlice = require('./_baseSlice');

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;

},{"./_baseSlice":16}],19:[function(require,module,exports){
var castSlice = require('./_castSlice'),
    hasUnicode = require('./_hasUnicode'),
    stringToArray = require('./_stringToArray'),
    toString = require('./toString');

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;

},{"./_castSlice":18,"./_hasUnicode":22,"./_stringToArray":25,"./toString":30}],20:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],21:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;

},{"./_Symbol":12}],22:[function(require,module,exports){
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;

},{}],23:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;

},{}],24:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":20}],25:[function(require,module,exports){
var asciiToArray = require('./_asciiToArray'),
    hasUnicode = require('./_hasUnicode'),
    unicodeToArray = require('./_unicodeToArray');

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;

},{"./_asciiToArray":14,"./_hasUnicode":22,"./_unicodeToArray":26}],26:[function(require,module,exports){
/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;

},{}],27:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],28:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],29:[function(require,module,exports){
var baseGetTag = require('./_baseGetTag'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;

},{"./_baseGetTag":15,"./isObjectLike":28}],30:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":17}],31:[function(require,module,exports){
var createCaseFirst = require('./_createCaseFirst');

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;

},{"./_createCaseFirst":19}]},{},[3]);
