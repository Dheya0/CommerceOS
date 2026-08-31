// Sovereign CommerceOS Design Tokens - Spacing, Radius, Shadows, Glass, Glow, Motion, Z-Index & Breakpoints

export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const radius = {
  none: '0px',
  xs: '4px',
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '20px',
  pill: '9999px',
} as const;

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.25)',
  sm: '0 2px 4px 0 rgba(0, 0, 0, 0.35)',
  md: '0 4px 12px -1px rgba(0, 0, 0, 0.45)',
  lg: '0 10px 24px -3px rgba(0, 0, 0, 0.55)',
  xl: '0 20px 35px -5px rgba(0, 0, 0, 0.65)',
  gold: '0 4px 20px -2px rgba(212, 175, 55, 0.25)',
} as const;

export const glass = {
  subtle: {
    background: 'rgba(16, 28, 44, 0.45)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255, 255, 255, 0.07)',
  },
  medium: {
    background: 'rgba(16, 28, 44, 0.70)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
  strong: {
    background: 'rgba(11, 22, 38, 0.88)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(212, 175, 55, 0.20)',
  },
} as const;

export const glow = {
  goldGlow: '0 0 24px rgba(212, 175, 55, 0.22)',
  focusGlow: '0 0 0 2px #07111F, 0 0 0 4px rgba(212, 175, 55, 0.65)',
  premiumGlow: '0 0 40px -10px rgba(212, 175, 55, 0.30)',
  ambientGlow: 'radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.08) 0%, transparent 70%)',
} as const;

export const motion = {
  duration: {
    instant: '75ms',
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
} as const;

export const zIndex = {
  base: 0,
  header: 40,
  sticky: 30,
  dropdown: 50,
  popover: 60,
  drawer: 70,
  modal: 80,
  toast: 90,
  critical: 100,
} as const;

export const breakpoints = {
  mobile: '320px',
  tablet: '640px',
  desktop: '1024px',
  wide: '1440px',
} as const;
