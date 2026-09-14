import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { OptionalStoreFeatures } from '../../types';
import { getTenantFeatures } from '../../utils/defaultFeatures';
import { 
  Sparkles, 
  CreditCard, 
  Package, 
  Scissors, 
  Award, 
  ShieldCheck, 
  MessageCircle, 
  Share2, 
  Star, 
  Calculator, 
  Wallet, 
  TrendingDown, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Sliders, 
  RefreshCw, 
  Check, 
  HelpCircle,
  QrCode,
  Tag,
  Warehouse,
  Flame,
  Zap,
  Info
} from 'lucide-react';

export const FeatureManagerView: React.FC = () => {
  const { activeTenant, updateTenant, showToast, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const currentFeatures = getTenantFeatures(activeTenant?.featuresConfig);
  const [features, setFeatures] = useState<OptionalStoreFeatures>(currentFeatures);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'storefront' | 'backoffice'>('all');

  const handleToggle = async (key: keyof OptionalStoreFeatures) => {
    if (!activeTenant) return;
    const updated = {
      ...features,
      [key]: !features[key]
    };
    setFeatures(updated);
    setSavingKey(key);

    try {
      await updateTenant(activeTenant.id, {
        featuresConfig: updated
      });
      showToast(
        isAr 
          ? (updated[key] ? 'تم تفعيل الميزة بنجاح للمتجر' : 'تم تعطيل الميزة ولن تظهر للعملاء')
          : (updated[key] ? 'Feature enabled successfully' : 'Feature disabled'),
        updated[key] ? 'success' : 'info'
      );
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر تحديث إعدادات الميزة' : 'Failed to update feature', 'error');
    } finally {
      setSavingKey(null);
    }
  };

  const handleApplyPreset = async (type: 'enable_all' | 'minimal' | 'recommended') => {
    if (!activeTenant) return;
    let preset: OptionalStoreFeatures;

    if (type === 'enable_all') {
      preset = {
        installmentsCalculator: true,
        wholesaleB2BTiers: true,
        laserEngravingOption: true,
        luxuryGiftWrapping: true,
        fragrancePyramidSFDA: true,
        electronicsWarranty: true,
        fashionSizeGuide: true,
        whatsappDirectInquiry: true,
        shareProductLink: true,
        zatcaQrCodeInvoice: true,
        customerReviewsSystem: true,
        posCashierModule: true,
        debtsLedgerModule: true,
        expensesTrackerModule: true,
        commercialSectorsHub: true,
        openBankingIntegration: true,
        couponsMarketingModule: true,
        inventoryAlerts: true
      };
    } else if (type === 'minimal') {
      // Cleanest, absolute minimal setup
      preset = {
        installmentsCalculator: false,
        wholesaleB2BTiers: false,
        laserEngravingOption: false,
        luxuryGiftWrapping: false,
        fragrancePyramidSFDA: false,
        electronicsWarranty: false,
        fashionSizeGuide: false,
        whatsappDirectInquiry: true,
        shareProductLink: true,
        zatcaQrCodeInvoice: false,
        customerReviewsSystem: false,
        posCashierModule: false,
        debtsLedgerModule: false,
        expensesTrackerModule: false,
        commercialSectorsHub: false,
        openBankingIntegration: false,
        couponsMarketingModule: false,
        inventoryAlerts: false
      };
    } else {
      // Sector-tailored recommended
      const bType = activeTenant.businessType;
      preset = {
        installmentsCalculator: true,
        wholesaleB2BTiers: bType === 'wholesale' || bType === 'general',
        laserEngravingOption: bType === 'accessories' || bType === 'general',
        luxuryGiftWrapping: bType === 'accessories' || bType === 'perfume' || bType === 'beauty',
        fragrancePyramidSFDA: bType === 'perfume' || bType === 'beauty',
        electronicsWarranty: bType === 'electronics' || bType === 'tech',
        fashionSizeGuide: bType === 'fashion',
        whatsappDirectInquiry: true,
        shareProductLink: true,
        zatcaQrCodeInvoice: true,
        customerReviewsSystem: true,
        posCashierModule: true,
        debtsLedgerModule: true,
        expensesTrackerModule: true,
        commercialSectorsHub: true,
        openBankingIntegration: true,
        couponsMarketingModule: true,
        inventoryAlerts: true
      };
    }

    setFeatures(preset);
    try {
      await updateTenant(activeTenant.id, { featuresConfig: preset });
      showToast(isAr ? 'تم تطبيق القالب بنجاح' : 'Preset applied successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر تطبيق القالب' : 'Failed to apply preset', 'error');
    }
  };

  const featureCards: {
    key: keyof OptionalStoreFeatures;
    category: 'storefront' | 'backoffice';
    titleAr: string;
    titleEn: string;
    descAr: string;
    descEn: string;
    icon: any;
    tagAr: string;
    tagEn: string;
    color: string;
  }[] = [
    // Storefront Features
    {
      key: 'installmentsCalculator',
      category: 'storefront',
      titleAr: 'حاسبة التقسيط بدون فوائد (تابي وتمارا)',
      titleEn: '4x Installments Widget (Tabby & Tamara)',
      descAr: 'عرض حاسبة التقسيط التلقائية على 4 دفعات شهرية داخل صفحة المنتج وتفاصيل السعر.',
      descEn: 'Shows automatic 4-month installment breakdown widget on product modal and cards.',
      icon: CreditCard,
      tagAr: 'زيادة المبيعات',
      tagEn: 'High Conversion',
      color: 'from-amber-500/20 to-rose-500/20 text-amber-400 border-amber-500/30'
    },
    {
      key: 'wholesaleB2BTiers',
      category: 'storefront',
      titleAr: 'جدول أسعار الجملة للشركات والكميات (B2B)',
      titleEn: 'B2B Wholesale Pricing Tiers',
      descAr: 'عرض جدول أسعار الدرزن والكرتون والكميات مع احتساب الخصم الفوري التلقائي.',
      descEn: 'Displays bulk pricing table with instant tier discounts for businesses.',
      icon: Package,
      tagAr: 'تجارة الجملة',
      tagEn: 'Wholesale & Bulk',
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30'
    },
    {
      key: 'laserEngravingOption',
      category: 'storefront',
      titleAr: 'حقل النقش والحفر بالليزر المخصص',
      titleEn: 'Custom Laser Engraving Option',
      descAr: 'تمكين العميل من كتابة نص أو اسم أو تاريخ ليتم نقشه بالليزر على القطعة.',
      descEn: 'Allows customer to enter custom text, name or date for personalized engraving.',
      icon: Sparkles,
      tagAr: 'تخصيص الإكسسوارات',
      tagEn: 'Customization',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
    },
    {
      key: 'luxuryGiftWrapping',
      category: 'storefront',
      titleAr: 'إضافة التغليف المخملي الفاخر والإهداء',
      titleEn: 'Velvet Luxury Gift Wrapping Add-on',
      descAr: 'خيار إضافي للعميل لإضافة صندوق مخملي ملكي وكيس إهداء مدفوع أو مجاني.',
      descEn: 'Optional add-on for royal velvet box and premium gift packaging.',
      icon: Scissors,
      tagAr: 'الهدايا والمناسبات',
      tagEn: 'Gifts & Wrapping',
      color: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
    },
    {
      key: 'fragrancePyramidSFDA',
      category: 'storefront',
      titleAr: 'الهرم العطري وشارة هيئة الغذاء والدواء (SFDA)',
      titleEn: 'Fragrance Pyramid & SFDA Badge',
      descAr: 'عرض مكونات القمة والقلب والقاعدة العطرية وشارة الاعتماد لمنتجات التجميل.',
      descEn: 'Displays top, heart, base fragrance notes and Saudi FDA compliance badge.',
      icon: Award,
      tagAr: 'عطور وتجميل',
      tagEn: 'Perfumes & Beauty',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'electronicsWarranty',
      category: 'storefront',
      titleAr: 'شارة الضمان المعتمد سنتين والمواصفات التقنية',
      titleEn: '2-Year Official Agency Warranty & Specs',
      descAr: 'إبراز ضمان الوكيل المعتمد والمواصفات الفنية المتقدمة للإلكترونيات والأجهزة.',
      descEn: 'Highlights official 2-year warranty and advanced technical specifications.',
      icon: ShieldCheck,
      tagAr: 'إلكترونيات وأجهزة',
      tagEn: 'Electronics',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
    },
    {
      key: 'fashionSizeGuide',
      category: 'storefront',
      titleAr: 'دليل القياسات ومواصفات الأقمشة للملابس',
      titleEn: 'Fashion Sizing Guide & Fabric Specs',
      descAr: 'عرض جدول القياسات بالسنتيمتر وتفاصيل نوع القماش ونعومته.',
      descEn: 'Displays standard sizing measurement table and fabric composition.',
      icon: Scissors,
      tagAr: 'أزياء وملابس',
      tagEn: 'Fashion',
      color: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30'
    },
    {
      key: 'whatsappDirectInquiry',
      category: 'storefront',
      titleAr: 'زر الاستفسار المباشر عبر الواتساب',
      titleEn: 'Direct WhatsApp Inquiry Button',
      descAr: 'زر فوري في صفحة المنتج يفتح دردشة واتساب مع تفاصيل المنتج والـ SKU تلقائياً.',
      descEn: 'Instant button opening WhatsApp with prefilled product name and SKU.',
      icon: MessageCircle,
      tagAr: 'تواصل فوري',
      tagEn: 'Messaging',
      color: 'from-emerald-500/20 to-green-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'shareProductLink',
      category: 'storefront',
      titleAr: 'زر مشاركة ونسخ رابط المنتج',
      titleEn: 'Product Link Copy & Sharing',
      descAr: 'زر سريع لنسخ الرابط المباشر للمنتج ومشاركته على منصات التواصل.',
      descEn: 'Quick button to copy direct product URL and share to social media.',
      icon: Share2,
      tagAr: 'انتشار ومشاركة',
      tagEn: 'Social Share',
      color: 'from-slate-500/20 to-slate-600/20 text-slate-300 border-slate-500/30'
    },
    {
      key: 'customerReviewsSystem',
      category: 'storefront',
      titleAr: 'نظام تقييمات العملاء ونجوم التقييم الموثقة',
      titleEn: 'Verified Customer Ratings & Star Reviews',
      descAr: 'عرض النجوم الذهبية وعدد التقييمات الإيجابية الموثقة على كل منتج.',
      descEn: 'Shows star ratings and verified review counts on product cards and modals.',
      icon: Star,
      tagAr: 'ثقة العميل',
      tagEn: 'Social Proof',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
    },

    // Backoffice Modules
    {
      key: 'posCashierModule',
      category: 'backoffice',
      titleAr: 'نظام الكاشير ونقاط البيع السحابية (POS)',
      titleEn: 'POS Cloud Cashier Terminal',
      descAr: 'نظام محاسبي سريع للمعارض والمحلات مع دعم ماسح الباركود والفواتير الفورية.',
      descEn: 'High-speed cashier terminal with barcode scanner and instant receipt printer.',
      icon: Calculator,
      tagAr: 'المتاجر والمعارض',
      tagEn: 'In-Store POS',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'debtsLedgerModule',
      category: 'backoffice',
      titleAr: 'سجل الحسابات الآجلة والديون (دائن ومدين)',
      titleEn: 'Debts & Receivables Ledger',
      descAr: 'إدارة الذمم المدينة للعملاء والدائنة للموردين مع تنبيهات الاستحقاق وسندات القبض.',
      descEn: 'Manages customer receivables, supplier payables, due dates, and receipts.',
      icon: Wallet,
      tagAr: 'محاسبة ومالية',
      tagEn: 'Finance & Debts',
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30'
    },
    {
      key: 'expensesTrackerModule',
      category: 'backoffice',
      titleAr: 'سجل المصروفات التشغيلية والتكاليف',
      titleEn: 'Operating Expenses Tracker',
      descAr: 'تسجيل وتصنيف المصروفات (إيجارات، رواتب، شحن، تسويق) مع حساب الضريبة المستردة.',
      descEn: 'Records and classifies operational expenses with refundable tax tracking.',
      icon: TrendingDown,
      tagAr: 'محاسبة ومالية',
      tagEn: 'Expenses',
      color: 'from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30'
    },
    {
      key: 'commercialSectorsHub',
      category: 'backoffice',
      titleAr: 'مركز حلول القطاعات التجارية المتخصصة',
      titleEn: 'Commercial Sectors Hub',
      descAr: 'أدوات مخصصة لتجارة الجملة، الإلكترونيات، الإكسسوارات، العطور، والأزياء.',
      descEn: 'Dedicated sector tools for B2B wholesale, electronics, luxury, and fashion.',
      icon: Building2,
      tagAr: 'تخصيص النشاط',
      tagEn: 'Industry Tools',
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30'
    },
    {
      key: 'openBankingIntegration',
      category: 'backoffice',
      titleAr: 'الربط البنكي المفتوح ومطابقة الحوالات (Open Banking)',
      titleEn: 'Open Banking & Bank Reconciliation',
      descAr: 'ربط الحسابات المصرفية مع الراجحي والأهلي ومطابقة كشوفات الحساب التلقائية.',
      descEn: 'Direct integration with Saudi & GCC banks and auto reconciliation.',
      icon: CreditCard,
      tagAr: 'بنوك ومدفوعات',
      tagEn: 'Open Banking',
      color: 'from-purple-500/20 to-indigo-500/20 text-purple-400 border-purple-500/30'
    },
    {
      key: 'couponsMarketingModule',
      category: 'backoffice',
      titleAr: 'كوبونات الخصم والحملات الترويجية',
      titleEn: 'Coupons & Discount Campaigns',
      descAr: 'إنشاء وإدارة أكواد الخصم والحدود الدنيا للشراء وربطها بالمواسم.',
      descEn: 'Create promo codes, percentage or fixed discounts, and expiry dates.',
      icon: Tag,
      tagAr: 'تسويق ومبيعات',
      tagEn: 'Marketing',
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30'
    },
    {
      key: 'inventoryAlerts',
      category: 'backoffice',
      titleAr: 'تنبيهات انخفاض المخزون وإدارة المستودع',
      titleEn: 'Low Stock Alerts & Warehouse Tracking',
      descAr: 'إشعارات تلقائية عند وصول المنتج للحد الحرج وتتبع الكميات بالمستودعات.',
      descEn: 'Automated warnings when stock drops below threshold.',
      icon: Warehouse,
      tagAr: 'المخزون واللوجستيات',
      tagEn: 'Inventory',
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30'
    },
    {
      key: 'zatcaQrCodeInvoice',
      category: 'backoffice',
      titleAr: 'الفاتورة الإلكترونية المعتمدة ورمز ZATCA QR',
      titleEn: 'ZATCA E-Invoicing Phase 2 QR',
      descAr: 'توليد وطباعة رمز الاستجابة المشفر المعتمد لهيئة الزكاة والضريبة والجمارك.',
      descEn: 'Generates compliant Phase 2 TLV cryptographic QR code on receipts and invoices.',
      icon: QrCode,
      tagAr: 'امتثال نظامي',
      tagEn: 'ZATCA Ready',
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30'
    }
  ];

  const filteredCards = featureCards.filter(c => {
    if (activeFilter === 'all') return true;
    return c.category === activeFilter;
  });

  const enabledCount = Object.values(features).filter(Boolean).length;
  const totalCount = featureCards.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0B1422] via-[#0F1D32] to-[#0A101C] border border-[#233247] p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-black border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>حرية التخصيص الكاملة (No Vendor Lock-in)</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {enabledCount} من {totalCount} ميزة مفعلة
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isAr ? 'مركز التحكم في الميزات والوحدات الاختيارية' : 'Feature & Modular Store Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-[#97A4B5] max-w-2xl leading-relaxed">
              {isAr 
                ? 'لا نفرض عليك أي ميزة أو شاشة لا ترغب بها. جميع الأدوات (التقسيط، الجملة، الحفر بالليزر، الديون، المصروفات، الكاشير) اختيارية تماماً ويمكنك تفعيلها أو تعطيلها بنقرة زر واحدة.'
                : 'Zero forced modules. You have 100% control to enable or disable any feature (Installments, B2B Bulk, Engraving, Debts, Expenses, POS) whenever you wish.'}
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleApplyPreset('recommended')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isAr ? 'المقترح لنشاطي' : 'Recommended for me'}</span>
            </button>
            <button
              onClick={() => handleApplyPreset('enable_all')}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/10 transition-all"
            >
              {isAr ? 'تفعيل الكل' : 'Enable All'}
            </button>
            <button
              onClick={() => handleApplyPreset('minimal')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-slate-400 hover:text-white font-bold text-xs border border-slate-800 transition-all"
            >
              {isAr ? 'أبسط متجر (Minimal)' : 'Minimalist Store'}
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all' 
                ? 'bg-amber-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {isAr ? `جميع الميزات (${featureCards.length})` : `All Features (${featureCards.length})`}
          </button>
          <button
            onClick={() => setActiveFilter('storefront')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'storefront' 
                ? 'bg-amber-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {isAr ? 'واجهة المتجر وصفحة المنتج (10)' : 'Storefront & Products (10)'}
          </button>
          <button
            onClick={() => setActiveFilter('backoffice')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'backoffice' 
                ? 'bg-amber-400 text-slate-950 font-black shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {isAr ? 'لوحة التحكم والأنظمة الإدارية والمالية (8)' : 'Backoffice & Finance (8)'}
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCards.map((card) => {
          const Icon = card.icon;
          const isEnabled = Boolean(features[card.key]);
          const isSaving = savingKey === card.key;

          return (
            <div
              key={card.key}
              className={`p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                isEnabled 
                  ? 'bg-[#0B1422] border-slate-700/80 shadow-xl shadow-black/40' 
                  : 'bg-[#080E18]/60 border-slate-800/40 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Top Row: Icon + Badge + Toggle */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} border flex items-center justify-center shrink-0 shadow-inner`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {isAr ? card.titleAr : card.titleEn}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {isAr ? card.tagAr : card.tagEn}
                      </span>
                    </div>
                  </div>

                  {/* Switch Toggle Button */}
                  <button
                    onClick={() => handleToggle(card.key)}
                    disabled={isSaving}
                    aria-label={`Toggle ${card.titleEn}`}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isEnabled ? 'bg-amber-400' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isEnabled 
                          ? (isAr ? '-translate-x-5' : 'translate-x-5')
                          : 'translate-x-0'
                      }`}
                    >
                      {isEnabled ? (
                        <Check className="w-3.5 h-3.5 text-amber-400 m-auto mt-1.5" />
                      ) : (
                        <span className="block w-2 h-2 rounded-full bg-slate-400 m-auto mt-2" />
                      )}
                    </span>
                  </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#97A4B5] leading-relaxed mb-4">
                  {isAr ? card.descAr : card.descEn}
                </p>
              </div>

              {/* Bottom Status Footnote */}
              <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  {isEnabled ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'مفعلة وتظهر بالمتجر' : 'Active in Store'}</span>
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{isAr ? 'معطلة (مخفية تماماً)' : 'Disabled & Hidden'}</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleToggle(card.key)}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                  {isEnabled ? (isAr ? 'تعطيل' : 'Disable') : (isAr ? 'تفعيل الآن' : 'Enable now')}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
