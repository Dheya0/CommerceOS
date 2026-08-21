import React, { useState } from 'react';
import { X, Star, ShieldCheck, Truck, RotateCcw, Check, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product, ProductVariant } from '../../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { activeTenant, addToCart, setCartOpen } = useCommerce();
  const theme = activeTenant.theme;
  const tokens = theme.tokens;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    onClose();
    setCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 text-right">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border transition-all"
        style={{ 
          backgroundColor: tokens.background, 
          borderColor: tokens.border,
          color: tokens.text
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-900/40 hover:bg-slate-900/80 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Images Gallery */}
          <div>
            <div 
              className="w-full aspect-square rounded-xl overflow-hidden mb-3 border shadow-md relative"
              style={{ borderColor: tokens.border }}
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
              {product.isBestseller && (
                <span 
                  className="absolute top-3 right-3 text-xs font-extrabold px-3 py-1 rounded-full text-white shadow-lg"
                  style={{ backgroundColor: tokens.primary }}
                >
                  الأكثر مبيعاً ⭐
                </span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'ring-2' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: selectedImage === img ? tokens.primary : tokens.border }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details & Variant Picker */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {product.rating} ({product.reviewsCount} تقييم موثق)
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: tokens.text }}>
                {product.name}
              </h2>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-extrabold" style={{ color: tokens.primary }}>
                  {activePrice} {activeTenant.currencySymbol}
                </span>
                {product.comparePrice && (
                  <span className="text-sm line-through text-slate-400 font-medium">
                    {product.comparePrice} {activeTenant.currencySymbol}
                  </span>
                )}
                {product.comparePrice && (
                  <span 
                    className="text-xs font-bold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: tokens.danger }}
                  >
                    وفر {Math.round(((product.comparePrice - activePrice) / product.comparePrice) * 100)}%
                  </span>
                )}
              </div>

              <p className="text-xs leading-relaxed opacity-85 mb-4">
                {product.description}
              </p>

              {/* Variants Selector (e.g. Honey Weight, Sizes) */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold mb-2 opacity-90">
                    الخيارات المتاحة:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'text-white shadow-md'
                            : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: selectedVariant?.id === v.id ? tokens.primary : tokens.surface,
                          borderColor: selectedVariant?.id === v.id ? tokens.primary : tokens.border,
                          color: selectedVariant?.id === v.id ? '#ffffff' : tokens.text
                        }}
                      >
                        <div className="font-bold">{v.name}</div>
                        <div className="text-[10px] opacity-90">{v.price} {activeTenant.currencySymbol}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center gap-2 text-xs mb-4">
                <span className="text-slate-400">حالة التوفر:</span>
                {activeStock > 0 ? (
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> متوفر بالمستودع ({activeStock} قطعة)
                  </span>
                ) : (
                  <span className="font-bold text-rose-500">نفذت الكمية حالياً</span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold text-slate-400">الكمية:</span>
                <div 
                  className="flex items-center rounded-xl border p-1"
                  style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}
                >
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 rounded-lg hover:bg-slate-800/20 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                    className="p-1.5 rounded-lg hover:bg-slate-800/20 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions & Guarantees */}
            <div>
              <button
                onClick={handleAdd}
                disabled={activeStock <= 0}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 text-white shadow-xl transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: tokens.primary }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة إلى السلة • {(activePrice * quantity)} {activeTenant.currencySymbol}</span>
              </button>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-center" style={{ borderColor: tokens.border }}>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>فحص مخبري معتمد</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>شحن سريع مبرد</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <RotateCcw className="w-4 h-4 text-blue-500" />
                  <span>ضمان استرجاع ذهبي</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
