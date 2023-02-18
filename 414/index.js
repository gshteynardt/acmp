//1-е из них не больше 1 и задает номер отдела, к которому подсоединен отдел 2
//2-е из них не больше 2 и задает номер отдела, к которому подсоединен отдел 3
//3-е из них не больше 3 и задает номер отдела, к которому подсоединен отдел 4
//4-е из них не больше 4 и задает номер отдела, к которому подсоединен отдел 5
//5-е из них не больше 5 и задает номер отдела, к которому подсоединен отдел 6
//6-е из них не больше 6 и задает номер отдела, к которому подсоединен отдел 7

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin
});

let lines = [];

rl.on('line', (line) => {
  lines.push(line);
}).on('close', () => {
  const [p, q] = lines[1].split(' ').map(Number);
  //parent[i-2] - родитель i-ой вершины
  //4-е число в строке - родитель 5-го отдела, а индекс 4-го числа в parent - 3
  const parent = lines[2].split(' ').map(Number);
  parent.unshift(0, 0);
  //parent[i] - родитель вершины i-ой

  let cur1 = p;
  let cur2 = q;
  const path1 = [];
  const path2 = [];

  while (true) {
    path1.push(cur1);

    if (cur1 === 1) {
      break;
    }

    cur1 = parent[cur1];
  }

  while (true) {
    path2.push(cur2);

    if (cur2 === 1) {
      break;
    }

    cur2 = parent[cur2];
  }

  let i = 0;
  let ans = 0;
  path1.reverse();
  path2.reverse();

  while (i < Math.min(path1.length, path2.length)) {
    if (path1[i] === path2[i]) {
      i++;
    } else {
      break;
    }
  }

  ans = path1[i - 1];
  console.log(ans);
});