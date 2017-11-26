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
    image.src = "./assets/toad_sprite.png";
    return image;
  }

  drawBackground() {
    // context.drawImage(img,           sx,  sy,  sw, sh, dx,                            dy,     dw, dh)
    this.ctx.drawImage(this.background, 120, 100, 350, 80, 0, this.playerNumber === 1 ? 0 : 200, 350, 150);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      // context.drawImage(img,      sx, sy, sw, sh, dx,                                dy,        dw, dh)
      this.ctx.drawImage(space.image, 0, 0, 50, 50, space.sx, this.playerNumber === 1 ? 150 : 350, 49, 50);
      if (space.dx === 100) {
        this.current = space;
      }
      if (space.type !== "blank") {
        // context.drawImage(img,          sx,                   sy,       sw, sh,       dx,                                         dy,    dw, dh)
        this.ctx.drawImage(space.obstacle, space.characterFrame, space.sy, 20, space.sh, space.dx + 10, this.playerNumber === 1 ? 126 : 326, 20, 30);
        if (space.characterFrame < 75) {
          space.characterFrame += 25;
        } else {
          space.characterFrame = 0;
        }
      }
    });
  }

  slideForward(forwardSlide) {
    this.path.spaces.forEach((space) => {
      space.dx -= forwardSlide;
    });
  }

  slideBackward(backwardSlide) {
    this.path.spaces.forEach((space) => {
      space.dx += backwardSlide;
    });
  }

}

module.exports = Ground;
