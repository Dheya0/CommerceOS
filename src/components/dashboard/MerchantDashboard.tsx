import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Warehouse, 
  Tag, 
  Palette, 
  ShieldCheck, 
  Settings, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Check, 
  Clock, 
  Truck, 
  X, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Crown, 
  Sparkles, 
  Eye,
  Sliders,
  ChevronDown,
  Globe,
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { useCommerce } from '../../context/CommerceContext';
import { Coupon, Order, Product, StaffMember, StaffRole, ThemeStyle, BankAccount } from '../../types';
import { generateDesignTokens, PRESET_COLOR_PALETTES } from '../../utils/themeEngine';
import { MobileAppManager } from './MobileAppManager';
import { PublishCenter } from './PublishCenter';
import { AbandonedCartsManager } from './AbandonedCartsManager';
import { NotificationsManager } from './NotificationsManager';
import { SecurityCenter } from './SecurityCenter';
import { LicensingManager } from './LicensingManager';
import { Rocket, MessageSquare, ShieldAlert } from 'lucide-react';


export const MerchantDashboard: React.FC = () => {
  const { 
    activeTenant, 
    updateTenant, 
    updateTheme, 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    updateOrderPaymentStatus,
    customers, 
    coupons, 
    addCoupon, 
    deleteCoupon, 
    staff, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    activeStaffPermissions, 
    currentStaffRole, 
    setCurrentView, 
    showToast 
  } = useCommerce();

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderDetailModal, setOrderDetailModal] = useState<Order | null>(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  // Bank Form State
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [iban, setIban] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState(100);
  const [prodComparePrice, setProdComparePrice] = useState<number | undefined>(undefined);
  const [prodSku, setProdSku] = useState('');
  const [prodStock, setProdStock] = useState(20);
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Coupon Form State
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [couponValue, setCouponValue] = useState(15);
  const [couponMinSpend, setCouponMinSpend] = useState(200);

  // Staff Form State
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<StaffRole>('order_manager');

  // Filter & Search states
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');

  // Theme customizer within dashboard
  const [dashPrimaryColor, setDashPrimaryColor] = useState<string>(activeTenant.theme.tokens.primary);
  const [dashStyle, setDashStyle] = useState<ThemeStyle>(activeTenant.theme.style);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockAlert);

  const salesData = [
    { day: 'السبت', sales: 2400, orders: 8 },
    { day: 'الأحد', sales: 3200, orders: 12 },
    { day: 'الإثنين', sales: 4800, orders: 15 },
    { day: 'الثلاثاء', sales: 3900, orders: 11 },
    { day: 'الأربعاء', sales: 6200, orders: 20 },
    { day: 'الخميس', sales: 8400, orders: 28 },
    { day: 'الجمعة', sales: 9800, orders: 34 }
  ];

  // Navigation Items according to RBAC
  const navTabs = [
    { id: 'overview', label: 'نظرة عامة والتحليلات', icon: LayoutDashboard, permitted: true },
    { id: 'publish_center', label: 'مركز النشر والـ Build Engine', icon: Rocket, permitted: activeStaffPermissions.settings },
    { id: 'licensing', label: 'التراخيص وإزالة الشارة', icon: Sparkles, badge: activeTenant.licensing?.isWhiteLabel ? undefined : 1, permitted: activeStaffPermissions.settings },
    { id: 'abandoned_carts', label: 'السلات المتروكة واستعادتها', icon: ShoppingBag, permitted: activeStaffPermissions.orders },
    { id: 'notifications', label: 'إشعارات الواتساب وSMS', icon: MessageSquare, permitted: activeStaffPermissions.marketing },
    { id: 'security_center', label: 'الأمان والتواقيع الرقمية', icon: ShieldAlert, permitted: activeStaffPermissions.settings },
    { id: 'orders', label: 'إدارة الطلبات والشحن', icon: ShoppingBag, badge: orders.filter(o => o.status === 'new' || o.paymentStatus === 'pending_verification').length, permitted: activeStaffPermissions.orders },
    { id: 'products', label: 'المنتجات والتصنيفات', icon: Package, permitted: activeStaffPermissions.products },
    { id: 'inventory', label: 'المخزون والمستودع', icon: Warehouse, badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined, permitted: activeStaffPermissions.inventory },
    { id: 'customers', label: 'قاعدة العملاء', icon: Users, permitted: activeStaffPermissions.customers },
    { id: 'coupons', label: 'الكوبونات والعروض', icon: Tag, permitted: activeStaffPermissions.coupons },
    { id: 'theme', label: 'محرك التصميم والهوية', icon: Palette, permitted: activeStaffPermissions.theme },
    { id: 'mobile_app', label: 'تطبيق المتجر (Mobile & PWA)', icon: Smartphone, permitted: activeStaffPermissions.settings },
    { id: 'staff', label: 'فريق العمل والصلاحيات', icon: ShieldCheck, permitted: activeStaffPermissions.staff },
    { id: 'settings', label: 'إعدادات المتجر والدفع', icon: Settings, permitted: activeStaffPermissions.settings }
  ].filter(t => t.permitted);

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdPrice(150);
    setProdComparePrice(undefined);
    setProdSku(`SKU-${Date.now().toString().slice(-4)}`);
    setProdStock(25);
    setProdDesc('وصف مفصل عن المنتج ومكوناته الطبيعية ومميزاته...');
    setProdImage(activeTenant.logo);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        price: prodPrice,
        comparePrice: prodComparePrice,
        sku: prodSku,
        stock: prodStock,
        description: prodDesc,
        images: [prodImage || activeTenant.logo]
      });
    } else {
      addProduct({
        tenantId: activeTenant.id,
        name: prodName,
        nameEn: prodName,
        price: prodPrice,
        comparePrice: prodComparePrice,
        sku: prodSku,
        stock: prodStock,
        lowStockAlert: 5,
        description: prodDesc,
        categoryId: 'cat-h1',
        images: [prodImage || activeTenant.logo],
        rating: 5.0,
        reviewsCount: 1,
        isFeatured: true,
        tags: ['جديد']
      });
    }
    setProductModalOpen(false);
  };

  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      tenantId: activeTenant.id,
      code: couponCode.toUpperCase().trim(),
      type: couponType,
      value: couponValue,
      minSpend: couponMinSpend,
      usageCount: 0,
      expiresAt: '2026-12-31',
      isActive: true
    });
    setCouponModalOpen(false);
    setCouponCode('');
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaff({
      tenantId: activeTenant.id,
      name: staffName,
      email: staffEmail,
      role: staffRole,
      permissions: {
        products: staffRole === 'store_owner' || staffRole === 'product_manager',
        orders: staffRole === 'store_owner' || staffRole === 'order_manager',
        customers: staffRole === 'store_owner' || staffRole === 'order_manager',
        inventory: staffRole === 'store_owner' || staffRole === 'product_manager' || staffRole === 'inventory_manager',
        coupons: staffRole === 'store_owner' || staffRole === 'marketing_manager',
        theme: staffRole === 'store_owner' || staffRole === 'marketing_manager',
        staff: staffRole === 'store_owner',
        settings: staffRole === 'store_owner',
        reports: true
      },
      status: 'invited'
    });
    setStaffModalOpen(false);
    setStaffName('');
    setStaffEmail('');
  };

  const handleApplyThemeChanges = () => {
    const newTokens = generateDesignTokens(dashPrimaryColor, dashStyle, false);
    updateTheme(activeTenant.id, {
      ...activeTenant.theme,
      style: dashStyle,
      tokens: newTokens
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 p-4 shrink-0">
        
        {/* Store Profile Card */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img 
              src={activeTenant.logo} 
              alt="" 
              className="w-9 h-9 rounded-lg object-cover border border-slate-700" 
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">{activeTenant.name}</div>
              <div className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>متجر نشط ({activeTenant.plan.toUpperCase()})</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentView('storefront')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="زيارة المتجر الحي"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="space-y-1">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">لوحة تحكم المتجر</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  مرحباً بك مجدداً — إليك ملخص المبيعات، الطلبات، والنشاط التجاري المباشر.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة منتج جديد</span>
                </button>
                <button
                  onClick={() => setCurrentView('storefront')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>عرض المتجر</span>
                </button>
              </div>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>إجمالي الإيرادات</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{totalRevenue.toLocaleString()} {activeTenant.currencySymbol}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +18.4% نمو هذا الشهر
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>الطلبات المكتملة</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{totalOrdersCount}</div>
                <div className="text-[11px] text-slate-400 mt-1">متوسط قيمة السلة: {averageOrderValue} {activeTenant.currencySymbol}</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>المنتجات النشطة</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{products.length}</div>
                <div className="text-[11px] text-slate-400 mt-1">{lowStockProducts.length} منتجات أوشكت على النفاد</div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-medium">
                  <span>العملاء المسجلين</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{customers.length}</div>
                <div className="text-[11px] text-amber-400 mt-1">نسبة الشراء المتكرر: 68%</div>
              </div>
            </div>

            {/* Sales Chart Section */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">تحليلات المبيعات الأسبوعية (Sales Growth)</h3>
                <span className="text-xs text-slate-400 font-mono">آخر 7 أيام</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val} ر.س`, 'المبيعات']}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#salesGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders & Low Stock Quick Action Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Orders Table (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">أحدث الطلبات الواردة</h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    عرض كافة الطلبات ({orders.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2">رقم الطلب</th>
                        <th className="pb-2">العميل</th>
                        <th className="pb-2">المبلغ</th>
                        <th className="pb-2">الحالة</th>
                        <th className="pb-2">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 4).map(order => (
                        <tr key={order.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-mono font-bold text-amber-400">{order.orderNumber}</td>
                          <td className="py-3 text-slate-200">{order.customer.name}</td>
                          <td className="py-3 font-mono font-bold">{order.total} {activeTenant.currencySymbol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                              order.status === 'processing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            }`}>
                              {order.status === 'new' ? 'جديد' :
                               order.status === 'processing' ? 'قيد التجهيز' :
                               order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل'}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => setOrderDetailModal(order)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-slate-300"
                            >
                              تفاصيل
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Low Stock Alerts (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-sm font-bold mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>تنبيهات المخزون المنخفض</span>
                </div>

                <div className="space-y-3">
                  {lowStockProducts.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      جميع مستويات المخزون ممتازة وبحالة جيدة ✓
                    </div>
                  ) : (
                    lowStockProducts.map(prod => (
                      <div key={prod.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">{prod.name}</div>
                          <div className="text-[10px] text-rose-400 font-mono">متبقي: {prod.stock} قطع فقط</div>
                        </div>
                        <button
                          onClick={() => {
                            updateProduct(prod.id, { stock: prod.stock + 20 });
                            showToast(`تمت زيادة مخزون ${prod.name} بمقدار 20 قطعة`, 'success');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold shrink-0"
                        >
                          +20 تزويد
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة المنتجات والتصنيفات</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  أضف وعدّل المنتجات والخيارات المتعددة (الأوزان، المقاسات، الألوان) وتتبع المخزون.
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            </div>

            {/* Products Table Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    placeholder="ابحث بالاسم أو SKU..."
                    className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  إجمالي المنتجات: {products.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">المنتج</th>
                      <th className="pb-3">الرمز (SKU)</th>
                      <th className="pb-3">السعر</th>
                      <th className="pb-3">المخزون</th>
                      <th className="pb-3">التقييم</th>
                      <th className="pb-3 text-left">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products
                      .filter(p => {
                        const query = (productSearch || '').toLowerCase().trim();
                        if (!query) return true;
                        const nameMatch = (p.name || '').toLowerCase().includes(query);
                        const skuMatch = (p.sku || '').toLowerCase().includes(query);
                        return nameMatch || skuMatch;
                      })
                      .map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/40">
                          <td className="py-3 flex items-center gap-3">
                            <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                            <div>
                              <div className="font-bold text-white">{prod.name}</div>
                              <div className="text-[10px] text-slate-400">{prod.weight || 'حجم قياسي'}</div>
                            </div>
                          </td>
                          <td className="py-3 font-mono text-slate-300">{prod.sku}</td>
                          <td className="py-3 font-mono font-bold text-amber-400">{prod.price} {activeTenant.currencySymbol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              prod.stock <= prod.lowStockAlert ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {prod.stock} قطعة
                            </span>
                          </td>
                          <td className="py-3 text-amber-400 font-bold">★ {prod.rating}</td>
                          <td className="py-3 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setProdName(prod.name);
                                  setProdPrice(prod.price);
                                  setProdComparePrice(prod.comparePrice);
                                  setProdSku(prod.sku);
                                  setProdStock(prod.stock);
                                  setProdDesc(prod.description);
                                  setProdImage(prod.images[0]);
                                  setProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                                title="تعديل المنتج"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(prod.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة الطلبات والشحنات</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  متابعة وتحديث حالات طلبات العملاء وتصدير الفواتير.
                </p>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'كافة الطلبات' },
                { id: 'new', label: 'جديدة' },
                { id: 'processing', label: 'قيد التجهيز' },
                { id: 'shipped', label: 'تم الشحن' },
                { id: 'delivered', label: 'تم التوصيل' }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setOrderStatusFilter(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === st.id
                      ? 'bg-amber-500 text-slate-950 font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">رقم الطلب</th>
                      <th className="pb-3">العميل والموقع</th>
                      <th className="pb-3">المنتجات</th>
                      <th className="pb-3">طريقة الدفع</th>
                      <th className="pb-3">حالة الدفع</th>
                      <th className="pb-3">الإجمالي</th>
                      <th className="pb-3">حالة الطلب</th>
                      <th className="pb-3 text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {orders
                      .filter(o => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                      .map(order => (
                        <tr key={order.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-mono font-bold text-amber-400">
                            <button onClick={() => setOrderDetailModal(order)} className="hover:underline">
                              {order.orderNumber}
                            </button>
                          </td>
                          <td className="py-3">
                            <div className="font-bold text-white">{order.customer.name}</div>
                            <div className="text-[10px] text-slate-400">{order.customer.city} • {order.customer.phone}</div>
                          </td>
                          <td className="py-3 text-slate-300">{order.items.length} منتجات</td>
                          <td className="py-3 uppercase font-mono text-[11px] text-slate-300">
                            {order.paymentMethod === 'bank_transfer' ? 'تحويل بنكي' :
                             order.paymentMethod === 'cod' ? 'دفع عند الاستلام' :
                             order.paymentMethod === 'mada' ? 'مدى (Mada)' :
                             order.paymentMethod === 'apple_pay' ? 'Apple Pay' :
                             order.paymentMethod === 'tamara' ? 'تمارا' : order.paymentMethod}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              order.paymentStatus === 'pending_verification' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                              order.paymentStatus === 'failed' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' :
                              'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}>
                              {order.paymentStatus === 'paid' ? 'مدفوع ✓' :
                               order.paymentStatus === 'pending_verification' ? 'مراجعة الحوالة ⚠️' :
                               order.paymentStatus === 'failed' ? 'فشل الدفع ✕' : 'بانتظار الدفع'}
                            </span>
                          </td>
                          <td className="py-3 font-mono font-bold text-amber-400">{order.total} {activeTenant.currencySymbol}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              order.status === 'delivered' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                              order.status === 'shipped' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' :
                              order.status === 'processing' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                              'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                            }`}>
                              {order.status === 'new' ? 'جديد' :
                               order.status === 'processing' ? 'قيد التجهيز' :
                               order.status === 'shipped' ? 'تم الشحن' : 'تم التوصيل'}
                            </span>
                          </td>
                          <td className="py-3 text-left">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setOrderDetailModal(order)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-amber-400"
                              >
                                {order.paymentStatus === 'pending_verification' ? 'مراجعة الإيصال' : 'تفاصيل'}
                              </button>
                              <select
                                value={order.status}
                                onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                                className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-amber-500"
                              >
                                <option value="new">جديد</option>
                                <option value="processing">قيد التجهيز</option>
                                <option value="shipped">تم الشحن</option>
                                <option value="delivered">تم التوصيل</option>
                                <option value="cancelled">ملغي</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. THEME ENGINE TAB */}
        {activeTab === 'theme' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-white">محرك التصميم والهوية البصرية (Theme Engine)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  خصص ألوان المتجر، وطراز التصميم، وشكل البطاقات مباشرة.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('live_customizer')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>فتح Design Studio المباشر</span>
                </button>
                <button
                  onClick={handleApplyThemeChanges}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg transition-all"
                >
                  تطبيق وحفظ التغييرات
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Controls */}
              <div className="lg:col-span-7 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
                
                {/* Preset Palettes */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">لوحات الألوان المقترحة للعلامة</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_COLOR_PALETTES.map(pal => (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => {
                          setDashPrimaryColor(pal.hex);
                          setDashStyle(pal.style);
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-right transition-all ${
                          dashPrimaryColor === pal.hex
                            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20'
                            : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-[11px] font-bold text-white">{pal.name}</div>
                          <div className="text-[9px] text-slate-400 font-mono">{pal.hex}</div>
                        </div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pal.hex }} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">اللون الأساسي المخصص (Hex Code)</div>
                    <div className="text-[11px] text-slate-400">توليد تلقائي لكافة درجات الـ Tokens</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={dashPrimaryColor}
                      onChange={e => setDashPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={dashPrimaryColor}
                      onChange={e => setDashPrimaryColor(e.target.value)}
                      className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center uppercase"
                    />
                  </div>
                </div>

                {/* Style Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">طراز وتوزيع التصميم (Design Style)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'luxury', name: 'فاخر (Luxury)' },
                      { id: 'modern', name: 'عصري (Modern)' },
                      { id: 'minimal', name: 'مبسط (Minimal)' },
                      { id: 'organic', name: 'طبيعي (Organic)' },
                      { id: 'bold', name: 'جريء (Bold)' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setDashStyle(st.id as ThemeStyle)}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                          dashStyle === st.id
                            ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {st.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Tokens Matrix Preview */}
              <div className="lg:col-span-5 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-400">الـ Design Tokens الحية للمتجر</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(generateDesignTokens(dashPrimaryColor, dashStyle, false)).map(([key, val]) => (
                    <div key={key} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-white">{key}</div>
                        <div className="text-[9px] text-slate-500 font-mono">{val}</div>
                      </div>
                      <div className="w-5 h-5 rounded-md shadow" style={{ backgroundColor: val }} />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. STAFF & RBAC TAB */}
        {activeTab === 'staff' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">فريق العمل والصلاحيات (RBAC System)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  أضف موظفين وحدد صلاحيات مخصصة لكل دور (مدير طلبات، مدير منتجات، مسؤول تسويق).
                </p>
              </div>
              <button
                onClick={() => setStaffModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موظف جديد</span>
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">الموظف</th>
                      <th className="pb-3">البريد الإلكتروني</th>
                      <th className="pb-3">الدور الإداري</th>
                      <th className="pb-3">الصلاحيات الفعالة</th>
                      <th className="pb-3">الحالة</th>
                      <th className="pb-3 text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {staff.map(member => (
                      <tr key={member.id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-bold text-white">{member.name}</td>
                        <td className="py-3 font-mono text-slate-400">{member.email}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 font-bold text-[10px]">
                            {member.role === 'store_owner' ? 'مالك المتجر' :
                             member.role === 'product_manager' ? 'مدير المنتجات والمخزون' :
                             member.role === 'order_manager' ? 'مدير الطلبات والعملاء' : member.role}
                          </span>
                        </td>
                        <td className="py-3 text-[11px] text-slate-400">
                          {Object.entries(member.permissions)
                            .filter(([_, allowed]) => allowed)
                            .map(([key]) => key)
                            .slice(0, 3)
                            .join(', ')}...
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            member.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {member.status === 'active' ? 'نشط' : 'بانتظار القبول'}
                          </span>
                        </td>
                        <td className="py-3 text-left">
                          {member.role !== 'store_owner' && (
                            <button
                              onClick={() => deleteStaff(member.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4.5 PUBLISH CENTER & BUILD ENGINE TAB */}
        {activeTab === 'publish_center' && (
          <div className="animate-in fade-in">
            <PublishCenter />
          </div>
        )}

        {/* LICENSING & WHITE LABEL MATRIX TAB */}
        {activeTab === 'licensing' && (
          <div className="animate-in fade-in">
            <LicensingManager />
          </div>
        )}

        {/* ABANDONED CARTS RECOVERY TAB */}
        {activeTab === 'abandoned_carts' && (
          <div className="animate-in fade-in">
            <AbandonedCartsManager />
          </div>
        )}

        {/* NOTIFICATIONS & WHATSAPP TAB */}
        {activeTab === 'notifications' && (
          <div className="animate-in fade-in">
            <NotificationsManager />
          </div>
        )}

        {/* SECURITY & CODE SIGNING CENTER TAB */}
        {activeTab === 'security_center' && (
          <div className="animate-in fade-in">
            <SecurityCenter />
          </div>
        )}

        {/* 5. MOBILE APP TAB */}
        {activeTab === 'mobile_app' && (
          <div className="animate-in fade-in">
            <PublishCenter />
          </div>
        )}

        {/* 6. SETTINGS & DOMAIN TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h1 className="text-2xl font-black text-white">إعدادات المتجر والنطاق والحسابات البنكية</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                ربط الدومين المخصص، بوابات الدفع الإلكتروني، والحسابات البنكية للحوالات المباشرة.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Custom Domain Simulator Card */}
              <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Globe className="w-4 h-4" />
                  <span>ربط النطاق المخصص (Custom Domain)</span>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الدومين الخاص بك</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue={activeTenant.customDomain || `www.${activeTenant.slug}.sa`}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <button
                      onClick={() => showToast('تم التحقق من سجلات DNS وشهادة SSL بنجاح! 🔒', 'success')}
                      className="px-3 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                    >
                      تحقق من DNS
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-200 mb-1">سجلات DNS المطلوبة:</div>
                  <div className="flex justify-between font-mono">
                    <span>Type: CNAME</span>
                    <span>Host: www</span>
                    <span className="text-amber-400">Target: stores.commerceos.app</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateways Config Card */}
              <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>بوابات الدفع الإلكتروني</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { id: 'mada', name: 'مدى (Mada)', status: 'مفعلة وتعمل بنجاح ✓' },
                    { id: 'apple_pay', name: 'Apple Pay', status: 'مفعلة وتعمل بنجاح ✓' },
                    { id: 'visa', name: 'Visa & MasterCard', status: 'مفعلة وتعمل بنجاح ✓' },
                    { id: 'tamara', name: 'تمارا (Tamara BNPL)', status: 'مفعلة للتقسيط ✓' },
                    { id: 'cod', name: 'الدفع عند الاستلام (COD)', status: 'مفعلة ✓' },
                    { id: 'bank_transfer', name: 'التحويل البنكي المباشر (Bank Transfer)', status: 'مفعلة وتتطلب اعتماد الإيصال ✓' }
                  ].map((gw, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{gw.name}</span>
                      <span className="text-emerald-400 text-[11px] font-medium">{gw.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Accounts Management (Full 12 cols) */}
              <div className="lg:col-span-12 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Building2 className="w-4 h-4" />
                    <span>الحسابات البنكية المعتمدة للتحويل (Bank Accounts)</span>
                  </div>
                  <button
                    onClick={() => {
                      setBankName('مصرف الراجحي');
                      setAccountHolder(activeTenant.name);
                      setIban('SA');
                      setAccountNumber('');
                      setBankModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة حساب بنكي</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeTenant.bankAccounts || []).map((acc) => (
                    <div key={acc.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white">{acc.bankName}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                          {acc.isActive ? 'مفعل للاستقبال' : 'معطل'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300">
                        <span className="text-slate-500">اسم المستفيد:</span> <span className="font-bold">{acc.accountHolder}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        <span className="text-slate-500">IBAN:</span> <span className="text-amber-400 font-bold">{acc.iban}</span>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">
                        <span className="text-slate-500">رقم الحساب:</span> {acc.accountNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Product Add/Edit Modal */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المنتج *</label>
                <input
                  required
                  type="text"
                  value={prodName}
                  onChange={e => setProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر ({activeTenant.currencySymbol}) *</label>
                  <input
                    required
                    type="number"
                    value={prodPrice}
                    onChange={e => setProdPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">سعر الخصم / المقارنة</label>
                  <input
                    type="number"
                    value={prodComparePrice || ''}
                    onChange={e => setProdComparePrice(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="اختياري"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رمز التخزين SKU</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={e => setProdSku(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الكمية المتوفرة بالمخزون *</label>
                  <input
                    required
                    type="number"
                    value={prodStock}
                    onChange={e => setProdStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رابط صورة المنتج (Image URL)</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={e => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">وصف المنتج</label>
                <textarea
                  rows={3}
                  value={prodDesc}
                  onChange={e => setProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-2"
              >
                حفظ المنتج في المتجر
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal with Receipt Inspection and Payment Verification */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-right space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">تفاصيل الطلب {orderDetailModal.orderNumber}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    orderDetailModal.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    orderDetailModal.paymentStatus === 'pending_verification' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {orderDetailModal.paymentStatus === 'paid' ? 'تم الدفع بنجاح' :
                     orderDetailModal.paymentStatus === 'pending_verification' ? 'بانتظار مراجعة الإيصال' : 'بانتظار الدفع'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{orderDetailModal.createdAt}</span>
              </div>
              <button onClick={() => setOrderDetailModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Bank Transfer Receipt Verification Section */}
              {orderDetailModal.paymentMethod === 'bank_transfer' && orderDetailModal.bankTransferDetails && (
                <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <FileText className="w-4 h-4" />
                      <span>بيانات إيصال التحويل البنكي</span>
                    </div>
                    <span className="text-[10px] text-slate-300">طريقة الدفع: تحويل بنكي</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400">اسم المودع: </span>
                      <span className="text-white font-bold">{orderDetailModal.bankTransferDetails.depositorName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">البنك المحول إليه: </span>
                      <span className="text-white font-bold">{orderDetailModal.bankTransferDetails.bankName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">رقم الحوالة / المرجع: </span>
                      <span className="font-mono text-amber-300 font-bold">{orderDetailModal.bankTransferDetails.referenceNumber}</span>
                    </div>
                  </div>

                  {orderDetailModal.bankTransferDetails.receiptUrl && (
                    <div className="space-y-1">
                      <div className="text-slate-400 text-[11px] font-bold">صورة إشعار التحويل المرفقة:</div>
                      <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950 max-h-48 flex items-center justify-center">
                        <img 
                          src={orderDetailModal.bankTransferDetails.receiptUrl} 
                          alt="إشعار التحويل" 
                          className="w-full object-contain max-h-48"
                        />
                      </div>
                    </div>
                  )}

                  {orderDetailModal.paymentStatus === 'pending_verification' && (
                    <div className="pt-2 flex gap-2 border-t border-amber-500/20">
                      <button
                        onClick={async () => {
                          await updateOrderPaymentStatus(orderDetailModal.id, 'paid');
                          await updateOrderStatus(orderDetailModal.id, 'processing');
                          setOrderDetailModal(prev => prev ? { ...prev, paymentStatus: 'paid', status: 'processing' } : null);
                          showToast('تم اعتماد الحوالة وتأكيد دفع الطلب بنجاح! ✓', 'success');
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>اعتماد الحوالة وتأكيد الدفع</span>
                      </button>
                      <button
                        onClick={async () => {
                          await updateOrderPaymentStatus(orderDetailModal.id, 'failed');
                          setOrderDetailModal(prev => prev ? { ...prev, paymentStatus: 'failed' } : null);
                          showToast('تم رفض الحوالة وإشعار العميل', 'error');
                        }}
                        className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>رفض الحوالة</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Customer & Shipping info */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold mb-1">بيانات العميل والشحن:</div>
                <div>الاسم: <span className="text-white font-bold">{orderDetailModal.customer.name}</span></div>
                <div>الهاتف: <span className="text-white font-mono">{orderDetailModal.customer.phone}</span></div>
                <div>العنوان: <span className="text-white">{orderDetailModal.customer.city} - {orderDetailModal.customer.address}</span></div>
              </div>

              {/* Order Items */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-slate-400 font-bold">المنتجات المطلوبة ({orderDetailModal.items.length}):</div>
                {orderDetailModal.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                    <span>{it.productName} × {it.quantity}</span>
                    <span className="font-mono text-amber-400 font-bold">{it.price * it.quantity} {activeTenant.currencySymbol}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-1 font-bold text-white">
                  <span>المجموع الإجمالي:</span>
                  <span className="text-amber-400 font-mono text-sm">{orderDetailModal.total} {activeTenant.currencySymbol}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOrderDetailModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}

      {/* Bank Account Modal */}
      {bankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إضافة حساب بنكي جديد للمتجر</h3>
              <button onClick={() => setBankModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newBank: BankAccount = {
                id: `bank-${Date.now()}`,
                bankName,
                accountHolder,
                iban: iban.toUpperCase().trim(),
                accountNumber,
                isActive: true
              };
              const updatedBanks = [...(activeTenant.bankAccounts || []), newBank];
              updateTenant(activeTenant.id, { bankAccounts: updatedBanks });
              showToast('تمت إضافة الحساب البنكي بنجاح!', 'success');
              setBankModalOpen(false);
            }} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم البنك *</label>
                <input
                  required
                  type="text"
                  value={bankName}
                  onChange={e => setBankName(e.target.value)}
                  placeholder="مثال: مصرف الراجحي، بنك الأهلي SNB"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم صاحب الحساب / المؤسسة *</label>
                <input
                  required
                  type="text"
                  value={accountHolder}
                  onChange={e => setAccountHolder(e.target.value)}
                  placeholder="اسم المؤسسة كما في السجل التجاري"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رقم الآيبان (IBAN) *</label>
                <input
                  required
                  type="text"
                  value={iban}
                  onChange={e => setIban(e.target.value)}
                  placeholder="SA0000000000000000000000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رقم الحساب البنكي</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  placeholder="رقم الحساب الداخلي"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-2"
              >
                حفظ وتفعيل الحساب البنكي
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Staff Add Modal */}
      {staffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إضافة حساب موظف جديد</h3>
              <button onClick={() => setStaffModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم الموظف *</label>
                <input
                  required
                  type="text"
                  value={staffName}
                  onChange={e => setStaffName(e.target.value)}
                  placeholder="مثال: سارة الدوسري"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني للعمل *</label>
                <input
                  required
                  type="email"
                  value={staffEmail}
                  onChange={e => setStaffEmail(e.target.value)}
                  placeholder="staff@store.sa"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-left font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الدور والصلاحيات الأساسية</label>
                <select
                  value={staffRole}
                  onChange={e => setStaffRole(e.target.value as StaffRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="order_manager">مدير الطلبات والعملاء (Order Manager)</option>
                  <option value="product_manager">مدير المنتجات والمخزون (Product Manager)</option>
                  <option value="inventory_manager">أمين المستودع (Inventory Manager)</option>
                  <option value="marketing_manager">مسؤول التسويق والكوبونات (Marketing)</option>
                  <option value="support_agent">خدمة العملاء (Support Agent)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-2"
              >
                إرسال دعوة الانضمام
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
