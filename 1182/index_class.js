const assert = (e) => {
    if (!e) {
        throw new Error("assertion failed");
    }
};

class Scanner {
    constructor() {
        this.fs = require("fs");
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
        const SPACE = " ".charCodeAt(0);
        const CR = "\r".charCodeAt(0);
        const LF = "\n".charCodeAt(0);
        const ZERO = "0".charCodeAt(0);
        const NINE = "9".charCodeAt(0);
        const MINUS = "-".charCodeAt(0);
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
        const SPACE = " ".charCodeAt(0);
        const CR = "\r".charCodeAt(0);
        const LF = "\n".charCodeAt(0);
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
        const CR = "\r".charCodeAt(0);
        const LF = "\n".charCodeAt(0);
        let ch = this.lastCh;

        if (ch === this.NONE) {
            ch = this._nextChar();
        }

        let s = "";

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

class SqrtAddMinArray {
    constructor(a) {
        this.a = a;
        this.groupSize = Math.floor(Math.sqrt(this.a.length));
        const nGroups = Math.ceil(this.a.length / this.groupSize);
        this.groupMin = Array(nGroups).fill(Math.max(...this.a)); // groupMin[g] = min(get(i))
        this.groupAdd = Array(nGroups).fill(0); // get(i) = a[i] + groupAdd[(i / groupSize) | 0]

        for (let i = 0; i < this.a.length; i++) {
            const g = this.getGroup(i);
            this.groupMin[g] = Math.min(this.groupMin[g], this.a[i]);
        }
    }
    
    getGroup(i) {
        return (i / this.groupSize) | 0;
    }

    getGroupBorders(g) {
        const groupFirst = g * this.groupSize;
        const afterGroup = Math.min(this.a.length, (g + 1) * this.groupSize);
        
        return [groupFirst, afterGroup];
    }

    updateMin(g) {
        const [groupFirst, afterGroup] = this.getGroupBorders(g);
        let min = this.get(groupFirst);

        for (let i = groupFirst + 1; i < afterGroup; i++) {
            min = Math.min(min, this.get(i));
        }
        
        this.groupMin[g] = min;
    }

    get(i) {
        return this.a[i] + this.groupAdd[this.getGroup(i)];
    }

    add(left, right, toAdd) { // 0 <= left <= right < a.length
        const gl = this.getGroup(left);
        const gr = this.getGroup(right);

        if (gl === gr) {        
            for (let i = left; i <= right; i++) {
                this.a[i] += toAdd;
            }
            
            this.updateMin(gl);
        } else {
            const [, afterLeftGroup] = this.getGroupBorders(gl);
    
            for (let i = left; i < afterLeftGroup; i++) {
                this.a[i] += toAdd;
            }
            
            this.updateMin(gl);
    
            for (let g = gl + 1; g <= gr - 1; g++) {
                this.groupMin[g] += toAdd;
                this.groupAdd[g] += toAdd;
            }
            
            const [rightGroupFirst] = this.getGroupBorders(gr);
    
            for (let i = rightGroupFirst; i <= right; i++) {
                this.a[i] += toAdd;
            }
            
            this.updateMin(gr);
        }
    }
    
    min(left, right) { // 0 <= left <= right < a.length
        const gl = this.getGroup(left);
        const gr = this.getGroup(right);
        let min = this.get(left);

        if (gl === gr) {        
            for (let i = left; i <= right; i++) {
                min = Math.min(min, this.get(i));
            }
        } else {
            const [, afterLeftGroup] = this.getGroupBorders(gl);
    
            for (let i = left; i < afterLeftGroup; i++) {
                min = Math.min(min, this.get(i));
            }
            
            for (let g = gl + 1; g <= gr - 1; g++) {
                min = Math.min(min, this.groupMin[g]);
            }

            const [rightGroupFirst] = this.getGroupBorders(gr);
    
            for (let i = rightGroupFirst; i <= right; i++) {
                min = Math.min(min, this.get(i));
            }
        }
        
        return min;
    }
}

const input = new Scanner();
const nextInt = input.nextInt;
const nStations = nextInt();
const nPlaces = nextInt();
const mQueries = nextInt();

const a = new SqrtAddMinArray(Array(nStations - 1).fill(nPlaces));

for (let q = 0; q < mQueries; q++) {
    const left = nextInt();
    const right = nextInt() - 1;

    if (a.min(left, right) > 0) {
        a.add(left, right, -1);
        console.log('Yes');
    } else {
        console.log('No');
    }
}

/*
0 1 2 3 4 - станции
 2 2 2 2  - доступно билетов

запрос 0 4

0 1 2 3 4 - станции
 1 1 1 1  - доступно билетов

запрос 1 2

0 1 2 3 4 - станции
 1 0 1 1  - доступно билетов
 
запрос 1 4

0 1 2 3 4 - станции
 1 0 1 1  - доступно билетов
 
запрос 2 4

0 1 2 3 4 - станции
 1 0 0 0  - доступно билетов
*/

/*
5 2 4
0 4
1 2
1 4
2 4
*/
