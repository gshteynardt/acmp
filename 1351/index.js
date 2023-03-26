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
    // throw Error('assertion failed');
    while(true);
  }
};

const coords = readline().trim().split(/\s+/).map(Number).sort((a, b) => a - b);

assert(coords.length === 3);

for (const c of coords) {
  assert(0.01 * (1 - 1e-14) <= c && c <= 100);
}

const h = coords[0];
const b = coords[1];
const m = coords[2];

if (h === m) {
  process.stdout.write('0');
} else if (h === b || b === m) {
  process.stdout.write('-1');
} else {
  const mx = Math.sqrt(m * m - h * h);
  const bx = Math.sqrt(b * b - h * h);

  const balance = d => {
    const rx = mx + d;
    const lx = mx - d;
    const br = rx - bx;
    const bl = bx - lx;

    const rLen = Math.sqrt(h * h + rx * rx);
    const lLen = Math.sqrt(h * h + lx * lx);

    return bl / lLen - br / rLen;
  };

  let left = mx - bx;
  assert(balance(left) < 0);
  let right = left;

  while (balance(right) < 0) {
    left = right;
    right *= 2;
  }

  assert(balance(right) >= 0);

  while (true) {
    const mid = (left + right) / 2;

    if (mid === left || mid === right) {
      break;
    }

    if (balance(mid) < 0) {
      left = mid;
    } else {
      right = mid;
    }
  }

  let ans = h * right;
  ans = ans.toFixed(4);

  process.stdout.write(ans + '\r\n');
}
