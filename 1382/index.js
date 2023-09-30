const lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const [nV, nE] = lines[0].trim().split(/\s+/).map(Number);

const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
  let [from, to, time, weigth] = lines[i + 1].trim().split(/\s+/).map(Number);
  from--;
  to--;

  adj[from].push([to, time, weigth]);
  adj[to].push([from, time, weigth]);
}

const canReachDestinations = (w) => { // w - weight in grams 
  const INF = 1441;
  const minTime = Array.from({ length: nV }, () => INF);
  const isFinal = Array.from({ length: nV }, () => false);
  minTime[0] = 0;

  while (true) {
    let v = -1;

    for (let i = 0; i < nV; i++) {
      if (!isFinal[i]) {
        if (v === -1 || minTime[i] < minTime[v]) {
          v = i;
        }
      }
    }

    if (v === -1 || minTime[v] === INF) {
      break;
    }

    isFinal[v] = true;

    if (v === nV - 1) {
      break;
    }

    for (const [to, time, weigth] of adj[v]) {
      if (w <= weigth) {
        const newTime = minTime[v] + time;

        if (newTime < minTime[to]) {
          minTime[to] = newTime;
        }
      }
    }
  }

  return minTime[nV - 1] < INF;
};

let left = 0; // number of cups that can be transported in time 
let right = 10_000_001; // number of cups that can't be transported in time

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canReachDestinations(3_000_000 + mid * 100)) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(left);
/*
3 3
1 2 10 3000220
2 3 20 3000201
1 3 1 3000099

3 3
1 2 10 1000220
2 3 20 1000201
1 3 1 1000099
*/
