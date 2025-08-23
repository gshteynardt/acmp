const assert = (e) => {
    if (!e) {
        throw new Error('assertion failed');
    }
};

/*
    множество чисел с возможностью повторения
    множество - порядок не важен
    ключевая поддерживаемая операция - найти ближайший больший/меньший или равный
    
    например, если множество { 1, 5, 7 } - то ближайший больший или равный для числа 2 - это 5
    а ближайший больший или равный для 1 - это 1
    
    кол-во действий для операций добавления/удаления/поиска большего или меньшего - sqrt(maxN)
*/

class SqrtSortedSet { // with duplicates
    constructor() {
        this.groups = [];
        this.maxGroupSize = 512;
        this.debug = false;
    }

    checkInvariant() {
        if (!this.debug) {
            return;
        }

        for (const group of this.groups) {
            assert(1 <= group.length && group.length <= this.maxGroupSize);

            for (let i = 1; i < group.length; i++) {
                assert(group[i - 1] <= group[i]);
            }
        }

        for (let i = 1; i < this.groups.length; i++) {
            assert(this.groups[i - 1].at(-1) <= this.groups[i][0]);
        }
    }

    getGroupIndex(v) {
        let g = 0;

        while (g + 1 < this.groups.length && v >= this.groups[g + 1][0]) {
            g++;
        }

        return g;
    }

    getValueIndex(v, group) {
        let i = 0;

        while (i < group.length && v > group[i]) {
            i++;
        }

        return i;
    }

    add(v) {
        const g = this.getGroupIndex(v);

        if (g === 0 && this.groups.length === 0) {
            this.groups.push([]);
        }

        const group = this.groups[g];
        const i = this.getValueIndex(v, group);

        group.splice(i, 0, v);

        if (group.length > this.maxGroupSize) {
            const group1 = group.slice(0, this.maxGroupSize >> 1);
            const group2 = group.slice(this.maxGroupSize >> 1);

            this.groups.splice(g, 1, group1, group2);
        }

        this.checkInvariant();
    }

    remove(v) {
        const g = this.getGroupIndex(v);

        const group = this.groups[g];
        const i = this.getValueIndex(v, group);

        assert(group[i] === v);

        group.splice(i, 1);

        if (group.length === 0) {
            this.groups.splice(g, 1);
        }

        this.checkInvariant();
    }

    findGE(v) { // greater than v or equal, else INF
        let g = 0;

        while (g < this.groups.length && v > this.groups[g].at(-1)) {
            g++;
        }

        if (g === this.groups.length) {
            return Infinity;
        }

        const group = this.groups[g];
        let i = 0;

        while (i < group.length && v > group[i]) {
            i++;
        }

        assert(i < group.length);
        return group[i];
    }

    findLE(v) { // less than v or equal, else -INF
        let g = this.groups.length - 1;

        while (g >= 0 && v < this.groups[g][0]) {
            g--;
        }

        if (g === -1) {
            return -Infinity;
        }

        const group = this.groups[g];
        let i = group.length - 1;

        while (i >= 0 && v < group[i]) {
            i--;
        }

        assert(i >= 0);
        return group[i];
    }
}
