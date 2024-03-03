let calls = 0;

const rand7 = () => {
  calls++;

  return 1 + Math.floor(Math.random() * 7);
};

const assert = (e) => {
  if (!e) {
      throw new Error('assertion failed');
  }
};

let rangeR = 1;
let r = 0;

const rand10 = function () {
  while (true) {
      if (rangeR === 1) {
          r = rand7() - 1; // [0,6]
          rangeR = 7;
      }

      assert(rangeR > 1);

      // 1.497 - expected number of rand7 calls
      const c = rand7() - 1;
      const rangeC = 7;

      const index = r * rangeC + c;
      const indexRange = rangeR * rangeC;
      const divisibleRange = indexRange - indexRange % 10;

      if (index >= divisibleRange) {
          r = index - divisibleRange;
          rangeR = indexRange - divisibleRange;
          continue;
      }

      const ans = (index % 10) + 1;
      r = Math.floor(index / 10);
      rangeR = Math.floor(divisibleRange / 10);

      return ans;
  }
};

for (let i = 0; i < 10_000_000; i++) {
  rand10();
}

console.log(calls);

/*
7^a = 10^b = x
8^4 = 16^3

a = log_7(x)
b = log_10(x)
a/b = log_7(x)/log_10(x) = (log(x)/log(7)) / (log(x)/log(10)) = log(x) * log(10) / log(x) / log(7) = log(10)/log(7) = 1,18
*/
