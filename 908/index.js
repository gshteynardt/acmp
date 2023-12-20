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
const minSteps = Array.from({ length: 1 + n }, () => n); // minSteps[i] - минимальное кол-во шагов уменьшения на 1, в два раза или в три раза от i до 1

for (let i = 1; i <= n; i++) {
  if (i === 1) {
    minSteps[1] = 0;
  } else {
    minSteps[i] = minSteps[i - 1] + 1;

    if (i % 2 === 0) {
      minSteps[i] = Math.min(minSteps[i], minSteps[i / 2] + 1);
    }

    if (i % 3 === 0) {
      minSteps[i] = Math.min(minSteps[i], minSteps[i / 3] + 1);
    }
  }
}

console.log(minSteps[n]);
