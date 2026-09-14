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
import { NoCodeStudioView } from '../studio/NoCodeStudioView';
import { POSView } from './POSView';
import { DebtsView } from './DebtsView';
import { ExpensesView } from './ExpensesView';
import { CategoriesView } from './CategoriesView';
import { CouponsView } from './CouponsView';
import { BankingAndPaymentsHub } from './BankingAndPaymentsHub';
import { CommercialHubView } from './CommercialHubView';
import { FeatureManagerView } from './FeatureManagerView';
import { SecurityCenterView } from './SecurityCenterView';
import { HelpSupportView } from './HelpSupportView';
import { CommerceKnowledgeAcademy } from './CommerceKnowledgeAcademy';
import { ProjectsHubView } from './ProjectsHubView';
import { PersonalProfileView } from './PersonalProfileView';
import { UsageAndBillingHub } from '../saas/UsageAndBillingHub';
import { LicensingManager } from '../dashboard/LicensingManager';
import { AbandonedCartsManager } from '../dashboard/AbandonedCartsManager';
import { NotificationsManager } from '../dashboard/NotificationsManager';
import { MobileAppManager } from '../dashboard/MobileAppManager';
import { DesktopPOSManager } from '../dashboard/DesktopPOSManager';
import { DynamicRulesManager } from '../dashboard/DynamicRulesManager';
import { EventDrivenCQRSManager } from '../dashboard/EventDrivenCQRSManager';
import { WebhooksPluginsManager } from '../dashboard/WebhooksPluginsManager';
import { BuildFarmMonitor } from '../dashboard/BuildFarmMonitor';
import { useCommerce } from '../../context/CommerceContext';
import { X, ArrowRight } from 'lucide-react';

interface MerchantAppShellProps {
  onOpenCommandPalette: () => void;
}

export const MerchantAppShell: React.FC<MerchantAppShellProps> = ({ onOpenCommandPalette }) => {
  const { language, activeTenant } = useCommerce();
  const isAr = language === 'ar';

  const [activeSection, setActiveSection] = useState<string>('overview');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState<boolean>(false);

  // Sub-navigation state for D3
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [productEditorId, setProductEditorId] = useState<string | 'new' | null>(null);
  const [settingsInitialTab, setSettingsInitialTab] = useState<string | undefined>(undefined);

  // Reset sub-states when switching main sections
  const handleSectionChange = (section: string, subParam?: string) => {
    setActiveSection(section);
    setSelectedOrderId(null);
    if (section === 'products' && subParam === 'new') {
      setProductEditorId('new');
    } else {
      setProductEditorId(null);
    }
    if (section === 'settings' && subParam) {
      setSettingsInitialTab(subParam);
    } else if (section !== 'settings') {
      setSettingsInitialTab(undefined);
    }
  };

  const KNOWN_SECTIONS = [
    'overview', 'projects', 'orders', 'products', 'inventory', 'customers',
    'design', 'theme', 'storefront', 'settings', 'features_manager', 'publish',
    'publish_center', 'cloud_storage', 'no_code_studio', 'pos', 'debts',
    'expenses', 'categories', 'coupons', 'banking_payments', 'commercial_hub',
    'security_compliance', 'security_center', 'knowledge_academy', 'help',
    'saas_billing', 'licensing', 'abandoned_carts', 'notifications',
    'mobile_app', 'desktop_pos', 'dynamic_rules', 'event_cqrs',
    'webhooks_plugins', 'build_farm', 'personal_profile', 'profile'
  ];

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

          {activeSection === 'projects' && (
            <ProjectsHubView onNavigateSection={handleSectionChange} />
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

          {activeSection === 'pos' && (
            <POSView />
          )}

          {activeSection === 'debts' && (
            <DebtsView />
          )}

          {activeSection === 'expenses' && (
            <ExpensesView />
          )}

          {activeSection === 'banking_payments' && (
            <BankingAndPaymentsHub />
          )}

          {activeSection === 'commercial_hub' && (
            <CommercialHubView />
          )}

          {activeSection === 'categories' && (
            <CategoriesView />
          )}

          {activeSection === 'coupons' && (
            <CouponsView />
          )}

          {activeSection === 'inventory' && (
            <InventoryView />
          )}

          {activeSection === 'customers' && (
            <CustomersView />
          )}

          {activeSection === 'settings' && (
            <SettingsView initialTab={settingsInitialTab} />
          )}

          {activeSection === 'features_manager' && (
            <FeatureManagerView />
          )}

          {activeSection === 'no_code_studio' && (
            <NoCodeStudioView />
          )}

          {(activeSection === 'publish' || activeSection === 'publish_center') && (
            <PublishCenter />
          )}

          {activeSection === 'cloud_storage' && (
            <CloudStorageHub />
          )}

          {(activeSection === 'design' || activeSection === 'theme') && (
            <LiveDesignStudio />
          )}

          {(activeSection === 'security_compliance' || activeSection === 'security_center') && (
            <SecurityCenterView />
          )}

          {activeSection === 'knowledge_academy' && (
            <CommerceKnowledgeAcademy />
          )}

          {activeSection === 'help' && (
            <HelpSupportView />
          )}

          {activeSection === 'saas_billing' && (
            <UsageAndBillingHub />
          )}

          {activeSection === 'licensing' && (
            <LicensingManager />
          )}

          {activeSection === 'abandoned_carts' && (
            <AbandonedCartsManager />
          )}

          {activeSection === 'notifications' && (
            <NotificationsManager />
          )}

          {activeSection === 'mobile_app' && (
            <MobileAppManager />
          )}

          {activeSection === 'desktop_pos' && (
            <DesktopPOSManager tenant={activeTenant} />
          )}

          {activeSection === 'dynamic_rules' && (
            <DynamicRulesManager tenant={activeTenant} />
          )}

          {activeSection === 'event_cqrs' && (
            <EventDrivenCQRSManager tenant={activeTenant} />
          )}

          {activeSection === 'webhooks_plugins' && (
            <WebhooksPluginsManager tenant={activeTenant} />
          )}

          {activeSection === 'build_farm' && (
            <BuildFarmMonitor />
          )}

          {(activeSection === 'personal_profile' || activeSection === 'profile') && (
            <PersonalProfileView />
          )}

          {/* Intelligent Fallback only for genuinely unrecognized routes */}
          {!KNOWN_SECTIONS.includes(activeSection) && (
            <div className="py-12 px-6 bg-[#0B1422] border border-[#233247] rounded-3xl text-center space-y-4 max-w-2xl mx-auto my-12 animate-in fade-in duration-300 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] flex items-center justify-center mx-auto text-2xl font-bold">
                {activeSection?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <h2 className="text-xl font-bold text-white capitalize">
                {activeSection}
              </h2>
              <p className="text-xs text-[#97A4B5] max-w-md mx-auto leading-relaxed">
                {isAr 
                  ? 'تم تسجيل هذه النافذة في معمارية النظام السيادي.'
                  : 'This module is registered in the sovereign platform architecture.'}
              </p>
              <button
                onClick={() => handleSectionChange('overview')}
                className="px-5 py-2.5 bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] rounded-xl text-xs font-black transition-all shadow-lg inline-flex items-center gap-2"
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
