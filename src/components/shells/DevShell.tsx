import React from 'react';
import { Crown, Code2, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface DevShellProps {
  children: React.ReactNode;
}

export const DevShell: React.FC<DevShellProps> = ({ children }) => {
  const { setCurrentView, language } = useCommerce();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased flex flex-col justify-between" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Dev Header */}
      <header className="sticky top-0 z-50 bg-[#050B14]/95 backdrop-blur-xl border-b border-[#233247] px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#101B2C] border border-[#233247] flex items-center justify-center text-[#C9A45C]">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">CommerceOS Internal Dev Environment</span>
              <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md ms-2 font-mono">NON-PRODUCTION</span>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('merchant_dashboard')}
            className="px-3 py-1.5 rounded-lg bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-xs font-semibold text-[#97A4B5] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>{isAr ? 'العودة للتطبيق' : 'Exit to App'}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <footer className="py-3 border-t border-[#233247] text-center text-xs text-slate-500 bg-[#050B14]">
        Developer Sandbox & Playground
      </footer>
    </div>
  );
};
