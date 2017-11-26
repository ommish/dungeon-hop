class StartMenu {
  constructor(ctx) {
    this.ctx = ctx;
    this.humanPlayerCount = 1;
    this.width = 350;
    this.height = 600;

    this.draw = this.draw.bind(this);
    this.clear = this.clear.bind(this);

    this.start();
  }

  start() {
    this.interval = window.setInterval(this.draw, 50);
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    window.clearInterval(this.interval);
  }

  updateHumanPlayerCount(num) {
    this.humanPlayerCount = num;
  }

  draw() {

    this.clear();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.font = "20px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`Enter Num. Players: ${this.humanPlayerCount}`, this.width / 2, 50);

    this.ctx.fillText('Player One:', this.width / 2, 100);
    this.ctx.fillText('a to jump one space', this.width / 2, 120);
    this.ctx.fillText('s to jump two spaces', this.width / 2, 140);

    this.ctx.fillText('Player Two:', this.width / 2, 180);
    this.ctx.fillText('k to jump one space', this.width / 2, 200);
    this.ctx.fillText('l to jump two spaces', this.width / 2, 220);

    this.ctx.fillText('How to Play:', this.width / 2, 260);
    this.ctx.fillText('Jump over the shy guys', this.width / 2, 280);
    this.ctx.fillText('Be the first to finish', this.width / 2, 300);

  }

  clear() {
    this.ctx.clearRect(0, 0, 900, 600);
  }

}

module.exports = StartMenu;
