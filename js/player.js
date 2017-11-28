
class Player {
  constructor(i, ctx, ground, mode, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.ground = ground;
    this.mode = mode;
    this.human = human;

    this.characterFrame = 0;
    this.x = 112.5;
    this.baseY = this.playerNumber === 1 ? 118 : 318;
    this.y = this.baseY;
    this.jumpHeight = 0;
    this.jumpInterval = this.mode.computerLevel === 1 ? 400 : 500;

    this.character = this.setImage();

    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.finished = false;

    this.calculateAndJump = this.calculateAndJump.bind(this);

    if (!this.human) {this.startAI();}
  }

  setImage() {
    const image = new Image();
    image.src = "./assets/jaghami.png";
    return image;
  }

  slideGround(direction) {
    let delta;
      if (this.jumpHeight === this.baseY - 32) {
        delta = this.mode.oneSlide;
      } else {
        delta = this.mode.twoSlides;
      }
    this.ground.slide(delta * direction);
  }

  setCharacterFrame() {
    if (this.y === this.baseY) {
      this.characterFrame = 2;
    } else if (this.y >= this.baseY - 20) {
      this.characterFrame = 27;
    } else if (this.y >= this.baseY - 40) {
      this.characterFrame = 52;
    }
  }

  land() {
    this.falling = false;
    this.jumping = false;
    this.crashing = false;
  }

  handleCollision() {
    if (Math.round(this.ground.current.dx) === 100 && this.ground.current.typeIndex > 0) {
      this.crashing = true;
      this.characterFrame = 350;
    }
  }

  handleFinish() {
    if (Math.round(this.ground.current.dx) === 100 && this.ground.current.spaceNum >= 103) {
      this.finished = true;
    }
  }

  incrementY(direction) {
    this.y += this.mode.yIncrement * direction;
  }

  drawPlayer() {
    this.ctx.drawImage(this.character, this.characterFrame, 2, 20, 30, this.x, this.y, 25, 33);
    this.setCharacterFrame();
    if (this.crashing) {
      this.slideGround(1);
      this.jump();
    } else if (this.jumping) {
      this.slideGround(-1);
      this.jump();
    } else if (this.finished) {
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
        this.jumpHeight = this.baseY - 32;
      } else {
        this.jumpHeight = this.baseY - 48;
      }
    }
  }

  startAI() {
    this.interval = window.setInterval(this.calculateAndJump, this.jumpInterval);
  }

  stopAI() {
    window.clearInterval(this.interval);
  }

  calculateAndJump(){
    if (!this.jumping && !this.finished) {
      if (this.ground.path.spaces[this.ground.current.spaceNum + 1].typeIndex > 0) {
        this.setJump(2);
      } else if (this.ground.path.spaces[this.ground.current.spaceNum + 2].typeIndex > 0) {
        this.setJump(1);
      } else {
        let spaces = Math.floor(Math.random() * 10) % 2 + 1;
        this.setJump(spaces);
      }
    } else if (this.finished) {
      window.clearInterval(this.interval);
    }
  }
}

module.exports = Player;
