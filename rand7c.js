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

let randomNums = [];
let next = 0;
let range = 1n;

for (let i = 0; i < 71; i++) {
  range *= 7n;
}

const pow10 = BigInt('1' + '0'.repeat(String(range).length - 1));
const divisibleRange = range - range % pow10;

const rand10 = function () {
  if (next < randomNums.length) {
    const ans = randomNums[next];
    next++;

    return ans;
  }

  while (true) {
    let num = 0n;

    for (let i = 0; i < 71; i++) {
      num = num * 7n + (BigInt(rand7() - 1));
    }

    if (num >= divisibleRange) {
      continue;
    }

    randomNums = [];
    num = String(num);
  
    for (let i = 0; i < 60; i++) {
      randomNums.push(Number(num[i] ?? '0') + 1);
    }

    next = 1;

    return randomNums[0];
  }
};

const research = () => {
  let pow7 = 1n;

  for (let i = 1; i < 100; i++) {
    pow7 *= 7n;

    if (String(pow7).startsWith('10')) {
      console.log(i, pow7, String(pow7).length - 1);
    }
  }
};

// research();

for (let i = 0; i < 10_000_000; i++) {
  rand10();
}

console.log(calls);

/*
7^a = 10^b = x
8^4 = 16^3

a = log_7(x)
b = log_10(x)
a/b = log_7(x)/log_10(x) = (log(x)/log(7)) / (log(x)/log(10)) = log(x) * log(10) / log(x) / log(7) = log(10)/log(7) = 1,1832
*/
