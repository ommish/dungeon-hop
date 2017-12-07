const Game = require('./game.js');
const SettingsForm = require('./settings_form.js');
const StartMenu = require('./start_menu.js');

document.addEventListener("DOMContentLoaded", () => {
  const canvasEl = document.getElementsByTagName('canvas')[0];
  const musicButton = $(".music-button");
  const settingsSubmitButton = document.getElementById("submit-settings");
  const audio = $("#bg-music");

  const settingsForm = new SettingsForm();
  const game = new Game(canvasEl);
  const startMenu = new StartMenu(canvasEl);

  autoplayMusic();
  toggleMusic();

  settingsSubmitButton.addEventListener("click", startGameWithSettings);
  document.addEventListener("keypress", reset);

  function startGameWithSettings(e) {
    e.preventDefault();
    settingsForm.toggleForm();
    settingsForm.handleSubmit();
    game.settings = settingsForm.settings;
    startMenu.settings = game.settings;
    startMenu.drawStartMenu();
    game.addListeners();
  }

  function reset(e) {
    e.preventDefault();
    if (e.keyCode === 92 && !settingsForm.isOpen()) {
      game.reset();
      settingsForm.toggleForm();
    }
  }

  function autoplayMusic() {
    if (localStorage.getItem('autoplay')) {
      musicButton.toggleClass("disabled");
    } else {
      audio.prop("autoplay", true);
    }
  }

  function toggleMusic() {
    musicButton.on("click", (e) => {
      musicButton.toggleClass("disabled");
      if (musicButton.hasClass("disabled")) {
        localStorage.setItem('autoplay', 'off');
        audio[0].pause();
      } else {
        localStorage.removeItem('autoplay');
        audio[0].play();
      }
    });
  }
});
