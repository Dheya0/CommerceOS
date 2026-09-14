import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Category } from '../../types';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Package, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Check, 
  FolderTree,
  Flame,
  Crown,
  Heart,
  Coffee,
  ShoppingBag
} from 'lucide-react';

const ICON_OPTIONS = [
  { name: 'Tag', icon: Tag },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Flame', icon: Flame },
  { name: 'Crown', icon: Crown },
  { name: 'Heart', icon: Heart },
  { name: 'Coffee', icon: Coffee },
  { name: 'ShoppingBag', icon: ShoppingBag }
];

export const CategoriesView: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory, activeTenant, language } = useCommerce();
  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [image, setImage] = useState('');
  const [icon, setIcon] = useState('Tag');

  const filteredCategories = categories.filter(cat => {
    return (
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.nameEn && cat.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setNameEn('');
    setImage('');
    setIcon('Tag');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setNameEn(cat.nameEn || '');
    setImage(cat.image || '');
    setIcon(cat.icon || 'Tag');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !activeTenant) return;

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name,
        nameEn: nameEn || undefined,
        image: image || undefined,
        icon: icon || undefined
      });
    } else {
      addCategory({
        tenantId: activeTenant.id,
        name,
        nameEn: nameEn || undefined,
        image: image || undefined,
        icon: icon || undefined,
        productCount: 0
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20">
              {isAr ? 'هيكلية وتصنيف الكتالوج' : 'Catalog Taxonomy'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <FolderTree className="w-6 h-6 text-[#C9A45C]" />
            {isAr ? 'إدارة تصنيفات وأقسام المتجر' : 'Product Categories'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'تنظيم المنتجات في تصنيفات رئيسية لتسهيل تصفح المتجر على العملاء وتحسين المبيعات'
              : 'Organize your catalog into structured categories for seamless customer browsing'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-sm shadow-lg shadow-[#C9A45C]/20 hover:shadow-[#C9A45C]/30 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إضافة تصنيف جديد' : 'New Category'}</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-[#0B1422] p-4 rounded-xl border border-[#233247] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#97A4B5] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث في التصنيفات...' : 'Search categories...'}
            className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-9 pe-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-[#97A4B5]">
          <span>{isAr ? `إجمالي التصنيفات: ${categories.length}` : `Total Categories: ${categories.length}`}</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#0B1422] rounded-2xl border border-[#233247] text-[#97A4B5]">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#C9A45C]" />
            <p className="text-base font-semibold text-white">{isAr ? 'لا توجد تصنيفات' : 'No categories found'}</p>
            <p className="text-xs text-[#97A4B5] mt-1">{isAr ? 'أضف تصنيفك الأول لتنظيم المنتجات' : 'Create a category to get started'}</p>
          </div>
        ) : (
          filteredCategories.map(cat => {
            const productCount = products.filter(p => p.categoryId === cat.id).length;
            return (
              <div 
                key={cat.id} 
                className="group relative bg-[#0B1422] rounded-2xl border border-[#233247] overflow-hidden hover:border-[#C9A45C] transition-all hover:shadow-xl hover:shadow-[#C9A45C]/5 flex flex-col justify-between"
              >
                {/* Image / Banner */}
                <div className="relative w-full h-36 bg-[#101B2C] overflow-hidden">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#101B2C] to-[#050B14]">
                      <Tag className="w-10 h-10 text-[#C9A45C]/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1422] via-transparent to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 end-3 px-2.5 py-1 rounded-full text-xs font-bold bg-[#050B14]/90 backdrop-blur-md border border-[#233247] text-[#C9A45C] flex items-center gap-1.5 shadow">
                    <Package className="w-3.5 h-3.5" />
                    <span>{productCount} {isAr ? 'منتج' : 'products'}</span>
                  </div>
                </div>

                {/* Details & Actions */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug">{cat.name}</h3>
                    {cat.nameEn && (
                      <p className="text-xs text-[#97A4B5] mt-0.5">{cat.nameEn}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-[#233247]">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-2 rounded-xl bg-[#050B14] border border-[#233247] text-[#97A4B5] hover:text-[#C9A45C] hover:border-[#C9A45C] text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(isAr ? `هل أنت متأكد من حذف تصنيف "${cat.name}"؟` : `Delete category "${cat.name}"?`)) {
                          deleteCategory(cat.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-[#050B14] border border-[#233247] text-rose-400 hover:text-rose-300 hover:border-rose-500/50 text-xs transition-colors"
                      title={isAr ? 'حذف' : 'Delete'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C9A45C]" />
                {editingCategory 
                  ? (isAr ? 'تعديل بيانات التصنيف' : 'Edit Category')
                  : (isAr ? 'إضافة تصنيف جديد' : 'New Category')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'اسم التصنيف بالعربية' : 'Category Name (Arabic)'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={isAr ? 'مثال: عسل السدر الفاخر' : 'e.g. Sidr Honey'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'الاسم بالإنجليزية (اختياري)' : 'English Name'}
                </label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={e => setNameEn(e.target.value)}
                  placeholder="e.g. Royal Sidr Honey"
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'رابط صورة التصنيف / الغلاف' : 'Category Image URL'}
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-2">
                  {isAr ? 'أيقونة التصنيف' : 'Category Icon'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map(opt => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setIcon(opt.name)}
                        className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                          icon === opt.name
                            ? 'bg-[#C9A45C] text-[#050B14] border-[#C9A45C]'
                            : 'bg-[#050B14] text-[#97A4B5] border-[#233247] hover:text-white'
                        }`}
                      >
                        <IconComp className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30"
                >
                  {isAr ? 'حفظ التصنيف' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
