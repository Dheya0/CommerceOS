import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Download, 
  Check, 
  Crown, 
  Phone, 
  ShieldCheck, 
  Heart,
  SlidersHorizontal
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface StorefrontHeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  overrideTenant?: import('../../types').TenantStore;
}

export const StorefrontHeader: React.FC<StorefrontHeaderProps> = ({ onSearchChange, searchQuery, overrideTenant }) => {
  const { 
    activeTenant: contextTenant, 
    cart, 
    setCartOpen, 
    language, 
    showToast 
  } = useCommerce();

  const activeTenant = overrideTenant || contextTenant;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  const theme = activeTenant.theme;
  const tokens = theme.tokens;
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handlePwaInstall = () => {
    setPwaInstalled(true);
    showToast(`تم تثبيت تطبيق ${activeTenant.name} بنجاح على شاشتك الرئيسية! 📱`, 'success');
  };

  return (
    <header 
      className="sticky top-16 z-40 border-b shadow-sm transition-colors duration-300"
      style={{ 
        backgroundColor: tokens.background, 
        borderColor: tokens.border 
      }}
    >
      {/* Top Announcement Bar */}
      {theme.announcementBar?.enabled !== false && (
        <div 
          className="py-1.5 px-4 text-center text-xs font-bold transition-colors"
          style={{ 
            backgroundColor: theme.announcementBar?.bgColor || tokens.primary,
            color: theme.announcementBar?.textColor || '#ffffff'
          }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] opacity-90">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>فحص مخبري شامل مع كل شحنة | استرجاع مجاني</span>
            </div>

            <div className="mx-auto sm:mx-0 text-[11px]">
              {theme.announcementBar?.text || `⚡ شحن مجاني لكافة مدن المملكة للطلبات فوق 300 ${activeTenant.currencySymbol}`}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px]">
              <span>خدمة العملاء: {activeTenant.contact.phone}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={activeTenant.logo} 
                alt={activeTenant.name} 
                className="rounded-xl object-contain border shadow-sm"
                style={{ 
                  borderColor: tokens.border,
                  height: theme.logoHeight ? `${theme.logoHeight}px` : '40px',
                  width: 'auto',
                  maxHeight: '64px'
                }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="text-right">
                <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight" style={{ color: tokens.text }}>
                  {language === 'ar' ? activeTenant.name : activeTenant.nameEn}
                </h1>
                {activeTenant.slogan && (
                  <p className="text-[11px] font-medium opacity-70 truncate max-w-[200px] sm:max-w-xs">
                    {language === 'ar' ? activeTenant.slogan : activeTenant.sloganEn}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => onSearchChange(e.target.value)}
                placeholder="ابحث عن الأعسال، البكجات، الخلطات..."
                className="w-full pr-10 pl-4 py-2 text-xs rounded-xl border focus:outline-none transition-all shadow-inner"
                style={{ 
                  backgroundColor: tokens.surface, 
                  borderColor: tokens.border, 
                  color: tokens.text 
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons: PWA Install, Search (Mobile), Cart */}
          <div className="flex items-center gap-2.5">
            
            {/* PWA Install Button */}
            <button
              onClick={handlePwaInstall}
              disabled={pwaInstalled}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                pwaInstalled 
                  ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30' 
                  : 'hover:opacity-90'
              }`}
              style={{ 
                backgroundColor: pwaInstalled ? undefined : tokens.surface, 
                borderColor: pwaInstalled ? undefined : tokens.border,
                color: pwaInstalled ? undefined : tokens.text 
              }}
              title="تثبيت التطبيق على جهازك (PWA)"
            >
              {pwaInstalled ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
              <span>{pwaInstalled ? 'التطبيق مثبت ✓' : 'تثبيت التطبيق PWA'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-extrabold text-xs shadow-lg transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: tokens.primary }}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">السلة</span>
              {totalCartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px] font-black">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden rounded-xl border"
              style={{ borderColor: tokens.border, color: tokens.text }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="py-2 pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="ابحث في المتجر..."
              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none"
              style={{ 
                backgroundColor: tokens.surface, 
                borderColor: tokens.border, 
                color: tokens.text 
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
