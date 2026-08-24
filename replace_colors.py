import re

with open('src/app/MenuClient.tsx', 'r') as f:
    content = f.read()

# Replace text, bg, and border colors with Tailwind theme variables

# Mappings for Tailwind bracket classes
# e.g., text-[#8B4A27] -> text-primary
# bg-[#8B4A27]/10 -> bg-primary/10
# border-[#8B4A27]/5 -> border-primary/5

patterns = [
    (r'(text|bg|border|from|via|to|shadow|ring|fill|stroke)-\[#(?:8B4A27|8b4a27|834e2f|5A2E1B|5a2e1b|d4a574)\]', r'\1-primary'),
    (r'(text|bg|border|from|via|to|shadow|ring|fill|stroke)-\[#(?:f2e6d9|F2E6D9)\]', r'\1-background'),
    # for the very dark text color
    (r'(text|bg|border|from|via|to|shadow|ring|fill|stroke)-\[#(?:4a3b32)\]', r'\1-foreground'),
]

for pattern, replacement in patterns:
    content = re.sub(pattern, replacement, content)

# Check for any remaining style={{ color: '#... '}} inline styles (less common but possible)
content = re.sub(r'#8B4A27', 'var(--primary)', content, flags=re.IGNORECASE)
content = re.sub(r'#f2e6d9', 'var(--background)', content, flags=re.IGNORECASE)

with open('src/app/MenuClient.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
