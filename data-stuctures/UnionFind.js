class UnionFind {
  constructor(size) {
    //parent[i] >= 0 - родитель вершины i
    //parent[i] < 0 - если родителя нет, то это минус кол-во вершин в компоненте с корнем в этой вершине        
    this.parent = Array.from({ length: size }, () => -1);
  }

  getRoot(v) {
    const v0 = v;

    while (this.parent[v] >= 0) {
      v = this.parent[v];
    }

    const root = v;
    v = v0;

    while (v !== root) {
      const pV = this.parent[v];
      this.parent[v] = root;
      v = pV;
    }

    return root;
  }

  union(u, v) {
    u = this.getRoot(u);
    v = this.getRoot(v);

    if (u === v) {
      return false;
    }

    if (this.parent[u] < this.parent[v]) {
      this.parent[u] += this.parent[v];
      this.parent[v] = u;
    } else {
      this.parent[v] += this.parent[u];
      this.parent[u] = v;
    }

    return true;
  }
}
