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

const n = Number(readline()); //кол-во глав
const pages = readline().split(' ').map(Number); //страницы
const k = Number(readline()); //кол-во томов

const assert = e => {
  if (!e) {
    throw new Error('Assertion failed')
  }
};

const canPublish = limit => {
  let quantity = 0;
  let curSize = limit;

  for (const page of pages) {
    if (page > limit) {
      return false;
    }

    if (curSize + page <= limit) {
      curSize += page;
    } else {
      quantity++;

      if (quantity > k) {
        return false;
      }

      curSize = page;
    }
  }

  return true;
};

let left = Math.max(...pages) - 1;//canPublish(left) === false
let right = pages.reduce((acc, page) => acc + page, 0);//canPublish(right) === true
assert(!canPublish(left));
assert(canPublish(right));

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canPublish(mid)) {
    right = mid;
  } else {
    left = mid;
  }

  assert(!canPublish(left));
  assert(canPublish(right));
}

assert(right - left === 1);

console.log(right);
