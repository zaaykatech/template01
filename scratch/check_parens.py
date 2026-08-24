import sys

def check_brackets(filename):
    with open(filename, 'r') as f:
        text = f.read()

    stack = []
    lines = text.split('\n')
    
    for r, line in enumerate(lines):
        for c, char in enumerate(line):
            if char in '({[':
                stack.append((char, r + 1, c + 1))
            elif char in ')}]':
                if not stack:
                    print(f"Unmatched {char} at line {r+1}:{c+1}")
                    return
                last = stack.pop()
                expected = {'(': ')', '{': '}', '[': ']'}[last[0]]
                if char != expected:
                    # Could be inside a string/comment. Let's just print it.
                    print(f"Mismatched bracket at line {r+1}:{c+1}, expected {expected}, found {char}")
                    stack.append(last) # put it back

    for unclosed in stack:
        print(f"Unclosed {unclosed[0]} at line {unclosed[1]}:{unclosed[2]}")

check_brackets('src/app/MenuClient.tsx')
