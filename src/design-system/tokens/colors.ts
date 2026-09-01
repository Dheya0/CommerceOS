// Sovereign CommerceOS Design Tokens - Colors
// Deep Navy base, warm gold accent, neutral silver, and accessible semantics

export const rawColors = {
  // Deep Navy Backgrounds
  navy: {
    base: '#050B14',        // App background base (#050B14)
    surface: '#0B1422',     // Surface (#0B1422)
    elevated: '#101B2C',    // Elevated (#101B2C)
    border: '#233247',      // Border (#233247)
    surfaceStrong: '#142238',
    overlay: 'rgba(5, 11, 20, 0.85)',
  },

  // Sovereign Warm Gold Accent Scale
  gold: {
    50: '#FBF8EE',
    100: '#F5EED5',
    200: '#ECDCAB',
    300: '#E0C078',   // Gold Light (#E0C078)
    400: '#C9A45C',   // Primary Sovereign Gold (#C9A45C)
    500: '#B8934A',   // Active / Hover Gold
    600: '#9A7B26',
    700: '#7E631B',
    800: '#5F4A13',
    900: '#42330B',
    glow: 'rgba(201, 164, 92, 0.18)',
    glowStrong: 'rgba(201, 164, 92, 0.35)',
  },

  // Neutral Silver & Slate Scale
  neutral: {
    50: '#FFFFFF',
    100: '#F4F6F8',   // Text Primary (#F4F6F8)
    200: '#E1E6EB',
    300: '#CBD5E1',
    400: '#97A4B5',   // Text Muted (#97A4B5)
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#050B14',
  },

  // Semantic Colors
  semantic: {
    success: {
      soft: 'rgba(16, 185, 129, 0.12)',
      border: 'rgba(16, 185, 129, 0.30)',
      text: '#34D399',
      solid: '#10B981',
    },
    warning: {
      soft: 'rgba(245, 158, 11, 0.12)',
      border: 'rgba(245, 158, 11, 0.30)',
      text: '#FBBF24',
      solid: '#F59E0B',
    },
    danger: {
      soft: 'rgba(239, 68, 68, 0.12)',
      border: 'rgba(239, 68, 68, 0.30)',
      text: '#F87171',
      solid: '#EF4444',
    },
    info: {
      soft: 'rgba(56, 189, 248, 0.12)',
      border: 'rgba(56, 189, 248, 0.30)',
      text: '#38BDF8',
      solid: '#0EA5E9',
    },
  },
} as const;

export const semanticColors = {
  // Backgrounds & Surfaces
  bgBase: rawColors.navy.base,
  bgSurface: rawColors.navy.surface,
  bgElevated: rawColors.navy.elevated,
  bgSurfaceStrong: rawColors.navy.surfaceStrong,
  bgOverlay: rawColors.navy.overlay,

  // Text
  textPrimary: rawColors.neutral[100], // #F4F6F8
  textSecondary: rawColors.neutral[300],
  textMuted: rawColors.neutral[400],   // #97A4B5
  textSubtle: rawColors.neutral[500],
  textInverse: rawColors.neutral[950],
  textGold: rawColors.gold[400],       // #C9A45C
  textGoldLight: rawColors.gold[300],  // #E0C078

  // Borders & Dividers
  borderSubtle: '#233247',
  borderDefault: '#233247',
  borderStrong: 'rgba(201, 164, 92, 0.30)',
  borderGold: 'rgba(201, 164, 92, 0.40)',
  borderGoldFocus: '#C9A45C',

  // Interactive Accents
  accentPrimary: rawColors.gold[400],
  accentHover: rawColors.gold[300],
  accentActive: rawColors.gold[500],
  accentSubtle: 'rgba(201, 164, 92, 0.12)',
  accentText: rawColors.navy.base,

  // Status
  statusSuccess: rawColors.semantic.success,
  statusWarning: rawColors.semantic.warning,
  statusDanger: rawColors.semantic.danger,
  statusInfo: rawColors.semantic.info,
} as const;

export type RawColorPalette = typeof rawColors;
export type SemanticColorPalette = typeof semanticColors;
