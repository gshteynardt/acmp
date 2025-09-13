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

const input = new Scanner();
const nextInt = input.nextInt;
const nStations = nextInt();
const nPlaces = nextInt();
const nQueries = nextInt();

const remPlaces = Array(nStations - 1).fill(nPlaces);
const groupSize = Math.floor(Math.sqrt(nStations - 1));
const nGroups = Math.ceil((nStations - 1) / groupSize);
const groupMin = Array(nGroups).fill(nPlaces); // groupMin[g] = min(remPlaces[i] - groupSub[(i / groupSize) | 0])
const groupSub = Array(nGroups).fill(0); // i элемент равен remPlaces[i] - groupSub[(i / groupSize) | 0]

const getGroupBorders = (g) => {
    const groupFirst = g * groupSize;
    const afterGroup = Math.min(nStations - 1, (g + 1) * groupSize);
    
    return [groupFirst, afterGroup];
};

const updateMin = (g) => {
    const [groupFirst, afterGroup] = getGroupBorders(g);
    groupMin[g] = remPlaces[groupFirst] - groupSub[g];
    
    for (let i = groupFirst + 1; i < afterGroup; i++) {
        groupMin[g] = Math.min(groupMin[g], remPlaces[i] - groupSub[g]);
    }
};

const canBuyTicket = (left, right) => {
    const gl = (left / groupSize) | 0;
    const gr = (right / groupSize) | 0;
    
    if (gl === gr) {        
        for (let i = left; i <= right; i++) {
            if (remPlaces[i] - groupSub[gl] === 0) {
                return false;
            }
        }
    } else {
        const [, afterLeftGroup] = getGroupBorders(gl);

        for (let i = left; i < afterLeftGroup; i++) {
            if (remPlaces[i] - groupSub[gl] === 0) {
                return false;
            }
        }
        
        for (let g = gl + 1; g <= gr - 1; g++) {
            if (groupMin[g] === 0) {
                return false;
            }
        }
        
        const [rightGroupFirst] = getGroupBorders(gr);

        for (let i = rightGroupFirst; i <= right; i++) {
            if (remPlaces[i] - groupSub[gr] === 0) {
                return false;
            }
        }
    }
    
    return true;
};

const buyTicket = (left, right) => {
    const gl = (left / groupSize) | 0;
    const gr = (right / groupSize) | 0;
    
    if (gl === gr) {        
        for (let i = left; i <= right; i++) {
            remPlaces[i]--;
        }
        
        updateMin(gl);
    } else {
        const [, afterLeftGroup] = getGroupBorders(gl);

        for (let i = left; i < afterLeftGroup; i++) {
            remPlaces[i]--;
        }
        
        updateMin(gl);

        for (let g = gl + 1; g <= gr - 1; g++) {
            groupMin[g]--;
            groupSub[g]++;
        }
        
        const [rightGroupFirst] = getGroupBorders(gr);

        for (let i = rightGroupFirst; i <= right; i++) {
            remPlaces[i]--;
        }
        
        updateMin(gr);
    }
};

for (let q = 0; q < nQueries; q++) {
    const left = nextInt();
    const right = nextInt() - 1;

    if (canBuyTicket(left, right)) {
        buyTicket(left, right);
        console.log('Yes');
    } else {
        console.log('No');
    }
}

/*
0 1 2 3 4 5 6 7
 3 1 4 1 5 9 2 6
  1   1   5   2 - min
    1       2
        1

0 1 2 3 4 5 6 7
 0 0 0 0 0 0 0 0
  0   1   1   0 - sub
    0       0
        0

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
