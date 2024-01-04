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

function nextChar() { // returns code of prev char and skips it or returns EOF if the stream ended
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
  nums[i] = nextInt();
}

const maxLen = Array(n).fill(1); // maxLen[i] длина максимальной подпоследовательности в позици i
const from = Array(n).fill(-1);

//для i-го мы должны перебрать числа, которые стоят левее и посчитать, которые меньше
for (let i = 1; i < n; i++) {
  for (let j = 0; j < i; j++) {
    if (nums[j] < nums[i]) {
      if (maxLen[j] + 1 > maxLen[i]) {
        maxLen[i] = maxLen[j] + 1;
        from[i] = j;
      }
    }
  }
}

let max = 0;
let start = -1;

for (let i = 0; i < n; i++) {
  if (max < maxLen[i]) {
    max = maxLen[i];
    start = i;
  }
}

const ans = [];

for (let i = start; i !== -1; i = from[i]) {
  ans.push(nums[i]);
}

ans.reverse();

process.stdout.write(max + '\r\n');
process.stdout.write(ans.join(' '));

/*
5
1 3 5 2 4
*/
