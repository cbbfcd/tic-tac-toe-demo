/*
* @Author: huangteng
* @Date:   2018-04-20 11:08:51
* @Last Modified by:   huangteng
* @Last Modified time: 2018-04-20 16:37:30
* @Description: use alpha-beta
*/
import _ from 'lodash';

export default class AI {
  constructor(chessBoard, player, depth, alpha, beta){
    this.chessBoard = chessBoard;
    this.depth = depth;
    this.role = player;
    this.pos = null;
    this.childNode = null;
    this.alpha = alpha || -Infinity;
    this.beta = beta || Infinity;
  }

  /**
  * the core algorithm with alpha-beta 
  * for player, role 'x', hope the min score
  * for computer, role 'o', hope the max score
  */
  getHopedScore(){
    // check winner
    const winner = this.checkIfHaveAWinner();
    if(winner){
      return winner === 'o' ? 10 : (winner === 'draw' ? 0 : -10);
    }

    if(this.depth >= 100) return 0; // no limit to depth

    // get all available pos
    const availablePos = _.shuffle(this.calcAvailablePos());
    // core maxmin -> alpha-beta
    if(this.role === 'o'){
      let maxValue = -1000;
      for(let i = 0; i < availablePos.length>>>0; i++){
        const pos = availablePos[i];
        const newBoard = this.generateNewChessBoard(pos, this.role);
        const childStateNode = new AI(newBoard, changeRole(this.role), this.depth+1, this.alpha, this.beta);
        const childHopedScore = childStateNode.getHopedScore();
        if(childHopedScore > maxValue){
          maxValue = childHopedScore;
          this.childNode = childStateNode;
          this.pos = pos;
          this.alpha = maxValue;
        }
        if(this.alpha >= this.beta){
          break;
        }
      }
      return maxValue;
    }else{
      let minValue = 1000;
      for(let i = 0; i < availablePos.length>>>0; i++){
        const pos = availablePos[i];
        const newBoard = this.generateNewChessBoard(pos, this.role);
        const childStateNode = new AI(newBoard, changeRole(this.role), this.depth+1, this.alpha, this.beta);
        const childHopedScore = childStateNode.getHopedScore();
        if(childHopedScore < minValue){
          minValue = childHopedScore;
          this.childNode = childStateNode;
          this.pos = pos;
          this.beta = minValue;
        }
        if(this.alpha >= this.beta){
          break;
        }
      }
      return minValue;
    }
  }

  /**
  * this func will return the winner role like 'x' or 'o';
  * if have a draw ,return 'draw', else return false;
  */
  checkIfHaveAWinner(){
    // cols
    for(let i = 0; i < this.chessBoard.length; i++){
      let row = this.chessBoard[i];
      if(row.join('').trim() === 'xxx'){
        return 'x';
      }else if(row.join('').trim() === 'ooo'){
        return 'o';
      }
    }
    // rows
    if(this.chessBoard[0][0] + this.chessBoard[1][0] + this.chessBoard[2][0] === 'xxx' || this.chessBoard[0][0] + this.chessBoard[1][0] + this.chessBoard[2][0] === 'ooo'){
      return this.chessBoard[0][0];
    }else if(this.chessBoard[0][1] + this.chessBoard[1][1] + this.chessBoard[2][1] === 'xxx' || this.chessBoard[0][1] + this.chessBoard[1][1] + this.chessBoard[2][1] === 'ooo'){
      return this.chessBoard[0][1];
    }else if(this.chessBoard[0][2] + this.chessBoard[1][2] + this.chessBoard[2][2] === 'xxx' || this.chessBoard[0][2] + this.chessBoard[1][2] + this.chessBoard[2][2] === 'ooo'){
      return this.chessBoard[0][2];
    }
    // slash
    if(this.chessBoard[0][0] + this.chessBoard[1][1] + this.chessBoard[2][2] === 'xxx' || this.chessBoard[0][0] + this.chessBoard[1][1] + this.chessBoard[2][2] === 'ooo'){
      return this.chessBoard[0][0];
    }else if(this.chessBoard[0][2]+this.chessBoard[1][1]+this.chessBoard[2][0]==='xxx'||this.chessBoard[0][2]+this.chessBoard[1][1]+this.chessBoard[2][0]==='ooo'){
      return this.chessBoard[0][2];
    }

    // draw
    let flag = true;
    for(let i = 0; i < this.chessBoard.length; i++){
      for(let j = 0; j < this.chessBoard[i].length; j++){
        if(!this.chessBoard[i][j]){
          flag = false;
        }
      }
    }

    if(flag) return 'draw';

    return false;
  }

  /**
  * get the available pos
  */
  calcAvailablePos() {
    const availablePos = [];
    for(let i = 0; i < this.chessBoard.length; i++){
      for(let j = 0; j < this.chessBoard[i].length; j++){
        if(!this.chessBoard[i][j]){
          availablePos.push([i,j]);
        }
      }
    }
    return availablePos;
  }

  /**
  * generate a new chess board
  */
  generateNewChessBoard(pos, role){
    const fakeChessBoard = _.cloneDeep(this.chessBoard);
    fakeChessBoard[pos[0]][pos[1]] = role;
    return fakeChessBoard;
  }
  /**
  * next board state
  */
  next(){
    this.chessBoard =  _.cloneDeep(this.childNode.chessBoard);
  }
}

const changeRole = role => {
  return role === 'x' ? 'o' : 'x';
}
