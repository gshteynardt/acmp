#include <cstdio>
#include <vector>

class SegmentTree {
private:

    std::vector<int> s;

public:

    SegmentTree(int n) : s(n << 1, 0){}

    int sum(int left, int right) const { // 0 <= left <= right < n, returns sum of [left, right] inclusive
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

    void add(int i, int extra) {
        i += s.size() >> 1;
        s[i] += extra;

        while (i > 1) {
            i >>= 1;
            s[i] += extra;
        }
    }
};

int main() {
    int n, nRows;
    scanf("%d %d", &n, &nRows);

    int ans = 0;

    for (int r = 0; r < nRows; r++) {
        SegmentTree st(1 + n);

        for (int i = 0; i < n; i++) {
            int h;
            scanf("%d", &h);

            ans += st.sum(h + 1, n);
            st.add(h, 1);
        }
    }

    printf("%d\n", ans);

    return 0;
}
