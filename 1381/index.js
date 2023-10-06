function readline() {
  const fs = require('fs');
  let b = Buffer.alloc(64);
  let pos = 0;
  while (true) {
    const len = fs.readSync(0, b, pos, 1);
    if (len == 0) {
      return String(b.subarray(0, pos));
    }
    if (b[pos] == 13) {
      continue;
    }
    if (b[pos] == 10) {
      return String(b.subarray(0, pos));
    }
    pos++;
    if (pos == b.length) {
      const nb = Buffer.alloc(b.length * 2);
      b.copy(nb);
      b = nb;
    }
  }
}

let [n, s, f] = readline().trim().split(/\s+/).map(Number);
s--;
f--;

const INF = n * 100;
const dist = [];

for (let i = 0; i < n; i++) {
  dist.push(readline().trim().split(/\s+/).map((s) => s === '-1' ? INF : Number(s)));
}

const minDist = Array.from({ length: n }, () => INF);
const isFinal = Array.from({ length: n }, () => false);
const from = {};
minDist[s] = 0;

while (true) {
  let v = -1;

  for (let i = 0; i < n; i++) {
    if (!isFinal[i]) {
      if (v === -1 || minDist[i] < minDist[v]) {
        v = i;
      }
    }
  }

  if (v === -1 || minDist[v] === INF) {
    break;
  }

  isFinal[v] = true;

  if (v === f) {
    break;
  }

  for (let i = 0; i < n; i++) {
    const newDist = minDist[v] + dist[v][i];

    if (newDist < minDist[i]) {
      from[i] = v;
      minDist[i] = newDist;
    }
  }
}

if (minDist[f] === INF) {
  console.log(-1);
} else {
  let currV = f;
  const path = [];
  path.push(f + 1);

  while (currV !== s) {
    path.push(from[currV] + 1);
    currV = from[currV];
  }

  console.log(path.reverse().join(' '));
}

/*
3 2 1
0 1 1
4 0 1
2 1 0
*/