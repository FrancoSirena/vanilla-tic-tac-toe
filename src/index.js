function Board(size = 3) {
  this.cells = Array.from({ length: size }, () => Array.from({ length: size }));
  this.game = ["PLAYING", null, []];
  this.move = "X";

  const currentStatus = () => {
    let status = "PLAYING";
    let last = null;
    let dir = [];

    let moves = 0;
    for (let row = 0; row < size; row++) {
      let movesR = {};
      let movesC = {};
      for (let col = 0; col < size; col++) {
        if (this.cells[row][col]) {
          moves++;
          movesR[this.cells[row][col]] =
            (movesR[this.cells[row][col]] || 0) + 1;
        }
        if (this.cells[col][row]) {
          movesC[this.cells[col][row]] =
            (movesC[this.cells[col][row]] || 0) + 1;
        }
      }
      const [rowMatch] =
        Object.entries(movesR).find(([, sum]) => sum === size) || [];
      const [colMatch] =
        Object.entries(movesC).find(([, sum]) => sum === size) || [];

      if (rowMatch) {
        last = rowMatch;
        dir = ["R", row];
        status = "DONE";
        return [status, last, dir];
      }

      if (colMatch) {
        last = colMatch;
        dir = ["C", row];
        status = "DONE";
        return [status, last, dir];
      }
    }

    if (status === "PLAYING") {
      let moveZR = {};
      let moveZL = {};
      for (let index = 0; index < size; index++) {
        if (this.cells[index][index]) {
          moveZR[this.cells[index][index]] =
            (moveZR[this.cells[index][index]] || 0) + 1;
        }
        const lCol = index === 0 ? size - 1 : size - 1 - index;
        const lRow = index;

        if (this.cells[lRow][lCol]) {
          moveZL[this.cells[lRow][lCol]] =
            (moveZL[this.cells[lRow][lCol]] || 0) + 1;
        }
      }

      const [zLeftMatch] =
        Object.entries(moveZR).find(([, sum]) => sum === size) || [];
      const [zRightMatch] =
        Object.entries(moveZL).find(([, sum]) => sum === size) || [];

      if (zLeftMatch) {
        last = zLeftMatch;
        dir = ["Z", 0];
        status = "DONE";
        return [status, last, dir];
      }

      if (zRightMatch) {
        last = zRightMatch;
        dir = ["Z", 1];
        status = "DONE";
        return [status, last, dir];
      }
    }

    if (moves === Math.pow(size, 2)) {
      status = "DRAW";
      return [status, null, []];
    }
    return ["PLAYING", null, []];
  };

  this.checkMatch = () => {
    this.game = currentStatus();
  };

  this.reset = () => {
    this.cells = Array.from({ length: size }, () =>
      Array.from({ length: size })
    );
    this.game = ["PLAYING", null, []];
    this.move = "X";
    this.render();
  };

  this.click = (row, col) => {
    if (!this.cells[row][col] && this.game[0] === "PLAYING") {
      this.move = this.move === "X" ? "O" : "X";
      this.cells[row][col] = this.move;
      this.checkMatch();
      this.render();
    }
  };
  this.render = () => {
    const [, , [axis, pos]] = this.game;
    let html = this.cells.reduce(
      (acc, row, rowIndex) =>
        acc +
        `<div class="row ${
          axis === "R" && pos === rowIndex ? "winner" : ""
        }">` +
        row.reduce((accC, _, col) => {
          let paint = axis === "C" && pos === col;
          if (axis === "Z" && pos === 0) {
            paint = col === rowIndex;
          } else if (axis === "Z" && pos === 1) {
            paint =
              Math.abs(rowIndex - col) === size - 1 ||
              (rowIndex === Math.floor(size / 2) &&
                col === Math.floor(size / 2));
          }

          return (
            accC +
            `<div class="box ${
              paint ? "winner" : ""
            }" onClick="window.game.click(${rowIndex}, ${col})">${
              this.cells[rowIndex][col] || ""
            }</div>`
          );
        }, "") +
        "</div>",
      ""
    );
    document.getElementById("app").innerHTML = `
      <button onClick="game.reset()">Reset</button>
      &nbsp;
      <span>${this.game[0]} - ${this.game[1] || ""}</span>
      ${html}
    `;
  };
}

const game = new Board();

window.game = game;
game.render();
