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
  Monitor,
  Cpu,
  Building2,
  CheckCircle2,
  XCircle,
  FileText,
  Image as ImageIcon,
  Network,
  Puzzle
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
import { DesktopPOSManager } from './DesktopPOSManager';
import { DynamicRulesManager } from './DynamicRulesManager';
import { EventDrivenCQRSManager } from './EventDrivenCQRSManager';
import { WebhooksPluginsManager } from './WebhooksPluginsManager';
import { UsageAndBillingHub } from '../saas/UsageAndBillingHub';
import { Rocket, MessageSquare, ShieldAlert, ArrowUpRight, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { ConfirmActionDialog, RefundDetails } from '../common/ConfirmActionDialog';



interface MerchantDashboardProps {
  onOpenCommandPalette?: () => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onOpenCommandPalette }) => {
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
    showToast,
    resetToCleanStore
  } = useCommerce();

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Settings Sub-tab for progressive disclosure
  const [settingsSubTab, setSettingsSubTab] = useState<'basic' | 'payments' | 'developer'>('basic');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderDetailModal, setOrderDetailModal] = useState<Order | null>(null);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  // Refund Confirmation Modal
  const [refundDialogOrder, setRefundDialogOrder] = useState<Order | null>(null);
  const [isProcessingRefund, setIsProcessingRefund] = useState(false);

  // Inventory Quick Restock Modal / State
  const [quickRestockProduct, setQuickRestockProduct] = useState<Product | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(10);

  // Store Readiness Checklist State
  const [readinessTasks, setReadinessTasks] = useState<Record<string, boolean>>({
    branding: true,
    products: products.length > 0,
    payments: (activeTenant.bankAccounts && activeTenant.bankAccounts.length > 0) || true,
    domain: Boolean(activeTenant.customDomain),
    publishing: false
  });

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
  const [inventorySearch, setInventorySearch] = useState<string>('');

  // Theme customizer within dashboard
  const [dashPrimaryColor, setDashPrimaryColor] = useState<string>(activeTenant.theme.tokens.primary);
  const [dashStyle, setDashStyle] = useState<ThemeStyle>(activeTenant.theme.style);

  // Analytics Metrics & 5 Core Questions Answered
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const pendingVerificationOrders = orders.filter(o => o.paymentStatus === 'pending_verification');
  const unfulfilledOrders = orders.filter(o => o.status === 'new' || o.status === 'processing');
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockAlert);

  // Today's estimated slice
  const todaySales = Math.round(totalRevenue * 0.38) || 3450;
  const todayOrders = Math.max(1, Math.round(totalOrdersCount * 0.4));
  const conversionRate = 3.8;

  // Calculate readiness percentage
  const completedTaskCount = Object.values(readinessTasks).filter(Boolean).length;
  const readinessPercent = Math.round((completedTaskCount / Object.keys(readinessTasks).length) * 100);

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
    { id: 'saas_billing', label: 'الاشتراك والفوترة السحابية (SaaS)', icon: CreditCard, permitted: activeStaffPermissions.settings },
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
    { id: 'desktop_pos', label: 'نقطة البيع والعتاد (Desktop POS)', icon: Monitor, permitted: activeStaffPermissions.settings },
    { id: 'dynamic_rules', label: 'قواعد الخصم الديناميكية (AST)', icon: Cpu, permitted: activeStaffPermissions.settings },
    { id: 'event_cqrs', label: 'معمارية الأحداث (Event & CQRS)', icon: Network, permitted: activeStaffPermissions.settings },
    { id: 'webhooks_plugins', label: 'الإضافات والخطافات (Webhooks & Plugins)', icon: Puzzle, permitted: activeStaffPermissions.settings },
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#09090b] text-zinc-100 flex flex-col md:flex-row relative">
      
      {/* Floating Glass Sidebar */}
      <aside className="w-full md:w-72 m-3 sm:m-4 md:my-6 md:mr-6 md:ml-0 bg-zinc-900/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-4 shrink-0 flex flex-col justify-between self-start sticky top-20 z-20">
        
        <div className="space-y-4">
          {/* Store Profile Card */}
          <div className="relative group p-3.5 bg-zinc-950/80 rounded-2xl border border-white/10 hover:border-blue-500/40 transition-all duration-300 flex items-center justify-between overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="flex items-center gap-3 min-w-0 relative z-10">
              <img 
                src={activeTenant.logo} 
                alt="" 
                className="w-10 h-10 rounded-xl object-cover border border-white/15 shadow-md shrink-0" 
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate font-heading">{activeTenant.name}</div>
                <div className="text-[10px] text-zinc-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">متصل وجاهز ({activeTenant.plan.toUpperCase()})</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentView('storefront')}
              className="p-2 rounded-xl bg-zinc-800/80 hover:bg-blue-600 hover:text-white text-zinc-400 transition-all shadow-sm relative z-10"
              title="زيارة المتجر الحي"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Command Trigger in Sidebar */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-950/60 border border-white/5 hover:border-blue-500/30 text-xs text-zinc-400 hover:text-zinc-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">لوحة الأوامر السريعة</span>
              </div>
              <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400">
                Ctrl+K
              </kbd>
            </button>
          )}

          {/* Navigation Tabs */}
          <nav className="space-y-1 max-h-[calc(100vh-22rem)] overflow-y-auto pr-0.5">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-right group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] font-black'
                      : 'text-zinc-300 hover:bg-zinc-800/70 hover:text-white hover:translate-x-[-2px]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-blue-400'}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-zinc-950 text-blue-300' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Status */}
        <div className="pt-3 mt-3 border-t border-white/10 text-center">
          <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>CommerceOS Cloud Engine v4.2</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3 sm:p-6 md:p-8 overflow-y-auto max-w-7xl">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">لوحة تحكم المتجر</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  مرحباً بك مجدداً — إليك ملخص المبيعات، الطلبات، والنشاط التجاري المباشر لمتجر <span className="text-blue-400 font-bold font-heading">{activeTenant.name}</span>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm(`هل أنت متأكد من رغبتك في حذف وتصفير جميع المنتجات والطلبات الوهمية للمتجر "${activeTenant.name}" للبدء ببيانات جديدة نظيفة؟`)) {
                      resetToCleanStore(activeTenant.id);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 font-bold text-xs border border-red-500/20 transition-all hover:-translate-y-0.5"
                  title="مسح وتصفير البيانات الوهمية والتجريبية"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تصفير البيانات الوهمية</span>
                </button>
                <button
                  onClick={handleOpenAddProduct}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-white/10 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>إضافة منتج</span>
                </button>
                <button
                  onClick={() => setActiveTab('publish_center')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:bg-blue-500 transition-all hover:-translate-y-0.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>تصدير الكود البرمجي</span>
                </button>
              </div>
            </div>

            {/* 1. Hero KPI Strip (Answers: كم بعت؟ كم طلب؟ ما معدل التحويل وسلة الطلب؟) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Metric 1: Today's Sales */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">مبيعات اليوم والنشاط</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    {todaySales.toLocaleString()} <span className="text-xs font-normal text-zinc-400 font-sans">{activeTenant.currencySymbol}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>+22.4% مقارنة بالأمس</span>
                  </div>
                </div>
              </div>

              {/* Metric 2: Orders Count */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">إجمالي الطلبات اليومية</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    {totalOrdersCount} <span className="text-xs font-normal text-zinc-400 font-sans">طلب ({todayOrders} اليوم)</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{unfulfilledOrders.length} طلب بحاجة للتجهيز</span>
                  </div>
                </div>
              </div>

              {/* Metric 3: Average Order Value */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">متوسط قيمة السلة (AOV)</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    {averageOrderValue} <span className="text-xs font-normal text-zinc-400 font-sans">{activeTenant.currencySymbol}</span>
                  </div>
                  <div className="text-[11px] text-purple-300 mt-1 font-bold">
                    <span>معدل ممتاز للمتجر</span>
                  </div>
                </div>
              </div>

              {/* Metric 4: Conversion Rate */}
              <div className="p-5 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400">معدل التحويل (Conversion)</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-white font-mono tracking-tight">
                    {conversionRate}%
                  </div>
                  <div className="text-[11px] text-amber-300 mt-1 font-bold">
                    <span>+0.6% عن المتوسط الإقليمي</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Needs Attention Alert Zone (منطقة المهام والعمليات العاجلة) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-900/80 via-zinc-900/60 to-zinc-950/80 border border-white/10 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white font-heading">مهام تتطلب انتباهك المباشر (Needs Attention)</h3>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  {pendingVerificationOrders.length + lowStockProducts.length + unfulfilledOrders.length} إجراء معلّق
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Attention Card 1: Bank Transfer Verifications */}
                <div 
                  onClick={() => {
                    setOrderStatusFilter('all');
                    setActiveTab('orders');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    pendingVerificationOrders.length > 0
                      ? 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15'
                      : 'bg-zinc-950/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                      pendingVerificationOrders.length > 0 ? 'bg-amber-500 text-slate-950' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {pendingVerificationOrders.length}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">حوالات بنكية قيد المراجعة</div>
                      <div className="text-[10px] text-zinc-400">بانتظار التحقق من الإيصال البنكي</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold">مراجعة ←</span>
                </div>

                {/* Attention Card 2: Low Stock Warnings */}
                <div 
                  onClick={() => setActiveTab('inventory')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    lowStockProducts.length > 0
                      ? 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/15'
                      : 'bg-zinc-950/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                      lowStockProducts.length > 0 ? 'bg-rose-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {lowStockProducts.length}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">منتجات منخفضة المخزون</div>
                      <div className="text-[10px] text-zinc-400">تحت حد الأمان للتوريد</div>
                    </div>
                  </div>
                  <span className="text-xs text-rose-400 font-bold">إعادة توريد ←</span>
                </div>

                {/* Attention Card 3: Unfulfilled Orders */}
                <div 
                  onClick={() => {
                    setOrderStatusFilter('new');
                    setActiveTab('orders');
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    unfulfilledOrders.length > 0
                      ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/15'
                      : 'bg-zinc-950/60 border-white/5 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs font-mono ${
                      unfulfilledOrders.length > 0 ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {unfulfilledOrders.length}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-heading">طلبات جديدة للتجهيز</div>
                      <div className="text-[10px] text-zinc-400">جاهزة للشحن والتوصيل</div>
                    </div>
                  </div>
                  <span className="text-xs text-blue-400 font-bold">تجهيز ←</span>
                </div>
              </div>
            </div>

            {/* 3. Store Readiness Score & Interactive Checklist */}
            <div className="p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-black font-mono text-lg">
                    {readinessPercent}%
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white font-heading">مؤشر جاهزية المتجر للانطلاق (Store Launch Readiness)</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      أكمل خطوات التهيئة للوصول إلى 100% وإطلاق المتجر رسمياً للمتسوقين
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-48 bg-zinc-800/80 rounded-full h-3 overflow-hidden border border-white/5 p-0.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${readinessPercent}%` }} 
                  />
                </div>
              </div>

              {/* Checklist Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
                {[
                  { id: 'branding', title: 'هوية وشعار المتجر', tab: 'theme', desc: 'تم ضبط الألوان واللوغو' },
                  { id: 'products', title: 'إضافة المنتجات والأسعار', tab: 'products', desc: `${products.length} منتجات نشطة` },
                  { id: 'payments', title: 'الحسابات وبوابات الدفع', tab: 'settings', desc: 'مدى والتحويل البنكي' },
                  { id: 'domain', title: 'ربط النطاق المخصص', tab: 'settings', desc: activeTenant.customDomain || 'اضغط للربط' },
                  { id: 'publishing', title: 'تصدير ونشر التطبيق', tab: 'publish_center', desc: 'توليد PWA وMobile' }
                ].map(task => {
                  const isDone = readinessTasks[task.id];
                  return (
                    <div 
                      key={task.id}
                      onClick={() => {
                        setReadinessTasks(prev => ({ ...prev, [task.id]: !prev[task.id] }));
                        if (!isDone) setActiveTab(task.tab);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                        isDone 
                          ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50' 
                          : 'bg-zinc-950/60 border-white/10 hover:border-blue-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {isDone ? 'مكتمل ✓' : 'معلّق'}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isDone ? 'border-emerald-400 bg-emerald-400 text-slate-950' : 'border-zinc-600'
                        }`}>
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <div className="text-xs font-bold text-white truncate font-heading">{task.title}</div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">{task.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asymmetric Bento Grid Overview Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              
              {/* Bento Box 1: Revenue Hero Card (Span 8) */}
              <div className="md:col-span-8 relative group p-6 sm:p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-between overflow-hidden">
                {/* Hidden light reflection on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-zinc-400">إجمالي الإيرادات النشطة</span>
                      <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5 tracking-tight">
                        {totalRevenue.toLocaleString()} {activeTenant.currencySymbol}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>+18.4% نمو شهري</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 text-xs font-mono border border-white/5">
                      متوسط الطلب: {averageOrderValue} {activeTenant.currencySymbol}
                    </div>
                  </div>
                </div>

                {/* Mini Luminous Area Chart inside Bento */}
                <div className="h-48 w-full relative z-10 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="bentoCyberSalesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '16px', fontSize: '11px', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}
                        formatter={(val: any) => [`${val} ${activeTenant.currencySymbol}`, 'المبيعات المكتملة']}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#bentoCyberSalesGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bento Box 2: Side Vertical Rectangle - Latest Updates & Live Feed (Span 4) */}
              <div className="md:col-span-4 relative group p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-black text-white font-heading">آخر التحديثات والنشاط الحي</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded-full border border-white/5">
                      Live Telemetry
                    </span>
                  </div>

                  {/* Real-time Activity Feed */}
                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        <div>
                          <div className="text-xs font-bold text-zinc-200">الطلبات المكتملة</div>
                          <div className="text-[10px] text-zinc-500 font-mono">آخر تحديث قبل دقيقة</div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-white font-mono">{totalOrdersCount}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                        <div>
                          <div className="text-xs font-bold text-zinc-200">المنتجات النشطة</div>
                          <div className="text-[10px] text-zinc-500 font-mono">في الكتالوج الحي</div>
                        </div>
                      </div>
                      <span className="text-sm font-black text-blue-400 font-mono">{products.length}</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-zinc-950/70 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-purple-400" />
                        <div>
                          <div className="text-xs font-bold text-zinc-200">صحة المنظومة والـ AST</div>
                          <div className="text-[10px] text-zinc-500 font-mono">زمن الاستجابة: 12ms</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 font-mono">100% OK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 relative z-10">
                  <button
                    onClick={() => setActiveTab('publish_center')}
                    className="w-full py-3 bg-blue-600 text-white text-xs font-black rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:bg-blue-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4 text-white" />
                    <span>تصدير الكود البرمجي الفوري</span>
                  </button>
                </div>
              </div>

              {/* Bento Quick Action Cards (Span 12 -> 4 Cards) */}
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Action Card 1: Store Builder */}
                <div 
                  onClick={() => setCurrentView('builder_wizard')}
                  className="relative group p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-heading">معالج بناء المتجر</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Store Builder Wizard</p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-400 group-hover:translate-x-[-4px] transition-transform">←</span>
                  </div>
                </div>

                {/* Action Card 2: AST Rules Engine */}
                <div 
                  onClick={() => setActiveTab('dynamic_rules')}
                  className="relative group p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-heading">قواعد الخصم (AST)</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Dynamic Rule AST</p>
                      </div>
                    </div>
                    <span className="text-xs text-amber-400 group-hover:translate-x-[-4px] transition-transform">←</span>
                  </div>
                </div>

                {/* Action Card 3: CQRS & Events */}
                <div 
                  onClick={() => setActiveTab('event_cqrs')}
                  className="relative group p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                        <Network className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-heading">معمارية الأحداث (CQRS)</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Event Streams & Queue</p>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-400 group-hover:translate-x-[-4px] transition-transform">←</span>
                  </div>
                </div>

                {/* Action Card 4: Webhooks & Plugins */}
                <div 
                  onClick={() => setActiveTab('webhooks_plugins')}
                  className="relative group p-5 rounded-2xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] cursor-pointer overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
                        <Puzzle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white font-heading">الإضافات والخطافات</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5 font-mono">Webhooks & HMAC</p>
                      </div>
                    </div>
                    <span className="text-xs text-purple-400 group-hover:translate-x-[-4px] transition-transform">←</span>
                  </div>
                </div>

              </div>

              {/* Bento Box 3: Recent Orders Table (Span 7) */}
              <div className="md:col-span-7 relative group p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all duration-500 space-y-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-heading flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-blue-400" />
                    <span>أحدث الطلبات الواردة للمتجر</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-blue-400 font-bold hover:underline"
                  >
                    عرض الكل ({orders.length})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400">
                        <th className="pb-3">رقم الطلب</th>
                        <th className="pb-3">العميل</th>
                        <th className="pb-3">المبلغ</th>
                        <th className="pb-3">الحالة</th>
                        <th className="pb-3">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {orders.slice(0, 4).map(order => (
                        <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="py-3 font-mono font-bold text-blue-400">{order.orderNumber}</td>
                          <td className="py-3 text-zinc-200">{order.customer.name}</td>
                          <td className="py-3 font-mono font-bold">{order.total} {activeTenant.currencySymbol}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
                              className="px-3 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[11px] font-bold text-zinc-300 border border-white/5 transition-colors"
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

              {/* Bento Box 4: Customers & Low Stock Alarms (Span 5) */}
              <div className="md:col-span-5 relative group p-6 rounded-3xl bg-zinc-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/40 transition-all duration-500 space-y-4 overflow-hidden">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white font-heading flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>العملاء وتنبيهات المخزون</span>
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">Bento Telemetry</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs font-mono">
                        {customers.length}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-heading">قاعدة العملاء المسجلين</div>
                        <div className="text-[10px] text-zinc-400 font-mono">نسبة الشراء المتكرر: 68%</div>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('customers')} className="text-xs text-blue-400 font-bold hover:underline">عرض</button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-zinc-950/80 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs font-mono">
                        {lowStockProducts.length}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-heading">تنبيهات انخفاض المخزون</div>
                        <div className="text-[10px] text-amber-400 font-mono">تحتاج إعادة طلب أو توريد عاجل</div>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('inventory')} className="text-xs text-blue-400 font-bold hover:underline">إدارة</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={handleOpenAddProduct}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" />
                    <span>منتج جديد</span>
                  </button>
                  <button
                    onClick={() => setCouponModalOpen(true)}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center justify-center gap-2 border border-white/10 transition-colors"
                  >
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                    <span>كوبون خصم</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* SAAS USAGE & BILLING HUB TAB */}
        {activeTab === 'saas_billing' && (
          <div className="space-y-6 animate-in fade-in">
            <UsageAndBillingHub />
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
                              {order.paymentStatus === 'paid' && order.status !== 'cancelled' && (
                                <button
                                  onClick={() => setRefundDialogOrder(order)}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[11px] font-bold text-rose-400 border border-rose-500/20 flex items-center gap-1"
                                  title="استرجاع وإلغاء الطلب"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>استرجاع</span>
                                </button>
                              )}
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

        {/* INVENTORY & WAREHOUSE MANAGEMENT TAB */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">إدارة المخزون والمستودع (Inventory Control)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  مراقبة المخزون الفعلي، المحجوز، المتاح للبيع، وإعادة التوريد السريع بضغطة زر.
                </p>
              </div>
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة صنف جديد</span>
              </button>
            </div>

            {/* Inventory KPI Stats Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">إجمالي المنتجات المسجلة</div>
                <div className="text-2xl font-black text-white font-mono">{products.length} صنف</div>
                <div className="text-[10px] text-blue-400">جاهزة في المستودع الحي</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">إجمالي القطع المتوفرة</div>
                <div className="text-2xl font-black text-white font-mono">
                  {products.reduce((acc, p) => acc + p.stock, 0)} قطعة
                </div>
                <div className="text-[10px] text-emerald-400">متاحة للشحن الفوري</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">تنبيهات انخفاض المخزون</div>
                <div className="text-2xl font-black text-rose-400 font-mono">
                  {lowStockProducts.length} منتجات
                </div>
                <div className="text-[10px] text-rose-300">تحتاج إعادة طلب أو توريد</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">القيمة التقديرية للمخزون</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} {activeTenant.currencySymbol}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">سعر البيع الإجمالي</div>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={e => setInventorySearch(e.target.value)}
                    placeholder="ابحث باسم المنتج أو SKU..."
                    className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="text-xs text-slate-400 font-mono self-end sm:self-auto">
                  عدد السجلات: {products.length}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">المنتج والتصنيف</th>
                      <th className="pb-3">الرمز (SKU)</th>
                      <th className="pb-3">في المستودع (On Hand)</th>
                      <th className="pb-3">محجوز بطلبات (Reserved)</th>
                      <th className="pb-3">المتاح للبيع (Available)</th>
                      <th className="pb-3">حد التنبيه (Threshold)</th>
                      <th className="pb-3 text-left">إعادة توريد سريع (Restock)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {products
                      .filter(p => {
                        const q = (inventorySearch || '').toLowerCase().trim();
                        if (!q) return true;
                        return (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q);
                      })
                      .map(prod => {
                        const reservedCount = orders
                          .filter(o => o.status === 'new' || o.status === 'processing')
                          .reduce((sum, o) => {
                            const found = o.items.find(it => it.productId === prod.id);
                            return sum + (found ? found.quantity : 0);
                          }, 0);
                        const available = Math.max(0, prod.stock - reservedCount);
                        const isLow = prod.stock <= prod.lowStockAlert;

                        return (
                          <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 flex items-center gap-3">
                              <img src={prod.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                              <div>
                                <div className="font-bold text-white">{prod.name}</div>
                                <div className="text-[10px] text-slate-400">{prod.price} {activeTenant.currencySymbol}</div>
                              </div>
                            </td>
                            <td className="py-3 font-mono text-slate-300">{prod.sku}</td>
                            <td className="py-3">
                              <span className={`font-mono font-bold text-sm ${isLow ? 'text-rose-400' : 'text-white'}`}>
                                {prod.stock}
                              </span>
                            </td>
                            <td className="py-3 font-mono text-slate-400">
                              {reservedCount} قطعة
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                available > 5 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                                available > 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              }`}>
                                {available} متاح
                              </span>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updateProduct(prod.id, { lowStockAlert: Math.max(1, prod.lowStockAlert - 1) })}
                                  className="w-5 h-5 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="font-mono text-slate-200 font-bold px-1">{prod.lowStockAlert}</span>
                                <button
                                  onClick={() => updateProduct(prod.id, { lowStockAlert: prod.lowStockAlert + 1 })}
                                  className="w-5 h-5 rounded bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="py-3 text-left">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    updateProduct(prod.id, { stock: prod.stock + 5 });
                                    showToast(`تمت إضافة +5 قطع لمخزون "${prod.name}"`, 'success');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 font-mono font-bold text-[11px]"
                                >
                                  +5
                                </button>
                                <button
                                  onClick={() => {
                                    updateProduct(prod.id, { stock: prod.stock + 10 });
                                    showToast(`تمت إضافة +10 قطع لمخزون "${prod.name}"`, 'success');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-mono font-bold text-[11px]"
                                >
                                  +10
                                </button>
                                <button
                                  onClick={() => {
                                    updateProduct(prod.id, { stock: prod.stock + 50 });
                                    showToast(`تمت إضافة +50 قطعة لمخزون "${prod.name}"`, 'success');
                                  }}
                                  className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-[11px]"
                                >
                                  +50
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS MANAGEMENT TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">قاعدة بيانات العملاء (CRM & Segments)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  سجل العملاء، معدلات الشراء، تصنيف العملاء المميزين (VIP)، وإجمالي الإنفاق.
                </p>
              </div>
            </div>

            {/* Customers KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">إجمالي العملاء المسجلين</div>
                <div className="text-2xl font-black text-white font-mono">{customers.length} عميل</div>
                <div className="text-[10px] text-emerald-400 font-bold">+14% نمو هذا الشهر</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">العملاء المميزون (VIP)</div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {customers.filter(c => c.totalSpent > 1000).length} عملاء
                </div>
                <div className="text-[10px] text-amber-300">أكثر من 1,000 {activeTenant.currencySymbol} إنفاق</div>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-1">
                <div className="text-xs text-slate-400 font-bold">متوسط القيمة الدائمة للعميل (LTV)</div>
                <div className="text-2xl font-black text-blue-400 font-mono">
                  {customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length) : 0} {activeTenant.currencySymbol}
                </div>
                <div className="text-[10px] text-blue-300">معدل تكرار الشراء: 68%</div>
              </div>
            </div>

            {/* Customers Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">العميل</th>
                      <th className="pb-3">رقم الهاتف</th>
                      <th className="pb-3">المدينة</th>
                      <th className="pb-3">عدد الطلبات</th>
                      <th className="pb-3">إجمالي المشتريات</th>
                      <th className="pb-3">التصنيف</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {customers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-800/40">
                        <td className="py-3">
                          <div className="font-bold text-white">{cust.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{cust.email}</div>
                        </td>
                        <td className="py-3 font-mono text-slate-300">{cust.phone}</td>
                        <td className="py-3 text-slate-300">{cust.city}</td>
                        <td className="py-3 font-mono font-bold text-white">{cust.ordersCount} طلبات</td>
                        <td className="py-3 font-mono font-bold text-amber-400">{cust.totalSpent} {activeTenant.currencySymbol}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            cust.totalSpent > 1500 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            cust.ordersCount > 2 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {cust.totalSpent > 1500 ? 'VIP ذهبي ★' : cust.ordersCount > 2 ? 'عميل متكرر' : 'عميل جديد'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* COUPONS & DISCOUNTS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">الكوبونات والعروض الترويجية (Coupons)</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  أنشئ أكواد خصم بنسبة مئوية أو قيمة ثابتة وحدد الحد الأدنى للطلب وتتبع استخداماتها.
                </p>
              </div>
              <button
                onClick={() => setCouponModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كوبون جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map(cp => (
                <div key={cp.id} className="p-5 bg-slate-900 rounded-2xl border border-slate-800 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="px-3 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-black text-sm rounded-xl tracking-wider">
                      {cp.code}
                    </div>
                    <button
                      onClick={() => deleteCoupon(cp.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                      title="حذف الكوبون"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-300">
                    قيمة الخصم: <span className="text-white font-bold">{cp.type === 'percentage' ? `${cp.value}% خصم` : `${cp.value} ${activeTenant.currencySymbol} خصم مباشر`}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    الحد الأدنى للطلب: <span className="font-mono text-slate-300">{cp.minSpend} {activeTenant.currencySymbol}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                    <span>استُخدم {cp.usageCount || 0} مرات</span>
                    <span className="text-emerald-400 font-bold">نشط ✓</span>
                  </div>
                </div>
              ))}
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

        {/* DESKTOP POS & HARDWARE INTEGRATION TAB */}
        {activeTab === 'desktop_pos' && (
          <div className="animate-in fade-in">
            <DesktopPOSManager tenant={activeTenant} />
          </div>
        )}

        {/* DYNAMIC RULES & AST ENGINE TAB */}
        {activeTab === 'dynamic_rules' && (
          <div className="animate-in fade-in">
            <DynamicRulesManager tenant={activeTenant} />
          </div>
        )}

        {/* EVENT-DRIVEN & CQRS ARCHITECTURE TAB */}
        {activeTab === 'event_cqrs' && (
          <div className="animate-in fade-in">
            <EventDrivenCQRSManager tenant={activeTenant} />
          </div>
        )}

        {/* WEBHOOKS & PLUGINS ARCHITECTURE TAB */}
        {activeTab === 'webhooks_plugins' && (
          <div className="animate-in fade-in">
            <WebhooksPluginsManager tenant={activeTenant} />
          </div>
        )}

        {/* 5. MOBILE APP TAB */}
        {activeTab === 'mobile_app' && (
          <div className="animate-in fade-in">
            <PublishCenter />
          </div>
        )}

        {/* 6. SETTINGS & DOMAIN TAB WITH PROGRESSIVE DISCLOSURE */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white">إعدادات المتجر والدفع والربط المتقدم</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  إدارة الهوية الأساسية، بوابات الدفع والشحن، والربط التقني المتقدم عبر خطافات الويب والـ DNS.
                </p>
              </div>
            </div>

            {/* Progressive Disclosure Sub-Tabs */}
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              {[
                { id: 'basic', label: 'الإعدادات الأساسية والهوية' },
                { id: 'payments', label: 'بوابات الدفع والحسابات البنكية' },
                { id: 'developer', label: 'المطورين والنطاق المخصص (DNS & API)' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSettingsSubTab(sub.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    settingsSubTab === sub.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-Tab 1: Basic Store Settings */}
            {settingsSubTab === 'basic' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                <div className="lg:col-span-8 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-sm font-bold text-white">بيانات المتجر العامة</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر</label>
                      <input
                        type="text"
                        value={activeTenant.name}
                        onChange={e => updateTenant(activeTenant.id, { name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">المعرف البرمجي (Slug)</label>
                      <input
                        type="text"
                        disabled
                        value={activeTenant.slug}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">العملة الافتراضية</label>
                      <input
                        type="text"
                        value={activeTenant.currencySymbol}
                        onChange={e => updateTenant(activeTenant.id, { currencySymbol: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">شعار المتجر (Logo URL)</label>
                      <input
                        type="text"
                        value={activeTenant.logo}
                        onChange={e => updateTenant(activeTenant.id, { logo: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => showToast('تم حفظ الإعدادات الأساسية بنجاح!', 'success')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    حفظ التغييرات
                  </button>
                </div>

                <div className="lg:col-span-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
                  <h3 className="text-sm font-bold text-white">معاينة الهوية</h3>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                    <img src={activeTenant.logo} alt="" className="w-16 h-16 rounded-xl mx-auto object-cover border border-slate-700" />
                    <div className="font-bold text-white text-sm">{activeTenant.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">stores.commerceos.app/{activeTenant.slug}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Payments & Bank Accounts */}
            {settingsSubTab === 'payments' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                {/* Gateways */}
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <CreditCard className="w-4 h-4" />
                    <span>بوابات الدفع الإلكتروني المعتمدة</span>
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

                {/* Bank Accounts */}
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                      <Building2 className="w-4 h-4" />
                      <span>الحسابات البنكية لاستقبال التحويلات</span>
                    </div>
                    <button
                      onClick={() => {
                        setBankName('مصرف الراجحي');
                        setAccountHolder(activeTenant.name);
                        setIban('SA');
                        setAccountNumber('');
                        setBankModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة حساب</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(activeTenant.bankAccounts || []).map((acc) => (
                      <div key={acc.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-white">{acc.bankName}</span>
                          <span className="text-[10px] text-emerald-400 font-bold">نشط ✓</span>
                        </div>
                        <div className="text-[11px] text-slate-300 font-mono">
                          <span className="text-slate-500">IBAN:</span> <span className="text-amber-400 font-bold">{acc.iban}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">المستفيد: {acc.accountHolder}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Developer, Domain & Webhooks */}
            {settingsSubTab === 'developer' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in">
                {/* Custom Domain */}
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <Globe className="w-4 h-4" />
                    <span>ربط النطاق المخصص (Custom Domain DNS)</span>
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
                        className="px-3 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs"
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

                {/* API & Webhooks Link */}
                <div className="lg:col-span-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                    <Puzzle className="w-4 h-4" />
                    <span>تكامل المطورين والـ API Keys</span>
                  </div>

                  <p className="text-xs text-slate-300">
                    يمكنك ربط متجرك مع التطبيقات الخارجية، ERP، وشركات الشحن باستخدام مفاتيح API الآمنة وخطافات الويب الموقعة رقمياً بـ HMAC.
                  </p>

                  <div className="pt-2 flex gap-3">
                    <button
                      onClick={() => setActiveTab('webhooks_plugins')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-white/10"
                    >
                      إدارة الخطافات (Webhooks)
                    </button>
                    <button
                      onClick={() => setActiveTab('security_center')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold rounded-xl border border-white/10"
                    >
                      مركز التواقيع الرقمية
                    </button>
                  </div>
                </div>
              </div>
            )}

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

      {/* Coupon Modal */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-right space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">إنشاء كوبون خصم جديد</h3>
              <button onClick={() => setCouponModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">كود الكوبون (Coupon Code) *</label>
                <input
                  required
                  type="text"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  placeholder="مثال: SAVE20"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase text-left"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">نوع الخصم</label>
                  <select
                    value={couponType}
                    onChange={e => setCouponType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت ({activeTenant.currencySymbol})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">قيمة الخصم *</label>
                  <input
                    required
                    type="number"
                    value={couponValue}
                    onChange={e => setCouponValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">الحد الأدنى للطلب ({activeTenant.currencySymbol})</label>
                <input
                  type="number"
                  value={couponMinSpend}
                  onChange={e => setCouponMinSpend(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md mt-2"
              >
                حفظ وتفعيل الكوبون
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Action Dialog for Refunds */}
      {refundDialogOrder && (
        <ConfirmActionDialog
          isOpen={Boolean(refundDialogOrder)}
          variant="refund"
          title="تأكيد استرجاع وإلغاء الطلب"
          subtitle={`سيتم إلغاء الطلب ${refundDialogOrder.orderNumber} وإعادة المبلغ إلى حساب العميل`}
          confirmLabel="تأكيد الاسترجاع المالي وإلغاء الطلب"
          cancelLabel="تراجع"
          isProcessing={isProcessingRefund}
          onCancel={() => setRefundDialogOrder(null)}
          refundDetails={{
            originalTotal: refundDialogOrder.total,
            alreadyRefunded: 0,
            refundAmount: refundDialogOrder.total,
            remainingBalance: 0,
            currencySymbol: activeTenant.currencySymbol,
            refundMethod: refundDialogOrder.paymentMethod === 'mada' ? 'مدى (Mada)' :
                          refundDialogOrder.paymentMethod === 'apple_pay' ? 'Apple Pay' :
                          refundDialogOrder.paymentMethod === 'bank_transfer' ? 'حساب العميل البنكي' : 'البوابة الأصلية',
            items: refundDialogOrder.items.map(it => ({
              name: it.productName,
              quantity: it.quantity,
              price: it.price
            }))
          }}
          onConfirm={async () => {
            setIsProcessingRefund(true);
            try {
              // 1. Update order payment status and order status
              await updateOrderPaymentStatus(refundDialogOrder.id, 'failed');
              await updateOrderStatus(refundDialogOrder.id, 'cancelled');
              
              // 2. Restock products in inventory
              refundDialogOrder.items.forEach(it => {
                const prod = products.find(p => p.id === it.productId);
                if (prod) {
                  updateProduct(prod.id, { stock: prod.stock + it.quantity });
                }
              });

              showToast(`تم استرجاع مبلغ ${refundDialogOrder.total} ${activeTenant.currencySymbol} للطلب ${refundDialogOrder.orderNumber} وإعادة الأصناف للمخزون بنجاح! ✓`, 'success');
              setRefundDialogOrder(null);
              if (orderDetailModal && orderDetailModal.id === refundDialogOrder.id) {
                setOrderDetailModal(null);
              }
            } finally {
              setIsProcessingRefund(false);
            }
          }}
        />
      )}

    </div>
  );
};
