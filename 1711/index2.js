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

let leftI = -1_000_000; //leftI <= duckI
let rightI = 1_000_000; //rightI >= duckI
let leftJ = -1_000_000; //leftJ <= duckJ
let rightJ = 1_000_000; //rightJ >= duckJ

while (true) {
  const midI = (leftI + rightI) >> 1;
  const midJ = (leftJ + rightJ) >> 1;

  console.log(`${midI} ${midJ}`);
  const [dI, dJ] = readline().split(/\s+/).map(Number);

  if (dI === 0 && dJ === 0) {
    break;
  }

  if (dI > 0) {
    leftI = midI + 1; //leftI === 1 rightI === 9 midI === 5 dI === 1 before shot duckI === 6/7/8/9, after shot duckI === 7/8/9/10
    leftI++;
    rightI++;
  } else if (dI < 0) {
    rightI = midI - 1;//leftI === 1 rightI === 9 midI === 5 dI === -1 before shot duckI === 1/2/3/4, after shot duckI === 0/1/2/3
    leftI--;
    rightI--;
  } else {
    //leftI === 1 rightI === 9 midI === 5 dI === 0 before shot duckI === 5, after shot duckI === 5
    //если мы не изменим leftI и rightI, то будем стрелять в одну и туже координату и попадать
  }

  if (dJ > 0) {
    leftJ = midJ + 1;
    leftJ++;
    rightJ++;
  } else if (dJ < 0) {
    rightJ = midJ - 1;
    leftJ--;
    rightJ--;
  }
}
