import { BusinessType, DesignTokens, FontFamily, RadiusPreset, StoreTheme, ThemeLayout, ThemeStyle } from '../types';

// Convert hex to HSL and adjust
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

// Generate complete Design Token System from primary color & style
export function generateDesignTokens(
  primaryHex: string, 
  style: ThemeStyle = 'modern', 
  isDark = false,
  overrides?: Partial<DesignTokens>
): DesignTokens {
  const { h, s, l } = hexToHSL(primaryHex);

  const primary = primaryHex;
  const primaryHover = hslToHex(h, s, Math.max(10, l - 8));
  const primaryLight = hslToHex(h, Math.min(100, s + 10), Math.min(95, l + 30));
  const primaryDark = hslToHex(h, s, Math.max(5, l - 25));

  // Complementary or harmonious accent
  const accentH = (h + 35) % 360;
  const accent = hslToHex(accentH, Math.min(90, s + 15), 52);

  // Secondary tone
  const secondaryH = (h + 180) % 360;
  const secondary = hslToHex(secondaryH, Math.max(15, s - 30), isDark ? 65 : 35);

  let baseTokens: DesignTokens;

  if (isDark) {
    baseTokens = {
      primary,
      primaryHover,
      primaryLight,
      primaryDark,
      secondary,
      accent,
      background: '#0a0f1d',
      surface: '#111827',
      surfaceMuted: '#1f293d',
      text: '#f8fafc',
      textMuted: '#94a3b8',
      border: '#1e293b',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    };
  } else {
    // Light Mode variations based on style
    let bg = '#ffffff';
    let surface = '#f8fafc';
    let surfaceMuted = '#f1f5f9';
    let border = '#e2e8f0';

    if (style === 'luxury') {
      bg = '#faf9f6'; // Warm ivory luxury background
      surface = '#ffffff';
      surfaceMuted = '#f4f1ea';
      border = '#e8e2d5';
    } else if (style === 'organic') {
      bg = '#faf8f5';
      surface = '#ffffff';
      surfaceMuted = '#f0ebe1';
      border = '#e2dbcd';
    } else if (style === 'minimal') {
      bg = '#ffffff';
      surface = '#fafafa';
      surfaceMuted = '#f4f4f5';
      border = '#ebebeb';
    }

    baseTokens = {
      primary,
      primaryHover,
      primaryLight,
      primaryDark,
      secondary,
      accent,
      background: bg,
      surface,
      surfaceMuted,
      text: '#0f172a',
      textMuted: '#64748b',
      border,
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444'
    };
  }

  if (overrides) {
    return { ...baseTokens, ...overrides };
  }

  return baseTokens;
}

/**
 * Derives a full harmonic palette based on an anchor color and mood
 */
export function generateHarmoniousPalette(baseHex: string, mood: 'vibrant' | 'luxury' | 'pastel' | 'monochrome' = 'luxury'): Partial<DesignTokens> {
  const { h, s, l } = hexToHSL(baseHex);
  
  if (mood === 'monochrome') {
    return {
      primary: baseHex,
      primaryHover: hslToHex(h, s, Math.max(10, l - 10)),
      primaryLight: hslToHex(h, Math.max(5, s - 20), Math.min(96, l + 25)),
      primaryDark: hslToHex(h, s, Math.max(5, l - 25)),
      secondary: hslToHex(h, 15, 30),
      accent: hslToHex(h, 25, 45),
      surfaceMuted: hslToHex(h, 8, 95),
      border: hslToHex(h, 10, 88)
    };
  }

  if (mood === 'luxury') {
    const goldAccentH = 43; // Rich warm champagne gold
    return {
      primary: baseHex,
      primaryHover: hslToHex(h, s, Math.max(10, l - 8)),
      primaryLight: hslToHex(h, s, Math.min(94, l + 28)),
      primaryDark: hslToHex(h, s, Math.max(5, l - 22)),
      secondary: hslToHex((h + 20) % 360, Math.min(70, s + 10), 25),
      accent: hslToHex(goldAccentH, 85, 48),
      background: '#faf9f6',
      surface: '#ffffff',
      surfaceMuted: '#f5f2eb',
      border: '#e8e2d6'
    };
  }

  if (mood === 'vibrant') {
    return {
      primary: baseHex,
      primaryHover: hslToHex(h, Math.min(100, s + 10), Math.max(15, l - 10)),
      primaryLight: hslToHex(h, 85, 92),
      primaryDark: hslToHex(h, 95, 25),
      secondary: hslToHex((h + 160) % 360, 85, 45),
      accent: hslToHex((h + 60) % 360, 95, 50),
      background: '#ffffff',
      surface: '#ffffff',
      surfaceMuted: '#f8fafc',
      border: '#e2e8f0'
    };
  }

  // pastel / calm
  return {
    primary: baseHex,
    primaryHover: hslToHex(h, Math.max(30, s - 10), Math.max(20, l - 10)),
    primaryLight: hslToHex(h, 45, 93),
    primaryDark: hslToHex(h, 55, 30),
    secondary: hslToHex((h + 40) % 360, 45, 60),
    accent: hslToHex((h + 180) % 360, 40, 65),
    background: '#fdfcfb',
    surface: '#ffffff',
    surfaceMuted: '#f7f5f2',
    border: '#ebe6df'
  };
}

/**
 * Converts design tokens to readable CSS Variables block
 */
export function convertTokensToCSS(theme: StoreTheme): string {
  const t = theme.tokens;
  const radius = theme.customRadiusPx !== undefined ? `${theme.customRadiusPx}px` : 
    theme.radius === 'none' ? '0px' :
    theme.radius === 'sm' ? '8px' :
    theme.radius === 'md' ? '16px' :
    theme.radius === 'lg' ? '24px' : '9999px';

  return `:root {
  /* Brand Colors */
  --color-primary: ${t.primary};
  --color-primary-hover: ${t.primaryHover};
  --color-primary-light: ${t.primaryLight};
  --color-primary-dark: ${t.primaryDark};
  --color-secondary: ${t.secondary};
  --color-accent: ${t.accent};

  /* Background & Surfaces */
  --color-background: ${t.background};
  --color-surface: ${t.surface};
  --color-surface-muted: ${t.surfaceMuted};
  --color-border: ${t.border};

  /* Typography Colors */
  --color-text: ${t.text};
  --color-text-muted: ${t.textMuted};

  /* Semantic Feedback */
  --color-success: ${t.success};
  --color-warning: ${t.warning};
  --color-danger: ${t.danger};

  /* Geometry & Layout */
  --border-radius: ${radius};
  --header-style: ${theme.headerStyle};
  --card-style: ${theme.cardStyle};
}`;
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
    '--color-secondary': 'secondary',
    '--color-accent': 'accent',
    '--color-background': 'background',
    '--color-surface': 'surface',
    '--color-surface-muted': 'surfaceMuted',
    '--color-border': 'border',
    '--color-text': 'text',
    '--color-text-muted': 'textMuted',
    '--color-success': 'success',
    '--color-warning': 'warning',
    '--color-danger': 'danger',
  };

  const lines = cssString.split('\n');
  for (const line of lines) {
    const match = line.match(/(--[\w-]+)\s*:\s*([^;]+);/);
    if (match) {
      const varName = match[1].trim();
      const value = match[2].trim();
      const tokenKey = mapping[varName];
      if (tokenKey && value.startsWith('#')) {
        result[tokenKey] = value;
      }
    }
  }

  return result;
}

export const PRESET_COLOR_PALETTES = [
  { id: 'gold_royal', name: 'الملكي الذهبي والعسلي', nameEn: 'Royal Gold & Amber', hex: '#D4A017', secondary: '#1E293B', style: 'luxury' as ThemeStyle },
  { id: 'amber_honey', name: 'عسل نقي وطبيعي', nameEn: 'Amber Honey', hex: '#E69500', secondary: '#78350F', style: 'organic' as ThemeStyle },
  { id: 'espresso_coffee', name: 'محامص البن المختص', nameEn: 'Dark Espresso', hex: '#6F4E37', secondary: '#D97706', style: 'modern' as ThemeStyle },
  { id: 'emerald_luxury', name: 'زمرد إمبراطوري فاخر', nameEn: 'Imperial Emerald', hex: '#0F766E', secondary: '#D4A017', style: 'luxury' as ThemeStyle },
  { id: 'sapphire_blue', name: 'أزرق ياقوتي تقني', nameEn: 'Sapphire Ocean Tech', hex: '#2563EB', secondary: '#0F172A', style: 'bold' as ThemeStyle },
  { id: 'crimson_fashion', name: 'قرمزي مخملي للأزياء', nameEn: 'Crimson Velvet Chic', hex: '#BE123C', secondary: '#1E293B', style: 'classic' as ThemeStyle },
  { id: 'noir_minimal', name: 'أسود كربوني مينيمال', nameEn: 'Noir Obsidian', hex: '#18181B', secondary: '#71717A', style: 'minimal' as ThemeStyle },
  { id: 'violet_perfume', name: 'عود وبنفسجي ملكي', nameEn: 'Royal Violet & Oud', hex: '#7C3AED', secondary: '#F59E0B', style: 'luxury' as ThemeStyle },
  { id: 'sage_organic', name: 'زيتي وأخضر عضوي', nameEn: 'Sage & Olive Organic', hex: '#15803D', secondary: '#A16207', style: 'organic' as ThemeStyle },
  { id: 'terracotta_desert', name: 'طبيعي ترابي صحراوي', nameEn: 'Desert Terracotta', hex: '#C2410C', secondary: '#431407', style: 'organic' as ThemeStyle },
  { id: 'damascus_rose', name: 'وردي دمشقي أنيق', nameEn: 'Damascus Rose Atelier', hex: '#DB2777', secondary: '#4A044E', style: 'editorial' as ThemeStyle },
  { id: 'nordic_slate', name: 'رمادي شمالي ناصع', nameEn: 'Nordic Slate Clean', hex: '#334155', secondary: '#0284C7', style: 'modern' as ThemeStyle }
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
