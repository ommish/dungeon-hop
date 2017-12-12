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
    image.src = this.playerNumber === 1 ? "./assets/castle.png" : "./assets/hotel.png";
    return image;
  }

  drawBackground() {
    // context.drawImage(img,           sx,sy, sw, sh, dx,                             dy,      dw, dh)
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, this.playerNumber === 1 ? 0 : 300, 500, 300);
    this.ctx.drawImage(this.background, 0, 0, 352, 203, 100, this.playerNumber === 1 ? 70 : 375, 275, 150);
  }

  drawGround() {
    this.drawBackground();
    this.path.spaces.forEach((space) => {
      if (space.dx >= -90 && space.dx <= 500) {
        if (!space.tile) {
          space.setObjectImage();
          space.setTile();
        }
        this.ctx.drawImage(space.tile, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 90, 90);
        if (space.dx >= 180 && space.dx < 270) {
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
