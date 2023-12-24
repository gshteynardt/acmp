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
const nails = [];

for (let i = 0; i < n; i++) {
  nails.push(nextInt());
}

nails.sort((a, b) => a - b);

const minLen = Array(n).fill(0); // minLen[i] - мин суммарная длина нитей, когда любые два гвоздя от nails[0] до nails[i] соединены нитью

minLen[0] = 0;
minLen[1] = nails[1] - nails[0];

if (2 < n) {
  minLen[2] = nails[2] - nails[0];
}

if (3 < n) {
  minLen[3] = (nails[1] - nails[0]) + (nails[3] - nails[2]);
}

for (let i = 4; i < n; i++) {
  minLen[i] = Math.min(minLen[i - 1], minLen[i - 2]) + nails[i] - nails[i - 1];
}

console.log(minLen[n - 1]);

/*
6
3 4 12 6 14 13
*/
