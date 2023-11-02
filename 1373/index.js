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
const INF = nV * 100;
const dist = Array.from({ length: nV }, () => Array.from({ length: nV }, () => INF));

for (let i = 0; i < nV; i++) {
  dist[i][i] = 0;
}

for (let i = 0; i < nE; i++) {
  let u = nextInt() - 1;
  let v = nextInt() - 1;
  let l = nextInt();

  dist[u][v] = Math.min(dist[u][v], l);
  dist[v][u] = Math.min(dist[v][u], l);
}

for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      dist[i][j] = Math.min(dist[i][j], dist[i][m] + dist[m][j]);
    }
  }
}

let ans = -1;

for (let i = 0; i < nV; i++) {
  for (let j = i + 1; j < nV; j++) {
    if (dist[i][j] < INF) {
      ans = Math.max(ans, dist[i][j]);
    }
  }
}

console.log(ans === -1 ? 0 : ans);
/*
3 2
1 2 1
2 3 2

3 0
*/
