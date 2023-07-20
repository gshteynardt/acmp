//Цивилизация
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

let [n, m, startR, startC, endR, endC] = readline().trim().split(/\s+/).map(Number);
const map = Array.from({ lenght: n }, () => null);

startR--;
startC--;
endR--;
endC--;

for (let r = 0; r < n; r++) {
  const row = readline().split('');
  map[r] = row;
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

let q = [];
const seen = Array.from({ length: n }, () => Array.from({ length: m }, () => false));
let front = 0;
let ans = -1;
q.push([startR, startC, true, 0]);
seen[startR][startC] = true;

while (front < q.length) {
  const [r, c, canMove, time] = q[front];
  q[front] = null;
  front++;

  if (!canMove) {
    q.push([r, c, !canMove, time + 1]);
    continue;
  }

  if (r === endR && c === endC) {
    ans = time;
    break;
  }

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (0 <= nr && nr < n && 0 <= nc && nc < m && !seen[nr][nc] && map[nr][nc] !== '#') {
      const notWild = map[nr][nc] !== 'W';
      q.push([nr, nc, notWild, time + 1]);
      seen[nr][nc] = true;
    }
  }
}

console.log(ans);
/*
4 8 1 1 4 8
....WWWW
.######.
.#..W...
...WWWW.
*/