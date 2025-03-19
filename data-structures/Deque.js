class Deque {
    constructor() {
        this.q = [];
        this.first = 0;
    }

    size() {
        return this.q.length - this.first;
    }

    addLast(v) {
        this.q.push(v);
    }

    peekLast() {
        if (this.size() === 0) {
            throw new Error('The deque is empty');
        }

        return this.q.at(-1);
    }

    pollLast() {
        if (this.size() === 0) {
            throw new Error('The deque is empty');
        }

        return this.q.pop();
    }

    addFirst(v) {
        if (this.first === 0) {
            const extraLen = Math.max(32, this.size());
            this.q = Array(extraLen).fill(null).concat(this.q);
            this.first = extraLen;
        }

        this.first--;
        this.q[this.first] = v;
    }

    peekFirst() {
        if (this.size() === 0) {
            throw new Error('The deque is empty');
        }

        return this.q[this.first];
    }

    pollFirst() {
        if (this.size() === 0) {
            throw new Error('The deque is empty');
        }

        const v = this.q[this.first];
        this.q[this.first] = null;
        this.first++;

        if (this.q.length >= 64 && this.size() <= this.q.length >> 2) {
            const toDelete = this.q.length >> 1;
            this.q = this.q.slice(toDelete);
            this.first -= toDelete;
        }

        return v;
    }
}
