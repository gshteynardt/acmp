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

const first = nextInt();
const last = nextInt();

let ans = 1;

while (ans * 4 + 1 <= last - first) {
    ans = ans * 4 + 1;
}

ans += first;

console.log(ans);

/*
1 2 3 4
-   -
  2   4
      -

11 12 13 14 15 16 17 18 19 20
--    --    --    --    --
         --          --
   --                      --

11 12 13 14 15 16 17 18 19 20
 1  0  1  0  1  0  1  0  1  0 младший бит числа - за первый проход удаляются все числа с 1 в младшем бите
--    --    --    --    --
    0     1     0     1     0 второй с конца бит переживших первый раунд вычеркивания чисел
 1  0  0  1  1  0  0  1  1  0 второй с конца бит числа - за второй проход удаляются все числа с 1 в этом бите
         --          --
    1           0           1 третий с конца бит переживших первый и второй раунды вычеркивания чисел
 0  1  1  1  1  0  0  0  0  1 третий с конца бит числа - за третий проход удаляются все числа с 1 в этом бите
   --                      --
                ^ - оставшееся число
                
14 15 16 17 18 19 20 21 22 23
 0  1  0  1  0  1  0  1  0  1 младший бит числа - за первый проход удаляются все числа с 0 в младшем бите
 1  1  0  0  1  1  0  0  1  1 второй с конца бит числа - за второй проход удаляются все числа с 0 в этом бите
 1  1  0  0  0  0  1  1  1  1 третий с конца бит числа - за третий проход удаляются все числа с 1 в этом бите
 1  1  0  0  0  0  0  0  0  0
 0  0  1  1  1  1  1  1  1  1
                ^ - оставшееся число

если чисел 10 то выживает из них всегда 6-е по счету
позиция выжившего числа зависит только от длины последовательности и не зависит от значения первого числа
0 1 2 3 4 5 6 7 8 9 - сами числа
0 1 0 1 0 1 0 1 0 1 - младший бит числа - за первый проход удаляются все числа с 0 в младшем бите
  0   1   0   1   0 - второй с конца бит переживших первый раунд вычеркивания чисел
0 0 1 1 0 0 1 1 0 0 - второй с конца бит числа - за второй проход удаляются все числа с 1 в этом бите
  0       1       0 - третий с конца бит переживших первый и второй раунды вычеркивания чисел 
0 0 0 0 1 1 1 1 0 0 - третий с конца бит числа - за третий проход удаляются все числа с 0 в этом бите

   0    1    2    3    4    5    6    7    8    9   10
0000 0001 0010 0011 0100 0101 0110 0111 1000 1001 1010
---- 0001 ---- 0011 ---- 0101 ---- 0111 ---- 1001 ----
---- 0001 ---- ---- ---- 0101 ---- ---- ---- 1001 ----
---- ---- ---- ---- ---- 0101 ---- ---- ---- ---- ----

у выжившего числа:
в младшем бите 1
во втром с конца бите 0
в третьем с конца бите 1
и тд пока не выйдем из диапазона чисел 0...9

на входе 100 300
сведем задачу к 0...200
строим числа с чередующимися битами:
1b = 1, 101b = 4 + 1 = 5, 10101b = 16 + 5 = 21, 1010101b = 64 + 21 = 85, 101010101b = 256 + 85 - за пределами 200
для 0...200 ответ 85
для 100...300 - ответ 100 + 85 = 185
*/
