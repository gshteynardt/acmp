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

const m = Number(readline());
const adj = new Map();

for (let i = 0; i < m; i++) {
  let [v1, v2] = readline().split(' -> ');

  let list = adj.get(v1);

  if (list === undefined) {
    list = [];
    adj.set(v1, list);
  }

  list.push(v2);
}

const vStart = readline();
const vEnd = readline();

const seen = new Set();
const q = [];
seen.add(vStart);
q.push([vStart, 0]);
let front = 0;
let ans = -1;

while (front < q.length) {
  const [v, steps] = q[front];
  front++;

  if (v === vEnd) {
    ans = steps;
    break;
  }

  for (const nv of adj.get(v) ?? []) {
    if (!seen.has(nv)) {
      seen.add(nv);
      q.push([nv, steps + 1]);
    }
  }
}

console.log(ans);

/*
5
Aqua -> AquaVita
AquaVita -> PhilosopherStone
AquaVita -> Argentum
Argentum -> Aurum
AquaVita -> Aurum
Aqua
Aurum
*/