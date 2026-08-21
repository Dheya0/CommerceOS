import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Check, Sparkles } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const CartDrawer: React.FC = () => {
  const { 
    activeTenant, 
    cart, 
    cartOpen, 
    setCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    coupons, 
    setCheckoutOpen,
    showToast
  } = useCommerce();

  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);

  if (!cartOpen) return null;

  const tokens = activeTenant.theme.tokens;

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.variant ? item.variant.price : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = 300;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;
  const total = Math.max(0, subtotal - discount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponCode.trim()) return;

    const trimmed = couponCode.trim().toUpperCase();
    const matched = coupons.find(c => (c.code || '').toUpperCase() === trimmed && c.isActive);
    if (!matched) {
      showToast('كود الخصم غير صالح أو منتهي الصلاحية', 'error');
      return;
    }

    if (matched.minSpend && subtotal < matched.minSpend) {
      showToast(`الحد الأدنى لتطبيق هذا الكوبون هو ${matched.minSpend} ${activeTenant.currencySymbol}`, 'warning');
      return;
    }

    let calculatedDiscount = 0;
    if (matched.type === 'percentage') {
      calculatedDiscount = (subtotal * matched.value) / 100;
    } else {
      calculatedDiscount = matched.value;
    }

    setAppliedCoupon({ code: matched.code, discountAmount: calculatedDiscount });
    showToast(`تم تطبيق كود الخصم "${matched.code}" بنجاح!`, 'success');
  };

  const handleProceedToCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 text-right">
      <div className="absolute inset-0" onClick={() => setCartOpen(false)} />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div 
          className="w-screen max-w-md shadow-2xl flex flex-col justify-between border-r animate-in slide-in-from-left duration-300"
          style={{ 
            backgroundColor: tokens.background, 
            borderColor: tokens.border,
            color: tokens.text
          }}
        >
          {/* Header */}
          <div 
            className="p-4 border-b flex items-center justify-between"
            style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: tokens.primary }}
              >
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black" style={{ color: tokens.text }}>سلة المشتريات</h3>
                <span className="text-[11px] text-slate-400 font-medium">{cart.length} منتجات في السلة</span>
              </div>
            </div>

            <button
              onClick={() => setCartOpen(false)}
              className="p-2 rounded-lg hover:bg-slate-800/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="p-3 border-b" style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}>
            <div className="flex items-center justify-between text-xs font-bold mb-1.5">
              <span>
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-600 flex items-center gap-1 font-extrabold">
                    <Sparkles className="w-3.5 h-3.5" /> تهانينا! حصلت على شحن مجاني للطلب
                  </span>
                ) : (
                  <span>
                    أضف <span className="font-mono text-amber-500">{remainingForFreeShipping} {activeTenant.currencySymbol}</span> للحصول على شحن مجاني
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-400">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${freeShippingProgress}%`,
                  backgroundColor: freeShippingProgress >= 100 ? '#10b981' : tokens.primary 
                }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800/10 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <div className="text-sm font-bold">السلة فارغة حالياً</div>
                <p className="text-xs text-slate-400 max-w-xs">
                  تصفح المنتجات في المتجر وأضف منتجاتك المفضلة لبدء تجربة الشراء.
                </p>
              </div>
            ) : (
              cart.map((item, index) => {
                const itemPrice = item.variant ? item.variant.price : item.product.price;
                return (
                  <div 
                    key={`${item.product.id}-${item.variant?.id || index}`}
                    className="p-3 rounded-xl border flex gap-3 items-center justify-between transition-all"
                    style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-14 h-14 rounded-lg object-cover border"
                        style={{ borderColor: tokens.border }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold truncate mb-0.5" style={{ color: tokens.text }}>
                          {item.product.name}
                        </h4>
                        {item.variant && (
                          <div className="text-[10px] text-slate-400 mb-1">الخيار: {item.variant.name}</div>
                        )}
                        <div className="text-xs font-black" style={{ color: tokens.primary }}>
                          {itemPrice} {activeTenant.currencySymbol}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => removeFromCart(item.product.id, item.variant?.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div 
                        className="flex items-center rounded-lg border px-1"
                        style={{ borderColor: tokens.border }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant?.id, -1)}
                          className="p-1 hover:bg-slate-800/10 text-slate-500 rounded"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant?.id, 1)}
                          className="p-1 hover:bg-slate-800/10 text-slate-500 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer: Coupon & Summary */}
          {cart.length > 0 && (
            <div 
              className="p-4 border-t space-y-3"
              style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
            >
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="كود الخصم (مثل ROYAL15)"
                    className="w-full pr-8 pl-3 py-2 text-xs rounded-xl border uppercase font-mono focus:outline-none"
                    style={{ backgroundColor: tokens.background, borderColor: tokens.border, color: tokens.text }}
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: tokens.primary }}
                >
                  تطبيق
                </button>
              </form>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-xs text-emerald-600 font-bold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> كود الخصم مفعّل ({appliedCoupon.code})
                  </span>
                  <span>- {appliedCoupon.discountAmount} {activeTenant.currencySymbol}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold text-slate-700 font-mono">{subtotal} {activeTenant.currencySymbol}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>خصم الكوبون:</span>
                    <span className="font-mono">- {discount} {activeTenant.currencySymbol}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>رسوم الشحن:</span>
                  <span className="font-bold font-mono">
                    {shipping === 0 ? <span className="text-emerald-600">مجاني</span> : `${shipping} ${activeTenant.currencySymbol}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t" style={{ borderColor: tokens.border, color: tokens.text }}>
                  <span>الإجمالي النهائي:</span>
                  <span className="text-base font-mono" style={{ color: tokens.primary }}>
                    {total} {activeTenant.currencySymbol}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 rounded-xl text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:opacity-90 transition-all"
                style={{ backgroundColor: tokens.primary }}
              >
                <span>إتمام الطلب والدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
