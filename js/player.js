class HumanPlayer {
  constructor(i, ctx) {
    this.playerNumber = i;
    this.ctx = ctx;
  }

  drawPlayer() {
    this.ctx.beginPath();
    this.ctx.lineWidth="6";
    this.ctx.strokeStyle="red";
    this.ctx.rect(100,100,300,300);
    this.ctx.stroke();
  }

  drawTime() {
  }



  jump(spaces) {
    console.log(`I'm jumping ${spaces} spaces!`);
  }
}

module.exports = HumanPlayer;
