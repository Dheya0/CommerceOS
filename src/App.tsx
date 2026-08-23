import React from 'react';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { PlatformHeader } from './components/navigation/PlatformHeader';
import { StorefrontView } from './components/storefront/StorefrontView';
import { MerchantDashboard } from './components/dashboard/MerchantDashboard';
import { PlatformAdminDashboard } from './components/admin/PlatformAdminDashboard';
import { StoreBuilderWizard } from './components/builder/StoreBuilderWizard';
import { LiveDesignStudio } from './components/builder/LiveDesignStudio';
import { VisualIDE } from './components/builder/VisualIDE';
import { TamperAlertModal } from './components/common/TamperAlertModal';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, toasts, dismissToast } = useCommerce();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
      
      {/* Global Platform Navigation Bar */}
      <PlatformHeader />

      {/* Main Dynamic Viewport */}
      <main className="relative">
        {currentView === 'storefront' && <StorefrontView />}
        {currentView === 'merchant_dashboard' && <MerchantDashboard />}
        {currentView === 'builder_wizard' && <StoreBuilderWizard />}
        {currentView === 'live_customizer' && <LiveDesignStudio />}
        {currentView === 'visual_ide' && <VisualIDE />}
        {currentView === 'platform_admin' && <PlatformAdminDashboard />}
      </main>

      {/* Anti-Tamper & Licensing Modal */}
      <TamperAlertModal />

      {/* Toast Notification Stack */}
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
