input()

a = list(map(int, input().split()))

print(min(sum(a) >> 1, sum(a) - max(a)))

'''
2
3 3 -> 3

3
3 3 3
* *   2 2 3
  * * 2 1 2
*   * 1 1 1
* *   0 0 1

3
1 1 10
'''
