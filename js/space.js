const _types = ["blank", "shyguy", "flyguy"];

class Space {
  constructor(typeIndex, spaceNum, current = false) {
    this.typeIndex = typeIndex;
    this.type = _types[typeIndex];
    this.image = this.setImage();
    this.obstacle = this.setObstacle();
    this.x = spaceNum * 50;
    this.setY();
  }

  setImage() {
    const image = new Image();
    image.src = "./assets/space.png";
    return image;
  }

  setObstacle() {
    const image = new Image();
    image.src = "./assets/enemies.png";
    return image;
  }

  setY() {
    switch (this.typeIndex) {
      case 1:
        this.y = 0;
        return;
        case 2:
        this.y = 36;
        return;
      default:
        this.y = null;
        return;
    }
  }
}

module.exports = Space;
