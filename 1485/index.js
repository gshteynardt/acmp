/*
6
2 5 4 1 7 5
7
2 3 1 3 2 4 6

height = 5

2 5 4 1 7 5
3   1 4     6
5 5 5 5 7 5

height = 6

2 5 4 1 7 5
4 6
6 11 4 1 7 5
*/

const parseIntArray = (s, a) => {
  let iS = 0;

  while (iS < s.length && s[iS] === ' ') {
    iS++;
  }

  for (let iA = 0; iA < a.length; iA++) {
    while (iS < s.length && s[iS] === ' ') {
      iS++;
    }

    a[iA] = 0;

    while (iS < s.length && ('0' <= s[iS] && s[iS] <= '9')) {
      const d = s[iS].charCodeAt(0) - '0'.charCodeAt(0);
      a[iA] = a[iA] * 10 + d;
      iS++;
    }
  }

  return a;
};

input = require('fs').readFileSync(0, 'binary');
[lenA, a, lenB, b] = input.trim().split(/\r?\n/);
a = parseIntArray(a, Array.from({ length: Number(lenA) }));
b = parseIntArray(b, Array.from({ length: Number(lenB) }));

const canMakeHeight = h => {
  let iB = 0;

  for (const oldH of a) {
    if (oldH >= h) {
      continue;
    }

    while (true) {
      if (iB === b.length) {
        return false;
      }

      if (b[iB] + oldH < h) {
        iB++;
        continue;
      }

      iB++;
      break;
    }
  }

  return true;
};

const arrMin = a => {
  let result = a[0];

  for (const n of a) {
    if (n < result) {
      result = n;
    }
  }

  return result;
};

const arrMax = a => {
  let result = a[0];

  for (const n of a) {
    if (n > result) {
      result = n;
    }
  }

  return result;
};

let left = arrMin(a);//canMakeHeight(left) === true
let right = arrMax(b) + arrMin(a) + 1;//canMakeHeight(right) === false

while (right - left > 1) {
  const mid = (left + right) >> 1;

  if (canMakeHeight(mid)) {
    left = mid;
  } else {
    right = mid;
  }
}

console.log(left);
