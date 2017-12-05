const Space = require('./space.js');

class Path {
  constructor(path, itemIndex, enemyTypes, items) {
    this.path = path;
    this.itemIndex = itemIndex;
    this.enemyTypes = enemyTypes;
    this.items = items;
    this.generateSpaces();
  }

  generateSpaces() {
    this.spaces = this.path.map((type, spaceNum) => {
      if ((this.items.length > 0) && (spaceNum === this.itemIndex || spaceNum === this.itemIndex * 3)) {type = 2;}
      if (spaceNum === 103) {type = 3;}
      if (spaceNum === 105) {type = 4;}
      let space = new Space(type, spaceNum, this.items, this.enemyTypes);
      return space;
    });
  }

  static generateRandomPath() {
    const maxObstacles = 45;
    let obstacleCount = 0;
    let type;

    const spaces = new Array(100);
    spaces.fill(0, 0, 100);

    while (obstacleCount < maxObstacles) {
      for (let spaceNumber = 0; spaceNumber <= 100; spaceNumber++) {
        if (obstacleCount >= maxObstacles) { break;}
          if (spaces[spaceNumber - 1] > 0 || spaces[spaceNumber + 1] > 0) {
            spaces[spaceNumber] = 0;
          } else {
            type = Math.floor(Math.random() * 2);
            spaces[spaceNumber] = type;
            if (type > 0) {obstacleCount++;}
          }
        }
      }
      spaces.unshift(0, 0 , 0);
      spaces.push(0, 0, 0, 0, 0, 0);
    return spaces;
  }
}

module.exports = Path;
