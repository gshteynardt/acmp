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

const size = Number(readline());
const grid = Array(size);

for (let i = 0; i < size; i++) {
  const row = readline().split('').map(Number);
  grid[i] = row;
}

const INF = (size + size - 1) * 250 - 1;
const minSum = Array.from({ length: size }, () => Array(size).fill(INF)); // minSum[r][c] - минимальная сумма чисел в клетках по пути из [0][0] -> [r][c]
minSum[0][0] = grid[0][0];

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (r + 1 < size) {
      minSum[r + 1][c] = Math.min(minSum[r + 1][c], minSum[r][c] + grid[r + 1][c]);
    }

    if (c + 1 < size) {
      minSum[r][c + 1] = Math.min(minSum[r][c + 1], minSum[r][c] + grid[r][c + 1]);
    }
  }
}

const path = Array.from({ length: size }, () => Array(size).fill('.'));
let r = size - 1;
let c = size - 1;

while (r > 0 && c > 0) {
  if (minSum[r - 1][c] < minSum[r][c - 1]) {
    path[r - 1][c] = '#';
    r--;
  } else {
    path[r][c - 1] = '#';
    c--;
  }
}

path[0][0] = '#';
path[size - 1][size - 1] = '#';

for (const row of path) {
  process.stdout.write(row.join('') + '\r\n');
}

/*
3
943
216
091

[ 9, 13, 16 ]
[ 11, 12, 18 ]
[ 11, 20, 19 ]

[ '#', '.', '.' ]
[ '#', '#', '#' ]
[ '.', '.', '#' ]
*/