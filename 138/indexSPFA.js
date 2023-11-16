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

class FixedCapacityQueue {
  constructor(maxSize) {
    this.q = Array.from({ length: maxSize }, () => null);
    this.after = 0;
    this.first = 0;
    this.size = 0;
  }

  push(value) {
    assert(this.size < this.q.length);
    this.size++;

    this.q[this.after] = value;
    this.after++;

    if (this.after === this.q.length) {
      this.after = 0;
    }
  }

  poll() {
    assert(!this.isEmpty());

    this.size--;

    const value = this.q[this.first];
    this.first++;

    if (this.first === this.q.length) {
      this.first = 0;
    }

    return value;
  }

  isEmpty() {
    return this.size === 0;
  }
}

class Edge {
  constructor(to, w) {
    this.to = to;
    this.w = w;
  }
}

const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
  const from = nextInt() - 1;
  assert(0 <= from && from < nV);
  const to = nextInt() - 1;
  assert(0 <= to && to < nV);
  const w = nextInt();

  adj[from].push(new Edge(to, w));
}

const INF = nV * 100;
const minW = Array.from({ length: nV }, () => INF);
const inQ = Array.from({ length: nV }, () => false);
const q = new FixedCapacityQueue(nV);

minW[0] = 0;
q.push(0);
inQ[0] = true;

while (!q.isEmpty()) {
  const v = q.poll();
  inQ[v] = false;

  for (const { to, w } of adj[v]) {
    if (minW[v] + w < minW[to]) {
      minW[to] = minW[v] + w;

      if (!inQ[to]) {
        q.push(to);
        inQ[to] = true;
      }
    }
  }
}

console.log(minW.map(w => w === INF ? 30_000 : w).join(' '));

/*
4 5
1 2 10
2 3 10
1 3 100
3 1 -10
2 3 1
*/