//Java: add, peek, poll, size

class MinHeap {
    constructor(compare) { // compare(x, y) sign 0 <=> x sign y  
        this.heap = [null];
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
        const t = this.heap[index1];
        this.heap[index1] = this.heap[index2];
        this.heap[index2] = t;
    }

    peek() {
        if (this.heap.length === 1) {
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
        if (this.heap.length === 1) {
            throw Error('Heap is empty');
        }

        const min = this.heap[1];
        const last = this.heap.pop();

        if (this.heap.length > 1) {
            this.heap[1] = last;
            let currentIndex = 1;
            let leftChildIndex = this.getLeftChildIndex(currentIndex);
            let rightChildIndex = this.getRightChildIndex(currentIndex);

            while (true) {
                console.assert(leftChildIndex < rightChildIndex);

                if (!(leftChildIndex < this.heap.length)) {
                    break;
                }

                const smallerChildIndex = !(rightChildIndex < this.heap.length) ||
                    this.compare(this.heap[leftChildIndex], this.heap[rightChildIndex]) < 0
                    ? leftChildIndex : rightChildIndex;

                if (this.compare(this.heap[currentIndex], this.heap[smallerChildIndex]) < 0) {
                    break;
                }

                this.swap(currentIndex, smallerChildIndex);
                currentIndex = smallerChildIndex;
                leftChildIndex = this.getLeftChildIndex(currentIndex);
                rightChildIndex = this.getRightChildIndex(currentIndex);
            }
        }

        return min;
    }

    size() {
        return this.heap.length - 1;
    }
}

let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const [nv, ne, s] = lines[0].trim().split(/\s+/).map(Number);
const adj = Array.from({ length: nv }, () => []);

for (let i = 0; i < ne; i++) {
    const [v1, v2, dist] = lines[i + 1].trim().split(/\s+/).map(Number);
    adj[v1].push([v2, dist]);
    adj[v2].push([v1, dist]);
}

lines = null;

const INF = 2_009_000_999;
const minDist = Array.from({ length: nv }, () => INF);
minDist[s] = 0;

const pq = new MinHeap((a, b) => a[0] - b[0]);
pq.add([0, s]);

while (pq.size() > 0) {
    const [dist, v] = pq.poll();
    console.assert(dist >= minDist[v]);

    if (dist > minDist[v]) {
        continue;
    }

    for (const [to, d] of adj[v]) {
        const newDist = dist + d;

        if (newDist < minDist[to]) {
            minDist[to] = newDist;
            pq.add([newDist, to]);
        }
    }
}

console.log(minDist.join(' '));

/*
5 7 1
1 2 5
1 3 2
2 3 4
2 4 3
3 4 6
0 3 20
0 4 10
*/