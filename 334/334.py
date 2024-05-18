'''
считаем: суммарное время перевода к заданному времени x
для каждой секунду полусуток считаем это значение
как получить ответ для 5:12:34, если известен ответ для 5:12:33?
для все часов с исходным значением не 5:12:34 это +1 секунда доводки
для часов с исходным значением 5:12:34 потребуется меньше на полный оборот без секунды
'''

n_watches = int(input())

watch_count = [0] * 13 * 60 * 60 # watch_count[(h * 60 + m) * 60 + s] - кол-во часов со временем h:m:s

for i in range(n_watches):
    h, m, s = map(int, input().split(':'))
    watch_count[(h * 60 + m) * 60 + s] += 1

sum_diff = 0

'''
сейчас считаем суммарное время перевода до 1:00:00
'''

for s in range(1 * 60 * 60 + 1, 13 * 60 * 60):
    sum_diff += (13 * 60 * 60 - s) * watch_count[s]

best_diff = sum_diff
best_time = 1 * 60 * 60

for s in range(1 * 60 * 60 + 1, 13 * 60 * 60): #  s - время в которое переводим
    sum_diff += n_watches # все часы перевели на 1 секунду
    sum_diff -= watch_count[s] * 12 * 60 * 60 # убираем полные обороты

    if sum_diff < best_diff:
        best_diff = sum_diff
        best_time = s

print('%d:%02d:%02d'%(best_time // 60 // 60, best_time // 60 % 60, best_time % 60))
# print(f'{best_time // 60 // 60}:{best_time // 60 % 60:02d}:{best_time % 60:02d}')

'''
3
8:19:16
2:05:11
12:50:07
'''
