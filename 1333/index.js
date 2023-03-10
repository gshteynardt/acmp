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

const [n, a] = readline().split(/\s+/).map(Number);

const getHeightB = h2 => {
  let h1 = a;
  
  for (let i = 3; i <= n; i++) {
    //h2 = (h1 + h3) / 2 - 1
    //2h2 = h1 + h3 - 2
    //2h2 - h1 + 2 = h3
    //h3 = 2h2 - h1 + 2
    const h3 = 2 * h2 - h1 + 2;
    h1 = h2;
    h2 = h3;

    if (h2 <= 0) {
      return -1;
    }
  }

  return h2;
};

let left = 0; //getHeightB(left) === -1
let right = a; //getHeightB(right) !== -1

while (true) {
  const mid = (left + right) / 2;

  if (mid === left || mid === right) {
    break;
  }

  if (getHeightB(mid) === -1) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(getHeightB(right).toFixed(2))
