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
const N = nextInt();

const bigplus = (a, b) => {
  a = a.split('').reverse().map(Number);
  b = b.split('').reverse().map(Number);

  let result = [];
  let carry = 0;

  for (let i = 0; i < a.length || i < b.length || carry > 0; i++) {
    const sum =(a[i] ?? 0) + (b[i] ?? 0) + carry;
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
  }

  return result.reverse().join('');
};

const count = Array(1 + N).fill('0'); // count[i] - кол-во маршрутов мячика с вершины i на землю
count[0] = '1';

for (let i = 1; i <= N; i++) {
  for (let j = Math.max(0, i - 3); j < i; j++) {
    count[i] = bigplus(count[i], count[j]);
  }
}

console.log(count[N]);

/*
  0 = 1
  1 = 1
  2 = 2 -> 2-1-0 2-0
  3 = 4 -> 3-2-1-0 3-1-0 3-2-0 3-0
  4 = 7 -> 4-3-2-1-0 4-3-2-0 4-3-1-0 4-2-1-0 4-1-0 4-3-0 4-2-0

  2073693258389777400
  2073693258389777176
*/
