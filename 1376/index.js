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
const nC = nextInt();
const cities = [];
const INF = nV * 10 ** 5;
const dist = Array.from({ length: nV }, () => Array.from({ length: nV }, () => INF));
const next = Array.from({ length: nV }, () => Array.from({ length: nV }, () => -1));
const keyToIndexFlight = [];
const getKey = (u, v) => u * nE + v;

for (let i = 0; i < nV; i++) {
  dist[i][i] = 0;
}

for (let i = 0; i < nE; i++) {
  const u = nextInt() - 1;
  const v = nextInt() - 1;
  const w = nextInt();
  keyToIndexFlight.push(getKey(u, v));
  dist[u][v] = Math.min(dist[u][v], w);
  next[u][v] = v;
}

for (let i = 0; i < nC; i++) {
  cities[i] = nextInt();
}


for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      if (dist[i][m] < INF && dist[m][j] < INF) {
        if (dist[i][j] < dist[i][m] + dist[m][j]) {
          next[i][j] = next[i][m];
        }

        dist[i][j] = Math.max(-INF, Math.max(dist[i][j], dist[i][m] + dist[m][j]));
      }
    }
  }
}

let hasLoop = false;

for (let i = 0; i < nV && !hasLoop; i++) {
  for (let j = 0; j < nV && !hasLoop; j++) {
    for (let m = 0; m < nV; m++) {
      if (dist[i][m] < INF && dist[m][j] < INF && dist[m][m] > 0) {
        hasLoop = true;
        break;
      }
    }
  }
}

if (hasLoop) {
  console.log('infinitely kind');
} else {
  const constructPath = (u, v) => {
    if (next[u][v] == -1) {
      return [];
    }

    const path = [];
    path.push(u);

    while (u != v) {
      u = next[u][v];
      path.push(u);
    }

    return path;
  }

  const paths = [];
  let totalFlight = 0;

  for (let i = 1; i < cities.length; i++) {
    const path = constructPath(cities[i - 1] - 1, cities[i] - 1);
    totalFlight += path.length - 1;

    paths.push(path);
  }

  console.log(totalFlight)

  for (const path of paths) {
    for (let i = 1; i < path.length; i++) {
      const key = getKey(path[i - 1], path[i]);
      console.log(keyToIndexFlight.indexOf(key) + 1);
    }
  }
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