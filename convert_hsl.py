import colorsys

def hex_to_hsl(hex_code):
    hex_code = hex_code.lstrip('#')
    r, g, b = tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
    h, l, s = colorsys.rgb_to_hls(r/255.0, g/255.0, b/255.0)
    return f"{round(h * 360)} {round(s * 100)}% {round(l * 100)}%"

palettes = [
    # Azure Dream
    ("azure-dream", "Azure Dream", "#E3F2FD", "#90CAF9", "#2196F3", "#0D47A1"),
    # Forest Fresh
    ("forest-fresh", "Forest Fresh", "#E8F5E9", "#A5D6A7", "#66BB6A", "#1B5E20"),
    # Sage & Honey
    ("sage-honey", "Sage & Honey", "#F7F4ED", "#C7D3C0", "#C8A96B", "#8FA28A"),
    # Berry Bloom
    ("berry-bloom", "Berry Bloom", "#F6D8BD", "#F39399", "#CF4173", "#5D3140"),
    # Forest Bistro
    ("forest-bistro", "Forest Bistro", "#F7EAE0", "#F9D2BA", "#5E3122", "#1D4533"),
    # Midnight Indigo (Dark)
    ("midnight-indigo", "Midnight Indigo", "#111844", "#4B5694", "#7288AE", "#EAE0CF"),
    # Black Coffee (Dark)
    ("black-coffee", "Black Coffee", "#000000", "#1F150C", "#412D15", "#E1DCC9"),
    
    # Existing ones
    ("warm-cafe", "Warm Cafe", "#f2e6d9", "#F3E2C9", "#d4a574", "#8B4A27"),
    ("dark-elegance", "Dark Elegance", "#1a1a1a", "#2a2a2a", "#d4af37", "#ffffff"),
    ("modern-minimal", "Modern Minimal", "#ffffff", "#f5f5f5", "#888888", "#2b2b2b")
]

print("const PREDEFINED_THEMES = [")
for p in palettes:
    print("  {")
    print(f"    id: '{p[0]}', name: '{p[1]}',")
    print(f"    bgColor: '{hex_to_hsl(p[2])}',")
    print(f"    secondaryColor: '{hex_to_hsl(p[3])}',")
    print(f"    accentColor: '{hex_to_hsl(p[4])}',")
    print(f"    primaryColor: '{hex_to_hsl(p[5])}',")
    # For text foreground, use primaryColor for light themes, and primaryColor for dark themes?
    # Actually, in Midnight Indigo (#111844 bg), the primary is #EAE0CF (light).
    # So primaryColor ALWAYS acts as the text color!
    print("    fontFamily: 'var(--font-sans)',")
    print("  },")
print("];")
