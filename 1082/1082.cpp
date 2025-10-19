#include <cstdio>
#include <vector>

int main() {
    int sizeR, sizeC, nQ;
    scanf("%d %d %d", &sizeR, &sizeC, &nQ);

    std::vector<std::vector<long long>> sum(1 + sizeR, std::vector<long long>(1 + sizeC, 0));

    for (int r = 1; r <= sizeR; r++) {
        for (int c = 1; c <= sizeC; c++) {
            int v;
            scanf("%d", &v);

            sum[r][c] = sum[r - 1][c] + sum[r][c - 1] - sum[r - 1][c - 1] + v;
        }
    }

    for (int q = 0; q < nQ; q++) {
        int rMin, cMin, rMax, cMax;
        scanf("%d %d %d %d", &rMin, &cMin, &rMax, &cMax);

        long long res = sum[rMax][cMax] - sum[rMax][cMin - 1] - sum[rMin - 1][cMax] + sum[rMin - 1][cMin - 1];
        printf("%lld\n", res);
    }

    return 0;
}
