// объекты в данном MinHeap должны иметь поле heapIndex

class MinHeap {
    constructor(compare, values = []) { // compare(x, y) sign 0 <=> x sign y
        this.#setHeapIndex(values);
        this.heap = [null, ...values];
        this.compare = compare;
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
        const obj2 = this.heap[index1];
        const obj1 = this.heap[index2];

        this.heap[index1] = obj1;
        this.heap[index2] = obj2;

        obj1.heapIndex = index1;
        obj2.heapIndex = index2;
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
        value.heapIndex = this.heap.length;
        this.heap.push(value);

        let currentIndex = this.heap.length - 1;
        let parentIndex = this.getParentIndex(currentIndex);

        while (
            currentIndex > 1 &&
            this.compare(this.heap[currentIndex], this.heap[parentIndex]) < 0
        ) {
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

    remove(value) {
        // обновляем heap как будто value минимальный
        while (value.heapIndex > 1) {
            const parentIndex = this.getParentIndex(value.heapIndex);
            this.swap(value.heapIndex, parentIndex);
        }

        return this.poll();
    }

    size() {
        return this.heap.length - 1;
    }
    
    #setHeapIndex(values) {
        for (let i = 1; i < values.length; i++) {
            values[i].heapIndex = i
        }
    }
}
