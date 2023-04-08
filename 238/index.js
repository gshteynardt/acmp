const input = require('fs').readFileSync(0, 'binary');
const data = input.trim().split(/\s+/).map(Number);

const assert = e => {
  if (!e) {
    throw new Error('assertion failed');
  }
}

let pos = 0;
const sizeI = data[pos];
pos++;
assert(2 <= sizeI && sizeI <= 100);
const sizeJ = data[pos];
pos++;
assert(2 <= sizeJ && sizeJ <= 100);
const startI = data[pos] - 1;
pos++;
assert(0 <= startI && startI < sizeI);
const startJ = data[pos] - 1;
pos++;
assert(0 <= startJ && startJ < sizeJ);

const wall = [];

for (let i = 0; i < sizeI; i++) {
  wall.push([]);
  for (let j = 0; j < sizeJ; j++) {
    assert(data[pos] === 0 || data[pos] === 1);
    wall[i].push(data[pos] === 1);
    pos++;
  }
}

const nH = data[pos];
pos++;
assert(0 <= nH && nH <= 1000);

const key = (i, j) => {
  assert(0 <= i && i < sizeI);
  assert(0 <= j && j < sizeJ);

  // return i * sizeJ + j;
  return `${i} ${j}`
};

const endH = new Map(); //endH.get(key(startI, startJ)) -> [endI, endJ]

for (let _ = 0; _ < nH; _++) {
  const startI = data[pos] - 1;
  pos++;
  assert(0 <= startI && startI < sizeI);
  const startJ = data[pos] - 1;
  pos++;
  assert(0 <= startJ && startJ < sizeJ);

  const endI = data[pos] - 1;
  pos++;
  assert(0 <= endI && endI < sizeI);
  const endJ = data[pos] - 1;
  pos++;
  assert(0 <= endJ && endJ < sizeJ);
  assert(endH.get(key(startI, startJ)) === undefined);

  endH.set(key(startI, startJ), [endI, endJ]);
}

const exits = new Set(); //exits.has(key(i, j));

const nE = data[pos];
pos++;
assert(1 <= nE && nE <= 10);

for (let _ = 0; _ < nE; _++) {
  const eI = data[pos] - 1;
  pos++;
  assert(0 <= eI && eI < sizeI);

  const eJ = data[pos] - 1;
  pos++;
  assert(0 <= eJ && eJ < sizeJ);
  assert(!exits.has(key(eI, eJ)));

  exits.add(key(eI, eJ));
}

assert(pos === data.length);

const q = [];
const seen = Array.from({ length: sizeI }, () => Array.from({ length: sizeJ }, () => false));
assert(!wall[startI][startJ]);
q.push([startI, startJ, 1]);
seen[startI][startJ] = true;
let front = 0;
let ans = "Impossible";

while (front < q.length) {
  const [i, j, steps] = q[front];
  front++;

  if (exits.has(key(i, j))) {
    ans = steps;
    break;
  }

  const endIJ = endH.get(key(i, j));

  if (endIJ !== undefined) {
    const [ni, nj] = endIJ;
    if (0 <= ni && ni < sizeI && 0 <= nj && nj < sizeJ && !wall[ni][nj] && !seen[ni][nj]) {
      q.push([ni, nj, steps + 1]);
      seen[ni][nj] = true;
    }
  }

  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      if (di * di + dj * dj === 1) {
        const ni = i + di;
        const nj = j + dj;

        if (0 <= ni && ni < sizeI && 0 <= nj && nj < sizeJ && !wall[ni][nj] && !seen[ni][nj]) {
          q.push([ni, nj, steps + 1]);
          seen[ni][nj] = true;
        }
      }
    }
  }
}

console.log(ans);

/*
4 5
2 1
0 0 0 0 0
0 1 0 0 0
0 0 0 0 0
0 0 0 0 0
2
1 2 1 4
3 1 1 4
1
2 4
*/