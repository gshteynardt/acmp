const input = require('fs').readFileSync(0, 'binary');
const lines = input.split(/\n/);

const [n, steps] = lines[0].trim().split(/\s+/).map(Number);
const isFree = Array.from({ length: 1 + n + 1 }, (_, r) => Array.from({ length: 1 + n + 1 }, (_, c) => 1 <= r && r <= n && 1 <= c && c <= n && lines[r][c - 1] === '0'));

const counts = Array.from({ length: 2 }, () => Array.from({ length: 1 + n + 1 }, () => Array(1 + n + 1).fill(0)));
counts[0 & 1][1][1] = 1;

for (let step = 1; step <= steps; step++) {
  for (let r = 1; r <= n; r++) {
    for (let c = 1; c <= n; c++) {
      counts[step & 1][r][c] = 0;

      if (isFree[r][c]) {
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = r + dr;
          const nc = c + dc;

          counts[step & 1][r][c] += counts[(step - 1) & 1][nr][nc];
        }
      }
    }
  }
}

console.log(counts[steps & 1][n][n]);

/*
  count[steps][r][c] - количество способов прийти в клетку r,c из 1,1 за ровно steps шагов
  count[steps = 0][r][c] = r === 1 && c === 1 ? 1 : 0

  count[steps > 0][r][c] = !isFree[r][c] ? 0 : count[steps - 1][r - 1][c] + 
    count[steps - 1][r][c - 1] +
    count[steps - 1][r + 1][c] +
    count[steps - 1][r][c + 1]; 

    count[steps][n][n]
*/

/*
3 6
000
101
100
*/
