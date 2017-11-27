const Space = require('./space.js');

class Path {
  constructor(spaces) {
    this.generateSpaces(spaces);
  }

  generateSpaces(spaces) {
    this.spaces = spaces.map((spaceType, i) => {
      let space = new Space(spaceType, i);
      if (i === 103) {space.last = true;}
      return space;
    });
  }

  static generateRandomPath(obstacleCount, obstacleTypes) {
    let obstacleNum = 0;
    let type;
    let firstTime = true;
    let spaceNumber;

    const spaces = [];

    while (obstacleNum < obstacleCount) {

      for (spaceNumber = 0; spaceNumber < 103; spaceNumber++) {

        if (firstTime && spaceNumber < 3) {
          spaces.push(0);

        } else if (firstTime) {

        if (spaceNumber === 102) {firstTime = false;}

          if (spaces[spaceNumber - 1] === 0) {
            if (obstacleTypes === 2) {
              type = Math.floor(Math.random() * 10) % 3;
            } else {
              type = Math.floor(Math.random() * 10) % 4;
              debugger
            }
            spaces.push(type);
          } else {
            spaces.push(0);
          }
          if (type > 0) {obstacleNum++;}

        } else {

          if (obstacleNum < obstacleCount) {
            spaceNumber += 5;
            if (spaces[spaceNumber - 1] === 0) {
              spaces[spaceNumber] = 1;
              obstacleNum++;
            }
          } else {
            break;
          }
        }
      }
    }

    for(let i = 103; i < 110; i++) {
      spaces.push(0);
    }
    let count = 0;
    spaces.forEach((space) => {
      if (space === 3) {count++;}
    });
    console.log(count);

    return spaces;
  }


}

module.exports = Path;
