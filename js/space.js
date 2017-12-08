const _imageSrcs = { 0: ["./assets/ground.png"], 1: ["./assets/enemies.png"], 2: ["./assets/items.png"], 3: ["./assets/sign.png"], 4: ["./assets/peach.png"]};

const obstacles = {
  0: {
    typeName: "spiny",
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
    typeName: "spiketop",
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
    typeName: "whacka",
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
    typeName: "shuyguy",
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
    typeName: "ice",
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
    typeName: "star",
    sh: 50,
    sw: 50,
    sy: 245,
    sx: 660,
    dw: 36,
    dh: 36,
    dy: 187,
  },
  1: {
    typeName: "mushroom",
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
    typeName: "sign",
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
    typeName: "princess",
    sh: 110,
    sw: 72,
    sy: 3,
    sx: 0,
    dw: 43,
    dh: 68,
    dy: 165,
    maxX: 550,
  }
};

const objectParameters = [obstacles, items, sign, princess];
const parametersToSet = ['typeName', 'sh', 'sw', 'sy', 'sx', 'dw', 'dh', 'dy', 'maxX'];

class Space {
  constructor(type, spaceNum, items, obstacleTypes = 0, current = false, last = false) {
    this.type = type;
    this.spaceNum = spaceNum;
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

    parametersToSet.forEach((parameter) => {
      this[parameter] = objectParameters[this.type - 1][typeNum][parameter];
    });

    this.originalSx = objectParameters[this.type - 1][typeNum].sx;
    this.moveDir = 1;
  }

  setTile() {
    const image = new Image();
    image.src = _imageSrcs[0][0];
    this.tile = image;
  }

  setObjectImage() {
    if (this.type === 0) {return null;}
    const image = new Image();
    image.src = _imageSrcs[this.type][0];
    this.objectImage = image;
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
