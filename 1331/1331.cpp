#include <cstdio>
#include <cassert>
#include <string>
#include <numeric>

struct Fraction {
    // long long до 2^63-1 ~= 9e18
    long long num; // numerator
    long long den; // denominator
    // den > 0
};

Fraction operator +(const Fraction &left, const Fraction &right) {
    // 2/3 + 1/5 = (2 * 5) / (3 * 5) + (1 * 3) / (5 * 3) = (2 * 5 + 1 * 3) / (3 * 5)
    long long num = left.num * right.den + right.num * left.den;
    long long den = left.den * right.den;

    return Fraction{num, den};
}

Fraction operator -(const Fraction &left, const Fraction &right) {
    // 2/3 - 1/5 = (2 * 5) / (3 * 5) - (1 * 3) / (5 * 3) = (2 * 5 - 1 * 3) / (3 * 5)
    long long num = left.num * right.den - right.num * left.den;
    long long den = left.den * right.den;

    return Fraction{num, den};
}

Fraction operator *(const Fraction &left, const Fraction &right) {
    // 2/3 * 1/5 = (2 * 1) / (3 * 5)
    long long num = left.num * right.num;
    long long den = left.den * right.den;

    return Fraction{num, den};
}

Fraction operator /(const Fraction &left, const Fraction &right) {
    // (2/3) / (1/5) = (2 * 5) / (3 * 1)
    // (-2/3) / (1/5) = (-2 * 5) / (3 * 1)
    // (2/3) / (-1/5) = (2 * 5) / (3 * -1) = - (2 * 5) / (3 * 1)
    // (-2/3) / (-1/5) = (-2 * 5) / (3 * -1) = - (-2 * 5) / (3 * 1)

    long long num = left.num * right.den;
    long long den = left.den * right.num;

    if (den < 0) {
        den = -den;
        num = -num;
    }

    return Fraction{num, den};
}

Fraction readFraction() {
    char buffer[18 + 1] = {};
    char endl = '\n';
    scanf("%18[^\n]%c", buffer, &endl);
    assert(endl == '\n');
    std::string s(buffer);

    int spacePos = s.find(' ');
    assert(spacePos != 0);

    if (spacePos >= 0) {
        int wholePart = std::stoi(s.substr(0, spacePos)); // int(s[:spacePos])
        std::string fracPart = s.substr(spacePos + 1);

        int slashPos = fracPart.find('/');
        assert(slashPos >= 0);

        int num = std::stoi(fracPart.substr(0, slashPos));
        int den = std::stoi(fracPart.substr(slashPos + 1));
        // 2 3/5 -> (2 * 5 + 3) / 5 -> 13/5
        // -2 3/5 -> (-2 * 5 - 3) / 5 -> -13/5

        if (wholePart < 0) {
            return Fraction{wholePart * den - num, den};
        } else {
            return Fraction{wholePart * den + num, den};
        }
    } else {
        int slashPos = s.find('/');

        if (slashPos >= 0) {
            int num = std::stoi(s.substr(0, slashPos));
            int den = std::stoi(s.substr(slashPos + 1));

            return Fraction{num, den};
        } else {
            int num = std::stoi(s);
            return Fraction{num, 1};
        }
    }
}

void printFraction(Fraction f) {
    assert(f.den > 0);

    if (f.num < 0) {
        printf("-");
        f.num = -f.num;
    }

    assert(f.num >= 0);

    if (f.num % f.den == 0) {
        printf("%lld", f.num / f.den);
    } else {
        long long whole = f.num / f.den;
        f.num %= f.den;
        assert(f.num < f.den);

        if (whole != 0) {
            printf("%lld ", whole);
        }

        long long g = std::gcd(f.num, f.den);
        f.num /= g;
        f.den /= g;

        assert(f.den > 1);
        printf("%lld/%lld", f.num, f.den);
    }
}

int main() {
    Fraction a = readFraction();

    char endl = '\n';
    char sign = '?';
    scanf("%c%c", &sign, &endl);
    assert(endl == '\n');

    Fraction b = readFraction();

    if (sign == '+') {
        printFraction(a + b);
    } else if (sign == '-') {
        printFraction(a - b);
    } else if (sign == '*') {
        printFraction(a * b);
    } else {
        assert(sign == '/');
        printFraction(a / b);
    }

    return 0;
}
