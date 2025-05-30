class MinHeap {
    constructor(compare) { // compare(x, y) sign 0 <=> x sign y  
        this.heap = [null];
        this.compare = compare;

        for (let i = this.heap.length >> 1; i >= 1; i--) {
            this.updateSubtree(i);
        }
    }

    getLeftChildIndex(index) {
        return index << 1;
    }

    getRightChildIndex(index) {
        return (index << 1) + 1;
    }

    getParentIndex(index) {
        return index >> 1;
    }

    swap(index1, index2) {
        const t = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = t;
    }

    updateSubtree(currentIndex) {
        let leftChildIndex = this.getLeftChildIndex(currentIndex);
        let rightChildIndex = this.getRightChildIndex(currentIndex);

        while (true) {
            console.assert(leftChildIndex < rightChildIndex);

            if (!(leftChildIndex < this.heap.length)) {
                break;
            }

            const smallerChildIndex = !(rightChildIndex < this.heap.length) || 
                this.compare(this.heap[leftChildIndex], this.heap[rightChildIndex]) < 0 ? 
                leftChildIndex : rightChildIndex;

            if (this.compare(this.heap[currentIndex], this.heap[smallerChildIndex]) < 0) {
                break;
            }

            this.swap(currentIndex, smallerChildIndex);
            currentIndex = smallerChildIndex;
            leftChildIndex = this.getLeftChildIndex(currentIndex);
            rightChildIndex = this.getRightChildIndex(currentIndex);
        }
    }

    peek() {
        if (this.size() === 0) {
            throw Error('Heap is empty');
        }

        return this.heap[1];
    }

    add(value) {
        this.heap.push(value);

        let currentIndex = this.heap.length - 1;
        let parentIndex = this.getParentIndex(currentIndex);

        while (currentIndex > 1 && this.compare(this.heap[currentIndex], this.heap[parentIndex]) < 0) {
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
            parentIndex = this.getParentIndex(currentIndex);
        }
    }

    poll() {
        if (this.size() === 0) {
            throw Error('Heap is empty');
        }

        const min = this.heap[1];
        const last = this.heap.pop();

        if (this.heap.length > 1) {
            this.heap[1] = last;
            this.updateSubtree(1);
        }

        return min;
    }

    size() {
        return this.heap.length - 1;
    }
}
