class StartMenu {
  constructor(ctx) {
    this.ctx = ctx;
    this.humanPlayerCount = 1;
    this.width = 350;
    this.height = 400;
    this.level = 0;

    this.drawStartMenu = this.drawStartMenu.bind(this);
    this.clear = this.clear.bind(this);

    this.start();
  }

  start() {
    this.interval = window.setInterval(this.drawStartMenu, 50);
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    window.clearInterval(this.interval);
  }

  drawStartMenu() {

    this.clear();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.fillText(`Num. Players (1/2):  ${this.humanPlayerCount}`, this.width / 2, 50);
    this.ctx.fillText(`Difficulty (← / →): ${["easy", "hard"][this.level]}`, this.width / 2, 70);

    this.ctx.fillText('Hit Space to Start', this.width / 2, 100);

    this.ctx.fillText('Player One:', this.width / 2, 130);

    this.ctx.fillText('a to jump one space', this.width / 2, 150);
    this.ctx.fillText('s to jump two spaces', this.width / 2, 170);

    this.ctx.fillText('Player Two:', this.width / 2, 200);
    this.ctx.fillText('k to jump one space', this.width / 2, 220);
    this.ctx.fillText('l to jump two spaces', this.width / 2, 240);

  }

  clear() {
    this.ctx.clearRect(0, 0, 350, 400);
  }

}

module.exports = StartMenu;
