'''
<формула> ::= <число> <последовательность> {"+" <число> <последовательность>}
<последовательность> ::= <часть> <число> {<часть> <число>}
<часть> ::= <химический элемент> | "(" <последовательность> ")"
<химический элемент> ::= <прописная буква> [<строчная буква>]
<прописная буква> ::= "A".."Z"
<строчная буква> ::= "a".."z"
<число> ::= ["1".."9" {"0".."9"}]
'''

from collections import Counter

def readFormula():
    s = input()
    ch = ''
    pos = 0
    EOS = '\n'  # end of string

    def nextChar():
        nonlocal ch, pos

        if pos < len(s):
            ch = s[pos]
            pos += 1
        else:
            ch = EOS

    # <число> ::= ["1".."9" {"0".."9"}]
    def number():
        if len(ch) == 1 and '1' <= ch <= '9':
            num = ord(ch) - ord('0')
            nextChar()

            while '0' <= ch <= '9':
                num = num * 10 + (ord(ch) - ord('0'))
                assert num <= 10_000
                nextChar()

            return num
        else:
            return 1

    # <химический элемент> ::= <прописная буква> [<строчная буква>]
    # <прописная буква> ::= "A".."Z"
    # <строчная буква> ::= "a".."z"
    def chemElem():
        assert len(ch) == 1
        assert 'A' <= ch <= 'Z'

        elem = ch
        nextChar()

        if 'a' <= ch <= 'z':
            elem += ch
            nextChar()

        return elem

    # <часть> ::= <химический элемент> | "(" <последовательность> ")"
    def part():
        if ch == '(':
            nextChar()
            cnt = seq()

            assert ch == ')'
            nextChar()
            return cnt
        else:
            elem = chemElem()
            return Counter({ elem: 1 })

    def mul(cnt, num):
        for key in cnt:
            cnt[key] *= num

    # <последовательность> ::= <часть> <число> {<часть> <число>}
    def seq():
        cnt = part()
        num = number()
        mul(cnt, num)

        while ch == '(' or 'A' <= ch <= 'Z':
            cnt2 = part()
            num2 = number()
            mul(cnt2, num2)

            cnt += cnt2

        return cnt

    # <формула> ::= <число> <последовательность> {"+" <число> <последовательность>}
    def formula():
        num = number()
        cnt = seq()
        mul(cnt, num)

        while ch == '+':
            nextChar()
            num2 = number()
            cnt2 = seq()
            mul(cnt2, num2)

            cnt += cnt2

        return cnt

    nextChar()
    cnt = formula()

    assert ch == EOS

    return (s, cnt)

leftS, leftCnt = readFormula()
n = int(input())

for _ in range(n):
    rightS, rightCnt = readFormula()

    if leftCnt == rightCnt:
        print(leftS + '==' + rightS)
    else:
        print(leftS + '!=' + rightS)
