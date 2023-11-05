поиск в ширину:
поиск расстояний от одной вершины до всех остальных, если стоимость прохода по ребру одинаковая (невзвешенный граф)
- O(E + V)

алгоритм Дейкстры:
поиск расстояния от одной вершины до всех остальных во взвешенном графе с неотрицательными весами
- в плотном графе O(V ** 2)
- в разреженном графе O(E logV)

алгоритм Флойда-Уоршелла:
поиск расстояний между всеми парами вершин, веса ребер могут быть отрицательными
- O(V ** 3)

алгоритм Форда-Беллмана и его модификация с очередью - SPFA (shortest path faster algorithm):
поиск расстояния от одной вершины до всех остальных, веса ребер могут быть отрицательными
- O(V * E)