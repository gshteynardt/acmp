size_r, size_c, nq = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(size_r)]
sums = [[0] * (size_c + 1) for _ in range(size_r + 1)]  # sums[r][c] - сумма в прямоугольнике с углами grid[0][0] и grid[r][c], последняя/-1 строка и столбец нулевые

for r in range(size_r):
    for c in range(size_c):
        sums[r][c] = sums[r - 1][c] + sums[r][c - 1] - sums[r - 1][c - 1] + grid[r][c]

Q_STEP = 100_000

for q_start in range(0, nq, Q_STEP):
    ans = []

    for _ in range(q_start, min(q_start + Q_STEP, nq)):
        min_r, min_c, max_r, max_c = map(int, input().split())
        min_r, min_c, max_r, max_c = min_r - 1, min_c - 1, max_r - 1, max_c - 1
        ans.append(sums[max_r][max_c] - sums[min_r - 1][max_c] - sums[max_r][min_c - 1] + sums[min_r - 1][min_c - 1])

    print('\n'.join(map(str, ans)))

'''
2 3 1
5 1 2
6 7 3
2 1 2 3
'''
