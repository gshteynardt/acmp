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

const k = nextInt();
const mod = nextInt();
const cntEnts = Array(1 + k).fill(0);

if (2 < cntEnts.length) {
  cntEnts[2] = 1 % mod;
}

for (let words = 3; words <= k; words++) {
  cntEnts[words] = cntEnts[words - 1];

  if ((words & 1) === 0) {
    cntEnts[words] += cntEnts[words >> 1];
  }

  cntEnts[words] %= mod;
}

console.log(cntEnts[k]);

/*
ровно 2 слова - 1 энт, 4 = 2 * 2 слова - 1 молодой, 3 = 2 + 1 слова - 1 старый
ровно 3 слова - 1 энт, 6 = 3 * 2 слов - 1 молодой, 4 = 3 + 1 слова - 1 старый
ровно 4 слова - 2 энта, 8 = 4 * 2 слов - 2 молодых, 5 = 4 + 1 слов - 2 старых
ровно 5 слов - 2 энта, 10 = 5 * 2 слов - 2 молодых, 6 = 5 + 1 слов - 2 старых
ровно 6 слов - 3 энта, 12 = 6 * 2 слов - 3 молодых, 7 = 6 + 1 слов - 3 старых
ровно 7 слов - 3 энта, 14 = 7 * 2 слов - 3 молодых, 8 = 7 + 1 слов - 3 старых
ровно 8 слов - 5 энта, 16 = 8 * 2 слов - 5 молодых, 9 = 8 + 1 слов - 5 старых
ровно 9 слов - 5 энта, 18 = 9 * 2 слов - 5 молодых, 10 = 9 + 1 слов - 5 старых
ровно 10 слов - 7 энта, 20 = 10 * 2 слов - 7 молодых, 11 = 10 + 1 слов - 7 старых
ровно 11 слов - 7 энта, 22 = 11 * 2 слов - 7 молодых, 12 = 11 + 1 слов - 7 старых
ровно 12 слов - 10 энта, 24 = 12 * 2 слов - 10 молодых, 13 = 12 + 1 слов - 10 старых
ровно 13 слов - 10 энта, 26 = 13 * 2 слов - 10 молодых, 14 = 13 + 1 слов - 10 старых
ровно 14 слов - 13 энта, 28 = 14 * 2 слов - 13 молодых, 15 = 14 + 1 слов - 13 старых
ровно 15 слов - 13 энта, 30 = 15 * 2 слов - 13 молодых, 16 = 15 + 1 слов - 13 старых
ровно 16 слов - 18 энта, 32 = 16 * 2 слов - 18 молодых, 17 = 16 + 1 слов - 18 старых

cntEnts[words] - кол-во энтов, знающих words слов
cntEnts[words] = (cntEnts[words - 1] + cntEnts[words / 2 - если words четное]) % p
cntEnts[words = 2] = 1
cntEnts[k] - ответ
*/

/*
4 10
8 10
360 1000
*/
