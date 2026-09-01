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
  Layers
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
  setActiveSection: (section: string) => void;
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

  // Store Readiness checklist tasks
  const [readinessTasks, setReadinessTasks] = useState({
    products: products.length > 0,
    payments: true,
    shipping: false,
    customization: true,
    publishing: activeTenant.status === 'live'
  });

  const completedTasksCount = Object.values(readinessTasks).filter(Boolean).length;
  const readinessPercentage = Math.round((completedTasksCount / Object.keys(readinessTasks).length) * 100);

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

  const toggleTask = (key: keyof typeof readinessTasks) => {
    setReadinessTasks(prev => ({ ...prev, [key]: !prev[key] }));
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

      {/* Store Readiness Checklist (if not 100% live) */}
      {readinessPercentage < 100 && (
        <div className="bg-gradient-to-br from-[#0B1422] to-[#050B14] border border-[#C9A45C]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A45C]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 text-[#C9A45C] text-xs font-bold uppercase tracking-wider mb-1">
                <Store className="w-4 h-4" />
                <span>{isAr ? 'جاهزية المتجر' : 'Store Readiness'}</span>
              </div>
              <h3 className="text-lg font-bold text-[#F4F6F8]">
                {isAr ? 'أكمل إعداد متجرك لإطلاقه للجمهور' : 'Complete your store setup to launch'}
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-end">
                <div className="text-2xl font-black text-[#C9A45C]">{readinessPercentage}%</div>
                <div className="text-[11px] text-[#97A4B5]">{isAr ? 'مكتمل' : 'Completed'}</div>
              </div>
              <div className="w-32 h-3 bg-[#101B2C] rounded-full overflow-hidden border border-[#233247]">
                <div 
                  className="h-full bg-gradient-to-r from-[#C9A45C] to-[#E0C078] transition-all duration-500"
                  style={{ width: `${readinessPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { key: 'products', label: isAr ? 'إضافة منتجات' : 'Add Products', done: readinessTasks.products },
              { key: 'payments', label: isAr ? 'إعداد المدفوعات' : 'Configure Payments', done: readinessTasks.payments },
              { key: 'shipping', label: isAr ? 'إعداد الشحن' : 'Setup Shipping', done: readinessTasks.shipping },
              { key: 'customization', label: isAr ? 'تخصيص الهوية' : 'Customize Store', done: readinessTasks.customization },
              { key: 'publishing', label: isAr ? 'نشر المتجر' : 'Publish Store', done: readinessTasks.publishing }
            ].map(task => (
              <button
                key={task.key}
                onClick={() => toggleTask(task.key as any)}
                className={`p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 ${
                  task.done 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-[#0B1422] border-[#233247] text-[#97A4B5] hover:bg-[#101B2C]'
                }`}
              >
                <span className="text-xs font-semibold">{task.label}</span>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  task.done ? 'bg-emerald-500 text-[#050B14]' : 'border border-[#233247]'
                }`}>
                  {task.done && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

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
                  title: isAr ? 'تحديث شهادة SSL وشيك' : 'SSL certificate renewal due', 
                  severity: 'info', 
                  target: 'domains',
                  desc: isAr ? 'النطاق الأساسي سيعمل بشكل طبيعي.' : 'Primary domain auto-renew configured.'
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
