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

function nextChar() { // returns code of firstFlightTo char and skips it or returns EOF if the stream ended
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
const nC = nextInt();
const INF = nV * (10 ** 5);
const dist = Array.from({ length: nV }, () => Array.from({ length: nV }, () => INF));
const firstFlightTo = Array.from({ length: nV }, () => Array.from({ length: nV }, () => -1));
const flightIndex = Array.from({ length: nV }, () => Array.from({ length: nV }, () => -1));

for (let i = 0; i < nV; i++) {
  dist[i][i] = 0;
}

for (let i = 0; i < nE; i++) {
  const u = nextInt() - 1;
  const v = nextInt() - 1;
  const w = -nextInt();

  if (w < dist[u][v]) {
    dist[u][v] = w;
    flightIndex[u][v] = i;
  }

  firstFlightTo[u][v] = v;
}

const cities = Array.from({ length: nC }, () => -1);

for (let i = 0; i < nC; i++) {
  cities[i] = nextInt() - 1;
}

for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      if (dist[i][m] < INF && dist[m][j] < INF) {
        if (dist[i][m] + dist[m][j] < dist[i][j]) {
          dist[i][j] = Math.max(-INF, dist[i][m] + dist[m][j]);
          firstFlightTo[i][j] = firstFlightTo[i][m];
        }
      }
    }
  }
}

let hasLoop = false;

for (let c = 1; c < nC && !hasLoop; c++) {
  let i = cities[c - 1];
  let j = cities[c];

  for (let m = 0; m < nV; m++) {
    if (dist[i][m] < INF && dist[m][j] < INF && dist[m][m] < 0) {
      hasLoop = true;
      break;
    }
  }
}

if (hasLoop) {
  console.log('infinitely kind');
} else {
  const path = [];

  const addPath = (u, v) => { // returns list of flight ids
    while (u != v) {
      const m = firstFlightTo[u][v];
      assert(m !== -1);
      path.push(flightIndex[u][m]);
      u = m;
    }
  }

  for (let i = 1; i < cities.length; i++) {
    addPath(cities[i - 1], cities[i]);
  }

  console.log(path.length)
  console.log(path.map(flight => flight + 1).join(' '));
}

/*
4 8 5
1 2 -2
2 3 3
3 4 -5
4 1 3
1 3 2
3 1 -2
3 2 -3
2 4 -10
1 3 1 2 4

5 6 5 7 2 3

4 8 5
1 2 -2
2 3 3
3 4 -5
4 1 3
1 3 2
3 1 -2
3 2 -3
2 4 10
1 3 1 2 4
*/
