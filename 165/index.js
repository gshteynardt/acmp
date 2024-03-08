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
}

const input = new Scanner();
const nextInt = input.nextInt;

const sizeR = nextInt();
const sizeC = nextInt();
const count = Array.from({ length: sizeR }, () => Array(sizeC).fill(0)); // count[r][c] - кол-во способов пройти из [0][0] в [r][c]
count[0][0] = 1;

for (let r = 0; r < sizeR; r++) {
  for (let c = 0; c < sizeC; c++) {
    const value = nextInt();

    if (r === sizeR - 1 && c === sizeC - 1) {
      continue;
    }

    if (r + value < sizeR) {
      count[r + value][c] += count[r][c];
    }

    if (c + value < sizeC) {
      count[r][c + value] += count[r][c];
    }
  }
}

console.log(count[sizeR - 1][sizeC - 1]);

/*
3 4
2 1 1 2
3 2 1 44
3 1 1 0
*/