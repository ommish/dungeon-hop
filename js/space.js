const _imageSrcs = { 0: ["./assets/ground.png"], 1: ["./assets/enemies.png"], 2: ["./assets/items.png"], 3: ["./assets/sign.png"], 4: ["./assets/peach.png"]};

const obstacles = {
  0: {
    name: "spiny",
    sh: 175,
    sw: 195,
    sy: 0,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,
  },
  1: {
    name: "spiketop",
    sh: 190,
    sw: 192,
    sy: 175,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,

  },
  2: {
    name: "whacka",
    sh: 165,
    sw: 195,
    sy: 365,
    sx: 0,
    dw: 42,
    dh: 42,
    dy: 185,
    maxX: 1500,

  },
  3: {
    name: "shuyguy",
    sh: 200,
    sw: 190,
    sy: 695,
    sx: 0,
    dw: 50,
    dh: 50,
    dy: 180,
    maxX: 1500,

  },
  4: {
    name: "ice",
    sh: 150,
    sw: 194,
    sy: 540,
    sx: 0,
    dw: 50,
    dh: 42,
    dy: 200,
    maxX: 1500,

  },
};

const items = {
  0: {
    name: "star",
    sh: 50,
    sw: 50,
    sy: 245,
    sx: 660,
    dw: 36,
    dh: 36,
    dy: 187,
  },
  1: {
    name: "mushroom",
    sh: 50,
    sw: 50,
    sy: 237,
    sx: 360,
    dw: 36,
    dh: 36,
    dy: 187,
  }
};

const sign = {
  0: {
    name: "sign",
    sh: 30,
    sw: 20,
    sy: 0,
    sx: 0,
    dw: 36,
    dh: 45,
    dy: 178,
  }
};

const princess = {
  0: {
    name: "sign",
    sh: 110,
    sw: 68,
    sy: 3,
    sx: 0,
    dw: 43,
    dh: 68,
    dy: 165,
    maxX: 550,
  }
};

const objectParameters = [obstacles, items, sign, princess];

class Space {
  constructor(type, spaceNum, items, obstacleTypes = 0, current = false, last = false) {
    this.type = type;
    this.spaceNum = spaceNum;
    this.tile = this.setTile();
    this.object = this.setObject();
    this.dx = spaceNum * 81;
    this.last = last;
    this.drawCount = 0;
    if (this.type > 0) {
      this.setObjectParameters(items, obstacleTypes);
    }
  }

  setObjectParameters(items, obstacleTypes) {
    let typeNum;
    if (this.type === 2) {
      typeNum = items[Math.floor(Math.random() * items.length)];
    }
    else if (this.type === 1) {
      typeNum = Math.floor(Math.random() * obstacleTypes);
    } else {
      typeNum = 0;
    }
    this.typeName = objectParameters[this.type - 1][typeNum].name;
    this.dy = objectParameters[this.type - 1][typeNum].dy;
    this.sx = objectParameters[this.type - 1][typeNum].sx;
    this.sy = objectParameters[this.type - 1][typeNum].sy;
    this.sh = objectParameters[this.type - 1][typeNum].sh;
    this.sw = objectParameters[this.type - 1][typeNum].sw;
    this.dw = objectParameters[this.type - 1][typeNum].dw;
    this.dh = objectParameters[this.type - 1][typeNum].dh;
    this.maxX = objectParameters[this.type - 1][typeNum].maxX;
    this.originalSx = objectParameters[this.type - 1][typeNum].sx;
    this.moveDir = 1;
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


  incrementSx() {
    this.drawCount++;
    if (this.drawCount === 3) {
      if (this.type === 1 ||  this.type === 4) {
        this.drawCount = 0;
        this.sx += this.sw * this.moveDir;
        if (this.sx < 10 || this.sx >= this.maxX - this.sw) {
          this.moveDir *= -1;
        }
      }
    }
  }
}

module.exports = Space;
