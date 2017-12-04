const Game = require('./game.js');

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  autoplayMusic();
  new Game(canvasEl);
  toggleMusic();
});

function autoplayMusic() {
  const musicButton = $(".music-button");
  if (localStorage.getItem('autoplay')) {
    musicButton.toggleClass("disabled");
  } else {
    const audio = $("#bg-music");
    audio.prop("autoplay", true);
  }
}

function toggleMusic() {
  const audio = $("#bg-music")[0];
  const musicButton = $(".music-button");
  musicButton.on("click", (e) => {
    musicButton.toggleClass("disabled");
    if (musicButton.hasClass("disabled")) {
      localStorage.setItem('autoplay', 'off');
      audio.pause();
    } else {
      localStorage.removeItem('autoplay');
      audio.play();
    }
  });
}
