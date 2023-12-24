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
const k = nextInt();

const count = Array(1 + n).fill(0); // count[len] - кол-во чисел без двух 0 подряд не начинающихся 0 длины len в системе счисления k
count[1] = k - 1; // первая цифра любая, кроме 0
count[2] = (k - 1) * k; // первая цифра любая, кроме 0, вторая цифра любая

for (let len = 3; len <= n; len++) {
  count[len] = count[len - 1] * (k - 1) + count[len - 2] * (k - 1); // последняя цифра не 0 + последняя цифра 0
}

console.log(count[n]);

/*
1 10 - все числа от 0 до 9 = 10
2 10 - все числа от 10 до 99 = 90
3 10 - все числа от 100 до 999, кроме X00 = 900 - 9
4 10 - все числа от 1000 до 9999, кроме XY00 и Z000 и X00Y

будем сводить задачу к меньшему префиксу
самое простое, что можно отбросить при переходе к префиксу - последняя цифра.
все последнии цифры равноценны, кроме 0, потому что 0 может образовать 00, который запрещены, а все отсальные не могут это образовать.
разбиваем все N значные числа на 2 группы - 1 группа чисел с 0 на конце, вторая группа чисел с ненулевой цифрой на конце.

XYZ0 XYZ[1-9]

количество чисел без двух нулей в группе XYZ[1-9] равно количество XYZ без двух нулей (ответ для N - 1, K) умножить на K - 1

в варианте XYZ0 цифра Z (вторая с конца) не должна быть 0, кол-во вариантов этой цифры K - 1, а если эта цифра не нулевая, то все что перед ней, это число без
двух нулей подряд длины N - 2

count[N > 2][K] = count[N - 1][K] * (K - 1) + count[N - 2][K] * (K - 1);
count[N = 1][K] = K - 1; - все кроме 0
count[N = 2][K] = (K - 1) * K; - все кроме 0 на первом месте и любая цифра на втором месте

K = 2, N = 1
1

K = 2, N = 2
10
11

K = 2, N = 3
101
111
110

K = 2, N = 4
1011
1111
1101
1010
1110

без повторов: группа, получающаяся из K2 N3 имеет единицу на конце, а группа, получающаяся из K2 N2, имеет 0 на конце, поэтому числа в них не пересекаются
внутри каждой группы тоже пересечений нет, потому что числа меньшей длинны были разные и к ним добавлен один и тотже суффикс.

K = 2, N = 5
10111
11111
11011
10101
11101
10110
11110
11010

K = 3, N = 1
1
2

K = 3, N = 2
10
20
11
21
12
22

K = 3, N = 3
101
201
111
211
121
221
102
202
112
212
122
222
110
210
120
220
*/
