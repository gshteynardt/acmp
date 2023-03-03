#!/usr/bin/env python3

n, a, b, w, h = map(int, input().split())

def protective_width_to_slots(d):
    return (w / (a + 2 * d)) * (h / (b + 2 * d))

left = 0
right = min(w, h) + 1

while right - left > 1:
    mid = (left + right) // 2

    if protective_width_to_slots(mid) >= n:
        left = mid
    else:
        right = mid

print(left)
