class Path {
  constructor(i) {
    this.pathNumber = i;
    this.character = this.setImage(this.ctx);
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
  }
}

module.exports = Path;
