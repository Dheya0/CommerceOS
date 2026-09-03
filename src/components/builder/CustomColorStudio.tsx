import React, { useState } from 'react';
import { Palette, Sparkles, Check, Sliders, Sun, Moon, ShieldCheck, AlertTriangle } from 'lucide-react';
import { DesignTokens, StoreTheme, ThemeStyle } from '../../types';
import { generateDesignTokens, generateHarmoniousPalette, PRESET_COLOR_PALETTES, hexToHSL } from '../../utils/themeEngine';

interface CustomColorStudioProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
}

export const CustomColorStudio: React.FC<CustomColorStudioProps> = ({ draftTheme, onThemeChange }) => {
  const [activeColorMode, setActiveColorMode] = useState<'presets' | 'advanced' | 'harmony'>('presets');
  
  const primaryHex = draftTheme.tokens?.primary || '#D4A017';
  const tokens = draftTheme.tokens || generateDesignTokens(primaryHex, draftTheme.style, draftTheme.darkMode);

  // Apply primary color with automatic re-generation of tokens
  const handlePrimaryChange = (hex: string) => {
    const newTokens = generateDesignTokens(hex, draftTheme.style, draftTheme.darkMode);
    onThemeChange(prev => ({
      ...prev,
      tokens: newTokens
    }));
  };

  // Granular override of a single design token (e.g. secondary, background, surface, text)
  const handleTokenOverride = (tokenKey: keyof DesignTokens, hex: string) => {
    onThemeChange(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        [tokenKey]: hex
      }
    }));
  };

  // Visual archetype change
  const handleStyleChange = (style: ThemeStyle) => {
    const newTokens = generateDesignTokens(primaryHex, style, draftTheme.darkMode);
    onThemeChange(prev => ({
      ...prev,
      style,
      tokens: newTokens
    }));
  };

  // Dark mode toggle
  const handleDarkModeToggle = (darkMode: boolean) => {
    const newTokens = generateDesignTokens(primaryHex, draftTheme.style, darkMode);
    onThemeChange(prev => ({
      ...prev,
      darkMode,
      tokens: newTokens
    }));
  };

  // Generate automated harmonic palette
  const handleApplyHarmony = (mood: 'vibrant' | 'luxury' | 'pastel' | 'monochrome') => {
    const harmonicOverrides = generateHarmoniousPalette(primaryHex, mood);
    onThemeChange(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        ...harmonicOverrides
      }
    }));
  };

  // Contrast Ratio Calculation for WCAG AA compliance check
  const getLuminance = (hex: string) => {
    const { l } = hexToHSL(hex);
    return l / 100;
  };

  const bgLum = getLuminance(tokens.background);
  const textLum = getLuminance(tokens.text);
  const contrastRatio = Math.round(((Math.max(bgLum, textLum) + 0.05) / (Math.min(bgLum, textLum) + 0.05)) * 10) / 10;
  const passesWCAG = contrastRatio >= 4.5;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Sub Mode Selector */}
      <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setActiveColorMode('presets')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeColorMode === 'presets' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>لوحات جاهزة (12)</span>
        </button>
        <button
          onClick={() => setActiveColorMode('harmony')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeColorMode === 'harmony' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>مولّد التناغم الذكي</span>
        </button>
        <button
          onClick={() => setActiveColorMode('advanced')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeColorMode === 'advanced' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>تخصيص حر دقيق</span>
        </button>
      </div>

      {/* Primary Brand Color Picker (Always visible) */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">لون العلامة الرئيسي (Primary Brand HEX)</label>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
            {primaryHex}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={primaryHex}
            onChange={(e) => handlePrimaryChange(e.target.value)}
            className="w-11 h-11 rounded-xl cursor-pointer bg-transparent border-0 shrink-0"
          />
          <input
            type="text"
            value={primaryHex}
            onChange={(e) => handlePrimaryChange(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
            placeholder="#D4A017"
          />
        </div>

        {/* Quick Swatches */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
          {['#D4A017', '#E69500', '#78350F', '#0F766E', '#2563EB', '#BE123C', '#18181B', '#7C3AED', '#15803D', '#C2410C', '#DB2777'].map(color => (
            <button
              key={color}
              onClick={() => handlePrimaryChange(color)}
              className="w-6 h-6 rounded-full shrink-0 border border-white/20 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-500"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* TAB 1: PRESET PALETTES */}
      {activeColorMode === 'presets' && (
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-300">
            لوحات الألوان المعتمدة للعلامات التجارية العربية (12 Master Palette)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_COLOR_PALETTES.map((pal) => {
              const isSelected = (draftTheme.tokens?.primary || '').toLowerCase() === (pal.hex || '').toLowerCase();
              return (
                <button
                  key={pal.id}
                  onClick={() => {
                    handlePrimaryChange(pal.hex);
                    handleStyleChange(pal.style);
                  }}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/15 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span 
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm border border-white/20" 
                      style={{ backgroundColor: pal.hex }} 
                    />
                    <span 
                      className="w-3 h-3 rounded-full shrink-0 border border-white/20" 
                      style={{ backgroundColor: pal.secondary }} 
                    />
                    <span className="text-[11px] font-bold truncate">{pal.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SMART HARMONY GENERATOR */}
      {activeColorMode === 'harmony' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-slate-200">توليد نغمات متوافقة رياضياً مع لونك الحالي</h4>
            <p className="text-[11px] text-slate-400">
              اختر الطابع وسيقوم المحرك بحساب درجات التشبع والإضاءة والتناغم اللوني تلقائياً:
            </p>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => handleApplyHarmony('luxury')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-amber-500/60 text-right transition-all group"
              >
                <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">تناغم ملكي (Luxury Champagne)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">درجات عاجية دافئة، تفاصيل ذهبية راقية</div>
              </button>
              <button
                onClick={() => handleApplyHarmony('vibrant')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-amber-500/60 text-right transition-all group"
              >
                <div className="text-xs font-bold text-sky-400 group-hover:text-sky-300">تناغم تقني مبهج (Vibrant Impact)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">تباين عالي ونشاط بصري للشاشات الحديثة</div>
              </button>
              <button
                onClick={() => handleApplyHarmony('pastel')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-amber-500/60 text-right transition-all group"
              >
                <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">تناغم هادئ وباستيل (Pastel Calm)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">أناقة ناعمة لمنتجات العناية والجمال والأزياء</div>
              </button>
              <button
                onClick={() => handleApplyHarmony('monochrome')}
                className="p-3 rounded-xl border border-slate-800 bg-slate-900 hover:border-amber-500/60 text-right transition-all group"
              >
                <div className="text-xs font-bold text-slate-300 group-hover:text-white">تناغم أحادي مينيمال (Monochrome)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">تركيز مطلق على صور المنتج والمحتوى</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ADVANCED INDIVIDUAL COLOR TOKEN OVERRIDES */}
      {activeColorMode === 'advanced' && (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            تعديل عناصر الهوية والرموز اللونية بشكل منفصل (Design Tokens)
          </label>
          <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-[340px] overflow-y-auto pr-1">
            {[
              { key: 'secondary' as const, label: 'اللون الثانوي (Secondary)', desc: 'الأزرار الثانوية والروابط والعناوين الفرعية' },
              { key: 'accent' as const, label: 'لون التمييز (Accent)', desc: 'شارات الخصم والعروض والنجوم' },
              { key: 'background' as const, label: 'خلفية الصفحة (Background)', desc: 'اللون الخلفي الرئيسي لكامل المتجر' },
              { key: 'surface' as const, label: 'خلفية البطاقات (Surface / Cards)', desc: 'خلفيات كروت المنتجات والأقسام' },
              { key: 'border' as const, label: 'لون الحدود والفواصل (Border)', desc: 'الخطوط الفاصلة وحواف البطاقات' },
              { key: 'text' as const, label: 'لون النصوص الرئيسي (Text Primary)', desc: 'العناوين وأسماء المنتجات' },
              { key: 'textMuted' as const, label: 'لون النصوص الفرعية (Text Muted)', desc: 'أوصاف المنتجات والنصوص التوضيحية' },
            ].map(item => {
              const curVal = tokens[item.key] || '#000000';
              return (
                <div key={item.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-900/70 border border-slate-800/80">
                  <div className="flex-1 pl-2">
                    <div className="text-xs font-bold text-slate-200">{item.label}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">{curVal}</span>
                    <input
                      type="color"
                      value={curVal}
                      onChange={(e) => handleTokenOverride(item.key, e.target.value)}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visual Style Archetypes */}
      <div>
        <label className="block text-xs font-bold text-slate-300 mb-2">طابع التصميم البصري (Design Archetype)</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'luxury', label: 'فاخر ملكي', sub: 'أناقة وعاج' },
            { id: 'modern', label: 'عصري ناصع', sub: 'خطوط بيضاء نقية' },
            { id: 'organic', label: 'طبيعي دافئ', sub: 'ألوان رملية وبيئية' },
            { id: 'minimal', label: 'مينيمال هادئ', sub: 'بساطة مطلقة' },
            { id: 'bold', label: 'جريء تقني', sub: 'تباين وقوة' },
            { id: 'classic', label: 'كلاسيكي عريق', sub: 'إيديتوريال متزن' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => handleStyleChange(s.id as ThemeStyle)}
              className={`p-2.5 rounded-xl border text-right transition-all ${
                draftTheme.style === s.id
                  ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-slate-200">{s.label}</div>
              <div className="text-[10px] text-slate-500">{s.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Dark Theme Toggle */}
      <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2.5">
          {draftTheme.darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          <div>
            <div className="text-xs font-bold text-slate-200">الوضع الليلي الفاخر (Dark Mode)</div>
            <div className="text-[10px] text-slate-500">تحويل خلفيات المتجر والقوائم إلى الوضع الداكن الأنيق</div>
          </div>
        </div>
        <input
          type="checkbox"
          checked={draftTheme.darkMode}
          onChange={(e) => handleDarkModeToggle(e.target.checked)}
          className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
        />
      </div>

      {/* WCAG Accessibility & Contrast Badge */}
      <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
        passesWCAG 
          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
          : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
      }`}>
        <div className="flex items-center gap-2">
          {passesWCAG ? <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
          <div>
            <div className="font-bold">
              {passesWCAG ? 'معيار المقروءة ممتاز (WCAG AA معتمد)' : 'مستوى التباين اللوني متوسط'}
            </div>
            <div className="text-[10px] opacity-80">
              نسبة تباين النص مع الخلفية: {contrastRatio}:1 (الحد الأدنى الموصى به 4.5:1)
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
