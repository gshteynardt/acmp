//Цивилизация
let rows = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
let [n, m, startR, startC, endR, endC] = rows[0].trim().split(/\s+/).map(Number);
const map = Array.from({ lenght: n }, () => null);

startR--;
startC--;
endR--;
endC--;

for (let r = 0; r < n; r++) {
  const row = rows[r + 1];
  map[r] = row;
}

rows = null;

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
  front++;

  if (front >= 2048 && front >= q.length - front) {
    q.splice(0, front);
    front = 0;
  }

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