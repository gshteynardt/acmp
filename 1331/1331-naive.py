from fractions import Fraction
from math import gcd

def readFraction():
    s = input()
    spacePos = s.find(' ')
    assert spacePos != 0

    if spacePos >= 0:
        wholePart = int(s[:spacePos])
        fracPart = s[spacePos + 1:]

        slashPos = fracPart.find('/')
        assert slashPos >= 0
        num = int(fracPart[:slashPos])
        den = int(fracPart[slashPos + 1:])

        if wholePart < 0:
            return Fraction(wholePart * den - num, den)
        else:
            return Fraction(wholePart * den + num, den)
    else:
        slashPos = s.find('/')

        if slashPos >= 0:
            num = int(s[:slashPos])
            den = int(s[slashPos + 1:])

            return Fraction(num, den)
        else:
            num = int(s)
            return Fraction(num, 1)

def printFraction(f: Fraction):
    num = f.numerator
    den = f.denominator

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
        assert g == 1

        assert den > 1
        print(f'{num}/{den}')  # print("%d/%d" % (num, den))

a = readFraction();
sign = input()
b = readFraction();

if sign == '+':
    printFraction(a + b)
elif sign == '-':
    printFraction(a - b)
elif sign == '*':
    printFraction(a * b)
else:
    assert sign == '/'
    printFraction(a / b)
