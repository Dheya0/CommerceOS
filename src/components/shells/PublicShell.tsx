import React, { useState } from 'react';
import { Crown, ArrowRight, Store, Menu, X, Globe, Shield, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface PublicShellProps {
  children: React.ReactNode;
  activeNav?: 'home' | 'platform' | 'solutions' | 'pricing' | 'resources';
}

export const PublicShell: React.FC<PublicShellProps> = ({ children, activeNav = 'home' }) => {
  const {
    setCurrentView,
    isAuthenticated,
    currentUser,
    language,
    setLanguage
  } = useCommerce();

  const isAr = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased flex flex-col justify-between" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#050B14]/90 backdrop-blur-xl border-b border-[#233247] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Brand / Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black shadow-lg shadow-[#C9A45C]/15 border border-[#E0C078]/30">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white leading-none">CommerceOS</div>
              <div className="text-[10px] text-[#C9A45C] font-bold uppercase tracking-wider mt-0.5">
                {isAr ? 'منصة التجارة السيادية' : 'Sovereign Commerce'}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#97A4B5]">
            <button 
              onClick={() => setCurrentView('home')}
              className={`hover:text-white transition-colors ${activeNav === 'home' ? 'text-[#C9A45C]' : ''}`}
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <a 
              href="#platform" 
              onClick={(e) => {
                if (activeNav !== 'home') {
                  e.preventDefault();
                  setCurrentView('home');
                }
              }}
              className="hover:text-white transition-colors"
            >
              {isAr ? 'المنصة' : 'Platform'}
            </a>
            <a 
              href="#solutions" 
              onClick={(e) => {
                if (activeNav !== 'home') {
                  e.preventDefault();
                  setCurrentView('home');
                }
              }}
              className="hover:text-white transition-colors"
            >
              {isAr ? 'الحلول' : 'Solutions'}
            </a>
            <button 
              onClick={() => setCurrentView('pricing')} 
              className={`hover:text-white transition-colors ${activeNav === 'pricing' ? 'text-[#C9A45C]' : ''}`}
            >
              {isAr ? 'الأسعار والباقات' : 'Pricing & Plans'}
            </button>
            <a 
              href="#resources" 
              onClick={(e) => {
                if (activeNav !== 'home') {
                  e.preventDefault();
                  setCurrentView('home');
                }
              }}
              className="hover:text-white transition-colors"
            >
              {isAr ? 'الموارد' : 'Resources'}
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="p-2 rounded-xl bg-[#0B1422] border border-[#233247] hover:border-[#C9A45C]/40 text-xs font-bold text-[#97A4B5] hover:text-white transition-all flex items-center gap-1.5"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px]">{isAr ? 'EN' : 'العربية'}</span>
            </button>

            {isAuthenticated && currentUser ? (
              <button
                onClick={() => setCurrentView('merchant_dashboard')}
                className="px-4 py-2 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] hover:border-[#C9A45C]/40 text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <Store className="w-4 h-4 text-[#C9A45C]" />
                <span className="max-w-[140px] truncate">{currentUser.name}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('auth_page')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white transition-colors"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
                <button
                  onClick={() => setCurrentView('builder_wizard')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] text-xs font-black hover:brightness-105 shadow-md shadow-[#C9A45C]/20 transition-all flex items-center gap-1.5"
                >
                  <span>{isAr ? 'إنشاء متجر جديد' : 'Create Store'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0B1422] border border-[#233247] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-[#233247] mt-3 space-y-2">
            <button 
              onClick={() => { setCurrentView('home'); setMobileMenuOpen(false); }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-[#0B1422]"
            >
              {isAr ? 'الرئيسية' : 'Home'}
            </button>
            <button 
              onClick={() => { setCurrentView('pricing'); setMobileMenuOpen(false); }}
              className="w-full text-start px-3 py-2 rounded-lg text-xs font-bold text-slate-300 hover:bg-[#0B1422]"
            >
              {isAr ? 'الأسعار والباقات' : 'Pricing & Plans'}
            </button>
            <div className="pt-2 border-t border-[#233247] flex flex-col gap-2">
              <button
                onClick={() => { setCurrentView('auth_page'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-[#0B1422] border border-[#233247] text-xs font-bold text-white text-center"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                onClick={() => { setCurrentView('builder_wizard'); setMobileMenuOpen(false); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] text-xs font-black text-center"
              >
                {isAr ? 'إنشاء متجر جديد' : 'Create Store'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Public Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Unified Public Footer */}
      <footer className="bg-[#0B1422] border-t border-[#233247] py-12 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#97A4B5]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C9A45C] text-[#050B14] flex items-center justify-center font-bold">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white">CommerceOS</span>
              <span className="mx-2">|</span>
              <span>{isAr ? 'منصة التجارة السيادية الرائدة' : 'Enterprise Sovereign Commerce'}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentView('pricing')} className="hover:text-white transition-colors">
              {isAr ? 'الأسعار' : 'Pricing'}
            </button>
            <button onClick={() => setCurrentView('auth_page')} className="hover:text-white transition-colors">
              {isAr ? 'بوابة الدخول' : 'Sign In'}
            </button>
            <span>© {new Date().getFullYear()} CommerceOS. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</span>
          </div>
        </div>
      </footer>

    </div>
  );
};
