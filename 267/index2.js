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

const [n, x, y] = readline().split(' ').map(Number);

const timeToCopies = t => {
  const fastest = Math.min(x, y);

  if (t < fastest) return 0;

  return Math.floor((t - fastest) / x) + Math.floor((t - fastest) / y) + 1;
};

let left = Math.min(x, y) - 1; //timeToCopies(left) < n
let right = Math.min(x, y) * n; //timeToCopies(right) >= n

while (right - left > 1) {
  const mid = Math.floor((left + right) / 2);

  if (timeToCopies(mid) < n) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(right);