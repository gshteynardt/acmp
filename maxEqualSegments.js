
/*
You are given an array A of integers. Find the maximum number of non-intersecting segments of length 2 (two adjacent elements), such that segments have an equal sum.

For example, given A = [10, 1, 3, 1, 2, 2, 1, 0, 4], there are three non-intersecting segments, each whose sum is equal to 4: (1, 3), (2, 2), (0, 4). 
Another three non-intersecting segments are: (3, 1), (2, 2), (0, 4).

Write a function: solution (A)

that, given an array A of N integers, returns the maximum number of segments with equal sums.

Examples:
Given A = [10, 1, 3, 1, 2, 2, 1, 0, 4], the function should return 3, as explained above.
Given A = [5, 3, 1, 3, 2, 3], the function should return 1. Each sum of two adjacent elements is different from the others.
Given A = [9, 9, 9, 9], the function should return 2.
Given A = [1, 5, 2, 4, 3, 3], the function should return 3. There are three segments: (1, 5), (2, 4), (3, 3) whose sums are equal to 6.
*/

const maxEqualSegments = function (nums) {
    const sumToCount = new Map();
    const sumToLast = new Map();
    let ans = 0;

    for (let i = 1; i < nums.length; i++) {
        const sum = nums[i - 1] + nums[i];

        if (!sumToLast.has(sum) || sumToLast.get(sum) < i - 1) {
            const cnt = (sumToCount.get(sum) ?? 0) + 1;
            sumToCount.set(sum, cnt);
            sumToLast.set(sum, i);

            ans = Math.max(ans, cnt);
        }
    }

    return ans;
};

const maxEqualSegmentsLists = function (nums) {
    const sumToIndices = new Map();
    
    for (let i = 1; i < nums.length; i++) {
        const sum = nums[i - 1] + nums[i];

        if (!sumToIndices.has(sum)) {
            sumToIndices.set(sum, []);
        }
        
        sumToIndices.get(sum).push(i);
    }
    
    let ans = 0;

    for (const list of sumToIndices.values()) {
        let cnt = 0;
        let last = -1;

        for (const i of list) {
            if (i - 1 > last) {
                cnt++;
                last = i;
            }
        }

        ans = Math.max(ans, cnt);
    }

    return ans;
};

function test() {
    const data = [
        [[10, 1, 3, 1, 2, 2, 1, 0, 4], 3],
        [[5, 3, 1, 3, 2, 3], 1],
        [[9, 9, 9, 9], 2],
        [[1, 5, 2, 4, 3, 3], 3]
    ];
    
    for (const [nums, ans] of data) {
        console.assert(maxEqualSegments(nums) === ans, `Test failed for input ${nums}`);
        console.assert(maxEqualSegmentsLists(nums) === ans, `Test failed for input ${nums}`);
    }
}

test();

console.log('all tests passed')