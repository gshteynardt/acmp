const getUniquePrimesCount1 = (nums) => {
    const start = performance.now();

    const max = Math.max(...nums);
    const minPrime = Array(1 + max).fill(-1);
    let ops = 0;

    for (let p = 2; p * p <= max; p++) { // prime
        if (minPrime[p] === -1) {
            for (let i = p * p; i <= max; i += p) {
                ops++;

                if (minPrime[i] === -1) {
                    minPrime[i] = p;
                }
            }
        }
    }

    for (let p = 2; p <= max; p++) {
        ops++;

        if (minPrime[p] === -1) {
            minPrime[p] = p;
        }
    }

    const dPrimeCount = Array(1 + max).fill(-1); // different prime count
    dPrimeCount[1] = 0;

    for (let i = 2; i <= max; i++) {
        ops++;

        if (minPrime[i] === i) {
            dPrimeCount[i] = 1;
        } else {
            const prev = i / minPrime[i];

            if (minPrime[prev] === minPrime[i]) {
                dPrimeCount[i] = dPrimeCount[prev];
            } else {
                dPrimeCount[i] = dPrimeCount[prev] + 1;
            }
        }
    }

    console.log({ ops });
    const duration = performance.now() - start;
    console.log({ duration });

    return Array.from(nums, (num) => dPrimeCount[num]);
};

const getUniquePrimesCount2 = (nums) => {
    const start = performance.now();

    const max = Math.max(...nums);
    const maxPrime = Array(1 + max).fill(-1);
    let ops = 0;

    for (let p = 2; p * 2 <= max; p++) { // prime
        if (maxPrime[p] === -1) {
            for (let i = p * 2; i <= max; i += p) {
                ops++;

                maxPrime[i] = p;
            }
        }
    }

    for (let p = 2; p <= max; p++) {
        ops++;

        if (maxPrime[p] === -1) {
            maxPrime[p] = p;
        }
    }

    const dPrimeCount = Array(1 + max).fill(-1); // different prime count
    dPrimeCount[1] = 0;

    for (let i = 2; i <= max; i++) {
        ops++;

        if (maxPrime[i] === i) {
            dPrimeCount[i] = 1;
        } else {
            const prev = i / maxPrime[i];

            if (maxPrime[prev] === maxPrime[i]) {
                dPrimeCount[i] = dPrimeCount[prev];
            } else {
                dPrimeCount[i] = dPrimeCount[prev] + 1;
            }
        }
    }

    console.log({ ops });
    const duration = performance.now() - start;
    console.log({ duration });

    return Array.from(nums, (num) => dPrimeCount[num]);
};

const getUniquePrimesCount = (nums) => {
    const start = performance.now();

    const max = Math.max(...nums);
    const upc = Array(1 + max).fill(0); // upc[i] = unique primes count in i
    let ops = 0;

    for (let p = 2; p <= max; p++) { // prime
        if (upc[p] === 0) {
            for (let i = p; i <= max; i += p) {
                ops++;

                upc[i]++;
            }
        }
    }

    console.log({ ops });
    const duration = performance.now() - start;
    console.log({ duration });

    return Array.from(nums, (num) => upc[num]);
};

console.log({ res: getUniquePrimesCount([10_000_000]) });
console.log('------------------------------------------');
console.log({ res: getUniquePrimesCount1([10_000_000]) });
console.log('------------------------------------------');
console.log({ res: getUniquePrimesCount2([10_000_000]) });