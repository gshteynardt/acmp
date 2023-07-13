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

let start = null;
let finish = null;

for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (matrix[r][c] === '@') {
      if (start === null) {
        start = [r, c];
      } else {
        finish = [r, c];
      }
    }
  }
}

const directions = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
];

const seen = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
const from = Array.from({ length: n }, () => Array.from({ length: n }));

const queue = [start];
seen[start[0]][start[1]] = true;
let front = 0;

while (front < queue.length) {
  const [r, c] = queue[front];
  front++;

  if (r === finish[0] && c === finish[1]) {
    break;
  }

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (0 <= nr && nr < n && 0 <= nc && nc < n && !seen[nr][nc] && matrix[nr][nc] !== '#') {
      queue.push([nr, nc]);
      seen[nr][nc] = true;
      from[nr][nc] = [r, c];
    }
  }
}

if (!seen[finish[0]][finish[1]]) {
  process.stdout.write('Impossible');
} else {
  let [r, c] = finish;

  while (!(r === start[0] && c === start[1])) {
    matrix[r][c] = '@';
    [r, c] = from[r][c];
  }

  for (const row of matrix) {
    process.stdout.write(row.join('') + '\r\n');
  }
}
