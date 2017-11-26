const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

const _colors = ["red", "blue"];

const _easyMode = {
  x: 100,
  y: 96,
  oneForwardSlide: 4.17,
  twoForwardSlides: 6.25,
  yIncrement: 8,
  oneJumpHeight: 64,
  twoJumpHeight: 48,
};

class HumanPlayer {
  constructor(i, ctx, ground) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.timer = new Timer();
    this.timer.start({precision: 'secondTenths'});
    this.x = 100;
    this.y = 96;
    this.color = _colors[i - 1];
    this.character = this.setImage();
    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.jumpHeight = 0;
    this.characterFrame = 75;
    this.ground = ground;
  }

  setImage() {
    const image = new Image();
    image.src = "./assets/toads.png";
    return image;
  }

  drawPlayer() {
    // context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
    this.ctx.drawImage(this.character, this.characterFrame, 0, 25, 33, this.x, this.y, 37.5, 49.5);
    if (this.jumping === true) {
      let forwardSlide;
      if (this.jumpHeight === 64) {
        forwardSlide = 4.17;
      } else {
        forwardSlide = 6.25;
      }
      this.ground.slideForward(forwardSlide);
      if (this.y === 96) {
        this.characterFrame = 75;
      } else if (this.y >= 64) {
        this.characterFrame = 100;
      } else if (this.y >= 32) {
        this.characterFrame = 125;
      }

      if (this.falling === false) {
        if (this.y >= this.jumpHeight) {
          this.y -= 8;
        } else {
          this.falling = true;
        }
      } else {
        if (this.y < 96) {
          this.y += 8;
        } else {
          this.falling = false;
          this.jumping = false;
          if (this.ground.current.x > 80 && this.ground.current.x < 120 && this.ground.current.type !== "blank") {
            this.crashing = true;
            this.characterFrame = 350;
            let backwardSlide;
            if (this.jumpHeight === 64) {
              backwardSlide = 4.17;
            } else {
              backwardSlide = 6.25;
            }
            this.ground.slideBackward(backwardSlide);
          }
        }
      }
    }

    //
    // img	Source image object	Sprite sheet
    // sx	Source x	Frame index times frame width
    // sy	Source y	0
    // sw	Source width	Frame width
    // sh	Source height	Frame height
    // dx	Destination x	0
    // dy	Destination y	0
    // dw	Destination width	Frame width
    // dh	Destination height	Frame height

  }

  drawTime() {
    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 50, this.playerNumber * 20);
  }

  jump(spaces) {
    if (this.jumping === false) {
      console.log(`I'm jumping ${spaces} spaces!`);
      this.jumping = true;
      if (spaces === 1) {
        this.jumpHeight = 64;
      } else {
        this.jumpHeight = 48;
      }
    }
  }
}

module.exports = HumanPlayer;
