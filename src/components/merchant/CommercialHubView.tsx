import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';
import { 
  Building2, 
  ShoppingBag, 
  Cpu, 
  Sparkles, 
  Shirt, 
  Heart, 
  Layers, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Package, 
  FileText, 
  Printer, 
  DollarSign, 
  Filter, 
  Percent, 
  Check, 
  X,
  ArrowRight,
  TrendingUp,
  Tag
} from 'lucide-react';

type SectorTab = 'wholesale_retail' | 'electronics' | 'accessories' | 'fashion' | 'beauty';

export const CommercialHubView: React.FC = () => {
  const { products, activeTenant, updateProduct, showToast, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const [activeSector, setActiveSector] = useState<SectorTab>('wholesale_retail');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);

  // Proforma / B2B Quote Modal
  const [quoteCustomerName, setQuoteCustomerName] = useState('');
  const [quoteCustomerPhone, setQuoteCustomerPhone] = useState('');
  const [quoteItems, setQuoteItems] = useState<{ product: Product; qty: number; unitPrice: number }[]>([]);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState<any | null>(null);

  // Filter products
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenQuoteBuilder = () => {
    setQuoteItems(
      products.slice(0, 3).map(p => ({
        product: p,
        qty: p.minWholesaleQty || 20,
        unitPrice: p.wholesalePrice || (p.price * 0.75)
      }))
    );
    setIsQuoteModalOpen(true);
  };

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteCustomerName) return;

    const subtotal = quoteItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    setGeneratedQuote({
      quoteNumber: `QUO-B2B-${Date.now().toString().slice(-5)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: quoteCustomerName,
      customerPhone: quoteCustomerPhone,
      items: quoteItems,
      subtotal,
      tax,
      total
    });
    showToast(isAr ? 'تم إنشاء عرض أسعار الجملة بنجاح' : 'Wholesale quote generated', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? 'محرك القطاعات التجارية التخصصية' : 'Niche Commercial Engine'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Building2 className="w-6 h-6 text-[#C9A45C]" />
            {isAr ? 'التطبيقات والحلول التجارية المتخصصة' : 'Specialized Commercial Suites'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'حلول مهيأة بالكامل لتجارة الجملة والتجزئة، محلات الإلكترونيات، الإكسسوارات، الأزياء، ومستحضرات التجميل'
              : 'Specialized enterprise modules for Wholesale/Retail, Electronics, Accessories, Fashion & Beauty'}
          </p>
        </div>

        <button
          onClick={handleOpenQuoteBuilder}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-sm shadow-lg shadow-[#C9A45C]/20 hover:scale-[1.02] transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>{isAr ? 'إنشاء عرض أسعار جملة (B2B)' : 'Create B2B Quote'}</span>
        </button>
      </div>

      {/* Sector Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveSector('wholesale_retail')}
          className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between ${
            activeSector === 'wholesale_retail'
              ? 'bg-[#C9A45C]/10 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5'
              : 'bg-[#0B1422] border-[#233247] hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{isAr ? 'محلات الجملة والتجزئة' : 'Wholesale & Retail'}</h3>
            <p className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'أسعار كميات وخصومات B2B' : 'Tiered Pricing & MOQ'}</p>
          </div>
        </button>

        <button
          onClick={() => setActiveSector('electronics')}
          className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between ${
            activeSector === 'electronics'
              ? 'bg-[#C9A45C]/10 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5'
              : 'bg-[#0B1422] border-[#233247] hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{isAr ? 'محلات إلكترونية' : 'Electronics & Tech'}</h3>
            <p className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'تتبع الضمان والـ IMEI' : 'Warranty & Serials'}</p>
          </div>
        </button>

        <button
          onClick={() => setActiveSector('accessories')}
          className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between ${
            activeSector === 'accessories'
              ? 'bg-[#C9A45C]/10 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5'
              : 'bg-[#0B1422] border-[#233247] hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{isAr ? 'محلات إكسسوارات ومجوهرات' : 'Accessories & Gifts'}</h3>
            <p className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'تغليف الهدايا والنقش' : 'Engraving & Packaging'}</p>
          </div>
        </button>

        <button
          onClick={() => setActiveSector('fashion')}
          className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between ${
            activeSector === 'fashion'
              ? 'bg-[#C9A45C]/10 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5'
              : 'bg-[#0B1422] border-[#233247] hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{isAr ? 'محلات ملابس وأزياء' : 'Fashion & Apparel'}</h3>
            <p className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'دليل المقاسات والألوان' : 'Size Guides & Colors'}</p>
          </div>
        </button>

        <button
          onClick={() => setActiveSector('beauty')}
          className={`p-4 rounded-2xl border text-start transition-all flex flex-col justify-between ${
            activeSector === 'beauty'
              ? 'bg-[#C9A45C]/10 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5'
              : 'bg-[#0B1422] border-[#233247] hover:border-white/20'
          }`}
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white">{isAr ? 'محلات تجميل وعطور' : 'Beauty & Cosmetics'}</h3>
            <p className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'المكونات ونوع البشرة' : 'Skin Types & Notes'}</p>
          </div>
        </button>
      </div>

      {/* Active Sector Content Workspace */}
      <div className="bg-[#0B1422] rounded-2xl border border-[#233247] p-6 space-y-6">
        {/* Wholesale & Retail Sector */}
        {activeSector === 'wholesale_retail' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{isAr ? 'إدارة أسعار الجملة وخصومات الكميات (B2B Bulk Pricing Matrix)' : 'Wholesale & B2B Tier Pricing'}</h3>
                <p className="text-xs text-[#97A4B5] mt-1">
                  {isAr ? 'تحديد سعر التجزئة (مفرق) مقابل سعر الجملة مع الحد الأدنى لكمية الشراء' : 'Set retail vs wholesale prices and bulk quantity tiers'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const wholesalePrice = product.wholesalePrice || Math.round(product.price * 0.75);
                const minQty = product.minWholesaleQty || 20;

                return (
                  <div key={product.id} className="bg-[#050B14] p-4 rounded-xl border border-[#233247] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-[#101B2C]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                          <p className="text-[11px] text-[#97A4B5]">رمز SKU: {product.sku}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-[#101B2C] border border-[#233247] text-xs">
                        <div>
                          <span className="text-[#97A4B5] text-[10px]">{isAr ? 'سعر التجزئة (مفرق):' : 'Retail Price:'}</span>
                          <p className="font-bold text-white">{product.price} {currencySymbol}</p>
                        </div>
                        <div>
                          <span className="text-emerald-400 text-[10px] font-semibold">{isAr ? 'سعر الجملة (B2B):' : 'Wholesale:'}</span>
                          <p className="font-bold text-emerald-400">{wholesalePrice} {currencySymbol}</p>
                        </div>
                      </div>

                      <div className="mt-2 text-xs text-[#97A4B5] flex justify-between">
                        <span>{isAr ? 'أقل كمية لطلب الجملة (MOQ):' : 'Min Order Qty:'}</span>
                        <span className="text-white font-bold">{minQty} {isAr ? 'قطعة' : 'units'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        const newWholesale = prompt(isAr ? 'أدخل سعر الجملة الجديد:' : 'Enter new wholesale price:', String(wholesalePrice));
                        if (newWholesale) {
                          updateProduct(product.id, { wholesalePrice: parseFloat(newWholesale) });
                          showToast(isAr ? 'تم تحديث سعر الجملة' : 'Wholesale price updated', 'success');
                        }
                      }}
                      className="mt-3 w-full py-1.5 rounded-lg bg-[#233247] hover:bg-[#324560] text-xs font-bold text-white transition-colors"
                    >
                      {isAr ? 'تعديل شروط الجملة' : 'Edit Wholesale Tier'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Electronics Sector */}
        {activeSector === 'electronics' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">{isAr ? 'إدارة محلات الإلكترونيات والضمان والأجهزة الذكية' : 'Electronics, Specs & Warranty'}</h3>
              <p className="text-xs text-[#97A4B5] mt-1">
                {isAr ? 'إصدار شهادات الضمان المعتمدة ومتابعة الأرقام التسلسلية (IMEI / Serial No.)' : 'Manage warranty periods, technical specifications and serial tracking'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.slice(0, 4).map(product => (
                <div key={product.id} className="bg-[#050B14] p-5 rounded-2xl border border-[#233247] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">{product.name}</h4>
                        <p className="text-xs text-[#97A4B5]">الماركة: {product.brand || 'سامسونج / أبل / سوني'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      ضمان سنتين
                    </span>
                  </div>

                  <div className="bg-[#101B2C] p-3 rounded-xl border border-[#233247] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#97A4B5]">تتبع الرقم التسلسلي (IMEI):</span>
                      <span className="text-emerald-400 font-bold">مفعل تلقائياً عند الكاشير ⚡</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#97A4B5]">شهادة الضمان للعميل:</span>
                      <span className="text-white font-medium">إلكترونية عبر SMS والباركود</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accessories Sector */}
        {activeSector === 'accessories' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">{isAr ? 'إدارة الإكسسوارات والمجوهرات وتغليف الهدايا' : 'Luxury Accessories & Gift Packaging'}</h3>
              <p className="text-xs text-[#97A4B5] mt-1">
                {isAr ? 'تخصيص خيارات النقش المخصص على القطع وتغليف الهدايا الفاخر مع بطاقات الإهداء' : 'Custom engraving options, luxury box packaging and greeting cards'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#050B14] p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">تغليف الهدايا الملكي المخملي</h4>
                <p className="text-xs text-[#97A4B5]">صندوق فاخر مع شريط حريري وكارت إهداء مطبوع بالاسم (+35 ر.س)</p>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400">متاح لجميع المنتجات</span>
              </div>

              <div className="bg-[#050B14] p-5 rounded-2xl border border-amber-500/30 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold">
                  <Edit3 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">خدمة الحفر والنقش بالليزر</h4>
                <p className="text-xs text-[#97A4B5]">نقش الأسماء والتواريخ والعبارات التذكارية على القطع (+25 ر.س)</p>
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400">متاح للمجوهرات والساعات</span>
              </div>
            </div>
          </div>
        )}

        {/* Fashion Sector */}
        {activeSector === 'fashion' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">{isAr ? 'إدارة محلات الملابس والأزياء ودليل المقاسات' : 'Fashion, Sizes & Color Swatches'}</h3>
              <p className="text-xs text-[#97A4B5] mt-1">
                {isAr ? 'مصفوفة المقاسات (S, M, L, XL, XXL) ودرجات الألوان وخامات الأقمشة مع جدول القياسات بالسنتيمتر' : 'Size matrices, color swatches, and centimeters measurement guides'}
              </p>
            </div>

            <div className="bg-[#050B14] p-5 rounded-2xl border border-[#233247] space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Shirt className="w-4 h-4 text-[#C9A45C]" />
                {isAr ? 'مصفوفة المقاسات المعيارية للأزياء' : 'Standard Apparel Size Matrix'}
              </h4>
              <div className="grid grid-cols-5 gap-3 text-center">
                {['S (سمول)', 'M (ميديوم)', 'L (لارج)', 'XL (إكس لارج)', 'XXL (2 إكس)'].map((sz, idx) => (
                  <div key={idx} className="bg-[#101B2C] p-3 rounded-xl border border-[#233247]">
                    <p className="font-bold text-white text-xs">{sz}</p>
                    <p className="text-[10px] text-emerald-400 mt-1 font-semibold">{isAr ? 'متوفر بالمخزون' : 'In Stock'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Beauty Sector */}
        {activeSector === 'beauty' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">{isAr ? 'إدارة محلات التجميل والعناية ومصممي العطور' : 'Beauty, Fragrance Notes & Ingredients'}</h3>
              <p className="text-xs text-[#97A4B5] mt-1">
                {isAr ? 'توثيق المكونات ونوتات العطر (قمة، قلب، قاعدة) وتصنيف نوع البشرة وترخيص هيئة الغذاء والدواء' : 'Fragrance pyramids, skincare compatibility and SFDA approvals'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#050B14] p-5 rounded-2xl border border-[#233247] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">الهرم العطري والمكونات النادرة</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    مرخص SFDA
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#101B2C] border border-[#233247]">
                    <span className="text-[#C9A45C] font-bold">قمة العطر (Top Notes):</span>
                    <p className="text-[#97A4B5] mt-0.5">البرغموت الإيطالي، الزعفران الكشميري الفاخر</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#101B2C] border border-[#233247]">
                    <span className="text-[#C9A45C] font-bold">قلب العطر (Heart Notes):</span>
                    <p className="text-[#97A4B5] mt-0.5">الورد الطائفي الملكي، العنبر النقي</p>
                  </div>
                  <div className="p-2 rounded-lg bg-[#101B2C] border border-[#233247]">
                    <span className="text-[#C9A45C] font-bold">قاعدة العطر (Base Notes):</span>
                    <p className="text-[#97A4B5] mt-0.5">دهن العود الكمبودي المعتق، خشب الصندل</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Proforma B2B Wholesale Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#C9A45C]" />
                {isAr ? 'إنشاء عرض أسعار جملة رسمي (B2B Proforma Invoice)' : 'B2B Wholesale Quotation'}
              </h3>
              <button onClick={() => { setIsQuoteModalOpen(false); setGeneratedQuote(null); }} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!generatedQuote ? (
              <form onSubmit={handleGenerateQuote} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                      {isAr ? 'اسم الشركة / العميل المستورد' : 'Client / Company Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={quoteCustomerName}
                      onChange={e => setQuoteCustomerName(e.target.value)}
                      placeholder={isAr ? 'شركة الأفق لتجارة التجزئة' : 'Horizon Retail Co.'}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                      {isAr ? 'رقم الهاتف / التواصل' : 'Contact Phone'}
                    </label>
                    <input
                      type="text"
                      value={quoteCustomerPhone}
                      onChange={e => setQuoteCustomerPhone(e.target.value)}
                      placeholder="+966 50 123 4567"
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-2">{isAr ? 'أصناف طلبية الجملة والكميات:' : 'Quote Items & Quantities:'}</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {quoteItems.map((item, idx) => (
                      <div key={idx} className="bg-[#050B14] p-3 rounded-xl border border-[#233247] flex items-center justify-between gap-3 text-xs">
                        <span className="font-bold text-white flex-1 truncate">{item.product.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#97A4B5]">الكمية:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={e => {
                              const newQty = parseInt(e.target.value) || 1;
                              setQuoteItems(prev => prev.map((q, i) => i === idx ? { ...q, qty: newQty } : q));
                            }}
                            className="w-16 bg-[#101B2C] border border-[#233247] rounded-lg px-2 py-1 text-center text-white font-bold"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#97A4B5]">سعر الوحدة:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.unitPrice}
                            onChange={e => {
                              const newP = parseFloat(e.target.value) || 1;
                              setQuoteItems(prev => prev.map((q, i) => i === idx ? { ...q, unitPrice: newP } : q));
                            }}
                            className="w-20 bg-[#101B2C] border border-[#233247] rounded-lg px-2 py-1 text-center text-emerald-400 font-bold"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30"
                  >
                    {isAr ? 'إصدار عرض الأسعار' : 'Generate Quotation'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="bg-white text-black p-6 rounded-xl font-sans text-xs space-y-4">
                  <div className="flex justify-between items-start border-b border-neutral-300 pb-4">
                    <div>
                      <h2 className="text-base font-black uppercase text-neutral-900">{activeTenant?.name || 'مؤسسة التجارة السيادية'}</h2>
                      <p className="text-neutral-500">عرض أسعار تجاري لطلبات الجملة B2B</p>
                      <p className="text-neutral-500">الرقم الضريبي: {activeTenant?.vatNumber || '310982345600003'}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold text-sm text-neutral-900">{generatedQuote.quoteNumber}</p>
                      <p className="text-neutral-500">{generatedQuote.date}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-bold text-neutral-800">موجّه إلى السادة: {generatedQuote.customerName}</p>
                    {generatedQuote.customerPhone && <p className="text-neutral-600">الهاتف: {generatedQuote.customerPhone}</p>}
                  </div>

                  <table className="w-full text-start border-collapse border border-neutral-300">
                    <thead>
                      <tr className="bg-neutral-100 text-neutral-800">
                        <th className="p-2 border border-neutral-300 text-start">الصنف</th>
                        <th className="p-2 border border-neutral-300 text-center">الكمية</th>
                        <th className="p-2 border border-neutral-300 text-center">سعر الوحدة</th>
                        <th className="p-2 border border-neutral-300 text-end">الإجمالي</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedQuote.items.map((it: any, i: number) => (
                        <tr key={i}>
                          <td className="p-2 border border-neutral-300">{it.product.name}</td>
                          <td className="p-2 border border-neutral-300 text-center font-bold">{it.qty}</td>
                          <td className="p-2 border border-neutral-300 text-center">{it.unitPrice} ر.س</td>
                          <td className="p-2 border border-neutral-300 text-end font-bold">{(it.qty * it.unitPrice).toLocaleString()} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-end pt-2">
                    <div className="w-56 space-y-1 text-end font-medium">
                      <div className="flex justify-between">
                        <span>المجموع الفرعي:</span>
                        <span>{generatedQuote.subtotal.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>ضريبة القيمة المضافة 15%:</span>
                        <span>{generatedQuote.tax.toLocaleString()} ر.س</span>
                      </div>
                      <div className="flex justify-between text-sm font-black border-t border-black pt-1">
                        <span>الإجمالي شامل الضريبة:</span>
                        <span>{generatedQuote.total.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#050B14] font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isAr ? 'طباعة العرض' : 'Print Quote'}</span>
                  </button>
                  <button
                    onClick={() => { setIsQuoteModalOpen(false); setGeneratedQuote(null); }}
                    className="px-4 py-2.5 rounded-xl bg-[#233247] text-white font-bold text-xs"
                  >
                    {isAr ? 'إغلاق' : 'Close'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
