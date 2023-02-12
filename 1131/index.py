#!/usr/bin/env python3

a, b, c, d = map(int, input().split())

if a < 0:
    a = -a
    b = -b
    c = -c
    d = -d


# def f(x):
#     return a * x ** 3 + b * x ** 2 + c * x + d

def f(x): return a * x ** 3 + b * x ** 2 + c * x + d

left = -2000  # f(left) < 0 <=> left < root
right = 2000  # f(right) >= 0 <=> right >= root

while right - left > 0.002:
    mid = (left + right) / 2

    if f(mid) < 0:
        left = mid
    else:
        right = mid

print((left + right) / 2)
