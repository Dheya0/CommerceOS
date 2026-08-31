// Sovereign CommerceOS Design Tokens - Typography

export const typography = {
  fonts: {
    arabic: "'IBM Plex Sans Arabic', 'Alexandria', system-ui, -apple-system, sans-serif",
    english: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  scale: {
    display: {
      fontSize: '2.5rem',      // 40px
      lineHeight: '1.2',
      fontWeight: '800',
      letterSpacing: '-0.025em',
    },
    h1: {
      fontSize: '2rem',        // 32px
      lineHeight: '1.25',
      fontWeight: '700',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '1.5rem',      // 24px
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '-0.015em',
    },
    h3: {
      fontSize: '1.25rem',     // 20px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '-0.01em',
    },
    bodyLarge: {
      fontSize: '1.125rem',    // 18px
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0',
    },
    body: {
      fontSize: '1rem',        // 16px
      lineHeight: '1.6',
      fontWeight: '400',
      letterSpacing: '0',
    },
    bodySmall: {
      fontSize: '0.875rem',    // 14px
      lineHeight: '1.5',
      fontWeight: '400',
      letterSpacing: '0',
    },
    caption: {
      fontSize: '0.75rem',     // 12px
      lineHeight: '1.4',
      fontWeight: '500',
      letterSpacing: '0.01em',
    },
    label: {
      fontSize: '0.8125rem',   // 13px
      lineHeight: '1.4',
      fontWeight: '600',
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.6875rem',   // 11px
      lineHeight: '1.3',
      fontWeight: '700',
      letterSpacing: '0.08em',
      textTransform: 'uppercase' as const,
    },
  },
} as const;

export type TypographyTokens = typeof typography;
