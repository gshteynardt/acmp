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
const matrix = [];

for (let i = 0; i < n; i++) {
  matrix.push(readline().split(''));
}

let start;

for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (matrix[r][c] === '@') {
      start = [r, c];
    }
  }
}

const directions = [
  [1, 0], //top
  [0, 1], //right
  [-1, 0], //bottom
  [0, -1], //left
];

const seen = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
const from = Array.from({ length: n }, () => Array.from({ length: n }));

const queue = [start];
seen[start[0]][start[1]] = true;
let front = 0;
let x;

while (front < queue.length) {
  const [r, c] = queue[front];
  front++;

  if (matrix[r][c] === 'X') {
    x = [r, c];
    break;
  }

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (0 <= nr && nr < n && 0 <= nc && nc < n && !seen[nr][nc] && matrix[nr][nc] !== 'O') {
      queue.push([nr, nc]);
      seen[nr][nc] = true;
      from[nr][nc] = [r, c];
    }
  }
}

if (x === undefined) {
  process.stdout.write('No');
} else {
  let [r, c] = x;

  while (matrix[r][c] !== '@') {
    matrix[r][c] = '+';
    [r, c] = from[r][c];
  }

  process.stdout.write('Yes\r\n');

  for (const row of matrix) {
    process.stdout.write(row.join('') + '\r\n');
  }
}
