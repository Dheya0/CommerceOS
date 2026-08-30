import React, { useState } from 'react';
import { 
  Crown, 
  Lock, 
  Mail, 
  Store, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { BusinessType, StaffRole } from '../../types';

export const AuthPageView: React.FC = () => {
  const {
    login,
    register,
    tenants,
    activeTenant,
    setActiveTenantId,
    setCurrentStaffRole,
    setCurrentView,
    language,
    showToast
  } = useCommerce();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('owner@royalhoney.com');
  const [loginPassword, setLoginPassword] = useState('demo123456');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState(activeTenant.id);
  const [isLoading, setIsLoading] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStoreName, setRegStoreName] = useState('');
  const [regStoreSlug, setRegStoreSlug] = useState('');
  const [regBusinessType, setRegBusinessType] = useState<BusinessType>('honey');
  const [regCleanStore, setRegCleanStore] = useState(false);

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
    if (!loginEmail) {
      showToast('يرجى إدخال البريد الإلكتروني', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await login(loginEmail, loginPassword, selectedTenantId);
      setCurrentView('merchant_dashboard');
    } catch (err) {
      showToast('فشل تسجيل الدخول، يرجى المحاولة مرة أخرى', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regStoreName) {
      showToast('يرجى تعبئة كافة الحقول الإجبارية', 'error');
      return;
    }

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
      setCurrentView('merchant_dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = (role: StaffRole, email: string, tenantId: string) => {
    setLoginEmail(email);
    setLoginPassword('demo123456');
    setSelectedTenantId(tenantId);
    setActiveTenantId(tenantId);
    setCurrentStaffRole(role);
    login(email, 'demo123456', tenantId);
    setCurrentView('merchant_dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center p-4 lg:p-8 font-sans" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left / Info Side */}
        <div className="lg:col-span-5 space-y-6 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-slate-300 text-xs font-semibold tracking-wide">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>نظام التشغيل التجاري السيادي CommerceOS</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-tight">
            بوابة الإدارة المركزية وتوثيق التجار
          </h1>

          <p className="text-sm text-slate-400 leading-relaxed font-normal">
            قم بتسجيل الدخول إلى حسابك الإداري لإدارة المتاجر الإلكترونية، الطلبات، المخزون، وبوابات الدفع بأمان وتشفير معتمد.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">حماية سيادية متكاملة</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">صلاحيات محكمة لكل دور وظيفي مع معايير أمان معتمدة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-200">معالجة فورية للطلبات</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">مزامنة تلقائية للمبيعات والمدفوعات بكفاءة عالية.</p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              <span>العودة إلى رئيسية المنصة العامة</span>
            </button>
          </div>
        </div>

        {/* Right / Auth Box */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl bg-[#12131a] border border-white/[0.08] shadow-2xl overflow-hidden">
            
            {/* Tabs */}
            <div className="grid grid-cols-2 p-1.5 bg-[#0e0f14] border-b border-white/[0.06] text-xs font-semibold">
              <button
                onClick={() => setMode('login')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === 'login'
                    ? 'bg-white text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                onClick={() => setMode('register')}
                className={`py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                  mode === 'register'
                    ? 'bg-white text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>تدشين متجر جديد</span>
              </button>
            </div>

            <div className="p-6 lg:p-8">
              {mode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">تسجيل الدخول للنظام</h3>
                    <p className="text-xs text-slate-400">اختر المتجر وأدخل بيانات اعتمادك الوظيفية للمتابعة</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">اختر المتجر المستهدف</label>
                    <select
                      value={selectedTenantId}
                      onChange={(e) => {
                        setSelectedTenantId(e.target.value);
                        setActiveTenantId(e.target.value);
                      }}
                      className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
                    >
                      {tenants.map(t => (
                        <option key={t.id} value={t.id} className="bg-[#0a0a0f] text-slate-200">
                          {language === 'ar' ? t.name : t.nameEn} ({t.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">البريد الإلكتروني الوظيفي</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="admin@commerceos.app"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
                      />
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">كلمة المرور</label>
                      <span className="text-[11px] text-slate-400 hover:text-white cursor-pointer transition-colors">نسيت كلمة المرور؟</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl pr-10 pl-10 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-500 transition-colors"
                      />
                      <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#0a0a0f] border border-white/[0.06] space-y-2">
                    <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>دخول تجريبي سريع بضغطة زر</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('store_owner', 'owner@royalhoney.com', 'tenant-royal-honey')}
                        className="p-2 rounded-lg bg-[#12131a] border border-white/[0.06] hover:border-white/[0.15] text-right transition-all group"
                      >
                        <div className="text-[11px] font-semibold text-white group-hover:text-amber-300">متجر العسل الملكي</div>
                        <div className="text-[9px] text-slate-400">مالك النظام</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickDemoLogin('store_owner', 'owner@perfumes.com', 'tenant-luxury-perfumes')}
                        className="p-2 rounded-lg bg-[#12131a] border border-white/[0.06] hover:border-white/[0.15] text-right transition-all group"
                      >
                        <div className="text-[11px] font-semibold text-white group-hover:text-amber-300">عطور رويال</div>
                        <div className="text-[9px] text-slate-400">مالك النظام</div>
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span>جاري التحقق وتسجيل الدخول...</span>
                    ) : (
                      <>
                        <span>الدخول إلى لوحة التحكم</span>
                        <ArrowRight className="w-4 h-4 rotate-180" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">تدشين متجر إلكتروني جديد</h3>
                    <p className="text-xs text-slate-400">أنشئ حساب التاجر الخاص بك ومتجرك السحابي خلال ثوانٍ</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">اسم التاجر / المالك</label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="عبدالله الشمري"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="merchant@store.com"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">اسم المتجر</label>
                      <input
                        type="text"
                        value={regStoreName}
                        onChange={(e) => handleSlugAutoFill(e.target.value)}
                        placeholder="متجر البخور الملكي"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">رابط المتجر (Slug)</label>
                      <input
                        type="text"
                        value={regStoreSlug}
                        onChange={(e) => setRegStoreSlug(e.target.value)}
                        placeholder="royal-incense"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">نوع النشاط التجاري</label>
                      <select
                        value={regBusinessType}
                        onChange={(e) => setRegBusinessType(e.target.value as BusinessType)}
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      >
                        <option value="honey">عسل ومنتجات طبيعية</option>
                        <option value="perfumes">عطور وبخور</option>
                        <option value="fashion">أزياء وموضة</option>
                        <option value="electronics">إلكترونيات وتقنية</option>
                        <option value="general">متجر عام متعدد</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-slate-300">كلمة المرور الإدارية</label>
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full bg-[#0a0a0f] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="cleanStoreCheck"
                      checked={regCleanStore}
                      onChange={(e) => setRegCleanStore(e.target.checked)}
                      className="w-4 h-4 rounded bg-[#0a0a0f] border-white/[0.08] text-amber-500 focus:ring-0"
                    />
                    <label htmlFor="cleanStoreCheck" className="text-xs text-slate-300 cursor-pointer">
                      بدء متجر فارغ ونظيف بدون منتجات افتراضية (Clean Store)
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 rounded-xl bg-white text-slate-950 font-semibold text-xs hover:bg-slate-200 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <span>جاري تأسيس المتجر السحابي...</span>
                    ) : (
                      <>
                        <span>تدشين المتجر وإطلاق لوحة التحكم</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
