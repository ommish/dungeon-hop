const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
    this.ctx = ctx;
    this.path = path;
  }

    drawGround() {
      this.path.spaces.forEach((space, i) => {
        // context.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        // this.ctx.drawImage(space.image, 0, 0, 50, 50, (i * 50), 100, 50, 50);
      });
    }

  }

  module.exports = Ground;
