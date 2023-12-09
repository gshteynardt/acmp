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

const nStations = nextInt();
const end = nextInt() - 1;
const nTrains = nextInt();

class Edge {
  constructor(begin, end, to) {
    this.begin = begin;
    this.end = end;
    this.to = to;
  }
}

const graph = Array.from({ length: nStations }, () => []);

for (let i = 0; i < nTrains; i++) {
  const len = nextInt();
  let prevStation = nextInt() - 1;
  let prevTime = nextInt();

  for (let j = 1; j < len; j++) {
    const currStation = nextInt() - 1;
    const currTime = nextInt();

    graph[prevStation].push(new Edge(prevTime, currTime, currStation));
    prevStation = currStation;
    prevTime = currTime;
  }
}

const INF = 10 ** 9 + 1;
const minTime = Array.from({ length: nStations }, () => INF);
minTime[0] = 0;

const isFinal = Array.from({ length: nStations }, () => false);

while(true) {
  let minStation = -1;

  for (let i = 0; i < nStations; i++) {
    if (!isFinal[i]) {
      if (minStation === -1 || minTime[i] < minTime[minStation]) {
        minStation = i;
      }
    }
  }

  if (minStation === -1) {
    break;
  }

  isFinal[minStation] = true;

  for (const { begin, end, to } of graph[minStation]) {
    if (begin >= minTime[minStation]) {
      if (end < minTime[to]) {
        minTime[to] = end;
      }
    }
  }
}

console.log(minTime[end] === INF ? -1 : minTime[end]);

/*
5 3
4
2 1 5 2 10
2 2 10 4 15
4 5 0 4 17 3 20 2 35
3 1 2 3 40 4 45
*/
