import fs from 'fs';
import path from 'path';
import { MenuSection } from '@/types';
import { ThemeConfig } from './themes/themeTypes';
import { PREDEFINED_THEMES } from './themes/predefinedThemes';
import { resolveTheme } from './themes/themeUtils';

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
    const rawSettings = JSON.parse(fileContents);
    return resolveTheme(rawSettings);
  } catch (error) {
    console.error('Error reading theme.json, falling back to default theme:', error);
    return PREDEFINED_THEMES[0];
  }
}
