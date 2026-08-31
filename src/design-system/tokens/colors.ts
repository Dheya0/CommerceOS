// Sovereign CommerceOS Design Tokens - Colors
// Deep Navy base, warm gold accent, neutral silver, and accessible semantics

export const rawColors = {
  // Deep Navy Backgrounds
  navy: {
    base: '#07111F',        // App background base
    elevated: '#0B1626',    // Sidebar, elevated containers
    surface: '#101C2C',     // Cards, main surfaces
    surfaceStrong: '#142238', // High-contrast surfaces, headers
    overlay: 'rgba(4, 10, 18, 0.82)',
  },

  // Sovereign Warm Gold Accent Scale
  gold: {
    50: '#FBF8EE',
    100: '#F5EED5',
    200: '#ECDCAB',
    300: '#E0C77A',
    400: '#D4AF37',   // Primary Sovereign Gold Accent
    500: '#C59B27',   // Gold Solid Button / Active State
    600: '#A9801C',
    700: '#846016',
    800: '#644714',
    900: '#483311',
    glow: 'rgba(212, 175, 55, 0.18)',
    glowStrong: 'rgba(212, 175, 55, 0.35)',
  },

  // Neutral Silver & Slate Scale (Balanced for contrast)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#060D17',
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
  bgElevated: rawColors.navy.elevated,
  bgSurface: rawColors.navy.surface,
  bgSurfaceStrong: rawColors.navy.surfaceStrong,
  bgOverlay: rawColors.navy.overlay,

  // Text
  textPrimary: rawColors.neutral[100],
  textSecondary: rawColors.neutral[300],
  textMuted: rawColors.neutral[400],
  textSubtle: rawColors.neutral[500],
  textInverse: rawColors.neutral[950],
  textGold: rawColors.gold[400],

  // Borders & Dividers
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderDefault: 'rgba(255, 255, 255, 0.10)',
  borderStrong: 'rgba(255, 255, 255, 0.18)',
  borderGold: 'rgba(212, 175, 55, 0.40)',
  borderGoldFocus: '#D4AF37',

  // Interactive Accents
  accentPrimary: rawColors.gold[500],
  accentHover: rawColors.gold[400],
  accentActive: rawColors.gold[600],
  accentSubtle: 'rgba(212, 175, 55, 0.12)',
  accentText: rawColors.navy.base,

  // Status
  statusSuccess: rawColors.semantic.success,
  statusWarning: rawColors.semantic.warning,
  statusDanger: rawColors.semantic.danger,
  statusInfo: rawColors.semantic.info,
} as const;

export type RawColorPalette = typeof rawColors;
export type SemanticColorPalette = typeof semanticColors;
