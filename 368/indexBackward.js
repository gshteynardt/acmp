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
    this.nextInt = this.nextInt.bind(this);
    this.next = this.next.bind(this);
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
    let ch = this._nextChar();

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

    return n * multiply;
  }

  next() {
    const SPACE = ' '.charCodeAt(0);
    const CR = '\r'.charCodeAt(0);
    const LF = '\n'.charCodeAt(0);
    let ch = this._nextChar();

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

    return word;
  }
}

const input = new Scanner();
const nextInt = input.nextInt;
const next = input.next;

const size = nextInt();
const grid = Array(size);

for (let i = 0; i < size; i++) {
  grid[i] = next().split('').map(Number);
}

const minSum = Array.from({ length: size }, () => Array(size));

for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    const value = grid[r][c];

    if (r === 0 && c === 0) {
      minSum[r][c] = value;
    } else if (r === 0) {
      minSum[r][c] = minSum[r][c - 1] + value;
    } else if (c === 0) {
      minSum[r][c] = minSum[r - 1][c] + value;
    } else {
      minSum[r][c] = Math.min(minSum[r - 1][c], minSum[r][c - 1]) + value;
    }
  }
}

const path = Array.from({ length: size }, () => Array(size).fill('.'));
let r = size - 1;
let c = size - 1;
path[size - 1][size - 1] = '#';

while (r > 0 && c > 0) {
  if (minSum[r - 1][c] < minSum[r][c - 1]) {
    path[r - 1][c] = '#';
    r--;
  } else {
    path[r][c - 1] = '#';
    c--;
  }
}

while (r > 0) {
  path[r - 1][c] = '#';
  r--;
}

while (c > 0) {
  path[r][c - 1] = '#';
  c--;
}

for (const row of path) {
  process.stdout.write(row.join('') + '\r\n');
}

/*
3
943
216
091

4
0000
9990
9990
9990

[ 9, 13, 16 ]
[ 11, 12, 18 ]
[ 11, 20, 19 ]

[ '#', '.', '.' ]
[ '#', '#', '#' ]
[ '.', '.', '#' ]
*/