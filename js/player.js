const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

const _colors = ["red", "blue"];

class HumanPlayer {
  constructor(i, ctx) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.timer = new Timer();
    this.timer.start({precision: 'secondTenths'});
    this.x = 100;
    this.y = 100;
    this.color = _colors[i - 1];
    this.character = this.setImage(this.ctx);
    this.jumping = false;
    this.falling = false;
    this.jumpHeight = 0;
  }

  setImage(ctx) {
    const image = new Image();
    image.src = "./assets/toad_sprite.png";
    return image;
  }

  drawPlayer() {
    // context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
    this.ctx.drawImage(this.character, 50, 50, 50, 50, this.x, this.y, 50, 50);
    if (this.jumping === true) {
      if (this.falling === false) {
        if (this.y >= this.jumpHeight) {
          this.y -= 8;
        } else {
          this.falling = true;
        }
      } else {
        if (this.y < 100) {
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

    // this.ctx.beginPath();
    // this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    // this.ctx.fillStyle = this.color;
    // this.ctx.fill();
    // this.ctx.lineWidth = 5;
    // this.ctx.strokeStyle = '#003300';
    // this.ctx.stroke();
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
        this.jumpHeight = 50;
      } else {
        this.jumpHeight = 20;
      }
    }
  }
}

module.exports = HumanPlayer;
