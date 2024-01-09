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

const n = nextInt();
const nums = Array(n).fill(0);

for (let i = 0; i < n; i++) {
  const num = nextInt();
  nums[i] = num;
}

const INF = 10_001;

// minVal[len] - минимальный элемент, которым может заканчиваться возрастающая подпоследовательность длины len
const minVal = Array(1 + n).fill(INF);
minVal[0] = 0;

let maxLen = 1;

for (const num of nums) {
  let left = 0; // minVal[left] < num
  let right = n; // minVal[right] >= num

  while (right - left > 1) {
    const mid = (left + right) >> 1;

    if (minVal[mid] < num) {
      left = mid;
    } else {
      right = mid;
    }
  }

  minVal[right] = num;
  maxLen = Math.max(maxLen, right);
}

console.log(maxLen);

/*
6
3 29 5 5 28 6
*/