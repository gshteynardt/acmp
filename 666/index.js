/*
шаг 1 - 1 = 2^1 - 1;
шаг 2 - 1 + (шаг 1) * 2 = 1 + 1 * 2 = 3 = 2^2 - 1;
шаг 3 - 1 + (шаг 2) * 2 = 1 + 3 * 2 = 7 = 2^3 - 1;
шаг 4 - 1 + (шаг 3) * 2 = 1 + 7 * 2 = 15 = 2^4 - 1;

найти символ на позиции N = 10 в строке после шага 4
найти символ на позиции N = 2 в строке после шага 3
найти символ на позиции N = 1 в строке после шага 2 для первого символа шага ответ получается по кодам символов String.fromCharCode('a'.charCodeAt() - 1 + step)
dcbaabaacbaabaa
???????????????
d#######$$$$$$$
         ^
шаг 4 = d + (шаг 3 длины 7) + (шаг 3 длины 7);
шаг 3 = c + (шаг 2 длины 3) + (шаг 2 длины 3);

c###$$$
 ^
*/