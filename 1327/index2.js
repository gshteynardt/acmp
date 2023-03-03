input = require('fs').readFileSync(0, 'binary');
const data = input.trim().split(/\s+/).map(Number);

const k = data[1]
const segments = data.splice(2);

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
