import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  HelpCircle, 
  Globe, 
  User, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Settings, 
  Sparkles,
  Store,
  RefreshCw
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { NotificationPanel } from './NotificationPanel';

interface MerchantTopbarProps {
  onToggleMobileDrawer: () => void;
  collapsed: boolean;
  onOpenCommandPalette: () => void;
  onOpenWorkspaceSwitcher: () => void;
}

export const MerchantTopbar: React.FC<MerchantTopbarProps> = ({
  onToggleMobileDrawer,
  collapsed,
  onOpenCommandPalette,
  onOpenWorkspaceSwitcher
}) => {
  const { 
    activeTenant, 
    currentUser, 
    logout, 
    language, 
    setLanguage, 
    setCurrentView,
    currentStaffRole,
    showToast 
  } = useCommerce();

  const isAr = language === 'ar';
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث بيانات المتجر بنجاح' : 'Store data refreshed successfully', 'success');
    }, 800);
  };

  return (
    <header className={`sticky top-0 z-30 h-16 bg-[#050B14]/80 backdrop-blur-xl border-b border-[#233247] px-4 sm:px-6 flex items-center justify-between transition-all duration-300 ${
      collapsed ? 'lg:ps-24' : 'lg:ps-80'
    }`}>
      {/* Left side: Mobile Toggle & Workspace Quick Status */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="p-2 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] text-[#97A4B5] hover:text-[#F4F6F8] border border-[#233247] transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1422] border border-[#233247]">
          <Store className="w-4 h-4 text-[#C9A45C]" />
          <span className="text-xs font-bold text-[#F4F6F8]">{activeTenant.storeName}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
            activeTenant.status === 'live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
            'bg-amber-500/10 text-amber-400 border border-amber-500/30'
          }`}>
            {activeTenant.status}
          </span>
        </div>
      </div>

      {/* Center: Global Command Search Trigger */}
      <div className="flex-1 max-w-md mx-4 hidden md:block">
        <button
          onClick={onOpenCommandPalette}
          className="w-full px-4 py-2 bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] rounded-xl text-xs text-[#97A4B5] hover:text-[#F4F6F8] transition-all flex items-center justify-between group shadow-inner"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-[#667386] group-hover:text-[#C9A45C] transition-colors" />
            <span>{isAr ? 'البحث عن منتجات، طلبات، عملاء...' : 'Search orders, products, customers...'}</span>
          </div>
          <kbd className="px-2 py-0.5 rounded bg-[#101B2C] text-[10px] font-mono text-[#97A4B5] border border-[#233247]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right side: Actions, Notifications, Language, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Manual Refresh Button */}
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-[#97A4B5] hover:text-[#F4F6F8] transition-all ${
            isRefreshing ? 'animate-spin text-[#C9A45C]' : ''
          }`}
          title={isAr ? 'تحديث البيانات' : 'Refresh Data'}
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(isAr ? 'en' : 'ar')}
          className="px-2.5 py-1.5 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-xs font-bold text-[#F4F6F8] transition-all flex items-center gap-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-[#C9A45C]" />
          <span>{isAr ? 'English' : 'العربية'}</span>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-[#97A4B5] hover:text-[#F4F6F8] transition-all relative"
            title={isAr ? 'الإشعارات' : 'Notifications'}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 end-1.5 w-2 h-2 rounded-full bg-[#C9A45C] ring-4 ring-[#050B14]" />
          </button>
          
          <NotificationPanel 
            isOpen={notificationsOpen} 
            onClose={() => setNotificationsOpen(false)} 
          />
        </div>

        {/* User Profile & Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pe-3 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-bold text-xs flex items-center justify-center shadow">
              {currentUser?.name?.charAt(0) || 'M'}
            </div>
            <div className="hidden xl:block text-start">
              <div className="text-xs font-bold text-[#F4F6F8] leading-tight">
                {currentUser?.name || (isAr ? 'التاجر المسؤول' : 'Merchant Owner')}
              </div>
              <div className="text-[10px] text-[#C9A45C] font-medium capitalize">
                {currentStaffRole}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#97A4B5]" />
          </button>

          {userMenuOpen && (
            <div className="absolute end-0 top-12 w-64 bg-[#0B1422] border border-[#233247] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-[#233247] bg-[#101B2C]/50">
                <div className="text-xs font-bold text-[#F4F6F8]">{currentUser?.name || 'Merchant Owner'}</div>
                <div className="text-[11px] text-[#97A4B5] truncate mt-0.5">{currentUser?.email || 'merchant@store.com'}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] text-[10px] font-bold capitalize">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Role: {currentStaffRole}</span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5 text-xs">
                <button
                  onClick={() => { setUserMenuOpen(false); onOpenWorkspaceSwitcher(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-[#101B2C] transition-colors"
                >
                  <Store className="w-4 h-4 text-[#C9A45C]" />
                  <span>{isAr ? 'تبديل المتجر' : 'Switch Workspace'}</span>
                </button>
                <button
                  onClick={() => { setUserMenuOpen(false); setCurrentView('merchant_dashboard'); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#97A4B5] hover:text-[#F4F6F8] hover:bg-[#101B2C] transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#C9A45C]" />
                  <span>{isAr ? 'إعدادات الحساب' : 'Account Settings'}</span>
                </button>
              </div>

              <div className="p-1.5 border-t border-white/10">
                <button
                  onClick={() => { setUserMenuOpen(false); logout(); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Sign out'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
