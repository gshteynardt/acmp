left = 0
right = 10**9 + 1
res = 0

while True:
    mid = (left + right) >> 1

    print('?', mid)
    curRes = int(input())

    if res > curRes:
        left = mid
    elif res < curRes:
        right = mid
    else:
        print('!', mid)

    res = curRes