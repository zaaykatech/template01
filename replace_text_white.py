import re

with open('src/app/MenuClient.tsx', 'r') as f:
    content = f.read()

# Replace text-white with text-background
content = re.sub(r'text-white\b', 'text-background', content)

with open('src/app/MenuClient.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
