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

const n = Number(readline());

let [x1, y1] = readline().split(/\s+/).map(Number);
let [x2, y2] = readline().split(/\s+/).map(Number);

x1--;
y1--;
x2--;
y2--;

const directions = [
  [-2, 1],
  [-2, -1],
  [2, 1],
  [2, -1],
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
];

const seen = Array.from({ length: n }, () => Array.from({ length: n }, () => false));

let curr = [];
curr.push([x1, y1, 0]);
seen[x1][y1] = true;
let found = false;

while (curr.length > 0 && !found) {
  const next = [];

  for (const [x, y, steps] of curr) {
    if (x === x2 && y === y2) {
      console.log(steps);
      found = true;
      break;
    }

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (0 <= nx && nx < n && 0 <= ny && ny < n && !seen[nx][ny]) {
        next.push([nx, ny, steps + 1]);
        seen[nx][ny] = true;
      }
    }
  }

  curr = next;
}
