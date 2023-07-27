const stateNotVisited = 0;
const stateVisiting = 1;
const stateVisited = 2;

const findCycleColoring = (adj) => {
  const state = {};
  const cycleNodes = [];

  const hasCycle = (node) => {
    if (state[node] === stateVisiting) {
      cycleNodes.push(node)
      return true;
    }

    if (state[node] === stateVisited) {
      return false;
    }

    state[node] = stateVisiting;

    for (const neighbor of adj[node]) {
      if (hasCycle(neighbor)) {
        if (cycleNodes.length === 1 || cycleNodes[0] !== cycleNodes[cycleNodes.length - 1]) {
          cycleNodes.push(node);
        }

        return true;
      }
    }

    state[node] = stateVisited;
    return false;
  };

  for (const node of Object.keys(adj)) {
    if (state[node] === undefined) {
      if (hasCycle(node)) {
        cycleNodes.reverse()

        if (cycleNodes.length > 1 && cycleNodes[0] === cycleNodes[cycleNodes.length - 1]) {
          cycleNodes.pop();
        }

        break;
      }
    }
  }

  return cycleNodes;
};

const findCycle = (graph) => {
  const seen = new Set();
  const inStack = new Set();
  const cycleNodes = [];

  const dfs = (node) => {
    if (inStack.has(node)) {
      return true;
    }

    if (seen.has(node)) {
      return false;
    }

    inStack.add(node);
    seen.add(node);

    for (const neighbor of graph[node]) {
      if (dfs(neighbor)) {
        if (!cycleNodes.includes(neighbor)) {
          cycleNodes.push(neighbor);
        }

        return true;
      }
    }

    inStack.delete(node);
    return false;
  };

  for (const key of Object.keys(graph)) {
    if (!seen.has(key)) {
      dfs(key);
    }
  }

  return cycleNodes;
};

const graph = {
  'SHTEYNARDT-175': ['SHTEYNARDT-182'],
  'SHTEYNARDT-176': ['SHTEYNARDT-181'],
  'SHTEYNARDT-178': ['SHTEYNARDT-179'],
  'SHTEYNARDT-179': ['SHTEYNARDT-180'],
  'SHTEYNARDT-180': ['SHTEYNARDT-181'],
  'SHTEYNARDT-181': ['SHTEYNARDT-175', 'SHTEYNARDT-178'],
  'SHTEYNARDT-182': ['SHTEYNARDT-183'],
  'SHTEYNARDT-183': ['SHTEYNARDT-184'],
  'SHTEYNARDT-184': ['SHTEYNARDT-179', 'SHTEYNARDT-175'],
};

// console.log(findCycle(graph));

/*
                    --->SHTEYNARDT-175 --> SHTEYNARDT-182 --> SHTEYNARDT-183 --\
                    \     ^                                                      \
                    \     \                                                       \
                    \     -------------------SHTEYNARDT-184 <----------------------\
                    \
SHTEYNARDT-176 --> SHTEYNARDT-181 --> SHTEYNARDT-178 --> SHTEYNARDT-179 --> SHTEYNARDT-180 --\
                        ^                                                                    \
                        \_____________________________________________________________________\
*/

const findCycleBacktrack = (graph) => {
  const state = {};
  const cycles = [];
  const parents = {};
  let cycleCount = 0;

  const dfs = (node, parent) => {
    if (state[node] === stateVisited) {
      return;
    }

    if (state[node] === stateVisiting) {
      const newCycle = [];
      let curNode = parent;
      newCycle.push(curNode);

      while (curNode !== node) {
        curNode = parents[curNode];
        newCycle.push(curNode);
      }

      cycles[cycleCount] = newCycle;
      cycleCount++;
      return;
    }

    parents[node] = parent;
    state[node] = stateVisiting;

    for (const neighbor of graph[node]) {
      if (neighbor === parents[node]) {
        continue;
      }

      dfs(neighbor, node);
    }

    state[node] = stateVisited;
  };

  for (const key of Object.keys(graph)) {
    dfs(key);
  }

  return cycles;
};

console.log(findCycleColoring(graph));
