class FixedCapacityQueue {
    constructor(maxSize) {
        this.q = Array.from({ length: maxSize }, () => null);
        this.after = 0;
        this.first = 0;
        this.size = 0;
    }

    push(value) {
        assert(this.size < this.q.length);
        this.size++;

        this.q[this.after] = value;
        this.after++;

        if (this.after === this.q.length) {
            this.after = 0;
        }
    }

    poll() {
        assert(!this.isEmpty());

        this.size--;

        const value = this.q[this.first];
        this.first++;

        if (this.first === this.q.length) {
            this.first = 0;
        }

        return value;
    }

    isEmpty() {
        return this.size === 0;
    }
}
