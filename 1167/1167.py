s = input()

ch = ''
pos = 0
EOS = '\n'

def nextChar():
    global ch, pos

    if pos < len(s):
        ch = s[pos]
        pos += 1
    else:
        ch = EOS

def formula():
    if ch == 'M':
        nextChar()
        assert ch == '('
        nextChar()

        v1 = formula()

        assert ch == ','
        nextChar()

        v2 = formula()

        assert ch == ')'
        nextChar()

        return max(v1, v2)
    elif ch == 'm':
        nextChar()
        assert ch == '('
        nextChar()

        v1 = formula()

        assert ch == ','
        nextChar()

        v2 = formula()

        assert ch == ')'
        nextChar()

        return min(v1, v2)
    else:
        assert '0' <= ch <= '9'
        v = ord(ch) - ord('0')
        nextChar()

        return v

nextChar()
v = formula()

assert ch == EOS
print(v)
