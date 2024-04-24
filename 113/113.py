n = int(input())

matrix = [list(map(int, input())) for _ in range(n)]
max_side = [[0] * n for _ in range(2)]
max_size = 0

for r in range(n):
    for c in range(n):
        if matrix[r][c] == 1:
            if r == 0 or c == 0:
                max_side[r & 1][c] = 1
            else:
                max_side[r & 1][c] = 1 + min(
                    max_side[(r - 1) & 1][c],
                    max_side[r & 1][c - 1],
                    max_side[(r - 1) & 1][c - 1]
                )
            max_size = max(max_size, max_side[r & 1][c])
        else:
            max_side[r & 1][c] = 0

print(max_size ** 2)

'''
7
1101101
1111110
1011100
0011100
1000010
1100111
1001110
'''
