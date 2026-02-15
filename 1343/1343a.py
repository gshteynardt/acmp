import sys

'''
<Программа>     ::= "BEGIN" <Список операторов> "END"
<Список операторов> ::= <Оператор> {<Оператор>}
<Оператор>      ::= <Оператор LOOP> | <Оператор OP>
<Оператор LOOP> ::= "LOOP" (<число> | n) <Список операторов> "END"
<Оператор OP>   ::= "OP" <число>
'''

ch = ' '
pos = 0
CH_EOT = ''
s = sys.stdin.read()

def next_char():
    global pos, ch

    if pos < len(s):
        ch = s[pos]
        pos += 1
    else:
        ch = CH_EOT

def skip_ch(need):
    assert ch == need
    next_char()

LEX_BEGIN = 'BEGIN'
LEX_END = 'END'
LEX_LOOP = 'LOOP'
LEX_OP = 'OP'
LEX_N = 'n'
LEX_EOT = ''
LEX_NUM = 'int'
num = 0
lex = LEX_EOT

def next_lex():
    global lex

    while len(ch) == 1 and ch in ' \n\r':
        next_char()

    if ch == 'B':
        skip_ch('B')
        skip_ch('E')
        skip_ch('G')
        skip_ch('I')
        skip_ch('N')

        lex = LEX_BEGIN
    elif ch == 'E':
        skip_ch('E')
        skip_ch('N')
        skip_ch('D')

        lex = LEX_END
    elif ch == 'L':
        skip_ch('L')
        skip_ch('O')
        skip_ch('O')
        skip_ch('P')

        lex = LEX_LOOP
    elif ch == 'O':
        skip_ch('O')
        skip_ch('P')

        lex = LEX_OP
    elif ch == 'n':
        next_char()

        lex = LEX_N
    elif ch == CH_EOT:
        lex = LEX_EOT
    else:
        assert len(ch) == 1 and '0' <= ch <= '9'
        global num

        num = ord(ch) - ord('0')
        next_char()

        while len(ch) == 1 and '0' <= ch <= '9':
            num *= 10
            num += ord(ch) - ord('0')
            next_char()

        lex = LEX_NUM

def skip_lex(exp):
    assert lex == exp
    next_lex()

def parse_op():
    # "OP" <число>
    skip_lex(LEX_OP)
    time = num
    skip_lex(LEX_NUM)

    return [time]

def parse_statement():
    if lex == LEX_OP:
        return parse_op()
    else:
        return parse_loop()

def parse_statement_list():
    # <Оператор> {<Оператор>}
    poly = parse_statement()

    while lex in (LEX_OP, LEX_LOOP):
        poly = poly_add(poly, parse_statement())

    return poly

def parse_loop():
    # "LOOP" (<число> | n) <Список операторов> "END"
    skip_lex(LEX_LOOP)

    if lex == LEX_N:
        mul = None  # означает умножение на n
        next_lex()
    else:
        mul = num
        skip_lex(LEX_NUM)

    poly = parse_statement_list()
    skip_lex(LEX_END)

    if mul is None:
        return poly_num_n(poly)
    else:
        return poly_mul_const(poly, mul)

def poly_add(p1, p2):
    res = [0] * max(len(p1), len(p2))

    for i, c in enumerate(p1):
        res[i] += c

    for i, c in enumerate(p2):
        res[i] += c

    return res

def poly_num_n(p):
    # умножение на n (сдвиг коэффициентов)
    return [0] + p

def poly_mul_const(p, c):
    # умножение на константу
   return [coef * c for coef in p]

def parse_program():
    # "BEGIN" <Список операторов> "END"
    skip_lex(LEX_BEGIN)
    poly = parse_statement_list()
    skip_lex(LEX_END)

    return poly

def poly_to_str(p):
    s = ''
    
    for i in range(len(p) - 1, -1, -1):
        if p[i] == 0:
            continue
        
        assert p[i] > 0

        if len(s) > 0:
            s += '+'

        if i == 0:
            s += str(p[i])
        else:  
            assert i > 0

            if p[i] > 1:
                s += f'{p[i]}*'

            s += 'n'
        
            if i > 1:
                s+= f'^{i}'

    return s if s != '' else '0'

next_char()
next_lex()

k = num
skip_lex(LEX_NUM)

for i in range(k):
    poly = parse_program()
    print(f'Program #{i+1}')
    print(f'Runtime = {poly_to_str(poly)}')
    print()

'''
2
BEGIN
  LOOP n
    OP 4
    LOOP 3
      LOOP n
        OP 1
      END
      OP 2
    END
    OP 1
  END
  OP 17
END

BEGIN
 OP 1997 LOOP n LOOP n OP 1 END END
END
'''
