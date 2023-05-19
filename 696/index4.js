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

const [sizeR, sizeC] = readline().split(' ').map(Number);
const costs = readline().split(' ').map(Number); // [0] - r, [1] - g, [2] - b, [3] - y
const map = Array.from({ length: sizeR }, () => 0);

for (let r = 0; r < sizeR; r++) {
  map[r] = readline().split('');
}

let startR = -1;
let startC = -1;

for (let r = 0; r < sizeR; r++) {
  for (let c = 0; c < sizeC; c++) {
    if (map[r][c] === 'S') {
      startR = r;
      startC = c;
      map[r][c] = '.';
    }
  }
}

const keys = 'RGBY';

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const costAll = costs.reduce((acc, cost) => acc + cost, 0);
let result = costAll + 1;

const seen = new Set();
const q = [];
const start = [startR, startC, 0, 0, 0, 0]; //r, c, get[0...3]
q.push(start);
seen.add(start.join(' '));
let front = 0;

while (front < q.length) {
  const [r, c, ...get] = q[front];
  front++;

  if (map[r][c] === 'E') {
    result = Math.min(result, costs[0] * get[0] + costs[1] * get[1] + costs[2] * get[2] + costs[3] * get[3]);
    continue;
  }

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;
    const nGet = [...get];

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC) {
      const value = map[nr][nc];
      const index = keys.indexOf(value);

      if (index >= 0 && get[index] === 0) {
        nGet[index] = 1;
      }

      const next = [nr, nc, ...nGet];
      const nextS = next.join(' ');

      if (value !== 'X' && !seen.has(nextS)) {
        q.push(next);
        seen.add(nextS);
      }
    }
  }
}

console.log(result === costAll + 1 ? 'Sleep' : result);

/*
6 6
1 5 3 1
XXXXXX
XS.X.X
X..R.X
X.XXBX
X.G.EX
XXXXXX
*/