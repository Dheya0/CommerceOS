import React, { useState } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  Tag, 
  Edit3, 
  Trash2, 
  Eye, 
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Product } from '../../types';

interface ProductsViewProps {
  onOpenProductEditor: (productId?: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ onOpenProductEditor }) => {
  const { products, deleteProduct, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث قائمة المنتجات بنجاح' : 'Products refreshed successfully', 'success');
    }, 600);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'in_stock' ? product.stock > 5 :
      stockFilter === 'low_stock' ? product.stock > 0 && product.stock <= 5 :
      product.stock === 0;

    return matchesSearch && matchesStock;
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف المنتج "${name}"؟` : `Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
      showToast(isAr ? 'تم حذف المنتج بنجاح' : 'Product deleted successfully', 'success');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'إدارة المنتجات' : 'Products Catalog'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr ? 'إدارة كتالوج المنتجات، الأسعار، المخزون، والخصائص.' : 'Manage product catalog, pricing, inventory variants, and attributes.'}
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

          <button
            onClick={() => onOpenProductEditor()}
            className="px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'إضافة منتج جديد' : 'Add Product'}</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث باسم المنتج أو رمز SKU...' : 'Search product name or SKU...'}
            className="w-full ps-10 pe-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap justify-between">
          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#07111F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">{isAr ? 'جميع حالات المخزون' : 'All Stock Statuses'}</option>
            <option value="in_stock">{isAr ? 'متوفر (In Stock)' : 'In Stock'}</option>
            <option value="low_stock">{isAr ? 'مخزون منخفض (Low Stock)' : 'Low Stock'}</option>
            <option value="out_of_stock">{isAr ? 'نفذ المخزون (Out of Stock)' : 'Out of Stock'}</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-[#D4AF37] text-[#07111F]' : 'text-slate-400 hover:text-white'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#D4AF37] text-[#07111F]' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Content */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl py-16 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'لا توجد منتجات مطابقة' : 'No products found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isAr ? 'لم يتم العثور على منتجات تطابق الفلاتر أو كلمات البحث.' : 'Try adjusting your search terms or stock filter.'}
          </p>
          <button
            onClick={() => onOpenProductEditor()}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'إضافة منتج الآن' : 'Add product now'}</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold">
                  <th className="pb-4 pt-4 px-4 text-start">{isAr ? 'المنتج' : 'Product'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'رمز SKU' : 'SKU'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'السعر' : 'Price'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'المخزون المتوفر' : 'Stock Available'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="p-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-white/[0.04] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#D4AF37] transition-colors">{product.name}</div>
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">{product.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-slate-300">{product.sku}</td>
                    <td className="py-4 font-bold text-[#D4AF37]">
                      {product.price.toLocaleString()} {currency}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        product.stock > 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        product.stock > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {product.stock} {isAr ? 'قطعة' : 'units'}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold uppercase">
                        {isAr ? 'نشط' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenProductEditor(product.id)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all">
              <div>
                <div className="w-full h-40 rounded-2xl bg-white/5 border border-white/10 overflow-hidden mb-4 relative flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Package className="w-8 h-8 text-slate-600" />
                  )}
                  <span className={`absolute top-3 end-3 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    product.stock > 0 ? 'bg-emerald-500/90 text-[#07111F]' : 'bg-rose-500/90 text-white'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate">{product.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{product.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500">السعر</div>
                  <div className="text-sm font-black text-[#D4AF37]">{product.price.toLocaleString()} {currency}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenProductEditor(product.id)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4 text-[#D4AF37]" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
