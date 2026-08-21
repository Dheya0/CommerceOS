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
export function generateDesignTokens(primaryHex: string, style: ThemeStyle = 'modern', isDark = false): DesignTokens {
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

  if (isDark) {
    return {
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
  }

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

  return {
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

export const PRESET_COLOR_PALETTES = [
  { id: 'gold_royal', name: 'الملكي الذهبي', nameEn: 'Royal Gold', hex: '#D4A017', secondary: '#1E293B', style: 'luxury' as ThemeStyle },
  { id: 'amber_honey', name: 'عسل نقي', nameEn: 'Amber Honey', hex: '#E69500', secondary: '#78350F', style: 'organic' as ThemeStyle },
  { id: 'espresso_coffee', name: 'قهوة داكنة', nameEn: 'Dark Espresso', hex: '#6F4E37', secondary: '#D97706', style: 'modern' as ThemeStyle },
  { id: 'emerald_luxury', name: 'زمرد فاخر', nameEn: 'Emerald Luxe', hex: '#0F766E', secondary: '#D4A017', style: 'luxury' as ThemeStyle },
  { id: 'sapphire_blue', name: 'أزرق تقني', nameEn: 'Sapphire Tech', hex: '#2563EB', secondary: '#0F172A', style: 'bold' as ThemeStyle },
  { id: 'crimson_fashion', name: 'قرمزي جذاب', nameEn: 'Crimson Chic', hex: '#BE123C', secondary: '#1E293B', style: 'classic' as ThemeStyle },
  { id: 'noir_minimal', name: 'أسود كلاسيكي', nameEn: 'Noir Minimal', hex: '#18181B', secondary: '#71717A', style: 'minimal' as ThemeStyle },
  { id: 'violet_perfume', name: 'بنفسجي ملكي', nameEn: 'Royal Violet', hex: '#7C3AED', secondary: '#F59E0B', style: 'luxury' as ThemeStyle },
  { id: 'sage_organic', name: 'أخضر عضوي', nameEn: 'Sage Organic', hex: '#15803D', secondary: '#A16207', style: 'organic' as ThemeStyle }
];

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
