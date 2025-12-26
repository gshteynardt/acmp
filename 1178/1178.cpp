#include <cstdio>
#include <vector>
#include <cassert>

int pow2up(int n) {
    int p = 1;

    while (p < n) {
        p <<= 1;
    }

    return p;
}

class SegmentTree {
private:
    std::vector<int> s;

public:
    explicit SegmentTree(int n)
        : s(pow2up(n) << 1, 0)
    {}

    int sum(int left, int right) const { // returns sum of [left, right] inclusive
        assert(0 <= left);
        assert(left <= right + 1); // разрешаем left == right + 1 в случае пустого отрезка
        assert(right < (s.size() >> 1));
        left += s.size() >> 1;
        right += s.size() >> 1;

        int ans = 0;

        while (left <= right) {
            if ((left & 1) == 1) {
                ans += s[left];
                left++;
            }

            if ((right & 1) == 0) {
                ans += s[right];
                right--;
            }

            left >>= 1;
            right >>= 1;
        }

        return ans;
    }

    void add(int i, int extra) { // a[i] += extra
        assert(0 <= i && i < (s.size() >> 1));
        i += s.size() >> 1;
        s[i] += extra;
        assert(s[i] >= 0);

        while (i > 1) {
            i >>= 1;
            s[i] += extra;
        }
    }

    int getPos(int sum) const { // getPos(s) == i <=> this->sum(0, i) >= s && this->sum(0, i - 1) < s
        assert(1 <= sum && sum <= s[1]);

        int i = 1;

        while (i < (s.size() >> 1)) {
            int left = i << 1;

            if (s[left] >= sum) {
                i = left;
            } else {
                int right = left | 1;
                i = right;
                sum -= s[left];
            }
        }

        i -= s.size() >> 1;

        return i;
    }
};

int main() {
    int n;
    scanf("%d", &n);

    SegmentTree st(1 + 100'000);

    for (int i = 0; i < n; i++) {
        int cmd;
        scanf("%d", &cmd);

        if (cmd == 1) {
            int h;
            scanf("%d", &h);
            assert(1 <= h && h <= 100'000);
            st.add(h, 1);

            printf("%d\n", st.sum(h + 1, 100'000));
        } else {
            assert(cmd == 2);
            int pos;
            scanf("%d", &pos);

            int nPeople = st.sum(1, 100'000);
            assert(0 <= pos && pos < nPeople);
            int le = nPeople - pos; // кол-во человек с ростом <= заданного
            int h = st.getPos(le);

            st.add(h, -1);
        }
    }

    return 0;
}

/*
0   1   2   3   4   5
100
200 100
200 100 50
200 50
200 150 50

0 1 2 3 4 5 6 7 8 9
0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 1 0 0 0 0 | команда 1 5, ответ сумму 6-9
0 0 0 1 0 1 0 0 0 0 | команда 1 3, ответ сумму 4-9=1
0 0 0 1 0 1 0 1 0 0 | команда 1 7, ответ сумму 8-9=0
0 0 0 1 0 1 0 1 0 0 | команда 2 1, ответ сумму 8-9=0
*/

/*
 * footer-1232: {
 * font
 * image
 *
 * }
 * [parentId: ]
 */
