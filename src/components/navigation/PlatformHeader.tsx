import React, { useState, useRef, useEffect } from 'react';
import { 
  Store, 
  LayoutDashboard, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Palette, 
  ShieldCheck, 
  ChevronDown, 
  ShoppingBag, 
  Globe, 
  Plus, 
  Building2, 
  Check, 
  ExternalLink,
  Crown,
  Server,
  RefreshCw
} from 'lucide-react';
import { useCommerce, AppView } from '../../context/CommerceContext';
import { StaffRole } from '../../types';

export const PlatformHeader: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    activeTenant,
    tenants,
    setActiveTenantId,
    previewDevice,
    setPreviewDevice,
    language,
    setLanguage,
    currentStaffRole,
    setCurrentStaffRole,
    cart,
    setCartOpen,
    isServerSyncing,
    refreshFromBackend
  } = useCommerce();

  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const tenantRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tenantRef.current && !tenantRef.current.contains(e.target as Node)) {
        setTenantDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalCartItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  const roleLabels: Record<StaffRole, { titleAr: string; titleEn: string; color: string }> = {
    store_owner: { titleAr: 'مالك المتجر (صلاحيات كاملة)', titleEn: 'Store Owner (All)', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    store_admin: { titleAr: 'مدير عام المتجر', titleEn: 'Store Admin', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    product_manager: { titleAr: 'مدير المنتجات والمخزون', titleEn: 'Product Manager', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    order_manager: { titleAr: 'مدير الطلبات والعملاء', titleEn: 'Order Manager', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    inventory_manager: { titleAr: 'أمين المستودع', titleEn: 'Inventory Manager', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    marketing_manager: { titleAr: 'مسؤول التسويق والكوبونات', titleEn: 'Marketing Manager', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
    support_agent: { titleAr: 'خدمة العملاء', titleEn: 'Support Agent', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' }
  };

  const navItems: { view: AppView; labelAr: string; labelEn: string; icon: React.FC<{ className?: string }> }[] = [
    { view: 'storefront', labelAr: 'متجر العميل (Live)', labelEn: 'Storefront', icon: Store },
    { view: 'merchant_dashboard', labelAr: 'لوحة إدارة المتجر', labelEn: 'Dashboard', icon: LayoutDashboard },
    { view: 'visual_ide', labelAr: 'Visual IDE (المحرر المرئي)', labelEn: 'Visual IDE', icon: Layers },
    { view: 'live_customizer', labelAr: 'Design Studio', labelEn: 'Design Studio', icon: Palette },
    { view: 'builder_wizard', labelAr: 'بناء متجر جديد', labelEn: 'Store Builder', icon: Sparkles },
    { view: 'platform_admin', labelAr: 'CommerceOS HQ', labelEn: 'Platform HQ', icon: Building2 }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              onClick={() => setCurrentView('storefront')}
              className="cursor-pointer flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
                <Crown className="w-4 h-4 text-slate-950" />
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>CommerceOS</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                    White-Label
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">منصة المتاجر الذكية</div>
              </div>
            </div>

            {/* Tenant Switcher Dropdown */}
            <div className="relative" ref={tenantRef}>
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-200 transition-all shadow-sm"
                title="تغيير المتجر النشط"
              >
                <div 
                  className="w-3 h-3 rounded-full shrink-0" 
                  style={{ backgroundColor: activeTenant.theme.tokens.primary }}
                />
                <span className="max-w-[130px] truncate text-slate-100">
                  {language === 'ar' ? activeTenant.name : activeTenant.nameEn}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {tenantDropdownOpen && (
                <div className="absolute top-full mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-right">
                  <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                    المتاجر التجريبية والنشطة
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {tenants.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTenantId(t.id);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${
                          t.id === activeTenant.id
                            ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: t.theme.tokens.primary }}
                          />
                          <span className="truncate">{t.name}</span>
                        </div>
                        {t.id === activeTenant.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setCurrentView('builder_wizard');
                        setTenantDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إنشاء متجر جديد الآن</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Primary View Switcher Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities: Device switcher, RBAC role simulator, Cart trigger */}
          <div className="flex items-center gap-2">
            
            {/* Device Switcher (Visible on Storefront & Customizer) */}
            {(currentView === 'storefront' || currentView === 'live_customizer') && (
              <div className="hidden sm:flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-md transition-colors ${previewDevice === 'desktop' ? 'bg-slate-700 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  title="عرض الشاشة الكاملة (Desktop)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-md transition-colors ${previewDevice === 'tablet' ? 'bg-slate-700 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  title="عرض اللوحي (Tablet)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-md transition-colors ${previewDevice === 'mobile' ? 'bg-slate-700 text-amber-400 shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  title="عرض الجوال (Mobile PWA)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* RBAC Role Simulator (Visible on Merchant Dashboard) */}
            {currentView === 'merchant_dashboard' && (
              <div className="relative" ref={roleRef}>
                <button
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${roleLabels[currentStaffRole].color}`}
                  title="محاكاة الصلاحيات والتجربة الإدارية"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{roleLabels[currentStaffRole].titleAr}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-right">
                    <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 mb-1 border-b border-slate-800">
                      اختبار صلاحيات الأدوار (RBAC)
                    </div>
                    <div className="space-y-1">
                      {(Object.keys(roleLabels) as StaffRole[]).map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            setCurrentStaffRole(role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors ${
                            role === currentStaffRole
                              ? 'bg-amber-500/20 text-amber-300 font-bold'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <span>{roleLabels[role].titleAr}</span>
                          {role === currentStaffRole && <Check className="w-3 h-3 text-amber-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Server Sync / Status Indicator */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-sans font-medium text-emerald-400">Core API</span>
              <button 
                onClick={() => refreshFromBackend()}
                title="تحديث فوري من الخادم"
                className="hover:text-white transition-colors p-0.5 rounded"
              >
                <RefreshCw className={`w-3 h-3 ${isServerSyncing ? 'animate-spin text-amber-400' : 'text-emerald-400/80'}`} />
              </button>
            </div>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
              title="تغيير لغة العرض"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            {/* Cart Trigger (for storefront) */}
            {currentView === 'storefront' && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">السلة</span>
                {totalCartItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center text-[10px] font-black">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-1 py-2 border-t border-slate-800 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/50'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
