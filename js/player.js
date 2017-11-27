
class Player {
  constructor(i, ctx, ground, mode, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.x = 112.5;
    this.baseY = this.playerNumber === 1 ? 118 : 318;
    this.y = this.baseY;
    this.character = this.setImage();
    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.jumpHeight = 0;
    this.characterFrame = 75;
    this.ground = ground;
    this.finished = false;
    this.mode = mode;
    this.human = human;
    this.jumpInterval = this.mode.computerLevel === 1 ? 450 : 350;

    this.calculateAndJump = this.calculateAndJump.bind(this);

    if (!this.human) {this.startAI();}
  }

  setImage() {
    const image = new Image();
    image.src = "./assets/toads.png";
    return image;
  }

  drawPlayer() {
    this.ctx.drawImage(this.character, this.characterFrame, 0, 25, 33, this.x, this.y, 25, 33);

    if (this.jumping === true) {

      let forwardSlide;
      if (this.jumpHeight === this.baseY - 32) {
        forwardSlide = this.mode.oneForwardSlide;
      } else {
        forwardSlide = this.mode.twoForwardSlides;
      }
      this.ground.slideForward(forwardSlide);

      if (this.y === this.baseY) {
        this.characterFrame = 75;
      } else if (this.y >= this.baseY - 20) {
        this.characterFrame = 100;
      } else if (this.y >= this.baseY - 30) {
        this.characterFrame = 125;
      }

      if (this.falling === false) {
        if (this.y > this.jumpHeight) {
          this.y -= this.mode.yIncrement;
        } else {
          this.falling = true;
        }
      } else {
        if (this.y < this.baseY) {
          this.y += this.mode.yIncrement;
        } else {

          this.falling = false;
          this.jumping = false;
          if (Math.round(this.ground.current.dx) === 100 && this.ground.current.typeIndex > 0) {
            this.crashing = true;
            this.characterFrame = 350;
            let backwardSlide;
            if (this.jumpHeight === this.baseY - 32) {
              backwardSlide = 50;
            } else {
              backwardSlide = 100;
            }
            this.ground.slideBackward(backwardSlide);
            this.crashing = false;
          }

          if (Math.round(this.ground.current.dx) === 100 && this.ground.current.spaceNum >= 103) {
            this.finished = true;
          }
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
        let spaces = Math.floor(Math.random() * 10) % 2 + 1;
        this.jump(spaces);
      } else {
        this.jump(2);
      }
    } else if (this.finished) {
      window.clearInterval(this.interval);
    }
  }
}

module.exports = Player;
