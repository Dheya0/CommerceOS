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
  AlertTriangle 
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';

interface ProductEditorViewProps {
  productId?: string;
  onClose: () => void;
}

export const ProductEditorView: React.FC<ProductEditorViewProps> = ({ productId, onClose }) => {
  const { products, addProduct, updateProduct, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const existingProduct = products.find(p => p.id === productId);

  const [name, setName] = useState(existingProduct ? existingProduct.name : '');
  const [description, setDescription] = useState(existingProduct ? existingProduct.description : '');
  const [price, setPrice] = useState(existingProduct ? existingProduct.price.toString() : '');
  const [stock, setStock] = useState(existingProduct ? existingProduct.stock.toString() : '10');
  const [sku, setSku] = useState(existingProduct ? existingProduct.sku : `SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [image, setImage] = useState(existingProduct ? existingProduct.image : '');
  const [category, setCategory] = useState(existingProduct ? existingProduct.category : 'General');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = isAr ? 'اسم المنتج مطلوب' : 'Product name is required';
    if (!price || parseFloat(price) <= 0) newErrors.price = isAr ? 'السعر يجب أن يكون أكبر من الصفر' : 'Price must be greater than zero';
    if (!sku.trim()) newErrors.sku = isAr ? 'رمز SKU مطلوب' : 'SKU is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(isAr ? 'يرجى تصحيح الأخطاء قبل الحفظ' : 'Please fix the errors before saving', 'error');
      return;
    }

    const productData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      sku,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      category
    };

    if (existingProduct) {
      updateProduct(existingProduct.id, productData);
      showToast(isAr ? 'تم تحديث المنتج بنجاح' : 'Product updated successfully', 'success');
    } else {
      addProduct(productData);
      showToast(isAr ? 'تم إضافة المنتج بنجاح' : 'Product added successfully', 'success');
    }

    onClose();
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'العودة إلى قائمة المنتجات' : 'Back to Products'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] rounded-xl text-xs font-bold shadow-lg"
          >
            {existingProduct ? (isAr ? 'حفظ التعديلات' : 'Save Changes') : (isAr ? 'إنشاء المنتج' : 'Create Product')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Details (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Info */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'المعلومات الأساسية' : 'Basic Information'}</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'اسم المنتج *' : 'Product Name *'}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: ساعة ذهبية فاخرة' : 'e.g., Luxury Gold Watch'}
                  className={`w-full p-3 bg-white/[0.03] border rounded-xl text-white focus:outline-none ${
                    errors.name ? 'border-rose-500' : 'border-white/10 focus:border-[#D4AF37]'
                  }`}
                />
                {errors.name && <span className="text-rose-400 text-[11px] mt-1 block">{errors.name}</span>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'وصف المنتج' : 'Product Description'}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isAr ? 'وصف تفصيلي لمميزات ومواصفات المنتج...' : 'Detailed description of product features...'}
                  className="w-full h-32 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Pricing & SKU */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'التسعير والمخزون' : 'Pricing & Inventory'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? `السعر (${currency}) *` : `Price (${currency}) *`}</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299.00"
                  className={`w-full p-3 bg-white/[0.03] border rounded-xl text-white font-bold focus:outline-none ${
                    errors.price ? 'border-rose-500' : 'border-white/10 focus:border-[#D4AF37]'
                  }`}
                />
                {errors.price && <span className="text-rose-400 text-[11px] mt-1 block">{errors.price}</span>}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'الكمية المتوفرة' : 'Stock Quantity'}</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'رمز SKU *' : 'SKU *'}</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="PROD-001"
                  className={`w-full p-3 bg-white/[0.03] border rounded-xl text-white font-mono focus:outline-none ${
                    errors.sku ? 'border-rose-500' : 'border-white/10 focus:border-[#D4AF37]'
                  }`}
                />
                {errors.sku && <span className="text-rose-400 text-[11px] mt-1 block">{errors.sku}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Media & Category */}
        <div className="lg:col-span-4 space-y-6">
          {/* Media Section */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Upload className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'صورة المنتج' : 'Product Image'}</span>
            </h3>

            <div className="space-y-3">
              <div className="w-full h-48 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-slate-500" />
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">{isAr ? 'رابط الصورة (URL)' : 'Image URL'}</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Category Section */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'التصنيف' : 'Category'}</span>
            </h3>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 bg-[#07111F] border border-white/10 rounded-xl text-xs text-white"
            >
              <option value="General">{isAr ? 'عام (General)' : 'General'}</option>
              <option value="Watches">{isAr ? 'ساعات فاخرة (Watches)' : 'Watches'}</option>
              <option value="Perfumes">{isAr ? 'عطور وهدايا (Perfumes)' : 'Perfumes'}</option>
              <option value="Electronics">{isAr ? 'إلكترونيات (Electronics)' : 'Electronics'}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
