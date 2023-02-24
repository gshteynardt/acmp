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

const [w, h, n] = readline().split(' ').map(Number);

const lengthToQuantity = l => {
  return Math.floor(l / w) * Math.floor(l / h);
};

let left = 0; //lengthToQuantity(left) < n
let right = Math.max(w, h) * n; //lengthToQuantity(right) >= n

while (right - left > 1) {
  const mid = Math.floor((left + right) / 2);

  if (lengthToQuantity(mid) < n) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(right);
