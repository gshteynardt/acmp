//Мосты
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

let [sizeR, sizeC] = readline().trim().split(/\s+/).map(Number);
let startR = -1;
let startC = -1;
let endR = -1;
let endC = -1;
const map = [];

for (let r = 0; r < sizeR; r++) {
  let row = readline();

  if (row.includes('S')) {
    startR = r;
    startC = row.indexOf('S');
    row = row.replace('S', '.');
  }

  if (row.includes('E')) {
    endR = r;
    endC = row.indexOf('E');
    row = row.replace('E', '.');
  }

  map.push(row);
}

const directions = [
  [1, 0], [-1, 0], [0, 1], [0, -1]
];

const getKey = (r, c, height) => (r * sizeC + c) * 2 + height;
const q = [];
let front = 0;
const seen = new Array({ length: sizeR * sizeC * 2 }, () => false);
q.push([startR, startC, 0, 0]); //r, c, height, steps
seen[getKey(startR, startC, 0)] = true;

let ans = -1;

while (ans === -1 && front < q.length) {
  const [r, c, h, steps] = q[front];
  front++;

  for (let [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (map[r][c] === 'B' && (h === 0) === (dr === 0)) {
      continue;
    }

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC && map[nr][nc] !== '#') {
      const nh =  map[nr][nc] === 'B' && dr === 0 ? 1 : 0;
      const key = getKey(nr, nc, nh);

      if (!seen[key]) {
        if (nr === endR && nc === endC) {
          ans = steps + 1;
          break;
        }

        q.push([nr, nc, nh, steps + 1]);
        seen[key] = true;
      }
    }
  }
}

console.log(ans);

/*
2 3
SB.
#E#

3 3
#E#
SB.
#..
*/