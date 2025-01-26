class SimpleDeque {
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
        if (this.size() > 0) {
            return this.q.at(-1);
        }

        throw new Error('The deque is empty');
    }

    pollLast() {
        if (this.size() > 0) {
            return this.q.pop();
        }

        throw new Error('The deque is empty');
    }

    addFirst(v) {
        throw new Error('not implemented'); // don't need for sliding window min
    }

    peekFirst() {
        if (this.size() > 0) {
            return this.q[this.first];
        }

        throw new Error('The deque is empty');
    }

    pollFirst() {
        if (this.size() > 0) {
            const v = this.q[this.first];
            this.first++;
            // TODO here can free memory if too many empty cells
            return v;
        }

        throw new Error('The deque is empty');
    }
}
