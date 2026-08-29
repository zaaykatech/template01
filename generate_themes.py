import json

themes = [
    {
        "id": "cappuccino",
        "name": "Cappuccino",
        "description": "The classic, original cozy cafe theme.",
        "colors": {
            "background": "#F5E6D3",
            "surface": "#FFFEFB",
            "primary": "#6B3A20",
            "secondary": "#E8D8C8",
            "accent": "#D4A373",
            "text": "#4A2C18",
            "muted": "#8B6D55",
            "border": "#D8C8B8"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.375rem", "medium": "0.75rem", "large": "1rem" },
        "shadows": { "card": "0 4px 6px -1px rgba(0, 0, 0, 0.05)", "floating": "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "rounded", "categoryStyle": "pill", "headingStyle": "serif", "imageStyle": "rounded" }
    },
    {
        "id": "warm-artisan",
        "name": "Warm Artisan",
        "description": "Warm cream tones with handcrafted terracotta accents.",
        "colors": {
            "background": "#F5EBDD",
            "surface": "#FFF8ED",
            "primary": "#914C2B",
            "secondary": "#C98F63",
            "accent": "#B86B3D",
            "text": "#663B28",
            "muted": "#A99584",
            "border": "#E2CDB8"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.375rem", "medium": "0.75rem", "large": "1rem" },
        "shadows": { "card": "0 4px 6px -1px rgba(0, 0, 0, 0.05)", "floating": "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "pill", "categoryStyle": "pill", "headingStyle": "serif", "imageStyle": "organic" }
    },
    {
        "id": "dark-coffee-luxury",
        "name": "Dark Coffee Luxury",
        "description": "High-end specialty coffee bar with deep espresso and gold.",
        "colors": {
            "background": "#120D09",
            "surface": "#1D1510",
            "primary": "#C77A32",
            "secondary": "#9E5E21", 
            "accent": "#E4A64A",
            "text": "#FFF3DD",
            "muted": "#B9A58E",
            "border": "#5B3A20"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.25rem", "medium": "0.5rem", "large": "0.75rem" },
        "shadows": { "card": "0 2px 4px rgba(0,0,0,0.2)", "floating": "0 8px 16px rgba(0,0,0,0.4)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "flat", "buttonStyle": "rounded", "categoryStyle": "underline", "headingStyle": "serif", "imageStyle": "rounded" }
    },
    {
        "id": "botanical",
        "name": "Botanical",
        "description": "Organic café with sage and cream botanical accents.",
        "colors": {
            "background": "#F1F3E8",
            "surface": "#FAFBF4",
            "primary": "#426B45",
            "secondary": "#718C62",
            "accent": "#A7B88A",
            "text": "#29452E",
            "muted": "#8B9880",
            "border": "#D5DDC9"
        },
        "typography": { "heading": "inter", "body": "inter" },
        "radius": { "small": "0.5rem", "medium": "1rem", "large": "1.5rem" },
        "shadows": { "card": "0 2px 8px rgba(66, 107, 69, 0.05)", "floating": "0 10px 20px rgba(66, 107, 69, 0.1)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "2rem", "lg": "3rem", "xl": "4rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "pill", "categoryStyle": "pill", "headingStyle": "sans", "imageStyle": "organic" }
    },
    {
        "id": "minimal-editorial",
        "name": "Minimal Editorial",
        "description": "Luxury modern restaurant with editorial whitespace.",
        "colors": {
            "background": "#FBF9F4",
            "surface": "#FFFFFF",
            "primary": "#1D1D1B",
            "secondary": "#66635D",
            "accent": "#B07A32",
            "text": "#242321",
            "muted": "#96928A",
            "border": "#DDD9D0"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0", "medium": "0", "large": "0" },
        "shadows": { "card": "none", "floating": "0 10px 30px rgba(0,0,0,0.05)" },
        "spacing": { "xs": "0.75rem", "sm": "1.5rem", "md": "3rem", "lg": "4rem", "xl": "6rem" },
        "components": { "cardStyle": "outlined", "buttonStyle": "square", "categoryStyle": "minimal", "headingStyle": "serif", "imageStyle": "square" }
    },
    {
        "id": "terracotta-mediterranean",
        "name": "Terracotta Mediterranean",
        "description": "Sunny, welcoming Mediterranean brunch café.",
        "colors": {
            "background": "#F6E8D5",
            "surface": "#FFF5E8",
            "primary": "#B85C38",
            "secondary": "#D98B62",
            "accent": "#D5A249",
            "text": "#713A28",
            "muted": "#A48775",
            "border": "#E4C9B1"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.5rem", "medium": "1rem", "large": "1.5rem" },
        "shadows": { "card": "0 4px 12px rgba(184, 92, 56, 0.08)", "floating": "0 12px 24px rgba(184, 92, 56, 0.15)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2.5rem", "xl": "3.5rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "pill", "categoryStyle": "pill", "headingStyle": "serif", "imageStyle": "organic" }
    },
    {
        "id": "midnight-blue",
        "name": "Midnight Blue",
        "description": "Modern urban café with deep navy and subtle accents.",
        "colors": {
            "background": "#071522",
            "surface": "#0D2233",
            "primary": "#2E8BCB",
            "secondary": "#1A5C8A",
            "accent": "#73C7FF",
            "text": "#F4F8FB",
            "muted": "#91A8B8",
            "border": "#1E4966"
        },
        "typography": { "heading": "inter", "body": "inter" },
        "radius": { "small": "0.5rem", "medium": "0.75rem", "large": "1.25rem" },
        "shadows": { "card": "0 4px 6px rgba(0,0,0,0.3)", "floating": "0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(46, 139, 203, 0.1)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "glass", "buttonStyle": "rounded", "categoryStyle": "pill", "headingStyle": "sans", "imageStyle": "rounded" }
    },
    {
        "id": "cream-orange",
        "name": "Cream & Orange",
        "description": "Youthful, energetic bakery with bright orange accents.",
        "colors": {
            "background": "#FFF5E5",
            "surface": "#FFFDF8",
            "primary": "#E77A00",
            "secondary": "#F2A23A",
            "accent": "#FFC76A",
            "text": "#713B16",
            "muted": "#A98F76",
            "border": "#F0C98E"
        },
        "typography": { "heading": "inter", "body": "inter" },
        "radius": { "small": "0.75rem", "medium": "1.25rem", "large": "2rem" },
        "shadows": { "card": "0 4px 15px rgba(231, 122, 0, 0.08)", "floating": "0 12px 30px rgba(231, 122, 0, 0.15)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2.5rem", "xl": "3.5rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "pill", "categoryStyle": "pill", "headingStyle": "sans", "imageStyle": "organic" }
    },
    {
        "id": "pure-monochrome",
        "name": "Pure Monochrome",
        "description": "Ultra-minimal premium restaurant in black and white.",
        "colors": {
            "background": "#FFFFFF",
            "surface": "#FAFAFA",
            "primary": "#000000",
            "secondary": "#333333",
            "accent": "#666666",
            "text": "#111111",
            "muted": "#777777",
            "border": "#D8D8D8"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0", "medium": "0", "large": "0" },
        "shadows": { "card": "none", "floating": "0 10px 30px rgba(0,0,0,0.1)" },
        "spacing": { "xs": "1rem", "sm": "2rem", "md": "3rem", "lg": "4rem", "xl": "5rem" },
        "components": { "cardStyle": "flat", "buttonStyle": "square", "categoryStyle": "pill", "headingStyle": "serif", "imageStyle": "square" }
    },
    {
        "id": "soft-blush",
        "name": "Soft Blush",
        "description": "Elegant boutique bakery in rose and coral.",
        "colors": {
            "background": "#FFF1F0",
            "surface": "#FFF9F8",
            "primary": "#C95F61",
            "secondary": "#E48A8C",
            "accent": "#F0B6B2",
            "text": "#733B3C",
            "muted": "#AA8585",
            "border": "#EBC8C5"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.5rem", "medium": "1rem", "large": "1.5rem" },
        "shadows": { "card": "0 4px 12px rgba(201, 95, 97, 0.05)", "floating": "0 12px 25px rgba(201, 95, 97, 0.12)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "soft", "buttonStyle": "rounded", "categoryStyle": "underline", "headingStyle": "script", "imageStyle": "rounded" }
    },
    {
        "id": "forest-gold",
        "name": "Forest & Gold",
        "description": "Exclusive luxury dining in deep forest green and champagne.",
        "colors": {
            "background": "#071C16",
            "surface": "#0D2B22",
            "primary": "#C8A24A",
            "secondary": "#D8BB68",
            "accent": "#7E9D69",
            "text": "#F7F0DC",
            "muted": "#A9B6A5",
            "border": "#536D59"
        },
        "typography": { "heading": "playfair", "body": "inter" },
        "radius": { "small": "0.25rem", "medium": "0.5rem", "large": "0.75rem" },
        "shadows": { "card": "0 4px 10px rgba(0,0,0,0.4)", "floating": "0 10px 30px rgba(0,0,0,0.6)" },
        "spacing": { "xs": "0.5rem", "sm": "1rem", "md": "1.5rem", "lg": "2rem", "xl": "3rem" },
        "components": { "cardStyle": "outlined", "buttonStyle": "rounded", "categoryStyle": "minimal", "headingStyle": "serif", "imageStyle": "rounded" }
    }
]

js_content = f"import {{ ThemeConfig }} from './themeTypes';\n\nexport const PREDEFINED_THEMES: ThemeConfig[] = {json.dumps(themes, indent=2)};"

with open('src/lib/themes/predefinedThemes.ts', 'w') as f:
    f.write(js_content)
