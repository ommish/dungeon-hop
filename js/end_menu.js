class EndMenu {
  constructor(ctx, winner, finishTime) {
    this.ctx = ctx;
    this.winner = winner;
    this.width = 350;
    this.height = 400;
    this.level = 0;
    this.finishTime = finishTime;

    this.drawEndMenu = this.drawEndMenu.bind(this);
  }

  drawEndMenu() {

    this.ctx.font = '20px Julius Sans One';
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`WINNER: Player ${this.winner.playerNumber}`, this.width / 2, 50);
    this.ctx.fillText(`TIME: ${this.finishTime}`, this.width / 2, 70);
    this.ctx.fillText("hit r to start again", this.width / 2, 120);

  }

}

module.exports = EndMenu;
