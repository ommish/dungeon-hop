class StartMenu {
  constructor(ctx) {
    this.drawConsole(ctx, 1);
  }

  drawConsole(ctx, humanPlayerCount) {
    // x, y, width, height
    // container
    ctx.rect(225,150,450,300);
    ctx.stroke();

    // "Press Space to Start"
    ctx.rect(300,200,100,100);
    ctx.stroke();

    // Enter Num Players
    // display humanPlayerCount
    ctx.rect(300,250,100,100);
    ctx.stroke();

    // Instructions
    // Player1: Press A to jump 1 space, press S to jump 2 spaces;
    // Avoid the obstacles!
  }


}

module.exports = StartMenu;
