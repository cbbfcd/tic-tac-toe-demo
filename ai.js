/*
* @Author: huangteng
* @Date:   2018-04-19 10:25:46
* @Last Modified by:   huangteng
* @Last Modified time: 2018-04-20 17:03:23
* @Description: a simple demo with ai for tic-tac-toe game!
*/
import AI from './alphabeta.js';
import _ from 'lodash';
const doT = require('dot');

// constant
const AI_ROLE = 'o'; // max
const PLAYER_ROLE = 'x'; // min
const EMPTY_POS = '';
let emptyChessBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];
let timer = null;
let pos = null;
let ai = new AI(emptyChessBoard, AI_ROLE, 0);

// initGame
const initGame = (chessBoard, AI_ROLE) => {
  render(ai.chessBoard);
  document.querySelector('#board-root').addEventListener('click', e => {
    let pos = e.target.getAttribute('data-pos').split(',');
    if(checkHaveValueAlready(ai.chessBoard, pos)){
      renderTip({show: true, msg: 'here is occupied!'});
      return;
    };
    if (ai.winner) return;
    drawPlayersRoleInChessBoard(pos);
    checkWinnerTool();
    // AI go
    setTimeout(AIGO, 1000);
  });
}
// when ai go
const AIGO = () => {
  if(ai.winner) return;
  ai.getHopedScore();
  ai.next();
  render(ai.chessBoard);
  checkWinnerTool();
}

// check a winner tool func
const checkWinnerTool = () => {
  let winner = ai.checkIfHaveAWinner();
  if(winner){
    let msg = winner === 'draw' ? 'Have A Draw!' : `${winner} Had Won Game!`;
    renderTip({show: true, msg});
    ai.winner = winner;
  }
}

// draw player role in chessBoard
const drawPlayersRoleInChessBoard = (pos, role=PLAYER_ROLE) => {
  const board = _.cloneDeep(ai.chessBoard);
  board[pos[0]][pos[1]] = PLAYER_ROLE;
  ai.chessBoard = board;
  render(ai.chessBoard);
}

// check if have value
const checkHaveValueAlready = (chessBoard, pos) => {
  return chessBoard[pos[0]][pos[1]] === PLAYER_ROLE || chessBoard[pos[0]][pos[1]] === AI_ROLE;
}

// render
const render = (board) => {
  let temp = doT.template(document.querySelector(`#chessBoardAITmpl`).text);
  document.querySelector(`#board-root`).innerHTML = temp(board);
  document.querySelector(`#tip`).style.display = 'none';
}

const renderTip = res => {
  let temp = doT.template(document.querySelector(`#tipTmpl`).text);
  document.querySelector(`#tip`).innerHTML = temp(res);
  document.querySelector(`#tip`).style.display = 'block';
  timer = setTimeout(() => {
    timer = null;
    document.querySelector(`#tip`).style.display = 'none';
  }, 2000);
}

initGame();
document.querySelector('#btn').addEventListener('click', ()=>{window.location.reload();}, false);
