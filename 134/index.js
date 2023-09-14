let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const nV = Number(lines[0].trim());
let [start, finish] = lines[1].trim().split(/\s+/).map(Number);
start--;
finish--;

const nE = Number(lines[2].trim());
const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
  let [from, fromTime, to, toTime] = lines[i + 3].trim().split(/\s+/).map(Number);
  from--;
  to--;

  adj[from].push([fromTime, to, toTime]);
}

const INF = 10_001;
const minTime = Array.from({ length: nV }, () => INF);
const isFinal = Array.from({ length: nV }, () => false);
minTime[start] = 0;

while (true) {
  let v = -1;

  for (let i = 0; i < nV; i++) {
    if (!isFinal[i]) {
      if (v === -1 || minTime[i] < minTime[v]) {
        v = i;
      }
    }
  }

  if (v === -1) {
    throw new Error('finish vertex not found');
  }

  if (minTime[v] === INF) {
    console.log(-1);
    break;
  }

  isFinal[v] = true;

  if (v === finish) {
    console.log(minTime[finish]);
    break;
  }

  for (const [fromTime, to, toTime] of adj[v]) {
    if (fromTime >= minTime[v]) {
      minTime[to] = Math.min(minTime[to], toTime);
    }
  }
}

/*
3
1 3
4
1 0 2 5
1 1 2 3
2 3 3 5
1 1 3 10
*/
