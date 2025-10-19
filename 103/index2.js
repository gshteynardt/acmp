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

let a = BigInt(readline());
let b = BigInt(readline());

console.log(String(a + b));
