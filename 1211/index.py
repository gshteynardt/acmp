#!/usr/bin/env python3

a, k, b, m, x = map(int, input().split())

def day_to_tree(d):
    per1 = (d - (d // k)) * a
    per2 = (d - (d // m)) * b
    return per1 + per2

left = 0
right = 1

while day_to_tree(right) < x:
    left = right
    right *= 2

while right - left > 1:
    mid = (left + right) // 2

    if day_to_tree(mid) < x:
        left = mid
    else:
      right = mid

print(right)
