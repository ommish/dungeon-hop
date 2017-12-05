class SettingsForm {

  constructor() {
    this.settingsForm = $(document.getElementsByClassName("game-settings")[0]);
    this.submitButtom = document.getElementById("submit-settings");
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addListeners();
  }

  addListeners() {
    this.submitButtom.addEventListener("click", this.handleSubmit);
  }

  displayForm() {
    this.settingsForm.toggleClass("hidden");
  }

  handleSubmit(e) {
    e.preventDefault();
    this.settingsForm.toggleClass("hidden");
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
    this.settings = {};
    this.setSettings();
  }

  setSettings() {
    Object.keys(this.formData).forEach((key) => {
      let value = this.formData[key];
      switch (key) {
        case "items":
        this.setItems(value);
        break;
        case "jumpDistances":
        this.setJumpDistances(value);
        break;
        case "computerLevel":
        this.setComputerLevel(value);
        break;
        case "speed":
        this.setSlides(value);
        this.setYIncrement(value);
        break;
        case "playerCount":
        this.setPlayerCount(value);
        break;
        case "obstacleTypes":
        this.setObstacleTypes(value);
        break;
        default:
      }
    });
  }

  setItems(itemChoices) {
    this.settings.items = itemChoices;
  }

  setJumpDistances(distances) {
    let tripleJumps;
    switch (distances) {
      case 1:
      tripleJumps = false;
      break;
      case 2:
      tripleJumps = true;
      break;
      default:
      return;
    }
    this.settings.tripleJumps = tripleJumps;
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
      yIncrement = 24;
      break;
      default:
      return;
    }
    this.settings.yIncrement = yIncrement;
  }

  setComputerLevel(level) {
    let computerLevel;
    switch (level) {
      case 0:
      computerLevel = 0.7;
      break;
      case 50:
      computerLevel = 0.8;
      break;
      case 0:
      computerLevel = 1.0;
      break;
      default:
      return;
    }
    this.settings.computerLevel = computerLevel;
  }

  setSlides(speed) {
    let oneSlide;
    let twoSlides;
    let threeSlides;
    let yIncrement;
    switch (speed) {
      case 0:
      oneSlide = 81/10;
      twoSlides = 162/14;
      threeSlides = 243/18;
      yIncrement = 16;
      break;
      case 50:
      oneSlide = 81/8;
      twoSlides = 162/10;
      threeSlides = 243/12;
      yIncrement = 24;
      break;
      case 100:
      oneSlide = 81/8;
      twoSlides = 162/10;
      threeSlides = 243/12;
      yIncrement = 24;
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
    let obstacleTypes;
    switch (types) {
      case 0:
      obstacleTypes = 1;
      break;
      case 25:
      obstacleTypes = 2;
      break;
      case 50:
      obstacleTypes = 3;
      break;
      case 75:
      obstacleTypes = 3;
      break;
      case 100:
      obstacleTypes = 3;
      break;
      default:
      return;
    }
    this.settings.obstacleTypes = obstacleTypes;
  }

}




module.exports = SettingsForm;
