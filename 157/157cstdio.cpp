#include <cassert>
#include <cstdio>
#include <string>
#include <vector>

int main() {
    char buffer[16 + 1] = {};
    scanf("%16s", buffer);
    std::string s(buffer);
    int n = s.size();
    assert(1 <= n && n <= 15);

    std::vector<long long> fact(1 + n, 1);

    for (int i = 2; i <= n; i++) {
        fact[i] = fact[i - 1] * i;
    }

    std::vector<int> cnt(26, 0);

    for (char c : s) {
        cnt[c - 'a']++;
    }

    long long ans = fact[n];

    for (int c : cnt) {
        ans /= fact[c];
    }

    printf("%lld\n", ans);

    return 0;
}

/*
abc
3*2*1
если все карточки разные, то ответ n!

abbc
4 * 3 * 2 * 1

b - 2

n!/2!

a b1 b2 c
b1 a b2 c
b2 a b1 c
когда места остальных букв фиксированны мы можем пронумерованные буквы
переставить cnt! способами

aaabbbbc
8!/3!/4!
*/
