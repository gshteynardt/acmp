function readline() {
  const fs = require('fs');
  const b = Buffer.alloc(1);
  let s = '';
  while (true) {
    const len = fs.readSync(0, b);
    if (len == 0) {
      return s;
    }
    if (b[0] == 13) {
      continue;
    }
    if (b[0] == 10) {
      return s;
    }
    s += b;
  }
}

/*
  9999 - 99
  1000 - 31
  999 - 31
  100 - 10
  99 - 9
  10 - 3
  9 - 3
*/

const bigSqrt = a => {
  a = String(a);

  if (a === '0') {
    return '0';
  }

  let q = BigInt('1' + '0'.repeat(Math.ceil(a.length / 2))); // right * right > a
  a = BigInt(a);

  while (true) {
    const nq = (q + a / q) >> BigInt(1);

    if (nq >= q) {
      break;
    }

    q = nq;
  }

  return String(q);
};

let n = readline();

console.log(bigSqrt(n));
