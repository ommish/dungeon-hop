
class Player {
  constructor(i, ctx, ground, mode, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.ground = ground;
    this.mode = mode;
    this.human = human;

    this.characterFrame = 75;
    this.x = 112.5;
    this.baseY = this.playerNumber === 1 ? 118 : 318;
    this.y = this.baseY;
    this.jumpHeight = 0;
    this.jumpInterval = this.mode.computerLevel === 1 ? 450 : 350;

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
    image.src = "./assets/toads.png";
    return image;
  }

  slideGround(direction) {
    let delta;
    if (direction === -1) {
      if (this.jumpHeight === this.baseY - 32) {
        delta = this.mode.oneForwardSlide;
      } else {
        delta = this.mode.twoForwardSlides;
      }
    } else {
      if (this.jumpHeight === this.baseY - 32) {
        delta = 50;
      } else {
        delta = 100;
      }
    }
    this.ground.slide(delta * direction);
  }

  setCharacterFrame() {
    if (this.y === this.baseY) {
      this.characterFrame = 75;
    } else if (this.y >= this.baseY - 20) {
      this.characterFrame = 100;
    } else if (this.y >= this.baseY - 30) {
      this.characterFrame = 125;
    }
  }

  land() {
    this.falling = false;
    this.jumping = false;
  }

  handleCollision() {
    if (Math.round(this.ground.current.dx) === 100 && this.ground.current.typeIndex > 0) {
      this.crashing = true;
      this.characterFrame = 350;
      this.slideGround(1);
      this.crashing = false;
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
    this.ctx.drawImage(this.character, this.characterFrame, 0, 25, 33, this.x, this.y, 25, 33);

    if (this.jumping === true) {

      this.slideGround(-1);
      this.setCharacterFrame();

      if (this.falling === false) {
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

  }

  jump(spaces) {
    if (this.jumping === false) {
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

  calculateAndJump(){
    if (!this.jumping && !this.finished) {
      if (this.ground.path.spaces[this.ground.current.spaceNum + 1].typeIndex > 0) {
        this.jump(2);
      } else if (this.ground.path.spaces[this.ground.current.spaceNum + 2].typeIndex > 0) {
        this.jump(1);
      } else {
        let spaces = Math.floor(Math.random() * 10) % 2 + 1;
        this.jump(spaces);
      }
    } else if (this.finished) {
      window.clearInterval(this.interval);
    }
  }
}

module.exports = Player;
