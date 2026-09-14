import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Package, 
  Warehouse, 
  Tag, 
  TrendingUp, 
  Store, 
  Palette, 
  Globe, 
  Settings, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  BarChart3, 
  Rocket, 
  Download, 
  Code2, 
  Cloud, 
  Wallet, 
  TrendingDown, 
  Calculator, 
  Gift, 
  CreditCard, 
  Building2,
  Sliders,
  ShieldCheck,
  GraduationCap,
  FolderKanban,
  Monitor,
  Smartphone,
  Bell,
  Key,
  Cpu,
  Network,
  Webhook,
  Server
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface MerchantSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onOpenWorkspaceSwitcher: () => void;
  className?: string;
  isMobile?: boolean;
}

export const MerchantSidebar: React.FC<MerchantSidebarProps> = ({
  activeSection,
  setActiveSection,
  collapsed,
  setCollapsed,
  onOpenWorkspaceSwitcher,
  className = '',
  isMobile = false
}) => {
  const { activeTenant, language, currentStaffRole, orders, debts, setCurrentView, tenants } = useCommerce();
  const isAr = language === 'ar';

  const pendingOrdersCount = orders.filter(o => o.status === 'new' || o.status === 'processing').length;
  const activeDebtsCount = debts.filter(d => d.remainingAmount > 0).length;

  const handleNavClick = (itemId: string) => {
    if (itemId === 'storefront') {
      setCurrentView('storefront');
      return;
    }
    if (itemId === 'no_code_studio') {
      setCurrentView('no_code_studio');
      return;
    }
    setActiveSection(itemId);
  };

  const navGroups = [
    {
      title: isAr ? 'المشاريع والاستوديو' : 'Projects & Studio',
      items: [
        { id: 'overview', label: isAr ? 'لوحة القيادة' : 'Overview', icon: LayoutDashboard },
        { 
          id: 'projects', 
          label: isAr ? 'إدارة المشاريع والمتاجر' : 'Projects & Stores', 
          icon: FolderKanban,
          badge: tenants.length > 0 ? String(tenants.length) : undefined
        },
        { id: 'features_manager', label: isAr ? 'مركز الميزات والوحدات' : 'App & Features Hub', icon: Sliders, badge: isAr ? 'تخصيص' : 'Hub' },
        { id: 'no_code_studio', label: isAr ? 'استوديو التطبيقات والمواقع' : 'No-Code App Studio', icon: Sparkles }
      ]
    },
    {
      title: isAr ? 'المبيعات ونقاط البيع' : 'Sales & POS',
      items: [
        { id: 'pos', label: isAr ? 'نقطة البيع (الكاشير)' : 'Point of Sale (POS)', icon: Calculator },
        { id: 'desktop_pos', label: isAr ? 'الكاشير المكتبي والعتاد' : 'Desktop POS & Hardware', icon: Monitor, badge: 'PRO' },
        { 
          id: 'orders', 
          label: isAr ? 'الطلبات' : 'Orders', 
          icon: ShoppingBag, 
          badge: pendingOrdersCount > 0 ? String(pendingOrdersCount) : undefined 
        },
        { id: 'abandoned_carts', label: isAr ? 'السلات المتروكة' : 'Abandoned Carts', icon: ShoppingBag, badge: 'Recovery' },
        { id: 'customers', label: isAr ? 'العملاء' : 'Customers', icon: Users },
        { id: 'coupons', label: isAr ? 'كوبونات الخصم' : 'Coupons', icon: Gift }
      ]
    },
    {
      title: isAr ? 'المالية والحسابات والبنوك' : 'Finance & Banking',
      items: [
        { 
          id: 'debts', 
          label: isAr ? 'الحسابات الآجلة والديون' : 'Debts & Receivables', 
          icon: Wallet,
          badge: activeDebtsCount > 0 ? String(activeDebtsCount) : undefined
        },
        { id: 'expenses', label: isAr ? 'المصروفات التشغيلية' : 'Operating Expenses', icon: TrendingDown },
        { id: 'banking_payments', label: isAr ? 'المدفوعات والربط البنكي' : 'Payments & Banks', icon: CreditCard },
        { id: 'saas_billing', label: isAr ? 'بيانات التراخيص والمفاتيح' : 'Licenses & API Keys', icon: Key }
      ]
    },
    {
      title: isAr ? 'الكتالوج والقطاعات التجارية' : 'Catalog & Sectors',
      items: [
        { id: 'commercial_hub', label: isAr ? 'حلول القطاعات (جملة/تجزئة)' : 'Commercial Sectors', icon: Building2 },
        { id: 'products', label: isAr ? 'المنتجات' : 'Products', icon: Package },
        { id: 'categories', label: isAr ? 'التصنيفات' : 'Categories', icon: Tag },
        { id: 'inventory', label: isAr ? 'المخزون' : 'Inventory', icon: Warehouse }
      ]
    },
    {
      title: isAr ? 'التطبيقات والتصدير المستقل' : 'Apps & Standalone Export',
      items: [
        { id: 'storefront', label: isAr ? 'المعاينة الحية المحلية' : 'Local Preview', icon: Store },
        { id: 'mobile_app', label: isAr ? 'حزم الجوال و PWA' : 'Mobile & PWA Packages', icon: Smartphone, badge: 'APK' },
        { id: 'design', label: isAr ? 'التصميم والهوية' : 'Design Tokens', icon: Palette },
        { id: 'publish', label: isAr ? 'تصدير الكود والحزم (ZIP)' : 'Export Code & Packages', icon: Download }
      ]
    },
    {
      title: isAr ? 'المحركات والربط المتقدم' : 'Engines & Integration',
      items: [
        { id: 'notifications', label: isAr ? 'إشعارات واتساب والرسائل' : 'WhatsApp & Alerts', icon: Bell },
        { id: 'licensing', label: isAr ? 'التراخيص والوايت ليبل' : 'Licensing & White-label', icon: Key },
        { id: 'dynamic_rules', label: isAr ? 'محرك الخصومات الذكي (AST)' : 'Dynamic AST Rules', icon: Cpu },
        { id: 'webhooks_plugins', label: isAr ? 'الإضافات وخطافات الويب' : 'Webhooks & Plugins', icon: Webhook },
        { id: 'event_cqrs', label: isAr ? 'سجل الأحداث (CQRS)' : 'Event Stream CQRS', icon: Network }
      ]
    }
  ];

  const systemItems = [
    { id: 'knowledge_academy', label: isAr ? 'أكاديمية المعرفة والتصميم' : 'Knowledge & Design Academy', icon: GraduationCap, badge: 'INTEL' },
    { id: 'security_compliance', label: isAr ? 'الأمان والامتثال السيبراني' : 'Security & Compliance', icon: ShieldCheck, badge: 'PRO' },
    { id: 'settings', label: isAr ? 'الإعدادات' : 'Settings', icon: Settings },
    { id: 'help', label: isAr ? 'المساعدة والدعم' : 'Help & Support', icon: HelpCircle }
  ];

  return (
    <aside 
      className={`fixed inset-y-0 start-0 z-40 bg-[#050B14]/95 backdrop-blur-xl border-e border-[#233247] transition-all duration-300 flex flex-col ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-[#233247] flex items-center justify-between gap-2">
        {!collapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] flex items-center justify-center text-[#050B14] font-black shadow-lg shadow-[#C9A45C]/10 shrink-0">
              C
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-black tracking-wider text-[#F4F6F8] truncate">CommerceOS</h1>
              <p className="text-[10px] text-[#C9A45C] font-medium tracking-wide truncate">Sovereign Platform</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] flex items-center justify-center text-[#050B14] font-black shadow-lg shadow-[#C9A45C]/10">
            C
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-white/5 transition-colors hidden lg:flex items-center justify-center"
          title={collapsed ? (isAr ? 'توسيع الشريط' : 'Expand Sidebar') : (isAr ? 'طي الشريط' : 'Collapse Sidebar')}
        >
          {isAr ? (
            collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
          ) : (
            collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Workspace Context Selector */}
      <div className="p-3 border-b border-[#233247]">
        <button
          onClick={onOpenWorkspaceSwitcher}
          className={`w-full p-2.5 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] transition-all flex items-center gap-3 text-start group ${
            collapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isAr ? 'تبديل المتجر النشط' : 'Switch Workspace'}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] flex items-center justify-center font-bold text-xs shrink-0">
              {activeTenant.storeName?.charAt(0) || 'S'}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#F4F6F8] truncate group-hover:text-[#C9A45C] transition-colors">
                  {activeTenant.storeName}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#97A4B5] mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    activeTenant.status === 'live' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`} />
                  <span className="capitalize">{activeTenant.status}</span>
                </div>
              </div>
            )}
          </div>
          {!collapsed && <ChevronDown className="w-3.5 h-3.5 text-[#97A4B5] group-hover:text-[#F4F6F8] transition-colors" />}
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 divide-y divide-[#233247]/50">
        {navGroups.map((group, idx) => (
          <div key={idx} className={idx > 0 ? 'pt-5' : ''}>
            {!collapsed && (
              <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#667386]">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                      isActive 
                        ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30 shadow-sm' 
                        : 'text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-[#0B1422] border border-transparent'
                    } ${collapsed ? 'justify-center px-0' : ''}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#C9A45C]' : 'text-[#667386] group-hover:text-[#F4F6F8]'}`} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {item.badge && !collapsed && (
                      <span className="ms-auto px-1.5 py-0.5 rounded-md bg-[#C9A45C]/20 text-[#C9A45C] text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute start-0 inset-y-2 w-1 bg-[#C9A45C] rounded-e rtl:start-auto rtl:end-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* System Footer Section */}
      <div className="p-3 border-t border-[#233247] space-y-1">
        {systemItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive 
                  ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30' 
                  : 'text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-[#0B1422] border border-transparent'
              } ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 text-[#667386]" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
