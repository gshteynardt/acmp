/*
РБНФ - расширенная форма Бэкуса-Наура
EBNF

равенство = число ('+'|'-'|'*'|'/') число '=' число.
число = ['-']'0'...'9'{'0'...'9'}.
| или
[] ноль или один раз
{} ноль или больше раз
'+' ровно то, что ожидаем
() группировка
*/

#include <cstdio>
#include <string>
#include <cassert>

char c = 0;
std::string s;
int pos = 0;
const char EOT = '\n'; // end of text

struct Error {
};

void readLine() {
    char buffer[100 + 1] = {};
    char endl = '\n';
    scanf("%100[^\n]%c", buffer, &endl);

    assert(endl == '\n');

    s = buffer;
    pos = 0;
}

void nextChar() {
    if (pos < s.size()) {
        c = s[pos];
        pos++;
    } else {
        c = EOT;
    }
}

// число = ['-']'0'...'9'{'0'...'9'}.
int number() {
    int mult = 1;

    if (c == '-') {
        mult = -1;
        nextChar();
    }

    int num = 0;

    if ('0' <= c && c <= '9') {
        num = c - '0';
        nextChar();
    } else {
        throw Error();
    }

    while ('0' <= c && c <= '9') {
        num = num * 10 + (c - '0');
        nextChar();
    }

    return num * mult;
}

// равенство = число ('+'|'-'|'*'|'/') число '=' число.
std::tuple<int, char, int, int> equality() {
    // throws Error in case of an error
    int operand1 = number();
    char op;

    if (c == '+' || c == '-' || c == '*' || c == '/') {
        op = c;
        nextChar();
    } else {
        throw Error();
    }

    int operand2 = number();

    if (c == '=') {
        nextChar();
    } else {
        throw Error();
    }

    int res = number();

    return {operand1, op, operand2, res};
}

int main() {
    readLine();
    nextChar();

    try {
        auto [left, op, right, res] = equality();

        if (c != EOT) {
            throw Error();
        }

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
