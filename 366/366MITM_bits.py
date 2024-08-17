#  Time O(2^(n / 2))
#  meet in the middle
import sys

n, target = map(int, input().split())
nums = list(map(int, input().split()))

def getVariants(nums):
    n = len(nums)
    nums.append(0)
    ops = (1 << n) - 1
    ans = []    
    curr_sum = sum(nums)

    while True:
        ans.append((ops, curr_sum))

        if ops == 0:
            break

        i = 0

        while ((ops >> i) & 1) == 0:
            curr_sum += 2 * nums[i]
            i += 1

        curr_sum -= 2 * nums[i]
        ops -= 1

    return ans

len1 = (n - 1) // 2
len2 = (n - 1) - len1
half1 = getVariants(nums[1:1 + len1])
half2 = getVariants(nums[1 + len1:n])

half1_sum_to_code = {}

for code, s in half1:
    half1_sum_to_code[s] = code

for code2, s2 in half2:
    s1 = target - s2 - nums[0]

    if s1 in half1_sum_to_code:
        code1 = half1_sum_to_code[s1]
        ans = f'{nums[0]}'

        for i in range(len1):
            if ((code1 >> i) & 1) == 0:
                ans += '-'
            else:
                ans += '+'
            ans += str(nums[1 + i])

        for i in range(len2):
            if ((code2 >> i) & 1) == 0:
                ans += '-'
            else:
                ans += '+'
            ans += str(nums[1 + len1 + i])

        ans += f'={target}'
        print(ans)
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
