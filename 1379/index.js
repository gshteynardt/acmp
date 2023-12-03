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
const nights = nextInt();
const first = nextInt() - 1;
const last = nextInt() - 1;

const from = Array.from({ length: nE }, () => -1);
const to = Array.from({ length: nE }, () => -1);
const cost = Array.from({ length: nE }, () => -1);

for (let i = 0; i < nE; i++) {
  from[i] = nextInt() - 1;
  to[i] = nextInt() - 1;
  cost[i] = nextInt();
}

const INF = nights * (10 ** 6) + 1;
const currCost = Array.from({ length: nV }, () => INF);
currCost[first] = 0;

for (let i = 0; i < nights; i++) {
  const prevCost = currCost.slice();

  for (let j = 0; j < nE; j++) {
    currCost[to[j]] = Math.min(currCost[to[j]], prevCost[from[j]] + cost[j]);
  }
}

console.log(currCost[last] === INF ? -1 : currCost[last]);

/*
4 5 2 1 4
1 2 1
2 3 1
3 4 1
1 3 3
1 4 5
*/
