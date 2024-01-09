const fs = require('fs');
let buff = Buffer.alloc(1 << 16);
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
    size = fs.readSync(0, buff, 0, buff.length);
    pos = 0;

    if (size === 0) {
      return EOF;
    }
  }

  assert(pos < size);

  const ans = buff[pos];
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
const a0 = nextInt();
const k = nextInt();
const b = nextInt();
const m = nextInt();

const nums = Array(n).fill(0);
nums[0] = a0;

for (let i = 1; i < n; i++) {
  nums[i] = (k * nums[i - 1] + b) % m;
}

const INF = 10_001;

// minVal[len] - минимальное элемент, которым может заканчиваеться возрастающая подпоследовательность длины len
const minVal = Array(1 + n).fill(INF);
minVal[0] = 0;

// len[i] - максимальная длина возрастающая подпоследовательности, заканчивающаяся на i-ом элементе
const len = Array(n);
let maxLen = 1;

for (let i = 0; i < n; i++) {
  const num = nums[i];
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
  len[i] = right;
  maxLen = Math.max(maxLen, right);
}

const ans = [];
let currMaxLen = maxLen;

for (let i = n - 1; i >= 0; i--) {
  if (len[i] === currMaxLen) {
    ans.push(nums[i]);
    currMaxLen--;
  }
}

ans.reverse();

console.log(ans.join(' '));

/*
5 41 2 1 100

41 83 67 35 71
*/