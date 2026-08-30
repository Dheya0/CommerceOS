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
  RefreshCw,
  Home,
  Lock,
  User,
  LogOut,
  Trash2,
  Search
} from 'lucide-react';
import { useCommerce, AppView } from '../../context/CommerceContext';
import { StaffRole } from '../../types';

interface PlatformHeaderProps {
  onOpenCommandPalette?: () => void;
}

export const PlatformHeader: React.FC<PlatformHeaderProps> = ({ onOpenCommandPalette }) => {
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
    refreshFromBackend,
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
    resetToCleanStore
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
    { view: 'home', labelAr: 'الرئيسية (Home)', labelEn: 'Home', icon: Home },
    { view: 'storefront', labelAr: 'متجر العميل (Live)', labelEn: 'Storefront', icon: Store },
    { view: 'merchant_dashboard', labelAr: 'لوحة إدارة المتجر', labelEn: 'Dashboard', icon: LayoutDashboard },
    { view: 'visual_ide', labelAr: 'Visual IDE (المحرر المرئي)', labelEn: 'Visual IDE', icon: Layers },
    { view: 'live_customizer', labelAr: 'Design Studio', labelEn: 'Design Studio', icon: Palette },
    { view: 'builder_wizard', labelAr: 'بناء متجر جديد', labelEn: 'Store Builder', icon: Sparkles },
    { view: 'platform_admin', labelAr: 'CommerceOS HQ', labelEn: 'Platform HQ', icon: Building2 }
  ];

  const handleCleanData = () => {
    if (window.confirm(`هل ترغب بتصفير وحذف البيانات الوهمية من متجر "${activeTenant.name}" للبدء ببيانات حقيقية نظيفة؟`)) {
      resetToCleanStore(activeTenant.id);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 text-zinc-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand & Store Selector */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div 
              onClick={() => setCurrentView('home')}
              className="cursor-pointer flex items-center gap-2.5 py-1 px-2 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white font-black group-hover:scale-105 transition-transform">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-heading">
                  <span>CommerceOS</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 font-semibold border border-blue-500/30">
                    Sovereign
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">المنصة التجارية السيادية</div>
              </div>
            </div>

            {/* Tenant Switcher Dropdown */}
            <div className="relative" ref={tenantRef}>
              <button
                onClick={() => setTenantDropdownOpen(!tenantDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-blue-500/50 text-xs font-semibold text-zinc-200 transition-all shadow-sm group"
                title="تغيير المتجر النشط"
              >
                <div 
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" 
                  style={{ backgroundColor: activeTenant.theme.tokens.primary }}
                />
                <span className="max-w-[130px] truncate text-white font-medium">
                  {language === 'ar' ? activeTenant.name : activeTenant.nameEn}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />
              </button>

              {tenantDropdownOpen && (
                <div className="absolute top-full mt-2 w-72 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100 text-right">
                  <div className="text-[11px] font-bold text-zinc-400 px-2 py-1 mb-1 border-b border-zinc-800 flex items-center justify-between">
                    <span>المتاجر التجريبية والنشطة</span>
                    <span className="font-mono text-[10px] text-blue-400">{tenants.length} متاجر</span>
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto">
                    {tenants.map(t => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveTenantId(t.id);
                          setTenantDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                          t.id === activeTenant.id
                            ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                            : 'text-zinc-300 hover:bg-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span 
                            className="w-2.5 h-2.5 rounded-full shrink-0" 
                            style={{ backgroundColor: t.theme.tokens.primary }}
                          />
                          <span className="truncate">{t.name}</span>
                        </div>
                        {t.id === activeTenant.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1.5">
                    <button
                      onClick={() => {
                        openAuthModal('register');
                        setTenantDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>تدشين متجر جديد وحساب</span>
                    </button>
                    <button
                      onClick={() => {
                        handleCleanData();
                        setTenantDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 text-[11px] font-medium border border-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>تصفير وحذف البيانات الوهمية</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Command Palette Button (Ctrl + K) */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/80 border border-white/10 hover:border-blue-500/40 text-xs text-zinc-400 hover:text-zinc-200 transition-all group"
                title="البحث السريع والأوامر (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                <span className="text-xs">بحث وأوامر...</span>
                <kbd className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-400 group-hover:text-blue-300">
                  Ctrl+K
                </kbd>
              </button>
            )}
          </div>

          {/* Primary View Switcher Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setCurrentView(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.45)] font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities: Device switcher, RBAC role simulator, Auth trigger, Cart trigger */}
          <div className="flex items-center gap-2">
            
            {/* Device Switcher (Visible on Storefront & Customizer) */}
            {(currentView === 'storefront' || currentView === 'live_customizer') && (
              <div className="hidden sm:flex items-center bg-zinc-900/80 rounded-xl p-0.5 border border-white/10">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'desktop' ? 'bg-zinc-800 text-blue-400 shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
                  title="عرض الشاشة الكاملة (Desktop)"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'tablet' ? 'bg-zinc-800 text-blue-400 shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
                  title="عرض اللوحي (Tablet)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg transition-colors ${previewDevice === 'mobile' ? 'bg-zinc-800 text-blue-400 shadow' : 'text-zinc-400 hover:text-zinc-200'}`}
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
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${roleLabels[currentStaffRole].color}`}
                  title="محاكاة الصلاحيات والتجربة الإدارية"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[120px] truncate">{roleLabels[currentStaffRole].titleAr}</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-2.5 z-50 text-right">
                    <div className="text-[11px] font-bold text-zinc-400 px-2 py-1 mb-1 border-b border-zinc-800">
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                            role === currentStaffRole
                              ? 'bg-blue-600/20 text-blue-300 font-bold'
                              : 'text-zinc-300 hover:bg-zinc-900'
                          }`}
                        >
                          <span>{roleLabels[role].titleAr}</span>
                          {role === currentStaffRole && <Check className="w-3 h-3 text-blue-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Auth Status / Trigger */}
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-1.5">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 border border-white/10 text-xs text-zinc-200">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="max-w-[80px] truncate">{currentUser.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentView('auth_page')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                title="تسجيل الدخول / إنشاء حساب"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 border border-white/10 transition-colors"
              title="تغيير لغة العرض"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'EN' : 'العربية'}</span>
            </button>

            {/* Cart Trigger (for storefront) */}
            {currentView === 'storefront' && (
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-[0_0_15px_rgba(37,99,235,0.4)]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">السلة</span>
                {totalCartItems > 0 && (
                  <span className="w-5 h-5 rounded-full bg-zinc-950 text-blue-400 flex items-center justify-center text-[10px] font-black">
                    {totalCartItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile View Switcher Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-1 py-2 border-t border-zinc-800 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-zinc-400 hover:text-white bg-zinc-900/60'
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

