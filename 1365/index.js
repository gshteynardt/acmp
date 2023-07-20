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

class Queue {
  constructor() {
    this.arr = Array.from({ length: 16 }, () => null);
    this.first = 0;
    this.after = 0;
    this.size = 0;
  }

  poll() {
    if (this.size === 0) {
      throw new Error('get from empty queue');
    }

    const result = this.arr[this.first];
    this.first = (this.first + 1) & (this.arr.length - 1);
    this.size--;
    return result;
  }

  add(el) {
    if (this.size === this.arr.length) {
      const newArr = Array.from({ length: this.size * 2 }, () => null);
      let newAfter = 0;

      while (this.size > 0) {
        newArr[newAfter] = this.poll();
        newAfter++;
      }

      this.arr = newArr;
      this.first = 0;
      this.after = newAfter;
      this.size = newAfter;
    }

    this.arr[this.after] = el;
    this.after = (this.after + 1) & (this.arr.length - 1);
    this.size++;
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

let q = new Queue();
const seen = Array.from({ length: n }, () => new BitSet(m));
let ans = -1;
q.add([startR, startC, true, 0]);
seen[startR].set1(startC);

while (q.size > 0) {
  const [r, c, canMove, time] = q.poll();

  if (!canMove) {
    q.add([r, c, !canMove, time + 1]);
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
      q.add([nr, nc, notWild, time + 1]);
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