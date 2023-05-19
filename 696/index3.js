input = require('fs').readFileSync(0, 'binary');
const tokens = input.trim().split(/\s+/);

const sizeR = Number(tokens[0]);
const sizeC = Number(tokens[1]);
const costs = [tokens[2], tokens[3], tokens[4], tokens[5]].map(Number); // [0] - r, [1] - g, [2] - b, [3] - y
const map = tokens.splice(6);

let startR = -1;
let startC = -1;

for (let r = 0; r < sizeR; r++) {
  for (let c = 0; c < sizeC; c++) {
    if (map[r][c] === 'S') {
      startR = r;
      startC = c;
      map[r][c] = '.';
    }
  }
}

const get = [0, 0, 0, 0]; // [0] - r, [1] - g, [2] - b, [3] - y
const keys = 'RGBY';

const directions = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const costAll = costs.reduce((acc, cost) => acc + cost, 0);
let result = costAll + 1;

for (get[0] = 0; get[0] < 2; get[0]++) {
  for (get[1] = 0; get[1] < 2; get[1]++) {
    for (get[2] = 0; get[2] < 2; get[2]++) {
      for (get[3] = 0; get[3] < 2; get[3]++) {
        const seen = Array.from({ length: sizeR }, () => Array.from({ length: sizeC }, () => false));
        const q = [];
        q.push([startR, startC]);
        seen[startR][startC] = true;
        let front = 0;

        while (front < q.length) {
          const [r, c] = q[front];
          front++;

          if (map[r][c] === 'E') {
            result = Math.min(result, costs[0] * get[0] + costs[1] * get[1] + costs[2] * get[2] + costs[3] * get[3]);
            break;
          }

          for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (0 <= nr && nr < sizeR && 0 <= nc && nc < sizeC && !seen[nr][nc]) {
              const value = map[nr][nc];
              const index = keys.indexOf(value);

              if (value === '.' || (index >= 0 && get[index] > 0) || value === 'E') {
                q.push([nr, nc]);
                seen[nr][nc] = true;
              }
            }
          }
        }
      }
    }
  }
}

console.log(result === costAll + 1 ? 'Sleep' : result);

/*
6 6
1 5 3 1
XXXXXX
XS.X.X
X..R.X
X.XXBX
X.G.EX
XXXXXX
*/