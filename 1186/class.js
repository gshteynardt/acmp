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

class SegmentTree {
    constructor(nums) {
        const n = nums.length;
        this.sums = Array(n << 1);

        for (let i = 0; i < n; i++) {
            this.sums[n + i] = nums[i];
        }

        for (let i = n - 1; i >= 1; i--) {
            this.sums[i] = this.sums[i << 1] + this.sums[(i << 1) | 1];
        }
    }

    sum(left, right) {
        // [left, right] - 0 индексация, обе границы включительно
        const n = this.sums.length >> 1;
        assert(0 <= left && left <= right && right < n);

        left += n;
        right += n;

        let ans = 0;

        while (left <= right) {
            if ((left & 1) === 1) {
                ans += this.sums[left];
                left++;
            }

            if ((right & 1) === 0) {
                ans += this.sums[right];
                right--;
            }

            left >>= 1;
            right >>= 1;
        }

        return ans;
    }

    update(i, value) {
        // 0 индексация
        const n = this.sums.length >> 1;
        assert(0 <= i && i < n);

        i += n;
        this.sums[i] = value;

        while (i > 1) {
            i >>= 1;
            this.sums[i] = this.sums[i << 1] + this.sums[(i << 1) | 1];
        }
    }
}

const input = new Scanner();
const nextInt = input.nextInt;
const next = input.next;
const n = nextInt();
const nums = Array(n);

for (let i = 0; i < n; i++) {
    nums[i] = nextInt();
}

const st = new SegmentTree(nums);

const nq = nextInt();
const res = [];

for (let q = 0; q < nq; q++) {
    const type = next();

    if (type === 's') {
        const left = nextInt() - 1;
        const right = nextInt() - 1;

        res.push(st.sum(left, right));
    } else {
        assert(type === 'u');
        const i = nextInt() - 1;
        const value = nextInt();

        st.update(i, value);
    }
}

console.log(res.join(' '));

/*
2579 2359 2572 2840 1601
*/
