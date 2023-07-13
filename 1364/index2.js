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

const [a, b, n] = readline().trim().split(/\s+/).map(Number);

const getKey = (a, b) => a * 10_001 + b;
const q = [];
const from = {};
q.push(0, 0);
from[getKey(0, 0)] = -1;
let front = 0;
let finish = null;
const aa = [];

while (front < q.length) {
  const vA = q[front]; // volume in a
  front++;

  const vB = q[front]; // volume in b 
  front++;

  if (vA === n || vB === n) {
    finish = [vA, vB];
    break;
  }

  {
    const nA = a;
    const nB = vB;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, '>A');
    }
  }

  {
    const nA = vA;
    const nB = b;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, '>B');
    }
  }

  {
    const nA = 0;
    const nB = vB;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, 'A>');
    }
  }

  {
    const nA = vA;
    const nB = 0;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, 'B>');
    }
  }

  {
    const transfer = Math.min(vA, b - vB);
    const nA = vA - transfer;
    const nB = vB + transfer;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, 'A>B');
    }
  }

  {
    const transfer = Math.min(vB, a - vA);
    const nA = vA + transfer;
    const nB = vB - transfer;
    const key = getKey(nA, nB);
    const was = from[key];

    if (was === undefined) {
      q.push(nA, nB);
      from[key] = aa.length;
      aa.push(vA, vB, 'B>A');
    }
  }
}

if (finish === null) {
  console.log('Impossible');
} else {
  let [vA, vB] = finish;
  const moves = [];

  while (true) {
    const parent = from[getKey(vA, vB)];

    if (parent === -1) {
      break;
    } else {
      vA = aa[parent];
      vB = aa[parent + 1];
      const move = aa[parent + 2];
      moves.push(move);
    }
  }

  moves.reverse();

  for (const move of moves) {
    console.log(move);
  }
}
