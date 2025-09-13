const assert = (e) => {
    if (!e) {
        throw new Error('assertion failed');
    }
};

const n = 1 << 20; // 2^20
const nums = Array(n);

for (let i = 0; i < n; i++) {
    nums[i] = Math.floor(Math.random() * 100_000);
}

const groupSize = Math.floor(Math.sqrt(n));
const nGroups = Math.ceil(n / groupSize);
const groupMax = Array(nGroups).fill(0);

for (let i = 0; i < n; i++) {
    const g = Math.floor(i / groupSize);
    groupMax[g] = Math.max(groupMax[g], nums[i]);
}

const nq = 1 << 20; // the number of queries
let sum = 0;

const start = performance.now();

for (let iq = 0; iq < nq; iq++) {
    // the index of query
    let l = Math.floor(Math.random() * n);
    let r = Math.floor(Math.random() * n);
    [l, r] = [Math.min(l, r), Math.max(l, r)];

    const gl = Math.floor(l / groupSize);
    const gr = Math.floor(r / groupSize);

    let ans = 0;

    if (gl === gr) {
        for (let i = l; i <= r; i++) {
            ans = Math.max(ans, nums[i]);
        }
    } else {
        // левый хвост
        const afterGroupL = Math.min(n, (gl + 1) * groupSize);

        for (let i = l; i < afterGroupL; i++) {
            ans = Math.max(ans, nums[i]);
        }

        // целые группы между gl и gr
        for (let g = gl + 1; g <= gr - 1; g++) {
            ans = Math.max(ans, groupMax[g]);
        }

        // правый хвост
        for (let i = gr * groupSize; i <= r; i++) {
            ans = Math.max(ans, nums[i]);
        }
    }

    sum += ans;
}

const duration = performance.now() - start;

console.log({ sum });
console.log({ duration }); // ~ 9s for 2^20 random queries

/*
5
3 8 1 7 6
2
1 3
3 5
*/
