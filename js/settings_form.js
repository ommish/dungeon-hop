const upperFirst = require('../node_modules/lodash/upperFirst.js');

class SettingsForm {

  constructor() {
    this.settingsForm = $(document.getElementsByClassName("game-settings")[0]);
    this.settings = {};
  }

  toggleForm() {
    this.settingsForm.toggleClass("hidden");
  }

  isOpen() {
    return !this.settingsForm.hasClass("hidden");
  }

  handleSubmit() {
    const speed = $("#speed-slider")[0].value;
    const computerLevel = $("#computer-level-slider")[0].value;
    const obstacleTypes = $("#obstacle-types-slider")[0].value;

    this.formData = {
      speed: parseInt(speed),
      computerLevel: parseInt(computerLevel),
      obstacleTypes: parseInt(obstacleTypes),
      items: [],
      playerCount: null,
      jumpDistances: null,
    };
    const formData = this.settingsForm.serializeArray();
    formData.forEach((input) => {
      if (input.name === "items") {
        this.formData.items.push(parseInt(input.value));
      } else {
        this.formData[input.name] = parseInt(input.value);
      }
    });
    this.setSettings();
  }

  setSettings() {
    Object.keys(this.formData).forEach((setting) => {
      let selection = this.formData[setting];
      this[`set${upperFirst(setting)}`](selection);
    });
  }

  setItems(itemChoices) {
    this.settings.items = itemChoices;
  }

  setJumpDistances(distances) {
    this.settings.tripleJumps = distances === 1 ? false : true;
  }

  setYIncrement(speed) {
    let yIncrement;
    switch (speed) {
      case 0:
      yIncrement = 16;
      break;
      case 50:
      yIncrement = 24;
      break;
      case 100:
      yIncrement = 40;
      break;
      default:
      return;
    }
    this.settings.yIncrement = yIncrement;
  }

  setSpeed(speed) {
    this.setYIncrement(speed);
    this.setSlides(speed);
  }

  setComputerLevel(level) {
    // 0.6 ~ 1.0
    this.settings.computerLevel = 0.5 + ((level + 25)/250);
  }

  setSlides(speed) {
    let oneSlide;
    let twoSlides;
    let threeSlides;
    switch (speed) {
      case 0:
      oneSlide = 81/10;
      twoSlides = 162/14;
      threeSlides = 243/18;
      break;
      case 50:
      oneSlide = 81/8;
      twoSlides = 162/10;
      threeSlides = 243/12;
      break;
      case 100:
      oneSlide = 81/6;
      twoSlides = 162/8;
      threeSlides = 243/8;
      break;
      default:
      return;
    }
    this.settings.oneSlide = oneSlide;
    this.settings.twoSlides = twoSlides;
    this.settings.threeSlides = threeSlides;
  }

  setPlayerCount(count) {
    this.settings.playerCount = count;
  }

  setObstacleTypes(types) {
    this.settings.obstacleTypes = (types + 25) / 25;
  }

}




module.exports = SettingsForm;
