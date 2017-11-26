const _types = ["blank", "porcupine", "rock"];

class Space {
  constructor(i) {
    this.type = _types[i];
    this.image = this.setImage();
  }

  setImage() {
    const image = new Image();
    image.src = "./assets/space.png";
    return image;
  }
}

module.exports = Space;
