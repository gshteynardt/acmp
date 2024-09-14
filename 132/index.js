function readline() {
    const fs = require("fs");
    let b = Buffer.alloc(64);
    let pos = 0;
    while (true) {
        const len = fs.readSync(0, b, pos, 1);
        if (len == 0) {
            return String(b.subarray(0, pos));
        }
        if (b[pos] == 13) {
            continue;
        }
        if (b[pos] == 10) {
            return String(b.subarray(0, pos));
        }
        pos++;
        if (pos == b.length) {
            const nb = Buffer.alloc(b.length * 2);
            b.copy(nb);
            b = nb;
        }
    }
}

let [n, s, f] = readline().trim().split(/\s+/).map(Number);
s--;
f--;

const INF = n * 100;
const dist = [];

for (let i = 0; i < n; i++) {
    dist.push(
        readline()
            .trim()
            .split(/\s+/)
            .map((s) => (s === "-1" ? INF : Number(s))),
    );
}

/*
алгоритм Дейкстры
на входе взвешенный граф с неотрицательными весами и начальная вершина
на выходе расстояние от начальной вершины до всех вершин графа

сложность варианта с матрицой смежности для плотного графа (ребер порядка квадрата числа вершин)
по времени - O(V**2)
по памяти - O(V) + исходные данные O(V**2)
*/

//minDist[i] - минимальная стоимость пути из s в вершину i с промежуточными финализированными вершинами
const minDist = Array.from({ length: n }, () => INF);
minDist[s] = 0;

//isFinal[i] - для вершины i найдено кратчайшее расстояние из s
const isFinal = Array.from({ length: n }, () => false);

while (true) {
    let bestI = -1;

    for (let i = 0; i < n; i++) {
        if (!isFinal[i]) {
            if (bestI === -1 || minDist[i] < minDist[bestI]) {
                bestI = i;
            }
        }
    }

    if (bestI === -1 || minDist[bestI] === INF) {
        break;
    }

    isFinal[bestI] = true;

    if (bestI === f) {
        break;
    }

    for (let i = 0; i < n; i++) {
        const newDist = minDist[bestI] + dist[bestI][i];

        if (newDist < minDist[i]) {
            minDist[i] = newDist;
        }
    }
}

if (minDist[f] === INF) {
    console.log(-1);
} else {
    console.log(minDist[f]);
}

/*
3 2 1
0 1 1
4 0 1
2 1 0
*/

/*
Сложность двух вариантов алгоритма Дейкстры:

1. для плотных графов (без MinHeap) - O(V^2), V - число вершин, E ~= V^2
2. для разреженных графов (с MinHeap) - O(E logE), E - кол-во ребер

Для графа 10_000 вершин и ребра между каждой парой вершин - 1 способ дает 10^8, второй дает 25 * 10^8
Следовательно, для плотных графов MinHeap вреден

Для графа 1_000_000 вершин и 2_000_000 ребер - первый способ дает ~10^12, второй - 20 * 10^6

Вывод:
Для разреженных графов вариант с MinHeap предпочтительней
*/
