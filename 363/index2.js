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

let a = readline();
let b = readline();

const bigmultiply = (a, b) => {
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

console.log(bigmultiply(a, b));
