const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.path = path;
  }

  drawGround() {
    this.path.spaces.forEach((space) => {
      if (space.dx >= -90 && space.dx <= 500) {
        if (!space.tile) {
          space.setObjectImage();
          space.setTile();
        }
        this.ctx.drawImage(space.tile, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 90, 90);
        if (space.dx >= 170 && space.dx < 190) {
          this.current = space;
        }
        if (space.type > 0) {
          this.ctx.drawImage(space.objectImage, space.sx, space.sy, space.sw, space.sh, space.dx + 22.5, this.playerNumber === 1 ? space.dy : space.dy + 300, space.dw, space.dh);
        }
        if (space.type === 1 || space.type === 4) {
          space.incrementSx();
        }
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
