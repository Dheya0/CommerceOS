import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Layers, 
  Sparkles, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  RotateCcw, 
  Eye, 
  Check, 
  Layout, 
  Sun, 
  Moon, 
  Sliders, 
  Code, 
  Copy,
  ChevronRight,
  Store,
  Grid,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { FontFamily, RadiusPreset, StoreTheme, ThemeLayout, ThemeStyle } from '../../types';
import { generateDesignTokens, PRESET_COLOR_PALETTES, FONTS_CONFIG } from '../../utils/themeEngine';
import { ImageUploadCropper } from '../common/ImageUploadCropper';
import { StorefrontHeader } from '../storefront/StorefrontHeader';
import { 
  StorefrontHero, 
  StorefrontCategories, 
  StorefrontBenefits, 
  StorefrontTestimonials, 
  StorefrontFAQ, 
  StorefrontFooter 
} from '../storefront/StorefrontSections';
import { StorefrontProductGrid } from '../storefront/StorefrontProductGrid';

export const LiveDesignStudio: React.FC = () => {
  const { 
    activeTenant, 
    updateTheme, 
    updateTenant, 
    products, 
    categories, 
    showToast,
    setCurrentView
  } = useCommerce();

  // Local draft theme state
  const [draftTheme, setDraftTheme] = useState<StoreTheme>(activeTenant.theme);
  const [sections, setSections] = useState(activeTenant.sections || []);
  const [storeName, setStoreName] = useState(activeTenant.name || '');
  const [storeNameEn, setStoreNameEn] = useState(activeTenant.nameEn || '');
  const [slogan, setSlogan] = useState(activeTenant.slogan || '');
  const [logoUrl, setLogoUrl] = useState(activeTenant.logo || '');
  
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'branding' | 'code'>('colors');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Quick Preset Palettes
  const presets = [
    { name: 'Royal Gold & Amber', hex: '#D4A017', style: 'luxury' as ThemeStyle, font: 'tajawal' as FontFamily, layout: 'luxury' as ThemeLayout },
    { name: 'Golden Roast Coffee', hex: '#8B4513', style: 'organic' as ThemeStyle, font: 'alexandria' as FontFamily, layout: 'classic' as ThemeLayout },
    { name: 'Haute Silk & Rose', hex: '#BE185D', style: 'modern' as ThemeStyle, font: 'tajawal' as FontFamily, layout: 'modern' as ThemeLayout },
    { name: 'Imperial Dark Oud', hex: '#9333EA', style: 'luxury' as ThemeStyle, font: 'playfair' as FontFamily, layout: 'luxury' as ThemeLayout },
    { name: 'Cyber Blue Pro', hex: '#0284C7', style: 'modern' as ThemeStyle, font: 'jakarta' as FontFamily, layout: 'modern' as ThemeLayout },
    { name: 'Emerald Organic', hex: '#059669', style: 'organic' as ThemeStyle, font: 'alexandria' as FontFamily, layout: 'classic' as ThemeLayout },
  ];

  const primaryHex = draftTheme.tokens?.primary || '#D4A017';

  const handleColorChange = (hex: string) => {
    const newTokens = generateDesignTokens(hex, draftTheme.style, draftTheme.darkMode);
    setDraftTheme(prev => ({
      ...prev,
      tokens: newTokens
    }));
  };

  const handleStyleChange = (style: ThemeStyle) => {
    const newTokens = generateDesignTokens(primaryHex, style, draftTheme.darkMode);
    setDraftTheme(prev => ({
      ...prev,
      style,
      tokens: newTokens
    }));
  };

  const handleDarkModeToggle = (darkMode: boolean) => {
    const newTokens = generateDesignTokens(primaryHex, draftTheme.style, darkMode);
    setDraftTheme(prev => ({
      ...prev,
      darkMode,
      tokens: newTokens
    }));
  };

  const handleFontChange = (fontFamily: FontFamily) => {
    setDraftTheme(prev => ({ ...prev, fontFamily }));
  };

  const handleRadiusChange = (radius: RadiusPreset) => {
    setDraftTheme(prev => ({ ...prev, radius }));
  };

  const handleLayoutChange = (layout: ThemeLayout) => {
    setDraftTheme(prev => ({ ...prev, layout }));
  };

  const handleToggleSection = (sectionKey: string) => {
    setSections(prev =>
      prev.map(s => s.type === sectionKey ? { ...s, enabled: !s.enabled } : s)
    );
  };

  const handleSaveAll = () => {
    updateTheme(activeTenant.id, draftTheme);
    updateTenant(activeTenant.id, {
      name: storeName,
      nameEn: storeNameEn,
      slogan,
      logo: logoUrl,
      sections
    });
    showToast('تم حفظ ونشر إعدادات التصميم والهوية بنجاح! ✨', 'success');
  };

  const handleReset = () => {
    setDraftTheme(activeTenant.theme);
    setSections(activeTenant.sections || []);
    setStoreName(activeTenant.name || '');
    setStoreNameEn(activeTenant.nameEn || '');
    setSlogan(activeTenant.slogan || '');
    setLogoUrl(activeTenant.logo || '');
    showToast('تم استعادة التصميم الأصلي للمتجر', 'info');
  };

  const copyCSSVariables = () => {
    const tokens = draftTheme.tokens || generateDesignTokens('#D4A017', 'luxury', false);
    const css = `:root {
  --store-primary: ${tokens.primary};
  --store-primary-hover: ${tokens.primaryHover};
  --store-primary-light: ${tokens.primaryLight};
  --store-accent: ${tokens.accent};
  --store-bg: ${tokens.background};
  --store-surface: ${tokens.surface};
  --store-text: ${tokens.text};
  --store-border: ${tokens.border};
  --store-radius: ${draftTheme.radius === 'none' ? '0px' : draftTheme.radius === 'sm' ? '8px' : draftTheme.radius === 'md' ? '12px' : draftTheme.radius === 'lg' ? '18px' : '9999px'};
}`;
    navigator.clipboard.writeText(css);
    showToast('تم نسخ متغيرات CSS بنجاح!', 'success');
  };

  // Device frame class
  const getDeviceFrameClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[390px] h-[780px] rounded-3xl border-8 border-slate-800 ring-1 ring-slate-700 shadow-2xl overflow-y-auto';
      case 'tablet':
        return 'w-[740px] h-[820px] rounded-2xl border-4 border-slate-800 ring-1 ring-slate-700 shadow-2xl overflow-y-auto';
      case 'desktop':
      default:
        return 'w-full h-[850px] rounded-xl border border-slate-800 shadow-2xl overflow-y-auto';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* LEFT SIDE: Control Studio Panel */}
      <div className="w-full lg:w-[420px] xl:w-[460px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-md">
                <Palette className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Live Design Studio</h2>
                <p className="text-[10px] text-slate-400">محرر الثيمات المباشر لـ {activeTenant.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="إلغاء التعديلات واستعادة الإعدادات الأصلية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ ونشر</span>
              </button>
            </div>
          </div>

          {/* Sub Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'colors' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>الألوان</span>
            </button>
            <button
              onClick={() => setActiveTab('typography')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'typography' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-3 h-3" />
              <span>الخطوط</span>
            </button>
            <button
              onClick={() => setActiveTab('layout')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'layout' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layout className="w-3 h-3" />
              <span>الأقسام</span>
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'branding' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>الهوية</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'code' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>CSS Tokens</span>
            </button>
          </div>
        </div>

        {/* Panel Body Content */}
        <div className="p-5 space-y-6">
          
          {/* TAB 1: COLORS & PALETTES */}
          {activeTab === 'colors' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Presets Grid */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">لوحات الألوان المعتمدة (12 Palette)</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COLOR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      onClick={() => {
                        handleColorChange(pal.hex);
                        handleStyleChange(pal.style);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-right transition-all ${
                        (draftTheme.tokens?.primary || '').toLowerCase() === (pal.hex || '').toLowerCase()
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full shrink-0 shadow-sm border border-white/20" style={{ backgroundColor: pal.hex }} />
                        <span className="w-3 h-3 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: pal.secondary }} />
                        <span className="text-[11px] font-bold truncate">{pal.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Color Picker */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300">اللون الرئيسي للعلامة (Primary HEX)</label>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400">
                    {primaryHex}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryHex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryHex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                    placeholder="#D4A017"
                  />
                </div>
              </div>

              {/* Generated Palette Previews */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">نظام الألوان المتولد تلقائياً (Color Tokens)</label>
                <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                  <div className="p-2 rounded-lg border border-slate-800" style={{ backgroundColor: draftTheme.tokens.primary }}>
                    <span className="font-bold text-slate-950">Primary</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-800" style={{ backgroundColor: draftTheme.tokens.primaryLight }}>
                    <span className="font-bold text-slate-950">Light</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-800" style={{ backgroundColor: draftTheme.tokens.accent }}>
                    <span className="font-bold text-white">Accent</span>
                  </div>
                  <div className="p-2 rounded-lg border border-slate-800" style={{ backgroundColor: draftTheme.tokens.secondary }}>
                    <span className="font-bold text-white">Secondary</span>
                  </div>
                </div>
              </div>

              {/* Style archetype */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">طابع التصميم العام (Visual Archetype)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'luxury', label: 'فاخر ملكي (Luxury)', desc: 'أناقة راقية وهوامش واسعة' },
                    { id: 'modern', label: 'عصري ناصع (Modern)', desc: 'خطوط واضحة وبساطة عملية' },
                    { id: 'organic', label: 'طبيعي دافئ (Organic)', desc: 'ألوان ترابية ولمسات ناعمة' },
                    { id: 'minimal', label: 'مينيمال هادئ (Minimal)', desc: 'تركيز فائق على المنتجات' },
                    { id: 'bold', label: 'جريء تقني (Bold/Tech)', desc: 'تباين عالي وزوايا دقيقة' },
                    { id: 'classic', label: 'كلاسيكي إيديتوريال (Classic)', desc: 'أناقة المجلات والماركات' },
                  ].map(s => (
                    <button
                      key={s.id}
                      onClick={() => handleStyleChange(s.id as ThemeStyle)}
                      className={`p-3 rounded-xl border text-right transition-all ${
                        draftTheme.style === s.id
                          ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  {draftTheme.darkMode ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
                  <div>
                    <div className="text-xs font-bold text-slate-200">الوضع الليلي الفاخر (Dark Theme)</div>
                    <div className="text-[10px] text-slate-500">تحويل خلفيات المتجر إلى الوضع الداكن الأنيق</div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={draftTheme.darkMode}
                  onChange={(e) => handleDarkModeToggle(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

            </div>
          )}

          {/* TAB 2: TYPOGRAPHY & SHAPES */}
          {activeTab === 'typography' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Font Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">نوع الخط العربي والإنجليزي (10 Fonts Catalog)</label>
                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                  {(Object.keys(FONTS_CONFIG) as FontFamily[]).map(fKey => {
                    const f = FONTS_CONFIG[fKey];
                    return (
                      <button
                        key={fKey}
                        onClick={() => handleFontChange(fKey)}
                        className={`w-full p-3 rounded-xl border text-right transition-all ${
                          draftTheme.fontFamily === fKey
                            ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">{f.nameAr}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">{f.category}</span>
                        </div>
                        <div 
                          className="text-xs my-1 font-bold text-slate-200 line-clamp-1"
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

              {/* Corner Radius */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">استدارة الزوايا والحواف (Border Radius)</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'حادة', rad: '0px' },
                    { id: 'sm', label: 'ناعمة', rad: '8px' },
                    { id: 'md', label: 'متوسطة', rad: '16px' },
                    { id: 'lg', label: 'دائرية', rad: '24px' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleRadiusChange(r.id as RadiusPreset)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        draftTheme.radius === r.id
                          ? 'border-amber-500 bg-amber-500/15 text-amber-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{r.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{r.rad}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: LAYOUT & SECTIONS */}
          {activeTab === 'layout' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              
              {/* Layout Engine */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">تخطيط الصفحة الرئيسية (Layout Architecture)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'luxury', label: 'Luxury Hero Banner', desc: 'بانر عريض مع سرد مميز' },
                    { id: 'modern', label: 'Modern Clean Grid', desc: 'شبكة منتجات عصرية وسريعة' },
                    { id: 'editorial', label: 'Editorial Minimalist', desc: 'مساحات بيضاء نقية' },
                    { id: 'marketplace', label: 'High-Tech Marketplace', desc: 'بطاقات ديناميكية بصرية' },
                  ].map(l => (
                    <button
                      key={l.id}
                      onClick={() => handleLayoutChange(l.id as ThemeLayout)}
                      className={`p-3 rounded-xl border text-right transition-all ${
                        draftTheme.layout === l.id
                          ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-200">{l.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sections On/Off Switcher */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">إظهار وإخفاء أقسام المتجر (Store Sections)</label>
                <div className="space-y-2">
                  {sections.map(s => (
                    <div 
                      key={s.id || s.type}
                      className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-200">{s.title || s.titleEn || s.type}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wider">{s.type}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={s.enabled}
                        onChange={() => handleToggleSection(s.type)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: BRANDING */}
          {activeTab === 'branding' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المتجر بالعربية</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Store Name (English)</label>
                <input
                  type="text"
                  value={storeNameEn}
                  onChange={(e) => setStoreNameEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">شعار أو عبارة المتجر (Slogan)</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Enhanced Image Cropper */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-slate-300 mb-2">شعار المتجر والأيقونة (Logo & Favicon)</label>
                <ImageUploadCropper
                  initialImage={logoUrl}
                  onImageChange={(newLogo) => setLogoUrl(newLogo)}
                  isLogoMode={true}
                  cropTitle="قص وتعديل شعار المتجر"
                  accentColor={primaryHex}
                />
              </div>

            </div>
          )}

          {/* TAB 5: CSS CODE TOKENS */}
          {activeTab === 'code' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">مخرجات التصميم (CSS Design Tokens)</span>
                <button
                  onClick={copyCSSVariables}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ CSS</span>
                </button>
              </div>

              <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto">
{`:root {
  --store-primary: ${draftTheme.tokens.primary};
  --store-primary-hover: ${draftTheme.tokens.primaryHover};
  --store-primary-light: ${draftTheme.tokens.primaryLight};
  --store-accent: ${draftTheme.tokens.accent};
  --store-bg: ${draftTheme.tokens.background};
  --store-surface: ${draftTheme.tokens.surface};
  --store-text: ${draftTheme.tokens.text};
  --store-border: ${draftTheme.tokens.border};
}`}
              </pre>

              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs text-amber-200">
                💡 نظام Design Tokens يتم حقنه ديناميكياً في متجر العميل عند الحفظ بدون الحاجة لأي إعادة بناء أو نشر.
              </div>
            </div>
          )}

        </div>

      </div>

      {/* RIGHT SIDE: Interactive Real-Time Preview */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex flex-col items-center overflow-y-auto">
        
        {/* Preview Control Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">المعاينة الحية التفاعلية للمتجر (Live Storefront Preview)</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="عرض شاشة الكمبيوتر"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="عرض الجهاز اللوحي"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="عرض الجوال الذكي PWA"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>فتح كمتجر حي</span>
            </button>
          </div>
        </div>

        {/* Scaled Preview Frame */}
        <div className="w-full flex justify-center py-2">
          <div 
            className={`transition-all duration-300 ${getDeviceFrameClass()}`}
            style={{ 
              backgroundColor: draftTheme.tokens.background,
              color: draftTheme.tokens.text,
              fontFamily: draftTheme.fontFamily === 'tajawal' 
                ? 'Tajawal, sans-serif' 
                : draftTheme.fontFamily === 'alexandria'
                ? 'Alexandria, sans-serif'
                : draftTheme.fontFamily === 'playfair'
                ? 'Playfair Display, serif'
                : 'Plus Jakarta Sans, sans-serif'
            }}
          >
            {/* Storefront Header */}
            <StorefrontHeader 
              searchQuery=""
              onSearchChange={() => {}}
            />

            {/* Storefront Hero */}
            {sections.find(s => s.type === 'hero')?.enabled !== false && (
              <StorefrontHero />
            )}

            {/* Categories */}
            {sections.find(s => s.type === 'categories')?.enabled !== false && categories.length > 0 && (
              <StorefrontCategories 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            )}

            {/* Products Grid */}
            {sections.find(s => s.type === 'featured_products')?.enabled !== false && (
              <StorefrontProductGrid 
                products={products}
                onOpenProduct={() => {}}
              />
            )}

            {/* Benefits */}
            {sections.find(s => s.type === 'benefits')?.enabled !== false && (
              <StorefrontBenefits />
            )}

            {/* Testimonials */}
            {sections.find(s => s.type === 'testimonials')?.enabled !== false && (
              <StorefrontTestimonials />
            )}

            {/* FAQ */}
            {sections.find(s => s.type === 'faq')?.enabled !== false && (
              <StorefrontFAQ />
            )}

            {/* Footer */}
            {sections.find(s => s.type === 'footer')?.enabled !== false && (
              <StorefrontFooter />
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
