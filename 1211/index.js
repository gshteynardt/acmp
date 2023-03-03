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

const [a, k, b, m, x] = readline().split(' ').map(BigInt);

const dayToTree = d => {
  const per1 = (d - d / k) * a;
  const per2 = (d - d / m) * b;

  return per1 + per2;
};

let left = 0n; //dayToQuantity(left) < x
let right = 1n; //dayToQuantity(right) >= x

while (dayToTree(right) < x) {
  left = right;
  right *= 2n;
}

while (right - left > 1n) {
  const mid = (left + right) / 2n;

  if (dayToTree(mid) < x) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(String(right));
