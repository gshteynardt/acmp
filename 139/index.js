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
const nE = nextInt();
const INF = nV * 10_000;
const edges = [];

for (let i = 0; i < nE; i++) {
  const from = nextInt() - 1;
  const to = nextInt() - 1;
  const dist = nextInt();

  edges.push({ from, to, dist });
}

const maxDist = Array.from({ length: nV }, () => -INF);
maxDist[0] = 0;

for (let t = 1; t < nV; t++) {
  for (const { from, to, dist } of edges) {
    if (maxDist[from] > -INF) {
      maxDist[to] = Math.min(INF, Math.max(maxDist[to], maxDist[from] + dist));
    }
  }
}

for (let t = 0; t < nV; t++) {
  for (const { from, to, dist } of edges) {
    if (maxDist[from] > -INF && maxDist[from] + dist > maxDist[to]) {
      maxDist[to] = INF;
    }
  }
}

if (maxDist[nV - 1] === -INF) {
  console.log(':(');
} else if (maxDist[nV - 1] === INF) {
  console.log(':)');
} else {
  console.log(maxDist[nV - 1]);
}

/*
2 2
1 2 5
1 2 -5
*/
