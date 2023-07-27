//Игрушечный лабиринт
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

const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

let [sizeR, sizeC] = readline().trim().split(/\s+/).map(Number);
assert(1 <= sizeR && sizeR <= 100);
assert(1 <= sizeC && sizeC <= 100);

const map = [];

for (let r = 0; r < sizeR; r++) {
  let row = readline().replace(/\s/g, '');
  assert(row.length === sizeC);

  for (const c of row) {
    assert(c === '0' || c === '1' || c === '2');
  }

  map.push(row);
}

const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

const getKey = (r, c) => r * sizeC + c;
const q = [];
let front = 0;
const seen = new Array({ length: sizeR * sizeC }, () => false);

assert(seen.length === sizeR * sizeC);

for (let i = 0; i < seen.length; i++) {
  assert(seen[i] === false);
}

assert(map[0][0] === '0');
q.push([0, 0, 0]); //r, c, steps
seen[getKey(0, 0)] = true;

let ans = -1;

while (ans === -1 && front < q.length) {
  const [r, c, steps] = q[front];
  front++;

  for (const [dr, dc] of directions) {
    let nr = r + dr;
    let nc = c + dc;

    while (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC && map[nr][nc] !== '1') {
      if (map[nr][nc] === '2') {
        ans = steps + 1;
        break;
      }

      nr += dr;
      nc += dc;
    }
  
    if (ans !== -1) {
      break;
    }

    nr -= dr;
    nc -= dc;

    const key = getKey(nr, nc);

    if (!seen[key]) {
      q.push([nr, nc, steps + 1]);
      seen[key] = true;
    }
  }
}

assert(ans !== -1);

process.stdout.write(String(ans));

/*
4 5
0 0 0 0 1
0 1 1 0 2
0 2 1 0 0
0 0 1 0 0
*/
