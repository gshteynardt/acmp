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

const [maxTurns, sizeR, sizeC] = readline().split(' ').map(Number);
const map = Array.from({ length: sizeR }, () => 0);

let startR = -1;
let startC = -1;
let endR = -1;
let endC = -1;

for (let r = 0; r < sizeR; r++) {
  const row = readline().split(' ').map(Number);
  map[r] = row;

  if (row.includes(2)) {
    startR = r;
    startC = row.indexOf(2);
  }

  if (row.includes(3)) {
    endR = r;
    endC = row.indexOf(3);
  }
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const seen = new Set();
const q = [];

for (let d = 0; d < directions.length; d++) {
  q.push([startR, startC, maxTurns, 0, d]); //r, c, remTurns, time, orientation
  seen.add([startR, startC, maxTurns, d].join(' '));
}

let front = 0;
let result = -1;

while (front < q.length) {
  const [r, c, remTurns, time, orientation] = q[front];
  front++;

  if (r === endR && c === endC) {
    result = time;
    break;
  }

  for (let deltaO = -1; deltaO <= 1; deltaO++) {
    //turn right
    if (deltaO === 1 && remTurns === 0) {
      continue;
    }

    const no = (orientation + deltaO + 4) % 4;
    const newTurns = deltaO === 1 ? remTurns - 1 : remTurns;
    const [dr, dc] = directions[no];
    const nr = r + dr;
    const nc = c + dc;
    const state = [nr, nc, newTurns, time + 1, no];
    const key = [nr, nc, newTurns, no].join(' ');

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC && map[nr][nc] !== 1 && !seen.has(key)) {
      q.push(state);
      seen.add(key);
    }
  }
}

console.log({ front });
console.log(result);
/*
1 5 5
2 0 0 1 1
0 1 0 0 1
1 1 0 0 1
0 0 0 0 1
3 1 0 0 1
*/

/*
6 20 20
2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1
0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3
*/