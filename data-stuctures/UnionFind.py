class UnionFind:
    def __init__(self, size: int):
        # parent[i] >= 0 - родитель вершины i
        # parent[i] < 0 - если родителя нет, то это минус кол-во вершин в компоненте с корнем в этой вершине
        self.parent = [-1] * size

    def getRoot(self, v):
        r = v

        while self.parent[r] >= 0:
            r = self.parent[r]

        while v != r:
            pV = self.parent[v]
            self.parent[v] = r
            v = pV

        return r

    def union(self, u, v):
        u = self.getRoot(u)
        v = self.getRoot(v)

        if u == v:
            return False

        if self.parent[u] < self.parent[v]:
            self.parent[u] += self.parent[v]
            self.parent[v] = u
        else:
            self.parent[v] += self.parent[u]
            self.parent[u] = v

        return True
