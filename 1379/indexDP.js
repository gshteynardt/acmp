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
const flightCost = Array.from({ length: nE }, () => -1);

for (let i = 0; i < nE; i++) {
  from[i] = nextInt() - 1;
  to[i] = nextInt() - 1;
  flightCost[i] = nextInt();
}

const INF = nights * (10 ** 6) + 1;
const minCost = Array.from({ length: 1 + nights }, () => Array.from({ length: nV }, () => INF)); // minCost[number of flights][destination city]
minCost[0][first] = 0;

for (let flights = 1; flights <= nights; flights++) {
  for (let city = 0; city < nV; city++) {
    minCost[flights][city] = minCost[flights - 1][city]; // можно остаться в городе
  }

  for (let j = 0; j < nE; j++) {
    minCost[flights][to[j]] = Math.min(minCost[flights][to[j]], minCost[flights - 1][from[j]] + flightCost[j]);
  }
}

console.log(minCost[nights][last] === INF ? -1 : minCost[nights][last]);

/*
4 5 2 1 4
1 2 1
2 3 1
3 4 1
1 3 3
1 4 5
*/
