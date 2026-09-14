import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Palette, 
  Sliders, 
  Layers, 
  Check, 
  Copy, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  Code, 
  ShoppingBag, 
  Zap, 
  SlidersHorizontal,
  ChevronRight,
  Sun,
  Moon,
  Maximize2
} from 'lucide-react';
import { 
  BaseColorPalette, 
  BasePaletteHarmonyMode, 
  ButtonVariantStyle, 
  CardVariantStyle, 
  RadiusPreset, 
  StoreTheme 
} from '../../types';
import { 
  convertTokensToCSS, 
  generateCohesiveDesignSystem, 
  generateDesignTokens, 
  generateHarmoniousPalette, 
  getDynamicBadgeStyles, 
  getDynamicButtonStyles, 
  getDynamicCardStyles, 
  getWcagAudit, 
  PRESET_COLOR_PALETTES 
} from '../../utils/themeEngine';

interface DynamicThemeEngineStudioProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const DynamicThemeEngineStudio: React.FC<DynamicThemeEngineStudioProps> = ({
  draftTheme,
  onThemeChange,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<'palette' | 'buttons' | 'cards' | 'accessibility' | 'css'>('palette');
  const [primaryColor, setPrimaryColor] = useState(draftTheme.tokens.primary || '#D4A017');
  const [secondaryColor, setSecondaryColor] = useState(draftTheme.tokens.secondary || '#1E293B');
  const [accentColor, setAccentColor] = useState(draftTheme.tokens.accent || '#F59E0B');
  const [backgroundColor, setBackgroundColor] = useState(draftTheme.tokens.background || '#FAF9F6');
  const [harmonyMode, setHarmonyMode] = useState<BasePaletteHarmonyMode>(
    draftTheme.basePalette?.harmonyMode || 'golden_ratio'
  );
  const [autoHarmonize, setAutoHarmonize] = useState(true);
  const [copiedCss, setCopiedCss] = useState(false);

  // Calculate WCAG Audit
  const wcagAudit = useMemo(() => {
    return getWcagAudit(draftTheme.tokens);
  }, [draftTheme.tokens]);

  // Overall compliance score
  const complianceScore = useMemo(() => {
    const total = wcagAudit.length;
    const passedAA = wcagAudit.filter(a => a.passAA).length;
    return Math.round((passedAA / total) * 100);
  }, [wcagAudit]);

  // Handle Primary Color Change
  const handlePrimaryChange = (hex: string) => {
    setPrimaryColor(hex);
    if (autoHarmonize) {
      const generated = generateCohesiveDesignSystem(
        { primary: hex, harmonyMode },
        {
          style: draftTheme.style,
          layout: draftTheme.layout,
          fontFamily: draftTheme.fontFamily,
          darkMode: draftTheme.darkMode,
          radius: draftTheme.radius,
          customRadiusPx: draftTheme.customRadiusPx,
          buttonStyle: draftTheme.buttonStyle,
          cardStyle: draftTheme.cardStyle
        }
      );
      setSecondaryColor(generated.tokens.secondary);
      setAccentColor(generated.tokens.accent);
      setBackgroundColor(generated.tokens.background);
      onThemeChange(() => generated);
    } else {
      const newTokens = generateDesignTokens(hex, draftTheme.style, draftTheme.darkMode, {
        secondary: secondaryColor,
        accent: accentColor,
        background: backgroundColor
      });
      onThemeChange(prev => ({
        ...prev,
        basePalette: {
          ...prev.basePalette,
          primary: hex,
          secondary: secondaryColor,
          accent: accentColor,
          background: backgroundColor,
          harmonyMode
        },
        tokens: newTokens
      }));
    }
  };

  // Handle Harmony Algorithm Change
  const handleHarmonyChange = (mode: BasePaletteHarmonyMode) => {
    setHarmonyMode(mode);
    const generated = generateCohesiveDesignSystem(
      { primary: primaryColor, harmonyMode: mode },
      {
        style: draftTheme.style,
        layout: draftTheme.layout,
        fontFamily: draftTheme.fontFamily,
        darkMode: draftTheme.darkMode,
        radius: draftTheme.radius,
        customRadiusPx: draftTheme.customRadiusPx,
        buttonStyle: draftTheme.buttonStyle,
        cardStyle: draftTheme.cardStyle
      }
    );
    setSecondaryColor(generated.tokens.secondary);
    setAccentColor(generated.tokens.accent);
    setBackgroundColor(generated.tokens.background);
    onThemeChange(() => generated);
    showToast(`تم تطبيق تناغم لوني: ${mode}`, 'info');
  };

  // Handle manual secondary change
  const handleSecondaryChange = (hex: string) => {
    setAutoHarmonize(false);
    setSecondaryColor(hex);
    onThemeChange(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        secondary: hex
      }
    }));
  };

  // Handle manual accent change
  const handleAccentChange = (hex: string) => {
    setAutoHarmonize(false);
    setAccentColor(hex);
    onThemeChange(prev => ({
      ...prev,
      tokens: {
        ...prev.tokens,
        accent: hex
      }
    }));
  };

  // Handle background tone presets
  const handleBackgroundPreset = (bg: string, isDark: boolean) => {
    setBackgroundColor(bg);
    const updatedTheme = generateCohesiveDesignSystem(
      { primary: primaryColor, secondary: secondaryColor, accent: accentColor, background: bg, harmonyMode },
      {
        style: draftTheme.style,
        darkMode: isDark,
        radius: draftTheme.radius,
        customRadiusPx: draftTheme.customRadiusPx,
        buttonStyle: draftTheme.buttonStyle,
        cardStyle: draftTheme.cardStyle
      }
    );
    onThemeChange(() => updatedTheme);
    showToast(isDark ? 'تم التبديل للوضع الليلي الفاخر 🌙' : 'تم التبديل للوضع النهاري الصافي ☀️', 'info');
  };

  // Preset Palettes selection
  const handleSelectPreset = (preset: typeof PRESET_COLOR_PALETTES[0]) => {
    setPrimaryColor(preset.hex);
    setHarmonyMode(preset.harmony || 'golden_ratio');
    const generated = generateCohesiveDesignSystem(
      { primary: preset.hex, secondary: preset.secondary, accent: preset.accent, harmonyMode: preset.harmony || 'golden_ratio' },
      {
        style: preset.style,
        darkMode: draftTheme.darkMode,
        radius: draftTheme.radius,
        customRadiusPx: draftTheme.customRadiusPx,
        buttonStyle: draftTheme.buttonStyle,
        cardStyle: draftTheme.cardStyle
      }
    );
    setSecondaryColor(generated.tokens.secondary);
    setAccentColor(generated.tokens.accent);
    setBackgroundColor(generated.tokens.background);
    onThemeChange(() => generated);
    showToast(`تم تطبيق نظام الألوان: ${preset.name}`, 'success');
  };

  // Handle Copy CSS Variables
  const handleCopyCSS = () => {
    const css = convertTokensToCSS(draftTheme);
    navigator.clipboard.writeText(css);
    setCopiedCss(true);
    showToast('تم نسخ متغيرات نظام التصميم CSS بنجاح!', 'success');
    setTimeout(() => setCopiedCss(false), 2000);
  };

  // Handle Export JSON
  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftTheme, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `design-system-${Date.now()}.json`);
    document.body.appendChild(dl);
    dl.click();
    dl.remove();
    showToast('تم تصدير ملف Design System JSON بنجاح!', 'success');
  };

  const currentRadius = draftTheme.customRadiusPx !== undefined ? draftTheme.customRadiusPx : 16;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      
      {/* Top Banner: Dynamic Theme Engine Indicator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">محرك توليد أنظمة التصميم الذكية</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Cohesive Design Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              حدد لوحة الألوان الأساسية وسيتم توليد نظام بصري متكامل ومتناسق لحظياً (أزرار، بطاقات، متغيرات CSS)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={handleCopyCSS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-sm"
          >
            {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCss ? 'تم النسخ' : 'نسخ CSS'}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto">
        {[
          { id: 'palette' as const, label: 'لوحة الألوان والتناغم', icon: Palette },
          { id: 'buttons' as const, label: 'أنماط الأزرار (Buttons)', icon: Sparkles },
          { id: 'cards' as const, label: 'أنماط البطاقات (Cards)', icon: Layers },
          { id: 'accessibility' as const, label: `التباين والمقروئية (${complianceScore}%)`, icon: ShieldCheck },
          { id: 'css' as const, label: 'متغيرات CSS المتولدة', icon: Code },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Base Palette & Harmony Engine */}
      {activeTab === 'palette' && (
        <div className="space-y-5">
          
          {/* 1. Base Swatch Master Controls */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>لوحة الألوان الأساسية (Base Color Palette)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoHarmonize}
                  onChange={(e) => setAutoHarmonize(e.target.checked)}
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-3.5 h-3.5"
                />
                <span className="text-[11px] text-slate-400">توليد التناغم تلقائياً</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Primary Anchor */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">اللون الأساسي (Primary)</span>
                  <span className="text-[10px] font-mono text-amber-400">{primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryChange(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">اللون الثانوي (Secondary)</span>
                  <span className="text-[10px] font-mono text-slate-400">{secondaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => handleSecondaryChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => handleSecondaryChange(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>

              {/* Accent Pop */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">اللون الترويجي (Accent)</span>
                  <span className="text-[10px] font-mono text-amber-400">{accentColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>

              {/* Background Base */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">الخلفية (Background)</span>
                  <span className="text-[10px] font-mono text-slate-400">{backgroundColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      onThemeChange(prev => ({
                        ...prev,
                        tokens: { ...prev.tokens, background: e.target.value }
                      }));
                    }}
                    className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent shrink-0"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => {
                      setBackgroundColor(e.target.value);
                      onThemeChange(prev => ({
                        ...prev,
                        tokens: { ...prev.tokens, background: e.target.value }
                      }));
                    }}
                    className="w-full px-2 py-1 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Harmony Algorithm Selector */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>خوارزمية التناغم الرياضي (Color Harmony Mode)</span>
              </label>
              <span className="text-[10px] font-mono text-slate-400">توليد متزن بصرياً</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'golden_ratio' as const, label: 'النسبة الذهبية الفاخرة', desc: 'دوران 137.5° مع ذهبي ملكي' },
                { id: 'complementary' as const, label: 'التناغم التكميلي المعاكس', desc: 'تباين فائق للفت الانتباه' },
                { id: 'triadic' as const, label: 'التناغم الثلاثي المتوازن', desc: 'توزيع لوني حيوي ثلاثي' },
                { id: 'analogous' as const, label: 'التناغم المتجاور الطبيعي', desc: 'درجات هادئة انسيابية متقاربة' },
                { id: 'split_complementary' as const, label: 'التكميلي المنقسم', desc: 'تباين غني مريح للعين' },
                { id: 'monochrome' as const, label: 'الأحادي المينيمال', desc: 'تدرجات نقية من نفس اللون' },
                { id: 'luxury' as const, label: 'النمط المخملي الملكي', desc: 'عاجي دافئ + ذهبي شامبانيا' },
                { id: 'vibrant' as const, label: 'النمط التجاري الحيوي', desc: 'تشبع عالي للمتاجر الحديثة' },
              ].map(h => {
                const isSelected = harmonyMode === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => handleHarmonyChange(h.id)}
                    className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/15 text-white font-bold shadow-sm'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold text-slate-200">{h.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <span className="text-[10px] text-slate-500">{h.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Curated Master Preset Palettes */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>أنظمة ألوان جاهزة ومحكمة (Curated Design Presets)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PRESET_COLOR_PALETTES.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPreset(p)}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 transition-all text-right flex flex-col gap-2 group"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: p.hex }} />
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: p.secondary }} />
                    <span className="w-2.5 h-2.5 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                    <span className="text-xs font-bold text-slate-200 mr-auto group-hover:text-amber-400 transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{p.hex}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Background & Theme Mode Toggles */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-200">النمط البصري العام والخلفيات</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleBackgroundPreset('#FAF9F6', false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#FAF9F6] border border-slate-300" />
                <div>
                  <div className="text-xs font-bold text-slate-200">عاجي فاخر (Warm Ivory)</div>
                  <div className="text-[10px] text-slate-500">نهاري ملكي هادئ</div>
                </div>
              </button>
              <button
                onClick={() => handleBackgroundPreset('#FFFFFF', false)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#FFFFFF] border border-slate-300" />
                <div>
                  <div className="text-xs font-bold text-slate-200">أبيض ناصع (Clean White)</div>
                  <div className="text-[10px] text-slate-500">مينيمال عصري</div>
                </div>
              </button>
              <button
                onClick={() => handleBackgroundPreset('#090E17', true)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#090E17] border border-slate-700" />
                <div>
                  <div className="text-xs font-bold text-slate-200">أوبسيديان ليلي (Obsidian)</div>
                  <div className="text-[10px] text-slate-500">مظلم عالي التباين</div>
                </div>
              </button>
              <button
                onClick={() => handleBackgroundPreset('#0F172A', true)}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-right flex items-center gap-2"
              >
                <div className="w-4 h-4 rounded-full bg-[#0F172A] border border-slate-700" />
                <div>
                  <div className="text-xs font-bold text-slate-200">كحلي ملكي (Royal Slate)</div>
                  <div className="text-[10px] text-slate-500">ليلي فخم للمجوهرات</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Dynamic Button Variants Showcase */}
      {activeTab === 'buttons' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">أنماط الأزرار التفاعلية المتولدة (Dynamic Button Variants)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تتولد هذه الأنماط آلياً وتتكيف مع اللون الأساسي والحواف والظلال في كامل صفحات المتجر
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                النمط النشط: {draftTheme.buttonStyle || 'solid'}
              </span>
            </div>

            {/* Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'solid' as const, label: 'مصمت نقي (Solid Primary)', desc: 'وضوح فائق ومقروئية قياسية' },
                { id: 'gradient' as const, label: 'تدرج انسيابي (Gradient Flow)', desc: 'تدرج لوني عميق من درجات علامتك' },
                { id: 'glow' as const, label: 'توهج نيون (Ambient Glow)', desc: 'إضاءة محيطية ساحرة للفت الانتباه' },
                { id: 'outline' as const, label: 'إطار مفرغ (Chic Outline)', desc: 'خلفية شفافة مع خط محيطي جذاب' },
                { id: 'glass' as const, label: 'زجاجي بلوري (Frosted Glass)', desc: 'شفافية عصرية مع Backdrop Blur' },
                { id: 'luxury_gold' as const, label: 'شامبانيا ذهبي (Royal Gold)', desc: 'لمعان معدني ملكي فخم' },
                { id: 'soft' as const, label: 'ناعم سطحي (Soft Surface)', desc: 'خلفية خفيفة ناعمة للعين' },
              ].map(btn => {
                const isSelected = (draftTheme.buttonStyle || 'solid') === btn.id;
                return (
                  <div
                    key={btn.id}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-md'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{btn.label}</span>
                      <button
                        onClick={() => onThemeChange(prev => ({ ...prev, buttonStyle: btn.id }))}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'النمط المعتمد ✓' : 'تعيين كافتراضي'}
                      </button>
                    </div>

                    {/* Live Button Preview */}
                    <div className="pt-1">
                      <button
                        style={getDynamicButtonStyles(draftTheme, btn.id)}
                        className="w-full py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>إضافة للسلة • 240 ر.س</span>
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500">{btn.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badges and Tags live showcase */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-200">شارات ووسوم المتجر (Badges & Pills)</h4>
            <div className="flex flex-wrap items-center gap-2">
              <span style={getDynamicBadgeStyles(draftTheme, 'primary')} className="px-3 py-1 rounded-full text-xs font-bold border">
                الأكثر طلباً ⭐
              </span>
              <span style={getDynamicBadgeStyles(draftTheme, 'accent')} className="px-3 py-1 rounded-full text-xs font-bold border">
                خصم 25% حصري 🔥
              </span>
              <span style={getDynamicBadgeStyles(draftTheme, 'secondary')} className="px-3 py-1 rounded-full text-xs font-bold border">
                شحن مجاني 🚚
              </span>
              <span style={getDynamicBadgeStyles(draftTheme, 'outline')} className="px-3 py-1 rounded-full text-xs font-bold border">
                ضمان أصلي 100% 🛡️
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Dynamic Card Styles Showcase */}
      {activeTab === 'cards' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">أنماط وخامات البطاقات المتولدة (Dynamic Card Styles)</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  انعكاس مباشر لعمق وظلال وخامات بطاقات المنتجات والأقسام
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400 font-bold">
                النمط النشط: {draftTheme.cardStyle || 'elevated'}
              </span>
            </div>

            {/* Card Styles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { id: 'elevated' as const, label: 'مرتفعة ثلاثية الأبعاد (Elevated 3D)', desc: 'ظلال ناعمة تمنح البطاقة عمقاً طبيعياً' },
                { id: 'glass' as const, label: 'زجاجي بلوري (Glassmorphism)', desc: 'شفافية بلورية مع ضبابية الخلفية Blur' },
                { id: 'bordered' as const, label: 'محددة بإطار صريح (Bordered)', desc: 'خطوط واضحة ونقية لأسلوب عصري' },
                { id: 'luxurious_gold' as const, label: 'إطار ذهبي فاخر (Royal Gold Border)', desc: 'إطار ذهبي نحاسي ناعم لمنتجات النخبة' },
                { id: 'minimal' as const, label: 'مينيمال مسطح (Minimal Clean)', desc: 'خالي من الظلال بأسلوب اسكندنافي' },
                { id: 'inset_subtle' as const, label: 'عمق داخلي غائر (Inset Depth)', desc: 'ظلال داخلية ناعمة تعزز التركيز' },
              ].map(card => {
                const isSelected = (draftTheme.cardStyle || 'elevated') === card.id;
                return (
                  <div
                    key={card.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                      isSelected ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{card.label}</span>
                      <button
                        onClick={() => onThemeChange(prev => ({ ...prev, cardStyle: card.id }))}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'المعتمد ✓' : 'تعيين'}
                      </button>
                    </div>

                    {/* Live Card Component Preview */}
                    <div 
                      style={getDynamicCardStyles(draftTheme, card.id)}
                      className="p-3.5 border transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold shrink-0">
                          🍯
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className="text-xs font-bold text-slate-100 truncate">عسل السدر الجبلي الملكي</h5>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-black text-amber-400">380 ر.س</span>
                            <span style={getDynamicBadgeStyles(draftTheme, 'primary')} className="text-[9px] px-1.5 py-0.5 rounded-md border font-bold">
                              جديد
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-500">{card.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WCAG Accessibility & Contrast Auditor */}
      {activeTab === 'accessibility' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>تدقيق التباين ومقاييس إمكانية الوصول (WCAG AA & AAA Audit)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  فحص تلقائي لنسب التباين اللوني بين النصوص والخلفيات لضمان سهولة القراءة وتجربة تسوق مريحة للعين
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-bold text-slate-300">نسبة التوافق:</span>
                <span className={`text-xs font-mono font-black ${complianceScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {complianceScore}%
                </span>
              </div>
            </div>

            {/* Audit Matrix Table */}
            <div className="space-y-2">
              {wcagAudit.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-1 space-x-reverse">
                      <span className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color1 }} />
                      <span className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: item.color2 }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.pairAr}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.pair}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                      {item.ratio}:1
                    </span>

                    {/* AA Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                      item.passAA
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    }`}>
                      {item.passAA ? 'AA مطابق ✓' : 'AA غير مطابق ✗'}
                    </span>

                    {/* AAA Badge */}
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold border ${
                      item.passAAA
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-black'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}>
                      {item.passAAA ? 'AAA ممتاز 🌟' : 'AAA عادي'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Generated Live CSS Variables Block */}
      {activeTab === 'css' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>كود متغيرات CSS المتولدة لنظام التصميم (:root Variables)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  يتم حقن هذه المتغيرات تلقائياً في جذر المتجر والاستوديو لتوفير تناسق شامل
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCSS}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  {copiedCss ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCss ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-300 leading-relaxed overflow-x-auto dir-ltr text-left max-h-[380px]">
              {convertTokensToCSS(draftTheme)}
            </pre>
          </div>
        </div>
      )}

      {/* Bottom Floating Affirmation Button */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="text-right">
          <div className="text-xs font-bold text-white">تثبيت وتطبيق النظام الشامل عبر المتجر</div>
          <div className="text-[10px] text-slate-400">
            تحديث الواجهة الأمامية، صفحات المنتجات، السلة، واستوديو التصميم بنقرة واحدة
          </div>
        </div>

        <button
          onClick={() => {
            onThemeChange(prev => ({ ...prev }));
            showToast('تم اعتماد وتطبيق نظام التصميم المتكامل عبر كامل صفحات المتجر والاستوديو! 🚀✨', 'success');
          }}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>تطبيق النظام الشامل (Apply System-Wide)</span>
        </button>
      </div>

    </div>
  );
};
