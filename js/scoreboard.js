class Scoreboard {
  constructor(ctx, winner, finishTime, date) {
    this.ctx = ctx;
    this.finishTime = finishTime;
    this.date = date;
    this.winner = winner;
    this.winnerName = "";

    this.width = 500;
    this.height = 600;

    this.drawScoreboard = this.drawScoreboard.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.winnerRecorded = false;

    this.getScoreboard();

  }

  addListeners() {
    this.keydownListener = document.addEventListener("keydown", this.handleKeydown);
  }

  handleKeydown(e) {
    // backspace
    if (e.keyCode === 8) {
      this.winnerName = this.winnerName.slice(0, -1);
    }
    // enter to save
    else if (e.keyCode === 13) {
      this.saveScore();
    }
    else if ([16, 20, 9, 27, 17, 18, 57, 38, 39, 40, 38].includes(e.keyCode)) {
      return;
    }
    // type in name
    else if (this.winnerName.length < 15) {
      this.winnerName += e.key;
    }
  }

  drawScoreboard() {
    this.ctx.font = "30px Julius Sans One";
    this.ctx.fillStyle = "white";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`WINNER: Player ${this.winner.playerNumber}`, this.width / 2, 50);
    this.ctx.fillText(`TIME: ${this.finishTime.toString(['minutes', 'seconds', 'secondTenths'])}`, this.width / 2, 80);
    this.ctx.fillText("Top Scores:", this.width / 2, 140);
    if (this.winners) {
      this.winners.forEach((winner, i) => {
        this.ctx.fillText(`${i + 1}. ${winner.name}: ${winner.time}`, this.width / 2, (i + 1) * 40 + 170);
      });
    }
    if (this.isNewWinner && !this.winnerRecorded && this.winner.human) {
      this.ctx.fillText(`ENTER YOUR NAME:`, this.width / 2, 430);
      this.ctx.fillText(`${this.winnerName}`, this.width / 2, 460);
    }
    this.ctx.fillText("Hit \\ to restart", this.width / 2, 520);
  }

  getScoreboard() {
    firebase.database().ref('/scores/').once('value').then((snapshot) => {
      this.winners = this.topScores(Object.values(snapshot.val())).slice(0, 5);
      this.isNewWinner = this.winners.length < 5 || this.winners.some((winner) => {
        return winner.time > this.finishTime.toString(['minutes', 'seconds', 'secondTenths']);
      });
      if (this.isNewWinner && !this.winnerRecorded && this.winner.human) {
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
    const newScore = firebase.database().ref('/scores').push();
    newScore.set({
      name: this.winnerName,
      time: this.finishTime.toString(['minutes', 'seconds', 'secondTenths']),
      date: this.date.toString(),
    });
    this.winnerRecorded = true;
    document.removeEventListener("keydown", this.handleKeydown);
    this.getScoreboard();
  }
}

module.exports = Scoreboard;
