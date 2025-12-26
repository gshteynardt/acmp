'''
Fraction = '0' | ['-'] UnsignedFraction

not LL(1)
UnsignedFraction = WholePart ' ' Numerator '/' Denominator |
    Numerator '/' Denominator |
    WholePart

WholePart = PositiveInt
Numerator = PositiveInt
Denominator = PositiveInt

LL(1)
UnsignedFraction = PositiveInt [' ' PositiveInt '/' PositiveInt | '/' PositiveInt]  # [] - 0 or 1, if

PositiveInt = '1'..'9' {'0'..'9'}  # {} - 0 or more times, while

5 6/7
5/6
5
'''

from math import gcd
from typing import NamedTuple

s = ''
pos = 0
ch = ''
EOT = '\n'

def nextChar():
    global ch, pos

    if pos < len(s):
        ch = s[pos]
        pos += 1
    else:
        ch = EOT

def readLine():
    global s, pos

    s = input()
    pos = 0

    nextChar()

# PositiveInt = '1'..'9' {'0'..'9'}
def positiveInt():
    assert '1' <= ch <= '9'
    v = ord(ch) - ord('0')
    nextChar()

    while '0' <= ch <= '9':
        d = ord(ch) - ord('0')
        nextChar()
        v = v * 10 + d

    return v

class Fraction(NamedTuple):
    num: int  # numerator
    den: int  # denominator

    def __add__(self, right):
        return Fraction(self.num * right.den + right.num * self.den, self.den * right.den)  # 5/6 + 7/8 = (5 * 8) / (6 * 8) + (7 * 6) / (6 * 8) = (5 * 8 + 7 * 6) / (6 * 8)

    def __sub__(self, right):
        return Fraction(self.num * right.den - right.num * self.den, self.den * right.den)  # 5/6 - 7/8 = (5 * 8) / (6 * 8) - (7 * 6) / (6 * 8) = (5 * 8 - 7 * 6) / (6 * 8)

    def __mul__(self, right):
        return Fraction(self.num * right.num, self.den * right.den)  # 5/6 * 7/8 = (5 * 7) / (6 * 8)

    def __truediv__(self, right):
        new_num = self.num * right.den
        new_den = self.den * right.num

        assert new_den != 0

        if new_den > 0:
            return Fraction(new_num, new_den)
        else:
            return Fraction(-new_num, -new_den)  # -5 / -3 = 5 / 3, 5 / -3 = -5 / 3

# UnsignedFraction = PositiveInt [' ' PositiveInt '/' PositiveInt | '/' PositiveInt]
def unsignedFraction():
    v = positiveInt()

    if ch == ' ':
        nextChar()
        num = positiveInt()
        assert ch == '/'
        nextChar()
        den = positiveInt()
        return Fraction(v * den + num, den)  # 5 6/7 = 5 * 7 / 7 + 6/7 = (5 * 7 + 6) / 7

    elif ch == '/':
        nextChar()
        den = positiveInt()
        return Fraction(v, den)
    else:
        return Fraction(v, 1)

# Fraction = '0' | ['-'] UnsignedFraction
def fraction():
    if ch == '0':
        nextChar()
        return Fraction(0, 1)
    else:
        sign = 1

        if ch == '-':
            sign = -1
            nextChar()

        ans = unsignedFraction()
        return Fraction(ans.num * sign, ans.den)

def readFraction():
    readLine()
    ans = fraction()
    assert ch == EOT

    return ans

def printFraction(f: Fraction):
    num = f.num
    den = f.den

    assert den > 0

    if num < 0:
        print('-', end='')
        num = -num

    assert num >= 0

    if num % den == 0:
        print(num // den)
    else:
        whole = num // den
        num %= den
        assert num < den

        if whole != 0:
            print(f'{whole} ', end='')

        g = gcd(num, den)
        assert g >= 1

        num //= g
        den //= g

        assert den > 1
        print(f'{num}/{den}')  # print("%d/%d" % (num, den))

a = readFraction()
sign = input()
b = readFraction()

if sign == '+':
    printFraction(a + b)
elif sign == '-':
    printFraction(a - b)
elif sign == '*':
    printFraction(a * b)
else:
    assert sign == '/'
    printFraction(a / b)
