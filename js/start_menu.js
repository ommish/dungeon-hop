class StartMenu {
  constructor(ctx) {
    this.ctx = ctx;
    this.humanPlayerCount = 1;
    this.width = 450;
    this.height = 300;

    this.draw = this.draw.bind(this);
    this.clear = this.clear.bind(this);

    this.start();
  }

  start() {
    this.interval = window.setInterval(this.draw, 200);
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, 900, 600);
    window.clearInterval(this.interval);
  }

  updateHumanPlayerCount(num) {
    this.humanPlayerCount = num;
  }

  draw() {
    // x, y, width, this.height
    // container

    this.clear();

    this.ctx.stroke();
    this.ctx.rect(this.width / 2, this.height / 2, this.width, this.height);

    this.ctx.font = "30px Arial";
    this.ctx.fillStyle = "red";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`Players: ${this.humanPlayerCount}`, this.width, this.height / 1.5);
    this.ctx.fillText('a to jump one space', this.width, this.height / 1.2);
    this.ctx.fillText('s to jump two spaces', this.width, this.height / 1);
  }

  playerOneRules() {
    
  }

  clear() {
    this.ctx.clearRect(0, 0, 900, 600);
  }

}

module.exports = StartMenu;
