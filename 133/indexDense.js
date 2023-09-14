let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const nV = Number(lines[0].trim());
const costs = lines[1].trim().split(/\s+/).map(Number);
const nE = Number(lines[2].trim());
const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
  let [u, v] = lines[i + 3].trim().split(/\s+/).map(Number);
  u--;
  v--;
  adj[u].push([v, costs[u]]);
  adj[v].push([u, costs[v]]);
}

lines = null;

const INF = costs.reduce((acc, num) => acc + num, 0);
const minDist = Array.from({ length: nV }, () => INF);
const isFinal = Array.from({ length: nV }, () => false);
minDist[0] = 0;

while (true) {
  let v = -1;

  for (let i = 0; i < nV; i++) {
    if (!isFinal[i]) {
      if (v === -1 || minDist[i] < minDist[v]) {
        v = i;
      }
    }
  }

  if (v === -1) {
    break;
  }

  isFinal[v] = true;

  if (v === nV - 1) {
    break;
  }

  for (const [to, d] of adj[v]) {
    const newDist = minDist[v] + d;

    if (newDist < minDist[to]) {
      minDist[to] = newDist;
    }
  }
}

console.log(minDist[nV - 1] === INF ? -1 : minDist[nV - 1]);

/*
4
1 10 2 15
4
1 2
1 3
4 2
4 3
*/