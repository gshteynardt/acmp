const binPow = (num, pow, mod) => {
    if (pow === 0n) {
        return 1n;
    }

    if (pow % 2n === 1n) {
        return (binPow(num, pow - 1n, mod) * num) % mod;
    }

    return binPow((num * num) % mod, pow / 2n, mod);
};

const binPowLoop = (num, pow, mod) => {
    let result = 1n;

    while (pow > 0n) {
        if (pow % 2n === 1n) {
            result = (result * num) % mod;
        }

        num = (num * num) % mod;
        pow = pow / 2n;
    }

    return result;
};
