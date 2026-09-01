import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Store, Sparkles, ArrowRight, ArrowLeft, Check, Building2, Globe, Coins, ShieldCheck, Loader2 } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { BUSINESS_TYPE_CONFIG } from '../../utils/themeEngine';

export const StoreBuilderWizard: React.FC = () => {
  const { createTenant, setCurrentView, setActiveTenantId, showToast, language } = useCommerce();
  const isAr = language === 'ar';

  const [step, setStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [storeName, setStoreName] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('general');
  const [country, setCountry] = useState<string>('المملكة العربية السعودية');
  const [currency, setCurrency] = useState<string>('SAR');
  const [startingPoint, setStartingPoint] = useState<'scratch' | 'template'>('scratch');

  const [errors, setErrors] = useState<{ storeName?: string }>({});

  const handleNext = () => {
    if (step === 1) {
      if (!storeName.trim()) {
        setErrors({ storeName: isAr ? 'يرجى إدخال اسم المتجر' : 'Please enter store name' });
        return;
      }
      setErrors({});
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleCreateStore = async () => {
    if (!storeName.trim()) return;
    setIsSubmitting(true);
    try {
      const slug = storeName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-') + '-' + Math.random().toString(36).substring(2, 6);

      const newTenant = await createTenant({
        name: storeName.trim(),
        nameEn: storeName.trim(),
        slug,
        description: isAr ? 'متجر جديد' : 'New store',
        businessType: businessType as any,
        currency,
        currencySymbol: currency === 'SAR' ? 'ر.س' : currency === 'AED' ? 'د.إ' : '$',
        country,
        startingPoint
      });

      if (newTenant) {
        setActiveTenantId(newTenant.id);
        showToast(isAr ? 'تم إنشاء متجرك بنجاح!' : 'Store created successfully!', 'success');
        setCurrentView('merchant_dashboard');
      } else {
        throw new Error('Creation failed');
      }
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر إنشاء المتجر. يجيب المحاولة لاحقاً' : 'Failed to create store. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] font-sans antialiased flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#C9A45C]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Header / Brand */}
      <div className="w-full max-w-xl mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black shadow-lg">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-lg text-white tracking-wider">CommerceOS</div>
            <div className="text-xs text-[#97A4B5]">{isAr ? 'إنشاء المتجر الجديد' : 'New Store Setup'}</div>
          </div>
        </div>
        <div className="text-xs font-bold text-[#C9A45C] bg-[#C9A45C]/10 px-3 py-1.5 rounded-full border border-[#C9A45C]/30">
          {isAr ? `الخطوة ${step} من 3` : `Step ${step} of 3`}
        </div>
      </div>

      {/* Main Container Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Progress Bar */}
        <div className="w-full bg-[#152338] h-1.5 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-[#C9A45C] to-[#E6CA7E] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Store Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? -20 : 20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'أنشئ متجرك الإلكتروني' : 'Create Your Store'}
                </h1>
                <p className="text-sm text-[#97A4B5] mt-1">
                  {isAr ? 'أدخل التفاصيل الأساسية لبدء مساحة تجارتك السيادية.' : 'Enter basic details to launch your commerce workspace.'}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">
                    {isAr ? 'اسم المتجر' : 'Store Name'} <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => { setStoreName(e.target.value); setErrors({}); }}
                    placeholder={isAr ? 'مثال: متجر الأناقة أو مؤسسة التمور' : 'e.g. Modern Boutique'}
                    className={`w-full bg-[#050B14] border ${errors.storeName ? 'border-red-500' : 'border-[#233247]'} rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-[#C9A45C] transition-colors`}
                    autoFocus
                  />
                  {errors.storeName && <p className="text-xs text-red-400 mt-1">{errors.storeName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">
                    {isAr ? 'نوع النشاط التجاري' : 'Business Type'}
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A45C] transition-colors"
                  >
                    <option value="general">{isAr ? 'تجارة عامة ومتعددة' : 'General Retail'}</option>
                    <option value="fashion">{isAr ? 'أزياء وملابس' : 'Fashion & Apparel'}</option>
                    <option value="electronics">{isAr ? 'إلكترونيات وتقنية' : 'Electronics & Tech'}</option>
                    <option value="cosmetics">{isAr ? 'عطور ومستحضرات تجميل' : 'Cosmetics & Beauty'}</option>
                    <option value="food">{isAr ? 'أغذية ومشروبات' : 'Food & Beverage'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">
                      {isAr ? 'الدولة / المنطقة' : 'Country / Region'}
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A45C] transition-colors"
                    >
                      <option value="المملكة العربية السعودية">المملكة العربية السعودية</option>
                      <option value="الإمارات العربية المتحدة">الإمارات العربية المتحدة</option>
                      <option value="دولة الكويت">دولة الكويت</option>
                      <option value="دولة قطر">دولة قطر</option>
                      <option value="مملكة البحرين">مملكة البحرين</option>
                      <option value="سلطنة عمان">سلطنة عمان</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">
                      {isAr ? 'العملة الأساسية' : 'Primary Currency'}
                    </label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A45C] transition-colors"
                    >
                      <option value="SAR">SAR (رال سعودي)</option>
                      <option value="AED">AED (درهم إماراتي)</option>
                      <option value="KWD">KWD (دينار كويتي)</option>
                      <option value="QAR">QAR (ريال قطري)</option>
                      <option value="BHD">BHD (دينار بحريني)</option>
                      <option value="OMR">OMR (ريال عماني)</option>
                      <option value="USD">USD (دولار أمريكي)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
                >
                  <span>{isAr ? 'متابعة' : 'Continue'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Starting Point */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? -20 : 20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'كيف تريد البدء؟' : 'Choose Starting Point'}
                </h1>
                <p className="text-sm text-[#97A4B5] mt-1">
                  {isAr ? 'حدد طريقة تهيئة متجرك الأول.' : 'Select how you want to configure your first store.'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div
                  onClick={() => setStartingPoint('scratch')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    startingPoint === 'scratch'
                      ? 'bg-[#C9A45C]/10 border-[#C9A45C]'
                      : 'bg-[#050B14] border-[#233247] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${startingPoint === 'scratch' ? 'border-[#C9A45C] bg-[#C9A45C] text-[#050B14]' : 'border-zinc-600'}`}>
                        {startingPoint === 'scratch' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{isAr ? 'ابدأ من الصفر (متجر نظيف)' : 'Start from Scratch (Clean Store)'}</span>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full">
                      {isAr ? '0 منتجات وهمية' : '0 Fake Data'}
                    </span>
                  </div>
                  <p className="text-xs text-[#97A4B5] ms-7">
                    {isAr ? 'متجر يبدأ بـ 0 منتجات و 0 طلبات، ليمنحك الحرية التامة لإضافة منتجاتك الخاصة.' : 'A pristine store starting with 0 products and 0 orders for full control.'}
                  </p>
                </div>

                <div
                  onClick={() => setStartingPoint('template')}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    startingPoint === 'template'
                      ? 'bg-[#C9A45C]/10 border-[#C9A45C]'
                      : 'bg-[#050B14] border-[#233247] hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-white flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${startingPoint === 'template' ? 'border-[#C9A45C] bg-[#C9A45C] text-[#050B14]' : 'border-zinc-600'}`}>
                        {startingPoint === 'template' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span>{isAr ? 'استخدام قالب تصميم احترافي' : 'Use Professional Template Design'}</span>
                    </div>
                    <span className="text-xs bg-[#C9A45C]/10 text-[#C9A45C] font-bold px-2.5 py-1 rounded-full">
                      {isAr ? 'هيكل جاهز' : 'Ready Structure'}
                    </span>
                  </div>
                  <p className="text-xs text-[#97A4B5] ms-7">
                    {isAr ? 'تطبيق تصميم هيكلي جاهز لمتجرك دون أي بيانات عملاء أو طلبات وهمية.' : 'Apply a clean structural design template with zero sample orders or customers.'}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="bg-[#152338] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1f324d] transition-colors flex items-center gap-2"
                >
                  {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span>{isAr ? 'السابق' : 'Back'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
                >
                  <span>{isAr ? 'متابعة' : 'Continue'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Summary & Explicit Confirmation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isAr ? -20 : 20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {isAr ? 'ملخص إعداد المتجر' : 'Store Setup Summary'}
                </h1>
                <p className="text-sm text-[#97A4B5] mt-1">
                  {isAr ? 'راجع التفاصيل أدناه لإنشاء متجرك السيادي الحقيقي.' : 'Review details below to establish your sovereign store.'}
                </p>
              </div>

              <div className="bg-[#050B14] border border-[#233247] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-[#233247]">
                  <span className="text-xs text-[#97A4B5]">{isAr ? 'اسم المتجر' : 'Store Name'}</span>
                  <span className="font-bold text-white">{storeName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#233247]">
                  <span className="text-xs text-[#97A4B5]">{isAr ? 'نوع النشاط' : 'Business Type'}</span>
                  <span className="font-bold text-white capitalize">{businessType}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#233247]">
                  <span className="text-xs text-[#97A4B5]">{isAr ? 'الدولة' : 'Country'}</span>
                  <span className="font-bold text-white">{country}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-[#233247]">
                  <span className="text-xs text-[#97A4B5]">{isAr ? 'العملة' : 'Currency'}</span>
                  <span className="font-bold text-[#C9A45C]">{currency}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-[#97A4B5]">{isAr ? 'نقطة البداية' : 'Starting Point'}</span>
                  <span className="font-bold text-white">
                    {startingPoint === 'scratch' ? (isAr ? 'من الصفر (0 بيانات)' : 'From Scratch (0 Data)') : (isAr ? 'قالب تصميم احترافي' : 'Professional Template')}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-xs text-[#C9A45C] flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>{isAr ? 'سيتم إنشاء المتجر مباشرة على قاعدة البيانات السيادية مع لوحة تحكم نظيفة وخالية من أي بيانات وهمية.' : 'Your store will be created directly on the secure sovereign database with a pristine dashboard.'}</span>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="bg-[#152338] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1f324d] transition-colors flex items-center gap-2"
                >
                  {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span>{isAr ? 'السابق' : 'Back'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateStore}
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-bold px-8 py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{isAr ? 'جاري إنشاء متجرك...' : 'Creating Store...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{isAr ? 'إنشاء المتجر' : 'Create Store'}</span>
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
};
