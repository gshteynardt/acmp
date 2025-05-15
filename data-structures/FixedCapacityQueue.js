const assert = (e) => {
    if (!e) {
        throw new Error('assertion failed');
    }
};

class FixedCapacityQueue {
    constructor(maxSize) {
        assert(maxSize > 0);

        this.q = Array.from({ length: maxSize }, () => null);
        this.last = maxSize - 1;
        this.first = 0;
        this._size = 0;
    }

    peekFirst() {
        assert(this._size > 0);

        return this.q[this.first];
    }

    peekLast() {
        assert(this._size > 0);
        return this.q[this.last];
    }

    addLast(value) {
        assert(this._size < this.q.length);
        this._size++;

        this.last++;

        if (this.last === this.q.length) {
            this.last = 0;
        }

        this.q[this.last] = value;
    }

    pollFirst() {
        assert(!this.isEmpty());

        this._size--;

        const value = this.q[this.first];
        this.first++;

        if (this.first === this.q.length) {
            this.first = 0;
        }

        return value;
    }

    isEmpty() {
        return this._size === 0;
    }

    size() {
        return this._size;
    }
}
