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
    // context.drawImage(img,          sx,sy, sw, sh, dx,                             dy,      dw, dh)
    this.ctx.drawImage(this.background, 10, 10, 200, 100, 0, this.playerNumber === 1 ? 0 : 300, 500, 219);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      this.ctx.drawImage(space.tile, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 81, 81);
      if (space.dx >= 141.75 && space.dx < 222.75) {
        this.current = space;
      }
      if (space.type === 2 || space.type === 3) {
        this.ctx.drawImage(space.object, space.sx, space.sy, space.sw, space.sh, space.dx + 20.5, this.playerNumber === 1 ? 178 : 478, space.dw, space.dh);
      } else if (space.type === 1) {
        this.ctx.drawImage(space.object, space.sx, space.sy, space.sw, space.sh, space.dx + 22.5, this.playerNumber === 1 ? 185 : 485, space.dw, space.dh);
        space.incrementSx();
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
