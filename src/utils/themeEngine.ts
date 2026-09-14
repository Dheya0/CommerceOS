import type { CSSProperties } from 'react';
import { 
  BaseColorPalette, 
  BasePaletteHarmonyMode, 
  BusinessType, 
  ButtonVariantStyle, 
  CardVariantStyle, 
  DesignTokens, 
  FontFamily, 
  RadiusPreset, 
  StoreTheme, 
  ThemeLayout, 
  ThemeStyle 
} from '../types';

// Convert hex to RGB components
export function hexToRGB(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  return {
    r: parseInt(cleanHex.substring(0, 2), 16) || 0,
    g: parseInt(cleanHex.substring(2, 4), 16) || 0,
    b: parseInt(cleanHex.substring(4, 6), 16) || 0
  };
}

// Convert hex to HSL and adjust
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRGB(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  const hNorm = (h % 360 + 360) % 360;
  const sNorm = Math.max(0, Math.min(100, s)) / 100;
  const lNorm = Math.max(0, Math.min(100, l)) / 100;

  const k = (n: number) => (n + hNorm / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
}

// Relative luminance calculation for WCAG contrast
export function getRelativeLuminance(hex: string): number {
  const { r, g, b } = hexToRGB(hex);
  const sRGB = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// Calculate contrast ratio between two hex colors (1:1 to 21:1)
export function calculateContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getRelativeLuminance(hex1);
  const lum2 = getRelativeLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 10) / 10;
}

// Generate complete Design Token System from primary color & style
export function generateDesignTokens(
  primaryHex: string, 
  style: ThemeStyle = 'modern', 
  isDark = false,
  overrides?: Partial<DesignTokens>
): DesignTokens {
  const { h, s, l } = hexToHSL(primaryHex);

  const primary = primaryHex.toUpperCase();
  const primaryHover = hslToHex(h, s, Math.max(10, l - 8));
  const primaryLight = hslToHex(h, Math.min(100, s + 10), Math.min(95, l + 28));
  const primaryDark = hslToHex(h, s, Math.max(5, l - 24));
  const primaryGlow = `${primary}40`;

  // Complementary or harmonious accent
  const accentH = (h + 38) % 360;
  const accent = hslToHex(accentH, Math.min(92, s + 15), 52);
  const accentGlow = `${accent}35`;
  const accentText = isDark ? '#FFFFFF' : '#0F172A';

  // Secondary tone
  const secondaryH = (h + 180) % 360;
  const secondary = hslToHex(secondaryH, Math.max(20, s - 25), isDark ? 65 : 35);
  const secondaryHover = hslToHex(secondaryH, Math.max(20, s - 25), isDark ? 72 : 28);
  const secondaryLight = hslToHex(secondaryH, Math.max(20, s - 20), isDark ? 85 : 92);

  let baseTokens: DesignTokens;

  if (isDark) {
    baseTokens = {
      primary,
      primaryHover,
      primaryLight,
      primaryDark,
      primaryGlow,
      secondary,
      secondaryHover,
      secondaryLight,
      accent,
      accentGlow,
      accentText,
      background: '#090E17',
      surface: '#0F172A',
      surfaceElevated: '#1E293B',
      surfaceMuted: '#172236',
      surfaceGlass: 'rgba(15, 23, 42, 0.75)',
      text: '#F8FAFC',
      textMuted: '#94A3B8',
      textSubtle: '#64748B',
      textInverse: '#050B14',
      border: '#1E2E48',
      borderSubtle: '#142136',
      borderStrong: '#334D73',
      borderGlow: primaryGlow,
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#38BDF8'
    };
  } else {
    // Light Mode variations based on style
    let bg = '#FFFFFF';
    let surface = '#F8FAFC';
    let surfaceElevated = '#FFFFFF';
    let surfaceMuted = '#F1F5F9';
    let surfaceGlass = 'rgba(255, 255, 255, 0.85)';
    let border = '#E2E8F0';
    let borderSubtle = '#F1F5F9';
    let borderStrong = '#CBD5E1';

    if (style === 'luxury') {
      bg = '#FAF9F6'; // Warm ivory luxury background
      surface = '#FFFFFF';
      surfaceElevated = '#FFFFFF';
      surfaceMuted = '#F4F1EA';
      surfaceGlass = 'rgba(255, 255, 255, 0.88)';
      border = '#E8E2D5';
      borderSubtle = '#F3EFE7';
      borderStrong = '#D5CCBB';
    } else if (style === 'organic') {
      bg = '#FAF8F5';
      surface = '#FFFFFF';
      surfaceElevated = '#FFFFFF';
      surfaceMuted = '#F0EBE1';
      surfaceGlass = 'rgba(255, 255, 255, 0.85)';
      border = '#E2DBCD';
      borderSubtle = '#EFEAE0';
      borderStrong = '#CFC5B3';
    } else if (style === 'minimal') {
      bg = '#FFFFFF';
      surface = '#FAFAFA';
      surfaceElevated = '#FFFFFF';
      surfaceMuted = '#F4F4F5';
      surfaceGlass = 'rgba(255, 255, 255, 0.9)';
      border = '#EBEBEB';
      borderSubtle = '#F5F5F5';
      borderStrong = '#D4D4D8';
    }

    baseTokens = {
      primary,
      primaryHover,
      primaryLight,
      primaryDark,
      primaryGlow,
      secondary,
      secondaryHover,
      secondaryLight,
      accent,
      accentGlow,
      accentText: '#FFFFFF',
      background: bg,
      surface,
      surfaceElevated,
      surfaceMuted,
      surfaceGlass,
      text: '#0F172A',
      textMuted: '#64748B',
      textSubtle: '#94A3B8',
      textInverse: '#FFFFFF',
      border,
      borderSubtle,
      borderStrong,
      borderGlow: `${primary}25`,
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#0284C7'
    };
  }

  if (overrides) {
    return { ...baseTokens, ...overrides };
  }

  return baseTokens;
}

/**
 * Derives a full harmonic palette based on an anchor color and harmony algorithm
 */
export function generateHarmoniousPalette(
  baseHex: string, 
  harmonyMode: BasePaletteHarmonyMode | 'pastel' = 'golden_ratio',
  isDark = false
): Partial<DesignTokens> {
  const { h, s, l } = hexToHSL(baseHex);
  
  if (harmonyMode === 'monochrome') {
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, s, Math.max(10, l - 10)),
      primaryLight: hslToHex(h, Math.max(5, s - 20), Math.min(96, l + 25)),
      primaryDark: hslToHex(h, s, Math.max(5, l - 25)),
      secondary: hslToHex(h, Math.max(10, s - 35), isDark ? 65 : 28),
      accent: hslToHex(h, Math.min(100, s + 10), isDark ? 70 : 45),
      surfaceMuted: isDark ? hslToHex(h, 15, 12) : hslToHex(h, 8, 95),
      border: isDark ? hslToHex(h, 15, 18) : hslToHex(h, 10, 88)
    };
  }

  if (harmonyMode === 'golden_ratio' || harmonyMode === 'luxury') {
    const goldAccentH = 43; // Rich warm champagne gold
    const secondaryH = (h + 137.5) % 360; // Golden angle rotation
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, s, Math.max(10, l - 8)),
      primaryLight: hslToHex(h, s, Math.min(94, l + 28)),
      primaryDark: hslToHex(h, s, Math.max(5, l - 22)),
      secondary: hslToHex(secondaryH, Math.min(65, s + 5), isDark ? 60 : 30),
      accent: hslToHex(goldAccentH, 88, 48),
      background: isDark ? '#080C14' : '#FAF9F6',
      surface: isDark ? '#0E1624' : '#FFFFFF',
      surfaceMuted: isDark ? '#141F33' : '#F5F2EB',
      border: isDark ? '#1C2B44' : '#E8E2D6'
    };
  }

  if (harmonyMode === 'complementary') {
    const compH = (h + 180) % 360;
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, s, Math.max(12, l - 8)),
      primaryLight: hslToHex(h, s, Math.min(95, l + 25)),
      primaryDark: hslToHex(h, s, Math.max(8, l - 20)),
      secondary: hslToHex(compH, Math.min(85, s + 5), isDark ? 65 : 38),
      accent: hslToHex((compH + 20) % 360, Math.min(95, s + 15), 52),
      background: isDark ? '#090E17' : '#FFFFFF',
      surface: isDark ? '#0F172A' : '#F8FAFC',
      surfaceMuted: isDark ? '#172236' : '#F1F5F9',
      border: isDark ? '#1E2E48' : '#E2E8F0'
    };
  }

  if (harmonyMode === 'triadic' || harmonyMode === 'vibrant') {
    const tri1 = (h + 120) % 360;
    const tri2 = (h + 240) % 360;
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, Math.min(100, s + 10), Math.max(15, l - 10)),
      primaryLight: hslToHex(h, 85, 92),
      primaryDark: hslToHex(h, 95, 25),
      secondary: hslToHex(tri1, 80, isDark ? 60 : 42),
      accent: hslToHex(tri2, 90, 52),
      background: isDark ? '#090E17' : '#FFFFFF',
      surface: isDark ? '#0F172A' : '#FFFFFF',
      surfaceMuted: isDark ? '#172338' : '#F8FAFC',
      border: isDark ? '#1E2E48' : '#E2E8F0'
    };
  }

  if (harmonyMode === 'analogous') {
    const ana1 = (h + 30) % 360;
    const ana2 = (h - 30 + 360) % 360;
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, s, Math.max(12, l - 8)),
      primaryLight: hslToHex(h, Math.max(20, s - 10), Math.min(95, l + 25)),
      primaryDark: hslToHex(h, s, Math.max(8, l - 20)),
      secondary: hslToHex(ana1, Math.min(75, s), isDark ? 65 : 40),
      accent: hslToHex(ana2, Math.min(90, s + 10), 50),
      background: isDark ? '#090D14' : '#FAFAF9',
      surface: isDark ? '#0F1622' : '#FFFFFF',
      surfaceMuted: isDark ? '#162130' : '#F5F5F4',
      border: isDark ? '#1D2A3C' : '#E7E5E4'
    };
  }

  if (harmonyMode === 'split_complementary') {
    const split1 = (h + 150) % 360;
    const split2 = (h + 210) % 360;
    return {
      primary: baseHex.toUpperCase(),
      primaryHover: hslToHex(h, s, Math.max(12, l - 8)),
      primaryLight: hslToHex(h, s, Math.min(95, l + 25)),
      primaryDark: hslToHex(h, s, Math.max(8, l - 20)),
      secondary: hslToHex(split1, Math.min(80, s), isDark ? 65 : 40),
      accent: hslToHex(split2, Math.min(90, s + 10), 52),
      background: isDark ? '#090E17' : '#FFFFFF',
      surface: isDark ? '#0F172A' : '#F8FAFC',
      surfaceMuted: isDark ? '#172236' : '#F1F5F9',
      border: isDark ? '#1E2E48' : '#E2E8F0'
    };
  }

  // pastel / calm
  return {
    primary: baseHex.toUpperCase(),
    primaryHover: hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 10)),
    primaryLight: hslToHex(h, 45, 93),
    primaryDark: hslToHex(h, 55, 30),
    secondary: hslToHex((h + 40) % 360, 45, 60),
    accent: hslToHex((h + 180) % 360, 40, 65),
    background: isDark ? '#0A0F1A' : '#FDFCFA',
    surface: isDark ? '#101827' : '#FFFFFF',
    surfaceMuted: isDark ? '#182438' : '#F7F5F2',
    border: isDark ? '#202E45' : '#EBE6DF'
  };
}

/**
 * Generates a complete, cohesive StoreTheme and Design System from a base palette definition
 */
export function generateCohesiveDesignSystem(
  palette: BaseColorPalette,
  options: {
    style?: ThemeStyle;
    layout?: ThemeLayout;
    fontFamily?: FontFamily;
    darkMode?: boolean;
    radius?: RadiusPreset;
    customRadiusPx?: number;
    buttonStyle?: ButtonVariantStyle;
    cardStyle?: CardVariantStyle;
  } = {}
): StoreTheme {
  const primary = palette.primary || '#D4A017';
  const style = options.style || 'luxury';
  const layout = options.layout || 'modern';
  const fontFamily = options.fontFamily || 'tajawal';
  const darkMode = options.darkMode !== undefined ? options.darkMode : false;
  const radius = options.radius || 'md';
  const customRadiusPx = options.customRadiusPx !== undefined ? options.customRadiusPx : 16;
  const buttonStyle = options.buttonStyle || 'gradient';
  const cardStyle = options.cardStyle || 'elevated';
  const harmonyMode = palette.harmonyMode || 'golden_ratio';

  // Derive harmonious tokens
  const derivedHarmonic = generateHarmoniousPalette(primary, harmonyMode, darkMode);
  
  // Base tokens from style & dark mode
  const baseTokens = generateDesignTokens(primary, style, darkMode);

  // Merge explicitly provided secondary/accent/background with derived
  const tokens: DesignTokens = {
    ...baseTokens,
    ...derivedHarmonic,
    ...(palette.secondary ? { secondary: palette.secondary } : {}),
    ...(palette.accent ? { accent: palette.accent } : {}),
    ...(palette.background ? { background: palette.background } : {}),
    ...(palette.surface ? { surface: palette.surface } : {})
  };

  return {
    style,
    layout,
    fontFamily,
    radius,
    customRadiusPx,
    shadow: 'soft',
    headerStyle: 'island_blur',
    cardStyle,
    buttonStyle,
    basePalette: {
      primary,
      secondary: tokens.secondary,
      accent: tokens.accent,
      background: tokens.background,
      surface: tokens.surface,
      harmonyMode
    },
    tokens,
    darkMode
  };
}

/**
 * Converts design tokens to complete, comprehensive CSS Variables and CSS System block
 */
export function convertTokensToCSS(theme: StoreTheme): string {
  const t = theme.tokens;
  const radius = theme.customRadiusPx !== undefined ? `${theme.customRadiusPx}px` : 
    theme.radius === 'none' ? '0px' :
    theme.radius === 'sm' ? '8px' :
    theme.radius === 'md' ? '16px' :
    theme.radius === 'lg' ? '24px' : '9999px';

  const btnRadius = theme.customRadiusPx !== undefined 
    ? `${Math.max(4, theme.customRadiusPx - 4)}px` 
    : radius;

  return `:root {
  /* ========================================================================== */
  /* COMMERCEOS COHESIVE DESIGN SYSTEM VARIABLES                                */
  /* ========================================================================== */

  /* 1. Core Brand Colors */
  --color-primary: ${t.primary};
  --color-primary-hover: ${t.primaryHover};
  --color-primary-light: ${t.primaryLight};
  --color-primary-dark: ${t.primaryDark};
  --color-primary-glow: ${t.primaryGlow || `${t.primary}33`};
  --color-secondary: ${t.secondary};
  --color-secondary-hover: ${t.secondaryHover || t.secondary};
  --color-secondary-light: ${t.secondaryLight || t.secondary};
  --color-accent: ${t.accent};
  --color-accent-glow: ${t.accentGlow || `${t.accent}33`};
  --color-accent-text: ${t.accentText || '#FFFFFF'};

  /* 2. Surfaces & Backgrounds */
  --color-background: ${t.background};
  --color-surface: ${t.surface};
  --color-surface-elevated: ${t.surfaceElevated || t.surface};
  --color-surface-muted: ${t.surfaceMuted};
  --color-surface-glass: ${t.surfaceGlass || 'rgba(15, 23, 42, 0.75)'};

  /* 3. Typography Colors */
  --color-text: ${t.text};
  --color-text-muted: ${t.textMuted};
  --color-text-subtle: ${t.textSubtle || '#64748B'};
  --color-text-inverse: ${t.textInverse || '#FFFFFF'};

  /* 4. Borders & Dividers */
  --color-border: ${t.border};
  --color-border-subtle: ${t.borderSubtle || t.border};
  --color-border-strong: ${t.borderStrong || t.border};
  --color-border-glow: ${t.borderGlow || `${t.primary}25`};

  /* 5. Semantic Feedback */
  --color-success: ${t.success};
  --color-warning: ${t.warning};
  --color-danger: ${t.danger};
  --color-info: ${t.info || '#38BDF8'};

  /* 6. Button System Tokens */
  --btn-primary-bg: ${t.primary};
  --btn-primary-text: #FFFFFF;
  --btn-primary-hover: ${t.primaryHover};
  --btn-radius: ${btnRadius};
  --btn-shadow: 0 4px 14px 0 ${t.primaryGlow || `${t.primary}40`};

  /* 7. Card System Tokens */
  --card-bg: ${t.surface};
  --card-border: ${t.border};
  --card-radius: ${radius};
  --card-shadow: ${theme.cardStyle === 'elevated' ? '0 10px 30px -10px rgba(0,0,0,0.2)' : 'none'};
  --card-backdrop: blur(12px);

  /* 8. Radii Scale */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-pill: 9999px;
  --border-radius: ${radius};

  /* 9. Layout & Components */
  --header-style: ${theme.headerStyle};
  --card-style: ${theme.cardStyle};
  --button-style: ${theme.buttonStyle || 'solid'};
}`;
}

/**
 * Returns dynamic CSS properties for buttons according to current active theme design system
 */
export function getDynamicButtonStyles(
  theme: StoreTheme,
  variantOverride?: ButtonVariantStyle
): CSSProperties {
  const t = theme.tokens;
  const variant = variantOverride || theme.buttonStyle || 'solid';
  const rad = theme.customRadiusPx !== undefined 
    ? `${Math.max(4, theme.customRadiusPx - 4)}px` 
    : theme.radius === 'none' ? '0px'
    : theme.radius === 'sm' ? '8px'
    : theme.radius === 'md' ? '12px'
    : theme.radius === 'lg' ? '18px' : '9999px';

  switch (variant) {
    case 'gradient':
      return {
        background: `linear-gradient(135deg, ${t.primary} 0%, ${t.primaryDark} 100%)`,
        color: '#FFFFFF',
        borderRadius: rad,
        boxShadow: `0 4px 16px ${t.primary}35`,
        border: '1px solid rgba(255,255,255,0.15)'
      };

    case 'glow':
      return {
        backgroundColor: t.primary,
        color: '#FFFFFF',
        borderRadius: rad,
        boxShadow: `0 0 20px ${t.primary}60, 0 4px 12px ${t.primary}40`,
        border: `1px solid ${t.primaryLight}`
      };

    case 'outline':
      return {
        backgroundColor: 'transparent',
        border: `1.5px solid ${t.primary}`,
        color: t.primary,
        borderRadius: rad,
        boxShadow: `0 2px 8px ${t.primary}15`
      };

    case 'glass':
      return {
        backgroundColor: `${t.primary}22`,
        backdropFilter: 'blur(12px)',
        border: `1px solid ${t.primary}50`,
        color: t.primaryLight || t.primary,
        borderRadius: rad
      };

    case 'luxury_gold':
      return {
        background: 'linear-gradient(135deg, #D4AF37 0%, #AA771C 50%, #85580C 100%)',
        color: '#050B14',
        borderRadius: rad,
        fontWeight: '900',
        boxShadow: '0 4px 20px rgba(212, 175, 55, 0.35)',
        border: '1px solid #FFF2A8'
      };

    case 'soft':
      return {
        backgroundColor: `${t.primary}18`,
        color: t.primary,
        borderRadius: rad,
        border: `1px solid ${t.primary}30`
      };

    case 'solid':
    default:
      return {
        backgroundColor: t.primary,
        color: '#FFFFFF',
        borderRadius: rad,
        boxShadow: `0 4px 14px ${t.primary}30`,
        border: '1px solid transparent'
      };
  }
}

/**
 * Returns dynamic CSS properties for cards according to current active theme design system
 */
export function getDynamicCardStyles(
  theme: StoreTheme,
  variantOverride?: CardVariantStyle
): CSSProperties {
  const t = theme.tokens;
  const variant = variantOverride || theme.cardStyle || 'elevated';
  const rad = theme.customRadiusPx !== undefined 
    ? `${theme.customRadiusPx}px` 
    : theme.radius === 'none' ? '0px'
    : theme.radius === 'sm' ? '8px'
    : theme.radius === 'md' ? '16px'
    : theme.radius === 'lg' ? '24px' : '32px';

  switch (variant) {
    case 'glass':
      return {
        backgroundColor: t.surfaceGlass || 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(16px)',
        borderColor: `${t.border}80`,
        borderRadius: rad,
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)'
      };

    case 'bordered':
      return {
        backgroundColor: t.surface,
        borderColor: t.borderStrong || t.border,
        borderWidth: '1.5px',
        borderRadius: rad,
        boxShadow: 'none'
      };

    case 'luxurious_gold':
      return {
        backgroundColor: t.surfaceElevated || t.surface,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        borderWidth: '1px',
        borderRadius: rad,
        boxShadow: '0 10px 30px -10px rgba(212, 175, 55, 0.15)'
      };

    case 'minimal':
      return {
        backgroundColor: t.surface,
        borderColor: t.borderSubtle || t.border,
        borderRadius: rad,
        boxShadow: 'none'
      };

    case 'inset_subtle':
      return {
        backgroundColor: t.surfaceMuted,
        borderColor: t.border,
        borderRadius: rad,
        boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.08)'
      };

    case 'elevated':
    default:
      return {
        backgroundColor: t.surface,
        borderColor: t.border,
        borderRadius: rad,
        boxShadow: '0 12px 28px -8px rgba(0, 0, 0, 0.18), 0 4px 10px -4px rgba(0, 0, 0, 0.1)'
      };
  }
}

/**
 * Returns dynamic badge styles
 */
export function getDynamicBadgeStyles(
  theme: StoreTheme,
  type: 'primary' | 'accent' | 'secondary' | 'outline' = 'primary'
): CSSProperties {
  const t = theme.tokens;
  switch (type) {
    case 'accent':
      return {
        backgroundColor: `${t.accent}20`,
        color: t.accent,
        borderColor: `${t.accent}40`
      };
    case 'secondary':
      return {
        backgroundColor: `${t.secondary}20`,
        color: t.secondary,
        borderColor: `${t.secondary}40`
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        color: t.primary,
        borderColor: t.primary
      };
    case 'primary':
    default:
      return {
        backgroundColor: `${t.primary}20`,
        color: t.primary,
        borderColor: `${t.primary}40`
      };
  }
}

/**
 * Full accessibility / WCAG compliance auditor for the token system
 */
export function getWcagAudit(tokens: DesignTokens): {
  pair: string;
  pairAr: string;
  ratio: number;
  passAA: boolean;
  passAAA: boolean;
  color1: string;
  color2: string;
}[] {
  const pairs = [
    { pair: 'Text vs Background', pairAr: 'النص الأساسي فوق الخلفية', c1: tokens.text, c2: tokens.background },
    { pair: 'Button Text vs Primary', pairAr: 'نص الأزرار فوق اللون الأساسي', c1: '#FFFFFF', c2: tokens.primary },
    { pair: 'Muted Text vs Surface', pairAr: 'النص الثانوي فوق البطاقات', c1: tokens.textMuted, c2: tokens.surface },
    { pair: 'Accent vs Surface', pairAr: 'العنصر الترويجي فوق السطح', c1: tokens.accent, c2: tokens.surface },
    { pair: 'Border vs Background', pairAr: 'إطارات البطاقات فوق الخلفية', c1: tokens.border, c2: tokens.background }
  ];

  return pairs.map(p => {
    const ratio = calculateContrastRatio(p.c1, p.c2);
    return {
      pair: p.pair,
      pairAr: p.pairAr,
      ratio,
      passAA: ratio >= 4.5,
      passAAA: ratio >= 7.0,
      color1: p.c1,
      color2: p.c2
    };
  });
}

/**
 * Parses user edited CSS variables into design token overrides
 */
export function parseCSSToTokens(cssString: string): Partial<DesignTokens> {
  const result: Partial<DesignTokens> = {};
  const mapping: Record<string, keyof DesignTokens> = {
    '--color-primary': 'primary',
    '--color-primary-hover': 'primaryHover',
    '--color-primary-light': 'primaryLight',
    '--color-primary-dark': 'primaryDark',
    '--color-primary-glow': 'primaryGlow',
    '--color-secondary': 'secondary',
    '--color-secondary-hover': 'secondaryHover',
    '--color-secondary-light': 'secondaryLight',
    '--color-accent': 'accent',
    '--color-accent-glow': 'accentGlow',
    '--color-background': 'background',
    '--color-surface': 'surface',
    '--color-surface-elevated': 'surfaceElevated',
    '--color-surface-muted': 'surfaceMuted',
    '--color-border': 'border',
    '--color-border-subtle': 'borderSubtle',
    '--color-border-strong': 'borderStrong',
    '--color-text': 'text',
    '--color-text-muted': 'textMuted',
    '--color-success': 'success',
    '--color-warning': 'warning',
    '--color-danger': 'danger',
    '--color-info': 'info'
  };

  const lines = cssString.split('\n');
  for (const line of lines) {
    const match = line.match(/(--[\w-]+)\s*:\s*([^;]+);/);
    if (match) {
      const varName = match[1].trim();
      const value = match[2].trim();
      const tokenKey = mapping[varName];
      if (tokenKey && (value.startsWith('#') || value.startsWith('rgba') || value.startsWith('rgb'))) {
        result[tokenKey] = value;
      }
    }
  }

  return result;
}

export const PRESET_COLOR_PALETTES = [
  { id: 'gold_royal', name: 'الملكي الذهبي والعسلي', nameEn: 'Royal Gold & Amber', hex: '#D4A017', secondary: '#1E293B', accent: '#F59E0B', style: 'luxury' as ThemeStyle, harmony: 'golden_ratio' as BasePaletteHarmonyMode },
  { id: 'amber_honey', name: 'عسل نقي وطبيعي', nameEn: 'Amber Honey', hex: '#E69500', secondary: '#78350F', accent: '#D97706', style: 'organic' as ThemeStyle, harmony: 'analogous' as BasePaletteHarmonyMode },
  { id: 'espresso_coffee', name: 'محامص البن المختص', nameEn: 'Dark Espresso', hex: '#6F4E37', secondary: '#D97706', accent: '#B45309', style: 'modern' as ThemeStyle, harmony: 'analogous' as BasePaletteHarmonyMode },
  { id: 'emerald_luxury', name: 'زمرد إمبراطوري فاخر', nameEn: 'Imperial Emerald', hex: '#0F766E', secondary: '#D4A017', accent: '#14B8A6', style: 'luxury' as ThemeStyle, harmony: 'golden_ratio' as BasePaletteHarmonyMode },
  { id: 'sapphire_blue', name: 'أزرق ياقوتي تقني', nameEn: 'Sapphire Ocean Tech', hex: '#2563EB', secondary: '#0F172A', accent: '#38BDF8', style: 'bold' as ThemeStyle, harmony: 'complementary' as BasePaletteHarmonyMode },
  { id: 'crimson_fashion', name: 'قرمزي مخملي للأزياء', nameEn: 'Crimson Velvet Chic', hex: '#BE123C', secondary: '#1E293B', accent: '#FB7185', style: 'classic' as ThemeStyle, harmony: 'triadic' as BasePaletteHarmonyMode },
  { id: 'noir_minimal', name: 'أسود كربوني مينيمال', nameEn: 'Noir Obsidian', hex: '#18181B', secondary: '#71717A', accent: '#F4F4F5', style: 'minimal' as ThemeStyle, harmony: 'monochrome' as BasePaletteHarmonyMode },
  { id: 'violet_perfume', name: 'عود وبنفسجي ملكي', nameEn: 'Royal Violet & Oud', hex: '#7C3AED', secondary: '#F59E0B', accent: '#C084FC', style: 'luxury' as ThemeStyle, harmony: 'golden_ratio' as BasePaletteHarmonyMode },
  { id: 'sage_organic', name: 'زيتي وأخضر عضوي', nameEn: 'Sage & Olive Organic', hex: '#15803D', secondary: '#A16207', accent: '#4ADE80', style: 'organic' as ThemeStyle, harmony: 'analogous' as BasePaletteHarmonyMode },
  { id: 'terracotta_desert', name: 'طبيعي ترابي صحراوي', nameEn: 'Desert Terracotta', hex: '#C2410C', secondary: '#431407', accent: '#FB923C', style: 'organic' as ThemeStyle, harmony: 'analogous' as BasePaletteHarmonyMode },
  { id: 'damascus_rose', name: 'وردي دمشقي أنيق', nameEn: 'Damascus Rose Atelier', hex: '#DB2777', secondary: '#4A044E', accent: '#F472B6', style: 'editorial' as ThemeStyle, harmony: 'triadic' as BasePaletteHarmonyMode },
  { id: 'nordic_slate', name: 'رمادي شمالي ناصع', nameEn: 'Nordic Slate Clean', hex: '#334155', secondary: '#0284C7', accent: '#60A5FA', style: 'modern' as ThemeStyle, harmony: 'split_complementary' as BasePaletteHarmonyMode }
];

export const ARAB_CURRENCIES: Record<string, {
  code: string;
  symbol: string;
  nameAr: string;
  nameEn: string;
  flag: string;
}> = {
  SAR: { code: 'SAR', symbol: 'ر.س', nameAr: 'ريال سعودي', nameEn: 'Saudi Riyal', flag: '🇸🇦' },
  AED: { code: 'AED', symbol: 'د.إ', nameAr: 'درهم إماراتي', nameEn: 'UAE Dirham', flag: '🇦🇪' },
  KWD: { code: 'KWD', symbol: 'د.ك', nameAr: 'دينار كويتي', nameEn: 'Kuwaiti Dinar', flag: '🇰🇼' },
  QAR: { code: 'QAR', symbol: 'ر.ق', nameAr: 'ريال قطري', nameEn: 'Qatari Riyal', flag: '🇶🇦' },
  BHD: { code: 'BHD', symbol: 'د.ب', nameAr: 'دينار بحريني', nameEn: 'Bahraini Dinar', flag: '🇧🇭' },
  OMR: { code: 'OMR', symbol: 'ر.ع', nameAr: 'ريال عماني', nameEn: 'Omani Rial', flag: '🇴🇲' },
  JOD: { code: 'JOD', symbol: 'د.أ', nameAr: 'دينار أردني', nameEn: 'Jordanian Dinar', flag: '🇯🇴' },
  EGP: { code: 'EGP', symbol: 'ج.م', nameAr: 'جنيه مصري', nameEn: 'Egyptian Pound', flag: '🇪🇬' },
  IQD: { code: 'IQD', symbol: 'د.ع', nameAr: 'دينار عراقي', nameEn: 'Iraqi Dinar', flag: '🇮🇶' },
  MAD: { code: 'MAD', symbol: 'د.م', nameAr: 'درهم مغربي', nameEn: 'Moroccan Dirham', flag: '🇲🇦' },
  USD: { code: 'USD', symbol: '$', nameAr: 'دولار أمريكي', nameEn: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', nameAr: 'يورو أوروبي', nameEn: 'Euro', flag: '🇪🇺' }
};

export const ARAB_COUNTRIES_AND_CITIES: Record<string, {
  countryAr: string;
  countryEn: string;
  flag: string;
  currency: string;
  cities: string[];
}> = {
  SA: {
    countryAr: 'المملكة العربية السعودية',
    countryEn: 'Saudi Arabia',
    flag: '🇸🇦',
    currency: 'SAR',
    cities: [
      'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 
      'الظهران', 'الأحساء', 'الطائف', 'تبوك', 'أبها', 'خميس مشيط', 
      'حائل', 'جازان', 'نجران', 'بريدة (القصيم)', 'عنيزة', 'ينبع', 'الجبيل'
    ]
  },
  AE: {
    countryAr: 'الإمارات العربية المتحدة',
    countryEn: 'United Arab Emirates',
    flag: '🇦🇪',
    currency: 'AED',
    cities: ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'العين', 'أم القيوين']
  },
  KW: {
    countryAr: 'دولة الكويت',
    countryEn: 'Kuwait',
    flag: '🇰🇼',
    currency: 'KWD',
    cities: ['مدينة الكويت', 'حولي', 'السالمية', 'الفروانية', 'الأحمدي', 'مبارك الكبير', 'الجهراء']
  },
  QA: {
    countryAr: 'دولة قطر',
    countryEn: 'Qatar',
    flag: '🇶🇦',
    currency: 'QAR',
    cities: ['الدوحة', 'الريان', 'الوكرة', 'الخور', 'لوسيل', 'أم صلال']
  },
  BH: {
    countryAr: 'مملكة البحرين',
    countryEn: 'Bahrain',
    flag: '🇧🇭',
    currency: 'BHD',
    cities: ['المنامة', 'المحرق', 'الرفاع', 'سترة', 'مدينة عيسى', 'مدينة حمد']
  },
  OM: {
    countryAr: 'سلطنة عمان',
    countryEn: 'Oman',
    flag: '🇴🇲',
    currency: 'OMR',
    cities: ['مسقط', 'صلالة', 'صحار', 'نزوى', 'صور', 'السيب', 'بوشر']
  },
  JO: {
    countryAr: 'المملكة الأردنية الهاشمية',
    countryEn: 'Jordan',
    flag: '🇯🇴',
    currency: 'JOD',
    cities: ['عمان', 'إربد', 'الزرقاء', 'العقبة', 'السلط', 'مادبا', 'جرش']
  },
  EG: {
    countryAr: 'جمهورية مصر العربية',
    countryEn: 'Egypt',
    flag: '🇪🇬',
    currency: 'EGP',
    cities: ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'طنطا', 'بورسعيد', 'الشيخ زايد', 'التجمع الخامس']
  },
  MA: {
    countryAr: 'المملكة المغربية',
    countryEn: 'Morocco',
    flag: '🇲🇦',
    currency: 'MAD',
    cities: ['الدار البيضاء', 'الرباط', 'مراكش', 'طنجة', 'فاس', 'أكادير']
  },
  IQ: {
    countryAr: 'جمهورية العراق',
    countryEn: 'Iraq',
    flag: '🇮🇶',
    currency: 'IQD',
    cities: ['بغداد', 'أربيل', 'البصرة', 'السليمانية', 'النجف', 'كربلاء', 'الموصل']
  }
};

export const ARAB_PAYMENT_GATEWAYS_CATALOG = [
  {
    id: 'mada',
    key: 'mada',
    nameAr: 'مدى (Mada)',
    nameEn: 'Mada Debit Cards',
    category: 'بطاقات بنكية',
    type: 'card',
    fee: '1.0% + 1 ر.س',
    descAr: 'البوابة الوطنية للمملكة العربية السعودية لجميع بطاقات الصراف',
    badge: 'الأكثر استخداماً في السعودية 🇸🇦',
    supportedCountries: ['SA'],
    defaultEnabled: true
  },
  {
    id: 'apple_pay',
    key: 'applePay',
    nameAr: 'Apple Pay',
    nameEn: 'Apple Pay One-Tap',
    category: 'محافظ ذكية',
    type: 'wallet',
    fee: 'مباشر بدون وسيط',
    descAr: 'دفع فوري بنقرة واحدة عبر بصمة الوجه على أجهزة Apple',
    badge: 'أعلى نسبة إتمام للطلب ⚡',
    supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG'],
    defaultEnabled: true
  },
  {
    id: 'visa',
    key: 'visa',
    nameAr: 'فيزا وماستركارد (Visa & MasterCard)',
    nameEn: 'Credit Cards (Visa/Mastercard)',
    category: 'بطاقات ائتمانية',
    type: 'card',
    fee: '2.2% + 1 ر.س',
    descAr: 'قبول جميع البطاقات الائتمانية والخصم المباشر محلياً ودولياً',
    badge: 'دولي ومحلي معتمد 💳',
    supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'JO', 'EG', 'MA', 'IQ'],
    defaultEnabled: true
  },
  {
    id: 'stc_pay',
    key: 'stcPay',
    nameAr: 'STC Pay / Urpay',
    nameEn: 'STC Pay Digital Wallet',
    category: 'محافظ ذكية',
    type: 'wallet',
    fee: '1.7% + 0.5 ر.س',
    descAr: 'الدفع عبر المحافظ الرقمية الأكثر انتشاراً في الخليج',
    badge: 'محفظة رقمية سريعة 📱',
    supportedCountries: ['SA'],
    defaultEnabled: true
  },
  {
    id: 'tamara',
    key: 'tamara',
    nameAr: 'تمارا (Tamara BNPL)',
    nameEn: 'Tamara Buy Now Pay Later',
    category: 'تقسيط مشتريات',
    type: 'bnpl',
    fee: 'بدون فوائد للعميل',
    descAr: 'قسّم فاتورتك على 4 دفعات بدون أي رسوم أو فوائد للعميل',
    badge: 'زيادة متوسط قيمة السلة 📈',
    supportedCountries: ['SA', 'AE', 'KW'],
    defaultEnabled: true
  },
  {
    id: 'tabby',
    key: 'tabby',
    nameAr: 'تابي (Tabby BNPL)',
    nameEn: 'Tabby Pay in 4',
    category: 'تقسيط مشتريات',
    type: 'bnpl',
    fee: 'بدون فوائد للعميل',
    descAr: 'قسّم مشترياتك على دفعات شهرية مريحة ومتوافقة مع الشريعة',
    badge: 'تقسيط فوري وموثوق 🛍️',
    supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'EG'],
    defaultEnabled: true
  },
  {
    id: 'knet',
    key: 'knet',
    nameAr: 'كي نت (KNET - الكويت)',
    nameEn: 'KNET Payment Network',
    category: 'بطاقات بنكية',
    type: 'card',
    fee: '0.150 د.ك',
    descAr: 'شبكة الدفع الإلكتروني الوطنية لدولة الكويت',
    badge: 'الخيار الأول في الكويت 🇰🇼',
    supportedCountries: ['KW'],
    defaultEnabled: false
  },
  {
    id: 'benefit',
    key: 'benefit',
    nameAr: 'بنفت بي (BenefitPay - البحرين)',
    nameEn: 'BenefitPay Bahrain',
    category: 'محافظ ذكية',
    type: 'wallet',
    fee: '100 فلس',
    descAr: 'تطبيق الدفع الوطني الفوري لمملكة البحرين',
    badge: 'الخيار الأول في البحرين 🇧🇭',
    supportedCountries: ['BH'],
    defaultEnabled: false
  },
  {
    id: 'fawry',
    key: 'fawry',
    nameAr: 'فوري وميزة (Fawry / Meeza - مصر)',
    nameEn: 'Fawry & Meeza Pay',
    category: 'شبكات دفع ومحافظ',
    type: 'card',
    fee: '2.5%',
    descAr: 'أكبر شبكة مدفوعات إلكترونية وبطاقات ميزة في جمهورية مصر',
    badge: 'الخيار الأول في مصر 🇪🇬',
    supportedCountries: ['EG'],
    defaultEnabled: false
  },
  {
    id: 'cliq',
    key: 'cliq',
    nameAr: 'كليك (CliQ - الأردن)',
    nameEn: 'CliQ Instant Payments',
    category: 'تحويل فوري',
    type: 'bank',
    fee: 'فوري ومجاني',
    descAr: 'نظام الدفع الفوري والمباشر في المملكة الأردنية الهاشمية',
    badge: 'التحويل الفوري الأردني 🇯🇴',
    supportedCountries: ['JO'],
    defaultEnabled: false
  },
  {
    id: 'bank_transfer',
    key: 'bankTransfer',
    nameAr: 'التحويل البنكي المباشر (Bank Transfer)',
    nameEn: 'Direct Bank Wire Transfer',
    category: 'حوالات مصرفية',
    type: 'bank',
    fee: '0% (مجاني بالكامل)',
    descAr: 'إيداع بنكي مباشر مع رفع إيصال التحويل واعتماده من لوحة التاجر',
    badge: 'بدون أي عمولات بنكية 🏦',
    supportedCountries: ['ALL'],
    defaultEnabled: true
  },
  {
    id: 'cod',
    key: 'cod',
    nameAr: 'الدفع عند الاستلام (Cash on Delivery)',
    nameEn: 'Cash on Delivery (COD)',
    category: 'دفع نقدي',
    type: 'cash',
    fee: 'رسوم تحصيل اختيارية',
    descAr: 'الدفع نقداً أو بجهاز مدى المحمول عند باب العميل',
    badge: 'ثقة أعلى للعملاء الجدد 📦',
    supportedCountries: ['ALL'],
    defaultEnabled: true
  }
];

export const FONTS_CONFIG: Record<FontFamily, {
  id: FontFamily;
  nameAr: string;
  nameEn: string;
  category: string;
  description: string;
  cssFamily: string;
  previewText: string;
}> = {
  tajawal: {
    id: 'tajawal',
    nameAr: 'تجوال (Tajawal)',
    nameEn: 'Tajawal Classic',
    category: 'رسمي وفاخر',
    description: 'خط متوازن ذو حضور ملكي، مثالي للأعسال، العطور، والمنتجات الفاخرة.',
    cssFamily: 'Tajawal, sans-serif',
    previewText: 'أجود أصناف العسل الطبيعي والمحاصيل المختصة'
  },
  alexandria: {
    id: 'alexandria',
    nameAr: 'الإسكندرية (Alexandria)',
    nameEn: 'Alexandria Modern',
    category: 'عصري وحديث',
    description: 'خط ذو طابع رقمي جذاب، ممتاز للمتاجر العصرية والمقاهي والأزياء.',
    cssFamily: 'Alexandria, sans-serif',
    previewText: 'إطلالات عصرية ومذاق مختص يواكب طموحك'
  },
  cairo: {
    id: 'cairo',
    nameAr: 'القاهرة (Cairo)',
    nameEn: 'Cairo Bold Geometric',
    category: 'هندسي وبارز',
    description: 'خط ذو سماكات واضحة وعناوين قوية، ممتاز للتخفيضات والأجهزة الإلكترونية.',
    cssFamily: 'Cairo, sans-serif',
    previewText: 'أقوى العروض الحصرية مع التوصيل الفوري'
  },
  readex: {
    id: 'readex',
    nameAr: 'ريدكس برو (Readex Pro)',
    nameEn: 'Readex Pro Tech',
    category: 'تقني ومريح',
    description: 'خط هندسي ناعم صُمم لقراءة مريحة للشاشات وتطبيقات الجوال.',
    cssFamily: '"Readex Pro", sans-serif',
    previewText: 'أجهزة ذكية متطورة بضمان معتمد وتوصيل سريع'
  },
  almarai: {
    id: 'almarai',
    nameAr: 'المراعي (Almarai)',
    nameEn: 'Almarai Commercial',
    category: 'تجاري ومقروء',
    description: 'الخط التجاري الأكثر نقاءً ووضوحاً لقوائم المنتجات والأسعار.',
    cssFamily: 'Almarai, sans-serif',
    previewText: 'مستلزمات يومية بأفضل الأسعار وأعلى مستويات الجودة'
  },
  ibm_plex: {
    id: 'ibm_plex',
    nameAr: 'آي بي إم بلكس (IBM Plex Arabic)',
    nameEn: 'IBM Plex Sans Arabic',
    category: 'مؤسسي واحترافي',
    description: 'خط مؤسسي فائق الدقة، يمنح المتجر مصداقية ومظهر علامة تجارية عالمية.',
    cssFamily: '"IBM Plex Sans Arabic", sans-serif',
    previewText: 'منصة احترافية تلتزم بأعلى معايير الجودة والمصداقية'
  },
  el_messiri: {
    id: 'el_messiri',
    nameAr: 'المسيري (El Messiri)',
    nameEn: 'El Messiri Aesthetic',
    category: 'جمالي وناعم',
    description: 'خط عربي ذو انحناءات فنية أنيقة، مخصص لعلامات الأزياء والمكياج والعطور.',
    cssFamily: '"El Messiri", sans-serif',
    previewText: 'نفحات ملكية ساحرة ولمسات من الأناقة الرفيعة'
  },
  amiri: {
    id: 'amiri',
    nameAr: 'أميري (Amiri Naskh)',
    nameEn: 'Amiri Heritage',
    category: 'تراثي ونسخ أصيل',
    description: 'خط نسخ عربي تقليدي فخم، مثالي للأغذية الطبيعية والمخطوطات والمجوهرات.',
    cssFamily: 'Amiri, serif',
    previewText: 'خيرات أصيلة من خير الطبيعة وتراث الأجداد'
  },
  jakarta: {
    id: 'jakarta',
    nameAr: 'بلس جاكرتا (Plus Jakarta)',
    nameEn: 'Plus Jakarta Sans',
    category: 'لاتيني وتقني',
    description: 'خط ناعم ودقيق للأرقام والأسماء الإنجليزية والعناصر التقنية.',
    cssFamily: '"Plus Jakarta Sans", sans-serif',
    previewText: 'Premium Collection with High Durability & Fast Delivery'
  },
  playfair: {
    id: 'playfair',
    nameAr: 'بلايفير ديسبلاي (Playfair)',
    nameEn: 'Playfair Display Serif',
    category: 'كلاسيكي ورومانسي',
    description: 'خط سيريف فاخر لبيوت الموضة والأزياء والمجوهرات الراقية.',
    cssFamily: '"Playfair Display", serif',
    previewText: 'Haute Couture & Luxury Boutique Experience'
  }
};

export const BUSINESS_TYPE_CONFIG: Record<BusinessType, {
  nameAr: string;
  nameEn: string;
  defaultColor: string;
  suggestedStyle: ThemeStyle;
  suggestedLayout: ThemeLayout;
  suggestedFont: FontFamily;
  defaultSections: string[];
  icon: string;
  taglineAr: string;
  sampleCategories: string[];
}> = {
  wholesale: {
    nameAr: 'تجارة الجملة والتوريد B2B',
    nameEn: 'Wholesale & B2B Hub',
    defaultColor: '#2563EB',
    suggestedStyle: 'bold',
    suggestedLayout: 'marketplace',
    suggestedFont: 'cairo',
    defaultSections: ['hero', 'categories', 'featured_products', 'benefits', 'testimonials', 'faq'],
    icon: 'Package',
    taglineAr: 'أسعار جملة تنافسية وتوريد فوري للكميات والشركات',
    sampleCategories: ['كراتين ودرزن الجملة', 'عروض التوريد للمحلات', 'أصناف التصفية السريعة', 'طلبات الحاويات والشحن']
  },
  retail: {
    nameAr: 'تجارة التجزئة والمتاجر',
    nameEn: 'Retail & Multi-Store',
    defaultColor: '#059669',
    suggestedStyle: 'modern',
    suggestedLayout: 'marketplace',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'testimonials'],
    icon: 'ShoppingBag',
    taglineAr: 'تجربة تسوق متكاملة مع دفع فوري وتوصيل سريع',
    sampleCategories: ['الأكثر مبيعاً', 'وصل حديثاً', 'عروض نهاية الأسبوع', 'أصناف مميزة']
  },
  electronics: {
    nameAr: 'إلكترونيات وأجهزة ذكية',
    nameEn: 'Electronics & Smart Devices',
    defaultColor: '#7C3AED',
    suggestedStyle: 'modern',
    suggestedLayout: 'bento',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'faq'],
    icon: 'Cpu',
    taglineAr: 'أحدث الأجهزة الذكية مع ضمان سنتين وتتبع الرقم التسلسلي',
    sampleCategories: ['الهواتف الذكية والأجهزة اللوحية', 'الساعات والسماعات', 'ملحقات وشواحن معتمدة', 'أجهزة المنزل الذكي']
  },
  honey: {
    nameAr: 'عسل وأغذية طبيعية',
    nameEn: 'Honey & Organic Food',
    defaultColor: '#D4A017',
    suggestedStyle: 'luxury',
    suggestedLayout: 'luxury',
    suggestedFont: 'tajawal',
    defaultSections: ['hero', 'categories', 'featured_products', 'benefits', 'testimonials', 'faq'],
    icon: 'Droplet',
    taglineAr: 'أنقى خيرات الطبيعة وأجود أنواع العسل المضمون',
    sampleCategories: ['عسل السدر الفاخر', 'عسل السمر البلدي', 'عسل الغابة السوداء', 'خلطات المناعة والنشاط', 'غذاء الملكات والعكبر']
  },
  coffee: {
    nameAr: 'قهوة ومشروبات مختصة',
    nameEn: 'Specialty Coffee & Beverages',
    defaultColor: '#78350F',
    suggestedStyle: 'modern',
    suggestedLayout: 'modern',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'story', 'testimonials'],
    icon: 'Coffee',
    taglineAr: 'محاصيل مختصة منتقاة بعناية لعشاق المذاق الرفيع',
    sampleCategories: ['محاصيل الإسبريسو', 'محاصيل الفلتر والتقطير', 'أدوات ومكائن التحضير', 'بكجات التوفير']
  },
  fashion: {
    nameAr: 'ملابس وأزياء',
    nameEn: 'Fashion & Apparel',
    defaultColor: '#18181B',
    suggestedStyle: 'minimal',
    suggestedLayout: 'editorial',
    suggestedFont: 'playfair',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'testimonials', 'newsletter'],
    icon: 'Sparkles',
    taglineAr: 'إطلالات تواكب العصر بأعلى معايير الأناقة والجودة',
    sampleCategories: ['التشكيلة الصيفية', 'ملابس رجالية', 'ملابس نسائية', 'أحذية وإكسسوارات']
  },
  perfume: {
    nameAr: 'عطور وبخور',
    nameEn: 'Perfumes & Oud',
    defaultColor: '#9333EA',
    suggestedStyle: 'luxury',
    suggestedLayout: 'luxury',
    suggestedFont: 'tajawal',
    defaultSections: ['hero', 'featured_products', 'categories', 'story', 'testimonials', 'faq'],
    icon: 'Flame',
    taglineAr: 'نفحات ملكية ساحرة تأسر الحواس بثبات استثنائي',
    sampleCategories: ['عطور النيش الفاخرة', 'أدهان العود والمسك', 'بخور ومباخر ذكية', 'عطور الشعر والمفارش']
  },
  tech: {
    nameAr: 'إلكترونيات وأجهزة ذكية',
    nameEn: 'Tech & Smart Devices',
    defaultColor: '#2563EB',
    suggestedStyle: 'bold',
    suggestedLayout: 'marketplace',
    suggestedFont: 'jakarta',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'faq'],
    icon: 'Cpu',
    taglineAr: 'أحدث الابتكارات التقنية بضمان حقيقي وتوصيل سريع',
    sampleCategories: ['الهواتف والملحقات', 'سماعات واكسسوارات صوتية', 'الساعات الذكية', 'أجهزة المنزل الذكي']
  },
  beauty: {
    nameAr: 'مستحضرات تجميل وعناية',
    nameEn: 'Beauty & Cosmetics',
    defaultColor: '#E11D48',
    suggestedStyle: 'modern',
    suggestedLayout: 'modern',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'benefits', 'testimonials'],
    icon: 'Heart',
    taglineAr: 'عناية فائقة تبرز جمالك الطبيعي بمكونات آمنة',
    sampleCategories: ['العناية بالبشرة', 'العناية بالشعر', 'مستحضرات المكياج', 'مجموعات الهدايا']
  },
  sweets: {
    nameAr: 'حلويات ومخبوزات',
    nameEn: 'Sweets & Bakeries',
    defaultColor: '#EA580C',
    suggestedStyle: 'organic',
    suggestedLayout: 'modern',
    suggestedFont: 'tajawal',
    defaultSections: ['hero', 'categories', 'featured_products', 'testimonials'],
    icon: 'Cake',
    taglineAr: 'نكهات تصنع البهجة وطازجة يومياً بحب',
    sampleCategories: ['كيك وتورتات المناسبات', 'شوكولاتة بلجيكية فاخرة', 'حلويات شرقية', 'مخبوزات طازجة']
  },
  accessories: {
    nameAr: 'إكسسوارات وساعات',
    nameEn: 'Accessories & Watches',
    defaultColor: '#4F46E5',
    suggestedStyle: 'minimal',
    suggestedLayout: 'classic',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'testimonials'],
    icon: 'Watch',
    taglineAr: 'تفاصيل أنيقة تكمل تميزك اليومي',
    sampleCategories: ['ساعات كلاسيكية', 'أساور ومجوهرات ناعمة', 'نظارات شمسية', 'حقائب يد ومحافظ']
  },
  food: {
    nameAr: 'أغذية وسوبرماركت',
    nameEn: 'Food Market & Groceries',
    defaultColor: '#16A34A',
    suggestedStyle: 'organic',
    suggestedLayout: 'marketplace',
    suggestedFont: 'tajawal',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'benefits'],
    icon: 'ShoppingBag',
    taglineAr: 'منتجات غذائية طازجة ومختارة بجودة مضمونة تصل لباب بيتك',
    sampleCategories: ['خضار وفواكه طازجة', 'تمور ومكسرات فاخرة', 'منتجات عضوية', 'زيوت ومؤونة']
  },
  general: {
    nameAr: 'متجر عام وشامل',
    nameEn: 'General & Multi-Category',
    defaultColor: '#0F172A',
    suggestedStyle: 'modern',
    suggestedLayout: 'marketplace',
    suggestedFont: 'alexandria',
    defaultSections: ['hero', 'categories', 'featured_products', 'banner', 'testimonials'],
    icon: 'Store',
    taglineAr: 'كل ما تحتاجه في مكان واحد بأفضل الأسعار وأسرع توصيل',
    sampleCategories: ['الأكثر مبيعاً', 'وصل حديثاً', 'عروض التوفير', 'قسم الهدايا']
  }
};
