'''
<Программа> = "BEGIN" <Список операторов> "END"
<Список операторов> = <Оператор> { <Оператор> }
<Оператор> = "OP" <Число> | "LOOP" (<Число> | "n") <Список операторов> "END"
<Число> = 0 | 1...9 {0...9}
'''

'''
    while time() < need_time:
        # пример, когда логика требует 0 операторов, а язык 1 или более
        pass
'''


import itertools
import sys


ch = ' '
pos = 0
CH_EOT = ''  # end of text
text = sys.stdin.read()


def next_char():
    global ch, pos

    if pos < len(text):
        ch = text[pos]
        pos += 1
    else:
        ch = CH_EOT


def skip_char(need):
    assert ch == need
    next_char()


LEX_BEGIN = 'BEGIN'  # можно и эффективнее 1-2-3, но мы будем использовать строчки для упрощения отладки
LEX_END = 'END'
LEX_OP = 'OP'
LEX_LOOP = 'LOOP'
LEX_N = 'n'
LEX_NUM = 'int'
LEX_EOT = 'end of text'
LEX_NONE = 'None'

lex = LEX_NONE
num = 0


def next_lex():
    global lex
    
    while ch in ('\r', '\n', ' '):
        next_char()
    
    if ch == 'B':
        skip_char('B')
        skip_char('E')
        skip_char('G')
        skip_char('I')
        skip_char('N')
        
        lex = LEX_BEGIN

    elif ch == 'E':
        skip_char('E')
        skip_char('N')
        skip_char('D')
        
        lex = LEX_END

    elif ch == 'O':
        skip_char('O')
        skip_char('P')
        
        lex = LEX_OP

    elif ch == 'L':
        skip_char('L')
        skip_char('O')
        skip_char('O')
        skip_char('P')
        
        lex = LEX_LOOP

    elif ch == 'n':
        skip_char('n')
        
        lex = LEX_N
    elif ch == CH_EOT:
        lex = LEX_EOT
    else:
        assert len(ch) == 1 and '0' <= ch <= '9'
        lex = LEX_NUM

        # <Число> = 0 | 1...9 {0...9}
        global num

        if ch == '0':
            num = 0
            next_char()
        else:
            num = ord(ch) - ord('0')
            next_char()
            
            while len(ch) == 1 and '0' <= ch <= '9':
                num = num * 10 + (ord(ch) - ord('0'))
                next_char()


def skip_lex(need):
    assert lex == need
    next_lex()


def statement():
    # returns polynomial coefficients
    # <Оператор> = "OP" <Число> | "LOOP" (<Число> | "n") <Список операторов> "END"
    if lex == LEX_OP:
        next_lex()
        assert lex == LEX_NUM
        x = num
        next_lex()

        return [x]
    else:
        skip_lex(LEX_LOOP)
        
        if lex == LEX_NUM:
            mul = num
            next_lex()
        else:
            mul = None
            skip_lex(LEX_N)
        
        poly = statement_list()
        skip_lex(LEX_END)
        
        if mul is None:
            return [0] + poly
        else:
            return [coef * mul for coef in poly]


def statement_list():
    # <Список операторов> = <Оператор> { <Оператор> }
    poly = statement()
    
    while lex in (LEX_OP, LEX_LOOP):
        poly2 = statement()
        poly = [coef1 + coef2 for coef1, coef2 in itertools.zip_longest(poly, poly2, fillvalue=0)]
    
    return poly


def program():
    # <Программа> = "BEGIN" <Список операторов> "END"
    skip_lex(LEX_BEGIN)
    poly = statement_list()
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
                s += f'^{i}'
        
    return s if len(s) > 0 else '0'

next_char()
next_lex()

assert lex == LEX_NUM
k = num
next_lex()

for i in range(1, k + 1):
    poly = program()
    print(f'Program #{i}')
    print(f'Runtime = {poly_to_str(poly)}')
    print()

assert lex == LEX_EOT
