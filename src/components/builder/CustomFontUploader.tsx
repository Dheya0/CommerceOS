import React, { useState } from 'react';
import { Upload, Type, Search, Check, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { CustomFontConfig, FontFamily, StoreTheme } from '../../types';
import { FONTS_CONFIG } from '../../utils/themeEngine';
import { POPULAR_GOOGLE_FONTS, injectCustomUploadedFont, injectGoogleFont } from '../../utils/fontManager';

interface CustomFontUploaderProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
}

export const CustomFontUploader: React.FC<CustomFontUploaderProps> = ({ draftTheme, onThemeChange }) => {
  const [activeFontTab, setActiveFontTab] = useState<'catalog' | 'google' | 'upload'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [sampleText, setSampleText] = useState('متجرك الأنيق يبدأ بلمسة إبداع فريدة');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Handle standard font selection
  const handleSelectStandardFont = (fKey: FontFamily) => {
    onThemeChange(prev => ({
      ...prev,
      fontFamily: fKey,
      customFont: undefined
    }));
  };

  // Handle curated Google font selection
  const handleSelectGoogleFont = (fontFamilyName: string) => {
    injectGoogleFont(fontFamilyName);
    onThemeChange(prev => ({
      ...prev,
      customFont: {
        type: 'google',
        name: fontFamilyName,
        cssFamily: `"${fontFamilyName}", sans-serif`
      }
    }));
  };

  // Handle custom Google font input
  const handleApplyCustomGoogle = () => {
    if (!customGoogleName.trim()) return;
    const name = customGoogleName.trim();
    injectGoogleFont(name);
    onThemeChange(prev => ({
      ...prev,
      customFont: {
        type: 'google',
        name,
        cssFamily: `"${name}", sans-serif`
      }
    }));
    setUploadSuccess(`تم تطبيق خط Google (${name}) بنجاح!`);
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // Handle custom font file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Validate extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['woff2', 'woff', 'ttf', 'otf'].includes(ext || '')) {
      setUploadError('يرجى رفع ملف خط بصيغة مدعومة (.woff2, .woff, .ttf, .otf)');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setUploadError('حجم ملف الخط يتجاوز الحد الأقصى المسموح (8 ميجابايت)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result as string;
      const cleanFontName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_');
      
      const format = ext === 'ttf' ? 'truetype' : ext === 'otf' ? 'opentype' : ext;
      injectCustomUploadedFont(cleanFontName, base64Data, format);

      onThemeChange(prev => ({
        ...prev,
        customFont: {
          type: 'upload',
          name: cleanFontName,
          base64Data,
          fileName: file.name,
          cssFamily: `'${cleanFontName}', sans-serif`
        }
      }));

      setUploadSuccess(`تم رفع وتفعيل الخط الخاص (${cleanFontName}) بنجاح!`);
      setTimeout(() => setUploadSuccess(null), 4000);
    };

    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة ملف الخط، يرجى المحاولة مجدداً');
    };

    reader.readAsDataURL(file);
  };

  // Filter Google fonts
  const filteredGoogleFonts = POPULAR_GOOGLE_FONTS.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.family.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isCurrentFont = (checkName: string) => {
    if (draftTheme.customFont) {
      return draftTheme.customFont.name.toLowerCase() === checkName.toLowerCase();
    }
    return draftTheme.fontFamily === checkName;
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      
      {/* Sub Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setActiveFontTab('catalog')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeFontTab === 'catalog' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>الخطوط الأساسية</span>
        </button>
        <button
          onClick={() => setActiveFontTab('google')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeFontTab === 'google' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>مكتبة Google Fonts</span>
        </button>
        <button
          onClick={() => setActiveFontTab('upload')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeFontTab === 'upload' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>رفع خط خاص</span>
        </button>
      </div>

      {/* Success / Error Messages */}
      {uploadSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}
      {uploadError && (
        <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Custom Font Badge */}
      {draftTheme.customFont && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="text-slate-300">الخط النشط حالياً:</span>
            <span className="font-bold text-amber-300">{draftTheme.customFont.name}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {draftTheme.customFont.type === 'upload' ? 'ملف خاص مرفوع' : 'Google Fonts'}
            </span>
          </div>
          <button
            onClick={() => handleSelectStandardFont('tajawal')}
            className="text-[10px] text-slate-400 hover:text-amber-400 underline underline-offset-2"
          >
            استعادة الخط الافتراضي
          </button>
        </div>
      )}

      {/* TAB 1: CATALOG */}
      {activeFontTab === 'catalog' && (
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-slate-300">
            كتالوج الخطوط المتكاملة مسبقاً (سريعة التحميل وخالية من التأخير)
          </label>
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {(Object.keys(FONTS_CONFIG) as FontFamily[]).map(fKey => {
              const f = FONTS_CONFIG[fKey];
              const selected = !draftTheme.customFont && draftTheme.fontFamily === fKey;
              return (
                <button
                  key={fKey}
                  onClick={() => handleSelectStandardFont(fKey)}
                  className={`w-full p-3 rounded-xl border text-right transition-all ${
                    selected
                      ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">{f.nameAr}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {f.category}
                    </span>
                  </div>
                  <div 
                    className="text-xs my-1.5 font-bold text-slate-100 line-clamp-1"
                    style={{ fontFamily: f.cssFamily }}
                  >
                    {f.previewText}
                  </div>
                  <div className="text-[10px] text-slate-500">{f.description}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE FONTS */}
      {activeFontTab === 'google' && (
        <div className="space-y-4">
          {/* Custom Google Font Direct Entry */}
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <label className="text-xs font-bold text-slate-200 block">
              إدخال أي اسم خط من Google Fonts مباشرةً
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customGoogleName}
                onChange={(e) => setCustomGoogleName(e.target.value)}
                placeholder="مثال: Cairo, Almarai, Scheherazade New..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={handleApplyCustomGoogle}
                className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0 transition-colors"
              >
                تطبيق الخط
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              سيقوم النظام بحقن استدعاء الخط ديناميكياً من خوادم Google Fonts وتحميل جميع الأوزان فوراً.
            </p>
          </div>

          {/* Search Curated Google Fonts */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في أشهر خطوط Google العربية والإنجليزية..."
                className="w-full pr-8 pl-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {filteredGoogleFonts.map(gf => {
                const isSelected = draftTheme.customFont?.name === gf.family;
                return (
                  <button
                    key={gf.family}
                    onClick={() => handleSelectGoogleFont(gf.family)}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-amber-300 truncate">{gf.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div 
                      className="text-xs text-slate-200 my-1 line-clamp-1"
                      style={{ fontFamily: `"${gf.family}", sans-serif` }}
                    >
                      تجربة الخط العربي والإنجليزي 123
                    </div>
                    <span className="text-[10px] text-slate-500">{gf.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOM FILE UPLOAD */}
      {activeFontTab === 'upload' && (
        <div className="space-y-4">
          <div className="p-6 border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-2xl bg-slate-950/80 text-center transition-all cursor-pointer relative group">
            <input
              type="file"
              accept=".woff2,.woff,.ttf,.otf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-bold text-slate-200 mb-1">
              اسحب وأفلت ملف الخط هنا، أو انقر للاختيار من جهازك
            </h4>
            <p className="text-[10px] text-slate-400 mb-2">
              يدعم ملفات الخطوط بصيغ: WOFF2, WOFF, TTF, OTF (حتى 8 ميجابايت)
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-mono">
              تشفير Base64 فوري ومحفوظ في إعدادات المتجر
            </span>
          </div>

          {draftTheme.customFont?.type === 'upload' && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">الملف المرفوع حالياً</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                  {draftTheme.customFont.fileName || 'font.woff2'}
                </span>
              </div>
              <div 
                className="p-3 bg-slate-900 rounded-lg text-center text-sm font-bold text-white"
                style={{ fontFamily: `'${draftTheme.customFont.name}', sans-serif` }}
              >
                بسم الله الرحمن الرحيم - تجربة الخط المرفوع
              </div>
            </div>
          )}
        </div>
      )}

      {/* Typography Scale & Live Test Box */}
      <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">مقياس التناسق الطباعي (Typography Scale)</label>
          <span className="text-[10px] text-amber-400 font-mono">
            {draftTheme.typographyScale || 'balanced'}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: 'compact', label: 'مضغوط (Compact)' },
            { id: 'balanced', label: 'متوازن (Balanced)' },
            { id: 'editorial', label: 'مجلة (Editorial)' },
            { id: 'bold', label: 'بارز (Bold)' }
          ].map(scale => (
            <button
              key={scale.id}
              onClick={() => onThemeChange(prev => ({ ...prev, typographyScale: scale.id as any }))}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                (draftTheme.typographyScale || 'balanced') === scale.id
                  ? 'border-amber-500 bg-amber-500/15 text-white'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {scale.label}
            </button>
          ))}
        </div>

        {/* Live Font Interactive Scratchpad */}
        <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400">حقل اختبار ومعاينة الخط مباشرة:</span>
            <button
              onClick={() => setSampleText('متجرك الأنيق يبدأ بلمسة إبداع فريدة')}
              className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>إعادة تعيين النص</span>
            </button>
          </div>
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="اكتب أي نص لاختبار جودة الخط والتباعد..."
          />
        </div>
      </div>

    </div>
  );
};
