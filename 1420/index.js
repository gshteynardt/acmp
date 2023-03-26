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

const assert = e => {
  if (!e) {
    throw Error('assertion failed');
  }
};

const [n, k] = readline().trim().split(/\s+/).map(Number);
const coords = readline().trim().split(/\s+/).map(Number).sort((a, b) => a - b);

assert(n === coords.length);

// for (let i = 1; i < coords.length; i++) {
//   assert(coords[i - 1] < coords[i]);
// }

const canMinDistance = d => {
  let cows = 1;
  let lastCow = coords[0];

  for (const c of coords) {
    if (c - lastCow < d) {
      continue;
    }

    lastCow = c;
    cows++;
  }

  return cows >= k;
};

let left = 1;
let right = coords[coords.length - 1] - coords[0] + 1;
// assert(canMinDistance(left));
// assert(!canMinDistance(right));

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canMinDistance(mid)) {
    left = mid;
  } else {
    right = mid;
  }
}

assert(right - left === 1);
// assert(canMinDistance(left));
// assert(!canMinDistance(right));

console.log(left);
