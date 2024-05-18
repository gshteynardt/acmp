_ = int(input())
coins = list(map(int, input().split()))

_ = int(input())
sums = list(map(int, input().split()))

canChange = [False] * (max(sums) + 1)
canChange[0] = True

for s in range(1, len(canChange)):
    for coin in coins:
        if s - coin >= 0 and canChange[s - coin]:
            canChange[s] = True

print(' '.join(str(int(canChange[s])) for s in sums))

'''
2
3 5
5
3 6 7 11 12

1
10
1
3
'''
