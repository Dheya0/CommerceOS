import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { StorefrontHeader } from './StorefrontHeader';
import { 
  StorefrontHero, 
  StorefrontCategories, 
  StorefrontBenefits, 
  StorefrontTestimonials, 
  StorefrontFAQ, 
  StorefrontFooter 
} from './StorefrontSections';
import { StorefrontProductGrid } from './StorefrontProductGrid';
import { ProductDetailModal } from './ProductDetailModal';
import { CartDrawer } from './CartDrawer';
import { CheckoutModal } from './CheckoutModal';
import { Product, TenantStore } from '../../types';
import { getEffectiveFontFamily } from '../../utils/fontManager';
import { LayoutDashboard, ArrowLeft, ArrowRight } from 'lucide-react';

interface StorefrontViewProps {
  overrideTenant?: TenantStore;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({ overrideTenant }) => {
  const { 
    activeTenant: contextTenant, 
    products, 
    categories, 
    previewDevice, 
    productModal, 
    setProductModal,
    setCurrentView,
    language
  } = useCommerce();

  const isAr = language === 'ar';

  const activeTenant = overrideTenant || contextTenant;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tokens = activeTenant.theme.tokens;
  const effectiveFont = getEffectiveFontFamily(activeTenant.theme);

  // Filter products by category & search query
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory ? p.categoryId === selectedCategory : true;
    const query = (searchQuery || '').toLowerCase().trim();
    if (!query) return matchesCat;
    const nameMatch = (p.name || '').toLowerCase().includes(query) || (p.nameEn || '').toLowerCase().includes(query);
    const descMatch = (p.description || '').toLowerCase().includes(query) || (p.descriptionEn || '').toLowerCase().includes(query);
    return matchesCat && (nameMatch || descMatch);
  });

  // Calculate container dimensions based on previewDevice
  const getDeviceFrameClass = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'max-w-[420px] my-6 rounded-3xl shadow-2xl border-8 border-slate-800 ring-1 ring-slate-700 overflow-hidden';
      case 'tablet':
        return 'max-w-[820px] my-6 rounded-2xl shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700 overflow-hidden';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center relative">
      {/* Top Notice Bar to Return to Dashboard */}
      <div className="relative z-20 w-full bg-[#050B14] border-b border-[#233247] px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-300">
            {isAr ? 'المعاينة الحية لمتجر العملاء' : 'Live Customer Storefront Preview'}
          </span>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C] font-semibold">
            {activeTenant.storeName}
          </span>
        </div>

        <button
          onClick={() => setCurrentView('merchant_dashboard')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#0B1422] hover:bg-[#142236] border border-[#233247] text-xs font-bold text-amber-400 hover:text-amber-300 transition-all shadow-md active:scale-95"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>{isAr ? 'العودة إلى لوحة تحكم التاجر' : 'Return to Merchant OS'}</span>
          {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Floating Always-Accessible Return Pill in Lower Corner */}
      <button
        onClick={() => setCurrentView('merchant_dashboard')}
        className="fixed bottom-6 start-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#07111F]/95 hover:bg-[#0E1E34] text-amber-400 hover:text-amber-300 font-black text-xs shadow-2xl border border-amber-500/40 backdrop-blur-xl transition-all hover:scale-105 active:scale-95 group"
        title={isAr ? 'العودة إلى لوحة تحكم التاجر' : 'Back to Merchant Dashboard'}
      >
        <LayoutDashboard className="w-4 h-4 transition-transform group-hover:rotate-6" />
        <span>{isAr ? 'لوحة تحكم التاجر' : 'Merchant OS'}</span>
      </button>

      {/* Dynamic Injected Custom CSS if user defined */}
      {activeTenant.theme.customCss && (
        <style dangerouslySetInnerHTML={{ __html: activeTenant.theme.customCss }} />
      )}
      
      {/* Viewport Frame for device simulation */}
      <div 
        className={`w-full transition-all duration-300 ${getDeviceFrameClass()}`}
        style={{ 
          backgroundColor: tokens.background,
          fontFamily: effectiveFont,
          color: tokens.text
        }}
      >
        {/* Dynamic Header */}
        <StorefrontHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          overrideTenant={activeTenant}
        />

        {/* Hero Section */}
        <StorefrontHero overrideTenant={activeTenant} />

        {/* Categories Bar */}
        {categories.length > 0 && (
          <StorefrontCategories 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            overrideTenant={activeTenant}
          />
        )}

        {/* Product Grid */}
        <StorefrontProductGrid 
          products={filteredProducts}
          onOpenProduct={(prod: Product) => setProductModal(prod)}
          overrideTenant={activeTenant}
        />

        {/* Benefits & Guarantees */}
        <StorefrontBenefits overrideTenant={activeTenant} />

        {/* Testimonials */}
        <StorefrontTestimonials overrideTenant={activeTenant} />

        {/* FAQ */}
        <StorefrontFAQ overrideTenant={activeTenant} />

        {/* Footer */}
        <StorefrontFooter overrideTenant={activeTenant} />
      </div>

      {/* Product Detail Modal */}
      {productModal && (
        <ProductDetailModal 
          product={productModal}
          onClose={() => setProductModal(null)}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Checkout Modal */}
      <CheckoutModal />

    </div>
  );
};
