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
const start = nextInt() - 1;
const finish = nextInt() - 1;
const nE = nextInt();

const edges = Array.from({ length: nE }, () => null);

for (let i = 0; i < nE; i++) {
  const from = nextInt() - 1;
  const fromTime = nextInt();
  const to = nextInt() - 1;
  const toTime = nextInt();

  edges[i] = { from, fromTime, to, toTime };
}

const INF = 10 ** 9 + 1;
const minT = Array.from({ length: nV }, () => INF);
minT[start] = 0;

for (let i = 0; i < nE; i++) {
  for (const { from, fromTime, to, toTime } of edges) {
    if (fromTime >= minT[from]) {
      minT[to] = Math.min(minT[to], toTime);
    }
  }
}

console.log(minT[finish]);

/*
5
1 2
6
1 0 3 10
4 2 2 -10
4 14 2 -7
3 10 2 10
2 0 4 2
3 10 4 12
*/