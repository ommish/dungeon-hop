class HumanPlayer {
  constructor(i, ctx) {
    this.playerNumber = i;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.lineWidth="6";
    this.ctx.strokeStyle="red";
    this.ctx.rect(100,100,300,300);
    this.ctx.stroke();
  }
}

module.exports = HumanPlayer;
