import React, { useState } from 'react';
import { 
  ArrowRight, 
  Package, 
  Upload, 
  DollarSign, 
  Warehouse, 
  Layers, 
  Globe, 
  Check, 
  X, 
  AlertTriangle,
  Barcode,
  Tag,
  Shield,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  Building2,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';

interface ProductEditorViewProps {
  productId?: string;
  onClose: () => void;
}

export const ProductEditorView: React.FC<ProductEditorViewProps> = ({ productId, onClose }) => {
  const { products, categories, addProduct, updateProduct, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const existingProduct = products.find(p => p.id === productId);

  // 1. Basic Info
  const [name, setName] = useState(existingProduct?.name || '');
  const [nameEn, setNameEn] = useState(existingProduct?.nameEn || '');
  const [brand, setBrand] = useState(existingProduct?.brand || '');
  const [categoryId, setCategoryId] = useState(existingProduct?.categoryId || (categories[0]?.id || 'cat-1'));
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(existingProduct?.descriptionEn || '');

  // 2. Pricing & Cost
  const [price, setPrice] = useState(existingProduct ? existingProduct.price.toString() : '');
  const [comparePrice, setComparePrice] = useState(existingProduct?.comparePrice ? existingProduct.comparePrice.toString() : '');
  const [costPrice, setCostPrice] = useState(existingProduct?.costPrice ? existingProduct.costPrice.toString() : '');
  const [wholesalePrice, setWholesalePrice] = useState(existingProduct?.wholesalePrice ? existingProduct.wholesalePrice.toString() : '');
  const [minWholesaleQty, setMinWholesaleQty] = useState(existingProduct?.minWholesaleQty ? existingProduct.minWholesaleQty.toString() : '10');

  // 3. Inventory & Specs
  const [sku, setSku] = useState(existingProduct?.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [barcode, setBarcode] = useState(existingProduct?.barcode || `628${Math.floor(100000000 + Math.random() * 900000000)}`);
  const [stock, setStock] = useState(existingProduct ? existingProduct.stock.toString() : '25');
  const [lowStockAlert, setLowStockAlert] = useState(existingProduct?.lowStockAlert ? existingProduct.lowStockAlert.toString() : '5');
  const [weight, setWeight] = useState(existingProduct?.weight || '0.5 كجم');
  const [warrantyPeriod, setWarrantyPeriod] = useState(existingProduct?.warrantyPeriod || 'سنتين ضمان الوكيل');

  // 4. Badges & Visibility
  const [isFeatured, setIsFeatured] = useState<boolean>(existingProduct?.isFeatured ?? true);
  const [isNew, setIsNew] = useState<boolean>(existingProduct?.isNew ?? true);
  const [isBestseller, setIsBestseller] = useState<boolean>(existingProduct?.isBestseller ?? false);

  // 5. Media & Gallery
  const [primaryImage, setPrimaryImage] = useState(
    existingProduct?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    existingProduct?.images && existingProduct.images.length > 1
      ? existingProduct.images.slice(1)
      : []
  );
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Computed Margin
  const numPrice = parseFloat(price) || 0;
  const numCost = parseFloat(costPrice) || 0;
  const grossProfit = numPrice > numCost ? numPrice - numCost : 0;
  const marginPercent = numPrice > 0 ? Math.round((grossProfit / numPrice) * 100) : 0;

  const handleAddGalleryImage = () => {
    if (!newGalleryUrl.trim()) return;
    setGalleryImages(prev => [...prev, newGalleryUrl.trim()]);
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = isAr ? 'اسم المنتج بالعربية مطلوب' : 'Arabic product name is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = isAr ? 'السعر يجب أن يكون أكبر من الصفر' : 'Price must be greater than zero';
    if (!sku.trim()) newErrors.sku = isAr ? 'رمز SKU مطلوب' : 'SKU is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(isAr ? 'يرجى مراجعة الخانات وتصحيح الأخطاء' : 'Please check the required fields', 'error');
      return;
    }

    const allImages = [primaryImage, ...galleryImages].filter(Boolean);

    const productPayload: Partial<Product> = {
      tenantId: activeTenant.id,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      description: description.trim() || 'منتج عالي الجودة مضمون مع خيارات دفع متعددة وسريعة.',
      descriptionEn: descriptionEn.trim() || description.trim(),
      categoryId: categoryId || 'cat-1',
      price: numPrice,
      comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
      costPrice: costPrice ? parseFloat(costPrice) : undefined,
      wholesalePrice: wholesalePrice ? parseFloat(wholesalePrice) : undefined,
      minWholesaleQty: minWholesaleQty ? parseInt(minWholesaleQty, 10) : undefined,
      sku: sku.trim(),
      barcode: barcode.trim(),
      brand: brand.trim() || activeTenant.name,
      stock: parseInt(stock, 10) || 0,
      lowStockAlert: parseInt(lowStockAlert, 10) || 5,
      weight: weight.trim(),
      warrantyPeriod: warrantyPeriod.trim(),
      isFeatured,
      isNew,
      isBestseller,
      images: allImages.length > 0 ? allImages : [primaryImage],
      rating: existingProduct?.rating || 5.0,
      reviewsCount: existingProduct?.reviewsCount || 12
    };

    if (existingProduct) {
      updateProduct(existingProduct.id, productPayload);
      showToast(isAr ? `تم تحديث بيانات "${name}" بنجاح` : 'Product updated successfully', 'success');
    } else {
      addProduct(productPayload as any);
      showToast(isAr ? `تم إضافة المنتج "${name}" بنجاح للكتالوج` : 'Product added successfully to catalog', 'success');
    }

    onClose();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#0B1422] border border-[#233247] shadow-xl">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#97A4B5] hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
          <span>{isAr ? 'الرجوع إلى الكتالوج' : 'Back to Catalog'}</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-all"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] hover:opacity-95 text-[#050B14] rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{existingProduct ? (isAr ? 'حفظ كافة التعديلات' : 'Save Changes') : (isAr ? 'حفظ ونشر المنتج' : 'Publish Product')}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Primary Details */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. Basic Info */}
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#233247]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'المعلومات الأساسية وهوية المنتج' : 'Basic Product Information'}</span>
              </h3>
              <span className="text-[10px] text-[#97A4B5] font-semibold">{isAr ? 'الحقول بعلامة * إلزامية' : '* Required'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'اسم المنتج بالعربية *' : 'Arabic Name *'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: ساعة ذهبية ملكية فاخرة' : 'e.g., Luxury Gold Watch'}
                  className={`w-full p-3 bg-[#050B14] border rounded-xl text-white focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-500' : 'border-[#233247] focus:border-[#C9A45C]'
                  }`}
                />
                {errors.name && <span className="text-rose-400 text-[11px] mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'اسم المنتج بالإنجليزية (English Name)' : 'English Name'}</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="Royal Luxury Gold Watch"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'العلامة التجارية / الماركة' : 'Brand / Manufacturer'}</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder={isAr ? 'مثال: رولكس، عود باريس، خاص' : 'Brand name'}
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'التصنيف الرئيسي' : 'Category'}</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {isAr ? cat.name : (cat.nameEn || cat.name)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'وصف المنتج بالعربية' : 'Arabic Description'}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={isAr ? 'وصف تفصيلي لمميزات المنتج ومكوناته وطريقة الاستخدام...' : 'Detailed description...'}
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'الوصف بالإنجليزية (English Description)' : 'English Description'}</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  rows={2}
                  placeholder="Detailed English description of product features..."
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>
          </div>

          {/* 2. Pricing, Cost & Wholesale */}
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#233247]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'التسعير، التكلفة، ومبيعات الجملة' : 'Pricing, Cost & Wholesale'}</span>
              </h3>
              {numPrice > 0 && numCost > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{isAr ? `هامش الربح: ${marginPercent}% (${grossProfit} ${currency})` : `Margin: ${marginPercent}%`}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? `سعر البيع (${currency}) *` : `Retail Price (${currency}) *`}</label>
                <input
                  type="number"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="250.00"
                  className={`w-full p-3 bg-[#050B14] border rounded-xl text-white font-bold text-sm focus:outline-none ${
                    errors.price ? 'border-rose-500' : 'border-[#233247] focus:border-[#C9A45C]'
                  }`}
                />
                {errors.price && <span className="text-rose-400 text-[11px] mt-1 block">{errors.price}</span>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? `السعر المشطوب (المقارن) (${currency})` : `Compare-at Price (${currency})`}</label>
                <input
                  type="number"
                  step="any"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  placeholder="320.00"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-[#97A4B5] focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? `سعر التكلفة (${currency})` : `Cost Price (${currency})`}</label>
                <input
                  type="number"
                  step="any"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  placeholder="110.00"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? `سعر الجملة (${currency})` : `Wholesale Price (${currency})`}</label>
                <input
                  type="number"
                  step="any"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  placeholder="160.00"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-[#C9A45C] font-semibold focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'الحد الأدنى لكمية الجملة' : 'Min Wholesale Quantity'}</label>
                <input
                  type="number"
                  value={minWholesaleQty}
                  onChange={(e) => setMinWholesaleQty(e.target.value)}
                  placeholder="10"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'فترة الضمان' : 'Warranty'}</label>
                <input
                  type="text"
                  value={warrantyPeriod}
                  onChange={(e) => setWarrantyPeriod(e.target.value)}
                  placeholder={isAr ? 'سنتين استبدال فوري' : '2 Years'}
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>
          </div>

          {/* 3. Inventory & Logistics */}
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#233247]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'المخزون والرموز واللوجستيات' : 'Inventory & Tracking'}</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'رمز التخزين الفريد (SKU) *' : 'SKU *'}</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="PROD-001"
                  className={`w-full p-3 bg-[#050B14] border rounded-xl text-white font-mono focus:outline-none ${
                    errors.sku ? 'border-rose-500' : 'border-[#233247] focus:border-[#C9A45C]'
                  }`}
                />
                {errors.sku && <span className="text-rose-400 text-[11px] mt-1 block">{errors.sku}</span>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'الباركود الدولي (Barcode / GTIN)' : 'Barcode'}</label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="628100000000"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white font-mono focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'وزن الشحن التقريبي' : 'Shipping Weight'}</label>
                <input
                  type="text"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0.8 كجم"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'الكمية المتوفرة حالياً' : 'Stock on Hand'}</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-white font-bold text-sm focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'تنبيه انخفاض المخزون عند' : 'Low Stock Alert Threshold'}</label>
                <input
                  type="number"
                  value={lowStockAlert}
                  onChange={(e) => setLowStockAlert(e.target.value)}
                  placeholder="5"
                  className="w-full p-3 bg-[#050B14] border border-[#233247] rounded-xl text-amber-400 font-bold focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Media, Badges & Highlights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Primary Media & Gallery */}
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#233247]">
              <Upload className="w-4 h-4 text-[#C9A45C]" />
              <span>{isAr ? 'الصورة الرئيسية والمعرض' : 'Product Media & Gallery'}</span>
            </h3>

            <div className="space-y-3">
              <div className="w-full h-48 rounded-2xl bg-[#050B14] border border-[#233247] overflow-hidden flex items-center justify-center relative group">
                {primaryImage ? (
                  <img src={primaryImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-slate-500" />
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-[11px] text-white font-bold bg-[#050B14]/80 px-3 py-1.5 rounded-lg border border-white/20">
                    {isAr ? 'الصورة الرئيسية' : 'Main Image'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[#97A4B5] text-xs mb-1 font-semibold">{isAr ? 'رابط الصورة الرئيسية (URL)' : 'Primary Image URL'}</label>
                <input
                  type="text"
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              {/* Additional Gallery Images */}
              <div className="pt-3 border-t border-[#233247] space-y-2">
                <label className="block text-[#97A4B5] text-xs font-semibold">{isAr ? 'صور إضافية للمعرض' : 'Additional Gallery'}</label>
                
                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {galleryImages.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-[#233247] group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(i)}
                          className="absolute top-1 end-1 p-1 rounded-md bg-rose-600/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder={isAr ? 'رابط صورة إضافية...' : 'New gallery image URL...'}
                    className="flex-1 p-2 bg-[#050B14] border border-[#233247] rounded-xl text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 text-[#C9A45C] border border-[#C9A45C]/30 rounded-xl text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Badges & Flags */}
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#233247]">
              <Sparkles className="w-4 h-4 text-[#C9A45C]" />
              <span>{isAr ? 'شارات الترويج والظهور' : 'Promotional Badges'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#050B14] border border-[#233247] cursor-pointer hover:border-[#C9A45C]/40 transition-colors">
                <div>
                  <div className="font-bold text-white">{isAr ? 'منتج مميز (Featured)' : 'Featured Product'}</div>
                  <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'يظهر في قسم المختارات بالصفحة الرئيسية' : 'Show in featured carousel'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A45C] accent-[#C9A45C]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#050B14] border border-[#233247] cursor-pointer hover:border-[#C9A45C]/40 transition-colors">
                <div>
                  <div className="font-bold text-white">{isAr ? 'شارة جديد (New Arrival)' : 'New Arrival'}</div>
                  <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'عرض ملصق "جديد" على بطاقة المنتج' : 'Display "New" tag on card'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A45C] accent-[#C9A45C]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-[#050B14] border border-[#233247] cursor-pointer hover:border-[#C9A45C]/40 transition-colors">
                <div>
                  <div className="font-bold text-white">{isAr ? 'الأكثر مبيعاً (Bestseller)' : 'Bestseller'}</div>
                  <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'عرض ملصق الأكثر طلباً لتحفيز الشراء' : 'Display "Bestseller" badge'}</div>
                </div>
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 rounded text-[#C9A45C] accent-[#C9A45C]"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
