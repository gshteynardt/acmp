let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const [nV, nE] = lines[0].trim().split(/\s+/).map(Number);
const mark = lines[1].trim().split(/\s+/).map(Number);

mark.unshift(0);
const adj = Array.from({ length: nV + 1 }, () => []);

for (let i = 0; i < nE; i++) {
  const [v1, v2, cost] = lines[i + 2].trim().split(/\s+/).map(Number);

  adj[v1].push([v2, cost]);
  adj[v2].push([v1, cost]);
}

const INF = (10 ** 5) * nV;
const minCost = Array.from({ length: nV + 1 }, () => INF);
const start = Array.from({ length: nV + 1 }, () => -1);
const isFinal = Array.from({ length: nV + 1 }, () => false);

for (let i = 1; i <= nV; i++) {
  if (mark[i] === 1) {
    minCost[i] = 0;
    start[i] = i;
  }
}

while (true) {
  let v = -1;

  for (let i = 1; i <= nV; i++) {
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
    console.log(start[v], v, minCost[v]);
    break;
  }

  for (const [to, cost] of adj[v]) {
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