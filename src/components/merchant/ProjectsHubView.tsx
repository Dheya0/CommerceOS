import React, { useState, useMemo } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Sparkles, 
  Store, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Check, 
  ShieldCheck, 
  Globe, 
  Sliders, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Download, 
  Package, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  Palette,
  Eye,
  Settings,
  Coffee,
  ShoppingBag,
  Zap,
  Building2,
  Laptop
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { TenantStore, Product, Category } from '../../types';

interface ProjectTemplate {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  icon: any;
  color: string;
  descriptionAr: string;
  defaultProductsCount: number;
}

const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'general_store',
    nameAr: 'متجر تجزئة متكامل',
    nameEn: 'General E-Commerce',
    category: 'retail',
    icon: ShoppingBag,
    color: '#C9A45C',
    descriptionAr: 'متجر سلع متنوع مع تصنيفات جاهزة، سلة مشتريات، وبوابات دفع متكاملة.',
    defaultProductsCount: 8
  },
  {
    id: 'fashion_boutique',
    nameAr: 'بوتيك أزياء وموضة فاخرة',
    nameEn: 'Luxury Fashion Boutique',
    category: 'fashion',
    icon: Sparkles,
    color: '#D4AF37',
    descriptionAr: 'تصميم أنيق مع خيارات المقاسات والألوان وفلترة المجموعات الراقية.',
    defaultProductsCount: 6
  },
  {
    id: 'restaurant_cafe',
    nameAr: 'مطعم ومقهى عصري',
    nameEn: 'Restaurant & Cafe',
    category: 'food',
    icon: Coffee,
    color: '#F59E0B',
    descriptionAr: 'قائمة طعام تفاعلية مع خيارات الإضافات والتوصيل الفوري أو الاستلام.',
    defaultProductsCount: 10
  },
  {
    id: 'tech_electronics',
    nameAr: 'إلكترونيات وأجهزة ذكية',
    nameEn: 'Electronics & Smart Tech',
    category: 'tech',
    icon: Laptop,
    color: '#3B82F6',
    descriptionAr: 'عرض تفصيلي للمواصفات الفنية، الضمان، ومقارنة المنتجات.',
    defaultProductsCount: 5
  },
  {
    id: 'wholesale_b2b',
    nameAr: 'منصة تجارة جملة (B2B)',
    nameEn: 'Wholesale & B2B Hub',
    category: 'wholesale',
    icon: Building2,
    color: '#10B981',
    descriptionAr: 'تسعير كميات الجملة، حسابات الشركات، وطلبات عروض الأسعار.',
    defaultProductsCount: 8
  },
  {
    id: 'digital_services',
    nameAr: 'خدمات ومنتجات رقمية',
    nameEn: 'Digital Products & Services',
    category: 'services',
    icon: Zap,
    color: '#8B5CF6',
    descriptionAr: 'تنزيل فوري للملفات الرقمية، حجوزات، واشتراكات دورية.',
    defaultProductsCount: 4
  }
];

export const ProjectsHubView: React.FC<{ onNavigateSection?: (section: string) => void }> = ({ onNavigateSection }) => {
  const { 
    tenants, 
    activeTenantId, 
    setActiveTenantId, 
    activeTenant, 
    createTenant, 
    cloneTenant, 
    deleteTenant, 
    updateTenant,
    products, 
    setCurrentView, 
    language, 
    showToast 
  } = useCommerce();

  const isAr = language === 'ar';

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'trial'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'products'>('newest');

  // New Project Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('general_store');
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectSlug, setNewProjectSlug] = useState('');
  const [newProjectCurrency, setNewProjectCurrency] = useState('SAR');
  const [newProjectColor, setNewProjectColor] = useState('#C9A45C');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirm Modal
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);

  // Compute products count per tenant
  const productsCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    products.forEach(p => {
      map[p.tenantId] = (map[p.tenantId] || 0) + 1;
    });
    return map;
  }, [products]);

  // Filtered & Sorted Tenants
  const filteredTenants = useMemo(() => {
    return tenants
      .filter(t => {
        const matchesSearch = 
          (t.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.nameEn || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.slug || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.domain || '').toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'products') {
          return (productsCountMap[b.id] || 0) - (productsCountMap[a.id] || 0);
        }
        // newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [tenants, searchQuery, statusFilter, sortBy, productsCountMap]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = tenants.length;
    const active = tenants.filter(t => t.status === 'active').length;
    const totalProducts = products.length;
    return { total, active, totalProducts };
  }, [tenants, products]);

  // Handle Switch Workspace
  const handleSwitchWorkspace = (tenant: TenantStore) => {
    setActiveTenantId(tenant.id);
    showToast(isAr ? `تم التبديل إلى مشروع: ${tenant.name}` : `Switched to project: ${tenant.name}`, 'success');
  };

  // Handle Clone
  const handleCloneProject = async (tenantId: string) => {
    if (cloneTenant) {
      await cloneTenant(tenantId);
    } else {
      showToast('ميزة الاستنساخ قيد التنشيط', 'info');
    }
  };

  // Handle Delete
  const confirmDelete = async () => {
    if (!deletingTenantId) return;
    if (tenants.length <= 1) {
      showToast(isAr ? 'لا يمكن حذف المشروع الوحيد المتبقي' : 'Cannot delete the last remaining project', 'error');
      setDeletingTenantId(null);
      return;
    }
    await deleteTenant(deletingTenantId);
    setDeletingTenantId(null);
  };

  // Quick Status Toggle
  const handleToggleStatus = (tenant: TenantStore, newStatus: 'active' | 'suspended' | 'trial') => {
    updateTenant(tenant.id, { status: newStatus });
    showToast(isAr ? `تم تحديث حالة المشروع إلى: ${newStatus}` : `Status updated to: ${newStatus}`, 'success');
  };

  // Create Project from Template
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      showToast(isAr ? 'يرجى كتابة اسم المشروع' : 'Please enter project name', 'error');
      return;
    }

    setIsSubmitting(true);
    const template = PROJECT_TEMPLATES.find(t => t.id === selectedTemplate) || PROJECT_TEMPLATES[0];
    const generatedSlug = (newProjectSlug.trim() || newProjectName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    const tenantId = `tenant-${Date.now()}`;

    // Sample initial products based on archetype
    const starterProducts: Product[] = Array.from({ length: 4 }).map((_, idx) => ({
      id: `prod-${Date.now()}-${idx + 1}`,
      tenantId,
      name: isAr ? `منتج تجريبي ${idx + 1} - ${template.nameAr}` : `Starter Product ${idx + 1}`,
      nameEn: `Starter Product ${idx + 1}`,
      description: isAr ? 'منتج افتراضي تم توليده تلقائياً لبدء مشروعك.' : 'Starter default sample product.',
      price: 99 + idx * 45,
      costPrice: 50,
      stock: 50,
      lowStockAlert: 5,
      categoryId: `cat-${tenantId}-1`,
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
      ],
      isFeatured: idx === 0,
      sku: `SKU-${idx + 101}`,
      barcode: `6281000${idx + 101}`,
      rating: 4.8,
      reviewsCount: 12,
      tags: ['جديد', template.category]
    }));

    const starterCategories: Category[] = [
      {
        id: `cat-${tenantId}-1`,
        tenantId,
        name: isAr ? 'أحدث المنتجات' : 'New Arrivals',
        nameEn: 'New Arrivals',
        icon: 'Sparkles',
        productCount: 4
      },
      {
        id: `cat-${tenantId}-2`,
        tenantId,
        name: isAr ? 'الأكثر طلباً' : 'Best Sellers',
        nameEn: 'Best Sellers',
        icon: 'Flame',
        productCount: 0
      }
    ];

    try {
      await createTenant(
        {
          id: tenantId,
          name: newProjectName,
          nameEn: newProjectName,
          slug: generatedSlug,
          description: template.descriptionAr,
          businessType: template.category as any,
          currency: newProjectCurrency,
          currencySymbol: newProjectCurrency === 'SAR' ? 'ر.س' : newProjectCurrency === 'AED' ? 'د.إ' : '$',
          domain: `${generatedSlug}.commerceos.app`,
          status: 'active',
          theme: {
            style: 'modern',
            layout: 'modern',
            fontFamily: 'tajawal',
            radius: 'md',
            shadow: 'soft',
            headerStyle: 'solid',
            cardStyle: 'bordered',
            darkMode: false
          }
        },
        starterProducts,
        starterCategories
      );

      setIsCreateModalOpen(false);
      setNewProjectName('');
      setNewProjectSlug('');
      showToast(isAr ? `تم إنشاء وتفعيل مشروع "${newProjectName}" بنجاح!` : `Project "${newProjectName}" created successfully!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'فشل إنشاء المشروع', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Banner & Highlights */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0B1626] via-[#0E1C30] to-[#0B1626] border border-[#233247] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-[#C9A45C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 text-[#C9A45C]">
                <FolderKanban className="w-6 h-6" />
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isAr ? 'عزل كلي للبيانات (Multi-Tenant Sovereign)' : 'Sovereign Multi-Tenant Isolation'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isAr ? 'مركز إدارة المشاريع والمتاجر' : 'Projects & Stores Operations Hub'}
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              {isAr 
                ? 'إدارة متكاملة لجميع متاجرك ومشاريعك الرقمية مع إمكانية التبديل الفوري، الاستنساخ، التصدير، وتخصيص هوية كل متجر بشكل مستقل وعالي الأداء.'
                : 'Centralized management of your digital stores and apps with instant switching, rapid cloning, full source code builds, and sovereign workspace isolation.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#B08D46] hover:from-[#D4AF37] hover:to-[#C9A45C] text-[#050B14] text-xs sm:text-sm font-black transition-all shadow-lg shadow-[#C9A45C]/20 flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{isAr ? 'مشروع جديد (معالج سريع)' : 'Create New Project'}</span>
            </button>
            <button
              onClick={() => setCurrentView('no_code_studio')}
              className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#C9A45C]" />
              <span>{isAr ? 'استوديو التطبيقات' : 'Open No-Code Studio'}</span>
            </button>
          </div>
        </div>

        {/* Operational Metrics Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 mb-1">{isAr ? 'إجمالي المشاريع' : 'Total Projects'}</div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{stats.total}</span>
              <span className="text-xs font-semibold text-[#C9A45C]">{isAr ? 'مشروع' : 'apps'}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 mb-1">{isAr ? 'المشاريع النشطة' : 'Active Stores'}</div>
            <div className="text-2xl font-black text-emerald-400 flex items-center gap-2">
              <span>{stats.active}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 mb-1">{isAr ? 'إجمالي المنتجات المدارة' : 'Total Products'}</div>
            <div className="text-2xl font-black text-white flex items-center gap-2">
              <span>{stats.totalProducts}</span>
              <span className="text-xs font-semibold text-slate-400">{isAr ? 'منتج' : 'items'}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="text-xs text-slate-400 mb-1">{isAr ? 'أداء النظام والاستجابة' : 'Performance Speed'}</div>
            <div className="text-2xl font-black text-[#C9A45C] flex items-center gap-2">
              <span>60 FPS</span>
              <span className="text-xs text-emerald-400 font-bold">Ultra Fast</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B1422] border border-[#233247]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث بالاسم، الرابط، أو الرمز...' : 'Search by name, slug, domain...'}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-sm text-white placeholder:text-slate-500 focus:border-[#C9A45C] focus:outline-none transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-[#050B14] border border-[#233247] text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'all' ? 'bg-[#C9A45C] text-[#050B14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'الكل' : 'All'} ({tenants.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'active' ? 'bg-[#C9A45C] text-[#050B14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'نشط' : 'Active'} ({tenants.filter(t => t.status === 'active').length})
            </button>
            <button
              onClick={() => setStatusFilter('trial')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                statusFilter === 'trial' ? 'bg-[#C9A45C] text-[#050B14]' : 'text-slate-400 hover:text-white'
              }`}
            >
              {isAr ? 'تجريبي' : 'Trial'}
            </button>
          </div>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#050B14] border border-[#233247] text-xs font-bold text-white focus:outline-none focus:border-[#C9A45C]"
          >
            <option value="newest">{isAr ? 'الأحدث أولاً' : 'Newest'}</option>
            <option value="name">{isAr ? 'الترتيب الأبجدي' : 'Alphabetical'}</option>
            <option value="products">{isAr ? 'الأكثر منتجات' : 'Most Products'}</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTenants.map(tenant => {
          const isActive = tenant.id === activeTenantId;
          const tenantProdsCount = productsCountMap[tenant.id] || 0;
          const brandColor = tenant.theme?.tokens?.primary || tenant.pwaConfig?.themeColor || '#C9A45C';

          return (
            <div
              key={tenant.id}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group ${
                isActive 
                  ? 'bg-gradient-to-b from-[#0E1E34] to-[#071322] border-[#C9A45C]/60 shadow-xl shadow-[#C9A45C]/10 ring-1 ring-[#C9A45C]/40' 
                  : 'bg-[#0B1422] border-[#233247] hover:border-[#233247] hover:shadow-lg'
              }`}
            >
              {/* Active project badge */}
              {isActive && (
                <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-[#C9A45C] via-[#E2C785] to-[#C9A45C]" />
              )}

              <div className="p-6 space-y-5">
                {/* Header & Avatar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-[#050B14] shadow-md shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: brandColor }}
                    >
                      {tenant.name?.charAt(0) || 'S'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white truncate group-hover:text-[#C9A45C] transition-colors">
                          {tenant.name}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {tenant.slug}.commerceos.app
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown / Pill */}
                  <div className="shrink-0 flex items-center gap-1.5">
                    <span 
                      className={`px-2.5 py-1 rounded-full text-[11px] font-black border flex items-center gap-1.5 ${
                        tenant.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : tenant.status === 'trial'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${tenant.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                      <span>{tenant.status === 'active' ? (isAr ? 'نشط' : 'Active') : tenant.status}</span>
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed min-h-[32px]">
                  {tenant.description || (isAr ? 'متجر إلكتروني متكامل وعالي الأداء.' : 'High-performance e-commerce store.')}
                </p>

                {/* Badges / Metrics Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-400">{isAr ? 'المنتجات' : 'Products'}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{tenantProdsCount}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-400">{isAr ? 'العملة' : 'Currency'}</div>
                    <div className="text-sm font-bold text-[#C9A45C] mt-0.5">{tenant.currency || 'SAR'}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="text-[10px] text-slate-400">{isAr ? 'الخطة' : 'Plan'}</div>
                    <div className="text-sm font-bold text-white capitalize mt-0.5">{tenant.plan || 'Pro'}</div>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="p-4 bg-black/20 border-t border-[#233247] flex items-center justify-between gap-2">
                {isActive ? (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'المشروع النشط حالياً' : 'Active Workspace'}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSwitchWorkspace(tenant)}
                    className="px-3.5 py-2 rounded-xl bg-[#C9A45C] hover:bg-[#D4AF37] text-[#050B14] text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isAr ? 'التبديل إلى هذا المتجر' : 'Activate Store'}</span>
                  </button>
                )}

                {/* Secondary action tools */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      if (!isActive) setActiveTenantId(tenant.id);
                      setCurrentView('storefront');
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={isAr ? 'معاينة واجهة المتجر' : 'Preview Storefront'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (!isActive) setActiveTenantId(tenant.id);
                      if (onNavigateSection) onNavigateSection('publish');
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#C9A45C] hover:bg-white/10 transition-colors"
                    title={isAr ? 'تصدير الكود البرمجي وحزم التطبيقات' : 'Export & Publish Packages'}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleCloneProject(tenant.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-[#C9A45C] hover:bg-white/10 transition-colors"
                    title={isAr ? 'استنساخ المشروع بكامل محتوياته' : 'Clone Project'}
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeletingTenantId(tenant.id)}
                    disabled={tenants.length <= 1}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30"
                    title={isAr ? 'حذف المشروع' : 'Delete Project'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTenants.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4">
          <Store className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">
            {isAr ? 'لم يتم العثور على أي مشاريع مطابقة' : 'No matching projects found'}
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {isAr ? 'جرب تغيير كلمات البحث أو المرشحات أو أنشئ مشروعاً جديداً.' : 'Try changing search keywords or create a new project.'}
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#C9A45C] text-[#050B14] font-bold text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isAr ? 'إنشاء متجر جديد' : 'Create New Store'}</span>
          </button>
        </div>
      )}

      {/* Fast Project Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0B1626] border border-[#233247] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#C9A45C]" />
                  <span>{isAr ? 'إنشاء مشروع ومتجر رقمي جديد' : 'Create New Project & Store'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isAr ? 'اختر نموذج النشاط وسنقوم بتجهيز الهيكل والمنتجات الافتراضية فوراً.' : 'Select an industry archetype and we will generate starter data instantly.'}
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-6">
              {/* Template Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2.5">
                  {isAr ? '١. اختر نموذج النشاط التجاري (Archetype):' : '1. Select Business Archetype:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PROJECT_TEMPLATES.map(tpl => {
                    const isSelected = selectedTemplate === tpl.id;
                    const IconComp = tpl.icon;
                    return (
                      <div
                        key={tpl.id}
                        onClick={() => {
                          setSelectedTemplate(tpl.id);
                          setNewProjectColor(tpl.color);
                          if (!newProjectName) {
                            setNewProjectName(tpl.nameAr);
                          }
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#C9A45C]/15 border-[#C9A45C] shadow-lg shadow-[#C9A45C]/10 ring-1 ring-[#C9A45C]'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div 
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#050B14] font-bold"
                            style={{ backgroundColor: tpl.color }}
                          >
                            <IconComp className="w-4 h-4" />
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#C9A45C] stroke-[3]" />}
                        </div>
                        <div className="mt-3">
                          <h4 className="text-xs font-bold text-white leading-snug">{tpl.nameAr}</h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">{tpl.nameEn}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Project Details Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'اسم المشروع / المتجر *' : 'Project / Store Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newProjectName}
                    onChange={e => {
                      setNewProjectName(e.target.value);
                      if (!newProjectSlug) {
                        setNewProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                      }
                    }}
                    placeholder={isAr ? 'مثال: روز بوتيك، مطعم نكهات...' : 'e.g. Rose Boutique'}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-sm text-white focus:border-[#C9A45C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'معرّف المشروع / المتجر (Store Slug) *' : 'Store Identifier Slug *'}
                  </label>
                  <div className="flex items-center rounded-xl bg-[#050B14] border border-[#233247] overflow-hidden focus-within:border-[#C9A45C]">
                    <span className="ps-3 text-[11px] text-slate-500 font-mono shrink-0">project_</span>
                    <input
                      type="text"
                      required
                      value={newProjectSlug}
                      onChange={e => setNewProjectSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-new-store"
                      className="w-full px-3 py-2.5 bg-transparent text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'العملة الأساسية' : 'Primary Currency'}
                  </label>
                  <select
                    value={newProjectCurrency}
                    onChange={e => setNewProjectCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-sm text-white focus:border-[#C9A45C] focus:outline-none"
                  >
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="QAR">ريال قطري (QAR)</option>
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {isAr ? 'اللون الأساسي للهوية' : 'Brand Accent Color'}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={newProjectColor}
                      onChange={e => setNewProjectColor(e.target.value)}
                      className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newProjectColor}
                      onChange={e => setNewProjectColor(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-sm text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#D4AF37] text-[#050B14] text-xs font-black shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )}
                  <span>{isAr ? 'تدشين المشروع فوراً' : 'Launch Project Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTenantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#0B1626] border border-rose-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'تأكيد حذف المشروع' : 'Confirm Project Deletion'}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {isAr 
                  ? 'هل أنت متأكد من رغبتك في حذف هذا المشروع؟ سيتم حذف جميع المنتجات والتصنيفات المرتبطة به.'
                  : 'Are you sure you want to delete this project? All associated products and data will be removed.'}
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingTenantId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:bg-white/5"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
              >
                {isAr ? 'نعم، احذف المشروع' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
