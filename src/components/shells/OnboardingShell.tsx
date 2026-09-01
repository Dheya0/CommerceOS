import React from 'react';
import { Crown, Globe, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export const OnboardingShell: React.FC<OnboardingShellProps> = ({ children }) => {
  const { setCurrentView, language, setLanguage } = useCommerce();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased flex flex-col justify-between" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Onboarding Header */}
      <header className="sticky top-0 z-50 bg-[#050B14]/90 backdrop-blur-xl border-b border-[#233247] px-4 sm:px-8 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div 
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setCurrentView('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black shadow-md shadow-[#C9A45C]/15 border border-[#E0C078]/30">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-base font-black tracking-tight text-white leading-none">CommerceOS</div>
              <div className="text-[10px] text-[#C9A45C] font-bold uppercase tracking-wider mt-0.5">
                {isAr ? 'معالج إعداد المتجر السيادي' : 'Store Setup Wizard'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(isAr ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-lg bg-[#0B1422] border border-[#233247] hover:border-[#C9A45C]/40 text-xs font-bold text-[#97A4B5] hover:text-white transition-all flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-[#C9A45C]" />
              <span className="text-[11px]">{isAr ? 'English' : 'العربية'}</span>
            </button>

            <button
              onClick={() => setCurrentView('home')}
              className="px-3 py-1.5 rounded-lg bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-xs font-semibold text-[#97A4B5] hover:text-white transition-all"
            >
              {isAr ? 'إلغاء والعودة' : 'Cancel & Exit'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Onboarding Body */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Subtle Onboarding Footer */}
      <footer className="py-4 border-t border-[#233247] text-center text-xs text-[#97A4B5] bg-[#050B14]">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#C9A45C]" />
          <span>{isAr ? 'إعداد فوري مشفر بنظام العزل السيادي متعدد المتاجر' : 'Encrypted Multi-Tenant Sovereign Setup'}</span>
        </div>
      </footer>

    </div>
  );
};
