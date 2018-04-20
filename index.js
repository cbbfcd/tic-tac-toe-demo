/*
* @Author: huangteng
* @Date:   2018-04-18 10:51:06
* @Last Modified by:   huangteng
* @Last Modified time: 2018-04-20 17:38:40
* @Description: 'Tic-Tac-Toe'
*/
import sample from 'lodash/fp/sample';
const doT = require('dot');

// constant
const role = ['x', 'o'];
const all = ['x', 'o', 'e'];
const cache = {};

// mock data
const defaultAnswer = ({count=3, answer='[2,2], [1,2], [2,0]', err='', role='x'} = {}) => ({
  count, 
  answer, 
  err,
  role
});
let defaultChessBoardData = [
  ['x', 'o', 'o'],
  ['x', 'x', 'e'],
  ['e', 'o', 'e']
];

// render methods
const render = mountElementId => tmplElementId => data => {
  let temp = doT.template(document.querySelector(`${tmplElementId}`).text);
  document.querySelector(`${mountElementId}`).innerHTML = temp(data);
}

const renderAll = () => {
  render('#root')('#myAnswerTmpl')(defaultAnswer());
  render('#chessboard')('#chessBoardTmpl')(defaultChessBoardData);
}
  
// user interaction
const goAnswer = () => {
  // user input check
  let userInput = document.querySelector('#player').value.toLowerCase();
  if(!userInput){
    render('#root')('#myAnswerTmpl')(defaultAnswer({err: 'you might missed a role!'}));
    return;
  };
  if(!~role.join('').indexOf(userInput)){
    render('#root')('#myAnswerTmpl')(defaultAnswer({err: 'role must be "x" or "o"'}));
    return;
  }

  // then go for the answer
  let res = winnerAlgorithm(userInput, defaultChessBoardData);
  render('#root')('#myAnswerTmpl')(defaultAnswer(res));
}


/**
* core algorithm
*
*/
const winnerAlgorithm = (role, data) => {
  let rolesLineStrArr = [],
      response = [],
      cacheKey = data.reduce((pre, curr) => { return pre+= curr.join('') }, `${role}`);
  // if cached
  if(cache[cacheKey]){
    return cache[cacheKey];
  }
  // if no cache
  data.reduce((pre, curr, index, arr) => {
    rolesLineStrArr.push({rows: index, data: curr.join('')}); // rows
    for(let i = 0; i < 3; i++){ // cols
      pre = pre + arr[i][index];
      if(i == 2){
        rolesLineStrArr.push({cols: index,data: pre});
        return pre = '';
      };
    }
    return pre;
  }, '');
  // slash
  rolesLineStrArr.push({slash: 0, data: `${data[0][0]}${data[1][1]}${data[2][2]}`});
  rolesLineStrArr.push({slash: 1, data: `${data[0][2]}${data[1][1]}${data[2][0]}`});
  // some check
  if(rolesLineStrArr.length>>>0 !== 8) return {err: 'something bad happend!'};
  if(checkIfYouHaveWon(rolesLineStrArr)) return {count: 0, role};
  // get the answer
  for(let i = 0, item; item = rolesLineStrArr[i++];){
    const condition = [`${role}e${role}`, `e${role}${role}`, `${role}${role}e`];
    if(!!~condition.indexOf(item.data)){
      let resIndexOne = item.data.indexOf('e');
      if(item.hasOwnProperty('rows')){
        response.push(`[${item.rows}, ${resIndexOne}]`);
      }else if(item.hasOwnProperty('cols')){
        response.push(`[${resIndexOne}, ${item.cols}]`);
      }else if(item.hasOwnProperty('slash')){
        let ar = item.slash === 0 ? `[${resIndexOne}, ${resIndexOne}]` : `[${resIndexOne}, ${2 - resIndexOne}]`;
        response.push(ar);
      }
    }
  }
  if(response.length === 0){
    return {count: -1, role};
  }
  // remove duplication
  // cache and return
  return cache[cacheKey] = {
    count: [...new Set(response)].length, 
    answer:[...new Set(response)]
  };
}


const checkIfYouHaveWon = (arr) => {
  let _arr = [];
  arr.forEach(item => {
    _arr.push(item.data);
  })
  let bool = !!~_arr.indexOf('xxx') || !!~_arr.indexOf('ooo');
  return bool;
}

// shuffle the chess board
const shuffle = () => {
  defaultChessBoardData = [
    [sample(all), sample(all), sample(all)],
    [sample(all), sample(all), sample(all)],
    [sample(all), sample(all), sample(all)]
  ];
  render('#chessboard')('#chessBoardTmpl')(defaultChessBoardData);
}

renderAll();

// domlisten
document.querySelector('.btn1').addEventListener('click', shuffle, false);
document.querySelector('.btn2').addEventListener('click', goAnswer, false);