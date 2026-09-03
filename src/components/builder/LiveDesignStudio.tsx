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
  Sliders, 
  Code, 
  Store, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Shapes,
  Image as ImageIcon,
  Wand2,
  ChevronDown
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { FontFamily, StoreTheme, ThemeLayout, ThemeStyle } from '../../types';
import { generateDesignTokens, PRESET_COLOR_PALETTES } from '../../utils/themeEngine';
import { getEffectiveFontFamily } from '../../utils/fontManager';
import { CustomFontUploader } from './CustomFontUploader';
import { CustomColorStudio } from './CustomColorStudio';
import { ShapesAndEffectsStudio } from './ShapesAndEffectsStudio';
import { BrandingAssetsStudio } from './BrandingAssetsStudio';
import { LiveCodeSyncStudio } from './LiveCodeSyncStudio';
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
    setCurrentView,
    language
  } = useCommerce();

  const isAr = language === 'ar';

  // Local draft theme & tenant state for real-time live preview
  const [draftTheme, setDraftTheme] = useState<StoreTheme>(activeTenant.theme);
  const [sections, setSections] = useState(activeTenant.sections || [
    { type: 'hero', enabled: true },
    { type: 'categories', enabled: true },
    { type: 'featured_products', enabled: true },
    { type: 'benefits', enabled: true },
    { type: 'testimonials', enabled: true },
    { type: 'faq', enabled: true },
    { type: 'footer', enabled: true }
  ]);
  const [storeName, setStoreName] = useState(activeTenant.name || '');
  const [storeNameEn, setStoreNameEn] = useState(activeTenant.nameEn || '');
  const [slogan, setSlogan] = useState(activeTenant.slogan || '');
  const [logoUrl, setLogoUrl] = useState(activeTenant.logo || '');
  
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'shapes' | 'branding' | 'sections' | 'code'>('colors');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Construct draft tenant for 100% reactive preview
  const previewTenant = {
    ...activeTenant,
    name: storeName,
    nameEn: storeNameEn,
    slogan,
    logo: logoUrl,
    theme: draftTheme,
    sections
  };

  const effectiveFont = getEffectiveFontFamily(draftTheme);

  // Quick Master Templates
  const masterTemplates = [
    {
      id: 'honey_royal',
      name: 'عسل سدر ملكي',
      color: '#D4A017',
      style: 'luxury' as ThemeStyle,
      font: 'tajawal' as FontFamily,
      radius: 16,
      btn: 'gradient' as const,
      banner: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'espresso_dark',
      name: 'محمصة بن مختصة',
      color: '#78350F',
      style: 'modern' as ThemeStyle,
      font: 'alexandria' as FontFamily,
      radius: 8,
      btn: 'solid' as const,
      banner: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'fashion_couture',
      name: 'أزياء وموضة مخملية',
      color: '#BE123C',
      style: 'minimal' as ThemeStyle,
      font: 'playfair' as FontFamily,
      radius: 0,
      btn: 'outline' as const,
      banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'oud_perfumes',
      name: 'عود وعطور شرقية',
      color: '#7C3AED',
      style: 'luxury' as ThemeStyle,
      font: 'tajawal' as FontFamily,
      radius: 20,
      btn: 'glow' as const,
      banner: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'tech_gadgets',
      name: 'تقنية وإلكترونيات',
      color: '#0284C7',
      style: 'bold' as ThemeStyle,
      font: 'jakarta' as FontFamily,
      radius: 12,
      btn: 'gradient' as const,
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80'
    },
    {
      id: 'organic_farm',
      name: 'طبيعي وأغذية عضوية',
      color: '#15803D',
      style: 'organic' as ThemeStyle,
      font: 'alexandria' as FontFamily,
      radius: 16,
      btn: 'solid' as const,
      banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80'
    }
  ];

  const applyMasterTemplate = (tmpl: typeof masterTemplates[0]) => {
    const newTokens = generateDesignTokens(tmpl.color, tmpl.style, draftTheme.darkMode);
    setDraftTheme(prev => ({
      ...prev,
      style: tmpl.style,
      fontFamily: tmpl.font,
      customFont: undefined,
      customRadiusPx: tmpl.radius,
      buttonStyle: tmpl.btn,
      heroBannerImage: tmpl.banner,
      tokens: newTokens
    }));
    showToast(`تم تطبيق قالب (${tmpl.name}) بنجاح! ✨`, 'success');
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
    showToast('تم حفظ ونشر إعدادات وهوية المتجر بالكامل بنجاح! 🚀', 'success');
  };

  const handleReset = () => {
    setDraftTheme(activeTenant.theme);
    setSections(activeTenant.sections || []);
    setStoreName(activeTenant.name || '');
    setStoreNameEn(activeTenant.nameEn || '');
    setSlogan(activeTenant.slogan || '');
    setLogoUrl(activeTenant.logo || '');
    showToast('تمت استعادة التصميم الأصلي للمتجر', 'info');
  };

  // Device frame class
  const getDeviceFrameClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'w-[390px] h-[800px] rounded-3xl border-8 border-slate-800 ring-2 ring-slate-700 shadow-2xl overflow-y-auto';
      case 'tablet':
        return 'w-[740px] h-[840px] rounded-2xl border-4 border-slate-800 ring-2 ring-slate-700 shadow-2xl overflow-y-auto';
      case 'desktop':
      default:
        return 'w-full h-[880px] rounded-xl border border-slate-800 shadow-2xl overflow-y-auto';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      
      {/* Dynamic Injected Custom CSS for live preview */}
      {draftTheme.customCss && (
        <style dangerouslySetInnerHTML={{ __html: draftTheme.customCss }} />
      )}

      {/* LEFT SIDE: Professional Studio Controls Panel */}
      <div className="w-full lg:w-[450px] xl:w-[490px] bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto">
        
        {/* Panel Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 sticky top-0 bg-slate-900/95 backdrop-blur z-20">
          
          {/* Navigation to Dashboard & Profile */}
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800/70">
            <button
              onClick={() => setCurrentView('merchant_dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-bold hover:text-white transition-all border border-slate-700/50"
            >
              {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{isAr ? 'لوحة التحكم' : 'Dashboard'}</span>
            </button>
            <button
              onClick={() => setCurrentView('personal_profile')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 font-bold hover:text-white transition-all border border-slate-700/50"
            >
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'مساحتي الشخصية' : 'Personal Profile'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 text-slate-950 shadow-md">
                <Wand2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>استديو التصميم الاحترافي</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">PRO</span>
                </h2>
                <p className="text-[10px] text-slate-400">تخصيص الهوية والخطوط والألوان برمجياً وبصرياً</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                title="إلغاء التعديلات واستعادة التصميم الأصلي"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ ونشر</span>
              </button>
            </div>
          </div>

          {/* 1-Click Master Templates Carousel */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
              <span className="font-bold text-slate-300">قوالب احترافية متكاملة بنقرة واحدة:</span>
              <span>6 سمات جاهزة</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
              {masterTemplates.map(tmpl => (
                <button
                  key={tmpl.id}
                  onClick={() => applyMasterTemplate(tmpl)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 shrink-0 text-[10px] font-bold text-slate-300 hover:text-white transition-all hover:border-amber-500/50"
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tmpl.color }} />
                  <span>{tmpl.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="grid grid-cols-6 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-bold text-center">
            {[
              { id: 'colors' as const, label: 'الألوان', icon: Palette },
              { id: 'typography' as const, label: 'الخطوط', icon: Type },
              { id: 'shapes' as const, label: 'الزوايا', icon: Shapes },
              { id: 'branding' as const, label: 'الهوية', icon: Sparkles },
              { id: 'sections' as const, label: 'الأقسام', icon: Layout },
              { id: 'code' as const, label: 'CSS Code', icon: Code },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-1.5 rounded-lg transition-all flex flex-col items-center justify-center gap-1 ${
                    isActive ? 'bg-amber-500 text-slate-950 shadow-sm font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel Body Content */}
        <div className="p-4 sm:p-5 space-y-6">
          
          {/* TAB 1: COLORS & HARMONY */}
          {activeTab === 'colors' && (
            <CustomColorStudio
              draftTheme={draftTheme}
              onThemeChange={setDraftTheme}
            />
          )}

          {/* TAB 2: TYPOGRAPHY & FONT UPLOAD */}
          {activeTab === 'typography' && (
            <CustomFontUploader
              draftTheme={draftTheme}
              onThemeChange={setDraftTheme}
            />
          )}

          {/* TAB 3: SHAPES & EFFECTS */}
          {activeTab === 'shapes' && (
            <ShapesAndEffectsStudio
              draftTheme={draftTheme}
              onThemeChange={setDraftTheme}
            />
          )}

          {/* TAB 4: BRANDING ASSETS */}
          {activeTab === 'branding' && (
            <BrandingAssetsStudio
              draftTheme={draftTheme}
              onThemeChange={setDraftTheme}
              storeName={storeName}
              setStoreName={setStoreName}
              storeNameEn={storeNameEn}
              setStoreNameEn={setStoreNameEn}
              slogan={slogan}
              setSlogan={setSlogan}
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
            />
          )}

          {/* TAB 5: SECTIONS MANAGEMENT */}
          {activeTab === 'sections' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <label className="block text-xs font-bold text-slate-300">
                إظهار وإخفاء أقسام متجرك الرئيسية (Sections Toggle)
              </label>

              <div className="space-y-2">
                {[
                  { key: 'hero', name: 'الواجهة الترويجية العلوية (Hero Banner)', desc: 'شعار المتجر، العنوان الرئيسي، زر الطلب والبانر' },
                  { key: 'categories', name: 'شريط التصنيفات والأقسام (Categories Bar)', desc: 'تصفح وفلترة المنتجات حسب الفئة' },
                  { key: 'featured_products', name: 'شبكة المنتجات المميزة (Product Grid)', desc: 'عرض المنتجات، الأسعار، صور العرض وزر الإضافة للسلة' },
                  { key: 'benefits', name: 'مميزات المتجر والضمانات (Store Benefits)', desc: 'أيقونات الضمان الذهبي، التوصيل السريع والدفع الآمن' },
                  { key: 'testimonials', name: 'آراء وتقييمات العملاء (Reviews & Social Proof)', desc: 'تجارب المشترين وبطاقات التقييم' },
                  { key: 'faq', name: 'الأسئلة الشائعة (FAQ Accordion)', desc: 'إجابات على استفسارات الدفع والشحن والاستبدال' },
                  { key: 'footer', name: 'تذييل الصفحة ومعلومات التواصل (Footer)', desc: 'روابط التواصل، رقم السجل التجاري وحقوق المتجر' },
                ].map(sec => {
                  const isEnabled = sections.find(s => s.type === sec.key)?.enabled !== false;
                  return (
                    <div
                      key={sec.key}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isEnabled
                          ? 'border-slate-700 bg-slate-950 text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="flex-1 pl-3">
                        <div className="text-xs font-bold">{sec.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{sec.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleSection(sec.key)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 6: LIVE CSS CODE SYNC */}
          {activeTab === 'code' && (
            <LiveCodeSyncStudio
              draftTheme={draftTheme}
              onThemeChange={setDraftTheme}
              showToast={showToast}
            />
          )}

        </div>

      </div>

      {/* RIGHT SIDE: Real-Time Scaled Interactive Preview */}
      <div className="flex-1 bg-slate-950 p-4 sm:p-6 flex flex-col items-center overflow-y-auto">
        
        {/* Preview Control Bar */}
        <div className="w-full max-w-5xl flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">المعاينة الحية التفاعلية للمتجر (Live Storefront Preview)</span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-800">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="شاشة كمبيوتر سطح المكتب"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="جهاز لوحي تابليت"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="جوال ذكي PWA"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setCurrentView('storefront')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors border border-slate-700/60"
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>فتح المتجر الحي</span>
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
              fontFamily: effectiveFont
            }}
          >
            {/* Storefront Header */}
            <StorefrontHeader 
              searchQuery=""
              onSearchChange={() => {}}
              overrideTenant={previewTenant}
            />

            {/* Storefront Hero */}
            {sections.find(s => s.type === 'hero')?.enabled !== false && (
              <StorefrontHero overrideTenant={previewTenant} />
            )}

            {/* Categories */}
            {sections.find(s => s.type === 'categories')?.enabled !== false && categories.length > 0 && (
              <StorefrontCategories 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                overrideTenant={previewTenant}
              />
            )}

            {/* Products Grid */}
            {sections.find(s => s.type === 'featured_products')?.enabled !== false && (
              <StorefrontProductGrid 
                products={products}
                onOpenProduct={() => {}}
                overrideTenant={previewTenant}
              />
            )}

            {/* Benefits */}
            {sections.find(s => s.type === 'benefits')?.enabled !== false && (
              <StorefrontBenefits overrideTenant={previewTenant} />
            )}

            {/* Testimonials */}
            {sections.find(s => s.type === 'testimonials')?.enabled !== false && (
              <StorefrontTestimonials overrideTenant={previewTenant} />
            )}

            {/* FAQ */}
            {sections.find(s => s.type === 'faq')?.enabled !== false && (
              <StorefrontFAQ overrideTenant={previewTenant} />
            )}

            {/* Footer */}
            {sections.find(s => s.type === 'footer')?.enabled !== false && (
              <StorefrontFooter overrideTenant={previewTenant} />
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
