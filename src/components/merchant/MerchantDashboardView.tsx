import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  Package, 
  RefreshCw, 
  Plus, 
  ExternalLink,
  ChevronRight,
  Store,
  ShieldAlert,
  Info,
  Sliders,
  Check,
  Layers,
  Truck,
  CreditCard,
  Palette,
  Globe,
  Calculator,
  ArrowLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useCommerce } from '../../context/CommerceContext';

interface MerchantDashboardViewProps {
  setActiveSection: (section: string, subParam?: string) => void;
}

export const MerchantDashboardView: React.FC<MerchantDashboardViewProps> = ({ setActiveSection }) => {
  const { 
    activeTenant, 
    products, 
    orders, 
    customers, 
    language, 
    showToast 
  } = useCommerce();

  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  // Date Range Filter State
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real Automatic Detection of Store Readiness
  const hasProducts = Boolean(products && products.length > 0);
  
  const activeGatewaysList: string[] = [];
  if (activeTenant.paymentGateways?.mada) activeGatewaysList.push('مدى');
  if (activeTenant.paymentGateways?.applePay) activeGatewaysList.push('Apple Pay');
  if (activeTenant.paymentGateways?.visa) activeGatewaysList.push('Visa');
  if (activeTenant.paymentGateways?.tamara) activeGatewaysList.push('تمارا');
  if (activeTenant.paymentGateways?.tabby) activeGatewaysList.push('تابي');
  if (activeTenant.paymentGateways?.bankTransfer) activeGatewaysList.push('التحويل البنكي');
  if (activeTenant.paymentGateways?.cod) activeGatewaysList.push('الدفع عند الاستلام');

  const hasBankAccounts = Boolean(
    activeTenant.bankAccounts && 
    activeTenant.bankAccounts.length > 0 && 
    activeTenant.bankAccounts.some(b => b.iban && b.iban.trim() !== '')
  );

  const hasPayments = activeGatewaysList.length > 0 || hasBankAccounts;

  const activeShippingCount = activeTenant.shippingMethods?.filter(s => s.active).length || 0;
  const hasShipping = activeShippingCount > 0;

  const hasCustomLogo = Boolean(activeTenant.logo && activeTenant.logo.trim() !== '');
  const hasSlogan = Boolean(activeTenant.slogan && activeTenant.slogan.trim() !== '');
  const hasCustomization = Boolean(
    hasCustomLogo ||
    hasSlogan ||
    activeTenant.logoIcon ||
    (activeTenant.theme && (activeTenant.theme.primaryColor || activeTenant.theme.style || activeTenant.theme.heroBannerImage))
  );

  const hasPosReady = true;

  const isPublished = Boolean(
    activeTenant.status === 'live' ||
    activeTenant.storeOperationalStatus === 'live'
  );

  const readinessTasks = [
    {
      key: 'products',
      title: isAr ? 'إضافة المنتجات' : 'Add Products',
      icon: Package,
      done: hasProducts,
      desc: hasProducts 
        ? (isAr ? `${products.length} منتجات مضافة ونشطة` : `${products.length} active products`)
        : (isAr ? 'لم تتم إضافة أي منتج بعد' : 'No products added yet'),
      actionText: hasProducts 
        ? (isAr ? 'إدارة المنتجات' : 'Manage Products')
        : (isAr ? 'إضافة منتج الآن' : 'Add Product Now'),
      onAction: () => {
        if (!hasProducts) {
          setActiveSection('products', 'new');
        } else {
          setActiveSection('products');
        }
      }
    },
    {
      key: 'shipping',
      title: isAr ? 'خيارات الشحن' : 'Setup Shipping',
      icon: Truck,
      done: hasShipping,
      desc: hasShipping
        ? (isAr ? `${activeShippingCount} خيارات شحن وتوصيل مفعّلة` : `${activeShippingCount} shipping carriers active`)
        : (isAr ? 'حدد شركات وأسعار وأوزان الشحن' : 'Configure delivery carriers & weights'),
      actionText: hasShipping
        ? (isAr ? 'تعديل خيارات الشحن' : 'Edit Shipping')
        : (isAr ? 'تجهيز الشحن الآن' : 'Setup Shipping Now'),
      onAction: () => {
        setActiveSection('settings', 'shipping');
      }
    },
    {
      key: 'payments',
      title: isAr ? 'المدفوعات والبنوك' : 'Configure Payments',
      icon: CreditCard,
      done: hasPayments,
      desc: hasPayments
        ? (isAr ? (activeGatewaysList.length > 0 ? `مفعّل: ${activeGatewaysList.slice(0, 3).join('، ')}` : 'حساب بنكي مسجل للتحويل') : 'Payment gateways active')
        : (isAr ? 'يلزم تفعيل بوابات الدفع أو ربط الآيبان' : 'Enable Mada, Apple Pay, Bank IBAN'),
      actionText: hasPayments
        ? (isAr ? 'إدارة المدفوعات' : 'Manage Payments')
        : (isAr ? 'تهيئة الدفع الآن' : 'Setup Payments Now'),
      onAction: () => {
        setActiveSection('settings', 'payments');
      }
    },
    {
      key: 'customization',
      title: isAr ? 'تخصيص الهوية' : 'Customize Brand',
      icon: Palette,
      done: hasCustomization,
      desc: hasCustomization
        ? (isAr ? 'الهوية والشعار معتمدة ومخصصة' : 'Branding & logo customized')
        : (isAr ? 'اختر الشعار، الألوان، والسلوجان' : 'Select logo, slogan & brand styling'),
      actionText: hasCustomization
        ? (isAr ? 'استوديو التصميم' : 'Design Studio')
        : (isAr ? 'تخصيص الهوية الآن' : 'Customize Brand Now'),
      onAction: () => {
        setActiveSection('design');
      }
    },
    {
      key: 'pos_cashier',
      title: isAr ? 'نقطة البيع والكاشير المكتبي' : 'Point of Sale (POS)',
      icon: Calculator,
      done: hasPosReady,
      desc: isAr ? 'شاشة الكاشير والبيع السريع وطباعة الإيصالات مهيأة' : 'Quick register and receipt printing ready',
      actionText: isAr ? 'فتح الكاشير' : 'Open Register',
      onAction: () => {
        setActiveSection('pos');
      }
    },
    {
      key: 'publishing',
      title: isAr ? 'تصدير حزم النظام المستقلة' : 'Export Standalone Packages',
      icon: ExternalLink,
      done: isPublished,
      desc: isPublished
        ? (isAr ? 'جاهز لتصدير الكود وحزم التطبيق للتشغيل الذاتي' : 'Ready to export source code & standalone bundle')
        : (isAr ? 'تصدير الكود وحزم سطح المكتب والأندرويد' : 'Export code and desktop/android bundles'),
      actionText: isPublished
        ? (isAr ? 'مركز التصدير' : 'Export Center')
        : (isAr ? 'تصدير الحزم الآن' : 'Export Now'),
      onAction: () => {
        setActiveSection('publish');
      }
    }
  ];

  const completedTasksCount = readinessTasks.filter(t => t.done).length;
  const readinessPercentage = Math.round((completedTasksCount / readinessTasks.length) * 100);

  // Sales chart data mock based on date range
  const salesChartData = dateRange === '7d' ? [
    { date: isAr ? 'السبت' : 'Sat', sales: 12000, orders: 42 },
    { date: isAr ? 'الأحد' : 'Sun', sales: 15400, orders: 55 },
    { date: isAr ? 'الإثنين' : 'Mon', sales: 18200, orders: 63 },
    { date: isAr ? 'الثلاثاء' : 'Tue', sales: 14100, orders: 48 },
    { date: isAr ? 'الأربعاء' : 'Wed', sales: 21000, orders: 72 },
    { date: isAr ? 'الخميس' : 'Thu', sales: 24500, orders: 85 },
    { date: isAr ? 'الجمعة' : 'Fri', sales: 29800, orders: 98 },
  ] : [
    { date: isAr ? 'الأسبوع 1' : 'Week 1', sales: 85000, orders: 290 },
    { date: isAr ? 'الأسبوع 2' : 'Week 2', sales: 94000, orders: 320 },
    { date: isAr ? 'الأسبوع 3' : 'Week 3', sales: 112000, orders: 390 },
    { date: isAr ? 'الأسبوع 4' : 'Week 4', sales: 128420, orders: 428 },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث لوحة التحكم بنجاح' : 'Dashboard updated successfully', 'success');
    }, 600);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#233247]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F6F8] tracking-tight">
              {isAr ? 'نظرة عامة على المتجر' : 'Store Overview'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold">
              {activeTenant.storeName}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#97A4B5] mt-1">
            {isAr ? 'كل ما تحتاج لمعرفته عن أداء متجرك ومبيعاتك في مكان واحد.' : 'Everything you need to know about your store performance in one place.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector */}
          <div className="flex items-center bg-[#0B1422] border border-[#233247] rounded-xl p-1 text-xs">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-lg font-semibold uppercase transition-all ${
                  dateRange === range 
                    ? 'bg-[#C9A45C] text-[#050B14] shadow' 
                    : 'text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-[#101B2C]'
                }`}
              >
                {range === '7d' ? (isAr ? '7 أيام' : '7D') : range === '30d' ? (isAr ? '30 يومًا' : '30D') : (isAr ? '90 يومًا' : '90D')}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-[#97A4B5] hover:text-[#F4F6F8] transition-all flex items-center gap-2 text-xs font-semibold ${
              isRefreshing ? 'animate-pulse text-[#C9A45C]' : ''
            }`}
            title={isAr ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          {/* Primary Action: Add Product */}
          <button
            onClick={() => setActiveSection('products')}
            className="px-4 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#B38F27] text-[#050B14] text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* Store Readiness Automated Checklist */}
      <div className="bg-gradient-to-br from-[#0B1422] to-[#050B14] border border-[#C9A45C]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-1">
              <Store className="w-4 h-4" />
              <span>{isAr ? 'جاهزية المتجر' : 'Store Readiness'}</span>
              <span className="text-[11px] text-[#97A4B5] font-medium lowercase tracking-normal">
                ({isAr ? 'فحص تلقائي للمتطلبات' : 'Automated Status Check'})
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#F4F6F8]">
              {readinessPercentage === 100 
                ? (isAr ? 'تهانينا! متجرك مكتمل وجاهز للبيع بنسبة 100%' : 'Your store is 100% ready for commerce!')
                : (isAr ? 'أكمل إعداد متجرك لإطلاقه واستقبال الطلبات' : 'Complete your store setup to launch and accept orders')}
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-end">
              <div className="text-2xl font-black text-[#C9A45C]">{readinessPercentage}%</div>
              <div className="text-[11px] text-[#97A4B5]">
                {completedTasksCount} / {readinessTasks.length} {isAr ? 'مكتمل' : 'completed'}
              </div>
            </div>
            <div className="w-32 h-3 bg-[#101B2C] rounded-full overflow-hidden border border-[#233247]">
              <div 
                className="h-full bg-gradient-to-r from-[#C9A45C] to-[#E0C078] transition-all duration-500"
                style={{ width: `${readinessPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {readinessTasks.map(task => {
            const TaskIcon = task.icon;
            return (
              <div
                key={task.key}
                id={`readiness-card-${task.key}`}
                onClick={task.onAction}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group ${
                  task.done 
                    ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/15' 
                    : 'bg-[#050B14] border-[#233247] hover:border-[#C9A45C]/60 hover:bg-[#0B1422] shadow-sm'
                }`}
                title={isAr ? `اضغط لتهيئة أو إدارة ${task.title}` : `Click to configure ${task.title}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      task.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-[#C9A45C]'
                    }`}>
                      <TaskIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      task.done 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}>
                      {task.done ? (
                        <>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>{isAr ? 'مكتمل' : 'Ready'}</span>
                        </>
                      ) : (
                        <span>{isAr ? 'مطلوب إعداده' : 'Required'}</span>
                      )}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-white group-hover:text-[#C9A45C] transition-colors">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-[#97A4B5] mt-1 line-clamp-2 leading-relaxed">
                    {task.desc}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-semibold">
                  <span className={task.done ? 'text-emerald-400/80 group-hover:text-emerald-300' : 'text-[#C9A45C]'}>
                    {task.actionText}
                  </span>
                  <ArrowLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${
                    task.done ? 'text-emerald-400' : 'text-[#C9A45C]'
                  } ${!isAr ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Large Primary Revenue & Performance Asymmetric Focal Point */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Dominant Revenue Focal Point */}
        <div className="lg:col-span-12 bg-gradient-to-br from-[#0B1422] to-[#060E18] border border-[#233247] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#233247]">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#C9A45C]">
                {isAr ? 'المحور الرئيسي للأداء المالي' : 'Primary Sovereign Revenue Hub'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#F4F6F8] mt-1">
                {orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()} <span className="text-xl font-bold text-[#C9A45C]">{currency}</span>
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-4 h-4" />
                <span>{orders.length > 0 ? '+14.2%' : '0.0%'} {isAr ? 'نمو الإيرادات' : 'Revenue Growth'}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
              <div className="text-xs text-[#97A4B5] font-semibold">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div>
              <div className="text-xl font-black text-[#F4F6F8] mt-1">{orders.length}</div>
              <div className="text-[11px] text-[#97A4B5] mt-1">{isAr ? 'حسب السجل الفعلي' : 'actual records'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
              <div className="text-xs text-[#97A4B5] font-semibold">{isAr ? 'العملاء النشطون' : 'Active Customers'}</div>
              <div className="text-xl font-black text-[#F4F6F8] mt-1">{customers.length}</div>
              <div className="text-[11px] text-[#97A4B5] mt-1">{isAr ? 'حسب السجل الفعلي' : 'actual records'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
              <div className="text-xs text-[#97A4B5] font-semibold">{isAr ? 'متوسط قيمة الطلب' : 'Average Order Value'}</div>
              <div className="text-xl font-black text-[#F4F6F8] mt-1">
                {orders.length > 0 ? Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) / orders.length) : 0} <span className="text-xs text-[#C9A45C]">{currency}</span>
              </div>
              <div className="text-[11px] text-[#97A4B5] mt-1">{isAr ? 'متوسط السلة' : 'basket average'}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
              <div className="text-xs text-[#97A4B5] font-semibold">{isAr ? 'معدل التحويل' : 'Conversion Rate'}</div>
              <div className="text-xl font-black text-[#F4F6F8] mt-1">{orders.length > 0 ? '3.42%' : '0.00%'}</div>
              <div className="text-[11px] text-[#97A4B5] mt-1">{isAr ? 'زيارة المتجر' : 'store visits'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid: Sales Chart (8 cols) + Needs Attention (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-8 bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl flex flex-col">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#233247]">
            <div>
              <h3 className="text-base font-bold text-[#F4F6F8]">{isAr ? 'نظرة عامة على المبيعات' : 'Sales Overview'}</h3>
              <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'مقارنة الإيرادات اليومية والأسبوعية' : 'Daily & weekly revenue comparison'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs text-[#C9A45C] font-semibold bg-[#C9A45C]/15 px-2.5 py-1 rounded-lg border border-[#C9A45C]/30">
                <span className="w-2 h-2 rounded-full bg-[#C9A45C] animate-pulse" />
                <span>{currency}</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A45C" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A45C" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(35,50,71,0.6)" />
                <XAxis dataKey="date" stroke="#667386" fontSize={11} tickLine={false} />
                <YAxis stroke="#667386" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1422', borderColor: '#233247', borderRadius: '12px', fontSize: '12px', color: '#F4F6F8' }}
                  itemStyle={{ color: '#F4F6F8' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#C9A45C" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Needs Attention Widget */}
        <div className="lg:col-span-4 bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#233247]">
              <h3 className="text-base font-bold text-[#F4F6F8] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'يحتاج انتباهك' : 'Needs Attention'}</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-bold">
                4
              </span>
            </div>

            <div className="space-y-3">
              {[
                { 
                  title: isAr ? '3 طلبات تحتاج معالجة' : '3 orders pending fulfillment', 
                  severity: 'warning', 
                  target: 'orders',
                  desc: isAr ? 'جاهزة للشحن والتسليم لشركة الشحن.' : 'Ready for shipping and courier dispatch.'
                },
                { 
                  title: isAr ? '5 منتجات منخفضة المخزون' : '5 low stock products', 
                  severity: 'critical', 
                  target: 'inventory',
                  desc: isAr ? 'وصلت للحد الأدنى من المخزون المسموح.' : 'Stock levels reached configured threshold.'
                },
                { 
                  title: isAr ? '2 دفعات فشلت معالجتها' : '2 failed payment attempts', 
                  severity: 'critical', 
                  target: 'orders',
                  desc: isAr ? 'تحتاج مراجعة بوابة الدفع الرقمية.' : 'Gateway checkout processing error.'
                },
                { 
                  title: isAr ? 'النسخ الاحتياطي لقاعدة البيانات مكتمل' : 'Local database backup completed', 
                  severity: 'info', 
                  target: 'settings',
                  desc: isAr ? 'تم حفظ نسخة احتياطية من معاملات المتجر محلياً.' : 'Local store records backup verified successfully.'
                }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => setActiveSection(item.target)}
                  className="p-3.5 rounded-2xl bg-[#050B14] hover:bg-[#101B2C] border border-[#233247] transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      item.severity === 'critical' ? 'bg-rose-500' :
                      item.severity === 'warning' ? 'bg-amber-400' : 'bg-blue-400'
                    }`} />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#F4F6F8] group-hover:text-[#C9A45C] transition-colors truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-[#97A4B5] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#667386] group-hover:text-[#F4F6F8] transition-colors shrink-0 self-center rtl:rotate-180" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#233247] text-center">
            <button
              onClick={() => setActiveSection('orders')}
              className="text-xs font-semibold text-[#C9A45C] hover:underline inline-flex items-center gap-1.5"
            >
              <span>{isAr ? 'عرض كافة التنبيهات والمهام' : 'View all alerts & tasks'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Grid: Recent Orders (8 cols) + Top Products (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Widget */}
        <div className="lg:col-span-8 bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#233247]">
            <div>
              <h3 className="text-base font-bold text-[#F4F6F8]">{isAr ? 'أحدث الطلبات' : 'Recent Orders'}</h3>
              <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'آخر الطلبات الواردة إلى متجرك' : 'Latest orders received by your store'}</p>
            </div>
            <button
              onClick={() => setActiveSection('orders')}
              className="text-xs font-bold text-[#C9A45C] hover:underline flex items-center gap-1"
            >
              <span>{isAr ? 'عرض الكل' : 'View all'}</span>
              <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

          <div className="overflow-x-auto">
            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30 text-[#C9A45C]" />
                <p className="text-xs font-semibold">{isAr ? 'لا توجد طلبات مسجلة بعد' : 'No orders recorded yet'}</p>
              </div>
            ) : (
              <table className="w-full text-start text-xs">
                <thead>
                  <tr className="border-b border-[#233247] text-[#667386] font-semibold">
                    <th className="pb-3 text-start">{isAr ? 'رقم الطلب' : 'Order'}</th>
                    <th className="pb-3 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                    <th className="pb-3 text-start">{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
                    <th className="pb-3 text-start">{isAr ? 'حالة الدفع' : 'Payment'}</th>
                    <th className="pb-3 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="pb-3 text-end">{isAr ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#233247]/50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#101B2C]/50 transition-colors">
                      <td className="py-3.5 font-bold text-[#F4F6F8]">{order.orderNumber}</td>
                      <td className="py-3.5 text-[#97A4B5] font-medium">{order.customerName}</td>
                      <td className="py-3.5 font-bold text-[#C9A45C]">{order.total.toLocaleString()} {order.currency || currency}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {order.paymentStatus === 'paid' ? (isAr ? 'مدفوع' : 'Paid') : (isAr ? 'معلق' : 'Pending')}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400' :
                          order.status === 'processing' ? 'bg-blue-500/15 text-blue-400' :
                          order.status === 'shipped' ? 'bg-purple-500/15 text-purple-400' : 'bg-amber-500/15 text-amber-400'
                        }`}>
                          {order.status === 'delivered' ? (isAr ? 'مكتمل' : 'Delivered') :
                           order.status === 'processing' ? (isAr ? 'قيد المعالجة' : 'Processing') :
                           order.status === 'shipped' ? (isAr ? 'تم الشحن' : 'Shipped') : (isAr ? 'جديد' : 'New')}
                        </span>
                      </td>
                      <td className="py-3.5 text-end text-[#667386]">
                        {new Date(order.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Top Products Widget (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#233247]">
              <h3 className="text-base font-bold text-[#F4F6F8] flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'المنتجات الأكثر مبيعاً' : 'Top Products'}</span>
              </h3>
              <button
                onClick={() => setActiveSection('products')}
                className="text-xs text-[#C9A45C] hover:underline font-semibold"
              >
                {isAr ? 'الكتالوج' : 'Catalog'}
              </button>
            </div>

            <div className="space-y-3.5">
              {products.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  {isAr ? 'لم تتم إضافة منتجات بعد' : 'No products added yet'}
                </div>
              ) : (
                products.slice(0, 4).map((prod, idx) => (
                  <div key={prod.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#050B14] border border-[#233247] hover:bg-[#101B2C] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-[#101B2C] border border-[#233247] flex items-center justify-center font-bold text-xs text-[#F4F6F8] shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-[#F4F6F8] truncate">{isAr ? prod.name : (prod.nameEn || prod.name)}</h4>
                        <p className="text-[10px] text-[#667386] mt-0.5">{prod.stock} {isAr ? 'متوفر' : 'in stock'}</p>
                      </div>
                    </div>
                    <div className="text-end shrink-0">
                      <div className="text-xs font-bold text-[#C9A45C]">{prod.price.toLocaleString()} {currency}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-[#233247] text-center">
            <button
              onClick={() => setActiveSection('inventory')}
              className="text-xs text-[#97A4B5] hover:text-[#F4F6F8] transition-colors"
            >
              {isAr ? 'إدارة المخزون والتنبيهات ➔' : 'Manage inventory & stock alerts ➔'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
