const PlayerState = require('./player_state.js');

class Player {
  constructor(i, ctx, ground, settings, human = true) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.ground = ground;
    this.settings = settings;
    this.human = human;
    this.state = new PlayerState();

    this.sx = 1500;
    this.sy = (i - 1) * 330;
    this.x = 182.25;
    this.baseY = this.playerNumber === 1 ? 160 : 460;
    this.y = this.baseY;
    this.jumpHeight = 0;

    this.character = this.setImage("./assets/marios.png");
    this.bang = this.setImage("./assets/bang.png");
    this.sparkle = this.setImage("./assets/sparkles.png");
    this.jumping = false;
    this.falling = false;
    this.crashing = false;
    this.finishTime = null;
    this.invincible = false;

    this.calculateAndJump = this.calculateAndJump.bind(this);
    this.endInvincible = this.endInvincible.bind(this);

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
      delta = this.settings.oneSlide;
    } else if (this.jumpHeight === this.baseY - 96) {
      delta = this.settings.twoSlides;
    } else {
      delta = this.settings.threeSlides;
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
    if (this.ground.current.dx > 160 && this.ground.current.dx < 164 && this.ground.current.type === 1 && !this.invincible) {
      this.crashing = true;
      this.jumping = true;
    } else if (this.ground.current.dx > 160 && this.ground.current.dx < 164 && this.ground.current.type === 2) {
      if (this.ground.current.typeName === "star") {
        this.startInvincible();
      } else {
        // some other bonus for other item
      }
    }
  }

  startInvincible() {
    this.invincible = true;
    window.setTimeout(this.endInvincible, 8000);
  }

  endInvincible() {
    this.invincible = false;
  }

  handleFinish() {
    if ((this.ground.current.dx > 160 && this.ground.current.dx < 164) && (this.ground.current.spaceNum >= 103) && (!this.finishTime)) {
      this.finishTime = new Date();
    }
  }

  incrementY(direction) {
    this.y += this.settings.yIncrement * direction;
  }

  drawPlayer() {
    if (this.invincible) {
      this.ctx.drawImage(this.sparkle, 300 * Math.floor(Math.random() * 4), 0, 300, 340, this.x - 15, this.y, 80, 80);
    }
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
    if (this.human) {
      console.log("jumping");
    }
    if (!this.falling) {
      if (this.y > this.jumpHeight) {
        this.incrementY(-1);
      } else {
        this.falling = true;
        // if (this.human) {
        //   console.log(this.y);
        // }
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
      } else if (spaces === 2){
        this.jumpHeight = this.baseY - 96;
      } else if (spaces === 3) {
        this.jumpHeight = this.baseY - 120;
      }
    }
  }

  startAI() {
    this.interval = window.setInterval(this.calculateAndJump, 400);
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
