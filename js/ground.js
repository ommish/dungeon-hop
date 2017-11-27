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
    image.src = "./assets/backdrop.png";
    return image;
  }

  drawBackground() {
    // context.drawImage(img,          sx,sy, sw, sh, dx,                             dy,     dw, dh)
    this.ctx.drawImage(this.background, 5, 10, 250, 100, 0, this.playerNumber === 1 ? 0 : 200, 350, 150);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      // context.drawImage(img,      sx, sy, sw, sh, dx,                                dy,        dw, dh)
      this.ctx.drawImage(space.image, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 150 : 350, 50, 50);
      if (space.dx >= 87.5 && space.dx < 137.5) {
        this.current = space;
      }
      if (space.type !== "blank") {
        // context.drawImage(img,          sx,                   sy,       sw, sh,       dx,                                         dy,    dw, dh)
        this.ctx.drawImage(space.obstacle, space.characterFrame, space.sy, space.sw, space.sh, space.dx + 10, this.playerNumber === 1 ? 126 : 326, 20, 30);
        if (space.characterFrame < 75) {
          space.characterFrame += 25;
        } else {
          space.characterFrame = 0;
        }
      }
      if (space.last) {
        this.ctx.drawImage(space.sign, 0, 0, 20, 30, space.dx + 10, this.playerNumber === 1 ? 126 : 326, 20, 30);
      }
    });
  }
  
  slide(delta) {
    this.path.spaces.forEach((space) => {
      space.dx += delta;
    });
  }

}

module.exports = Ground;
