import re

with open('src/app/MenuClient.tsx', 'r') as f:
    content = f.read()

# Replace bg-white in card backgrounds with bg-secondary
# We can just replace all "bg-white" with "bg-secondary" except where it's for text or borders (which wouldn't be bg-white).
# Wait, some places use bg-white/40 or bg-white/25, we should preserve the opacity but use secondary.
# Wait, `bg-white/10` -> `bg-secondary/10`
content = re.sub(r'bg-white\b', 'bg-secondary', content)

with open('src/app/MenuClient.tsx', 'w') as f:
    f.write(content)

print("Replacement complete.")
