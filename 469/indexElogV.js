const assert = (e) => {
  if (!e) {
    throw new Error('assertion failed');
  }
};

class VertexDistHeap {
  constructor(nV) { // number of vertices
    this.distHeap = [null];
    this.v = [null]; // v[index as in distHeap] -> vertex number
    this.vToIndex = Array.from({ length: nV }, () => -1); // vToIndex[vertex number] -> index in distHeap
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
    assert(this.distHeap.length > 1);
    return this.distHeap[1];
  }

  add(dist, vertex) {
    assert(0 <= vertex && vertex < this.vToIndex.length);
    let currentIndex;

    if (this.vToIndex[vertex] === -1) {
      this.distHeap.push(dist);
      this.v.push(vertex);
      this.vToIndex[vertex] = this.v.length - 1;
      currentIndex = this.distHeap.length - 1;
    } else {
      currentIndex = this.vToIndex[vertex];
      const oldDist = this.distHeap[currentIndex];
      assert(dist < oldDist);

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
    assert(this.distHeap.length > 1);

    this.swap(1, this.distHeap.length - 1);

    const minDist = this.distHeap.pop();
    const minV = this.v.pop();
    this.vToIndex[minV] = -1;

    if (this.distHeap.length > 2) {
      let currentIndex = 1;
      let leftChildIndex = this.getLeftChildIndex(currentIndex);
      let rightChildIndex = this.getRightChildIndex(currentIndex);

      while (true) {
        assert(leftChildIndex < rightChildIndex);

        if (!(leftChildIndex < this.distHeap.length)) {
          break;
        }

        const smallerChildIndex = !(rightChildIndex < this.distHeap.length) ||
          this.distHeap[leftChildIndex] < this.distHeap[rightChildIndex]
          ? leftChildIndex : rightChildIndex;

        if (this.distHeap[currentIndex] < this.distHeap[smallerChildIndex]) {
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
const [sizeR, sizeC] = lines[0].trim().split(/\s+/).map(Number);
const cost = Array.from({ length: sizeR }, () => null);

for (let r = 0; r < sizeR; r++) {
  cost[r] = lines[r + 1].trim().split(/\s+/).map(Number);
}

const getKey = (r, c) => r * sizeC + c;

const unpackKey = (key) => {
  const c = key % sizeC;
  const r = (key - c) / sizeC;

  return [r, c];
};

const INF = 100 * (sizeR + sizeC - 1) + 1;
const minCost = Array.from({ length: sizeR }, () => Array.from({ length: sizeC }, () => INF));
minCost[0][0] = cost[0][0];

const pq = new VertexDistHeap(sizeR * sizeC);
pq.add(cost[0][0], getKey(0, 0));

while (pq.size() > 0) {
  const [dist, v] = pq.poll();
  const [minR, minC] = unpackKey(v);

  if (minR === sizeR - 1 && minC === sizeC - 1) {
    break;
  }

  for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const nr = minR + dr;
    const nc = minC + dc;

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC) {
      const newCost = dist + cost[nr][nc];

      if (newCost < minCost[nr][nc]) {
        minCost[nr][nc] = newCost;
        pq.add(newCost, getKey(nr, nc));
      }
    }
  }
}

console.log(minCost[sizeR - 1][sizeC - 1]);

/*
3 5
2 100 0 100 100
1 100 0   0   0
1   0 3 100   2
*/
