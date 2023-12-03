const fs = require('fs');
let b = Buffer.alloc(1 << 16);
let pos = 0;
let size = 0;

const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

const EOF = -1;

function nextChar() { // returns code of next char and skips it or returns EOF if the stream ended
  if (pos === size) {
    size = fs.readSync(0, b, 0, b.length);
    pos = 0;

    if (size === 0) {
      return EOF;
    }
  }

  assert(pos < size);

  const ans = b[pos];
  pos++;

  return ans;
}

const SPACE = ' '.charCodeAt(0);
const CR = '\r'.charCodeAt(0);
const LF = '\n'.charCodeAt(0);
const ZERO = '0'.charCodeAt(0);
const NINE = '9'.charCodeAt(0);
const MINUS = '-'.charCodeAt(0);

function nextInt() {
  let ch = nextChar();

  while (ch === SPACE || ch === CR || ch === LF) {
    ch = nextChar();
  }

  let multiply = 1;

  if (ch === MINUS) {
    ch = nextChar();
    multiply = -1;
  }

  assert(ZERO <= ch && ch <= NINE);

  let n = ch - ZERO;
  ch = nextChar();

  while (ZERO <= ch && ch <= NINE) {
    const d = ch - ZERO;
    n = n * 10 + d;
    ch = nextChar();
  }

  assert(ch === SPACE || ch === CR || ch === LF || ch === EOF);

  return n * multiply;
}

const nV = nextInt();
const INF = nV * 100_000;
const dist = [];

for (let i = 0; i < nV; i++) {
  dist.push([]);

  for (let j = 0; j < nV; j++) {
    const d = nextInt();
    dist[i].push(d === 100_000 ? INF : d);
  }
}

const minDist = Array.from({ length: nV }, () => 0);
const prev = Array.from({ length: nV }, () => -1);

let cycleStart;

for (let t = 0; t < nV; t++) {
  cycleStart = -1;

  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      const newDist = minDist[i] + dist[i][j];

      if (newDist < minDist[j]) {
        minDist[j] = Math.max(-INF, newDist);
        prev[j] = i;
        cycleStart = j;
      }
    }
  }
}

if (cycleStart === -1) {
  console.log('NO');
  process.exit(0);
}

for (let i = 0; i < nV; i++) {
  cycleStart = prev[cycleStart];
  assert(cycleStart !== -1);
}

const cycle = [cycleStart];

for (let v = prev[cycleStart]; v !== cycleStart; v = prev[v]) {
  cycle.push(v);
}

cycle.push(cycleStart);
cycle.reverse();

console.log('YES');
console.log(cycle.length);
console.log(cycle.map(v => v + 1).join(' '));

/*
3
100000 100000 -51
100 100000 100000
100000 -50 100000
*/
