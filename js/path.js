const Space = require('./space.js');

class Path {
  constructor(spaces, itemIndex, enemyTypes) {
    this.generateSpaces(spaces, itemIndex, enemyTypes);
  }

  generateSpaces(spaces, itemIndex, enemyTypes) {
    this.spaces = spaces.map((type, spaceNum) => {
      if (spaceNum === itemIndex) {type = 2;}
      if (spaceNum === 103) {type = 3;}
      let space = new Space(type, spaceNum, enemyTypes);
      return space;
    });
  }

  static generateRandomPath() {

    let obstacleCount = 0;
    let type;

    const spaces = new Array(100);
    spaces.fill(0, 0, 100);

    while (obstacleCount < 36) {
      for (let spaceNumber = 0; spaceNumber <= 100; spaceNumber++) {
        if (obstacleCount >= 36) { break;}
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
