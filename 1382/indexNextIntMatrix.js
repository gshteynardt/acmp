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

function nextInt() {
  let ch = nextChar();

  while (ch === SPACE || ch === CR || ch === LF) {
    ch = nextChar();
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

  return n;
}

const INF = 1441;
const nV = nextInt();
const nE = nextInt();
const time = Array.from({ length: nV }, () => Array.from({ length: nV }, () => INF));
const weight = Array.from({ length: nV }, () => Array.from({ length: nV }, () => 0));

for (let i = 0; i < nE; i++) {
  const v1 = nextInt() - 1;
  const v2 = nextInt() - 1;
  const t = nextInt();
  const w = nextInt();

  time[v1][v2] = t;
  time[v2][v1] = t;

  weight[v1][v2] = w;
  weight[v2][v1] = w;
}

const canReachDestinations = (w) => { // w - weight in grams 
  const minTime = Array.from({ length: nV }, () => INF);
  const isFinal = Array.from({ length: nV }, () => false);
  minTime[0] = 0;

  while (true) {
    let v = -1;

    for (let i = 0; i < nV; i++) {
      if (!isFinal[i]) {
        if (v === -1 || minTime[i] < minTime[v]) {
          v = i;
        }
      }
    }

    if (v === -1 || minTime[v] === INF) {
      break;
    }

    isFinal[v] = true;

    if (v === nV - 1) {
      break;
    }

    for (let to = 0; to < nV; to++) {
      if (w <= weight[v][to]) {
        const newTime = minTime[v] + time[v][to];

        if (newTime < minTime[to]) {
          minTime[to] = newTime;
        }
      }
    }
  }

  return minTime[nV - 1] < INF;
};

let left = 0; // number of cups that can be transported in time 
let right = 10_000_001; // number of cups that can't be transported in time

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canReachDestinations(3_000_000 + mid * 100)) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(left);
/*
3 3
1 2 10 3000220
2 3 20 3000201
1 3 1 3000099

3 3
1 2 10 1000220
2 3 20 1000201
1 3 1 1000099
*/
