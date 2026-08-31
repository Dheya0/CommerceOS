import React, { useState } from 'react';
import { 
  Warehouse, 
  Search, 
  RefreshCw, 
  Plus, 
  AlertTriangle, 
  Sliders, 
  History, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';

export const InventoryView: React.FC = () => {
  const { products, updateProduct, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [adjustModalProduct, setAdjustModalProduct] = useState<Product | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('Stock Count Correction');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث بيانات المخزون بنجاح' : 'Inventory refreshed successfully', 'success');
    }, 600);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalUnits = products.reduce((acc, p) => acc + p.stock, 0);

  const handleConfirmAdjustment = () => {
    if (!adjustModalProduct) return;
    const delta = parseInt(adjustmentDelta, 10);
    if (isNaN(delta)) {
      showToast(isAr ? 'يرجى إدخال قيمة صحيحة للتعديل' : 'Please enter a valid adjustment quantity', 'error');
      return;
    }

    const newStock = Math.max(0, adjustModalProduct.stock + delta);
    updateProduct(adjustModalProduct.id, { stock: newStock });
    showToast(isAr ? `تم تحديث مخزون "${adjustModalProduct.name}" إلى ${newStock} قطعة` : `Stock updated for ${adjustModalProduct.name} to ${newStock}`, 'success');
    setAdjustModalProduct(null);
    setAdjustmentDelta('');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'إدارة المخزون والتنبيهات' : 'Inventory & Stock Control'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr ? 'متابعة كميات المخزون المتوفرة، إجراء التعديلات، ومعالجة تنبيهات النقص.' : 'Monitor stock levels, execute adjustments, and handle low stock alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold ${
              isRefreshing ? 'animate-pulse text-[#D4AF37]' : ''
            }`}
            title={isAr ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'إجمالي القطع المتوفرة' : 'Total Units On Hand'}</div>
          <div className="mt-2 text-2xl font-black text-white">{totalUnits}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'عبر جميع المنتجات' : 'Across all catalog items'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'منتجات منخفضة المخزون' : 'Low Stock Items'}</div>
          <div className="mt-2 text-2xl font-black text-amber-400">{lowStockCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'تتطلب إعادة طلب قريباً' : 'Need restock soon'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'منتجات نفذ مخزونها' : 'Out of Stock Items'}</div>
          <div className="mt-2 text-2xl font-black text-rose-400">{outOfStockCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'غير قابلة للشراء حالياً' : 'Unavailable for checkout'}</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث عن منتج أو SKU...' : 'Search product or SKU...'}
            className="w-full ps-10 pe-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold">
                <th className="pb-4 pt-4 px-4 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                <th className="pb-4 pt-4 text-start">{isAr ? 'رمز SKU' : 'SKU'}</th>
                <th className="pb-4 pt-4 text-start">{isAr ? 'المخزون المتوفر' : 'Available Stock'}</th>
                <th className="pb-4 pt-4 text-start">{isAr ? 'الحد الأدنى للتنبيه' : 'Threshold'}</th>
                <th className="pb-4 pt-4 text-start">{isAr ? 'حالة التوفر' : 'Status'}</th>
                <th className="p-4 text-end">إجراءات التعديل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="py-4 px-4 font-bold text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Warehouse className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-slate-300">{product.sku}</td>
                  <td className="py-4 font-black text-white text-sm">{product.stock}</td>
                  <td className="py-4 text-slate-400">5</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {product.stock > 5 ? (isAr ? 'متوفر' : 'In Stock') : product.stock > 0 ? (isAr ? 'منخفض' : 'Low Stock') : (isAr ? 'نفذ' : 'Out of Stock')}
                    </span>
                  </td>
                  <td className="p-4 text-end">
                    <button
                      onClick={() => setAdjustModalProduct(product)}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-[#07111F] text-[#D4AF37] transition-all font-semibold text-xs inline-flex items-center gap-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل الكمية' : 'Adjust Stock'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1626] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {isAr ? `تعديل مخزون: ${adjustModalProduct.name}` : `Adjust Stock: ${adjustModalProduct.name}`}
              </h3>
              <button onClick={() => setAdjustModalProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <span className="text-slate-400">{isAr ? 'المخزون الحالي:' : 'Current Stock:'}</span>
                <span className="font-bold text-white text-sm">{adjustModalProduct.stock}</span>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  {isAr ? 'قيمة التعديل (مثال: +10 أو -5)' : 'Adjustment Delta (e.g. +10 or -5)'}
                </label>
                <input
                  type="number"
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(e.target.value)}
                  placeholder="+10"
                  className="w-full p-3 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">{isAr ? 'سبب التعديل' : 'Adjustment Reason'}</label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full p-3 bg-[#07111F] border border-white/10 rounded-xl text-white"
                >
                  <option value="Stock Count Correction">{isAr ? 'تصحيح جرد المخزون' : 'Stock Count Correction'}</option>
                  <option value="Received Shipment">{isAr ? 'استلام شحنة جديدة' : 'Received New Shipment'}</option>
                  <option value="Damage / Loss">{isAr ? 'تلف أو فقدان' : 'Damage or Loss'}</option>
                  <option value="Return Restock">{isAr ? 'إعادة إدخال مرتجع' : 'Return Restock'}</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setAdjustModalProduct(null)}
                className="px-4 py-2 bg-white/5 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmAdjustment}
                className="px-5 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] rounded-xl text-xs font-bold"
              >
                {isAr ? 'تأكيد التعديل' : 'Confirm Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
