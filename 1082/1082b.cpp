#include <iostream>
#include <vector>

int main() {
    std::ios_base::sync_with_stdio(false);
    std::cin.tie(nullptr);

    int sizeR, sizeC, nQ;
    std::cin >> sizeR >> sizeC >> nQ;

    std::vector<std::vector<long long>> sum(1 + sizeR, std::vector<long long>(1 + sizeC, 0));

    for (int r = 1; r <= sizeR; r++) {
        for (int c = 1; c <= sizeC; c++) {
            int v;
            std::cin >> v;

            sum[r][c] = sum[r - 1][c] + sum[r][c - 1] - sum[r - 1][c - 1] + v;
        }
    }

    for (int q = 0; q < nQ; q++) {
        int rMin, cMin, rMax, cMax;
        std::cin >> rMin >> cMin >> rMax >> cMax;

        long long res = sum[rMax][cMax] - sum[rMax][cMin - 1] - sum[rMin - 1][cMax] + sum[rMin - 1][cMin - 1];
        std::cout << res << '\n';
    }

    return 0;
}
