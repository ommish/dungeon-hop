class StartMenu {
  constructor(canvasEl) {
    this.ctx = canvasEl.getContext("2d");
    this.width = 500;
    this.height = 600;
  }

  drawStartMenu() {

    this.clearStartMenu();

    this.ctx.stroke();
    this.ctx.rect(0, 0, this.width, this.height);

    this.ctx.font = '30px Julius Sans One';
    this.ctx.fillStyle = "black";
    this.ctx.textAlign = "center";

    this.ctx.fillText('Hit Space to Start', this.width / 2, 140);

    this.ctx.fillText('a to jump one space', this.width / 2, 230);
    this.ctx.fillText('s to jump two spaces', this.width / 2, 260);
    // if (this.tripleJumps) {
      this.ctx.fillText('d to jump three spaces', this.width / 2, 290);
    // }

    // if (this.playerCount > 1) {
      this.ctx.fillText('Player One:', this.width / 2, 200);
      this.ctx.fillText('Player Two:', this.width / 2, 350);
      this.ctx.fillText('i to jump one space', this.width / 2, 380);
      this.ctx.fillText('o to jump two spaces', this.width / 2, 410);
      // if (this.tripleJumps) {
        this.ctx.fillText('p to jump three spaces', this.width / 2, 440);
      // }
    // }
  }

  clearStartMenu() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

}

module.exports = StartMenu;
