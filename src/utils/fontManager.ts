import { CustomFontConfig, FontFamily, StoreTheme } from '../types';
import { FONTS_CONFIG } from './themeEngine';

export interface PopularGoogleFont {
  name: string;
  family: string;
  category: string;
  language: 'ar' | 'en' | 'both';
}

export const POPULAR_GOOGLE_FONTS: PopularGoogleFont[] = [
  { name: 'تجوال (Tajawal)', family: 'Tajawal', category: 'نسخي فاخر', language: 'both' },
  { name: 'الإسكندرية (Alexandria)', family: 'Alexandria', category: 'عصري هندسي', language: 'both' },
  { name: 'القاهرة (Cairo)', family: 'Cairo', category: 'عريض قوي', language: 'both' },
  { name: 'المراعي (Almarai)', family: 'Almarai', category: 'واضح تجاري', language: 'ar' },
  { name: 'ريدكس برو (Readex Pro)', family: 'Readex Pro', category: 'تقني ناعم', language: 'both' },
  { name: 'آي بي إم بلكس (IBM Plex Sans Arabic)', family: 'IBM Plex Sans Arabic', category: 'مؤسسي واثق', language: 'both' },
  { name: 'المسيري (El Messiri)', family: 'El Messiri', category: 'جمالي ناعم', language: 'ar' },
  { name: 'أميري (Amiri)', family: 'Amiri', category: 'كلاسيكي تراثي', language: 'ar' },
  { name: 'تشانغا (Changa)', family: 'Changa', category: 'هندسي جريء', language: 'both' },
  { name: 'مرحي (Marhey)', family: 'Marhey', category: 'مرح ومبهج', language: 'ar' },
  { name: 'لاليزار (Lalezar)', family: 'Lalezar', category: 'عناوين ضخمة', language: 'ar' },
  { name: 'نوتو كوفي (Noto Kufi Arabic)', family: 'Noto Kufi Arabic', category: 'كوفي رسمي', language: 'ar' },
  { name: 'عارف رقعة (Aref Ruqaa)', family: 'Aref Ruqaa', category: 'رقعة إبداعي', language: 'ar' },
  { name: 'بلس جاكرتا (Plus Jakarta Sans)', family: 'Plus Jakarta Sans', category: 'لاتيني تقني', language: 'en' },
  { name: 'إنتر (Inter)', family: 'Inter', category: 'واجهات رقمية', language: 'en' },
  { name: 'بلايفير (Playfair Display)', family: 'Playfair Display', category: 'أناقة وسيريف', language: 'en' },
  { name: 'أوتفيت (Outfit)', family: 'Outfit', category: 'مودرن مينيمال', language: 'en' },
  { name: 'بوبينز (Poppins)', family: 'Poppins', category: 'هندسي دائري', language: 'en' },
];

/**
 * Injects a Google Font by name into the document <head>
 */
export function injectGoogleFont(fontFamilyName: string): string {
  if (typeof document === 'undefined') return fontFamilyName;
  
  const cleanFamily = fontFamilyName.replace(/["']/g, '').trim();
  const fontId = `google-font-${cleanFamily.toLowerCase().replace(/\s+/g, '-')}`;
  
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    const formattedQuery = cleanFamily.replace(/\s+/g, '+');
    link.href = `https://fonts.googleapis.com/css2?family=${formattedQuery}:wght@300;400;500;600;700;800;900&display=swap`;
    document.head.appendChild(link);
  }

  return `"${cleanFamily}", sans-serif`;
}

/**
 * Injects a custom font file (base64 data URL) into document <head> with @font-face
 */
export function injectCustomUploadedFont(fontName: string, base64Data: string, format: string = 'woff2'): string {
  if (typeof document === 'undefined') return fontName;
  
  const safeName = fontName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const styleId = `custom-uploaded-font-${safeName.toLowerCase()}`;
  
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    document.head.appendChild(styleEl);
  }

  styleEl.textContent = `
    @font-face {
      font-family: '${safeName}';
      src: url('${base64Data}') format('${format}');
      font-weight: 100 900;
      font-display: swap;
    }
  `;

  return `'${safeName}', sans-serif`;
}

/**
 * Resolves the effective font-family CSS string based on the theme settings
 */
export function getEffectiveFontFamily(theme: StoreTheme): string {
  if (theme.customFont) {
    if (theme.customFont.type === 'upload' && theme.customFont.base64Data) {
      return injectCustomUploadedFont(
        theme.customFont.name, 
        theme.customFont.base64Data, 
        theme.customFont.fileName?.endsWith('.ttf') ? 'truetype' : 
        theme.customFont.fileName?.endsWith('.otf') ? 'opentype' : 'woff2'
      );
    }
    if (theme.customFont.type === 'google' && theme.customFont.name) {
      return injectGoogleFont(theme.customFont.name);
    }
    if (theme.customFont.cssFamily) {
      return theme.customFont.cssFamily;
    }
  }

  const preset = FONTS_CONFIG[theme.fontFamily];
  if (preset) {
    return preset.cssFamily;
  }

  return 'Tajawal, sans-serif';
}
