import {
  getCellElementList,
  getCurrentTurnElement,
  getCellElementAtIdx,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { CELL_VALUE, TURN, GAME_STATUS } from "./constants.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS; //BAN DAU LA x
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");

function toggleTurn() {
  // toggle turn
  currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE;

  //   update turn on DOM elements
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}

function updateGameStatus(newGameStatus) {
  gameStatus = newGameStatus;

  const gameStatusElement = getGameStatusElement();
  if (gameStatusElement) gameStatusElement.textContent = newGameStatus;
}

function showReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}
function hideReplayButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCells(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) {
    throw new Error("Invalid win positions");
  }

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  // isChecked
  const isClicked =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);

  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  //   only allow to click if game is playing and that cell is not clicked yet
  if (isClicked || isEndGame) return;

  //   update cellValues
  cellValues[index] =
    currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;
  // set selected cell
  cell.classList.add(currentTurn);

  // toggle turn
  toggleTurn();

  //   check game status
  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.ENDED: {
      // update game status
      // show replay button
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      // update game status
      // show replay button
      // highLight win cells
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }
    default: {
      // playing
    }
  }
}

function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => {
      handleCellClick(cell, index);
    });
  });
}

function resetGame() {
  // reset temp global variables
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.map(() => "");

  // reset dom elements
  // reset game status
  updateGameStatus(GAME_STATUS.PLAYING);

  // reset current turn
  const currentTurnElement = getCurrentTurnElement();
  if (!currentTurnElement) return;
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(TURN.CROSS);

  // reset game board
  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }

  // hide replay button
  hideReplayButton();
}

function initReplaceButton() {
  const replayButton = getReplayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
}

/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

(() => {
  initCellElementList();
  initReplaceButton();
})();
