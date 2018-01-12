const Game = require('./game.js');
const SettingsForm = require('./settings_form.js');
const StartMenu = require('./start_menu.js');

document.addEventListener("DOMContentLoaded", () => {

  // const provider = new firebase.auth.GoogleAuthProvider();
  //
  // firebase.auth().onAuthStateChanged(function(user) {
  //   if (user) {
  //     // User is signed in.
  //     const displayName = user.displayName;
  //     const email = user.email;
  //     const emailVerified = user.emailVerified;
  //     const uid = user.uid;
  //     const providerData = user.providerData;
  //     // ...
  //   } else {
  //     // User is signed out.
  //     // ...
  //   }
  // });
  //
  // firebase.auth().signInWithPopup(provider).then(function(result) {
  //   // This gives you a Google Access Token. You can use it to access the Google API.
  //   const token = result.credential.accessToken;
  //   // The signed-in user info.
  //   const user = result.user;
  //   // ...
  // }).catch(function(error) {
  //   // Handle Errors here.
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   // The email of the user's account used.
  //   const email = error.email;
  //   // The firebase.auth.AuthCredential type that was used.
  //   const credential = error.credential;
  //   // ...
  // });

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
    game.addListeners();
    startMenu.drawStartMenu();
  }

  function reset(e) {
    e.preventDefault();
    if (e.keyCode === 92 && !settingsForm.isOpen() && !game.countdownSecs) {
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
