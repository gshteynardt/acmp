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
const n = nextInt();
const nums = Array(n);
const mx = Array(n << 1);

const bestIndex = (i1, i2) => {
    if (nums[i1] > nums[i2]) {
        return i1;
    }

    if (nums[i1] < nums[i2]) {
        return i2;
    }

    return Math.min(i1, i2);
};

for (let i = 0; i < n; i++) {
    nums[i] = nextInt();
    mx[n + i] = i;
}

for (let i = n - 1; i >= 1; i--) {
    mx[i] = bestIndex(mx[i << 1], mx[(i << 1) | 1]);
}

const nq = nextInt();

for (let q = 0; q < nq; q++) {
    let left = nextInt() - 1;
    let right = nextInt() - 1;

    let res = left;

    left += n;
    right += n;

    while (left <= right) {
        if ((left & 1) === 1) {
            res = bestIndex(res, mx[left]);
            left++;
        }

        if ((right & 1) === 0) {
            res = bestIndex(res, mx[right]);
            right--;
        }

        left >>= 1;
        right >>= 1;
    }

    console.log(nums[res], res + 1);
}

/*
7 1
6 4
1 3

0 1 2 3 4 5 6 7 8 9 10
7|7 6|7 3 6|7 3 1 6 4
*/
