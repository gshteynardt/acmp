#!/usr/bin/env python3
a = input()
b = input()

result = []
carry = 0
i = 0

while i < len(a) or i < len(b) or carry > 0:
    sum = (int(a[-1 - i]) if i < len(a) else 0) + (int(b[-1 - i]) if i < len(b) else 0) + carry
    result.append(sum % 10)
    carry = sum // 10
    i+= 1

print(''.join(map(str, reversed(result))))
