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
import { Product } from '../../types';

export const StorefrontView: React.FC = () => {
  const { 
    activeTenant, 
    products, 
    categories, 
    previewDevice, 
    productModal, 
    setProductModal 
  } = useCommerce();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tokens = activeTenant.theme.tokens;

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      
      {/* Viewport Frame for device simulation */}
      <div 
        className={`w-full transition-all duration-300 ${getDeviceFrameClass()}`}
        style={{ 
          backgroundColor: tokens.background,
          fontFamily: activeTenant.theme.fontFamily === 'tajawal' 
            ? 'Tajawal, sans-serif' 
            : activeTenant.theme.fontFamily === 'alexandria'
            ? 'Alexandria, sans-serif'
            : activeTenant.theme.fontFamily === 'playfair'
            ? 'Playfair Display, serif'
            : 'Plus Jakarta Sans, sans-serif'
        }}
      >
        {/* Dynamic Header */}
        <StorefrontHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Hero Section */}
        <StorefrontHero />

        {/* Categories Bar */}
        {categories.length > 0 && (
          <StorefrontCategories 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        )}

        {/* Product Grid */}
        <StorefrontProductGrid 
          products={filteredProducts}
          onOpenProduct={(prod: Product) => setProductModal(prod)}
        />

        {/* Benefits & Guarantees */}
        <StorefrontBenefits />

        {/* Testimonials */}
        <StorefrontTestimonials />

        {/* FAQ */}
        <StorefrontFAQ />

        {/* Footer */}
        <StorefrontFooter />
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
