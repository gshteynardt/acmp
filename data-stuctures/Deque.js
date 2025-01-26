class DequeFull {
    static MIN_SIZE = 16;

    constructor() {
        this.q = Array(DequeFull.MIN_SIZE).fill(null);
        this.first = DequeFull.MIN_SIZE >> 1;
        this.after = DequeFull.MIN_SIZE >> 1;
    }

    size() {
        return this.after - this.first;
    }

    addLast(v) {
        if (this.after === this.q.length) {
            if (this.size() * 2 <= this.q.length) {
                const newFirst = (this.q.length - this.size()) >> 1;
                const newAfter = newFirst + this.size();

                for (let i = 0; this.first + i < this.after; i++) {
                    this.q[newFirst + i] = this.q[this.first + i];
                }

                for (let i = newAfter; i < this.q.length; i++) {
                    this.q[i] = null;
                }

                this.first = newFirst;
                this.after = newAfter;
            } else {
                this.#resize(this.q.length * 2);
            }
        }

        this.q[this.after] = v;
        this.after++;
    }

    peekLast() {
        if (this.size() > 0) {
            return this.q[this.after - 1];
        }

        throw new Error('The deque is empty');
    }

    pollLast() {
        if (this.size() > 0) {
            this.after--;
            const ans = this.q[this.after];
            this.q[this.after] = null;

            if (this.size() * 8 <= this.q.length && this.q.length > DequeFull.MIN_SIZE) {
                this.#resize(this.q.length >> 1);
            }

            return ans;
        }

        throw new Error('The deque is empty');
    }

    addFirst(v) {
        if (this.first === 0) {
            if (this.size() * 2 <= this.q.length) {
                const newFirst = (this.q.length - this.size()) >> 1;
                const newAfter = newFirst + this.size();

                for (let i = this.size() - 1; i >= 0; i--) {
                    this.q[newFirst + i] = this.q[this.first + i];
                }

                for (let i = 0; i < newFirst; i++) {
                    this.q[i] = null;
                }

                this.first = newFirst;
                this.after = newAfter;
            } else {
                this.#resize(this.q.length * 2);
            }
        }

        this.first--;
        this.q[this.first] = v;
    }

    peekFirst() {
        if (this.size() > 0) {
            return this.q[this.first];
        }

        throw new Error('The deque is empty');
    }

    pollFirst() {
        if (this.size() > 0) {
            const ans = this.q[this.first];
            this.q[this.first] = null;
            this.first++;

            if (this.size() * 8 <= this.q.length && this.q.length > DequeFull.MIN_SIZE) {
                this.#resize(this.q.length >> 1);
            }

            return ans;
        }

        throw new Error('The deque is empty');
    }

    get(index) {
        if (0 <= index && index < this.size()) {
            return this.q[this.first + index];
        }

        throw new Error('inccorect index');
    }

    #resize(newSize) {
        const newQ = Array(newSize).fill(null);
        const newFirst = (newQ.length - this.size()) >> 1;
        const newAfter = newFirst + this.size();

        for (let i = 0; this.first + i < this.after; i++) {
            newQ[newFirst + i] = this.q[this.first + i];
        }

        this.q = newQ;
        this.first = newFirst;
        this.after = newAfter;
    }
}
