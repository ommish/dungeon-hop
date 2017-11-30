class Scoreboard {
  constructor(ctx, winner, finishTime, date) {
    this.ctx = ctx;
    this.finishTime = finishTime;
    this.date = date;
    this.winner = winner;
    this.winnerName = "";

    this.width = 350;
    this.height = 400;

    this.drawScoreboard = this.drawScoreboard.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.winnerRecorded = false;

    this.getScoreboard();

  }

  addListeners() {
    this.keypressListener = document.addEventListener("keypress", this.handleKeypress);
  }

  handleKeypress(e) {
    if (e.keyCode === 8) {
      this.winnerName = this.winnerName.slice(1);
    }
    else if (e.keyCode === 13) {
      this.saveScore();
    }
    else if (this.winnerName.length < 15) {
      this.winnerName += e.key;
    }
  }

  drawScoreboard() {
    this.ctx.font = "20px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`WINNER: Player ${this.winner.playerNumber}`, this.width / 2, 50);
    this.ctx.fillText(`TIME: ${this.finishTime.toString(['minutes', 'seconds', 'secondTenths'])}`, this.width / 2, 70);
    this.ctx.fillText("Top Scores:", this.width / 2, 120);
    if (this.winners) {
      this.winners.forEach((winner, i) => {
        this.ctx.fillText(`${i + 1}. ${winner.name}: ${winner.time}`, this.width / 2, (i + 1) * 30 + 140);
      });
    }
    if (this.isNewWinner && !this.winnerRecorded) {
      this.ctx.fillText(`YOUR NAME: ${this.winnerName}`, this.width / 2, 330);
    }
  }

  getScoreboard() {
    firebase.database().ref('/scores/').once('value').then((snapshot) => {
      this.winners = this.topScores(Object.values(snapshot.val())).slice(0, 5);
      this.isNewWinner = this.winners.some((winner) => {
        return winner.time > this.finishTime.toString();
      });
      if (this.isNewWinner && !this.winnerRecorded) {
        this.addListeners();
      }
    });
  }

  topScores(scores) {
    return scores.sort(this.compareScores);
  }

  compareScores(scoreA, scoreB) {
    if (scoreA.time < scoreB.time) {
      return -1;
    } else if (scoreA.time > scoreB.time) {
      return 1;
    } else {
      if (scoreA.date < scoreB.date) {
        return -1;
      } else {
        return 1;
      }
    }
  }

  saveScore() {
    const newScore = firebase.database().ref('/scores/').push();
    const winner = this.winnerName;
    newScore.set({
      name: this.winnerName,
      time: this.finishTime.toString(),
      date: this.date.toString(),
    });
    this.winnerRecorded = true;
    document.removeEventListener("keypress", this.handleKeypress);
    this.getScoreboard();
  }
}

module.exports = Scoreboard;
