import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Palette, 
  Layers, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Crown, 
  Coffee, 
  Flame, 
  Cpu, 
  Heart, 
  Cake, 
  Watch, 
  Store, 
  Eye, 
  Rocket, 
  Sliders, 
  Type, 
  ShieldAlert, 
  Laptop, 
  Smartphone,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCommerce } from '../../context/CommerceContext';
import { BusinessType, Category, FontFamily, HomepageSection, Product, RadiusPreset, StoreTheme, TenantStore, ThemeLayout, ThemeStyle } from '../../types';
import { BUSINESS_TYPE_CONFIG, generateDesignTokens, PRESET_COLOR_PALETTES } from '../../utils/themeEngine';

export const StoreBuilderWizard: React.FC = () => {
  const { createTenant, setCurrentView, setActiveTenantId } = useCommerce();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Wizard Form State
  const [businessType, setBusinessType] = useState<BusinessType>('honey');
  const [storeName, setStoreName] = useState<string>('متجر النخبة للعسل');
  const [storeNameEn, setStoreNameEn] = useState<string>('Elite Honey Store');
  const [slug, setSlug] = useState<string>('elite-honey');
  const [slogan, setSlogan] = useState<string>('أجود أنواع العسل الطبيعي المضمون من مناحلنا');
  const [description, setDescription] = useState<string>('متجر متخصص في توفير أعسال السدر الطبيعية والخلطات الملكية المعتمدة مخبرياً.');
  const [logoUrl, setLogoUrl] = useState<string>('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80');
  
  // Design Tokens & Theme Engine
  const [primaryColor, setPrimaryColor] = useState<string>('#D4A017');
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('luxury');
  const [themeLayout, setThemeLayout] = useState<ThemeLayout>('luxury');
  const [fontFamily, setFontFamily] = useState<FontFamily>('tajawal');
  const [radius, setRadius] = useState<RadiusPreset>('sm');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Settings
  const [currency, setCurrency] = useState<string>('SAR');
  const [contactEmail, setContactEmail] = useState<string>('contact@store.sa');
  const [contactPhone, setContactPhone] = useState<string>('+966 50 000 0000');
  const [city, setCity] = useState<string>('الرياض');

  // Preview tab within builder
  const [previewTab, setPreviewTab] = useState<'mobile' | 'desktop'>('desktop');

  // Handle Business Type Selection
  const handleSelectBusinessType = (type: BusinessType) => {
    setBusinessType(type);
    const config = BUSINESS_TYPE_CONFIG[type];
    setPrimaryColor(config.defaultColor);
    setThemeStyle(config.suggestedStyle);
    setThemeLayout(config.suggestedLayout);
    setFontFamily(config.suggestedFont);
    setSlogan(config.taglineAr);
    
    if (type === 'honey') {
      setStoreName('متجر النخبة للعسل');
      setStoreNameEn('Elite Honey Boutique');
      setSlug('elite-honey');
      setLogoUrl('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80');
    } else if (type === 'coffee') {
      setStoreName('محمصة البن الذهبي');
      setStoreNameEn('Golden Roast Coffee');
      setSlug('golden-roast');
      setLogoUrl('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80');
    } else if (type === 'fashion') {
      setStoreName('أتيليه فيري للحرير');
      setStoreNameEn('Very Silk Atelier');
      setSlug('very-silk');
      setLogoUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80');
    } else if (type === 'perfume') {
      setStoreName('قصر العود والعطور الملكية');
      setStoreNameEn('Palace Oud & Perfumes');
      setSlug('palace-oud');
      setLogoUrl('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&auto=format&fit=crop&q=80');
    } else if (type === 'tech') {
      setStoreName('المتجر الذكي للتقنية');
      setStoreNameEn('SmartTech Pro Store');
      setSlug('smart-tech');
      setLogoUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80');
    } else {
      setStoreName(`متجر ${config.nameAr}`);
      setStoreNameEn(`${config.nameEn} Store`);
      setSlug(`${type}-store`);
    }
  };

  // Compute live tokens
  const liveTokens = generateDesignTokens(primaryColor, themeStyle, darkMode);

  // Final submission
  const handleLaunchStore = () => {
    const newTenantId = `tenant-${slug}-${Date.now().toString().slice(-4)}`;
    
    const theme: StoreTheme = {
      style: themeStyle,
      layout: themeLayout,
      fontFamily,
      radius,
      shadow: themeStyle === 'luxury' ? 'subtle' : themeStyle === 'modern' ? 'soft' : 'none',
      headerStyle: 'floating',
      cardStyle: themeStyle === 'luxury' ? 'bordered' : themeStyle === 'modern' ? 'elevated' : 'minimal',
      darkMode,
      tokens: liveTokens
    };

    const initialSections: HomepageSection[] = [
      { id: `sec-1-${Date.now()}`, type: 'hero', title: slogan || storeName, titleEn: storeNameEn, subtitle: description, subtitleEn: 'Best premium selection tailored for you', enabled: true, order: 1 },
      { id: `sec-2-${Date.now()}`, type: 'categories', title: 'أقسام وتصنيفات المتجر', titleEn: 'Store Categories', enabled: true, order: 2 },
      { id: `sec-3-${Date.now()}`, type: 'featured_products', title: 'المنتجات المميزة والأكثر طلباً', titleEn: 'Featured Products', subtitle: 'مختارات حصرية بأعلى درجات الجودة', enabled: true, order: 3 },
      { id: `sec-4-${Date.now()}`, type: 'benefits', title: 'لماذا تختار متجرنا؟', titleEn: 'Our Core Commitments', subtitle: 'ضمان الجودة، وسرعة التوصيل، ودعم فني متواصل', enabled: true, order: 4 },
      { id: `sec-5-${Date.now()}`, type: 'testimonials', title: 'آراء وتقييمات العملاء', titleEn: 'Verified Reviews', enabled: true, order: 5 }
    ];

    const newTenant: TenantStore = {
      id: newTenantId,
      name: storeName,
      nameEn: storeNameEn || storeName,
      slug,
      description,
      slogan,
      businessType,
      logo: logoUrl,
      currency,
      currencySymbol: currency === 'SAR' ? 'ر.س' : currency === 'AED' ? 'د.إ' : '$',
      domain: `${slug}.commerceos.app`,
      plan: 'business',
      status: 'active',
      createdAt: new Date().toISOString(),
      contact: {
        email: contactEmail,
        phone: contactPhone,
        city,
        country: 'المملكة العربية السعودية'
      },
      social: {
        instagram: `@${slug}`
      },
      theme,
      sections: initialSections,
      pwaConfig: {
        appName: storeName,
        shortName: storeName.split(' ')[0] || 'Store',
        themeColor: primaryColor,
        backgroundColor: liveTokens.background,
        enablePush: true
      },
      paymentGateways: {
        mada: true,
        applePay: true,
        visa: true,
        cod: true,
        tamara: true
      },
      shippingMethods: [
        { id: `sm-1-${Date.now()}`, name: 'توصيل سريع مبرد ومضمون', nameEn: 'Express Safe Delivery', cost: 25, estimatedDays: '1-3 أيام عمل', active: true },
        { id: `sm-2-${Date.now()}`, name: 'شحن مجاني للطلبات فوق 300 ر.س', nameEn: 'Free Shipping', cost: 0, estimatedDays: '2-4 أيام', active: true }
      ]
    };

    // Create 3 tailored sample categories & products
    const catId1 = `cat-gen-1-${Date.now()}`;
    const catId2 = `cat-gen-2-${Date.now()}`;
    const sampleCategories: Category[] = [
      { id: catId1, tenantId: newTenantId, name: BUSINESS_TYPE_CONFIG[businessType].sampleCategories[0] || 'المنتجات الرئيسية', nameEn: 'Main Collection', productCount: 2 },
      { id: catId2, tenantId: newTenantId, name: BUSINESS_TYPE_CONFIG[businessType].sampleCategories[1] || 'العروض الخاصة', nameEn: 'Special Offers', productCount: 1 }
    ];

    const sampleProducts: Product[] = [
      {
        id: `prod-sample-1-${Date.now()}`,
        tenantId: newTenantId,
        name: `${storeName} - الصنف الملكي الفاخر`,
        nameEn: `${storeNameEn} - Premium Royal Choice`,
        description: `أفضل وأجود أنواع ${storeName} بمواصفات حصرية وضمان استرجاع ذهبي. فحص معتمد وتغليف فاخر.`,
        categoryId: catId1,
        price: 280,
        comparePrice: 350,
        sku: `${(slug || 'ST').toUpperCase()}-001`,
        stock: 35,
        lowStockAlert: 5,
        images: [logoUrl],
        rating: 5.0,
        reviewsCount: 18,
        isFeatured: true,
        isBestseller: true,
        tags: ['مميز', 'أفضل مبيعاً', businessType]
      },
      {
        id: `prod-sample-2-${Date.now()}`,
        tenantId: newTenantId,
        name: `${storeName} - البكج التوفيري المميز`,
        nameEn: `${storeNameEn} - Value Bundle Set`,
        description: 'باقة توفيرية تحتوي على تشكيلة منوعة لتجربة متكاملة بسعر منافس وجودة فائقة.',
        categoryId: catId2,
        price: 490,
        comparePrice: 580,
        sku: `${(slug || 'ST').toUpperCase()}-002`,
        stock: 20,
        lowStockAlert: 3,
        images: [logoUrl],
        rating: 4.9,
        reviewsCount: 12,
        isFeatured: true,
        tags: ['بكج', 'توفير', businessType]
      }
    ];

    createTenant(newTenant, sampleProducts, sampleCategories);
    setActiveTenantId(newTenantId);

    // Fire celebratory confetti!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStep(7); // Show celebration & launch pad
  };

  const businessTypeIcons: Record<BusinessType, React.FC<{ className?: string }>> = {
    honey: Droplet,
    coffee: Coffee,
    fashion: Sparkles,
    perfume: Flame,
    tech: Cpu,
    beauty: Heart,
    sweets: Cake,
    accessories: Watch,
    food: ShoppingBag,
    general: Store
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-8 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Progress Bar & Header */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>معالج إنشاء المتاجر الذكية (Store Builder Wizard)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            أنشئ متجرك الإلكتروني الاحترافي خلال دقائق
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            بدون أي برمجة — اختر نوع نشاطك، وهويتك البصرية، والمنصة تتكفل بإنشاء المتجر ولوحة الإدارة وتطبيق الـ PWA.
          </p>

          {/* Stepper Dots */}
          {step <= totalSteps && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {[1, 2, 3, 4, 5, 6].map(s => (
                <div key={s} className="flex items-center">
                  <button
                    onClick={() => s < step && setStep(s)}
                    disabled={s > step}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s === step
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 shadow-lg shadow-amber-500/30'
                        : s < step
                        ? 'bg-emerald-600 text-white cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {s < step ? <Check className="w-4 h-4" /> : s}
                  </button>
                  {s < totalSteps && (
                    <div className={`w-6 sm:w-10 h-0.5 mx-1 transition-colors ${s < step ? 'bg-emerald-600' : 'bg-slate-800'}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Step 7: Launch Celebration & Ready State */}
        {step === 7 ? (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-amber-500/25 mb-6">
              <Rocket className="w-10 h-10 animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-white mb-2">
              مبروك! تم تدشين متجر "{storeName}" بنجاح 🚀
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              متجرك الإلكتروني جاهز الآن بنظام Multi-Tenant كامل، مع واجهة الزبائن، لوحة الإدارة، محرك التصميم، ودعم تثبيت PWA.
            </p>

            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-6 text-right space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">رابط المتجر الحي:</span>
                <span className="font-mono text-amber-400 font-bold">{slug}.commerceos.app</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">نوع النشاط والهوية:</span>
                <span className="text-slate-200">{BUSINESS_TYPE_CONFIG[businessType].nameAr} ({themeStyle})</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">اللون الأساسي للعلامة:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: primaryColor }} />
                  <span className="font-mono text-slate-300">{primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentView('storefront')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>زيارة متجر العميل الآن (Live)</span>
              </button>

              <button
                onClick={() => setCurrentView('merchant_dashboard')}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
              >
                <Layers className="w-4 h-4" />
                <span>فتح لوحة إدارة المتجر</span>
              </button>
            </div>
          </div>
        ) : (
          
          /* Split View: Left Controls / Right Real-time Preview */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Steps Card (8 Cols on Desktop) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
              
              {/* Step 1: Business Type */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة الأولى: اختر نشاط متجرك</h2>
                    <p className="text-xs text-slate-400">
                      اختيار النشاط يهيئ تلقائياً هيكل الأقسام، والألوان المقترحة، والخطوط، والمنتجات الافتراضية.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(Object.keys(BUSINESS_TYPE_CONFIG) as BusinessType[]).map(type => {
                      const config = BUSINESS_TYPE_CONFIG[type];
                      const Icon = businessTypeIcons[type] || Store;
                      const isSelected = businessType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectBusinessType(type)}
                          className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-2 ring-amber-500/20 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: config.defaultColor }} />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{config.nameAr}</div>
                            <div className="text-[10px] text-slate-400">{config.nameEn}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Store Identity */}
              {step === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة الثانية: هوية وبيانات المتجر</h2>
                    <p className="text-xs text-slate-400">
                      حدد اسم متجرك وعنوان النطاق الخاص والشعار لظهوره في رأس الصفحة وتطبيق PWA.
                    </p>
                  </div>

                  <div className="space-y-4 text-right">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم المتجر (بالعربية) *</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        placeholder="مثال: متجر الملكي للعسل"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">الاسم بالإنجليزية (English Name)</label>
                        <input
                          type="text"
                          value={storeNameEn}
                          onChange={e => setStoreNameEn(e.target.value)}
                          placeholder="e.g. Royal Honey"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 text-left"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">النطاق الفرعي (Slug URL)</label>
                        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-400">
                          <span className="text-xs text-slate-500">.commerceos.app</span>
                          <input
                            type="text"
                            value={slug}
                            onChange={e => setSlug((e.target.value || '').toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            className="bg-transparent text-amber-400 font-mono text-xs w-full text-left focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">الشعار الرئيسي (رابط الصورة / Logo URL)</label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 text-left font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">شعار المتجر اللفظي (Slogan / Tagline)</label>
                      <input
                        type="text"
                        value={slogan}
                        onChange={e => setSlogan(e.target.value)}
                        placeholder="مثال: نقاء الطبيعة في كل قطرة"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">نبذة مختصرة عن المتجر</label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="وصف ترحيبي يظهر للزبائن في أسفل المتجر ومحركات البحث..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Design Engine & Token Generator */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة الثالثة: محرك الألوان و الـ Design Tokens</h2>
                    <p className="text-xs text-slate-400">
                      اختر اللون الأساسي، وسيقوم محرك التصميم بتوليد 12 لوناً متناسقاً بدقة لتغذية كافة عناصر المتجر.
                    </p>
                  </div>

                  {/* Preset Palettes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">لوحات الألوان الجاهزة المقترحة</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PRESET_COLOR_PALETTES.map(palette => (
                        <button
                          key={palette.id}
                          type="button"
                          onClick={() => {
                            setPrimaryColor(palette.hex);
                            setThemeStyle(palette.style);
                          }}
                          className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                            primaryColor === palette.hex
                              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                              : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-right">
                            <div className="text-[11px] font-bold text-white">{palette.name}</div>
                            <div className="text-[9px] text-slate-400 font-mono">{palette.hex}</div>
                          </div>
                          <div className="flex items-center -space-x-1">
                            <div className="w-4 h-4 rounded-full border border-slate-900" style={{ backgroundColor: palette.hex }} />
                            <div className="w-4 h-4 rounded-full border border-slate-900" style={{ backgroundColor: palette.secondary }} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Picker */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">أو اختر لون مخصص (Custom Hex)</div>
                      <div className="text-[11px] text-slate-400">أدخل أي كود لوني ليقوم النظام ببناء منظومة الألوان منه</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={e => setPrimaryColor(e.target.value)}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white font-mono uppercase text-center"
                      />
                    </div>
                  </div>

                  {/* Generated Tokens Preview Matrix */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">منظومة الـ Design Tokens المولّدة تلقائياً</label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {Object.entries(liveTokens).map(([key, val]) => (
                        <div key={key} className="bg-slate-950 p-2 rounded-lg border border-slate-800 text-center">
                          <div className="w-full h-5 rounded mb-1 shadow-inner" style={{ backgroundColor: val }} />
                          <div className="text-[9px] font-bold text-slate-300 truncate">{key}</div>
                          <div className="text-[8px] text-slate-500 font-mono">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Theme Style & Layout */}
              {step === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة الرابعة: نمط التصميم وتنسيق الصفحة</h2>
                    <p className="text-xs text-slate-400">
                      التصميم لا يقتصر على الألوان؛ حدد شخصية متجرك وطريقة عرض البطاقات والخطوط.
                    </p>
                  </div>

                  {/* Styles: Luxury, Modern, Minimal, Organic, Bold */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">نمط التصميم (Design Style)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'luxury', nameAr: 'فاخر وملكي (Luxury)', desc: 'زوايا حادة، لمسات ذهبية راقية، مساحات أنيقة', icon: Crown },
                        { id: 'modern', nameAr: 'عصري ناعم (Modern)', desc: 'زوايا مستديرة، ظلال ناعمة، أسلوب مريح', icon: Sparkles },
                        { id: 'minimal', nameAr: 'مبسط (Minimal)', desc: 'مساحات بيضاء واسعة، حدود رفيعة، هدوء بصري', icon: Sliders },
                        { id: 'organic', nameAr: 'طبيعي عضوي (Organic)', desc: 'ألوان أرضية، خطوط دافئة، مناسب للأغذية', icon: Droplet },
                        { id: 'bold', nameAr: 'جريء وتقني (Bold)', desc: 'تباين عالي، بطاقات بارزة، مناسب للإلكترونيات', icon: Cpu }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setThemeStyle(item.id as ThemeStyle)}
                          className={`p-3 rounded-xl border text-right transition-all ${
                            themeStyle === item.id
                              ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20 text-amber-300'
                              : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold text-xs text-white mb-1">
                            <item.icon className="w-3.5 h-3.5 text-amber-400" />
                            <span>{item.nameAr}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 leading-relaxed">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography Font */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">الخط العربي الرئيسي (Font)</label>
                      <select
                        value={fontFamily}
                        onChange={e => setFontFamily(e.target.value as FontFamily)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="tajawal">خط تجوال (Tajawal - رسمي وفاخر)</option>
                        <option value="alexandria">خط الإسكندرية (Alexandria - عصري وحديث)</option>
                        <option value="jakarta">خط بلس جاكرتا (Plus Jakarta - تقني وجذاب)</option>
                        <option value="playfair">خط بلايفير (Playfair - أزياء وأناقة)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-2">انحناء حواف البطاقات (Border Radius)</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: 'none', label: 'حادة 0px' },
                          { id: 'sm', label: 'خفيفة 6px' },
                          { id: 'md', label: 'متوسطة 12px' },
                          { id: 'lg', label: 'دائرية 20px' }
                        ].map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRadius(r.id as RadiusPreset)}
                            className={`py-2 px-1 text-[10px] font-bold rounded-lg border transition-all ${
                              radius === r.id
                                ? 'bg-amber-500 text-slate-950 border-amber-500'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {r.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Store Setup & Gateways */}
              {step === 5 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة الخامسة: بوابات الدفع والشحن</h2>
                    <p className="text-xs text-slate-400">
                      فعل طرق الدفع الإلكترونية السريعة (مدى، Apple Pay، فيزا) والشحن السريع.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">العملة الافتراضية</label>
                      <select
                        value={currency}
                        onChange={e => setCurrency(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="SAR">ريال سعودي (SAR)</option>
                        <option value="AED">درهم إماراتي (AED)</option>
                        <option value="KWD">دينار كويتي (KWD)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">مدينة المستودع الرئيسي</label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="الرياض، جدة..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Payment Gateways Toggles */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">بوابات الدفع المدعومة تلقائياً</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {[
                        { name: 'مدى (Mada)', sub: 'مفعلة فورياً', active: true },
                        { name: 'Apple Pay', sub: 'بنقرة واحدة', active: true },
                        { name: 'Visa / MasterCard', sub: 'دولي ومحلي', active: true },
                        { name: 'تمارا (Tamara)', sub: 'تقسيط مشتريات', active: true }
                      ].map((gw, i) => (
                        <div key={i} className="bg-slate-950 p-3 rounded-xl border border-emerald-500/30 text-right">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-white">{gw.name}</span>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <span className="text-[10px] text-emerald-400 font-medium">{gw.sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Final Confirmation */}
              {step === 6 && (
                <div className="space-y-6 animate-in fade-in">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">المرحلة السادسة: مراجعة وإطلاق المتجر</h2>
                    <p className="text-xs text-slate-400">
                      راجع ملخص الهوية والإعدادات، ثم اضغط على زر "تدشين المتجر الآن".
                    </p>
                  </div>

                  <div className="bg-slate-950 rounded-xl p-5 border border-slate-800 space-y-3 text-right">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs text-slate-400">اسم المتجر:</span>
                      <span className="text-sm font-bold text-white">{storeName}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs text-slate-400">نوع النشاط:</span>
                      <span className="text-xs text-amber-400 font-bold">{BUSINESS_TYPE_CONFIG[businessType].nameAr}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs text-slate-400">طراز التصميم (Theme Style):</span>
                      <span className="text-xs text-slate-200 capitalize font-medium">{themeStyle} (زوايا {radius})</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                      <span className="text-xs text-slate-400">الرابط الفرعي (Subdomain):</span>
                      <span className="font-mono text-xs text-amber-400 font-bold">{slug}.commerceos.app</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">تطبيق الـ PWA:</span>
                      <span className="text-xs text-emerald-400 font-bold">جاهز للتثبيت على Android و iOS</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls (Prev / Next) */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                ) : <div />}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <span>المتابعة للمرحلة التالية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLaunchStore}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-black shadow-xl shadow-emerald-500/25 transition-all animate-pulse-subtle"
                  >
                    <Rocket className="w-4 h-4" />
                    <span>تدشين المتجر وإطلاقه الآن 🚀</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Interactive Live Preview Card (5 Cols on Desktop) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl sticky top-20">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">المعاينة الحية الفورية (Live Preview)</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setPreviewTab('desktop')}
                    className={`p-1 rounded ${previewTab === 'desktop' ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
                  >
                    <Laptop className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab('mobile')}
                    className={`p-1 rounded ${previewTab === 'mobile' ? 'bg-slate-800 text-amber-400' : 'text-slate-500'}`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Styled Preview Frame */}
              <div 
                className={`mx-auto rounded-xl border overflow-hidden transition-all duration-300 shadow-2xl ${
                  previewTab === 'mobile' ? 'max-w-[280px]' : 'w-full'
                }`}
                style={{ 
                  backgroundColor: liveTokens.background,
                  borderColor: liveTokens.border,
                  color: liveTokens.text
                }}
              >
                {/* Mock Store Header */}
                <div 
                  className="p-3 border-b flex items-center justify-between"
                  style={{ backgroundColor: liveTokens.surface, borderColor: liveTokens.border }}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={logoUrl} 
                      alt="Logo" 
                      className="w-6 h-6 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="text-xs font-bold truncate max-w-[120px]" style={{ color: liveTokens.text }}>
                      {storeName || 'اسم المتجر'}
                    </div>
                  </div>
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ backgroundColor: liveTokens.primary }}
                  >
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                </div>

                {/* Mock Hero Section */}
                <div 
                  className="p-4 text-center border-b relative overflow-hidden"
                  style={{ 
                    backgroundColor: themeStyle === 'luxury' ? liveTokens.surfaceMuted : liveTokens.surface,
                    borderColor: liveTokens.border 
                  }}
                >
                  <span 
                    className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mb-1.5"
                    style={{ backgroundColor: liveTokens.primaryLight, color: liveTokens.primaryDark }}
                  >
                    {BUSINESS_TYPE_CONFIG[businessType].nameAr}
                  </span>
                  <div className="text-sm font-extrabold mb-1" style={{ color: liveTokens.text }}>
                    {slogan || 'شعار المتجر'}
                  </div>
                  <p className="text-[10px] opacity-75 mb-3 line-clamp-2 max-w-xs mx-auto">
                    {description || 'نبذة عن المتجر وأجود المنتجات المختارة بعناية'}
                  </p>
                  <button
                    className="text-[11px] font-bold px-4 py-1.5 rounded-lg text-white shadow-md"
                    style={{ backgroundColor: liveTokens.primary }}
                  >
                    تسوق الآن
                  </button>
                </div>

                {/* Mock Featured Product Card */}
                <div className="p-3">
                  <div className="text-[11px] font-bold mb-2 flex items-center justify-between opacity-85">
                    <span>المنتجات الأكثر طلباً</span>
                    <span className="text-[9px] font-mono" style={{ color: liveTokens.primary }}>عرض الكل</span>
                  </div>

                  <div 
                    className="p-2.5 rounded-lg border"
                    style={{ 
                      backgroundColor: liveTokens.surface, 
                      borderColor: liveTokens.border,
                      borderRadius: radius === 'none' ? '0px' : radius === 'sm' ? '6px' : radius === 'md' ? '12px' : '16px'
                    }}
                  >
                    <div className="w-full h-24 rounded bg-slate-800/10 mb-2 overflow-hidden relative">
                      <img src={logoUrl} alt="Product" className="w-full h-full object-cover" />
                      <span 
                        className="absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: liveTokens.primary }}
                      >
                        الأكثر طلباً
                      </span>
                    </div>
                    <div className="text-[11px] font-bold truncate mb-1">{storeName} - الصنف الملكي</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black" style={{ color: liveTokens.primary }}>
                        280 {currency}
                      </span>
                      <button 
                        className="text-[9px] font-bold px-2 py-1 rounded text-white"
                        style={{ backgroundColor: liveTokens.primary }}
                      >
                        + إضافة
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mock Footer */}
                <div 
                  className="p-2.5 text-center text-[9px] border-t opacity-70"
                  style={{ backgroundColor: liveTokens.surfaceMuted, borderColor: liveTokens.border }}
                >
                  جميع الحقوق محفوظة © {storeName} 2026
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
