const _types = ["blank", "shyguy", "flyguy", "finish"];

class Space {
  constructor(typeIndex, spaceNum, current = false, last = false) {
    this.spaceNum = spaceNum;
    this.typeIndex = typeIndex;
    this.type = _types[typeIndex];
    this.image = this.setImage();
    this.obstacle = this.setObstacle();
    this.dx = spaceNum * 50;
    this.sy = this.setSY();
    this.sh = this.setSH();
    this.characterFrame = 0;
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

  setSH() {
    switch (this.typeIndex) {
      case 1:
      return 30;
      case 2:
      return 35;
      default:
      return null;
    }
  }

  setSY() {
    switch (this.typeIndex) {
      case 1:
        return 0;
      case 2:
        return 32;
      default:
        return null;
    }
  }
}

module.exports = Space;
