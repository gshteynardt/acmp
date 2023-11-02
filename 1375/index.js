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
const v0 = nextInt() - 1;
const v1 = nextInt() - 1;
const safeP = Array.from({ length: nV }, () => Array.from({ length: nV }, () => 0)); // -log +0 = INF

for (let i = 0; i < nV; i++) {
  safeP[i][i] = 1; // -log 1 = 0
}

for (let i = 0; i < nE; i++) {
  let u = nextInt() - 1;
  let v = nextInt() - 1;
  let p = 1 - nextInt() / 100;

  safeP[u][v] = Math.max(safeP[u][v], p); // -log2 0.5 = 1, -log2 0.25 = 2
  safeP[v][u] = Math.max(safeP[v][u], p);
}

for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      safeP[i][j] = Math.max(safeP[i][j], safeP[i][m] * safeP[m][j]);
    }
  }
}

console.log(1 - safeP[v0][v1]);

/*
3 3
1 3
1 2 20
1 3 50
2 3 20
*/
