function readline() {
  const fs = require('fs');
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

const nV = Number(readline());
const dist = [];

for (let i = 0; i < nV; i++) {
  dist.push(readline().trim().split(/\s+/).map(Number));
}

/*
до витка цикла m = x, dist[i][j] содержит кратчайший путь из i в j, если можно использовать промежуточные вершины от 0 до x - 1

во сремя витка m = x обновляем dist[i][j] на кратчайший путь с разрешением еще одной дополнительной промежуточной вершины x

пусть кратчайший путь из 3 -> 5 проходит 3 -> 2 -> 0 -> 1 -> 5, 
при m = 2 будет обновление - путь 3 -> 5, как склейка 3 -> 2 и 2 -> 0 -> 1 -> 5
до этого, при m = 1 будет обновление - путь 2 -> 5, как склейка 2 -> 0 -> 1 и 1 -> 5
до этого, при m = 0 будет обновление - путь 2 -> 1, как склейка 2 -> 0 и 0 -> 1

time O(nV**3)
space O(nV**2)

Находит кратчайшие пути от каждой вершины до каждой
*/
for (let m = 0; m < nV; m++) {
  for (let i = 0; i < nV; i++) {
    for (let j = 0; j < nV; j++) {
      dist[i][j] = Math.min(dist[i][j], dist[i][m] + dist[m][j]);
    }
  }
}

for (const row of dist) {
  console.log(row.join(' '));
}

/*
4
0 5 9 100
100 0 2 8
100 100 0 7
4 100 100 0

=>
0 5 7 13
12 0 2 8
11 16 0 7
4 9 11 0
*/
