function readline() {
    const fs = require("fs");
    const b = Buffer.alloc(1);
    let s = "";
    while (true) {
        const len = fs.readSync(0, b);
        if (len == 0) {
            return s;
        }
        if (b[0] == 13) {
            continue;
        }
        if (b[0] == 10) {
            return s;
        }
        s += b;
    }
}

let a = readline();
let b = readline();

const bigplus = (a, b) => {
    a = a.split("").reverse().map(Number);
    b = b.split("").reverse().map(Number);

    let result = [];
    let carry = 0;

    for (let i = 0; i < a.length || i < b.length || carry > 0; i++) {
        const sum = (a[i] ?? 0) + (b[i] ?? 0) + carry;
        result.push(sum % 10);
        carry = Math.floor(sum / 10);
    }

    return result.reverse().join("");
};

console.log(bigplus(a, b));
