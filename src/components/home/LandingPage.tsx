import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Smartphone, 
  Cpu, 
  Layers, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  Zap, 
  Globe, 
  CreditCard, 
  Box, 
  Terminal, 
  Sliders, 
  Trash2,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  Server,
  Code2,
  Users
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const LandingPage: React.FC = () => {
  const {
    openAuthModal,
    setCurrentView,
    tenants,
    activeTenant,
    setActiveTenantId,
    currentUser,
    isAuthenticated,
    logout,
    resetToCleanStore,
    showToast,
    language
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'stores' | 'architecture'>('overview');

  const handleSelectStoreAndPreview = (tenantId: string, view: 'storefront' | 'merchant_dashboard') => {
    setActiveTenantId(tenantId);
    setCurrentView(view);
  };

  const handleCleanCurrentStore = () => {
    if (window.confirm(`هل أنت متأكد من رغبتك في تصفير متجر "${activeTenant.name}" وحذف كافة المنتجات والأقسام والطلبات الافتراضية لتبدأ بإدخال بياناتك الحقيقية من الصفر؟`)) {
      resetToCleanStore(activeTenant.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white">CommerceOS</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
                  Enterprise Cloud v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                المنصة التجارية السيادية متعددة المتاجر ومزرعة البناء الموزعة
              </p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-2xl border border-slate-800 text-xs font-bold text-slate-300">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-amber-500 text-slate-950 shadow' : 'hover:text-white'}`}
            >
              الرئيسية
            </button>
            <button 
              onClick={() => setActiveTab('stores')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'stores' ? 'bg-amber-500 text-slate-950 shadow' : 'hover:text-white'}`}
            >
              المتاجر الجاهزة
            </button>
            <button 
              onClick={() => setActiveTab('features')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'features' ? 'bg-amber-500 text-slate-950 shadow' : 'hover:text-white'}`}
            >
              المميزات والتقنيات
            </button>
            <button 
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 shadow' : 'hover:text-white'}`}
            >
              مزرعة البناء (DevOps)
            </button>
          </nav>

          {/* Auth & Action Buttons */}
          <div className="flex items-center gap-2.5">
            {isAuthenticated && currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('merchant_dashboard')}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-bold text-white transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>لوحة التحكم ({currentUser.name})</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold transition-all"
                  title="تسجيل الخروج"
                >
                  خروج
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-750 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>تسجيل الدخول</span>
                </button>

                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 text-xs font-black hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>إنشاء متجر جديد</span>
                </button>
              </>
            )}
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-4 lg:px-8 pt-12 pb-16 max-w-7xl mx-auto">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shadow-lg shadow-amber-500/5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>المنصة التجارية المستقلة المتكاملة للتجار ورواد الأعمال</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2]">
            أطلق متجرك الإلكتروني وتطبيقاتك{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              بملكية سيادية كاملة
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            منصة متكاملة تجمع بين تصميم المتاجر الفاخرة، إدارة الطلبات والمخزون، الدفع الخليجي (مدى، أبل باي، تمارا)، ومزرعة بناء آلية لتصدير تطبيقات الهاتف (iOS/Android) وحزم النشر السحابي.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            
            <button
              onClick={() => openAuthModal('register')}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm hover:opacity-95 shadow-xl shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>ابدأ بتأسيس متجرك الآن</span>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            <button
              onClick={() => openAuthModal('login')}
              className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-750 text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>تسجيل الدخول للوحة التحكم</span>
            </button>

            <button
              onClick={() => setCurrentView('storefront')}
              className="px-5 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>معاينة متجر حي مباشر</span>
            </button>

          </div>

          {/* CLEAN DATA ACTION BOX (Explicit User Request Solution) */}
          <div className="mt-8 p-4 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>التحكم بالبيانات وإزالة البيانات الوهمية (Clean Data Control)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">جاهز للفحص</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  المتجر النشط حالياً: <span className="text-amber-400 font-bold">{activeTenant.name}</span>. يمكنك تصفير البيانات للبدء من الصفر أو إنشاء متجر فارغ مخصص.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCleanCurrentStore}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5"
                title="مسح المنتجات والطلبات الوهمية من المتجر الحالي"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>تصفير ومسح الوهمي</span>
              </button>

              <button
                onClick={() => openAuthModal('register')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>متجر جديد نظيف</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK STORES SHOWCASE BAR */}
      <section className="px-4 lg:px-8 pb-12 max-w-7xl mx-auto">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-400" />
                <span>المتاجر النشطة على المنصة (Live Multi-Tenants)</span>
              </h2>
              <p className="text-xs text-slate-400">انقر على أي متجر لمعاينته مباشرة كعميل أو إدارته كتاجر</p>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {tenants.length} متاجر مستقلة مشغلة
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tenants.map(tenant => {
              const isSelected = tenant.id === activeTenant.id;
              return (
                <div 
                  key={tenant.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-slate-850 border-amber-500/50 shadow-lg shadow-amber-500/10' 
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold border border-slate-700">
                        <Store className="w-4 h-4" />
                      </div>
                      {isSelected && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          النشط حالياً
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{tenant.name}</h3>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">{tenant.domain || `${tenant.slug}.commerceos.app`}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">{tenant.description}</p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleSelectStoreAndPreview(tenant.id, 'storefront')}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
                      <span>عرض المتجر</span>
                    </button>
                    <button
                      onClick={() => handleSelectStoreAndPreview(tenant.id, 'merchant_dashboard')}
                      className="py-1.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>الإدارة</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="px-4 lg:px-8 py-12 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            قدرات وبنية تحتية للمتاجر الكبرى
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            صممت المنصة لتوفر أعلى درجات المرونة، الأمان، وتصدير الأكواد والتطبيقات بدون أي قيود.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Feature 1: Multi-Tenancy */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">عزل المستأجرين (Multi-Tenant Isolation)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              عزل تام لكل متجر في قواعد البيانات، المنتجات، الطلبات، وصلاحيات الموظفين مع لوحة تحكم مستقلة ونطاق مخصص.
            </p>
          </div>

          {/* Feature 2: Build Farm DevOps */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">مزرعة بناء التطبيقات (DevOps Farm)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              طوابير مهام معزولة عبر Redis/BullMQ و WebSockets لتجميع وتوليد تطبيقات iOS و Android الأصلية وحزم Docker بدون إجهاد السيرفر.
            </p>
          </div>

          {/* Feature 3: Sovereign White-Label */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">رخص الملكية ومكافحة التلاعب</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              إمكانية إزالة العلامة المائية بالكامل (100% White-Label) مع تشفير الرخص وفحص التوقيع الرقمي لمنع التلاعب البرمجي.
            </p>
          </div>

          {/* Feature 4: Theme Engine & Visual IDE */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">محرر الواجهات الحي (Theme IDE)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تخصيص كامل للألوان والخطوط والترتيب والأقسام التفاعلية مع معاينة فورية على الشاشات المختلفة (Desktop, Tablet, Mobile).
            </p>
          </div>

          {/* Feature 5: Gulf & Global Payments */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">بوابات الدفع الخليجية والعالمية</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              دعم أصلي لشبكة مدى (Mada)، Apple Pay، فيزا وماستركارد، تمارا (Tamara)، والتحويل البنكي مع إدارة الضريبة والقسائم.
            </p>
          </div>

          {/* Feature 6: PWA & Native Ready */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-750 transition-all space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">تطبيق ويب تقدمي (PWA) وأصلي</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تثبيت فوري على شاشة الهاتف، إشعارات فورية (Push Notifications)، وعمل سلس حتى بدون اتصال بالإنترنت (Offline Mode).
            </p>
          </div>

        </div>
      </section>

      {/* QUICK FOOTER */}
      <footer className="border-t border-slate-800/80 px-4 lg:px-8 py-8 max-w-7xl mx-auto text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-amber-500" />
          <span className="text-slate-300 font-bold">CommerceOS Sovereign Platform</span>
          <span>• جميع الحقوق محفوظة {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => openAuthModal('login')} className="hover:text-amber-400 transition-colors">
            تسجيل الدخول
          </button>
          <button onClick={() => openAuthModal('register')} className="hover:text-amber-400 transition-colors">
            تسجيل متجر جديد
          </button>
          <button onClick={() => setCurrentView('platform_admin')} className="hover:text-amber-400 transition-colors">
            إدارة المنصة العامة
          </button>
        </div>
      </footer>

    </div>
  );
};
