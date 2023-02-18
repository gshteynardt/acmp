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

let [a, b, c] = readline().split(' ').map(BigInt);

const max = (a, b) => {
  return a > b ? a : b;
}

console.log(max(max(a, b), c).toString());
