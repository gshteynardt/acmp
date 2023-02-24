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

  let left = BigInt('1' + '0'.repeat(Math.ceil(a.length / 2) - 1)); // left * left <= a
  let right = BigInt('1' + '0'.repeat(Math.ceil(a.length / 2))); // right * right > a
  a = BigInt(a);

  //right - left > 1 <=> left + 1 < right <=> compare(left + 1, right) < 0
  while (right - left > 1) {
    const mid = (left + right) >> BigInt(1);

    if (mid * mid <= a) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return String(left);
};

let n = readline();

console.log(bigSqrt(n));
