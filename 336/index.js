function readline() {
    const fs = require('fs');
    const b = Buffer.alloc(1);
    let s = '';
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

const n = readline();

let min = 0;
let max = 0;
let t = 0;

for (const f of n) {
    if (f === '1') {
        t--;
    } else {
        t++;
    }

    max = Math.max(max, t);
    min = Math.min(min, t);
}

console.log(max - min + 1);

/*
1221221221221
*/
