import React from 'react';
import { ShoppingBag, Star, Plus, Eye, Check, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';

interface StorefrontProductGridProps {
  products: Product[];
  onOpenProduct: (product: Product) => void;
  overrideTenant?: import('../../types').TenantStore;
}

export const StorefrontProductGrid: React.FC<StorefrontProductGridProps> = ({ products, onOpenProduct, overrideTenant }) => {
  const { activeTenant: ctxTenant, addToCart } = useCommerce();
  const activeTenant = overrideTenant || ctxTenant;
  const theme = activeTenant.theme;
  const tokens = theme.tokens;

  const getCardRadiusClass = () => {
    if (theme.customRadiusPx !== undefined) return '';
    switch (theme.radius) {
      case 'none': return 'rounded-none';
      case 'sm': return 'rounded-lg';
      case 'md': return 'rounded-2xl';
      case 'lg': return 'rounded-3xl';
      default: return 'rounded-xl';
    }
  };

  const getCardStyle = () => {
    const base: React.CSSProperties = {
      backgroundColor: theme.cardStyle === 'glass' ? `${tokens.surface}cc` : tokens.surface,
      borderColor: tokens.border,
      borderRadius: theme.customRadiusPx !== undefined ? `${theme.customRadiusPx}px` : undefined,
    };
    if (theme.cardStyle === 'glass') {
      base.backdropFilter = 'blur(12px)';
    }
    if (theme.cardStyle === 'elevated') {
      base.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
    }
    return base;
  };

  const getAddBtnStyle = () => {
    const rad = theme.customRadiusPx !== undefined ? `${Math.max(4, theme.customRadiusPx - 4)}px` : undefined;
    if (theme.buttonStyle === 'gradient') {
      return {
        background: `linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.primaryDark} 100%)`,
        borderRadius: rad
      };
    }
    if (theme.buttonStyle === 'glow') {
      return {
        backgroundColor: tokens.primary,
        boxShadow: `0 0 15px ${tokens.primary}55`,
        borderRadius: rad
      };
    }
    if (theme.buttonStyle === 'outline') {
      return {
        backgroundColor: 'transparent',
        border: `1.5px solid ${tokens.primary}`,
        color: tokens.primary,
        borderRadius: rad
      };
    }
    return {
      backgroundColor: tokens.primary,
      borderRadius: rad
    };
  };

  if (products.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="w-16 h-16 rounded-full mx-auto bg-slate-800/10 flex items-center justify-center text-slate-400 mb-3">
          <ShoppingBag className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-base font-bold mb-1" style={{ color: tokens.text }}>لا توجد منتجات مطابقة</h3>
        <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً.</p>
      </div>
    );
  }

  return (
    <div id="products-section" className="py-10" style={{ backgroundColor: tokens.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-black" style={{ color: tokens.text }}>
              قائمة المنتجات المتاحة ({products.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              أجود الأصناف المختارة بعناية فائقة وضمان الجودة
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map(product => {
            const hasVariants = product.variants && product.variants.length > 0;
            const displayPrice = hasVariants ? product.variants![0].price : product.price;

            return (
              <div
                key={product.id}
                className={`group relative flex flex-col justify-between border overflow-hidden transition-all duration-300 hover:shadow-xl ${getCardRadiusClass()}`}
                style={getCardStyle()}
              >
                {/* Image & Badges */}
                <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1 items-end z-10">
                    {product.isBestseller && (
                      <span 
                        className="text-[10px] font-black px-2.5 py-1 rounded-full text-white shadow-md"
                        style={{ backgroundColor: tokens.primary }}
                      >
                        الأكثر طلباً ⭐
                      </span>
                    )}
                    {product.comparePrice && (
                      <span 
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow"
                        style={{ backgroundColor: tokens.danger }}
                      >
                        خصم {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                      </span>
                    )}
                  </div>

                  {/* Hover Quick View Overlay Button */}
                  <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                    <button
                      onClick={() => onOpenProduct(product)}
                      className="py-2.5 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>معاينة وتفاصيل المنتج</span>
                    </button>
                  </div>
                </div>

                {/* Content & Action */}
                <div className="p-4 flex-1 flex flex-col justify-between text-right">
                  <div>
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-[11px] font-bold text-slate-500">
                        {product.rating} ({product.reviewsCount})
                      </span>
                      {product.weight && (
                        <span className="text-[10px] text-slate-400 mr-auto font-mono">
                          {product.weight}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onOpenProduct(product)}
                      className="text-sm font-bold line-clamp-2 cursor-pointer hover:opacity-80 transition-opacity mb-1"
                      style={{ color: tokens.text }}
                    >
                      {product.name}
                    </h3>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: tokens.border }}>
                    <div>
                      <div className="text-base font-black font-mono" style={{ color: tokens.primary }}>
                        {displayPrice} {activeTenant.currencySymbol}
                      </div>
                      {product.comparePrice && (
                        <div className="text-[11px] line-through text-slate-400 font-mono">
                          {product.comparePrice} {activeTenant.currencySymbol}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (hasVariants) {
                          onOpenProduct(product);
                        } else {
                          addToCart(product);
                        }
                      }}
                      className="py-2 px-3 rounded-xl text-xs font-bold text-white flex items-center gap-1 shadow-md transition-all hover:opacity-90 active:scale-95"
                      style={getAddBtnStyle()}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{hasVariants ? 'خيارات' : 'إضافة'}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
