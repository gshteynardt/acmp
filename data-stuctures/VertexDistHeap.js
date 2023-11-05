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

    while (currentIndex > 1 && this.distHeap[currentIndex] < this.distHeap[parentIndex]) {
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
