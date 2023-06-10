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

const startState = readline() + readline() + readline() + readline();
const targetStateW = 'w'.repeat(16);
const targetStateB = 'b'.repeat(16);

const q = [[startState, 0]];
const seen = new Set();
seen.add(startState);
let front = 0;
let ans = 'Impossible';

const directions = [
  [0, 1],
  [0, -1],
  [0, 0],
  [1, 0],
  [-1, 0],
];

while (front < q.length) {
  const [state, steps] = q[front];
  front++;

  if (state === targetStateW || state === targetStateB) {
    ans = steps;
    break;
  }

  const fields = [
    state.substring(0, 4),
    state.substring(4, 8),
    state.substring(8, 12),
    state.substring(12, 16),
  ].map(row => row.split(''));

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {

      const flip = () => {
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;

          if (0 <= nr && nr < 4 && 0 <= nc && nc < 4) {
            fields[nr][nc] = fields[nr][nc] === 'w' ? 'b' : 'w';
          }
        }
      };

      flip();

      const newState = fields.map(row => row.join('')).join('');

      if (!seen.has(newState)) {
        q.push([newState, steps + 1]);
        seen.add(newState);
      }

      flip();
    }
  }
}

console.log(ans);
