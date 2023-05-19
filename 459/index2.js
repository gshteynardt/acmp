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

const path = readline();

const assert = e => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

const size = path.length * 4 + 1 + 2;
const key = (r, c) => r * size + c;
const dist = new Map(); //key(r, c) => dist
let r = size >> 1;
let c = size >> 1;
const startR = r;
const startC = c;
dist.set(key(r, c), -1);

const directions = {
  'N': [-1, 0],
  'E': [0, 1],
  'S': [1, 0],
  'W': [0, -1],
};

for (const step of path) {
  const [dr, dc] = directions[step];
  r += dr;
  c += dc;
  dist.set(key(r, c), -1);

  r += dr;
  c += dc;
  dist.set(key(r, c), -1);
}

const finishR = r;
const finishC = c;

const q = [];
q.push([startR, startC]);
dist.set(key(startR, startC), 0);
let front = 0;

while (front < q.length) {
  const [r, c] = q[front];
  front++;

  for (const [dr, dc] of Object.values(directions)) {
    const nr = r + dr;
    const nc = c + dc;

    if (dist.get(key(nr, nc)) === -1) {
      q.push([nr, nc]);
      dist.set(key(nr, nc), 1 + dist.get(key(r, c)));
    }
  }
}

let backPath = [];

r = finishR;
c = finishC;
const priorities = ['N', 'E', 'S', 'W'];

while (!(r === startR && c === startC)) {
  let found = false;

  for (const dir of priorities) {
    const [dr, dc] = directions[dir];

    if (dist.get(key(r + dr, c + dc)) === dist.get(key(r, c)) - 1) {
      backPath.push(dir);
      r += dr * 2;
      c += dc * 2;
      found = true;
      break;
    }
  }

  assert(found);
}

console.log(backPath.join(''));

//EENNESWSSWE