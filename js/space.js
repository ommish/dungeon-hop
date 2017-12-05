const _imageSrcs = { 0: ["./assets/ground.png"], 1: ["./assets/enemies.png"], 2: ["./assets/items.png"], 3: ["./assets/sign.png"], 4: ["./assets/peach.png"]};

class Space {
  constructor(type, spaceNum, enemyTypes = 0, current = false, last = false) {
    this.type = type;
    this.spaceNum = spaceNum;
    this.enemyType = Math.floor(Math.random() * enemyTypes);
    this.itemType = Math.floor(Math.random() * 2);
    this.tile = this.setTile();
    this.object = this.setObject();
    this.dx = spaceNum * 81;
    this.dy = this.setDY();
    this.sx = this.setSX();
    this.sy = this.setSY();
    this.sh = this.setSH();
    this.sw = this.setSW();
    this.dw = this.setDW();
    this.dh = this.setDH();
    this.last = last;
    this.drawCount = 0;
  }

  setTile() {
    const image = new Image();
    image.src = _imageSrcs[0][0];
    return image;
  }

  setObject() {
    if (this.type === 0) {return null;}
    const image = new Image();
    image.src = _imageSrcs[this.type][0];
    return image;
  }

  setSH() {
    switch (this.type) {
      case 1:
      switch (this.enemyType) {
        case 0:
        return 175;
        case 1:
        return 190;
        case 2:
        return 165;
        default:
        return 0;
      }
      case 2:
      return 50;
      case 3:
      return 30;
      case 4:
      return 110;
      default:
      return 0;
    }
  }

  setSW() {
    switch (this.type) {
      case 1:
        switch (this.enemyType) {
          case 0:
          return 190;
          case 1:
          return 190;
          case 2:
          return 190;
          default:
          return 0;
        }
      case 2:
      switch (this.itemType) {
        case 0:
        return 50;
        case 1:
        return 50;
        default:
        return 0;
      }
      case 3:
      return 20;
      case 4:
      return 65;
      default:
      return 0;
    }
  }

  setSY() {
    switch (this.type) {
      case 1:
        switch (this.enemyType) {
          case 0:
          return 0;
          case 1:
          return 175;
          case 2:
          return 365;
          default:
          return 0;
        }
      case 2:
      switch (this.itemType) {
        case 0:
        return 245;
        case 1:
        return 245;
        default:
        return 0;
      }
      case 3:
      return 0;
      case 4:
      return 3;
      default:
      return 0;
    }
  }

  setSX() {
    switch (this.type) {
      case 1:
      return 0;
      case 2:
        switch (this.itemType) {
          case 0:
          return 660;
          case 1:
          return 360;
          default:
          return 0;
        }
      case 3:
      return 0;
      case 4:
      return 3;
      default:
      return 0;
    }
  }

  setDW() {
    switch (this.type) {
      case 1:
      return 42;
      case 2:
      return 36;
      case 3:
      return 36;
      case 4:
      return 40;
      default:
      return 0;
    }
  }

  setDH() {
    switch (this.type) {
      case 1:
      return 42;
      case 2:
      return 36;
      case 3:
      return 45;
      case 4:
      return 65;
      default:
      return 0;
    }
  }

  setDY() {
    switch (this.type) {
      case 1:
      return 185;
      case 2:
      return 185;
      case 3:
      return 178;
      case 4:
      return 168;
      default:
      return 0;
    }
  }

  incrementSx() {
    this.drawCount++;
    if (this.drawCount === 3) {
      this.drawCount = 0;
      if (this.sx <= 1500) {
        this.sx += 190;
      } else {
        this.sx = 0;
      }
    }
  }
}

module.exports = Space;
