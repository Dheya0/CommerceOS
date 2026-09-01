import React, { useState, useEffect } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { PlatformHeader } from './components/navigation/PlatformHeader';
import { LandingPage } from './components/home/LandingPage';
import { StorefrontView } from './components/storefront/StorefrontView';
import { MerchantAppShell } from './components/merchant/MerchantAppShell';
import { StoreBuilderWizard } from './components/builder/StoreBuilderWizard';
import { LiveDesignStudio } from './components/builder/LiveDesignStudio';
import { VisualIDE } from './components/builder/VisualIDE';
import { PricingPage } from './components/saas/PricingPage';
import { PlatformAdminDashboard } from './components/admin/PlatformAdminDashboard';
import { AuthPageView } from './components/auth/AuthPageView';
import { DesignSystemPlayground } from './design-system/DesignSystemPlayground';
import { TamperAlertModal } from './components/common/TamperAlertModal';
import { AuthModal } from './components/auth/AuthModal';
import { CommandPalette } from './components/common/CommandPalette';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toasts, dismissToast } = useCommerce();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Strict Sovereign Shell Separation: Merchant Dashboard renders ONLY MerchantAppShell without any platform headers
  if (currentView === 'merchant_dashboard') {
    return (
      <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] font-sans antialiased selection:bg-[#C9A45C] selection:text-[#050B14] relative overflow-x-hidden">
        <MerchantAppShell onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
        <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
        <AuthModal />
        <TamperAlertModal />
      </div>
    );
  }

  // Auth Shell
  if (currentView === 'auth_page') {
    return (
      <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] font-sans antialiased relative overflow-x-hidden">
        <AuthPageView />
        <AuthModal />
        <TamperAlertModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      <div className="fixed top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <PlatformHeader onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <main className="relative z-10">
        {currentView === 'home' && <LandingPage />}
        {currentView === 'storefront' && <StorefrontView />}
        {currentView === 'builder_wizard' && <StoreBuilderWizard />}
        {currentView === 'live_customizer' && <LiveDesignStudio />}
        {currentView === 'visual_ide' && <VisualIDE />}
        {currentView === 'pricing' && <PricingPage />}
        {currentView === 'platform_admin' && <PlatformAdminDashboard />}
        {currentView === 'design_system' && <DesignSystemPlayground />}
      </main>

      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <AuthModal />
      <TamperAlertModal />

      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-bold pointer-events-auto animate-in slide-in-from-bottom-3 duration-200 ${
                toast.type === 'success' ? 'bg-emerald-950/95 text-emerald-200 border-emerald-800 backdrop-blur-md' :
                toast.type === 'error' ? 'bg-rose-950/95 text-rose-200 border-rose-800 backdrop-blur-md' :
                toast.type === 'warning' ? 'bg-amber-950/95 text-amber-200 border-amber-800 backdrop-blur-md' :
                'bg-slate-900/95 text-slate-200 border-slate-700 backdrop-blur-md'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button 
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <CommerceProvider>
      <AppContent />
    </CommerceProvider>
  );
};

export default App;
