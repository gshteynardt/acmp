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
        mx = -2

        for child in children[node]:
            mx = max(mx, getAns(child, 2))

            if mx == 1:
                break

        assert -1 <= mx <= 1
        return mx
    else:
        assert player == 2
        mn = 2

        for child in children[node]:
            mn = min(mn, getAns(child, 1))

            if mn == -1:
                break

        assert -1 <= mn <= 1
        return mn


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
