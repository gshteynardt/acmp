#include <cstdio>
#include <string>
#include <cassert>

struct Error {};

int number(std::string s) {
    if (s.empty()) {
        throw Error();
    }

    int mult = 1;

    if (s[0] == '-') {
        mult = -1;
        s = s.substr(1);
    }

    if (s.empty()) {
        throw Error();
    }

    int num = 0;

    for (char ch : s) {
        if ('0' <= ch && ch <= '9') {
            num = num * 10 + (ch - '0');
        } else {
            throw Error();
        }
    }

    return num * mult;
}

std::tuple<int, char, int, int> getParts(const std::string &s) { // throws Error in case of an error
    int eqPos = s.find('=');

    if (eqPos == -1) {
        throw Error();
    }

    std::string left = s.substr(0, eqPos);
    std::string right = s.substr(eqPos + 1);

    int opPos = left.find_first_of("+-*/", 1);

    if (opPos == -1) {
        throw Error();
    }

    char op = left[opPos];

    std::string operand1 = left.substr(0, opPos);
    std::string operand2 = left.substr(opPos + 1);

    return { number(operand1), op, number(operand2), number(right) };
}

int main() {
    char buffer[100 + 1] = {};
    char endl = '\n';
    scanf("%100[^\n]%c", buffer, &endl);

    assert(endl == '\n');

    std::string s = buffer;

    try {
        auto [left, op, right, res] = getParts(s);

        if (
            op == '+' && left + right == res ||
            op == '-' && left - right == res ||
            op == '*' && left * right == res ||
            op == '/' && right != 0 && left == res * right
        ) {
            printf("YES");
        } else {
            printf("NO");
        }
    } catch (Error e) {
        printf("ERROR");
    }

    return 0;
}
