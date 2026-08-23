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
  Droplet,
  Upload,
  Globe,
  Building2,
  MapPin,
  Coins,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Copy,
  Zap,
  Layout,
  Sun,
  Moon,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCommerce } from '../../context/CommerceContext';
import { 
  BusinessType, 
  Category, 
  FontFamily, 
  HomepageSection, 
  Product, 
  RadiusPreset, 
  StoreTheme, 
  TenantStore, 
  ThemeLayout, 
  ThemeStyle,
  BankAccount 
} from '../../types';
import { 
  BUSINESS_TYPE_CONFIG, 
  generateDesignTokens, 
  PRESET_COLOR_PALETTES,
  ARAB_CURRENCIES,
  ARAB_COUNTRIES_AND_CITIES,
  ARAB_PAYMENT_GATEWAYS_CATALOG,
  FONTS_CONFIG
} from '../../utils/themeEngine';
import { ImageUploadCropper } from '../common/ImageUploadCropper';

export const StoreBuilderWizard: React.FC = () => {
  const { createTenant, setCurrentView, setActiveTenantId, showToast } = useCommerce();

  // Primary Building Path Mode: 'wizard' | 'starter_kits' | 'express'
  const [buildMode, setBuildMode] = useState<'wizard' | 'starter_kits' | 'express'>('wizard');

  // Wizard Step (1 to 6, 7 is Celebration)
  const [step, setStep] = useState<number>(1);
  const totalSteps = 6;

  // Step 1: Business Type & Identity
  const [businessType, setBusinessType] = useState<BusinessType>('honey');
  const [storeName, setStoreName] = useState<string>('متجر النخبة للعسل');
  const [storeNameEn, setStoreNameEn] = useState<string>('Elite Honey Boutique');
  const [slug, setSlug] = useState<string>('elite-honey');
  const [slogan, setSlogan] = useState<string>('أجود أنواع العسل الطبيعي المضمون من مناحلنا');
  const [description, setDescription] = useState<string>('متجر متخصص في توفير أعسال السدر الطبيعية والخلطات الملكية المعتمدة مخبرياً بضمان الجودة.');
  const [logoUrl, setLogoUrl] = useState<string>('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80');
  const [coverUrl, setCoverUrl] = useState<string>('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1200&auto=format&fit=crop&q=80');

  // Step 2 & 3: Architectural Design & Theme
  const [primaryColor, setPrimaryColor] = useState<string>('#D4A017');
  const [themeStyle, setThemeStyle] = useState<ThemeStyle>('luxury');
  const [themeLayout, setThemeLayout] = useState<ThemeLayout>('luxury');
  const [headerStyle, setHeaderStyle] = useState<'floating' | 'solid' | 'transparent' | 'centered_logo' | 'island_blur'>('floating');
  const [heroStyle, setHeroStyle] = useState<'split' | 'cinematic' | 'story' | 'spotlight' | 'minimal'>('split');
  const [cardStyle, setCardStyle] = useState<'elevated' | 'bordered' | 'minimal' | 'glass'>('bordered');
  const [fontFamily, setFontFamily] = useState<FontFamily>('tajawal');
  const [radius, setRadius] = useState<RadiusPreset>('sm');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Step 4: Geographic & Currency Settings
  const [countryCode, setCountryCode] = useState<string>('SA');
  const [city, setCity] = useState<string>('الرياض');
  const [currency, setCurrency] = useState<string>('SAR');
  const [contactEmail, setContactEmail] = useState<string>('contact@store.sa');
  const [contactPhone, setContactPhone] = useState<string>('+966 50 000 0000');
  const [freeShippingThreshold, setFreeShippingThreshold] = useState<number>(300);
  const [shippingCost, setShippingCost] = useState<number>(25);

  // Step 5: Payment Gateways Toggles & Bank Wire Setup
  const [paymentGateways, setPaymentGateways] = useState({
    mada: true,
    applePay: true,
    visa: true,
    stcPay: true,
    tamara: true,
    tabby: true,
    knet: false,
    benefit: false,
    fawry: false,
    cliq: false,
    bankTransfer: true,
    cod: true
  });

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: 'bank-1',
      bankName: 'مصرف الراجحي (Al Rajhi Bank)',
      accountHolder: 'مؤسسة النخبة التجارية',
      accountNumber: '44558899112233',
      iban: 'SA448000044558899112233',
      isActive: true
    },
    {
      id: 'bank-2',
      bankName: 'البنك الأهلي السعودي (SNB)',
      accountHolder: 'مؤسسة النخبة التجارية',
      accountNumber: '10022334455667',
      iban: 'SA1210000010022334455667',
      isActive: true
    }
  ]);

  const [newBankName, setNewBankName] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');
  const [newIban, setNewIban] = useState('');
  const [isAddingBank, setIsAddingBank] = useState(false);

  // Preview Device State
  const [previewTab, setPreviewTab] = useState<'mobile' | 'desktop'>('desktop');

  // Compute live tokens
  const liveTokens = generateDesignTokens(primaryColor, themeStyle, darkMode);

  // Business Type Quick Handler
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
      setLogoUrl('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80');
      setDescription('متجر متخصص في توفير أعسال السدر الطبيعية والخلطات الملكية المعتمدة مخبرياً بضمان الجودة.');
    } else if (type === 'coffee') {
      setStoreName('محمصة البن الذهبي');
      setStoreNameEn('Golden Roast Coffee');
      setSlug('golden-roast');
      setLogoUrl('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80');
      setDescription('محاصيل بن مختصة منتقاة من أرقى مزارع إثيوبيا وكولومبيا لعشاق المذاق الأصيل.');
    } else if (type === 'fashion') {
      setStoreName('أتيليه فيري للحرير والأزياء');
      setStoreNameEn('Very Silk Atelier');
      setSlug('very-silk');
      setLogoUrl('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80');
      setDescription('إطلالات وعبايات راقية مصممة من أفخر أنواع الحرير والأقمشة العالمية.');
    } else if (type === 'perfume') {
      setStoreName('قصر العود والعطور الملكية');
      setStoreNameEn('Palace Oud & Perfumes');
      setSlug('palace-oud');
      setLogoUrl('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80');
      setDescription('نفحات ملكية من أدهان العود الصافي، وخشب البخور المعتق، وعطور النيش الفاخرة.');
    } else if (type === 'tech') {
      setStoreName('المتجر الذكي للإلكترونيات');
      setStoreNameEn('SmartTech Pro Hub');
      setSlug('smart-tech');
      setLogoUrl('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80');
      setDescription('أحدث الأجهزة الذكية وملحقات الهواتف والصوتيات بضمان رسمي وتوصيل فوري.');
    } else {
      setStoreName(`متجر ${config.nameAr}`);
      setStoreNameEn(`${config.nameEn} Store`);
      setSlug(`${type}-store`);
      setDescription(`أفضل منتجات ${config.nameAr} بأعلى درجات الجودة والخدمة المتميزة.`);
    }
  };

  // Country Change Handler
  const handleCountryChange = (cCode: string) => {
    setCountryCode(cCode);
    const countryData = ARAB_COUNTRIES_AND_CITIES[cCode];
    if (countryData) {
      setCurrency(countryData.currency);
      setCity(countryData.cities[0] || 'الرياض');
      
      // Auto adjust recommended gateways
      if (cCode === 'KW') {
        setPaymentGateways(prev => ({ ...prev, knet: true }));
      } else if (cCode === 'BH') {
        setPaymentGateways(prev => ({ ...prev, benefit: true }));
      } else if (cCode === 'EG') {
        setPaymentGateways(prev => ({ ...prev, fawry: true }));
      } else if (cCode === 'JO') {
        setPaymentGateways(prev => ({ ...prev, cliq: true }));
      }
    }
  };

  // Add Bank Account
  const handleAddBankAccount = () => {
    if (!newBankName.trim() || !newIban.trim()) {
      showToast('يرجى كتابة اسم البنك ورقم الآيبان كاملاً', 'warning');
      return;
    }

    const newAcc: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBankName.trim(),
      accountHolder: newAccountHolder.trim() || storeName,
      accountNumber: newIban.replace(/\D/g, '').slice(-12),
      iban: newIban.trim().toUpperCase(),
      isActive: true
    };

    setBankAccounts(prev => [...prev, newAcc]);
    setNewBankName('');
    setNewAccountHolder('');
    setNewIban('');
    setIsAddingBank(false);
    showToast('تمت إضافة الحساب البنكي بنجاح', 'success');
  };

  // Launch Store Function
  const handleLaunchStore = (customData?: Partial<TenantStore>) => {
    const newTenantId = `tenant-${slug || 'store'}-${Date.now().toString().slice(-4)}`;
    
    const theme: StoreTheme = {
      style: themeStyle,
      layout: themeLayout,
      fontFamily,
      radius,
      shadow: themeStyle === 'luxury' ? 'subtle' : themeStyle === 'modern' ? 'soft' : 'none',
      headerStyle,
      heroStyle,
      cardStyle,
      darkMode,
      tokens: liveTokens
    };

    const initialSections: HomepageSection[] = [
      { id: `sec-1-${Date.now()}`, type: 'hero', title: slogan || storeName, titleEn: storeNameEn, subtitle: description, subtitleEn: 'Best premium selection tailored for you', enabled: true, order: 1 },
      { id: `sec-2-${Date.now()}`, type: 'categories', title: 'أقسام وتصنيفات المتجر', titleEn: 'Store Categories', enabled: true, order: 2 },
      { id: `sec-3-${Date.now()}`, type: 'featured_products', title: 'المنتجات المميزة والأكثر طلباً', titleEn: 'Featured Products', subtitle: 'مختارات حصرية بأعلى درجات الجودة والضمان', enabled: true, order: 3 },
      { id: `sec-4-${Date.now()}`, type: 'benefits', title: 'لماذا تختار متجرنا؟', titleEn: 'Our Core Commitments', subtitle: 'ضمان ذهبي 100%، وسرعة تجهيز الشحن، ودعم فني متواصل', enabled: true, order: 4 },
      { id: `sec-5-${Date.now()}`, type: 'testimonials', title: 'آراء وتقييمات العملاء الموثقة', titleEn: 'Verified Customer Reviews', enabled: true, order: 5 },
      { id: `sec-6-${Date.now()}`, type: 'faq', title: 'الأسئلة الشائعة وتفاصيل الطلب', titleEn: 'Frequently Asked Questions', enabled: true, order: 6 }
    ];

    const currencySymbol = ARAB_CURRENCIES[currency]?.symbol || 'ر.س';
    const countryName = ARAB_COUNTRIES_AND_CITIES[countryCode]?.countryAr || 'المملكة العربية السعودية';

    const newTenant: TenantStore = {
      id: newTenantId,
      name: storeName,
      nameEn: storeNameEn || storeName,
      slug: slug || 'store',
      description,
      slogan,
      businessType,
      logo: logoUrl,
      currency,
      currencySymbol,
      domain: `${slug || 'store'}.commerceos.app`,
      plan: 'business',
      status: 'active',
      createdAt: new Date().toISOString(),
      contact: {
        email: contactEmail,
        phone: contactPhone,
        city,
        country: countryName
      },
      social: {
        instagram: `@${slug || 'store'}`
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
      paymentGateways,
      bankAccounts,
      shippingMethods: [
        { 
          id: `sm-1-${Date.now()}`, 
          name: 'توصيل سريع مبرد ومضمون لباب البيت', 
          nameEn: 'Express Doorstep Delivery', 
          cost: shippingCost, 
          estimatedDays: '1-3 أيام عمل', 
          active: true 
        },
        { 
          id: `sm-2-${Date.now()}`, 
          name: `شحن مجاني للطلبات فوق ${freeShippingThreshold} ${currencySymbol}`, 
          nameEn: `Free Express Shipping over ${freeShippingThreshold}`, 
          cost: 0, 
          estimatedDays: '2-4 أيام', 
          active: true 
        }
      ],
      ...customData
    };

    // Create 3 tailored sample categories & products
    const catId1 = `cat-gen-1-${Date.now()}`;
    const catId2 = `cat-gen-2-${Date.now()}`;
    const catId3 = `cat-gen-3-${Date.now()}`;

    const sampleCats = BUSINESS_TYPE_CONFIG[businessType]?.sampleCategories || ['المنتجات الرئيسية', 'العروض المميزة', 'البكجات التوفيرية'];

    const sampleCategories: Category[] = [
      { id: catId1, tenantId: newTenantId, name: sampleCats[0] || 'المنتجات الرئيسية', nameEn: 'Main Collection', productCount: 2 },
      { id: catId2, tenantId: newTenantId, name: sampleCats[1] || 'العروض الخاصة', nameEn: 'Special Offers', productCount: 1 },
      { id: catId3, tenantId: newTenantId, name: sampleCats[2] || 'البكجات التوفيرية', nameEn: 'Value Bundles', productCount: 1 }
    ];

    const sampleProducts: Product[] = [
      {
        id: `prod-sample-1-${Date.now()}`,
        tenantId: newTenantId,
        name: `${storeName} - الصنف الملكي الفاخر`,
        nameEn: `${storeNameEn} - Premium Royal Choice`,
        description: `أفضل وأجود أنواع ${storeName} بمواصفات حصرية وضمان استرجاع ذهبي. فحص معتمد وتغليف فاخر مع بطاقة إهداء.`,
        categoryId: catId1,
        price: 280,
        comparePrice: 350,
        sku: `${(slug || 'ST').toUpperCase()}-001`,
        stock: 35,
        lowStockAlert: 5,
        images: [logoUrl],
        rating: 5.0,
        reviewsCount: 24,
        isFeatured: true,
        isBestseller: true,
        weight: '1 كجم صافي',
        tags: ['مميز', 'أفضل مبيعاً', businessType]
      },
      {
        id: `prod-sample-2-${Date.now()}`,
        tenantId: newTenantId,
        name: `${storeName} - البكج التوفيري الثلاثي`,
        nameEn: `${storeNameEn} - Value Bundle Set (3x)`,
        description: 'باقة توفيرية تحتوي على تشكيلة منوعة لتجربة متكاملة بسعر منافس وجودة فائقة مع شحن مجاني.',
        categoryId: catId2,
        price: 490,
        comparePrice: 590,
        sku: `${(slug || 'ST').toUpperCase()}-002`,
        stock: 20,
        lowStockAlert: 3,
        images: [logoUrl],
        rating: 4.9,
        reviewsCount: 18,
        isFeatured: true,
        weight: '3 عبوات مختارة',
        tags: ['بكج', 'توفير', businessType]
      },
      {
        id: `prod-sample-3-${Date.now()}`,
        tenantId: newTenantId,
        name: `${storeName} - خلطة الضيافة الخاصة`,
        nameEn: `${storeNameEn} - Special Hospitality Blend`,
        description: 'إصدار محدود ومميز تم إنتاجه بعناية فائقة لتقديم أرقى تجربة للضيوف والمناسبات السعيدة.',
        categoryId: catId3,
        price: 195,
        comparePrice: 240,
        sku: `${(slug || 'ST').toUpperCase()}-003`,
        stock: 15,
        lowStockAlert: 2,
        images: [logoUrl],
        rating: 4.8,
        reviewsCount: 11,
        isFeatured: false,
        weight: '500 جم',
        tags: ['ضيافة', 'إصدار خاص', businessType]
      }
    ];

    createTenant(newTenant, sampleProducts, sampleCategories);
    setActiveTenantId(newTenantId);

    // Fire celebratory confetti!
    confetti({
      particleCount: 140,
      spread: 80,
      origin: { y: 0.6 }
    });

    setStep(7); // Show celebration & launch pad
  };

  // Turnkey Starter Kits
  const STARTER_KITS = [
    {
      id: 'kit-honey',
      title: 'مناحل النخبة للعسل الملكي',
      subtitle: 'هوية فاخرة بألوان الذهب والعنبر، خط تجوال، بوابات الدفع والتقسيط مع التحويل البنكي',
      businessType: 'honey' as BusinessType,
      primaryColor: '#D4A017',
      font: 'tajawal' as FontFamily,
      style: 'luxury' as ThemeStyle,
      layout: 'luxury' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80',
      badge: 'الأكثر مبيعاً ⭐'
    },
    {
      id: 'kit-coffee',
      title: 'محمصة البن الذهبي والمختص',
      subtitle: 'هوية دافئة باللون الإسبريسو والكراميل، خط الإسكندرية، تصميم عصري للمحاصيل والأدوات',
      businessType: 'coffee' as BusinessType,
      primaryColor: '#78350F',
      font: 'alexandria' as FontFamily,
      style: 'modern' as ThemeStyle,
      layout: 'modern' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
      badge: 'محاصيل مختصة ☕'
    },
    {
      id: 'kit-fashion',
      title: 'دار فيري للحرير والأزياء الراقية',
      subtitle: 'طابع مخملي إيديتوريال ناعم، خط المسيري، مخصص للعبايات والفساتين والماركات الفاخرة',
      businessType: 'fashion' as BusinessType,
      primaryColor: '#BE123C',
      font: 'el_messiri' as FontFamily,
      style: 'classic' as ThemeStyle,
      layout: 'editorial' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80',
      badge: 'أناقة حصرية 👗'
    },
    {
      id: 'kit-perfume',
      title: 'قصر العود والعطور الملكية',
      subtitle: 'هوية ملوكية ساحرة بألوان العود والبنفسجي، خط أميري وتجوال، أدهان عود وبخور فاخر',
      businessType: 'perfume' as BusinessType,
      primaryColor: '#7C3AED',
      font: 'amiri' as FontFamily,
      style: 'luxury' as ThemeStyle,
      layout: 'luxury' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500&auto=format&fit=crop&q=80',
      badge: 'نفحات ملكية 👑'
    },
    {
      id: 'kit-tech',
      title: 'عالم التقنية والأجهزة الذكية',
      subtitle: 'طابع ياقوتي إلكتروني جريء، خط ريدكس برو، تصميم شبكي عالي الكثافة للمنتجات',
      businessType: 'tech' as BusinessType,
      primaryColor: '#2563EB',
      font: 'readex' as FontFamily,
      style: 'bold' as ThemeStyle,
      layout: 'marketplace' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
      badge: 'أجهزة ذكية ⚡'
    },
    {
      id: 'kit-organic',
      title: 'صيدلية العناية والجمال العضوي',
      subtitle: 'ألوان الزيتون والنعناع المهدئة، خط المراعي الواضح، مستحضرات طبيعية وعناية متكاملة',
      businessType: 'beauty' as BusinessType,
      primaryColor: '#15803D',
      font: 'almarai' as FontFamily,
      style: 'organic' as ThemeStyle,
      layout: 'classic' as ThemeLayout,
      logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80',
      badge: '100% طبيعي 🌿'
    }
  ];

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
        
        {/* Top Header & Architecture Selector */}
        <div className="mb-8 text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-black shadow-inner">
            <Sparkles className="w-4 h-4" />
            <span>منظومة بناء وتخصيص المتاجر الإلكترونية المتكاملة (CommerceOS Architecture)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
            صمّم متجرك الإلكتروني الاحترافي بحرية تامة وتفاصيل عميقة
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            حرية كاملة في اختيار طريقة البناء، رفع الشعار وقصه مع أيقونة Favicon .ico، اختيار أرقى الخطوط العربية واللاتينية، تخصيص العملات والمدن وبوابات الدفع والتحويل البنكي المباشر.
          </p>

          {/* Building Path Selector Tabs */}
          {step <= totalSteps && (
            <div className="flex items-center justify-center pt-3">
              <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-1 shadow-xl">
                <button
                  type="button"
                  onClick={() => { setBuildMode('wizard'); setStep(1); }}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    buildMode === 'wizard' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>المعالج التفاعلي المتكامل (6 خطوات دقيقة)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBuildMode('starter_kits')}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all ${
                    buildMode === 'starter_kits' ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Rocket className="w-4 h-4" />
                  <span>باقات الإطلاق القطاعية الجاهزة (بنقرة واحدة)</span>
                </button>
              </div>
            </div>
          )}

          {/* Stepper Steps (Only in Wizard Mode) */}
          {buildMode === 'wizard' && step <= totalSteps && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {[
                { s: 1, label: 'القطاع والهوية' },
                { s: 2, label: 'الشعار والأيقونة' },
                { s: 3, label: 'الألوان والخطوط' },
                { s: 4, label: 'العملات والمدن' },
                { s: 5, label: 'بوابات الدفع' },
                { s: 6, label: 'المعاينة والإطلاق' }
              ].map(item => (
                <div key={item.s} className="flex items-center gap-1.5">
                  <button
                    onClick={() => item.s < step && setStep(item.s)}
                    disabled={item.s > step}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      step === item.s 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md scale-105' 
                        : item.s < step 
                          ? 'bg-slate-800 text-emerald-400 border-emerald-500/30' 
                          : 'bg-slate-900 text-slate-600 border-slate-800'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black bg-black/20">
                      {item.s < step ? '✓' : item.s}
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                  {item.s < totalSteps && (
                    <div className={`w-3 h-0.5 ${item.s < step ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MODE 2: STARTER KITS (READY-TO-LAUNCH INDUSTRY BUNDLES) */}
        {/* ======================================================== */}
        {buildMode === 'starter_kits' && step <= totalSteps && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STARTER_KITS.map(kit => (
                <div
                  key={kit.id}
                  className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:shadow-2xl transition-all flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {kit.badge}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-950">
                      <img src={kit.logo} alt={kit.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="text-right space-y-1">
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {kit.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {kit.subtitle}
                      </p>
                    </div>

                    {/* Meta Specs */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: kit.primaryColor }} />
                        <span className="font-mono">{kit.primaryColor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-amber-400" />
                        <span>خط {kit.font}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectBusinessType(kit.businessType);
                        setPrimaryColor(kit.primaryColor);
                        setFontFamily(kit.font);
                        setThemeStyle(kit.style);
                        setThemeLayout(kit.layout);
                        setLogoUrl(kit.logo);
                        setStoreName(kit.title);
                        setStoreNameEn(kit.title);
                        setSlug(kit.id.replace('kit-', ''));
                        handleLaunchStore({
                          businessType: kit.businessType,
                          name: kit.title,
                          logo: kit.logo
                        });
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl hover:scale-102 flex items-center justify-center gap-2 transition-all"
                    >
                      <Rocket className="w-4 h-4" />
                      <span>إطلاق هذا القالب بنقرة واحدة 🚀</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODE 1: DEEP INTERACTIVE WIZARD (6 STEPS)               */}
        {/* ======================================================== */}
        {buildMode === 'wizard' && step <= totalSteps && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Interactive Form Steps (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* STEP 1: BUSINESS SECTOR & BRAND DATA */}
              {step === 1 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="text-right border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 1: حدد قطاع نشاطك التجاري والبيانات الأساسية</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      اختر تصنيف المتجر لتوليد الإعدادات والهوية والأصناف النموذجية الملائمة له تلقائياً.
                    </p>
                  </div>

                  {/* Business Type Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {(Object.keys(BUSINESS_TYPE_CONFIG) as BusinessType[]).map(type => {
                      const Icon = businessTypeIcons[type] || Store;
                      const isSelected = businessType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleSelectBusinessType(type)}
                          className={`p-3.5 rounded-2xl border text-right flex flex-col justify-between gap-3 transition-all ${
                            isSelected 
                              ? 'bg-amber-500/10 border-amber-500 shadow-lg text-amber-300 scale-105' 
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                            {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold">{BUSINESS_TYPE_CONFIG[type].nameAr}</div>
                            <div className="text-[10px] text-slate-500 truncate">{BUSINESS_TYPE_CONFIG[type].nameEn}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Store Name & Slug Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-right">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">اسم المتجر بالعربية *</label>
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => {
                          setStoreName(e.target.value);
                          if (!slug || slug === 'elite-honey') {
                            setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                          }
                        }}
                        placeholder="مثال: متجر النخبة للعسل"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">اسم المتجر بالإنجليزية *</label>
                      <input
                        type="text"
                        value={storeNameEn}
                        onChange={(e) => setStoreNameEn(e.target.value)}
                        placeholder="e.g. Elite Honey Boutique"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 text-left font-mono"
                        dir="ltr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">الرابط الفرعي للمتجر (Slug)</label>
                      <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 overflow-hidden px-3" dir="ltr">
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                          className="py-2.5 bg-transparent text-xs text-amber-400 font-mono focus:outline-none flex-1 text-left"
                        />
                        <span className="text-[11px] text-slate-500 font-mono">.commerceos.app</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">شعار لفظي / سلوجان ترويجي</label>
                      <input
                        type="text"
                        value={slogan}
                        onChange={(e) => setSlogan(e.target.value)}
                        placeholder="مثال: أنقى خيرات الطبيعة بأعلى معايير الجودة"
                        className="w-full py-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-bold text-slate-300">وصف المتجر ومجال التميز</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اكتب نبذة تعريفية قصيرة تظهر في ترويسة المتجر وتساعد في تحسين محركات البحث SEO..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: LOGO & VISUAL ASSETS (CROP + FAVICON .ICO) */}
              {step === 2 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="text-right border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 2: الشعار، أيقونة المتصفح (.ico)، والصور البصرية</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      ارفع الشعار إما بملف من جهازك أو عبر رابط، مع إمكانية القص والتكبير والتدوير والمعاينة الحية لـ Favicon وأيقونة PWA.
                    </p>
                  </div>

                  {/* Logo Image Upload with Interactive Cropper */}
                  <div className="space-y-3 text-right">
                    <h3 className="text-sm font-black text-slate-200 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>شعار المتجر الرسمي (Logo & App Favicon)</span>
                    </h3>
                    <ImageUploadCropper
                      initialImage={logoUrl}
                      onImageChange={(newLogo) => setLogoUrl(newLogo)}
                      isLogoMode={true}
                      cropTitle="قص وتجهيز شعار المتجر وأيقونة الـ Favicon"
                      recommendedSize="512x512 بكسل (مربع)"
                      accentColor={primaryColor}
                    />
                  </div>

                  {/* Optional Cover Banner */}
                  <div className="space-y-3 text-right pt-4 border-t border-slate-800">
                    <h3 className="text-sm font-black text-slate-200 flex items-center gap-2">
                      <Layout className="w-4 h-4 text-amber-400" />
                      <span>صورة الغلاف / الهيرو بنر (Store Cover Banner)</span>
                    </h3>
                    <ImageUploadCropper
                      initialImage={coverUrl}
                      onImageChange={(newCover) => setCoverUrl(newCover)}
                      isLogoMode={false}
                      aspectRatio={16/9}
                      cropTitle="قص وتجهيز بانر الترويسة الرئيسية"
                      recommendedSize="1200x600 بكسل (16:9)"
                      accentColor={primaryColor}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: DESIGN TOKENS, EXPANDED FONTS & PALETTES */}
              {step === 3 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="text-right border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 3: لوحة الألوان الموسعة، الخطوط العربية، والأنماط المعمارية</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      اختر من بين 12 لوحة لونية احترافية و10 خطوط معتمدة تمنح متجرك هوية فريدة بعيداً عن القوالب المكررة.
                    </p>
                  </div>

                  {/* 12 Color Palettes */}
                  <div className="space-y-3 text-right">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black text-slate-300">لوحات الألوان المقترحة (12 Palette)</label>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">اللون الأساسي: {primaryColor}</span>
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-slate-700"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                      {PRESET_COLOR_PALETTES.map(pal => {
                        const isSelected = primaryColor.toLowerCase() === pal.hex.toLowerCase();
                        return (
                          <button
                            key={pal.id}
                            type="button"
                            onClick={() => {
                              setPrimaryColor(pal.hex);
                              setThemeStyle(pal.style);
                            }}
                            className={`p-3 rounded-2xl border text-right flex items-center justify-between gap-2 transition-all ${
                              isSelected 
                                ? 'bg-slate-800 border-amber-400 shadow-md scale-102' 
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: pal.hex }} />
                              <div className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: pal.secondary }} />
                            </div>
                            <div className="text-[11px] font-bold text-slate-200 truncate">{pal.name}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 10 Arabic & Latin Fonts */}
                  <div className="space-y-3 text-right pt-4 border-t border-slate-800">
                    <label className="text-xs font-black text-slate-300">الخطوط العربية واللاتينية المعتمدة (10 Fonts)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(Object.keys(FONTS_CONFIG) as FontFamily[]).map(fKey => {
                        const f = FONTS_CONFIG[fKey];
                        const isSelected = fontFamily === fKey;
                        return (
                          <button
                            key={fKey}
                            type="button"
                            onClick={() => setFontFamily(fKey)}
                            className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 ${
                              isSelected 
                                ? 'bg-amber-500/10 border-amber-400 shadow-md text-white' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs font-bold text-amber-300">{f.nameAr}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400">{f.category}</span>
                            </div>
                            <div 
                              className="text-sm font-bold text-slate-200 line-clamp-1 py-1"
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

                  {/* Layout & Architectural Controls */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-right">
                    
                    {/* Header Style */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">تنسيق الهيدر</label>
                      <select
                        value={headerStyle}
                        onChange={(e) => setHeaderStyle(e.target.value as any)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="floating">عائم زجاجي (Floating Glass)</option>
                        <option value="solid">شريط ثابت كلاسيكي (Solid Bar)</option>
                        <option value="island_blur">جزيرة تفاعلية (Island Blur)</option>
                        <option value="centered_logo">شعار في المنتصف (Centered Atelier)</option>
                      </select>
                    </div>

                    {/* Card Radius */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">انحناء الحواف (Radius)</label>
                      <select
                        value={radius}
                        onChange={(e) => setRadius(e.target.value as RadiusPreset)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="none">حواف حادة (0px Square)</option>
                        <option value="sm">انحناء طفيف ناعم (8px)</option>
                        <option value="md">انحناء متوازن عريض (16px)</option>
                        <option value="lg">انحناء مريح حديث (24px)</option>
                      </select>
                    </div>

                    {/* Card Style */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">نمط بطاقات المنتجات</label>
                      <select
                        value={cardStyle}
                        onChange={(e) => setCardStyle(e.target.value as any)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="bordered">إطار فاخر محدد (Luxury Bordered)</option>
                        <option value="elevated">ظل ناعم مرتفع (Elevated Soft)</option>
                        <option value="minimal">مينيمال مسطح (Flat Line Minimal)</option>
                        <option value="glass">زجاجي مبرد (Frosted Glass)</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4: CURRENCIES, ARAB COUNTRIES, CITIES & SHIPPING */}
              {step === 4 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="text-right border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Coins className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 4: العملات العربية، الدول، المدن، وسياسات التوصيل</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      حدد الدولة المستهدفة والعملة الرسمية وقائمة المدن المغطاة مع ضبط أسعار الشحن والشحن المجاني.
                    </p>
                  </div>

                  {/* Country Selector */}
                  <div className="space-y-3 text-right">
                    <label className="text-xs font-black text-slate-300">الدولة المستهدفة الأساسية</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {Object.entries(ARAB_COUNTRIES_AND_CITIES).map(([cCode, cData]) => {
                        const isSelected = countryCode === cCode;
                        return (
                          <button
                            key={cCode}
                            type="button"
                            onClick={() => handleCountryChange(cCode)}
                            className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                              isSelected 
                                ? 'bg-amber-500/15 border-amber-400 text-amber-300 shadow-md' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xl">{cData.flag}</span>
                            <div className="truncate">
                              <div className="text-xs font-bold">{cData.countryAr}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{cData.currency}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Currencies Grid */}
                  <div className="space-y-3 text-right pt-4 border-t border-slate-800">
                    <label className="text-xs font-black text-slate-300">العملة الرسمية لمتجرك (Store Currency)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {Object.entries(ARAB_CURRENCIES).map(([currKey, curr]) => {
                        const isSelected = currency === currKey;
                        return (
                          <button
                            key={currKey}
                            type="button"
                            onClick={() => setCurrency(currKey)}
                            className={`p-2.5 rounded-xl border text-right flex items-center justify-between gap-1 transition-all ${
                              isSelected 
                                ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md' 
                                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-xs">{curr.flag}</span>
                            <div className="text-right">
                              <div className="text-xs font-bold">{curr.symbol}</div>
                              <div className="text-[9px] opacity-80">{curr.code}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* City Selector & Shipping Costs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-right">
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">مدينة المقر الرئيسي للمتجر</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        {(ARAB_COUNTRIES_AND_CITIES[countryCode]?.cities || ['الرياض', 'جدة', 'الدمام']).map(ct => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">تكلفة الشحن القياسي ({ARAB_CURRENCIES[currency]?.symbol})</label>
                      <input
                        type="number"
                        min="0"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(Number(e.target.value))}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">حد الشحن المجاني ({ARAB_CURRENCIES[currency]?.symbol})</label>
                      <input
                        type="number"
                        min="0"
                        value={freeShippingThreshold}
                        onChange={(e) => setFreeShippingThreshold(Number(e.target.value))}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT GATEWAYS & DIRECT BANK TRANSFER */}
              {step === 5 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200">
                  <div className="text-right border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 5: بوابات الدفع الإلكتروني، التقسيط، والتحويل البنكي</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      فعّل أو عطل وسائل الدفع المتوافقة مع بلد عملائك (مدى، أبل باي، فيزا، تمارا، تابي، كي نت، بنفت، فوري، والتحويل البنكي مع الحسابات).
                    </p>
                  </div>

                  {/* Payment Gateways Toggle Grid */}
                  <div className="space-y-3 text-right">
                    <label className="text-xs font-black text-slate-300">بوابات الدفع الإلكتروني ومحافظ الجوال</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ARAB_PAYMENT_GATEWAYS_CATALOG.map(gw => {
                        const isEnabled = (paymentGateways as any)[gw.key] ?? false;
                        return (
                          <div
                            key={gw.id}
                            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                              isEnabled 
                                ? 'bg-slate-900 border-amber-500/50 shadow-md' 
                                : 'bg-slate-950/60 border-slate-800 opacity-60'
                            }`}
                          >
                            <div className="text-right space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white">{gw.nameAr}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                                  {gw.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-snug">{gw.descAr}</p>
                              <div className="text-[10px] text-emerald-400 font-bold pt-1">{gw.badge}</div>
                            </div>

                            {/* Switch Toggle */}
                            <button
                              type="button"
                              onClick={() => {
                                setPaymentGateways(prev => ({
                                  ...prev,
                                  [gw.key]: !isEnabled
                                }));
                              }}
                              className={`w-12 h-6 rounded-full p-1 transition-colors shrink-0 flex items-center ${
                                isEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
                              }`}
                            >
                              <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Bank Accounts Section (If Bank Transfer is enabled) */}
                  {paymentGateways.bankTransfer && (
                    <div className="space-y-4 pt-4 border-t border-slate-800 text-right">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <h3 className="text-xs font-black text-slate-200">
                            الحسابات البنكية المعتمدة للتحويل المباشر ({bankAccounts.length})
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsAddingBank(true)}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة حساب بنكي جديد</span>
                        </button>
                      </div>

                      {/* Bank Accounts List */}
                      <div className="space-y-2">
                        {bankAccounts.map((acc, idx) => (
                          <div
                            key={acc.id}
                            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-right"
                          >
                            <div className="space-y-0.5 flex-1">
                              <div className="text-xs font-black text-white flex items-center gap-2">
                                <span>{acc.bankName}</span>
                                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded-full">نشط</span>
                              </div>
                              <div className="text-[11px] text-slate-400">اسم الحساب: {acc.accountHolder}</div>
                              <div className="text-xs text-amber-300 font-mono font-bold" dir="ltr">{acc.iban}</div>
                            </div>

                            <button
                              type="button"
                              onClick={() => setBankAccounts(prev => prev.filter(b => b.id !== acc.id))}
                              className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add Bank Form Modal/Drawer */}
                      {isAddingBank && (
                        <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/40 space-y-3 animate-in fade-in duration-150">
                          <div className="text-xs font-black text-amber-300">إضافة حساب بنكي جديد لمتجرك</div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <input
                              type="text"
                              placeholder="اسم البنك (مثال: مصرف الإنماء)"
                              value={newBankName}
                              onChange={(e) => setNewBankName(e.target.value)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                            <input
                              type="text"
                              placeholder="اسم المستفيد / المؤسسة"
                              value={newAccountHolder}
                              onChange={(e) => setNewAccountHolder(e.target.value)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                            <input
                              type="text"
                              placeholder="رقم الآيبان (SA...)"
                              value={newIban}
                              onChange={(e) => setNewIban(e.target.value)}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => setIsAddingBank(false)}
                              className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs"
                            >
                              إلغاء
                            </button>
                            <button
                              type="button"
                              onClick={handleAddBankAccount}
                              className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black shadow-md hover:bg-amber-400"
                            >
                              حفظ الحساب
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}

              {/* STEP 6: PRE-LAUNCH SUMMARY & REVIEW */}
              {step === 6 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6 animate-in fade-in duration-200 text-right">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Rocket className="w-5 h-5 text-amber-400" />
                      <span>الخطوة 6: مراجعة الإعدادات وجاهزية الإطلاق الفوري</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      تم تجهيز كامل إعدادات المتجر، التصاميم، بوابات الدفع، والمنتجات النموذجية. اضغط زر الإطلاق لبدء التجربة الحية.
                    </p>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-300">معلومات الهوية والمتجر</div>
                      <div className="text-sm font-black text-white">{storeName}</div>
                      <div className="text-xs text-slate-400">{slogan}</div>
                      <div className="text-xs font-mono text-slate-500" dir="ltr">{slug}.commerceos.app</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-300">المظهر والهوية البصرية</div>
                      <div className="flex items-center gap-2 text-xs text-slate-200">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
                        <span>اللون الأساسي: {primaryColor}</span>
                      </div>
                      <div className="text-xs text-slate-400">الخط العربي: {FONTS_CONFIG[fontFamily]?.nameAr}</div>
                      <div className="text-xs text-slate-400">النمط: {themeStyle} / {themeLayout}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-300">العملة والتغطية الجغرافية</div>
                      <div className="text-xs text-slate-200">الدولة: {ARAB_COUNTRIES_AND_CITIES[countryCode]?.countryAr}</div>
                      <div className="text-xs text-slate-200">العملة: {ARAB_CURRENCIES[currency]?.nameAr} ({currency})</div>
                      <div className="text-xs text-slate-400">المدينة: {city} - الشحن المجاني من {freeShippingThreshold} {ARAB_CURRENCIES[currency]?.symbol}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="text-xs font-bold text-amber-300">وسائل الدفع المفعلة</div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {paymentGateways.mada && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">مدى</span>}
                        {paymentGateways.applePay && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">Apple Pay</span>}
                        {paymentGateways.visa && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">Visa/Master</span>}
                        {paymentGateways.tamara && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">تمارا</span>}
                        {paymentGateways.tabby && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">تابي</span>}
                        {paymentGateways.bankTransfer && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">تحويل بنكي ({bankAccounts.length})</span>}
                        {paymentGateways.cod && <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-200 font-bold">عند الاستلام</span>}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Navigation Actions Bar */}
              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => Math.max(1, prev - 1))}
                    className="py-3 px-6 rounded-2xl border border-slate-700 bg-slate-900 text-slate-300 text-xs font-bold hover:bg-slate-800 flex items-center gap-2 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                ) : <div />}

                {step < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setStep(prev => Math.min(totalSteps, prev + 1))}
                    className="py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xl hover:scale-105 flex items-center gap-2 transition-all"
                  >
                    <span>المتابعة للخطوة التالية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleLaunchStore()}
                    className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 text-sm font-black shadow-2xl hover:scale-105 flex items-center gap-2.5 transition-all"
                  >
                    <Rocket className="w-5 h-5" />
                    <span>إطلاق متجري الإلكتروني الآن 🚀</span>
                  </button>
                )}
              </div>

            </div>

            {/* Right Column: Live Storefront Preview (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 sticky top-6">
                
                {/* Preview Header & Device Toggles */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black text-slate-200">المعاينة الحية الفورية</span>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('desktop')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        previewTab === 'desktop' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="معاينة شاشة الديسكتوب"
                    >
                      <Laptop className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('mobile')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        previewTab === 'mobile' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                      }`}
                      title="معاينة شاشة الجوال وتطبيق الـ PWA"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Storefront Card */}
                <div 
                  className={`border rounded-2xl overflow-hidden shadow-2xl transition-all ${
                    previewTab === 'mobile' ? 'max-w-[280px] mx-auto text-xs' : 'w-full'
                  }`}
                  style={{
                    backgroundColor: liveTokens.background,
                    borderColor: liveTokens.border,
                    fontFamily: FONTS_CONFIG[fontFamily]?.cssFamily
                  }}
                >
                  {/* Store Header Bar */}
                  <div 
                    className="p-3 border-b flex items-center justify-between"
                    style={{ backgroundColor: liveTokens.surface, borderColor: liveTokens.border }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-950 shrink-0 border" style={{ borderColor: liveTokens.border }}>
                        <img src={logoUrl} alt="logo" className="w-full h-full object-cover" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black truncate max-w-[130px]" style={{ color: liveTokens.text }}>
                          {storeName}
                        </div>
                        <div className="text-[9px] truncate max-w-[130px]" style={{ color: liveTokens.primary }}>
                          {slogan}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg text-white" style={{ backgroundColor: liveTokens.primary }}>
                      <ShoppingBag className="w-3 h-3" />
                      <span>السلة (0)</span>
                    </div>
                  </div>

                  {/* Hero Mock */}
                  <div className="p-4 text-right space-y-2 border-b" style={{ backgroundColor: liveTokens.surfaceMuted, borderColor: liveTokens.border }}>
                    <div className="inline-block px-2 py-0.5 rounded-full text-[9px] font-black" style={{ backgroundColor: liveTokens.primaryLight, color: liveTokens.primaryDark }}>
                      المتجر المعتمد ⭐️
                    </div>
                    <div className="text-sm font-black leading-tight" style={{ color: liveTokens.text }}>
                      {slogan || storeName}
                    </div>
                    <p className="text-[10px] opacity-75 line-clamp-2" style={{ color: liveTokens.textMuted }}>
                      {description}
                    </p>
                    <button 
                      className="py-1.5 px-3 rounded-lg text-[10px] font-black text-white shadow-md flex items-center gap-1"
                      style={{ backgroundColor: liveTokens.primary }}
                    >
                      <span>تسوق الآن</span>
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Sample Product Card Mock */}
                  <div className="p-3 space-y-2">
                    <div className="text-[11px] font-bold text-right" style={{ color: liveTokens.text }}>
                      المنتجات الأكثر طلباً:
                    </div>
                    <div className="p-2.5 rounded-xl border flex items-center gap-2.5 text-right" style={{ backgroundColor: liveTokens.surface, borderColor: liveTokens.border }}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 shrink-0">
                        <img src={logoUrl} alt="sample" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold truncate" style={{ color: liveTokens.text }}>{storeName} - الصنف الملكي</div>
                        <div className="text-xs font-black pt-0.5" style={{ color: liveTokens.primary }}>
                          280 {ARAB_CURRENCIES[currency]?.symbol || 'ر.س'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Mock */}
                  <div className="p-2 text-center text-[9px] opacity-60 border-t" style={{ borderColor: liveTokens.border, color: liveTokens.textMuted }}>
                    جميع الحقوق محفوظة © {storeName} 2026
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-[11px] text-slate-500">
                    تتغير المعاينة الحية فورياً مع كل تعديل في الألوان والخطوط 🎨
                  </span>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 7: CELEBRATION & LAUNCH SUCCESS PAD                 */}
        {/* ======================================================== */}
        {step === 7 && (
          <div className="max-w-2xl mx-auto text-center p-8 sm:p-12 rounded-3xl bg-slate-900 border border-amber-500/50 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                مبروك! تم إطلاق متجرك الإلكتروني بنجاح 🎉
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                متجرك الآن جاهز لاستقبال الطلبات، بوابات الدفع والتحويل البنكي مفعلة، والواجهة مصممة بأعلى معايير الحداثة.
              </p>
            </div>

            {/* Quick Actions Pad */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                type="button"
                onClick={() => setCurrentView('storefront')}
                className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>زيارة واجهة المتجر الرئيسية (Storefront)</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('merchant_dashboard')}
                className="py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-xs border border-slate-700 flex items-center justify-center gap-2 hover:scale-105 transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span>فتح لوحة تحكم التاجر (Dashboard)</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('live_customizer')}
                className="text-xs text-amber-400 hover:underline font-bold"
              >
                أو تخصيص المزيد في استوديو التصميم الحي (Live Design Studio) ←
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
