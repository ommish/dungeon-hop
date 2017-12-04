const Space = require('./space.js');

class Ground {
  constructor(i, ctx, path) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.path = path;
    // this.peach = this.setPeach();
    this.background = this.setBackground();
  }

  setBackground() {
    const image = new Image();
    image.src = "./assets/backdrop.png";
    return image;
  }
  // 
  // setPeach() {
  //   const image = new Image();
  //   image.src = "./assets/peach.png";
  //   return image;
  // }

  drawBackground() {
    // context.drawImage(img,          sx,sy, sw, sh, dx,                             dy,      dw, dh)
    this.ctx.drawImage(this.background, 10, 10, 200, 100, 0, this.playerNumber === 1 ? 0 : 300, 500, 219);
    // this.ctx.fillStyle = "black";
    // this.ctx.fillRect(0, this.playerNumber === 1 ? 0 : 300, 500, 219);
  }

  drawGround() {
    this.drawBackground();

    this.path.spaces.forEach((space) => {
      // context.drawImage(img,      sx, sy, sw, sh, dx,                                dy,          dw, dh)
      this.ctx.drawImage(space.image, 0, 0, 100, 100, space.dx, this.playerNumber === 1 ? 219 : 519, 81, 81);
      if (space.dx >= 141.75 && space.dx < 222.75) {
        this.current = space;
      }
      if (space.type !== "blank") {
        // context.drawImage(img,          sx,                   sy,       sw, sh,       dx,                                      dy,    dw, dh)
        this.ctx.drawImage(space.obstacle, space.sx, space.sy, space.sw, space.sh, space.dx + 22.5, this.playerNumber === 1 ? 185 : 485, 42, 42);
        space.drawCount++;
        if (space.drawCount === 3) {
          space.drawCount = 0;
          if (space.sx <= 1500) {
            space.sx += 190;
          } else {
            space.sx = 0;
          }
        }
      }
      if (space.last) {
        this.ctx.drawImage(space.sign, 0, 0, 20, 30, space.dx + 20.5, this.playerNumber === 1 ? 178 : 478, 36, 45);
        // this.ctx.drawImage(this.peach, 5, 5, 55, 100, space.dx + 100, this.playerNumber === 1 ? 165 : 465, 35, 55);
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
