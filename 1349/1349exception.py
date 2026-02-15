'''
formula = cell '=' expr
expr = term {('+' | '-') term}
term = factor {('*' | '/') factor}
factor = int | cell | '(' expr ')'
int = '0' | '1'...'9'{'0'...'9'} 
cell = col row
col = 'A'...'Z'
row = '1'...'9'
'''

from collections import defaultdict

n = int(input())
cell_to_expr = defaultdict(lambda: '0')

for _ in range(n):
    s = input()
    eq = s.find('=')
    assert eq >= 0
    
    cell = s[:eq].strip()
    assert len(cell) == 2 and 'A' <= cell[0] <= 'Z' and '1' <= cell[1] <= '9'
    expr = s[eq + 1:].replace(' ', '')
    cell_to_expr[cell] = expr
    
NOT_COMPUTED = 0
COMPUTING = 1
COMPUTED = 2

cell_to_state = defaultdict(lambda: NOT_COMPUTED)
cell_to_value = {}

class CircularRefferenceError(Exception):
    pass

def get_cell_value(cell):
    # returns int or raises CircularRefferenceError

    if cell_to_state[cell] == COMPUTING:
        raise CircularRefferenceError(cell)
    
    if cell_to_state[cell] == COMPUTED:
        return cell_to_value[cell]
    
    assert cell_to_state[cell] == NOT_COMPUTED    
    cell_to_state[cell] = COMPUTING
    
    s = cell_to_expr[cell]
    ch = ''
    pos = 0
    EOS = '\n'
    
    def next_char():
        nonlocal ch, pos
        
        if pos < len(s):
            ch = s[pos]
            pos += 1
        else:
            ch = EOS
    
    def parse_int():
        # int = '0' | '1'...'9'{'0'...'9'}
        if ch == '0':
            next_char()
            return 0
        else:
            assert len(ch) == 1 and '1' <= ch <= '9'
            ans = ord(ch) - ord('0')
            next_char()
            
            while '0' <= ch <= '9':
                ans = ans * 10 + (ord(ch) - ord('0'))
                next_char()
            
            return ans

    def factor():
        # returns int or raises CircularRefferenceError
        # factor = int | cell | '(' expr ')'
        
        if '0' <= ch <= '9':
            return parse_int()
        
        elif 'A' <= ch <= 'Z':
            # cell = col row
            # col = 'A'...'Z'
            # row = '1'...'9'
            letter = ch
            next_char()
            
            assert '1' <= ch <= '9'
            digit = ch
            next_char()
            
            cell = letter + digit
            return get_cell_value(cell)
        else:
            assert ch == '('
            next_char()
            
            v = expr()

            assert ch == ')'
            next_char()
            
            return v
    
    def term():
        # returns int or raises CircularRefferenceError
        # term = factor {('*' | '/') factor}
        v = factor()
        
        while True:
            if ch == '*':
                next_char()
                v *= factor()
            elif ch == '/':
                next_char()
                v2 = factor()
                
                if v2 == 0:
                    v = 0
                else:
                    v //= v2
            else:
                return v
    
    def expr():
        # returns int or raises CircularRefferenceError
        # expr = term {('+' | '-') term}
        v = term()
        
        while True:
            if ch == '+':
                next_char()
                v += term()
            elif ch == '-':
                next_char()
                v -= term()
            else:
                return v
    
    next_char()
    cell_to_value[cell] = expr()
    assert ch == EOS
    
    cell_to_state[cell] = COMPUTED
    return cell_to_value[cell]
    
try:
    print(get_cell_value('A1'))
except CircularRefferenceError:
    print(1_000_000)
