#  Time O(n * 2^(n / 2))
#  meet in the middle
import sys

n, target = map(int, input().split())
nums = list(map(int, input().split()))

def getVariants(nums):
    n = len(nums)
    nums.append(0)
    ops = [1] * (n + 1)    
    ans = []    
    curr_sum = sum(nums)

    while ops[-1] == 1:
        expr = ''

        for i in range(n):
            if ops[i] == 1:
                expr += '+'
            else:
                expr += '-'            
            expr += str(nums[i])

        ans.append((expr, curr_sum))

        i = n - 1

        while ops[i] == 0:
            ops[i] = 1
            curr_sum += 2 * nums[i]
            i -= 1

        assert i >= -1 and ops[i] == 1

        ops[i] = 0
        curr_sum -= 2 * nums[i]

    return ans

half1 = getVariants(nums[1:(n + 1) // 2])
half2 = getVariants(nums[(n + 1) // 2:n])

half1_sum_to_expr = {}

for expr, s in half1:
    half1_sum_to_expr[s] = expr

for expr2, s2 in half2:
    s1 = target - s2 - nums[0]

    if s1 in half1_sum_to_expr:
        expr1 = half1_sum_to_expr[s1]
        print(f'{nums[0]}{expr1}{expr2}={target}')
        sys.exit(0)

print('No solution')

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

2 100
10 10
'''
