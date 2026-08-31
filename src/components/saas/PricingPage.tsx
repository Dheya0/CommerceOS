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
    <div className="min-h-screen bg-[#07090e] text-zinc-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden" dir="rtl">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خطط وأسعار منصة CommerceOS السحابية</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            اختر الخطة المناسبة <span className="bg-gradient-to-l from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">لتوسيع وتنمية تجارتك الرقمية</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            منصة تجارة إلكترونية سيادية متكاملة، بدون عمولات خفية على مبيعاتك، مع بنية تحتية سحابية عالية الموثوقية وميزات قابلة للتوسع الفوري.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-6 flex items-center justify-center">
            <div className="bg-zinc-900/90 border border-zinc-800 p-1.5 rounded-2xl flex items-center gap-1 shadow-xl">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                الدفع الشهري
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>الدفع السنوي</span>
                <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[11px] font-black uppercase">
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
              <div key={n} className="h-96 rounded-3xl bg-zinc-900/50 border border-zinc-800" />
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
                      ? 'bg-gradient-to-b from-blue-950/40 via-zinc-900/90 to-zinc-950 border-2 border-blue-500/60 shadow-2xl shadow-blue-950/50 scale-[1.02]' 
                      : isEnterprise
                      ? 'bg-gradient-to-b from-amber-950/30 via-zinc-900/90 to-zinc-950 border border-amber-500/40 shadow-xl'
                      : 'bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      <span>الأكثر اختياراً للمتاجر الصاعدة</span>
                    </div>
                  )}

                  {/* Header */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{plan.nameAr}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{plan.name}</p>
                      </div>
                      {plan.id === 'starter' && <Zap className="w-6 h-6 text-zinc-400" />}
                      {plan.id === 'growth' && <Sparkles className="w-6 h-6 text-blue-400" />}
                      {plan.id === 'business' && <ShieldCheck className="w-6 h-6 text-indigo-400" />}
                      {plan.id === 'enterprise' && <Crown className="w-6 h-6 text-amber-400" />}
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed min-h-[40px]">
                      {plan.descriptionAr}
                    </p>

                    {/* Price Display */}
                    <div className="py-2 border-y border-zinc-800/80">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-white">{price}</span>
                        <span className="text-xs text-zinc-400 font-bold">ر.س / شهرياً</span>
                      </div>
                      {billingCycle === 'yearly' && plan.annualPrice > 0 && (
                        <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                          تفوتر سنوياً بقيمة {plan.annualPrice} ر.س (وفرت 20%)
                        </p>
                      )}
                      {plan.monthlyPrice === 0 && (
                        <p className="text-[11px] text-blue-400 font-semibold mt-1">
                          تجربة مجانية لمدة 14 يوماً بدون بطاقة بنكية
                        </p>
                      )}
                    </div>

                    {/* Features List */}
                    <div className="space-y-2.5 pt-2">
                      <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">ما تتضمنه الباقة:</p>
                      <ul className="space-y-2">
                        {plan.featuresListAr.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300 leading-snug">
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
                        className="w-full py-3 px-4 rounded-xl bg-zinc-800 text-zinc-400 text-xs font-bold flex items-center justify-center gap-2 cursor-default border border-zinc-700"
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
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                            : isEnterprise
                            ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
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
        <div className="mb-24 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-black text-white">مقارنة شاملة لجميع الميزات والمحددات</h2>
            <p className="text-xs text-zinc-400 mt-1">جدول تفصيلي يوضح كافة الإمكانيات والحدود التشغيلية لكل باقة تجارية</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 font-bold">
                  <th className="pb-4 pr-4">الميزة / المحدد</th>
                  <th className="pb-4 text-center">الابتدائية (Starter)</th>
                  <th className="pb-4 text-center">النمو (Growth)</th>
                  <th className="pb-4 text-center">الأعمال (Business)</th>
                  <th className="pb-4 text-center">السيادية (Enterprise)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>الحد الأقصى للمنتجات</span>
                  </td>
                  <td className="py-3.5 text-center">50 منتج</td>
                  <td className="py-3.5 text-center font-bold text-blue-400">500 منتج</td>
                  <td className="py-3.5 text-center font-bold text-indigo-400">5,000 منتج</td>
                  <td className="py-3.5 text-center font-bold text-amber-400">غير محدود (Unlimited)</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">الطلبات الشهرية (0% عمولة)</td>
                  <td className="py-3.5 text-center">200 طلب</td>
                  <td className="py-3.5 text-center font-bold text-blue-400">2,500 طلب</td>
                  <td className="py-3.5 text-center font-bold text-indigo-400">20,000 طلب</td>
                  <td className="py-3.5 text-center font-bold text-amber-400">غير محدود</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">حسابات الموظفين وصلاحيات RBAC</td>
                  <td className="py-3.5 text-center">حساب 1 (المالك)</td>
                  <td className="py-3.5 text-center">5 حسابات</td>
                  <td className="py-3.5 text-center">15 حساب</td>
                  <td className="py-3.5 text-center font-bold text-amber-400">غير محدود</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <span>ربط دومين مخصص (Custom Domain + SSL)</span>
                  </td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">2 دومين</td>
                  <td className="py-3.5 text-center text-emerald-400 font-bold">5 دومينات</td>
                  <td className="py-3.5 text-center text-amber-400 font-bold">20 دومين</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white">إزالة علامة CommerceOS (White-Label)</td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-amber-400 font-bold">مشمول بالكامل</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-400" />
                    <span>مفاتيح REST API وخطافات الويب (Webhooks)</span>
                  </td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-amber-400 font-bold">مشمول عالي السرعة</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>فواتير ضريبية وتقارير ZATCA</span>
                  </td>
                  <td className="py-3.5 text-center text-zinc-500">—</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                  <td className="py-3.5 text-center text-emerald-400">مشمول</td>
                </tr>
                <tr>
                  <td className="py-3.5 pr-4 font-bold text-white flex items-center gap-2">
                    <Server className="w-4 h-4 text-amber-400" />
                    <span>اتفاقية مستوى الخدمة وسرعة الدعم (SLA)</span>
                  </td>
                  <td className="py-3.5 text-center text-zinc-400">دعم إلكتروني</td>
                  <td className="py-3.5 text-center text-blue-300">99.5% Uptime</td>
                  <td className="py-3.5 text-center text-indigo-300">99.5% أولوية 24/7</td>
                  <td className="py-3.5 text-center text-amber-400 font-bold">99.9% مدير مخصص</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">الأسئلة الشائعة حول الفوترة والاشتراكات</h2>
            <p className="text-xs text-zinc-400 mt-1">كل ما تحتاج لمعرفته حول سياسات الفواتير والترقية والإلغاء</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-right gap-4"
                  >
                    <span className="text-sm font-bold text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p className="text-xs text-zinc-400 leading-relaxed mt-3 pt-3 border-t border-zinc-800/60">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal & Compliance Footer Note */}
        <div className="text-center text-xs text-zinc-500 space-y-1">
          <p>جميع الأسعار بالريال السعودي (SAR) وغير شاملة ضريبة القيمة المضافة 15% والتي تضاف عند الدفع.</p>
          <p>بتفعيلك للاشتراك، فإنك توافق على <span className="text-zinc-400 underline">شروط الخدمة</span> و <span className="text-zinc-400 underline">سياسة الخصوصية</span> لمنصة CommerceOS.</p>
        </div>

      </div>

      {/* Checkout Modal */}
      {selectedPlanForCheckout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">تأكيد ترقية الاشتراك السحابي</h3>
                  <p className="text-xs text-zinc-400">متجر: {activeTenant?.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlanForCheckout(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                ✕
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>الباقة المختارة:</span>
                <span className="font-bold text-white">{selectedPlanForCheckout.nameAr}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>دورة الفوترة:</span>
                <span className="font-bold text-blue-400">{billingCycle === 'yearly' ? 'سنوية (خصم شهرين)' : 'شهرية'}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>المبلغ الأساسي:</span>
                <span className="font-mono">{billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice} ر.س</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>ضريبة القيمة المضافة (15% VAT):</span>
                <span className="font-mono">
                  {(Math.round((billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice) * 0.15 * 100) / 100).toFixed(2)} ر.س
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                <span>الإجمالي المستحق اليوم:</span>
                <span className="text-emerald-400 font-black font-mono">
                  {(Math.round((billingCycle === 'yearly' ? selectedPlanForCheckout.annualPrice : selectedPlanForCheckout.monthlyPrice) * 1.15 * 100) / 100).toFixed(2)} ر.س
                </span>
              </div>
            </div>

            {/* Payment Method Selector Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">طريقة سداد الفاتورة:</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-blue-500/50 bg-blue-500/10 p-2.5 rounded-xl text-center text-xs font-bold text-blue-300 flex items-center justify-center gap-1.5 cursor-pointer">
                  <span>بطاقة مدى / ائتمان</span>
                </div>
                <div className="border border-zinc-800 bg-zinc-950 p-2.5 rounded-xl text-center text-xs font-bold text-zinc-400 flex items-center justify-center gap-1.5 opacity-60">
                  <span>Apple Pay</span>
                </div>
                <div className="border border-zinc-800 bg-zinc-950 p-2.5 rounded-xl text-center text-xs font-bold text-zinc-400 flex items-center justify-center gap-1.5 opacity-60">
                  <span>حوالة بنكية</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPlanForCheckout(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-all"
              >
                إلغاء
              </button>
              <button
                type="button"
                disabled={checkoutSubmitting}
                onClick={handleConfirmSubscription}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
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
