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

const [a, k, b, m, x] = readline().split(' ').map(Number);

const dayToTree = d => {
  const per1 = Math.floor(d - Math.floor(d / k)) * a;
  const per2 = Math.floor(d - Math.floor(d / m)) * b;

  return per1 + per2;
};

let left = 0; //dayToQuantity(left) < x
let right = 1; //dayToQuantity(right) >= x

while (dayToTree(right) < x) {
  left = right;
  right *= 2;
}

while (right - left > 1) {
  const mid = Math.floor(left + (right - left) / 2);

  if (dayToTree(mid) < x) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(right);
