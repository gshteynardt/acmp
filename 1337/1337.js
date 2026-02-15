const { nextInt, nextLine } = require("../utils/Scanner");

const assert = (e) => {
    if (!e) {
        throw new Error("assertion failed");
    }
};

class Counter {
    constructor(dict = new Map()) {
        assert(dict instanceof Map)
        this.counter = new Map(dict);
    }

    get(key) {
        return this.counter.get(key) ?? 0;
    }

    mul(num) {
        const result = new Map();

        for (const [key, value] of this.counter) {
            result.set(key, value * num);
        }

        return new Counter(result);
    }

    add(other) {
        const result = new Map();

        for (const [key, value] of this.counter) {
            result.set(key, value);
        }

        for (const [key, value] of other.counter) {
            result.set(key, (result.get(key) ?? 0) + value);
        }

        return new Counter(result);
    }

    equals(other) {
        const keys = this.counter.keys().toArray();

        if (keys.length !== other.counter.keys().toArray) {
            return false;
        }

        for (const key of keys) {
            if (this.get(key) !== other.get(key)) {
                return false;
            }
        }

        return true;
    }
}

/*
<формула> ::= <число> <последовательность> {"+" <число> <последовательность>}
<последовательность> ::= <часть> <число> {<часть> <число>}
<часть> ::= <химический элемент> | "(" <последовательность> ")"
<химический элемент> ::= <прописная буква> [<строчная буква>]
<прописная буква> ::= "A".."Z"
<строчная буква> ::= "a".."z"
<число> ::= ["1".."9" {"0".."9"}]
*/

const readFormula = () => {
    const s = nextLine();
    let pos = 0;
    let ch = "";
    const EOS = "\n"; // end of string

    const nextChar = () => {
        if (pos < s.length) {
            ch = s[pos];
            pos++;
        } else {
            ch = EOS;
        }
    };

    // <число> ::= ["1".."9" {"0".."9"}]
    const number = () => {
        if (ch.length === 1 && "1" <= ch && ch <= "9") {
            let num = Number(ch);
            nextChar();

            while ("0" <= ch && ch <= "9") {
                num = num * 10 + Number(ch);
                assert(num <= 10_000);
                nextChar();
            }

            return num;
        } else {
            return 1;
        }
    };

    // <химический элемент> ::= <прописная буква> [<строчная буква>]
    // <прописная буква> ::= "A".."Z"
    // <строчная буква> ::= "a".."z"
    const chemElem = () => {
        assert(ch.length === 1 && "A" <= ch && ch <= "Z");

        let elem = ch;
        nextChar();

        if ("a" <= ch && ch <= "z") {
            elem += ch;
            nextChar();
        }

        return elem;
    };

    // <часть> ::= <химический элемент> | "(" <последовательность> ")"
    const part = () => {
        if (ch === "(") {
            nextChar();
            const cnt = seq();

            assert(ch === ")");
            nextChar();

            return cnt;
        } else {
            const elem = chemElem();

            return new Counter(new Map([[elem, 1]]));
        }
    };

    // <последовательность> ::= <часть> <число> {<часть> <число>}
    const seq = () => {
        let cnt = part();
        const num = number();
        cnt = cnt.mul(num);

        while (ch === "(" || ("A" <= ch && ch <= "Z")) {
            let cnt2 = part();
            const num2 = number();
            cnt2 = cnt2.mul(num2);

            cnt = cnt.add(cnt2);
        }

        return cnt;
    };

    // <формула> ::= <число> <последовательность> {"+" <число> <последовательность>}
    const formula = () => {
        const num = number();
        let s = seq();
        s = s.mul(num);

        while (ch === "+") {
            nextChar();
            const num1 = number();
            let s1 = seq();
            s1 = s1.mul(num1);

            s = s.add(s1);
        }

        return s;
    };

    nextChar();
    const cnt = formula();
    assert(ch === EOS);

    return { s, cnt };
};

const { s: leftS, cnt: leftCnt } = readFormula();
const n = nextInt();
nextLine();

for (let i = 0; i < n; i++) {
    const { s: rightS, cnt: rightCnt } = readFormula();
    const equal = leftCnt.equals(rightCnt);

    console.log(`${leftS}${equal ? '==' : '!='}${rightS}`);
}
