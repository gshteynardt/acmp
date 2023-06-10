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

const startState = readline() + readline();
const targetState = readline() + readline();

const generateNextStates = (state) => {
  const emptyIndex = state.indexOf('#');
  const emptyR = emptyIndex >> 2;
  const emptyC = emptyIndex & 3;
  const nextStates = [];

  const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
  ];

  const row0 = state.substring(0, 4).split('');
  const row1 = state.substring(4).split('');
  const newState = [row0, row1];

  for (const [dr, dc] of directions) {
    const nr = emptyR + dr;
    const nc = emptyC + dc;

    if (nr >= 0 && nr < 2 && nc >= 0 && nc < 4) {
      newState[emptyR][emptyC] = newState[nr][nc];
      newState[nr][nc] = '#';
      nextStates.push(newState.map(row => row.join('')).join(''));
      newState[nr][nc] = newState[emptyR][emptyC];
      newState[emptyR][emptyC] = '#';
    }
  }

  return nextStates;
};

const q = [[startState, 0]];
let front = 0;
const seen = new Set();
seen.add(startState);
let ans = -1;

while (front < q.length) {
  const [currentState, steps] = q[front];
  front++;

  if (currentState === targetState) {
    ans = steps;
    break;
  }

  const nextStates = generateNextStates(currentState);

  for (const nextState of nextStates) {
    if (!seen.has(nextState)) {
      q.push([nextState, steps + 1]);
      seen.add(nextState);
    }
  }
}

console.log(ans);

/*
ACM8
002#
ACM#
2008
*/