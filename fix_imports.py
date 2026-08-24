with open('src/lib/firebase/menuService.ts', 'r') as f:
    content = f.read()

content = content.replace("import { ThemeConfig, DeepPartial } from '../themes/themeTypes';\n", "")
content = "import { ThemeConfig, DeepPartial } from '../themes/themeTypes';\n" + content

with open('src/lib/firebase/menuService.ts', 'w') as f:
    f.write(content)
