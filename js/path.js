const Space = require('./space.js');

class Path {
  constructor(numObstacles) {
    this.spaces = [];
    this.numObstacles = numObstacles;
    this.createPath();
  }

  createPath() {
    let numObstacles = 0;
    let typeIndex;
    let firstPass = true;

    while (numObstacles < this.numObstacles) {
      for (let spaceNum = 0; spaceNum < 100; spaceNum++) {
        if (firstPass && spaceNum < 3) {
          this.spaces.push(new Space(0, spaceNum));
          continue;
        }
        if (firstPass) {
          if (spaceNum === 99) {firstPass = false;}
          if (this.spaces[spaceNum - 1] && this.spaces[spaceNum - 1].type === "blank") {
            typeIndex = Math.floor(Math.random() * 10) % 3;
            if (typeIndex > 0) {numObstacles++;}
            this.spaces.push(new Space(typeIndex, spaceNum));
          } else {
            this.spaces.push(new Space(0, spaceNum));
          }
        } else {
          if (numObstacles < this.numObstacles) {
            spaceNum += 5;
            if (this.spaces[spaceNum - 1] === "blank") {
              numObstacles++;
              this.spaces[spaceNum] = new Space(1, spaceNum);
            }
          } else {
            break;
          }
        }
      }
    }
  }
}

module.exports = Path;
