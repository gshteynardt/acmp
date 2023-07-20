//Цивилизация
class BitSet {
  constructor(size) {
    this.size = size;
    this.arr = Array.from({ length: (size + 15) >> 4 }, () => 0);
  }

  get(index) {
    return (this.arr[index >> 4] >> (index & 15)) & 1;
  }

  set1(index) {
    this.arr[index >> 4] |= 1 << (index & 15);
  }
}

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
const seen = Array.from({ length: n }, () => new BitSet(m));
let front = 0;
let ans = -1;
q.push([startR, startC, true, 0]);
seen[startR].set1(startC);

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

    if (0 <= nr && nr < n && 0 <= nc && nc < m && seen[nr].get(nc) === 0 && map[nr][nc] !== '#') {
      const notWild = map[nr][nc] !== 'W';
      q.push([nr, nc, notWild, time + 1]);
      seen[nr].set1(nc);
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