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

const bigMultiply = (a, b) => {
  a = String(a);
  b = String(b);

  if (a === '0' || b === '0') {
    return '0'
  }

  a = a.split('').reverse().map(Number);
  b = b.split('').reverse().map(Number);

  let result = [];

  for (let i = 0; i < a.length; i++) {
    let carry = 0;

    for (let j = 0; j < b.length || carry > 0; j++) {
      const mul = a[i] * (b[j] ?? 0) + (result[i + j] ?? 0) + carry;
      result[i + j] = mul % 10;
      carry = Math.floor(mul / 10);
    }
  }

  return result.reverse().join('');
};

const bigDivShort = (a, b) => {
  a = String(a).split('').map(Number); //not reversed
  b = Number(b);

  const result = [];
  let rem = 0;

  for (const d of a) {
    rem = rem * 10 + d;
    result.push(Math.floor(rem / b));
    rem %= b;
  }

  result.reverse();

  while (result.length > 1 && result[result.length - 1] === 0) {
    result.pop();
  }

  result.reverse();

  return result.join('');
};

const bigAdd = (a, b) => {
  a = String(a).split('').reverse().map(Number);
  b = String(b).split('').reverse().map(Number);

  let result = [];
  let carry = 0;

  for (let i = 0; i < a.length || i < b.length || carry > 0; i++) {
    const sum = (a[i] ?? 0) + (b[i] ?? 0) + carry;
    result.push(sum % 10);
    carry = Math.floor(sum / 10);
  }

  return result.reverse().join('');
};

const bigCompare = (a, b) => {
  a = String(a);
  b = String(b);

  if (a.length !== b.length) {
    return a.length - b.length;
  }

  return a.localeCompare(b, 'en');
};

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

  let left = '1' + '0'.repeat(Math.ceil(a.length / 2) - 1); // left * left <= a
  let right = '1' + '0'.repeat(Math.ceil(a.length / 2)); // right * right > a

  //right - left > 1 <=> left + 1 < right <=> compare(left + 1, right) < 0
  while (bigCompare(bigAdd(left, 1), right) < 0) {
    const mid = bigDivShort(bigAdd(left, right), 2);

    if (bigCompare(bigMultiply(mid, mid), a) <= 0) {
      left = mid;
    } else {
      right = mid;
    }
  }

  return String(left);
};

let n = readline();

console.log(bigSqrt(n));
