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
const costs = Array.from({ length: n }, () => null);

for (let i = 0; i < n; i++) {
  costs[i] = nextInt();
}

// maxSum[i] - максимальная сумма, которую можно получить, если мы оказались на i-ой ступеньке стоимостью costs[i]  
const maxSum = Array.from({ length: n }, () => null);
const from = Array.from({ length: n }, () => null); // from[i] с какой ступеньки мы пришли на i-ю
maxSum[0] = costs[0];
from[0] = -1;

for (let i = 1; i < n; i++) {
  if (i === 1) {
    if (costs[0] > 0) {
      maxSum[1] = costs[0] + costs[1];
      from[1] = 0;
    } else {
      maxSum[1] = costs[1];
      from[1] = -1;
    }
  } else {
    if (maxSum[i - 1] > maxSum[i - 2]) {
      maxSum[i] = maxSum[i - 1] + costs[i];
      from[i] = i - 1;
    } else {
      maxSum[i] = maxSum[i - 2] + costs[i];
      from[i] = i - 2;
    }
  }
}

console.log(maxSum[n - 1]);

const ans = [];

for (let i = n - 1; i !== -1; i = from[i]) {
  ans.push(i + 1);
}

ans.reverse();

console.log(ans.join(' '));

/*
3
1 2 1

3
1 -1 1

4
-1 1 -1 1
*/
