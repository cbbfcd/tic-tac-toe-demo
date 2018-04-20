/*
* @Author: huangteng
* @Date:   2018-04-20 17:18:17
* @Last Modified by:   huangteng
* @Last Modified time: 2018-04-20 17:54:41
* @Description: performance tool
*/

import _ from 'lodash';
const all = ['x', 'o', 'e'];
let perfs = [];
let cache = {};

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
  // if(checkIfYouHaveWon(rolesLineStrArr)) return {count: 0, role};
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

const now = () => window.performance.now();
const mockData = () => {
  let data = [
    [_.sample(all), _.sample(all), _.sample(all)],
    [_.sample(all), _.sample(all), _.sample(all)],
    [_.sample(all), _.sample(all), _.sample(all)]
  ]

  let role = _.sample(all);

  return {
    data,
    role
  }
}
const test = () => {
  let {role, data} = mockData();
  let start = now();
  let res = winnerAlgorithm(role, data);
  let end = now();
  perfs.push(end-start);
}
  
for(let i = 0; i < 10000; i++){
  test();
}

const draw = (data) => {
  let myChart = echarts.init(document.querySelector('#charts'));
  myChart.setOption({
    xAxis: {
        type: 'category',
        data: perfs
    },
    yAxis: {
        type: 'value',
        name: '运行时间(ms)'
    },
    series: [{
        data: perfs,
        type: 'line',
        smooth: true
    }]
  })
}

draw(perfs);

