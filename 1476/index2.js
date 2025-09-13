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
const next = input.next;

const nQ = nextInt();
const bits = Array(100_020).fill(0);

const ALL_0 = 0;
const ALL_1 = 1;
const MIXED = -1;

const groupSize = Math.floor(Math.sqrt(bits.length));
const nGroups = Math.ceil(bits.length / groupSize);
const groupState = Array(nGroups).fill(ALL_0);

const getFirstAfter = (g) => {
    const first = g * groupSize;
    const after = Math.min(bits.length, (g + 1) * groupSize);

    return [first, after];
};

const fillBits = (g) => {
    if (groupState[g] === MIXED) {
        return;
    }

    let val = groupState[g] === ALL_0 ? 0 : 1;

    const [gFirst, afterG] = getFirstAfter(g);

    bits.fill(val, gFirst, afterG);
};

const updateState = (g) => {
    const [gFirst, afterG] = getFirstAfter(g);
    let has0 = false;
    let has1 = false;

    for (let i = gFirst; i < afterG; i++) {
        if (bits[i] === 0) {
            has0 = true;
        } else if (bits[i] === 1) {
            has1 = true;
        } else {
            throw new Error('invalid bit');
        }
    }

    if (has0 && has1) {
        groupState[g] = MIXED;
    } else if (has0) {
        groupState[g] = ALL_0;
    } else if (has1) {
        groupState[g] = ALL_1;
    } else {
        throw new Error('empty group');
    }
};

let count1 = 0;

for (let _q = 0; _q < nQ; _q++) {
    const cmd = next();
    const s = nextInt();

    if (cmd === 'add') {
        const search = 0;
        const replace = 1;

        let g = Math.floor(s / groupSize);
        fillBits(g);

        const [, afterG] = getFirstAfter(g);

        let done = false;

        for (let i = s; i < afterG; i++) {
            if (bits[i] === search) {
                bits[i] = replace;
                count1 += -search + replace;
                done = true;
                break;
            } else {
                bits[i] = search;
                count1 -= -search + replace;
            }
        }

        updateState(g);

        if (!done) {
            for (g++; ; g++) {
                if (groupState[g] === search) {
                    groupState[g] = replace;
                    count1 += groupSize * (-search + replace);
                } else {
                    fillBits(g);

                    const [firstG, afterG] = getFirstAfter(g);

                    for (let i = firstG; i < afterG; i++) {
                        if (bits[i] === search) {
                            bits[i] = replace;
                            count1 += -search + replace;
                            done = true;
                            break;
                        } else {
                            bits[i] = search;
                            count1 -= -search + replace;
                        }
                    }

                    assert(done);
                    updateState(g);
                    break;
                }
            }
        }
    } else if (cmd === 'sub') {
        const search = 1;
        const replace = 0;

        let g = Math.floor(s / groupSize);
        fillBits(g);

        const [, afterG] = getFirstAfter(g);

        let done = false;

        for (let i = s; i < afterG; i++) {
            if (bits[i] === search) {
                bits[i] = replace;
                count1 += -search + replace;
                done = true;
                break;
            } else {
                bits[i] = search;
                count1 -= -search + replace;
            }
        }

        updateState(g);

        if (!done) {
            for (g++; ; g++) {
                if (groupState[g] === search) {
                    groupState[g] = replace;
                    count1 += groupSize * (-search + replace);
                } else {
                    fillBits(g);

                    const [firstG, afterG] = getFirstAfter(g);

                    for (let i = firstG; i < afterG; i++) {
                        if (bits[i] === search) {
                            bits[i] = replace;
                            count1 += -search + replace;
                            done = true;
                            break;
                        } else {
                            bits[i] = search;
                            count1 -= -search + replace;
                        }
                    }

                    assert(done);
                    updateState(g);
                    break;
                }
            }
        }
    } else {
        throw new Error('unexpected cmd');
    }

    console.log(count1);
}

/*
4
add 2
add 8
sub 3
sub 0

s = 3
000000
001000
001000
010000
001000
011000
001000
100000
длина числа N * 2^S = S + Math.floor(log2(N)) + 1
N = 1, log2(N) = 0, len = 1
N = 2, log2(N) = 1, len = 2
N = 3, log2(N) = 1.58, len = 2
N = 4, log2(N) = 2, len = 3
*/
