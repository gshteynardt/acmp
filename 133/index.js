class VertexDistHeap {
    constructor(nV) {
        this.distHeap = [null];
        this.v = [null];
        this.vToIndex = Array.from({ length: nV }, () => -1);
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
        const dist1 = this.distHeap[index1];
        const dist2 = this.distHeap[index2];
        this.distHeap[index1] = dist2;
        this.distHeap[index2] = dist1;

        const v1 = this.v[index1];
        const v2 = this.v[index2];
        this.v[index1] = v2;
        this.v[index2] = v1;

        this.vToIndex[v2] = index1;
        this.vToIndex[v1] = index2;
    }

    peek() {
        return this.distHeap[1];
    }

    add(dist, vertex) {
        let currentIndex;

        if (this.vToIndex[vertex] === -1) {
            this.distHeap.push(dist);
            this.v.push(vertex);
            this.vToIndex[vertex] = this.v.length - 1;
            currentIndex = this.distHeap.length - 1;
        } else {
            currentIndex = this.vToIndex[vertex];
            this.distHeap[currentIndex] = dist;
        }

        let parentIndex = this.getParentIndex(currentIndex);

        while (
            currentIndex > 1 &&
            this.distHeap[currentIndex] < this.distHeap[parentIndex]
        ) {
            this.swap(currentIndex, parentIndex);
            currentIndex = parentIndex;
            parentIndex = this.getParentIndex(currentIndex);
        }
    }

    poll() {
        this.swap(1, this.distHeap.length - 1);

        const minDist = this.distHeap.pop();
        const minV = this.v.pop();
        this.vToIndex[minV] = -1;

        if (this.distHeap.length > 2) {
            let currentIndex = 1;
            let leftChildIndex = this.getLeftChildIndex(currentIndex);
            let rightChildIndex = this.getRightChildIndex(currentIndex);

            while (true) {
                if (!(leftChildIndex < this.distHeap.length)) {
                    break;
                }

                const smallerChildIndex =
                    !(rightChildIndex < this.distHeap.length) ||
                    this.distHeap[leftChildIndex] <
                        this.distHeap[rightChildIndex]
                        ? leftChildIndex
                        : rightChildIndex;

                if (
                    this.distHeap[currentIndex] <
                    this.distHeap[smallerChildIndex]
                ) {
                    break;
                }

                this.swap(currentIndex, smallerChildIndex);
                currentIndex = smallerChildIndex;
                leftChildIndex = this.getLeftChildIndex(currentIndex);
                rightChildIndex = this.getRightChildIndex(currentIndex);
            }
        }

        return [minDist, minV];
    }

    size() {
        return this.distHeap.length - 1;
    }
}

let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const nV = Number(lines[0].trim());
const costs = lines[1].trim().split(/\s+/).map(Number);
const nE = Number(lines[2].trim());
const adj = Array.from({ length: nV }, () => []);

for (let i = 0; i < nE; i++) {
    let [u, v] = lines[i + 3].trim().split(/\s+/).map(Number);
    u--;
    v--;
    adj[u].push([v, costs[u]]);
    adj[v].push([u, costs[v]]);
}

lines = null;

const INF = costs.reduce((acc, num) => acc + num, 0);
const minDist = Array.from({ length: nV }, () => INF);
minDist[0] = 0;

const pq = new VertexDistHeap(nV);
pq.add(0, 0);

while (pq.size() > 0) {
    const [dist, v] = pq.poll();

    if (v === nV - 1) {
        break;
    }

    for (const [to, d] of adj[v]) {
        const newDist = dist + d;

        if (newDist < minDist[to]) {
            minDist[to] = newDist;
            pq.add(newDist, to);
        }
    }
}

console.log(minDist[nV - 1] === INF ? -1 : minDist[nV - 1]);

/*
4
1 10 2 15
4
1 2
1 3
4 2
4 3
*/
