function readline() {
  const fs = require('fs');
  const b = Buffer.alloc(1);
  let s = '';
  while (true) {
    const len = fs.readSync(0, b);
    if (len == 0) {
      return s;
    }
    if (b[0] == 13) {
      continue;
    }
    if (b[0] == 10) {
      return s;
    }
    s += b;
  }
}

const n = Number(readline());
const matrix = [];

for (let i = 0; i < n; i++) {
  matrix.push(readline().split(/\s+/).map(Number));
}

let [vStart, vEnd] = readline().split(/\s+/).map(Number);

vStart--;
vEnd--;

const q = [vStart];
let front = 0;
const paths = Array.from({ length: n }, () => -1);
paths[vStart] = 0;

while (front < q.length) {
  const cur = q[front++];

  if (cur === vEnd) {
    break;
  }
  
  for (let next = 0; next < n; next++) {
    if (paths[next] === -1 && matrix[cur][next] === 1) {
      q.push(next);
      paths[next] = paths[cur] + 1;
    }
  }
}

console.log(paths[vEnd]);
