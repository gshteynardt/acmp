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

let [a, b, c, d] = readline().split(/\s+/).map(Number);

if (a < 0) {
  a = -a;
  b = -b;
  c = -c;
  d = -d;
}

const f = x => a * x ** 3 + b * x ** 2 + c * x + d;

let left = -2000; //f(left) < 0 <=> left < root
let right = 2000; //f(right) >= 0 <=> right >= root

while (right - left > 0.002) {
  const mid = (left + right) / 2;

  if (f(mid) < 0) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log((left + right) / 2);
