'''
poly = ['-'] mono {('+' | '-') mono}
mono = '0' | positive_int ['x' power] | 'x' power
power = ['^' positive_int]
positive_int = 1..9{0..9}
'''

def read_poly():
    s = input()
    ch = ' '
    pos = 0
    EOS = '\n'

    def next_char():
        nonlocal pos, ch

        if pos < len(s):
            ch = s[pos]
            pos += 1
        else:
            ch = EOS
    
    def positive_int():
        # positive_int = 1..9{0..9}
        assert '1' <= ch <= '9'
        
        n = ord(ch) - ord('0')
        next_char()

        while '0' <= ch <= '9':
            d = ord(ch) - ord('0')
            n = n * 10 + d
            next_char()
        
        return n
    
    def power():
        # power = ['^' positive_int]
        
        if ch == '^':
            next_char()
            return positive_int()
        else:
            return 1
            
    def mono():  # returns (coef, pow)
        # mono = '0' | positive_int ['x' power] | 'x' power
        
        if ch == '0':
            next_char()
            return (0, 0)
        elif '1' <= ch <= '9':
            coef = positive_int()
            
            if ch == 'x':
                next_char()
                p = power()
                return (coef, p)
            else:
                return (coef, 0)
        else:
            assert ch == 'x'
            next_char()
            p = power()
            return (1, p)
            
    def poly():  # returns array, coef[pow]
        # poly = ['-'] mono {('+' | '-') mono}
        
        coef = [0] * 11
        sign = 1
        
        if ch == '-':
            next_char()
            sign = -1
        
        while True:
            c, p = mono()
            coef[p] += c * sign

            if ch == '+':
                next_char()
                sign = 1
            elif ch == '-':
                next_char()
                sign = -1
            else:
                break
        
        return coef

    next_char()
    p = poly()
    assert ch == EOS
    
    return p
    
def print_poly(p):
    s = ''
    
    for i in range(len(p) - 1, -1, -1):
        if p[i] == 0:
            continue
        
        if p[i] < 0:
            s += '-'
        elif len(s) > 0:
            assert p[i] > 0
            s += '+'
        
        if i == 0:
            s += f'{abs(p[i])}'
        else:
            assert i > 0
            
            if abs(p[i]) > 1:
                s += f'{abs(p[i])}'
            
            s += 'x'
            
            if i > 1:
                s += f'^{i}'
    
    print('0' if len(s) == 0 else s)

def mul_poly(p1, p2):
    res = [0] * (len(p1) + len(p2) - 1)
    
    for i1 in range(len(p1)):
        for i2 in range(len(p2)):
            res[i1 + i2] += p1[i1] * p2[i2]

    return res

p1 = read_poly()
p2 = read_poly()
p = mul_poly(p1, p2)

print_poly(p)
