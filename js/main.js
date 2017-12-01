const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  new Game(canvasEl);
});
