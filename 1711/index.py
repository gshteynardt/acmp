leftI = -1_000_001  # leftI < duckI
rightI = 1_000_000  # rightI >= duckI
leftJ = -1_000_001  # leftJ < duckJ
rightJ = 1_000_000  # rightJ >= duckJ

while True:
    midI = (leftI + rightI + 1) >> 1
    midJ = (leftJ + rightJ + 1) >> 1

    print(midI, midJ)
    dI, dJ = map(int, input().split())

    if dI == dJ == 0:
        break

    if dI > 0:
        leftI = midI  # leftI == 0 rightI == 9 midI == 5 dI == 1 before shot duckI == 6/7/8/9, after shot duckI == 7/8/9/10
        leftI += 1
        rightI += 1
    elif dI < 0:
        rightI = midI - 1  # leftI == 0 rightI == 9 midI == 5 dI == -1 before shot duckI == 1/2/3/4, after shot duckI == 0/1/2/3
        leftI -= 1
        rightI -= 1
    else:
        None
        # leftI == 0 rightI == 9 midI == 5 dI == 0 before shot duckI == 5, after shot duckI == 5
        # если мы не изменим leftI и rightI, то будем стрелять в одну и туже координату и попадать

    if dJ > 0:
        leftJ = midJ
        leftJ += 1
        rightJ += 1
    elif dJ < 0:
        rightJ = midJ - 1
        leftJ -= 1
        rightJ -= 1
