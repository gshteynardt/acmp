n = int(input())

children = [None] + [[] for _ in range(n)]
ans = [None] * (n + 1)

for i in range(2, n + 1):
    node = input().split()
    parent = int(node[1])
    children[parent].append(i)

    if node[0] == 'L':
        ans[i] = int(node[2])


def getAns(node, player):
    if ans[node] is not None:
        return ans[node]
    
    if player == 1:
        return max(getAns(child, 2) for child in children[node])
    else:
        assert player == 2
        return min(getAns(child, 1) for child in children[node])


def withSign(val: int) -> str:
    return str(val) if val <= 0 else f'+{val}'

print(withSign(getAns(1, 1)))

'''
7
N 1
N 1
L 2 -1
L 2 +1
L 3 +1
L 3 +1

18
N 1
N 1
N 2
L 2 +1
N 3
L 3 +1
L 3 +1
L 4 -1
L 4 +1
N 4
N 6
L 6 -1
L 6 -1
L 11 -1
L 11 +1
L 12 +1
L 12 -1
'''
