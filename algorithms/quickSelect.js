const assert = (exp) => {
    if (!exp) {
        throw new Error('assertion failed');
    }
};

const quickSelect = (nums, fixed) => {
    let first = 0;
    let last = nums.length - 1;

    while (first < last) {
        assert(first <= fixed && fixed <= last);
        let left = first;
        let right = last;
        let key = nums[first + Math.floor(Math.random() * (last - first + 1))];

        for (let i = left; i <= right;) {
            // nums[first]...nums[left - 1] < key
            // nums[right + 1]...nums[last] > key
            // nums[left]...nums[i - 1] === key

            if (nums[i] < key) {
                const t = nums[i];
                nums[i] = nums[left];
                nums[left] = t;
                left++;
                i++;
            } else if (nums[i] > key) {
                const t = nums[i];
                nums[i] = nums[right];
                nums[right] = t;
                right--;
            } else {
                i++;
            }
        }

        if (fixed < left) {
            last = left - 1;
        } else if (fixed > right) {
            first = right + 1;
        } else {
            return;
        }
    }

    assert(first === fixed && fixed === last);
};
