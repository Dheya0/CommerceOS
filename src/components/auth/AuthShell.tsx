import React from 'react';
import { Crown, Globe, Shield, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface AuthShellProps {
  children: React.ReactNode;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
}

export const AuthShell: React.FC<AuthShellProps> = ({
  children,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
}) => {
  const { language, setLanguage } = useCommerce();
  const isAr = language === 'ar';

  return (
    <div 
      className="min-h-screen bg-[#050B14] text-[#F4F6F8] flex flex-col justify-between relative overflow-hidden font-sans select-none"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Ambient Glows & Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#23324715_1px,transparent_1px),linear-gradient(to_bottom,#23324715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="absolute top-0 start-1/4 w-[600px] h-[600px] bg-[#C9A45C]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black shadow-lg shadow-[#C9A45C]/15 border border-[#E0C078]/30">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">CommerceOS</span>
            <span className="text-[11px] font-medium text-[#C9A45C] tracking-wider uppercase block">
              {isAr ? 'منصة التجارة السيادية' : 'Sovereign Commerce Platform'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0B1422] border border-[#233247] hover:border-[#C9A45C]/50 text-xs font-semibold text-[#97A4B5] hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-[#C9A45C]/20"
            title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#C9A45C]" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>
        </div>
      </header>

      {/* Main Split Content Area */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Brand / Visual Area (Desktop Only) */}
        <div className="hidden lg:col-span-6 lg:flex flex-col justify-center space-y-8 pe-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1422] border border-[#233247] text-[#C9A45C] text-xs font-semibold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'بيئة تجارية سيادية مؤمنة' : 'Sovereign Secured Enterprise'}</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isAr ? titleAr : titleEn}
            </h1>
            <p className="text-base text-[#97A4B5] leading-relaxed max-w-lg">
              {isAr ? subtitleAr : subtitleEn}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#233247]">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Shield className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'أمان متقدم' : 'Advanced Security'}</span>
              </div>
              <p className="text-xs text-[#97A4B5]">
                {isAr ? 'تشفير شامل ومعايير حماية عمالقة الشركات.' : 'Comprehensive encryption & enterprise standards.'}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Crown className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'استقلالية مطلقة' : 'Absolute Sovereignty'}</span>
              </div>
              <p className="text-xs text-[#97A4B5]">
                {isAr ? 'تحكم كامل ببياناتك ومساحة عملك التجاري.' : 'Total control over your data & workspace.'}
              </p>
            </div>
          </div>
        </div>

        {/* Auth Panel (Glass Card) */}
        <div className="w-full lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[460px] bg-[#0B1422]/90 backdrop-blur-xl border border-[#233247] rounded-2xl p-8 shadow-2xl shadow-black/60 relative">
            
            {/* Mobile Header indicator */}
            <div className="lg:hidden mb-6 pb-6 border-b border-[#233247] text-center">
              <h2 className="text-2xl font-bold text-white mb-1">
                {isAr ? titleAr : titleEn}
              </h2>
              <p className="text-xs text-[#97A4B5]">
                {isAr ? subtitleAr : subtitleEn}
              </p>
            </div>

            {children}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 border-t border-[#233247] flex flex-col sm:flex-row items-center justify-between text-xs text-[#97A4B5] gap-4 bg-[#050B14]">
        <div>
          © {new Date().getFullYear()} CommerceOS. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
        </div>
        <div className="flex items-center gap-6">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </a>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">
            {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
          </a>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isAr ? 'النظام مؤمن' : 'Secure Access'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
