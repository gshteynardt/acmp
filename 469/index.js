let lines = require('fs').readFileSync(0, 'binary').trim().split(/\r?\n/);
const [sizeR, sizeC] = lines[0].trim().split(/\s+/).map(Number);
const cost = Array.from({ length: sizeR }, () => null);

for (let r = 0; r < sizeR; r++) {
  cost[r] = lines[r + 1].trim().split(/\s+/).map(Number);
}

const INF = 100 * (sizeR + sizeC - 1) + 1;
const minCost = Array.from({ length: sizeR }, () => Array.from({ length: sizeC }, () => INF));
const isFinal = Array.from({ length: sizeR }, () => Array.from({ length: sizeC }, () => false));
minCost[0][0] = cost[0][0];

while (true) {
  let minR = -1;
  let minC = -1;

  for (let r = 0; r < sizeR; r++) {
    for (let c = 0; c < sizeC; c++) {
      if (!isFinal[r][c]) {
        if (minR === -1 || minCost[r][c] < minCost[minR][minC]) {
          minR = r;
          minC = c;
        }
      }
    }
  }

  if (minR === -1) {
    break;
  }

  isFinal[minR][minC] = true;

  for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const nr = minR + dr;
    const nc = minC + dc;

    if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC) {
      minCost[nr][nc] = Math.min(minCost[nr][nc], minCost[minR][minC] + cost[nr][nc]);
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
