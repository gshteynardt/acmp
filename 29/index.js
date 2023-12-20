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

const n = nextInt();
const y = Array.from({ length: n }, () => 0);

for (let i = 0; i < n; i++) {
  y[i] = nextInt();
}

const minCost = Array.from({ length: n }, () => 0); // minCost[last] - мин кол-во энергии необходимое, чтобы добраться до платформы last высоты y[last]
minCost[0] = 0;

for (let i = 1; i < n; i++) {
  if (i === 1) {
    minCost[1] = Math.abs(y[0] - y[1]);
  } else {
    minCost[i] = Math.min(minCost[i - 1] + Math.abs(y[i - 1] - y[i]), minCost[i - 2] + 3 * Math.abs(y[i - 2] - y[i]));
  }
}

console.log(minCost[n - 1]);

/*
3
1 5 10
*/
