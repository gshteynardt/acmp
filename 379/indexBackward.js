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
const startDay = nextInt();
const startMonth = nextInt();

const daysInMonth = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const wins = Array.from({ length: 1 + 12 }, (_, month) => Array(1 + daysInMonth[month]).fill(false)); // wins[m][d] - выиигрывает ли игрок, начинающий в позиции d.m

for (let m = 12; m >= 1; m--) {
  for (let d = daysInMonth[m]; d >= 1; d--) {
    if (d === 31 && m === 12) {
      wins[m][d] = true;
    } else {
      wins[m][d] = false;

      for (const [nD, nM] of [[d + 1, m], [d + 2, m], [d, m + 1], [d, m + 2]]) {
        if (nM <= 12 && nD <= daysInMonth[nM]) {
          if (!wins[nM][nD]) {
            wins[m][d] = true;
          }
        }
      }
    }
  }
}

console.log(wins[startMonth][startDay] ? 1 : 2);
