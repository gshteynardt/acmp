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

const [n, k] = readline().split(' ').map(Number);
const segments = [];

for (let i = 0; i < n; i++) {
  segments.push(Number(readline()))
}

const canCut = len => {
  if (len === 0) {
    return true;
  }

  let count = 0;

  for (const s of segments) {
    count += Math.floor(s / len);
    
    if (count >= k) {
      return true;
    }
  }

  return false;
};

let left = 0; //canCut(left) === true
let right = Math.max(...segments) + 1; //canCut(right) === false

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canCut(mid)) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(left);
