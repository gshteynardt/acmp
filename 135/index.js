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

const nV = nextInt();
const dist = Array.from({ length: nV }, () => Array.from({ length: nV }, () => 0));

for (let i = 0; i < nV; i++) {
  for (let j = 0; j < nV; j++) {
    dist[i][j] = nextInt();
  }
}


/*
до витка цикла m = x, dist[i][j] содержит кратчайший путь из i в j, если можно использовать промежуточные вершины от 0 до x - 1

во сремя витка m = x обновляем dist[i][j] на кратчайший путь с разрешением еще одной дополнительной промежуточной вершины x

пусть кратчайший путь из 3 -> 5 проходит 3 -> 2 -> 0 -> 1 -> 5, 
при m = 2 будет обновление - путь 3 -> 5, как склейка 3 -> 2 и 2 -> 0 -> 1 -> 5
до этого, при m = 1 будет обновление - путь 2 -> 5, как склейка 2 -> 0 -> 1 и 1 -> 5
до этого, при m = 0 будет обновление - путь 2 -> 1, как склейка 2 -> 0 и 0 -> 1

time O(nV**3)
space O(nV**2)

Находит кратчайшие пути от каждой вершины до каждой
*/
for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      dist[i][j] = Math.min(dist[i][j], dist[i][m] + dist[m][j]);
    }
  }
}

for (const row of dist) {
  console.log(row.join(' '));
}

/*
4
0 5 9 100
100 0 2 8
100 100 0 7
4 100 100 0

=>
0 5 7 13
12 0 2 8
11 16 0 7
4 9 11 0
*/
