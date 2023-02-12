/*
left = -1 right = 11 mid = 5
left = -1 right = 5 mid = 2
left = -1 right = 2 mid = 0
*/
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

let left = 0; // left < result <=> query(left) === left
let right = 10 ** 9; // right >= result <=> query(right) < right

while (right - left > 1) {
  const mid = (left + right) >> 1;

  console.log(`? ${mid}`);

  const res = Number(readline());

  if (res === mid) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(`! ${right}`);
