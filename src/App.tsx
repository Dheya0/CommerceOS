import React, { useState, useEffect } from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
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
import { PublicShell } from './components/shells/PublicShell';
import { OnboardingShell } from './components/shells/OnboardingShell';
import { StorefrontShell } from './components/shells/StorefrontShell';
import { PlatformShell } from './components/shells/PlatformShell';
import { DevShell } from './components/shells/DevShell';
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

  const renderCurrentShell = () => {
    switch (currentView) {
      case 'merchant_dashboard':
        return <MerchantAppShell onOpenCommandPalette={() => setCommandPaletteOpen(true)} />;

      case 'auth_page':
        return <AuthPageView />;

      case 'home':
        return (
          <PublicShell activeNav="home">
            <LandingPage />
          </PublicShell>
        );

      case 'pricing':
        return (
          <PublicShell activeNav="pricing">
            <PricingPage />
          </PublicShell>
        );

      case 'builder_wizard':
        return (
          <OnboardingShell>
            <StoreBuilderWizard />
          </OnboardingShell>
        );

      case 'storefront':
        return (
          <StorefrontShell>
            <StorefrontView />
          </StorefrontShell>
        );

      case 'platform_admin':
        return (
          <PlatformShell>
            <PlatformAdminDashboard />
          </PlatformShell>
        );

      case 'design_system':
        return (
          <DevShell>
            <DesignSystemPlayground />
          </DevShell>
        );

      case 'live_customizer':
        return (
          <DevShell>
            <LiveDesignStudio />
          </DevShell>
        );

      case 'visual_ide':
        return (
          <DevShell>
            <VisualIDE />
          </DevShell>
        );

      default:
        return (
          <PublicShell activeNav="home">
            <LandingPage />
          </PublicShell>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] font-sans antialiased selection:bg-[#C9A45C] selection:text-[#050B14] relative overflow-x-hidden">
      
      {/* Shell Renderer */}
      {renderCurrentShell()}

      {/* Global Modals & Palettes */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      <AuthModal />
      <TamperAlertModal />

      {/* Sovereign Toast Notifications */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center justify-between gap-3 text-xs font-bold pointer-events-auto animate-in slide-in-from-bottom-3 duration-200 ${
                toast.type === 'success' ? 'bg-[#0B1422]/95 text-emerald-300 border-emerald-500/30 backdrop-blur-md' :
                toast.type === 'error' ? 'bg-[#0B1422]/95 text-rose-300 border-rose-500/30 backdrop-blur-md' :
                toast.type === 'warning' ? 'bg-[#0B1422]/95 text-amber-300 border-amber-500/30 backdrop-blur-md' :
                'bg-[#0B1422]/95 text-[#F4F6F8] border-[#233247] backdrop-blur-md'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-[#C9A45C] shrink-0" />}
                <span>{toast.message}</span>
              </div>
              <button 
                onClick={() => dismissToast(toast.id)}
                className="p-1 rounded-md hover:bg-white/10 text-[#97A4B5] hover:text-white transition-colors"
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
