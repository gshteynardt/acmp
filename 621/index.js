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

const format7d = (n) => {
  n = String(n);
  return ' '.repeat(7 - n.length) + n;
};

let n = Number(readline());

const matrix = [];

for (let i = 0; i < n; i++) {
  matrix.push(readline().trim().split(/\s+/).map(Number));
  // console.log(matrix[i].map(format7d).join(' '));
}

const originalValues = [];
const dist = Array.from({ length: n }, () => Array.from({ length: n }, () => -1));
const q = [];
let front = 0;

for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (matrix[r][c] > 0) {
      originalValues.push(matrix[r][c]);
      matrix[r][c] = originalValues.length;
      dist[r][c] = 0;
      q.push([r, c]);
    }
  }
}

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

while (front < q.length) {
  const [r, c] = q[front];
  front++;

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (0 <= nr && nr < n && 0 <= nc && nc < n) {
      if (dist[nr][nc] === -1) {
        dist[nr][nc] = dist[r][c] + 1;
        matrix[nr][nc] = matrix[r][c];
        q.push([nr, nc]);
      } else if (dist[nr][nc] === dist[r][c] + 1 && matrix[nr][nc] !== matrix[r][c]) {
        matrix[nr][nc] = -1;
      }
    }
  }
}

for (let r = 0; r < n; r++) {
  for (let c = 0; c < n; c++) {
    if (matrix[r][c] === 0) {
      continue;
    }

    if (matrix[r][c] === -1) {
      matrix[r][c] = 0;
    } else {
      const originalValue = originalValues[matrix[r][c] - 1];
      matrix[r][c] = originalValue;
    }
  }

  // process.stdout.write(matrix[r].map(format7d).join(' ') + '\r\n');
  console.log(matrix[r].join(' '));
}

/**
5
0 0 0 0 0
0 0 0 0 0
0 1 0 2 0
0 0 3 0 0
0 0 0 0 0

3
0 0 0
0 0 0
0 0 0

3
1 0 0
0 2 0
0 0 3

3
1 0 0
0 0 0
0 0 3

1
5

1
0
*/
