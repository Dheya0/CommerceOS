import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Crown, 
  Layers, 
  Globe, 
  Lock, 
  HelpCircle, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Server,
  Code2,
  FileCheck
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { SaaSPlan, SaaSPlanId } from '../../types/saas';
import { api } from '../../api/client';

export const PricingPage: React.FC = () => {
  const { activeTenant, showToast, refreshFromBackend, setCurrentView } = useCommerce();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [plans, setPlans] = useState<SaaSPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SaaSPlan | null>(null);
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await api.getSaaSPlans();
        if (res.data?.plans) {
          setPlans(res.data.plans);
        }
      } catch (err: any) {
        console.error('Failed to load SaaS plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = (plan: SaaSPlan) => {
    setSelectedPlanForCheckout(plan);
  };

  const handleConfirmSubscription = async () => {
    if (!selectedPlanForCheckout) return;
    try {
      setCheckoutSubmitting(true);
      const res = await api.upgradeSaaSPlan(selectedPlanForCheckout.id, billingCycle);
      showToast(res.message || `تمت الترقية إلى باقة ${selectedPlanForCheckout.nameAr} بنجاح!`, 'success');
      await refreshFromBackend();
      setSelectedPlanForCheckout(null);
      setCurrentView('merchant_dashboard');
    } catch (err: any) {
      showToast(err.message || 'فشلت عملية الترقية', 'error');
    } finally {
      setCheckoutSubmitting(false);
    }
  };

  const currentTenantPlanId = activeTenant?.plan || 'starter';

  const faqs = [
    {
      q: 'هل يمكنني تغيير خطة اشتراكي أو الترقية في أي وقت؟',
      a: 'نعم بكل تأكيد! يمكنك الترقية في أي وقت وسيقوم النظام فورياً بفتح الصلاحيات والمحددات الجديدة مع احتساب الفارق النسبي (Prorated) للفترة المتبقية.'
    },
    {
      q: 'ماذا يحدث لبيانات متجري ومنتجاتي في حال تخفيض الخطة (Downgrade)؟',
      a: 'نظام CommerceOS يضمن حماية بياناتك بالكامل؛ لن يتم حذف أي منتج أو طلب سابق، لكن لن تتمكن من إضافة منتجات جديدة تتجاوز الحد الأقصى للباقة الأدنى حتى يتم التوافق مع المحددات.'
    },
    {
      q: 'هل الفواتير الصادرة معتمدة ومطابقة لمتطلبات هيئة الزكاة والضريبة (ZATCA)؟',
      a: 'نعم، جميع الفواتير الصادرة من CommerceOS تتضمن رمز الاستجابة السريع المشفر (TLV Base64 QR)، الرقم الضريبي الرسمي، ونسبة ضريبة القيمة المضافة 15% المعمول بها في المملكة.'
    },
    {
      q: 'هل يتضمن الاشتراك شهادة أمان SSL ونطاق مخصص مجاني؟',
      a: 'نعم، بدءاً من باقة النمو (Growth) يمكنك ربط نطاقك المخصص (.sa / .com) مع توليد وتجديد شهادات SSL التلقائية مجاناً وبدون أي رسوم إضافية.'
    },
    {
      q: 'ما هي اتفاقية مستوى الخدمة (SLA) وسرعة الدعم الفني؟',
      a: 'نضمن جاهزية تشغيلية بنسبة 99.5% للباقات التجارية و99.9% للباقة السيادية مع دعم فني متواصل ومراقبة استباقية لكافة العمليات.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-[#C9A45C]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-[#C9A45C]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1422] border border-[#233247] text-[#C9A45C] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطط وأسعار منصة CommerceOS السحابية</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            اختر الخطة المناسبة <span className="text-[#C9A45C]">لتوسيع وتنمية تجارتك السيادية</span>
          </h1>
          <p className="text-[#97A4B5] text-base sm:text-lg leading-relaxed">
            منصة تجارة إلكترونية سيادية متكاملة، بدون عمولات خفية على مبيعاتك، مع بنية تحتية سحابية عالية الموثوقية وميزات قابلة للتوسع الفوري.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-6 flex items-center justify-center">
            <div className="bg-[#0B1422] border border-[#233247] p-1.5 rounded-2xl flex items-center gap-1 shadow-xl">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-[#C9A45C] text-[#050B14] shadow-lg shadow-[#C9A45C]/20'
                    : 'text-[#97A4B5] hover:text-[#F4F6F8]'
                }`}
              >
                الدفع الشهري
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-[#C9A45C] text-[#050B14] shadow-lg shadow-[#C9A45C]/20'
                    : 'text-[#97A4B5] hover:text-[#F4F6F8]'
                }`}
              >
                <span>الدفع السنوي</span>
                <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-black uppercase">
                  خصم 20% (شهران مجاناً)
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-96 rounded-3xl bg-[#0B1422] border border-[#233247]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-20">
            {plans.map((plan) => {
              const isCurrent = currentTenantPlanId === plan.id;
              const price = billingCycle === 'yearly' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
              const isPopular = plan.isPopular;
              const isEnterprise = plan.id === 'enterprise';

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    isPopular 
                      ? 'bg-[#0B1422] border-2 border-[#C9A45C] shadow-2xl shadow-[#C9A45C]/10 scale-[1.02]' 
                      : isEnterprise
                      ? 'bg-[#0B1422] border border-[#C9A45C]/40 shadow-xl'
                      : 'bg-[#0B1422] border border-[#233247] hover:border-[#C9A45C]/30'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] text-xs font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5 border border-[#E0C078]/40">
                      <Crown className="w-3.5 h-3.5" />
                      <span>الأكثر اختياراً للمتاجر الصاعدة</span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.nameAr}</h3>
                        <p className="text-xs text-[#97A4B5] mt-0.5">{plan.name}</p>
                      </div>
                      {plan.id === 'starter' && <Zap className="w-6 h-6 text-[#97A4B5]" />}
                      {plan.id === 'growth' && <Sparkles className="w-6 h-6 text-[#C9A45C]" />}
                      {plan.id === 'business' && <ShieldCheck className="w-6 h-6 text-[#E0C078]" />}
                      {plan.id === 'enterprise' && <Crown className="w-6 h-6 text-[#C9A45C]" />}
                    </div>

                    <p className="text-xs text-[#97A4B5] leading-relaxed min-h-[40px]">
                      {plan.descriptionAr}
                    </p>

                    {/* Price Display */}
                    <div className="py-2 border-y border-[#233247]">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white">{price}</span>
                        <span className="text-xs text-[#97A4B5] font-bold">ر.س / شهرياً</span>
                      </div>
                      {billingCycle === 'yearly' && plan.annualPrice > 0 && (
                        <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                          تفوتر سنوياً بقيمة {plan.annualPrice} ر.س (وفرت 20%)
                        </p>
                      )}
                      {plan.monthlyPrice === 0 && (
                        <p className="text-[11px] text-[#C9A45C] font-semibold mt-1">
                          تجربة مجانية لمدة 14 يوماً بدون بطاقة بنكية
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">ما تتضمنه الباقة:</p>
                      <ul className="space-y-2">
                        {plan.featuresListAr.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-snug">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="pt-8">
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-3 px-4 rounded-xl bg-[#101B2C] text-[#97A4B5] text-xs font-bold flex items-center justify-center gap-2 cursor-default border border-[#233247]"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>باقتك النشطة الحالية</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full py-3.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg ${
                          isPopular
                            ? 'bg-[#C9A45C] hover:bg-[#E0C078] text-[#050B14] shadow-[#C9A45C]/20'
                            : isEnterprise
                            ? 'bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] hover:brightness-105 text-[#050B14] shadow-[#C9A45C]/20'
                            : 'bg-[#101B2C] hover:bg-[#142238] text-white border border-[#233247]'
                        }`}
                      >
                        <span>{plan.monthlyPrice === 0 ? 'بدء التجربة المجانية' : 'ترقية المتجر الآن'}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Feature Comparison Matrix Table */}
        <div className="mb-24 bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-white">مقارنة شاملة لجميع الميزات والمحددات</h2>
            <p className="text-xs text-[#97A4B5] mt-1">جدول تفصيلي يوضح كافة الإمكانيات والحدود التشغيلية لكل باقة تجارية</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-[#233247] text-[#97A4B5] font-bold">
                  <th className="pb-4 pr-4">الميزة / المحدد</th>
                  <th className="pb-4 text-center">الابتدائية (Starter)</th>
                  <th className="pb-4 text-center">النمو (Growth)</th>
                  <th className="pb-4 text-center">الأعمال (Business)</th>
                  <th className="pb-4 text-center">السيادية (Enterprise)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233247]/60 text-slate-300">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#C9A45C]" />
                    <span>الحد الأقصى للمنتجات</span>
                  </td>
                  <td className="py-3.5 text-center">50 منتج</td>
                  <td className="py-3.5 text-center font-bold text-[#C9A45C]">500 منتج</td>
                  <td className="py-3.5 text-center font-bold text-[#E0C078]">5,000 منتج</td>
                  <td className="py-3.5 text-center font-bold text-[#C9A45C]">غير محدود (Unlimited)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">الطلبات الشهرية (0% عمولة)</td>
                  <td className="py-3.5 text-center">200 طلب</td>
                  <td className="py-3.5 text-center font-bold text-[#C9A45C]">2,500 طلب</td>
                  <td className="py-3.5 text-center font-bold text-[#E0C078]">20,000 طلب</td>
                  <td className="py-3.5 text-center font-bold text-[#C9A45C]">غير محدود</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">حسابات الموظفين وصلاحيات RBAC</td>
                  <td className="py-3.5 text-center">حساب 1 (المالك)</td>
                  <td className="py-3.5 text-center">5 حسابات</td>
                  <td className="py-3.5 text-center">15 حساب</td>
                  <td className="py-3.5 text-center font-bold text-[#C9A45C]">غير محدود</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>ربط دومين مخصص (Custom Domain + SSL)</span>
                  </td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">2 دومين</td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">5 دومينات</td>
                  <td className="py-3.5 text-center text-[#C9A45C] font-bold">20 دومين</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">إزالة علامة CommerceOS (White-Label)</td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-[#C9A45C] font-bold">مشمول بالكامل</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#E0C078]" />
                    <span>مفاتيح REST API وخطافات الويب (Webhooks)</span>
                  </td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-[#C9A45C] font-bold">مشمول عالي السرعة</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-[#C9A45C]" />
                    <span>فواتير ضريبية وتقارير ZATCA</span>
                  </td>
                  <td className="py-3.5 text-center text-slate-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-[#C9A45C]" />
                    <span>اتفاقية مستوى الخدمة وسرعة الدعم (SLA)</span>
                  </td>
                  <td className="py-3.5 text-center text-[#97A4B5]">دعم إلكتروني</td>
                  <td className="py-3.5 text-center text-slate-200">99.5% Uptime</td>
                  <td className="py-3.5 text-center text-slate-200">99.5% أولوية 24/7</td>
                  <td className="py-3.5 text-center text-[#C9A45C] font-bold">99.9% مدير مخصص</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">الأسئلة الشائعة حول الفوترة والاشتراكات</h2>
            <p className="text-xs text-[#97A4B5] mt-1">كل ما تحتاج لمعرفته حول سياسات الفواتير والترقية والإلغاء</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-[#0B1422] border border-[#233247] rounded-2xl p-4 sm:p-5 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-right gap-4"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#C9A45C] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#97A4B5] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-[#97A4B5] leading-relaxed mt-3 pt-3 border-t border-[#233247]/60">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal & Compliance Footer Note */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>جميع الأسعار بالريال السعودي (SAR) وغير شاملة ضريبة القيمة المضافة 15% والتي تضاف عند الدفع.</p>
          <p>بتفعيلك للاشتراك، فإنك توافق على <span className="text-slate-400 underline">شروط الخدمة</span> و <span className="text-slate-400 underline">سياسة الخصوصية</span> لمنصة CommerceOS.</p>
        </div>

      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-[#233247] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">تأكيد ترقية الاشتراك السحابي</h3>
                  <p className="text-xs text-[#97A4B5]">متجر: {activeTenant?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1 rounded-lg text-[#97A4B5] hover:text-white hover:bg-[#101B2C]"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-[#050B14] border border-[#233247] rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>الباقة المختارة:</span>
                <span className="font-bold text-white">{selectedPlanForCheckout.nameAr}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>دورة الفوترة:</span>
                <span className="font-bold text-[#C9A45C]">{billingCycle === 'yearly' ? 'سنوية (خصم شهرين)' : 'شهرية'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>المبلغ الأساسي:</span>
                <span className="font-mono">{billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice} ر.س</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>ضريبة القيمة المضافة (15% VAT):</span>
                <span className="font-mono">
                  {(Math.round((billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice) * 0.15 * 100) / 100).toFixed(2)} ر.س
                </span>
              </div>
              <div className="pt-2 border-t border-[#233247] flex justify-between text-sm font-bold text-white">
                <span>الإجمالي المستحق اليوم:</span>
                <span className="text-emerald-400 font-black font-mono">
                  {(Math.round((billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice) * 1.15 * 100) / 100).toFixed(2)} ر.س
                </span>
              </div>
            </div>

            {/* Payment Method Selector Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">طريقة سداد الفاتورة:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-[#C9A45C]/50 bg-[#C9A45C]/10 p-2.5 rounded-xl text-center text-xs font-bold text-[#E0C078] flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>بطاقة مدى / ائتمان</span>
                </div>
                <div className="border border-[#233247] bg-[#050B14] p-2.5 rounded-xl text-center text-xs font-bold text-[#97A4B5] flex items-center justify-center gap-1.5 opacity-60">
                  <span>Apple Pay</span>
                </div>
                <div className="border border-[#233247] bg-[#050B14] p-2.5 rounded-xl text-center text-xs font-bold text-[#97A4B5] flex items-center justify-center gap-1.5 opacity-60">
                  <span>حوالة بنكية</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="flex-1 py-3 rounded-xl bg-[#101B2C] hover:bg-[#142238] text-[#97A4B5] text-xs font-bold transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={checkoutSubmitting}
                onClick={handleConfirmSubscription}
                className="flex-1 py-3 rounded-xl bg-[#C9A45C] hover:bg-[#E0C078] text-[#050B14] text-xs font-black shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-2"
              >
                {checkoutSubmitting ? (
                  <span>جاري معالجة الاشتراك...</span>
                ) : (
                  <>
                    <span>تأكيد ودفع الفاتورة</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
