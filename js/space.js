const _types = ["blank", "shyguy", "flyguy", "ice"];
const _imageSrcs = [
  "./assets/ground.png",
  "./assets/enemies.png",
  "./assets/enemies.png",
  "./assets/enemies.png",
  "./assets/sign.png"
];

class Space {
  constructor(typeIndex, spaceNum, current = false, last = false) {
    this.spaceNum = spaceNum;
    this.typeIndex = typeIndex;
    this.type = _types[typeIndex];
    this.image = this.setTile();
    this.obstacle = this.setObstacle();
    this.dx = spaceNum * 50;
    this.sy = this.setSY();
    this.sh = this.setSH();
    this.sw = this.setSW();
    this.characterFrame = 0;
    this.last = last;
    this.sign = this.setSign();
  }

  setTile() {
    const image = new Image();
    image.src = _imageSrcs[0];
    return image;
  }

  setObstacle() {
    const image = new Image();
    image.src =  _imageSrcs[this.typeIndex];
    return image;
  }

  setSign() {
    const image = new Image();
    image.src = _imageSrcs[4];
    return image;
  }

  setSH() {
    switch (this.typeIndex) {
      case 1:
      return 30;
      case 2:
      return 35;
      case 3:
      return 35;
      default:
      return null;
    }
  }

  setSW() {
    switch (this.typeIndex) {
      case 1:
      return 20;
      case 2:
      return 20;
      case 3:
      return 20;
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
      case 3:
        return 32;
      default:
        return null;
    }
  }
}

module.exports = Space;
