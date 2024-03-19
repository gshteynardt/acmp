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
  grid[i] = readline().split('').map(Number);
}

const minSum = Array.from({ length: size }, () => Array(size));

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    const value = grid[r][c];

    if (r === 0 && c === 0) {
      minSum[r][c] = value;
    } else if (r === 0) {
      minSum[r][c] = minSum[r][c - 1] + value;
    } else if (c === 0) {
      minSum[r][c] = minSum[r - 1][c] + value;
    } else {
      minSum[r][c] = Math.min(minSum[r - 1][c], minSum[r][c - 1]) + value;
    }
  }
}

const path = Array.from({ length: size }, () => Array(size).fill('.'));
let r = size - 1;
let c = size - 1;
path[size - 1][size - 1] = '#';

while (r > 0 && c > 0) {
  if (minSum[r - 1][c] < minSum[r][c - 1]) {
    path[r - 1][c] = '#';
    r--;
  } else {
    path[r][c - 1] = '#';
    c--;
  }
}

while (r > 0) {
  path[r - 1][c] = '#';
  r--;
}

while (c > 0) {
  path[r][c - 1] = '#';
  c--;
}

for (const row of path) {
  process.stdout.write(row.join('') + '\r\n');
}

/*
3
943
216
091

4
0000
9990
9990
9990

[ 9, 13, 16 ]
[ 11, 12, 18 ]
[ 11, 20, 19 ]

[ '#', '.', '.' ]
[ '#', '#', '#' ]
[ '.', '.', '#' ]
*/