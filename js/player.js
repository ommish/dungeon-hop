const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

const _colors = ["red", "blue"];

class HumanPlayer {
  constructor(i, ctx) {
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
    this.jumpHeight = 0;
    this.characterFrame = 75;
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
      if (this.y === 96) {
        this.characterFrame = 75;
      } else if (this.y >= 64) {
        this.characterFrame = 100;
      } else if (this.y >= 32) {
        this.characterFrame = 125;
      }
      if (this.falling === false) {
        if (this.y === 96) {
          this.characterFrame = 75;
        } else if (this.y >= 64) {
          this.characterFrame = 100;
        } else if (this.y >= 32) {
          this.characterFrame = 125;
        }
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
    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 500, 500);
  }

  jump(spaces) {
    console.log(`I'm jumping ${spaces} spaces!`);
    if (this.jumping === false) {
      this.jumping = true;
      if (spaces === 1) {
        this.jumpHeight = 64;
      } else {
        this.jumpHeight = 32;
      }
    }
  }
}

module.exports = HumanPlayer;
