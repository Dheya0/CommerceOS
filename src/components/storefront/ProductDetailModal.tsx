import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Share2, 
  MessageCircle, 
  Sparkles, 
  CreditCard, 
  Package, 
  Layers, 
  Cpu, 
  CheckCircle2, 
  Scissors, 
  HeartHandshake, 
  Award 
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product, ProductVariant } from '../../types';
import { getTenantFeatures } from '../../utils/defaultFeatures';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { activeTenant, addToCart, setCartOpen, showToast } = useCommerce();
  const theme = activeTenant.theme;
  const tokens = theme.tokens;
  const bType = activeTenant.businessType || 'honey';
  const features = getTenantFeatures(activeTenant.featuresConfig);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80';
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images && product.images.length > 0 && product.images[0] ? product.images[0] : fallbackImage
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [engravingText, setEngravingText] = useState('');
  const [giftWrap, setGiftWrap] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeStock = selectedVariant ? selectedVariant.stock : product.stock;

  // Installment calculations for Tabby & Tamara (4 installments)
  const installment4x = (activePrice / 4).toFixed(2);

  const handleAdd = () => {
    addToCart(product, selectedVariant, quantity);
    onClose();
    setCartOpen(true);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    showToast('تم نسخ رابط المنتج بنجاح!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleWhatsAppInquiry = () => {
    const text = encodeURIComponent(
      `مرحباً، أود الاستفسار بخصوص المنتج: ${product.name} (السعر: ${activePrice} ${activeTenant.currencySymbol})\nرابط المتجر: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 text-right">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border transition-all"
        style={{ 
          backgroundColor: tokens.background, 
          borderColor: tokens.border,
          color: tokens.text
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Left / Gallery Column */}
          <div className="flex flex-col">
            <div 
              className="w-full aspect-square rounded-2xl overflow-hidden mb-3 border shadow-md relative group"
              style={{ borderColor: tokens.border }}
            >
              <img 
                src={selectedImage} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              {product.isBestseller && (
                <span 
                  className="absolute top-3 right-3 text-xs font-black px-3.5 py-1.5 rounded-full text-white shadow-xl backdrop-blur-md"
                  style={{ backgroundColor: tokens.primary }}
                >
                  الأكثر مبيعاً ⭐
                </span>
              )}

              {/* Sector Specific Pill */}
              {bType === 'wholesale' && (
                <span className="absolute bottom-3 right-3 text-[10px] font-black px-3 py-1 rounded-full bg-blue-600 text-white shadow-lg">
                  📦 متاح بيع بالجملة والكرتون
                </span>
              )}
              {bType === 'electronics' && (
                <span className="absolute bottom-3 right-3 text-[10px] font-black px-3 py-1 rounded-full bg-purple-600 text-white shadow-lg">
                  ⚡ ضمان سنتين معتمد
                </span>
              )}
            </div>

            {product.images && product.images.filter(img => Boolean(img && img.trim())).length > 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                {product.images.filter(img => Boolean(img && img.trim())).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'ring-2 ring-offset-1' : 'opacity-60 hover:opacity-100'
                    }`}
                    style={{ borderColor: selectedImage === img ? tokens.primary : tokens.border }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Share & Inquire Actions */}
            {(features.whatsappDirectInquiry || features.shareProductLink) && (
              <div className="grid grid-cols-2 gap-2 mt-auto pt-2">
                {features.whatsappDirectInquiry && (
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>استفسار واتساب</span>
                  </button>
                )}
                {features.shareProductLink && (
                  <button
                    onClick={handleCopyLink}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-slate-300" />
                    <span>{copiedLink ? 'تم النسخ!' : 'مشاركة الرابط'}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right / Product Details & Sector Specific Attributes */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Reviews & SKU */}
              <div className="flex items-center justify-between gap-2 mb-2 text-amber-500">
                {features.customerReviewsSystem ? (
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {product.rating} ({product.reviewsCount} تقييم موثق)
                    </span>
                  </div>
                ) : (
                  <div />
                )}
                {product.sku && (
                  <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: tokens.text }}>
                {product.name}
              </h2>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-3xl font-black font-mono" style={{ color: tokens.primary }}>
                  {activePrice} {activeTenant.currencySymbol}
                </span>
                {product.comparePrice && (
                  <span className="text-sm line-through text-slate-400 font-medium font-mono">
                    {product.comparePrice} {activeTenant.currencySymbol}
                  </span>
                )}
                {product.comparePrice && (
                  <span 
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: tokens.danger }}
                  >
                    وفر {Math.round(((product.comparePrice - activePrice) / product.comparePrice) * 100)}%
                  </span>
                )}
              </div>

              {/* Tamara & Tabby 4x Installments Widget */}
              {features.installmentsCalculator && (
                <div 
                  className="p-3 rounded-2xl border mb-4 text-xs flex flex-col gap-2"
                  style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-slate-300">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                      أو قسّمها على 4 دفعات بدون فوائد
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#2DD4BF]/20 text-[#2DD4BF] font-black text-[10px]">
                        Tabby
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#F43F5E]/20 text-[#F43F5E] font-black text-[10px]">
                        Tamara
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>ادفع <strong>{installment4x} {activeTenant.currencySymbol}</strong> اليوم وقسّم الباقي على 3 أشهر لاحقاً متوافقة مع الشريعة.</span>
                  </div>
                </div>
              )}

              <p className="text-xs leading-relaxed text-slate-300 mb-4 opacity-90">
                {product.description}
              </p>

              {/* SECTOR SPECIFIC DETAILS */}
              {/* 1. Wholesale / B2B Pricing Tier Box */}
              {features.wholesaleB2BTiers && (bType === 'wholesale' || product.wholesalePrice) && (
                <div 
                  className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-500/5 mb-4 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between text-blue-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      جدول أسعار الجملة للشركات والكميات (B2B):
                    </span>
                    <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded-full">خصم فوري</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-blue-500/20">
                      <div className="text-slate-400 text-[10px]">1 - 5 قطع</div>
                      <div className="font-bold text-white mt-0.5">{activePrice} {activeTenant.currencySymbol}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-blue-500/20">
                      <div className="text-slate-400 text-[10px]">درزن (6-11)</div>
                      <div className="font-bold text-emerald-400 mt-0.5">{(activePrice * 0.9).toFixed(0)} {activeTenant.currencySymbol}</div>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-blue-500/20">
                      <div className="text-slate-400 text-[10px]">كرتون (12+)</div>
                      <div className="font-bold text-amber-400 mt-0.5">{(activePrice * 0.82).toFixed(0)} {activeTenant.currencySymbol}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Accessories & Jewelry: Laser Engraving & Velvet Box */}
              {bType === 'accessories' && (features.laserEngravingOption || features.luxuryGiftWrapping) && (
                <div 
                  className="p-3.5 rounded-2xl border border-amber-500/30 bg-amber-500/5 mb-4 text-xs space-y-3"
                >
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    تخصيص القطعة وتغليف الهدايا الملكي:
                  </div>
                  {features.laserEngravingOption && (
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">
                        حفر مخصص بالليزر على القطعة (مجاناً):
                      </label>
                      <input 
                        type="text"
                        placeholder="اكتب الاسم أو التاريخ المراد نقشه بالليزر..."
                        value={engravingText}
                        onChange={e => setEngravingText(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                  {features.luxuryGiftWrapping && (
                    <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                      <input 
                        type="checkbox"
                        checked={giftWrap}
                        onChange={e => setGiftWrap(e.target.checked)}
                        className="rounded border-amber-500 text-amber-500 focus:ring-0"
                      />
                      <span>إضافة علبة مخملية فاخرة وكيس إهداء ملكي (+25 {activeTenant.currencySymbol})</span>
                    </label>
                  )}
                </div>
              )}

              {/* 3. Beauty & Perfumes: Fragrance Pyramid & SFDA */}
              {bType === 'beauty' && features.fragrancePyramidSFDA && (
                <div 
                  className="p-3.5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 mb-4 text-xs space-y-2"
                >
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      مواصفات العطر وشهادة الاعتماد:
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      مرخص SFDA
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] text-slate-300">
                    <div className="p-1.5 rounded-lg bg-slate-900/60 text-center">
                      <div className="text-emerald-400 font-bold">قمة العطر</div>
                      <div className="text-slate-400 mt-0.5">برغموت، ياسمين</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900/60 text-center">
                      <div className="text-emerald-400 font-bold">قلب العطر</div>
                      <div className="text-slate-400 mt-0.5">ورد طائفي، عود</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-900/60 text-center">
                      <div className="text-emerald-400 font-bold">قاعدة العطر</div>
                      <div className="text-slate-400 mt-0.5">عنبر، مسك أبيض</div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. Fashion & Apparel: Size guide preview */}
              {bType === 'fashion' && features.fashionSizeGuide && (
                <div 
                  className="p-3 rounded-2xl border border-rose-500/30 bg-rose-500/5 mb-4 text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 text-rose-300">
                    <Scissors className="w-4 h-4" />
                    <span>دليل القياسات المعياري (سم) متوفر</span>
                  </div>
                  <span className="text-[10px] text-slate-400">خامة قطنية 100% ناعمة</span>
                </div>
              )}

              {/* Variants Selector */}
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
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedVariant?.id === v.id
                            ? 'text-white shadow-md ring-2 ring-offset-1 ring-white/20'
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

              {/* Stock Status & Quantity Controls */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">التوفر:</span>
                  {activeStock > 0 ? (
                    <span className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> متوفر ({activeStock} قطعة)
                    </span>
                  ) : (
                    <span className="font-bold text-rose-500">نفذت الكمية حالياً</span>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">الكمية:</span>
                  <div 
                    className="flex items-center rounded-xl border p-1"
                    style={{ borderColor: tokens.border, backgroundColor: tokens.surface }}
                  >
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center font-bold text-xs font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(activeStock, quantity + 1))}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Guarantees */}
            <div>
              <button
                onClick={handleAdd}
                disabled={activeStock <= 0}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-xl transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
                style={{ backgroundColor: tokens.primary }}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>إضافة إلى السلة • {(activePrice * quantity + (giftWrap ? 25 : 0))} {activeTenant.currencySymbol}</span>
              </button>

              {/* Sector Specific Guarantees */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-center" style={{ borderColor: tokens.border }}>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {bType === 'electronics' ? 'ضمان محلي سنتين' : bType === 'beauty' ? 'أصلي 100% معتمد' : 'فحص مخبري معتمد'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>
                    {bType === 'wholesale' ? 'شحن فوري بالكونتينر' : 'توصيل سريع لباب بيتك'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[10px] text-slate-400">
                  <RotateCcw className="w-4 h-4 text-blue-400" />
                  <span>استرجاع سهل ومضمون</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

