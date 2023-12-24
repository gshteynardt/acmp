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

class SqrtSortedSet { // with duplicates
  constructor(groupSize = 512) {
    this.groups = [];
    this.maxGroupSize = groupSize;
    this.debug = false;
  }

  checkInvariant() {
    if (!this.debug) {
      return;
    }

    for (const group of this.groups) {
      assert(1 <= group.length && group.length <= this.maxGroupSize);

      for (let i = 1; i < group.length; i++) {
        assert(group[i - 1] <= group[i]);
      }
    }

    for (let i = 1; i < this.groups.length; i++) {
      assert(this.groups[i - 1].at(-1) <= this.groups[i][0]);
    }
  }

  getGroupIndex(v) {
    let g = 0;

    while (g + 1 < this.groups.length && v >= this.groups[g + 1][0]) {
      g++;
    }

    return g;
  }

  getValueIndex(v, group) {
    let i = 0;

    while (i < group.length && v > group[i]) {
      i++;
    }

    return i;
  }

  add(v) {
    const g = this.getGroupIndex(v);

    if (g === 0 && this.groups.length === 0) {
      this.groups.push([]);
    }

    const group = this.groups[g];
    const i = this.getValueIndex(v, group);

    group.splice(i, 0, v);

    if (group.length > this.maxGroupSize) {
      const group1 = group.slice(0, this.maxGroupSize >> 1);
      const group2 = group.slice(this.maxGroupSize >> 1);

      this.groups.splice(g, 1, group1, group2);
    }

    this.checkInvariant();
  }

  remove(v) {
    const g = this.getGroupIndex(v);

    const group = this.groups[g];
    const i = this.getValueIndex(v, group);

    assert(group[i] === v);

    group.splice(i, 1);

    if (group.length === 0) {
      this.groups.splice(g, 1);
    }

    this.checkInvariant();
  }

  findGE(v) { // greater than v or equal, else INF
    let g = 0;

    while (g < this.groups.length && v > this.groups[g].at(-1)) {
      g++;
    }

    if (g === this.groups.length) {
      return Infinity;
    }

    const group = this.groups[g];
    let i = 0;

    while (i < group.length && v > group[i]) {
      i++;
    }

    assert(i < group.length);
    return group[i];
  }

  findLE(v) { // less than v or equal, else -INF
    let g = this.groups.length - 1;

    while (g >= 0 && v < this.groups[g][0]) {
      g--;
    }

    if (g === -1) {
      return -Infinity;
    }

    const group = this.groups[g];
    let i = group.length - 1;

    while (i >= 0 && v < group[i]) {
      i--;
    }

    assert(i >= 0);
    return group[i];
  }
}

const n = nextInt();
const GROUP_SIZE = 316;
const set = new SqrtSortedSet(GROUP_SIZE);

for (let i = 0; i < n; n++) {
  const value = nextInt();
  set.add(value);
}

const qN = nextInt();
