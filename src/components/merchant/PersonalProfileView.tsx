import React, { useState } from 'react';
import { 
  Plus, 
  Store, 
  LogOut, 
  User, 
  ChevronRight, 
  Compass, 
  Layout, 
  Download, 
  Eye, 
  CheckCircle, 
  Sliders, 
  Settings, 
  ArrowLeft,
  ChevronLeft,
  BookOpen,
  Zap,
  Check,
  Smartphone,
  Sparkles,
  ArrowRight,
  Palette
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const PersonalProfileView: React.FC = () => {
  const { 
    currentUser, 
    tenants, 
    logout, 
    setCurrentView, 
    setActiveTenantId, 
    language,
    showToast 
  } = useCommerce();

  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'my_stores' | 'tutorials'>('my_stores');

  // Filter and deduplicate tenants that belong to the current user
  const userTenants = React.useMemo(() => {
    const unique = new Map<string, any>();
    
    // Deduplicate all tenants by ID first to prevent duplicate keys
    tenants.forEach(t => {
      if (t && t.id) {
        unique.set(t.id, t);
      }
    });
    
    const uniqueList = Array.from(unique.values());
    
    // If the user is a platform super admin, show all stores
    if (currentUser?.role === 'platform_super_admin') {
      return uniqueList;
    }
    
    const userEmail = currentUser?.email?.toLowerCase().trim();
    const userTenantId = currentUser?.tenantId;
    
    return uniqueList.filter(t => {
      const contactEmail = t.contact?.email?.toLowerCase().trim();
      const matchesEmail = contactEmail && userEmail && contactEmail === userEmail;
      const matchesTenantId = userTenantId && t.id === userTenantId;
      
      const userPrefix = userEmail ? userEmail.split('@')[0] : '';
      const matchesSlug = userPrefix && t.slug && t.slug.includes(userPrefix);
      
      return matchesEmail || matchesTenantId || matchesSlug;
    });
  }, [tenants, currentUser]);

  // Calculate completion percentage for each store
  const getStoreCompletion = (tenant: any) => {
    let score = 0;
    // Step 1: Base store metadata
    if (tenant.name && tenant.slug) score += 25;
    // Step 2: Contact info Whatsapp / phone set
    if (tenant.contact?.phone || tenant.contact?.whatsapp) score += 25;
    // Step 3: Payment gateways enabled
    if (tenant.paymentGateways && Object.values(tenant.paymentGateways).some(v => v === true)) score += 25;
    // Step 4: Licensing or branding verified
    if (tenant.licensing?.verified) score += 25;
    
    return score;
  };

  const handleManageStore = (tenantId: string) => {
    setActiveTenantId(tenantId);
    setCurrentView('merchant_dashboard');
    showToast(
      isAr 
        ? 'تم الدخول إلى لوحة تحكم المتجر بنجاح' 
        : 'Entered store dashboard successfully', 
      'success'
    );
  };

  const handleCreateNewStore = () => {
    setCurrentView('builder_wizard');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Dynamic Top Header with Premium Gradient Accent */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0B1528] to-[#030712] border-b border-white/5 py-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Merchant Identity Card */}
            <div className="flex items-center gap-4 text-center md:text-right">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8B7322] flex items-center justify-center font-black text-2xl text-[#030712] shadow-xl shadow-amber-500/10">
                {(currentUser?.name?.trim()?.charAt(0) || 'U').toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <h1 className="text-xl font-extrabold tracking-tight">
                    {currentUser?.name || (isAr ? 'المستخدم الموثّق' : 'Verified User')}
                  </h1>
                  <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {isAr ? 'التاجر المعتمد' : 'Verified Merchant'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{currentUser?.email}</p>
              </div>
            </div>

            {/* Quick Actions (Create Store / Logout) */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleCreateNewStore}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-black text-xs md:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/10 transition-all focus:outline-none"
              >
                <Plus className="w-4 h-4" />
                <span>{isAr ? 'إنشاء متجر جديد' : 'Create New Store'}</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setCurrentView('home');
                }}
                className="p-3 rounded-xl bg-[#111A2E] hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/5 transition-all focus:outline-none"
                title={isAr ? 'تسجيل الخروج' : 'Log out'}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex gap-6 mt-8 border-b border-white/5">
            <button
              onClick={() => setActiveTab('my_stores')}
              className={`pb-3 text-sm font-bold transition-all relative focus:outline-none ${
                activeTab === 'my_stores' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isAr ? 'مشاريعي ومتاجري' : 'My Projects & Stores'}</span>
              {activeTab === 'my_stores' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('tutorials')}
              className={`pb-3 text-sm font-bold transition-all relative focus:outline-none ${
                activeTab === 'tutorials' ? 'text-[#D4AF37]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{isAr ? 'دليل وباقات المتاجر للبداية من الصفر' : 'Getting Started Guide'}</span>
              {activeTab === 'tutorials' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Main Body Grid */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        
        {activeTab === 'my_stores' ? (
          <div>
            {userTenants.length === 0 ? (
              /* Beautiful Onboarding State when user has NO stores yet */
              <div className="max-w-4xl mx-auto bg-[#0B121F]/80 border border-white/5 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                  <Store className="w-8 h-8" />
                </div>

                <h2 className="text-2xl font-black mb-3 text-white">
                  {isAr ? 'مرحباً بك في مساحة عملك الشخصية!' : 'Welcome to your Personal Workspace!'}
                </h2>
                
                <p className="text-slate-400 max-w-lg mx-auto text-sm md:text-base mb-8 leading-relaxed">
                  {isAr 
                    ? 'أنت جاهز لتأسيس متجرك الاحترافي وتنزيله ككود مصدري نظيف. اتبع الدليل أدناه لبدء رحلة التجارة والبرمجة.' 
                    : 'You are ready to launch your first professional store and export its clean source code. Follow the steps below to start.'}
                </p>

                {/* Vertical Interactive Step Guide */}
                <div className="grid md:grid-cols-4 gap-6 text-right md:text-center mb-10">
                  
                  <div className="p-5 rounded-2xl bg-[#0F172A]/60 border border-white/5 relative">
                    <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center">1</span>
                    <h4 className="font-bold text-sm text-white mb-2 mt-4">
                      {isAr ? 'الهوية والاسم' : 'Brand Identity'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'حدد اسم متجرك ونشاطه لتخصيص محركات الذكاء الاصطناعي.' : 'Choose name, niche, and let our generators adapt.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F172A]/60 border border-white/5 relative">
                    <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center">2</span>
                    <h4 className="font-bold text-sm text-white mb-2 mt-4">
                      {isAr ? 'إضافة المنتجات والكتالوج' : 'Add Products'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'أضف منتجاتك وصورها بأسعار وسلاسل توريد حقيقية.' : 'Import real products with price, images & supply chain.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F172A]/60 border border-white/5 relative">
                    <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center">3</span>
                    <h4 className="font-bold text-sm text-white mb-2 mt-4">
                      {isAr ? 'تخصيص الواجهة والقسم' : 'Interface Design'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'اختر الألوان والخطوط وأقسام الصفحة الرئيسية بنقرة واحدة.' : 'Define display components, typography, and shades.'}
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#0F172A]/60 border border-white/5 relative">
                    <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center">4</span>
                    <h4 className="font-bold text-sm text-white mb-2 mt-4">
                      {isAr ? 'تصدير الكود البرمجي الكامل' : 'Export Full Source'}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {isAr ? 'حمّل كود المتجر كاملاً جاهزاً للاستضافة المباشرة في أي مكان.' : 'Get pristine source bundle ready to deploy anywhere.'}
                    </p>
                  </div>

                </div>

                <button
                  onClick={handleCreateNewStore}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-black text-sm inline-flex items-center gap-3 shadow-xl shadow-amber-500/10 transition-all focus:outline-none"
                >
                  <span>{isAr ? 'ابدأ بإنشاء متجرك الأول الآن' : 'Start Creating Your First Store'}</span>
                  <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </button>

              </div>
            ) : (
              /* Stores Grid when user HAS stores */
              <div className="space-y-6">
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-extrabold text-slate-200">
                    {isAr ? `المتاجر والمشاريع النشطة (${userTenants.length})` : `Active Stores & Projects (${userTenants.length})`}
                  </h3>
                  
                  <button
                    onClick={handleCreateNewStore}
                    className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-bold focus:outline-none"
                  >
                    <span>{isAr ? '+ أضف متجر آخر' : '+ Add another store'}</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userTenants.map(tenant => {
                    const progress = getStoreCompletion(tenant);
                    return (
                      <div 
                        key={tenant.id}
                        className="bg-[#0B121F]/90 border border-white/5 rounded-2xl p-5 hover:border-[#D4AF37]/30 transition-all duration-200 flex flex-col justify-between group"
                      >
                        <div>
                          {/* Store Meta */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-[#D4AF37] flex items-center justify-center border border-amber-500/20">
                                <Store className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors">{tenant.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">@{tenant.slug}</span>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 text-[9px] font-black tracking-wider uppercase bg-[#162235] text-amber-300 rounded-full border border-white/5">
                              {tenant.businessType || 'general'}
                            </span>
                          </div>

                          {/* Completion rate progress bar */}
                          <div className="space-y-1.5 my-5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 font-medium">{isAr ? 'نسبة الإنجاز وجاهزية الكود' : 'Code Readiness / Completion'}</span>
                              <span className="font-bold text-[#D4AF37]">{progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-[#162235] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37] rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          {/* Detail attributes checklist */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] bg-[#111A2E]/55 p-3 rounded-xl border border-white/5 mb-5">
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Check className={`w-3.5 h-3.5 ${tenant.name ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{isAr ? 'الهوية والبيانات' : 'Identity Setup'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Check className={`w-3.5 h-3.5 ${tenant.contact?.phone ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{isAr ? 'أرقام الاتصال' : 'Contacts info'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Check className={`w-3.5 h-3.5 ${Object.values(tenant.paymentGateways || {}).some(Boolean) ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{isAr ? 'خيارات الدفع' : 'Payment methods'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-300">
                              <Check className={`w-3.5 h-3.5 ${tenant.licensing?.verified ? 'text-emerald-400' : 'text-slate-600'}`} />
                              <span>{isAr ? 'ترخيص وتوثيق الكود' : 'Pristine License'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex gap-2.5 pt-4 border-t border-white/5">
                          <button
                            onClick={() => handleManageStore(tenant.id)}
                            className="flex-1 py-2 px-3 rounded-lg bg-[#162235] hover:bg-[#D4AF37] text-slate-200 hover:text-[#07111F] font-bold text-xs transition-all flex items-center justify-center gap-1 focus:outline-none"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إدارة المتجر' : 'Manage Store'}</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTenantId(tenant.id);
                              setCurrentView('live_customizer');
                              showToast(
                                isAr 
                                  ? 'تم فتح مصنع الهوية والتصميم المباشر للمتجر' 
                                  : 'Opened Live Design Studio for the store', 
                                'success'
                              );
                            }}
                            className="p-2 rounded-lg bg-[#111A2E] hover:bg-amber-500/10 text-slate-400 hover:text-[#D4AF37] border border-white/5 transition-all focus:outline-none"
                            title={isAr ? 'تخصيص الهوية والألوان والتصميم' : 'Branding & Design'}
                          >
                            <Palette className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              setActiveTenantId(tenant.id);
                              setCurrentView('merchant_dashboard');
                              setTimeout(() => {
                                // Trigger export modal by dispatching event
                                window.dispatchEvent(new CustomEvent('open-export-modal'));
                              }, 150);
                            }}
                            className="p-2 rounded-lg bg-[#111A2E] hover:bg-amber-500/10 text-slate-400 hover:text-[#D4AF37] border border-white/5 transition-all focus:outline-none"
                            title={isAr ? 'تصدير وتحميل الكود المصدري' : 'Export & Download Clean Code'}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>
        ) : (
          /* Tutorials and Guidance view */
          <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            
            <div className="bg-[#0B121F]/80 border border-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                <span>{isAr ? 'دليل بناء متجر إلكتروني احترافي وتحميل الكود المصدري' : 'Complete Builder & Export Guide'}</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr 
                  ? 'CommerceOS ليست منصة استضافة مغلقة؛ بل هي محرك توليد كامل للأكواد المصدرية النظيفة (Full-Stack Code Generator). يوضح الدليل التالي كيفية تجهيز متجرك وتصدير ملفاته لتشغيله في أي مكان.'
                  : 'CommerceOS is a premium full-stack generator. The following guide details how to build your e-commerce model and export the pristine codebase.'}
              </p>
            </div>

            <div className="space-y-4">
              
              <div className="p-5 rounded-xl bg-[#0B121F]/60 border border-white/5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0 mt-1">1</div>
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-1">{isAr ? 'بناء المتجر والواجهة عبر المعالج الذكي' : '1. Initialize Store wizard'}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr 
                      ? 'عند النقر على "إنشاء متجر جديد"، سيقودك المعالج عبر خطوات تفاعلية لتحديد نوع النشاط التجاري (عسل، قهوة، عطور، إلخ). يقوم النظام فوراً بتهيئة قوالب الألوان الذكية والخطوط المناسبة للهوية العربية والإنجليزية.'
                      : 'Launch the wizard, choose your business model and let the generator adapt typography, palettes, and default mock listings.'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0B121F]/60 border border-white/5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0 mt-1">2</div>
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-1">{isAr ? 'لوحة التحكم والكتالوج المحلي' : '2. Manage listings and theme config'}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr 
                      ? 'بمجرد الدخول إلى إدارة المتجر، يمكنك إضافة منتجات حقيقية، تنظيم الأقسام، تعديل نصوص الشحن، وتفعيل بوابات الدفع (مدى، فيزا، أبل باي، الدفع عند الاستلام). يتم حفظ هذه التكوينات محلياً في ملف قاعدة البيانات.'
                      : 'Customize catalogs, order structures, discount coupons, and payment options directly inside the management center.'}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#0B121F]/60 border border-white/5 flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-[#D4AF37] font-black text-xs flex items-center justify-center shrink-0 mt-1">3</div>
                <div>
                  <h4 className="font-extrabold text-sm text-white mb-1">{isAr ? 'تصدير الكود البرمجي النظيف (Zero-Dependency)' : '3. Export Codebase'}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {isAr 
                      ? 'انقر على خيار تصدير الكود في صفحة مشروعك لتنزيل الكود المصدري كاملاً. يتضمن الكود هيكلية نظيفة لـ React و Node.js مع إعدادات Docker للتشغيل الذاتي المباشر بنقرة زر واحدة.'
                      : 'Click the export action to download a zero-dependency full-stack framework ready to execute or package inside Docker containers.'}
                  </p>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
