#  Time O(2^n)
n, target = map(int, input().split())
nums = list(map(int, input().split()))
ops = [1] * n
curr_sum = sum(nums)

while True:
    if ops[0] != 1:
        print('No solution')
        break
    if curr_sum == target:
        ans = str(nums[0])

        for i in range(1, n):
            if ops[i] == 1:
                ans += '+'
            else:
                ans += '-'            
            ans += str(nums[i])

        ans += f'={target}'
        print(ans)
        break
    
    i = n - 1

    while ops[i] == 0:
        ops[i] = 1
        curr_sum += 2 * nums[i]
        i -= 1

    assert i >= 0 and ops[i] == 1

    ops[i] = 0
    curr_sum -= 2 * nums[i]

'''
3 10
15 25 30

1111
1110
1101
1100
1011
1010
1001
1000
0111
'''
