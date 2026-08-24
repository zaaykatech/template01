import { ThemeConfig, DeepPartial } from './themeTypes';
import { PREDEFINED_THEMES } from './predefinedThemes';

/**
 * Converts a HEX color to an HSL channel string (e.g., "0 0% 100%")
 * suitable for Tailwind CSS variables with opacity support.
 */
export function hexToHSLChannel(hex: string): string {
  // Remove hash if present
  hex = hex.replace(/^#/, '');

  // Parse r, g, b values
  let r = 0, g = 0, b = 0;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  // Convert to values between 0 and 1
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hDegrees = Math.round(h * 360);
  const sPercent = Math.round(s * 100);
  const lPercent = Math.round(l * 100);

  return `${hDegrees} ${sPercent}% ${lPercent}%`;
}

/**
 * Deep merge utility for custom themes
 */
function isObject(item: any) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

/**
 * Resolves a full ThemeConfig from RestaurantSettings.
 * Handles legacy configurations, missing themes, and custom overrides.
 */
export function resolveTheme(settings: any): ThemeConfig {
  const defaultTheme = PREDEFINED_THEMES[0]; // Warm Artisan default

  // Support legacy settings
  if (!settings.activeThemeId && settings.primaryColor) {
    return {
      ...defaultTheme,
      id: 'legacy-migrated',
      name: 'Legacy Custom',
      colors: {
        ...defaultTheme.colors,
        primary: settings.primaryColor || defaultTheme.colors.primary,
        secondary: settings.secondaryColor || defaultTheme.colors.secondary,
        accent: settings.accentColor || defaultTheme.colors.accent,
        background: settings.bgColor || defaultTheme.colors.background,
        // map old text colors if possible, else default
      },
      typography: {
        ...defaultTheme.typography,
        body: settings.fontFamily?.replace('var(--font-', '').replace(')', '') || 'inter'
      }
    };
  }

  const baseTheme = PREDEFINED_THEMES.find(t => t.id === settings.activeThemeId) || defaultTheme;

  if (settings.customTheme) {
    // Return deep merged theme
    return mergeDeep({}, baseTheme, settings.customTheme);
  }

  return baseTheme;
}

/**
 * Applies a ThemeConfig to the given HTML element (typically document.documentElement).
 */
export function applyTheme(theme: ThemeConfig, rootElement: HTMLElement) {
  // Apply colors as HSL channels for Tailwind opacity compatibility
  Object.entries(theme.colors).forEach(([key, hexValue]) => {
    const cssVarName = `--color-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
    const hslValue = hexToHSLChannel(hexValue as string);
    rootElement.style.setProperty(cssVarName, hslValue);
  });

  // Apply typography
  rootElement.style.setProperty('--font-heading', `var(--font-${theme.typography.heading})`);
  rootElement.style.setProperty('--font-body', `var(--font-${theme.typography.body})`);

  // Apply radius
  Object.entries(theme.radius).forEach(([key, value]) => {
    rootElement.style.setProperty(`--radius-${key}`, value as string);
  });

  // Apply shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    rootElement.style.setProperty(`--shadow-${key}`, value as string);
  });

  // Apply spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    rootElement.style.setProperty(`--spacing-${key}`, value as string);
  });
}
