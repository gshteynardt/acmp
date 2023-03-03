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

const [n, a, b, w, h] = readline().split(' ').map(BigInt);

const max = (a, b) => {
  return a > b ? a : b;
};

const protectiveWidthToSlots = (a, b, d) => {
  const nW = w / (a + 2n * d);
  const nH = h / (b + 2n * d);
  return nW * nH;
};

let left = 0n; //protectiveWidthToSlots(left) >= n
let right = max(w, h) + 1n; //protectiveWidthToSlots(right) < n

while (right - left > 1n) {
  const mid = (left + right) / 2n;

  if (protectiveWidthToSlots(a, b, mid) >= n || protectiveWidthToSlots(b, a, mid) >= n) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(String(left));
