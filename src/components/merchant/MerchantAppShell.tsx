import React, { useState } from 'react';
import { MerchantSidebar } from './MerchantSidebar';
import { MerchantTopbar } from './MerchantTopbar';
import { WorkspaceSwitcherModal } from './WorkspaceSwitcherModal';
import { MerchantDashboardView } from './MerchantDashboardView';
import { OrdersView } from './OrdersView';
import { OrderDetailView } from './OrderDetailView';
import { ProductsView } from './ProductsView';
import { ProductEditorView } from './ProductEditorView';
import { InventoryView } from './InventoryView';
import { CustomersView } from './CustomersView';
import { LiveDesignStudio } from '../builder/LiveDesignStudio';
import { SettingsView } from './SettingsView';
import { PublishCenter } from '../dashboard/PublishCenter';
import { CloudStorageHub } from '../dashboard/CloudStorageHub';
import { useCommerce } from '../../context/CommerceContext';
import { X, ArrowRight } from 'lucide-react';

interface MerchantAppShellProps {
  onOpenCommandPalette: () => void;
}

export const MerchantAppShell: React.FC<MerchantAppShellProps> = ({ onOpenCommandPalette }) => {
  const { language } = useCommerce();
  const isAr = language === 'ar';

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState<boolean>(false);

  // Sub-navigation state for D3
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [productEditorId, setProductEditorId] = useState<string | 'new' | null>(null);

  // Reset sub-states when switching main sections
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setSelectedOrderId(null);
    setProductEditorId(null);
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] flex relative selection:bg-[#C9A45C] selection:text-[#050B14]">
      {/* Sovereign Atmospheric Ambient Gradients */}
      <div className="fixed top-0 right-1/4 w-[700px] h-[700px] bg-[#C9A45C]/5 rounded-full blur-[180px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-[#1d3557]/10 rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <MerchantSidebar
          activeSection={activeSection}
          setActiveSection={handleSectionChange}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onOpenWorkspaceSwitcher={() => setWorkspaceModalOpen(true)}
        />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-72 bg-[#07111F] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-start duration-300">
            <div className="absolute top-4 end-4">
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <MerchantSidebar
              activeSection={activeSection}
              setActiveSection={(section) => {
                handleSectionChange(section);
                setMobileDrawerOpen(false);
              }}
              collapsed={false}
              setCollapsed={() => {}}
              onOpenWorkspaceSwitcher={() => setWorkspaceModalOpen(true)}
            />
          </div>
        </div>
      )}

      {/* Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        collapsed ? 'lg:ps-20' : 'lg:ps-72'
      }`}>
        <MerchantTopbar
          onToggleMobileDrawer={() => setMobileDrawerOpen(true)}
          collapsed={collapsed}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenWorkspaceSwitcher={() => setWorkspaceModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 relative z-10 max-w-[1600px] w-full mx-auto">
          {activeSection === 'overview' && (
            <MerchantDashboardView setActiveSection={handleSectionChange} />
          )}

          {activeSection === 'orders' && (
            selectedOrderId ? (
              <OrderDetailView orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />
            ) : (
              <OrdersView onSelectOrder={(id) => setSelectedOrderId(id)} />
            )
          )}

          {activeSection === 'products' && (
            productEditorId !== null ? (
              <ProductEditorView 
                productId={productEditorId === 'new' ? undefined : productEditorId} 
                onClose={() => setProductEditorId(null)} 
              />
            ) : (
              <ProductsView onOpenProductEditor={(id) => setProductEditorId(id || 'new')} />
            )
          )}

          {activeSection === 'inventory' && (
            <InventoryView />
          )}

          {activeSection === 'customers' && (
            <CustomersView />
          )}

          {activeSection === 'settings' && (
            <SettingsView />
          )}

          {activeSection === 'publish' && (
            <PublishCenter />
          )}

          {activeSection === 'cloud_storage' && (
            <CloudStorageHub />
          )}

          {(activeSection === 'design' || activeSection === 'storefront') && (
            <LiveDesignStudio />
          )}

          {/* Fallback for other sections not yet in D3 */}
          {!['overview', 'orders', 'products', 'inventory', 'customers', 'design', 'storefront', 'settings', 'publish', 'cloud_storage'].includes(activeSection) && (
            <div className="py-12 px-6 bg-white/[0.02] border border-white/10 rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-12 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto text-2xl font-bold">
                {activeSection?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <h2 className="text-xl font-bold text-white capitalize">
                {activeSection} {isAr ? 'قيد التطوير في المراحل اللاحقة' : 'Module Roadmap'}
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'هذا القسم مخصص للعمليات المتقدمة وسيتم تفعيله بالتتابع وفق خطة التطوير.'
                  : 'This module is scheduled for upcoming implementation phases.'}
              </p>
              <button
                onClick={() => handleSectionChange('overview')}
                className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] rounded-xl text-xs font-bold transition-all shadow-lg inline-flex items-center gap-2"
              >
                <span>{isAr ? 'العودة إلى لوحة القيادة' : 'Return to Dashboard'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Workspace Switcher Modal */}
      <WorkspaceSwitcherModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
      />
    </div>
  );
};
