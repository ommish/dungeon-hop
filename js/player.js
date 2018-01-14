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
    if (!this.human && this.settings.computerLevel >= 0.9 && Math.random() >= 0.5) {
      return spaces;
    }
    switch (spaces) {
      case 3:
      return 1;
      case 2:
      return 1;
      case 1:
      return 2;
    }
  }

  setJump(spaces) {

    if (this.confused) spaces = this.scrambleSpaces(spaces);

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
    if (this.settings.yIncrement === 8 ) {
      AIjumpInterval = 800;
    } else if (this.settings.yIncrement === 6) {
      AIjumpInterval = 1000;
    } else {
      AIjumpInterval = 1200;
    }
    AIjumpInterval -= (this.settings.computerLevel ** 2) * 400;
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
