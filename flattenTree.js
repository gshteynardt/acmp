/*
    Получение значений всех вершин дерева (рекурсивно)
    
    Задача: Написать функцию, которая возвращает массив значений всех вершин дерева.
    Пример входных данных:
    
    js
    Copy
    Edit
*/

// type Tree<T> = {
//   value: T;
//   children?: Tree<T>[];
// };

const tree = {
    value: 1,
    children: [
        { value: 2, children: [{ value: 4 }, { value: 5 }] },
        { value: 3, children: [{ value: 6 }, { value: 7, children: [{ value: 8 }] }] }
    ],
};

const flattenTree = (tree) => {
  const res = [];

  const traverse = (node) => {
    if (!node) {
      return;
    }
    
    if (node.hasOwnProperty('value')) {
        res.push(node.value);
    }

    if (node.children) {
        for (const child of node.children) {
            traverse(child);
        }
    }
  };

  traverse(tree);
  return res;
};

const flattenTreeStack = (tree) => {
  const res = [];
  const stack = [tree];
    
  while (stack.length > 0) {
      const node = stack.pop();
      
      if (!node) {
          continue
      }
    
      res.push(node.value);
      
      if (node.children) {
          for (let i = node.children.length - 1; i >= 0; i--) {
              stack.push(node.children[i]);
          }
      }
  }

  return res;
};

const flattenTreeBFS = (tree) => {
  const res = [];
  const q = [tree];
  let front = 0;

  while (front < q.length) {
      const node = q[front];
      front++;

      if (node.hasOwnProperty('value')) {
          res.push(node.value);
      }
      
      if (node.children) {
          for (const child of node.children) {
              q.push(child);
          }
      }
  }

  return res;
};

function *traverse(node) {
    if (!node) {
        return;
    }
    
    yield node.value;
    
    if (node.children) {
        for (const child of node.children) {
            yield *traverse(child)
        }
    }
}

function *traverseBFS(node) {
    const q = [node];
    let front = 0;
    
    while (front < q.length) {
        const node = q[front];
        front++;
        
        yield node.value;
        
        if (node.children) {
            for (const child of node.children) {
                q.push(child);
            }
        }
    }
}

const flattenTreeGen = (tree) => {
    return [...traverseBFS(tree)];
};

const flatten = (tree) => {
    for (const node of traverseBFS(tree)) {
        console.log({ node });
    }
};

flatten(tree);
console.log(flattenTreeGen(tree)); // [1, 2, 4, 5, 3, 6, 7, 8]
