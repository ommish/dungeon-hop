const Game = require('./game.js');


document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  addMusic();
  new Game(canvasEl);
  toggleMusic();
});


function addMusic() {
  let autoplay = "";
  const musicButton = $(".music-button");
  if (localStorage.getItem('autoplay') !== "off") {
    autoplay = "autoplay";
  } else {
    musicButton.toggleClass("disabled");
  }
  const audio = $(`<audio loop ${autoplay}></audio>`);
  audio.append("<source src=./assets/bgmusic.mp3 type=audio/ogg>");
  $("head").append(audio);
}

function toggleMusic() {
  const audio = $("audio");
  const musicButton = $(".music-button");
  musicButton.on("click", (e) => {
    musicButton.toggleClass("disabled");
    if (musicButton.hasClass("disabled")) {
      localStorage.setItem('autoplay', 'off');
      audio.prop("autoplay", false);
      audio[0].pause();

    } else {
      localStorage.removeItem('autoplay');
      audio[0].play();
    }
  });
}
