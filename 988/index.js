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

const T = nextInt();

const findK = (k, p) => {
    if (p === 0n) {
        throw new Error('p === 0');
    }
    
    const mid = 1n << (p - 1n);

    if (k === mid) {
        return p;
    }
    
    if (k < mid) {
        return findK(k , p - 1n);
    } else {
        return findK(k - mid, p - 1n);
    }
};

for (let i = 0; i < T; i++) {
    const k = BigInt(next());
    let p = BigInt(next());

    if (p > 63n) {
        p = 63n;
    }
    
    if (k > (1n << p) - 1n) {
        console.log('No solution');
    } else {
        console.log(Number(findK(k, p)));
    }
}

/*
4
1 1
2 1
1 2
2 2

S1 = 1 - длина 1
S2 = 1, 2, 1 - длина 3
S3 = 1, 2, 1, 3, 1, 2, 1 - длина 7
S4 = 1, 2, 1, 3, 1, 2, 1, 4, 1, 2, 1, 3, 1, 2, 1 - длина 15

длина Si = (2^i) - 1

если p > 63, то заменяем его на 63, потому что с ростом длины префикс последовательности не меняется, а S63 имеет длину достаточную для любого запрошиваемого k
эта замена для след проверки:
если k > (2^p) - 1, то no solution

сводим задачу к меньшей
k = 10
p = 4
1,  2,  1,   3,   1,   2,   1,    4,    1,    2,    1,    3,    1,    2,    1
1   2   3    4    5    6    7     8     9     10    11    12    13    14    15
1  10  11  100  101  110  111  1000  1001  1010  1011  1100  1101  1110  1111
(S3                         )     4     (S3                                  )
десятое место в S4 такое же как и второе в S3 

1,  2,  1,   3,   1,   2,   1 
1   2   3    4    5    6    7
(S2     )    3    (S2       )
второе место в S3 такое же как и второе в S2

1,  2,  1
1   2   3
S1  2   S1
второе место в S2 находится посередине и равно номеру последовательности 2
*/
