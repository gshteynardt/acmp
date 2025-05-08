const assert = (e) => {
    if (!e) {
        throw new Error('assertion failed');
    }
};

class Scanner {
    constructor() {
        this.fs = require('fs');
        this.b = Buffer.alloc(1 << 16);
        this.pos = 0;
        this.size = 0;
        this.EOF = -1;
        this.NONE = -2;
        this.lastCh = this.NONE;
        this.nextInt = this.nextInt.bind(this);
        this.next = this.next.bind(this);
        this.nextLine = this.nextLine.bind(this);
    }

    _nextChar() {
        // returns code of next char and skips it or returns EOF if the stream ended
        if (this.pos === this.size) {
            this.size = this.fs.readSync(0, this.b, 0, this.b.length);
            this.pos = 0;

            if (this.size === 0) {
                return this.EOF;
            }
        }

        assert(this.pos < this.size);

        const ans = this.b[this.pos];
        this.pos++;

        return ans;
    }

    nextInt() {
        const SPACE = ' '.charCodeAt(0);
        const CR = '\r'.charCodeAt(0);
        const LF = '\n'.charCodeAt(0);
        const ZERO = '0'.charCodeAt(0);
        const NINE = '9'.charCodeAt(0);
        const MINUS = '-'.charCodeAt(0);
        let ch = this.lastCh;

        if (ch === this.NONE) {
            ch = this._nextChar();
        }

        while (ch === SPACE || ch === CR || ch === LF) {
            ch = this._nextChar();
        }

        let multiply = 1;

        if (ch === MINUS) {
            ch = this._nextChar();
            multiply = -1;
        }

        assert(ZERO <= ch && ch <= NINE);

        let n = ch - ZERO;
        ch = this._nextChar();

        while (ZERO <= ch && ch <= NINE) {
            const d = ch - ZERO;
            n = n * 10 + d;
            ch = this._nextChar();
        }

        assert(ch === SPACE || ch === CR || ch === LF || ch === this.EOF);

        this.lastCh = ch;

        return n * multiply;
    }

    next() {
        const SPACE = ' '.charCodeAt(0);
        const CR = '\r'.charCodeAt(0);
        const LF = '\n'.charCodeAt(0);
        let ch = this.lastCh;

        if (ch === this.NONE) {
            ch = this._nextChar();
        }

        while (ch === SPACE || ch === CR || ch === LF) {
            ch = this._nextChar();
        }

        assert(ch !== this.EOF);

        let word = String.fromCharCode(ch);
        ch = this._nextChar();

        while (!(ch === SPACE || ch === CR || ch === LF || ch === this.EOF)) {
            word += String.fromCharCode(ch);
            ch = this._nextChar();
        }

        assert(ch === SPACE || ch === CR || ch === LF || ch === this.EOF);

        this.lastCh = ch;

        return word;
    }

    nextLine() {
        const CR = '\r'.charCodeAt(0);
        const LF = '\n'.charCodeAt(0);
        let ch = this.lastCh;

        if (ch === this.NONE) {
            ch = this._nextChar();
        }

        let s = '';

        while (true) {
            if (ch === this.EOF) {
                break;
            }

            if (ch === LF) {
                ch = this.NONE;
                break;
            }

            if (ch === CR) {
                ch = this._nextChar();

                if (ch === LF) {
                    ch = this.NONE;
                }

                break;
            }

            s += String.fromCharCode(ch);
            ch = this._nextChar();
        }

        this.lastCh = ch;

        return s;
    }
}

const input = new Scanner();
const nextInt = input.nextInt;

const sizeR = nextInt();
const sizeC = nextInt();
const K = nextInt();

const cells = Array(K);

for (let i = 0; i < K; i++) {
    const r = nextInt() - 1;
    const c = nextInt() - 1;
    cells[i] = r * sizeC + c;
}

cells.sort((a, b) => a - b);

class RectStart {
    constructor(startC, height) {
        this.startC = startC;
        this.height = height;
    }
}

const heights = Array(1 + sizeC).fill(0);
const stack = Array.from({ length: 1 + sizeC }, () => new RectStart(0, 0));
let stackSize = 0;
let ans = 0;
let cellsI = 0;

for (let r = 0; r < sizeR; r++) {
    for (let c = 0; c < sizeC; c++) {
        heights[c]++;
    }

    for (; cellsI < cells.length && Math.floor(cells[cellsI] / sizeC) === r; cellsI++) {
        const c = cells[cellsI] % sizeC;
        heights[c] = 0;
    }

    for (let c = 0; c <= sizeC; c++) {
        let startC = c;

        while (stackSize > 0 && stack[stackSize - 1].height >= heights[c]) {
            const top = stack[stackSize - 1];
            stackSize--;
            let prevH = heights[c];

            if (stackSize > 0 && stack[stackSize - 1].height > prevH) {
                prevH = stack[stackSize - 1].height;
            }

            const h = top.height - prevH;
            const w = c - top.startC;
            ans += (h * w * (1 + w)) / 2;
            startC = top.startC;
        }

        stack[stackSize].startC = startC;
        stack[stackSize].height = heights[c];
        stackSize++;
    }
}

console.log(ans);
/*
4 3 3
1 2
4 3
3 1
*/
