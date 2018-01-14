const upperFirst = require('../node_modules/lodash/upperFirst.js');

class SettingsForm {

  constructor() {
    this.settingsForm = $(document.getElementsByClassName("game-settings")[0]);
    this.settings = {};

    $("[name='playerCount']").change((e) => {
      $("#computer-level-slider").attr("disabled", $("#2-player").prop("checked"))
    })
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
      jumpHeights: null,
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
      yIncrement = 4;
      break;
      case 50:
      yIncrement = 6;
      break;
      case 100:
      yIncrement = 8;
      break;
      default:
      return;
    }
    this.settings.yIncrement = yIncrement;
  }

  setJumpHeights() {
    this.settings.jumpHeights = {
      one: 72,
      two: 96,
      three: 120,
    }
  }

  setSpeed(speed) {
    this.setYIncrement(speed);
    this.setSlides(speed);
  }

  setComputerLevel(level) {
    // lands in range of 0.6 ~ 1.0
    this.settings.computerLevel = 0.5 + ((level + 25)/250);
  }

  setSlides(speed) {
    let oneSlide;
    let twoSlides;
    let threeSlides;
    switch (speed) {
      case 0:
      oneSlide = 90/36;
      twoSlides = 180/48;
      threeSlides = 270/60;
      break;
      case 50:
      oneSlide = 90/24;
      twoSlides = 180/32
      threeSlides = 270/40;
      break;
      case 100:
      oneSlide = 90/18;
      twoSlides = 180/24;
      threeSlides = 270/30;
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
