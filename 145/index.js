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
let b = Number(readline());

/*
31415926 / 715
2860      4
 2815     3
  6709    9
   2742   3
    5976  8
     256
*/

const bigDivShort = (a, b) => {
  a = a.split('').map(Number); //not reversed

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

console.log(bigDivShort(a, b));
