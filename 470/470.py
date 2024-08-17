size_r, size_c, nq = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(size_r)]
sums = [[0] * (1 + size_c) for _ in range(1 + size_r)]  # sums[r][c] - сумма в прямоугольнике с углами grid[0][0] и grid[r - 1][c - 1]

for r in range(1, size_r + 1):
    for c in range(1, size_c + 1):
        sums[r][c] = sums[r - 1][c] + sums[r][c - 1] - sums[r - 1][c - 1] + grid[r - 1][c - 1]

Q_STEP = 100_000

for q_start in range(0, nq, Q_STEP):
    ans = []

    for _ in range(q_start, min(q_start + Q_STEP, nq)):
        min_r, min_c, max_r, max_c = map(int, input().split())
        ans.append(sums[max_r][max_c] - sums[min_r - 1][max_c] - sums[max_r][min_c - 1] + sums[min_r - 1][min_c - 1])

    print('\n'.join(map(str, ans)))

'''
2 3 1
5 1 2
6 7 3
2 1 2 3
'''
