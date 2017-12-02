const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  new Game(canvasEl);

  let autoplay = "";
  if (localStorage.getItem('autoplay') !== "off") {
    autoplay = "autoplay";
  }
  const audio = $(`<audio ${autoplay}></audio>`);
  audio.append(
    "<source src=https://soundcloud.com/ommi-shimizu/01-1348079-filuanddina-exploring-the-dungeon-game-background/ type=audio/ogg>")
  $("head").append(audio);

  const musicButton = $("music");
  musicButton.on("click", () => {
    musicButton.toggleClass("disabled");
    if (musicButton.hasClass("disabled")) {
      localStorage.setItem('autoplay', 'off');
      audio.prop("autoplay", false);
    }
  });
});
