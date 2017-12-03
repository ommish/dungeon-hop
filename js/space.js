const _types = ["blank", "spikey", "spikeBeetle", "whacka"];
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
    this.dx = spaceNum * 81;
    this.sx = 0; //(Math.floor(Math.random() * 10) % 4) * 190;
    this.sy = this.setSY();
    this.sh = this.setSH();
    this.sw = this.setSW();
    this.last = last;
    this.sign = this.setSign();
    this.drawCount = 0;
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
      return 175;
      case 2:
      return 190;
      case 3:
      return 165;
      default:
      return null;
    }
  }

  setSW() {
    switch (this.typeIndex) {
      case 1:
      return 190;
      case 2:
      return 190;
      case 3:
      return 190;
      default:
      return null;
    }
  }

  setSY() {
    switch (this.typeIndex) {
      case 1:
        return 0;
      case 2:
        return 175;
      case 3:
        return 365;
      default:
        return null;
    }
  }
}

module.exports = Space;
