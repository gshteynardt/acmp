const assert = (e) => {
    if (!e) {
        throw new Error('assertion failed');
    }
};

const n = 1 << 20; // 2^20
const max = Array(n << 1); // Int32Array

for (let i = 0; i < n; i++) {
    max[n + i] = Math.floor(Math.random() * 100_000);
}

for (let i = n - 1; i >= 1; i--) {
    max[i] = Math.max(max[i << 1], max[(i << 1) | 1]); // Math.max(max[i * 2], max[i * 2 + 1])
}

const nq = 5 << 20; // the number of queries
let sum = 0;

const start = performance.now();

for (let iq = 0; iq < nq; iq++) {
    // the index of query
    let left = n + Math.floor(Math.random() * n);
    let right = n + Math.floor(Math.random() * n);
    [left, right] = [Math.min(left, right), Math.max(left, right)];

    let ans = 0;

    while (left <= right) {
        if ((left & 1) === 1) {
            ans = Math.max(ans, max[left]);
            left++;
        }

        if ((right & 1) === 0) {
            ans = Math.max(ans, max[right]);
            right--;
        }

        left >>= 1;
        right >>= 1;
    }

    sum += ans;
}

const duration = performance.now() - start;

console.log({ sum });
console.log({ duration }); // ~ 900 ms for 5 * 2^20 random queries


/*
5
3 8 1 7 6
2
1 3
3 5
*/

/*
 [             ]
3 1 4 1 5 9 2 6
 3  [4   9   6]
   4      [9]
       9

n = 2^20 ~= 10^6 - 
sqrt декомпозиция 2^10 групп по 2^10, в худшем случае ~ 3*2^10 ~ 3_000 действий
дерево отрезков ~ 2*log2(2^20) = 40

0 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15
? 9|4 9|3 4 9 6|3 1  4  1  5  9  2  6
*/
