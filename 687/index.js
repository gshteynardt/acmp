const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

class Scanner {
  constructor() {
    this.fs = require('fs');
    this.b = Buffer.alloc(1 << 16);
    this.pos = 0;
    this.size = 0;
    this.EOF = -1;
    this.NONE = -2;
    this.lastCh = this.NONE;
    this.nextInt = this.nextInt.bind(this);
    this.next = this.next.bind(this);
    this.nextLine = this.nextLine.bind(this);
  }

  _nextChar() { // returns code of next char and skips it or returns EOF if the stream ended
    if (this.pos === this.size) {
      this.size = this.fs.readSync(0, this.b, 0, this.b.length);
      this.pos = 0;

      if (this.size === 0) {
        return this.EOF;
      }
    }

    assert(this.pos < this.size);

    const ans = this.b[this.pos];
    this.pos++;

    return ans;
  }

  nextInt() {
    const SPACE = ' '.charCodeAt(0);
    const CR = '\r'.charCodeAt(0);
    const LF = '\n'.charCodeAt(0);
    const ZERO = '0'.charCodeAt(0);
    const NINE = '9'.charCodeAt(0);
    const MINUS = '-'.charCodeAt(0);
    let ch = this.lastCh;

    if (ch === this.NONE) {
      ch = this._nextChar();
    }

    while (ch === SPACE || ch === CR || ch === LF) {
      ch = this._nextChar();
    }

    let multiply = 1;

    if (ch === MINUS) {
      ch = this._nextChar();
      multiply = -1;
    }

    assert(ZERO <= ch && ch <= NINE);

    let n = ch - ZERO;
    ch = this._nextChar();

    while (ZERO <= ch && ch <= NINE) {
      const d = ch - ZERO;
      n = n * 10 + d;
      ch = this._nextChar();
    }

    assert(ch === SPACE || ch === CR || ch === LF || ch === this.EOF);

    this.lastCh = ch;

    return n * multiply;
  }

  next() {
    const SPACE = ' '.charCodeAt(0);
    const CR = '\r'.charCodeAt(0);
    const LF = '\n'.charCodeAt(0);
    let ch = this.lastCh;

    if (ch === this.NONE) {
      ch = this._nextChar();
    }

    while (ch === SPACE || ch === CR || ch === LF) {
      ch = this._nextChar();
    }

    assert(ch !== this.EOF);

    let word = String.fromCharCode(ch);
    ch = this._nextChar();

    while (!(ch === SPACE || ch === CR || ch === LF || ch === this.EOF)) {
      word += String.fromCharCode(ch);
      ch = this._nextChar();
    }

    assert(ch === SPACE || ch === CR || ch === LF || ch === this.EOF);

    this.lastCh = ch;

    return word;
  }

  nextLine() {
    const CR = '\r'.charCodeAt(0);
    const LF = '\n'.charCodeAt(0);
    let ch = this.lastCh;

    if (ch === this.NONE) {
      ch = this._nextChar();
    }

    let s = '';

    while (true) {
      if (ch === this.EOF) {
        break;
      }

      if (ch === LF) {
        ch = this.NONE;
        break;
      }

      if (ch === CR) {
        ch = this._nextChar();

        if (ch === LF) {
          ch = this.NONE;
        }

        break;
      }

      s += String.fromCharCode(ch);
      ch = this._nextChar();
    }

    this.lastCh = ch;

    return s;
  }
}

const input = new Scanner();
const nextInt = input.nextInt;
const sizeR = nextInt();
const sizeC = nextInt();
const grid = Array.from({ length: 1 + sizeR + 1 }, () => Array(1 + sizeC).fill(null));

for (let r = 1; r <= sizeR; r++) {
  for (let c = 1; c <= sizeC; c++) {
    grid[r][c] = nextInt();
  }
}

const minCost = Array.from({ length: 1 + sizeR + 1 }, () => Array(1 + sizeC).fill(1 << 30));

for (let c = sizeC; c >= 1; c--) {
  for (let r = 1; r <= sizeR; r++) {
    if (c === sizeC) {
      minCost[r][c] = grid[r][c];
    } else {
      minCost[r][c] = grid[r][c] + Math.min(minCost[r][c + 1], minCost[r + 1][c + 1], minCost[r - 1][c + 1]);
    }
  }
}

let startIndex = -1;
let min = 1 << 30;

for (let r = 1; r <= sizeR; r++) {
  if (minCost[r][1] < min) {
    startIndex = r;
    min = minCost[r][1];
  }
}

const idx = [startIndex];

let currIndex = startIndex;

for (let c = 2; c <= sizeC; c++) {
  let nextIndex = -1;
  let nextMin = 1 << 30;

  for (let r = currIndex - 1; r <= currIndex + 1; r++) {
    if (minCost[r][c] < nextMin) {
      nextIndex = r;
      nextMin = minCost[r][c];
    }
  }

  idx.push(nextIndex);
  currIndex = nextIndex;
}

console.log(idx.join(' '));
console.log(min);

/*
5 6
3 4 1 2 8 6
6 1 8 2 7 4
5 9 3 9 9 5
8 4 1 3 2 6
3 7 2 8 6 4

    [ 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991 ],
    [ 9007199254740991, 16, 18, 14, 13, 12, 6 ],
    [ 9007199254740991, 19, 13, 21, 13, 11, 4 ],
    [ 9007199254740991, 18, 19, 12, 15, 13, 5 ],
    [ 9007199254740991, 22, 14, 10, 9, 6, 6 ],
    [ 9007199254740991, 17, 17, 11, 14, 10, 4 ],
    [ 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991, 9007199254740991 ]
*/
