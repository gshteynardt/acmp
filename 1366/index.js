//Только направо
function readline() {
  const fs = require('fs');
  const b = Buffer.alloc(1);
  let s = '';
  while (true) {
    const len = fs.readSync(0, b);
    if (len == 0) {
      return s;
    }
    if (b[0] == 13) {
      continue;
    }
    if (b[0] == 10) {
      return s;
    }
    s += b;
  }
}

const [sizeR]  = readline().split(' ').map(Number);
const map = Array.from({ length: sizeR }, () => []);

let startR = -1;
let startC = -1;
let endR = -1;
let endC = -1;

for (let r = 0; r < sizeR; r++) {
  const row = readline().split('');
  map[r] = row;

  if (row.includes('S')) {
    startR = r;
    startC = row.indexOf('S');
  }

  if (row.includes('F')) {
    endR = r;
    endC = row.indexOf('F');
  }
}

const getKey = (r, c, d) => `${r} ${c} ${d}`;

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const seen = new Set();
const q = [];
let front = 0;

for (let d = 0; d < 4; d++) {
  q.push([startR, startC, d, 0]);
  const key = getKey(startR, startC, d);
  seen.add(key);
}

let ans = -1;

while (front < q.length) {
  const [r, c, d, steps] = q[front];
  front++;

  if (r === endR && c === endC) {
    ans = steps;
    break;
  }

  for (let dd = 0; dd < 2; dd++) {
    const nd = (d + dd) & 3; // % 4
    const nr = r + directions[nd][0];
    const nc = c + directions[nd][1];
    const key = getKey(nr, nc, nd);

    if (map[nr][nc] !== 'X' && !seen.has(key)) {
      q.push([nr, nc, nd, steps + 1]);
      seen.add(key);
    }
  }
}

if (ans === -1) {
  throw new Error('path not found');
}

console.log(ans);

/*
10 14
XXXXXXXXXXXXXX
X          XXX
X XFXXXXX    X
XXX   XX  XX X
X S          X
XX  XXXXXX X X
X        X X X
X X      X X X
XXX XX       X
XXXXXXXXXXXXXX
*/