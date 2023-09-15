let input = require('fs').readFileSync(0, 'binary');
let values = [];
let last = 0;
let lastFilled = false;

for (let i = 0; i <= input.length; i++) {
  const c = i < input.length ? input[i] : ' ';

  if ('0' <= c && c <= '9') {
    last = last * 10 + Number(c);
    lastFilled = true;
  } else {
    if (lastFilled) {
      values.push(last);
      last = 0;
      lastFilled = false;
    }
  }
}

const nV = values[0];
const nE = values[1];
const mark = values.slice(2, 2 + nV);

const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
  const v1 = values[2 + nV + i * 3 + 0] - 1;
  const v2 = values[2 + nV + i * 3 + 1] - 1;
  const cost = values[2 + nV + i * 3 + 2];

  adj[v1].push(v2, cost);
  adj[v2].push(v1, cost);
}

const INF = (10 ** 5) * nV;
const minCost = Array.from({ length: nV }, () => INF);
const start = Array.from({ length: nV }, () => -1);
const isFinal = Array.from({ length: nV }, () => false);

for (let i = 0; i < nV; i++) {
  if (mark[i] === 1) {
    minCost[i] = 0;
    start[i] = i;
  }
}

while (true) {
  let v = -1;

  for (let i = 0; i < nV; i++) {
    if (!isFinal[i]) {
      if (v === -1 || minCost[i] < minCost[v]) {
        v = i;
      }
    }
  }

  if (v === -1 || minCost[v] === INF) {
    console.log(-1);
    break;
  }

  isFinal[v] = true;

  if (mark[v] === 2) {
    console.log(start[v] + 1, v + 1, minCost[v]);
    break;
  }

  const adjV = adj[v];

  for (let i = 0; i < adjV.length; i += 2) {
    const to = adjV[i];
    const cost = adjV[i + 1];
    const newCost = minCost[v] + cost;

    if (newCost < minCost[to]) {
      minCost[to] = newCost;
      start[to] = start[v];
    }
  }
}

/*
6 7
1 0 1 2 2 0
1 3 3
1 2 4
2 3 3
2 4 2
1 6 5
3 5 6
5 6 1
*/
