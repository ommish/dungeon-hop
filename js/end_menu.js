class EndMenu {
  constructor(ctx, winner) {
    this.ctx = ctx;
    this.winner = winner;
    this.width = 350;
    this.height = 400;
    this.level = 0;

    this.drawEndMenu = this.drawEndMenu.bind(this);
    this.clearEndMenu = this.clearEndMenu.bind(this);

    this.start();
  }

  start() {
    this.interval = window.setInterval(this.drawEndMenu, 50);
  }

  clearEndMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    window.clearInterval(this.interval);
  }

  drawEndMenu() {

    this.clear();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.fillText(`WINNER: Player ${this.winner.playerNumber}`, this.width / 2, 50);
    this.ctx.fillText(`TIME: ${this.winner.timer.getTimeValues().toString(['minutes', 'seconds', 'secondTenths'])}`, this.width / 2, 70);

  }

    clear() {
      this.ctx.clearRect(0, 0, 350, 400);
    }
}

module.exports = EndMenu;
