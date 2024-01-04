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

class Agent {
  constructor(age, risk) {
    this.age = age;
    this.risk = risk;
  }
}

const agents = Array(n).fill(null);

for (let i = 0; i < n; i++) {
  const age = nextInt();
  const risk = nextInt();
  agents[i] = new Agent(age, risk);
}

agents.sort((a, b) => a.age - b.age);

const INF = n * 1000 + 1;
const minSumRisk = Array(n).fill(INF); // minSumRisk[last] - минимальный суммарный риск для разбиения агентов с 0 до last включительно

for (let i = 1; i < n; i++) {
  if (i === 1) {
    minSumRisk[i] = agents[1].risk;
  } else if (i === 2) {
    minSumRisk[i] = agents[1].risk + agents[2].risk;
  } else if (i === 3) {
    minSumRisk[i] = agents[1].risk + agents[3].risk;
  } else {
    minSumRisk[i] = Math.min(
      agents[i].risk + minSumRisk[i - 2],
      agents[i].risk + agents[i - 1].risk + minSumRisk[i - 3]
    );
  }
}

console.log(minSumRisk[n - 1]);

/*
3
6000 2 5500 3 5000 4
*/
