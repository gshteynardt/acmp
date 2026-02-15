'''
formula = spaces cell spaces "=" expr
expr = spaces term spaces {(+ | -) spaces term spaces}
term = spaces factor spaces {(* | /) spaces factor spaces}
factor = int | cell | "(" expr ")"
int = 0 | 1...9{0...9}
cell = col row
col = A...Z
row = 1...9
spaces = {' '}
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
    expr = s[eq + 1:]
    cell_to_expr[cell] = expr

NOT_COMPUTED = 0
COMPUTING = 1
COMPUTED = 2
CIRCULAR = 3
cell_to_state = defaultdict(lambda: NOT_COMPUTED)
cell_to_value = defaultdict()

def compute(cell):
    # returns int result or None in case of circular reference
    if cell_to_state[cell] == CIRCULAR:
        return None
    
    if cell_to_state[cell] == COMPUTING:
        cell_to_state[cell] = CIRCULAR
        return None
    
    if cell_to_state[cell] == COMPUTED:
        return cell_to_value[cell]
    
    assert cell_to_state[cell] == NOT_COMPUTED
    cell_to_state[cell] = COMPUTING
    
    s = cell_to_expr[cell]
    pos = 0
    ch = ' '
    EOS = '\n'  # end of string
    
    def next_char():
        nonlocal ch, pos

        if pos < len(s):
            ch = s[pos]
            pos += 1
        else:
            ch = EOS

    def parse_int():
        #  int = 0 | 1...9{0...9}
        if ch == '0':
            next_char()
            return 0
        else:
            assert '1' <= ch <= '9'
            ans = ord(ch) - ord('0')
            next_char()
            
            while '0' <= ch <= '9':
                ans = ans * 10 + (ord(ch) - ord('0'))
                next_char()
            
            return ans
    
    
    def factor():
        # returns int result or None in case of circular reference
        # factor = int | cell | "(" expr ")"
        if '0' <= ch <= '9':
            return parse_int()
        elif 'A' <= ch <= 'Z':
            letter = ch
            next_char()

            assert '1' <= ch <= '9'

            digit = ch
            next_char()

            cell = letter + digit
            return compute(cell)
        else:
            assert ch == '('
            next_char()
            
            v = expr()
            
            assert ch == ')'
            next_char()
            
            return v

    def spaces():
        while ch == ' ':
            next_char()

    def term():
        # returns int result or None in case of circular reference
        # term = spaces factor spaces {(* | /) spaces factor spaces}
        spaces()
        v = factor()
        spaces()
        
        while ch in ('*', '/'):
            op = ch
            next_char()
            spaces()
            v2 = factor()
            spaces()
            
            if v is None or v2 is None:
                v = None
            elif op == '*':
                v *= v2
            else:
                assert op == '/'
               
                if v2 == 0:
                    v = 0
                else:
                    v //= v2 
        
        return v
    
    def expr():
        # returns int result or None in case of circular reference
        # expr = spaces term spaces {(+ | -) spaces term spaces}
        spaces()
        v = term()
        spaces()
        
        while ch in ('+', '-'):
            op = ch
            next_char()
            spaces()
            v2 = term()
            spaces()
            
            if v is None or v2 is None:
                v = None
            elif op == '+':
                v += v2
            else:
                assert op == '-'
                
                v -= v2 
        
        return v
    
    next_char()
    v = expr()
    assert ch == EOS
    
    if v is None:
        cell_to_state[cell] = CIRCULAR
    else:
        assert cell_to_state[cell] == COMPUTING
        cell_to_state[cell] = COMPUTED
        cell_to_value[cell] = v
    
    return v

ans = compute('A1')

if ans is None:
    print(1_000_000)
else:
    print(ans)
