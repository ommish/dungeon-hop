const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
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
    // context.drawImage(img,           sx, sy, sw, sh, dx, dy, dw, dh)
    this.ctx.drawImage(this.background, 120, 100, 350, 80, 0, 0, 350, 150);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      // context.drawImage(img,      sx, sy, sw, sh, dx, dy, dw, dh)
      this.ctx.drawImage(space.image, 0, 0, 50, 50, space.x, 145, 50, 50);
      if (space.x > 80 && space.x < 120) {
        this.current = space;
      }
      if (space.type !== "blank") {
        this.ctx.drawImage(space.obstacle, 0, space.y, 20, 25, space.x, 115, 25, 30);
      }
    });
  }

  slideForward(forwardSlide) {
    this.path.spaces.forEach((space) => {
      space.x -= forwardSlide;
    });
  }

  slideBackward(backwardSlide) {
    this.path.spaces.forEach((space) => {
      space.x += backwardSlide;
    });
  }

}

module.exports = Ground;
