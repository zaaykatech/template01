import fs from 'fs';
import path from 'path';
import { MenuSection } from '@/types';
import { ThemeConfig } from './themes/themeTypes';
import { PREDEFINED_THEMES } from './themes/predefinedThemes';

export function getMenu(): { categories: MenuSection[] } {
  try {
    const filePath = path.join(process.cwd(), 'content', 'menu.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading menu.json:', error);
    return { categories: [] };
  }
}

export function getTheme(): ThemeConfig {
  try {
    const filePath = path.join(process.cwd(), 'content', 'theme.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContents) as ThemeConfig;
    
    if (parsed.name && parsed.name !== 'Custom') {
      const predefined = PREDEFINED_THEMES.find(t => t.name === parsed.name);
      if (predefined) {
        return {
          ...parsed,
          colors: predefined.colors,
          typography: predefined.typography,
          radius: predefined.radius,
          shadows: predefined.shadows,
          spacing: predefined.spacing,
          components: predefined.components
        };
      }
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading theme.json, falling back to default theme:', error);
    return PREDEFINED_THEMES[0];
  }
}
