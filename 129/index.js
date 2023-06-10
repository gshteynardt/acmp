input = require('fs').readFileSync(0, 'binary');

const tokens = input.trim().split(/\r?\n/);
const [sizeR, sizeC] = tokens[0].trim().split(/\s+/).map(Number);

const matrix = tokens.slice(1, 1 + sizeR).map(row => row.trim().split(/\s+/).map(Number));
const q = [];
let front = 0;

for (let r = 0; r < sizeR; r++) {
  for (let c = 0; c < sizeC; c++) {
    if (matrix[r][c] === 1) {
      q.push([r, c, 0]);
      matrix[r][c] = 0;
    } else {
      matrix[r][c] = -1;
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
  const [r, c, steps] = q[front];
  front++;

  for (const [dr, dc] of directions) {
    const nr = r + dr;
    const nc = c + dc;

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC && matrix[nr][nc] === -1) {
      q.push([nr, nc, steps + 1]);
      matrix[nr][nc] = steps + 1;
    }
  }
}

for (const row of matrix) {
  console.log(row.join(' '));
}
