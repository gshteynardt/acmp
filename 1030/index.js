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

// const [a1, a2, a3, a4] = readline().split(/\s+/).map(Number);

// console.log(Math.trunc(Math.sqrt(Math.min(a1, a2) + Math.min(a3, a4))));

const [ t ] = readline().split(/\s+/).map(Number);
console.log((t).toFixed(2));
