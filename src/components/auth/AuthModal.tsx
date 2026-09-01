import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Store, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Crown
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { BusinessType } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    tenants,
    activeTenant,
    setCurrentView,
    language
  } = useCommerce();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedTenantId, setSelectedTenantId] = useState(activeTenant?.id || (tenants[0]?.id ?? ''));
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStoreName, setRegStoreName] = useState('');
  const [regStoreSlug, setRegStoreSlug] = useState('');
  const [regBusinessType, setRegBusinessType] = useState<BusinessType>('honey');
  const [regCleanStore, setRegCleanStore] = useState(false);

  if (!authModalOpen) return null;

  const handleSlugAutoFill = (name: string) => {
    setRegStoreName(name);
    if (!regStoreSlug || regStoreSlug === regStoreName.toLowerCase().replace(/\s+/g, '-')) {
      const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0621-\u064A]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 30);
      setRegStoreSlug(slug || 'my-store');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) return;

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword, selectedTenantId);
      setAuthModalOpen(false);
      setCurrentView('merchant_dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regStoreName) return;

    setIsLoading(true);
    try {
      await register({
        name: regName,
        email: regEmail,
        password: regPassword,
        storeName: regStoreName,
        storeSlug: regStoreSlug || 'new-store',
        businessType: regBusinessType,
        cleanStore: regCleanStore
      });
      setAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-[#0B1422] border border-[#233247] shadow-2xl shadow-black/90 overflow-hidden text-right"
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Decorative Top Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-gradient-to-r from-[#C9A45C]/20 via-[#E0C078]/20 to-[#C9A45C]/0 blur-2xl pointer-events-none" />

        {/* Modal Header */}
        <div className="relative p-6 border-b border-[#233247] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9A45C] to-[#E0C078] flex items-center justify-center text-[#050B14] font-black shadow-lg shadow-[#C9A45C]/20">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>بوابة دخول منصة CommerceOS</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30 font-bold">
                  Sovereign Identity
                </span>
              </h2>
              <p className="text-xs text-[#97A4B5]">
                {authModalMode === 'login' 
                  ? 'تسجيل الدخول لإدارة المتاجر والطلبات' 
                  : 'تدشين حساب تاجر ومتجر إلكتروني جديد'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-2 rounded-xl text-[#97A4B5] hover:text-white hover:bg-[#101B2C] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="p-2 bg-[#050B14] border-b border-[#233247] flex gap-2">
          <button
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authModalMode === 'login'
                ? 'bg-[#C9A45C] text-[#050B14] shadow-lg shadow-[#C9A45C]/20'
                : 'text-[#97A4B5] hover:text-white hover:bg-[#101B2C]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>تسجيل الدخول (Sign In)</span>
          </button>

          <button
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authModalMode === 'register'
                ? 'bg-[#C9A45C] text-[#050B14] shadow-lg shadow-[#C9A45C]/20'
                : 'text-[#97A4B5] hover:text-white hover:bg-[#101B2C]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>تسجيل متجر وحساب جديد (Register)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">

          {/* MODE 1: LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {tenants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                    المتجر المستهدف (Target Store)
                  </label>
                  <div className="relative">
                    <Store className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                    <select
                      value={selectedTenantId}
                      onChange={e => setSelectedTenantId(e.target.value)}
                      className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#C9A45C] transition-colors"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.slug}.commerceos.app)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                  البريد الإلكتروني للتاجر / الموظف
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={e => setLoginEmail(e.target.value)}
                    placeholder="name@store.sa"
                    className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#F4F6F8]">
                    كلمة المرور
                  </label>
                  <span className="text-[11px] text-[#97A4B5]">حماية مشفرة</span>
                </div>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E0C078] text-[#050B14] text-xs font-black hover:opacity-95 shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>جارِ التحقق وتسجيل الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول والانتقال للوحة التحكم</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* MODE 2: REGISTER FORM */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                    اسم التاجر / المالك
                  </label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="مثال: عبدالله الشمري"
                      className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={e => setRegEmail(e.target.value)}
                      placeholder="name@domain.sa"
                      className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors text-left"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                  اسم المتجر الإلكتروني
                </label>
                <div className="relative">
                  <Store className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                  <input
                    type="text"
                    required
                    value={regStoreName}
                    onChange={e => handleSlugAutoFill(e.target.value)}
                    placeholder="مثال: متجر أصايل للعود الفاخر"
                    className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                    النطاق الفرعي المطلوب
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={regStoreSlug}
                      onChange={e => setRegStoreSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="asayel-oud"
                      className="w-full px-3 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-mono font-medium text-[#C9A45C] placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors text-left"
                      dir="ltr"
                    />
                    <span className="text-[10px] text-[#97A4B5] font-mono mt-1 block text-left" dir="ltr">
                      .{regStoreSlug || 'store'}.commerceos.app
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                    نوع النشاط التجاري
                  </label>
                  <select
                    value={regBusinessType}
                    onChange={e => setRegBusinessType(e.target.value as BusinessType)}
                    className="w-full px-3 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white focus:outline-none focus:border-[#C9A45C] transition-colors"
                  >
                    <option value="honey">عسل وتمور ومناحل (Honey & Dates)</option>
                    <option value="coffee">قهوة ومحامص مختصة (Coffee)</option>
                    <option value="perfume">عطور وبخور ودخون (Perfumes & Oud)</option>
                    <option value="fashion">أزياء وملابس وعبايات (Fashion & Abayas)</option>
                    <option value="tech">إلكترونيات وهواتف ذكية (Tech & Gadgets)</option>
                    <option value="beauty">تجميل وعناية بالبشرة (Beauty & Skincare)</option>
                    <option value="sweets">حلويات وشوكولاتة فاخرة (Sweets)</option>
                    <option value="accessories">مجوهرات وإكسسوارات (Jewelry & Accessories)</option>
                    <option value="general">متجر تجاري عام (General Store)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F4F6F8] mb-1.5">
                  كلمة المرور المشفرة
                </label>
                <div className="relative">
                  <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#97A4B5]" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    placeholder="اختر كلمة مرور قوية (8 أحرف على الأقل)"
                    className="w-full pr-10 pl-4 py-2.5 bg-[#050B14] border border-[#233247] rounded-xl text-xs font-medium text-white placeholder:text-[#97A4B5] focus:outline-none focus:border-[#C9A45C] transition-colors text-left"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* REAL DATA OPTION: START WITH BLANK STORE */}
              <div className="p-3.5 rounded-2xl bg-[#C9A45C]/10 border border-[#C9A45C]/20 flex items-start gap-3 cursor-pointer select-none" onClick={() => setRegCleanStore(!regCleanStore)}>
                <input
                  type="checkbox"
                  id="cleanStoreCheck"
                  checked={regCleanStore}
                  onChange={e => setRegCleanStore(e.target.checked)}
                  className="mt-0.5 rounded border-[#C9A45C] text-[#C9A45C] focus:ring-[#C9A45C]"
                />
                <div>
                  <label htmlFor="cleanStoreCheck" className="text-xs font-bold text-[#C9A45C] cursor-pointer block">
                    بدء متجر فارغ ونظيف تماماً (بدون بيانات أو منتجات افتراضية)
                  </label>
                  <p className="text-[11px] text-[#97A4B5] mt-0.5 leading-relaxed">
                    حدد هذا الخيار إذا كنت ترغب في بدء متجرك بصفحة بيضاء لإضافة منتجاتك وصورك وأقسامك الحقيقية من الصفر بدون أي محتوى وهمي.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#E0C078] text-[#050B14] text-xs font-black hover:opacity-95 shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span>جارِ إنشاء وتجهيز المتجر...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>إنشاء المتجر والحساب والبدء فوراً</span>
                  </>
                )}
              </button>

            </form>
          )}

        </div>

        {/* Modal Footer Note */}
        <div className="p-4 bg-[#050B14] border-t border-[#233247] text-center text-[11px] text-[#97A4B5] flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>CommerceOS Sovereign Architecture • تشفير كامل للبيانات وعزل تام لحسابات المستأجرين</span>
        </div>

      </div>
    </div>
  );
};
