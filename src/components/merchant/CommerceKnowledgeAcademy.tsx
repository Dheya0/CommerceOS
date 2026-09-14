import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  ShieldCheck, 
  Palette, 
  Calculator, 
  BookOpen, 
  Zap, 
  Layers, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  Target, 
  BarChart3, 
  PieChart, 
  Percent, 
  DollarSign, 
  Compass, 
  Check, 
  Copy,
  Award,
  HelpCircle,
  Eye,
  Smartphone,
  Sliders,
  Play
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const CommerceKnowledgeAcademy: React.FC = () => {
  const { language, addToast, activeTenant, updateTenantTokens } = useCommerce();
  const isAr = language === 'ar';

  const [activeCategory, setActiveCategory] = useState<'all' | 'design_theory' | 'growth_cro' | 'pricing_finance' | 'zatca_compliance' | 'supply_chain'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>('design_color_theory');

  // Interactive Profit & Margin Calculator State
  const [calcCost, setCalcCost] = useState<number>(50);
  const [calcSellingPrice, setCalcSellingPrice] = useState<number>(120);
  const [calcShippingCost, setCalcShippingCost] = useState<number>(15);
  const [calcAdSpendPerOrder, setCalcAdSpendPerOrder] = useState<number>(20);
  const [calcTaxRate, setCalcTaxRate] = useState<number>(15);

  // Computed Financials
  const netRevenueBeforeTax = calcSellingPrice / (1 + calcTaxRate / 100);
  const taxAmount = calcSellingPrice - netRevenueBeforeTax;
  const totalCost = calcCost + calcShippingCost + calcAdSpendPerOrder;
  const netProfit = netRevenueBeforeTax - totalCost;
  const profitMarginPercent = ((netProfit / calcSellingPrice) * 100);
  const roasRequired = calcSellingPrice / (calcAdSpendPerOrder || 1);

  // Knowledge Base Articles
  const articles = [
    {
      id: 'design_color_theory',
      category: 'design_theory',
      titleAr: 'سيكولوجية الألوان والنسبة الذهبية في متاجر التجارة الإلكترونية',
      titleEn: 'Color Psychology & Golden Ratio in E-Commerce Design',
      readTime: '6 min',
      difficulty: 'Intermediate',
      icon: Palette,
      badge: 'DESIGN MASTERCLASS',
      summaryAr: 'كيف تختار لوحة ألوان ترفع معدل التحويل وتثير مشاعر الثقة والفخامة باستخدام قاعدة 60-30-10 وتدرجات الألوان الفائقة.',
      summaryEn: 'Harness the 60-30-10 color rule and psychological triggers to boost trust and conversion rates.',
      contentAr: `
### 1. قاعدة التوزيع اللوني الذهبية (60 - 30 - 10 Rule)
في تصميم المتاجر الفاخرة، يتم توزيع الألوان هندسياً كالتالي:
- **60% اللون السائد (Dominant Background):** مساحات محايدة ومريحة للعين (كالأبيض العاجي أو الأسود الليلي العميق) لمنح المنتجات المساحة للبروز.
- **30% اللون الثانوي (Secondary Structural):** البطاقات، القوائم الجانبية، والحدود الهيكلية.
- **10% لون التمييز وإجراء الفعل (Accent / CTA):** أزرار الشراء، شارات الخصم، ومؤشرات السلة (مثل الذهبي الملكي #C9A45C أو الزمردي #10B981).

### 2. التباين ومعايير إمكانية الوصول (WCAG AA Contrast)
- يجب أن تكون نسبة تباين النصوص على الخلفية لا تقل عن **4.5:1** للنصوص العادية، و **3.0:1** للعناوين الكبيرة.
- تجنب وضع نصوص رمادية باهتة على خلفيات داكنة لأن ذلك يؤدي إلى انخفاض معدل التحويل بنسبة تصل إلى 23%.
      `,
      appliedThemePreset: {
        primary: '#C9A45C',
        secondary: '#1A2A3A',
        accent: '#D4AF37',
        background: '#070D18'
      }
    },
    {
      id: 'growth_cro_rules',
      category: 'growth_cro',
      titleAr: 'قوانين تحسين معدل التحويل (CRO) وتجربة إتمام الطلب (1-Click Checkout)',
      titleEn: 'Conversion Rate Optimization (CRO) & Frictionless Checkout',
      readTime: '8 min',
      difficulty: 'Advanced',
      icon: TrendingUp,
      badge: 'GROWTH ENGINE',
      summaryAr: 'تقليل خطوات الشراء، تحسين سرعة تحميل الصور، وبناء الثقة الفورية عبر شارات الأمان ووسائل الدفع السريع (Apple Pay & Mada).',
      summaryEn: 'Proven frameworks to reduce cart abandonment, accelerate page load, and leverage instant payment triggers.',
      contentAr: `
### 1. تقليل الاحتكاك في سلة المشتريات (Friction Reduction)
- **شراء الضيف (Guest Checkout):** عدم إجبار العميل على إنشاء كلمة مرور مسبقة يرفع التحويل بنسبة 35%.
- **الدفع بنقرة واحدة (One-Click Payment):** تفعيل Apple Pay و Mada و STC Pay مباشرة في صفحة المنتج.
- **شفافية تكاليف الشحن والضرائب:** إظهار التكلفة النهائية مبكراً يمنع 60% من حالات التخلي عن السلة.

### 2. المحفزات البصرية للإلحاح الإيجابي (Urgency & Social Proof)
- شارات المخزون المنخفض الذكية ("متبقي 3 قطع فقط").
- نافذة المبيعات الحية الأخيرة ("اشترى أحمد من الرياض هذا المنتج قبل 5 دقائق").
      `
    },
    {
      id: 'pricing_strategy_saas',
      category: 'pricing_finance',
      titleAr: 'استراتيجيات التسعير النفسي وحساب الهامش الربحي الصافي (Net Margin)',
      titleEn: 'Psychological Pricing Models & Unit Economics',
      readTime: '7 min',
      difficulty: 'Financial Mastery',
      icon: DollarSign,
      badge: 'FINANCIAL PLAYBOOK',
      summaryAr: 'معادلة حساب تكلفة اكتساب العميل (CAC) ومعدل العائد على الإنفاق الإعلاني (ROAS) لتفادي الخسائر غير المرئية.',
      summaryEn: 'Deep dive into Unit Economics, Contribution Margin, and ROAS requirements for sustainable profitability.',
      contentAr: `
### 1. نموذج اقتصاديات الوحدة (Unit Economics Breakdown)
لكل منتج تبيعه، يجب تفصيل المعادلة:
\`\`\`
صافي الربح = سعر البيع بدون ضريبة - (تكلفة المنتج + التغليف والشحن + عمولة بوابة الدفع + تكلفة الإعلان للطلب CAC)
\`\`\`
- **الهامش الربحي الآمن:** لا يقل عن **25% إلى 35%** بعد خصم كافة المصاريف التشغيلية.

### 2. التسعير النفسي واستراتيجية الـ Decoy Effect
- **تسعير الأرقام الفردية (.99 أو .90):** يمنح شعوراً بالقيمة الاقتصادية.
- **عرض الحزم (Bundling Strategy):** دمج منتجين متكاملين بخصم 15% يرفع متوسط قيمة السلة (AOV) بنسبة 40%.
      `
    },
    {
      id: 'zatca_saudi_e_invoicing',
      category: 'zatca_compliance',
      titleAr: 'الدليل التقني والتشريعي للفوترة الإلكترونية السعودية (ZATCA Phase 2)',
      titleEn: 'ZATCA Phase 2 Integration, Cryptography & Compliance',
      readTime: '10 min',
      difficulty: 'Regulatory',
      icon: ShieldCheck,
      badge: 'ZATCA COMPLIANT',
      summaryAr: 'شرح متطلبات التشفير، بصمة الـ UUID، توليد رمز الاستجابة السريعة TLV، وربط الفواتير الضريبية المبسطة.',
      summaryEn: 'Everything you need to know about TLV byte structure, SHA-256 hashes, cryptographic stamping and clearance.',
      contentAr: `
### 1. هيكل تشفير TLV لرمز الـ QR (Tag-Length-Value)
تتطلب هيئة الزكاة والضريبة والجمارك تشفير البيانات التالية بصيغة Base64 TLV:
1. **Tag 1 (0x01):** اسم المنشأة / التاجر.
2. **Tag 2 (0x02):** الرقم الضريبي المكون من 15 خانة ويبدأ وينتهي برقم 3.
3. **Tag 3 (0x03):** الطابع الزمني بتنسيق UTC ISO 8601.
4. **Tag 4 (0x04):** إجمالي الفاتورة شاملاً الضريبة.
5. **Tag 5 (0x05):** إجمالي مبلغ ضريبة القيمة المضافة (15%).

### 2. سلامة الفواتير ومنع التعديل (Anti-Tamper Cryptography)
- كل فاتورة يجب أن تحمل رقم تسلسلي فريد وغير قابل للتراجع.
- تشفير تجزئة الفاتورة (Invoice Hash) باستخدام خوارزمية SHA-256 لربط الفواتير ببعضها تسلسلياً (Blockchain-like Hash Chain).
      `
    },
    {
      id: 'supply_chain_logistics',
      category: 'supply_chain',
      titleAr: 'إدارة المخزون الذكي، دورة التوريد، ونموذج الشحن السريع (3PL Logistics)',
      titleEn: 'Smart Inventory Management, Safety Stock & 3PL Logistics',
      readTime: '5 min',
      difficulty: 'Operations',
      icon: Layers,
      badge: 'OPERATIONS',
      summaryAr: 'طرق حساب مخزون الأمان (Safety Stock) وتحديد نقطة إعادة الطلب (ROP) لتفادي نفاد المنتجات الأكثر مبيعاً.',
      summaryEn: 'Optimize supply lead times, safety stock buffer formulas, and automated reorder points.',
      contentAr: `
### 1. معادلة نقطة إعادة الطلب (Reorder Point - ROP)
\`\`\`
نقطة إعادة الطلب = (معدل المبيعات اليومي × مدة وصول الشحنة بالأيام) + مخزون الأمان
\`\`\`
- **مخزون الأمان (Safety Stock):** يحميك من تأخيرات شركات الشحن المفاجئة أو طفرات الطلب الموسمية.

### 2. تصنيف المنتجات بنموذج ABC Analysis
- **الفئة A (80% من الإيرادات):** 20% من المنتجات؛ يجب فحص مخزونها يومياً وتوفير شحن سريع لها.
- **الفئة B (15% من الإيرادات):** 30% من المنتجات؛ فحص أسبوعي.
- **الفئة C (5% من الإيرادات):** 50% من المنتجات؛ تصفيتها وتقليل تجميد رأس المال فيها.
      `
    }
  ];

  const filteredArticles = articles.filter(art => {
    const matchCat = activeCategory === 'all' || art.category === activeCategory;
    const matchSearch = searchQuery === '' || 
      art.titleAr.toLowerCase().includes(searchQuery.toLowerCase()) || 
      art.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summaryAr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const selectedArticle = articles.find(a => a.id === selectedArticleId) || articles[0];

  const handleApplyTheme = (palette: { primary: string; secondary: string; accent: string; background: string }) => {
    updateTenantTokens({
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
    });
    addToast(
      isAr ? 'تم تطبيق لوحة الألوان المدروسة بنجاح على متجرك!' : 'Knowledge-based Color Palette applied to store!',
      'success'
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      
      {/* Academy Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-[#060D19] via-[#0B1A30] to-[#060D19] border border-[#233247] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-12 -end-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -start-12 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" />
                COMMERCEOS INTEL & ACADEMY
              </span>
              <span className="text-xs text-slate-400 font-mono">V3.5 EXPERT KNOWLEDGE</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'موسوعة التجارة والتصميم والهندسة المالية' : 'Commerce, Design & Financial Intelligence Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'أدلة تطبيقية متقدمة، نظريات التصميم البصري والألوان، آلات حاسبة للهامش الربحي واقتصاديات الوحدة، وقواعد الامتثال الضريبي والسيبراني.'
                : 'Interactive blueprints, visual design ergonomics, unit economics calculators, and regulatory frameworks.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-[#081220]/90 border border-slate-700/60 backdrop-blur-md text-center shrink-0">
              <span className="block text-2xl font-black text-amber-400">100%</span>
              <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'جاهزية المعرفة' : 'Knowledge Score'}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#081220]/90 border border-slate-700/60 backdrop-blur-md text-center shrink-0">
              <span className="block text-2xl font-black text-emerald-400">5/5</span>
              <span className="text-[10px] text-slate-400 font-bold">{isAr ? 'محاور رئيسية' : 'Core Disciplines'}</span>
            </div>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            {[
              { id: 'all' as const, label: isAr ? 'الكل' : 'All Modules', icon: BookOpen },
              { id: 'design_theory' as const, label: isAr ? 'نظريات التصميم والألوان' : 'Visual Design & UI', icon: Palette },
              { id: 'growth_cro' as const, label: isAr ? 'النمو والتحويل (CRO)' : 'CRO & Checkout', icon: TrendingUp },
              { id: 'pricing_finance' as const, label: isAr ? 'الهوامش والتسعير' : 'Unit Economics', icon: DollarSign },
              { id: 'zatca_compliance' as const, label: isAr ? 'الضرائب و ZATCA' : 'ZATCA Compliance', icon: ShieldCheck },
              { id: 'supply_chain' as const, label: isAr ? 'سلسلة التوريد' : 'Supply Chain', icon: Layers },
            ].map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-black shadow-md' 
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isAr ? 'ابحث في الموسوعة والأدلة...' : 'Search guides & formulas...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

        </div>
      </div>

      {/* Main Knowledge Hub Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Article Directory & Interactive Tools (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Article List Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 tracking-wider flex items-center justify-between">
              <span>{isAr ? 'الأدلة والمحاضرات التطبيقية' : 'Curated Masterclasses'}</span>
              <span className="text-[10px] text-amber-400 font-bold">{filteredArticles.length} {isAr ? 'دليل' : 'Articles'}</span>
            </h3>

            {filteredArticles.map(art => {
              const Icon = art.icon;
              const isSelected = selectedArticleId === art.id;
              return (
                <div
                  key={art.id}
                  onClick={() => setSelectedArticleId(art.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-[#0E1E38] border-amber-500/50 shadow-lg shadow-amber-500/10' 
                      : 'bg-[#081220] border-slate-800 hover:border-slate-700 hover:bg-[#0A1628]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-amber-400/90 tracking-wide block">{art.badge}</span>
                        <h4 className="text-xs font-bold text-white leading-snug">{isAr ? art.titleAr : art.titleEn}</h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 shrink-0">{art.readTime}</span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {isAr ? art.summaryAr : art.summaryEn}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Interactive Profit & Unit Economics Calculator Tool */}
          <div className="p-6 rounded-3xl bg-[#081220] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'حاسبة اقتصاديات الوحدة وصافي الربح' : 'Live Unit Economics Simulator'}</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                PRO TOOL
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{isAr ? 'سعر البيع شاملاً الضريبة' : 'Selling Price'}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcSellingPrice}
                    onChange={(e) => setCalcSellingPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">{activeTenant?.currency || 'SAR'}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{isAr ? 'تكلفة شراء المنتج (COGS)' : 'Product Cost'}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcCost}
                    onChange={(e) => setCalcCost(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">{activeTenant?.currency || 'SAR'}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{isAr ? 'التغليف والشحن' : 'Shipping & Pack'}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcShippingCost}
                    onChange={(e) => setCalcShippingCost(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">{activeTenant?.currency || 'SAR'}</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">{isAr ? 'الإعلان لكل طلب (CAC)' : 'Ad Spend (CAC)'}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={calcAdSpendPerOrder}
                    onChange={(e) => setCalcAdSpendPerOrder(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-emerald-400 focus:outline-none"
                  />
                  <span className="absolute end-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-bold">{activeTenant?.currency || 'SAR'}</span>
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold">{isAr ? 'صافي الربح الفعلي للقطعة' : 'Net Profit Per Unit'}</span>
                <span className={`text-base font-black ${netProfit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {netProfit.toFixed(2)} {activeTenant?.currency || 'SAR'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'هامش الربح الصافي' : 'Net Margin'}</span>
                <span className={`font-black ${profitMarginPercent >= 25 ? 'text-emerald-400' : profitMarginPercent >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {profitMarginPercent.toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'عائد الإنفاق الإعلاني المستهدف (ROAS)' : 'Target ROAS'}</span>
                <span className="font-mono font-bold text-blue-400">
                  {roasRequired.toFixed(2)}x
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Full Deep Article Reader & Actionable Implementations (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl bg-[#081220] border border-slate-800 space-y-6">
            
            {/* Article Top Meta */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {selectedArticle.badge}
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-2">
                  {isAr ? selectedArticle.titleAr : selectedArticle.titleEn}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>⏱️ {selectedArticle.readTime}</span>
                  <span>•</span>
                  <span>📊 {selectedArticle.difficulty}</span>
                </div>
              </div>

              {selectedArticle.appliedThemePreset && (
                <button
                  onClick={() => handleApplyTheme(selectedArticle.appliedThemePreset!)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black transition-all shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تطبيق هذا الثيم على متجري' : 'Apply Preset to Store'}</span>
                </button>
              )}
            </div>

            {/* Article Body Content */}
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-200">
                <strong className="text-amber-400 block mb-1 font-bold">{isAr ? 'الملخص التنفيذي للمفهوم:' : 'Executive Summary:'}</strong>
                {isAr ? selectedArticle.summaryAr : selectedArticle.summaryEn}
              </div>

              <div className="whitespace-pre-line font-sans text-slate-300 space-y-2">
                {selectedArticle.contentAr}
              </div>
            </div>

            {/* Key Takeaways & Best Practices Checklist */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'قائمة المراجعة والتنفيذ الفوري (Actionable Checklist)' : 'Actionable Implementation Checklist'}</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'تطبيق نسبة التباين البصري 4.5:1 على جميع بطاقات المنتجات وأزرار الشراء' : 'Ensure 4.5:1 contrast on all product cards and CTAs'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'تفعيل بوابات الدفع الفوري (Mada & Apple Pay) لتقليل معدل التخلي عن السلة' : 'Activate 1-Click checkout to diminish cart abandonment'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? 'مراجعة تشفير ZATCA Phase 2 للتأكد من بصمات الفواتير المعتمدة' : 'Verify ZATCA Phase 2 TLV structure on issued tax invoices'}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
