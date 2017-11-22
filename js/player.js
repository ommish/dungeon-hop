const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

const _colors = ["red", "blue"];

class HumanPlayer {
  constructor(i, ctx) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.timer = new Timer();
    this.timer.start({precision: 'secondTenths'});
    this.x = 0;
    this.y = 0;
    this.radius = 30;
    this.color = _colors[i - 1];
  }

  drawPlayer() {

    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#003300';
    this.ctx.stroke();
  }

  drawTime() {

    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(this.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths']), 500, 500);

  }



  jump(spaces) {
    console.log(`I'm jumping ${spaces} spaces!`);

  }
}

module.exports = HumanPlayer;
