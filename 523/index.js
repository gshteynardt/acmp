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

const pages = readline().split(' ').map(Number); //страницы
const k = Number(readline()); //кол-во томов

const assert = e => {
  if (!e) {
    throw new Error('Assertion failed')
  }
};

const pageToTome = limit => {
  let quantity = 0;
  let curSize = limit;

  for (const page of pages) {
    if (page > limit) {
      return k + 1;
    }

    if (curSize + page <= limit) {
      curSize += page;
    } else {
      quantity++;
      curSize = page;
    }
  }

  return quantity;
};

let left = Math.max(...pages) - 1;//pageToTome(left) > k
let right = pages.reduce((acc, page) => acc + page, 0);//pageToTome(right) <= k
assert(pageToTome(left) > k);
assert(pageToTome(right) <= k);

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (pageToTome(mid) > k) {
    left = mid;
  } else {
    right = mid;
  }

  assert(pageToTome(left) > k);
  assert(pageToTome(right) <= k);
}

assert(right - left === 1);

console.log(right);
