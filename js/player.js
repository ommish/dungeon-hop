const Timer = require('../node_modules/easytimer.js/dist/easytimer.min.js');

class HumanPlayer {
  constructor(i, ctx) {
    this.playerNumber = i;
    this.ctx = ctx;
    this.timer = new Timer();
    this.timer.start({precision: 'secondTenths'});
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.lineWidth="6";
    this.ctx.strokeStyle="red";
    this.ctx.rect(100,100,300,300);
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
