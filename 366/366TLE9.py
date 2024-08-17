#  Time O(2^n)
n, target = map(int, input().split())
nums = list(map(int, input().split()))
ops = ['+'] * n

def findExpression(index, curr_sum):
    if index == n:
        if curr_sum == target:
            return ''.join(op + str(num) for op, num in zip(ops,nums))[1:] + f'={target}'
        else:
            return None
        
    ops[index] = '+'
    result_add = findExpression(index + 1, curr_sum + nums[index])

    if result_add:
        return result_add

    ops[index] = '-'
    result_subtracting = findExpression(index + 1, curr_sum - nums[index])

    if result_subtracting:
        return result_subtracting
    
    return None

print(findExpression(1, nums[0]) or 'No solution')

'''
3 10
15 25 30
'''
