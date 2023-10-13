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
const INF = nV * (10 ** 6);
const dist = Array.from({ length: nV }, () => Array.from({ length: nV }, () => 0));

for (let i = 0; i < nV; i++) {
  for (let j = 0; j < nV; j++) {
    dist[i][j] = nextInt();
  }
}

for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      if (dist[i][m] < INF && dist[m][j] < INF) {
        dist[i][j] = Math.max(-INF, Math.min(dist[i][j], dist[i][m] + dist[m][j]));
      }
    }
  }
}

let hasNegativeLoop = false;

for (let i = 0; i < nV; i++) {
  if (dist[i][i] < 0) {
    hasNegativeLoop = true;
    break;
  }
}

if (hasNegativeLoop) {
  console.log(-1);
} else {
  let minLength = INF;

  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      if (i !== j) {
        minLength = Math.min(minLength, dist[i][j]);
      }
    }
  }

  console.log(minLength);
}

/*
3
0 42 18468
6335 0 26501
19170 15725 0

3
0 -7 3
-2 0 10
2 215 0
*/
