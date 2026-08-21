import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Award, 
  Sparkles, 
  Star, 
  ChevronDown, 
  Crown, 
  Heart, 
  Droplet, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  MessageCircle
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Category, Product } from '../../types';

interface StorefrontSectionsProps {
  onSelectCategory: (categoryId: string | null) => void;
  selectedCategory: string | null;
  onOpenProduct: (product: Product) => void;
}

export const StorefrontHero: React.FC = () => {
  const { activeTenant } = useCommerce();
  const theme = activeTenant.theme;
  const tokens = theme.tokens;

  return (
    <section 
      className="relative overflow-hidden py-12 sm:py-20 border-b"
      style={{ 
        backgroundColor: theme.style === 'luxury' ? tokens.surfaceMuted : tokens.surface,
        borderColor: tokens.border 
      }}
    >
      {/* Subtle Pattern / Decorative Glow */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: tokens.primary }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-right space-y-5">
            <div 
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black shadow-sm"
              style={{ backgroundColor: tokens.primaryLight, color: tokens.primaryDark }}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>{activeTenant.slogan || 'المتجر الرسمي المعتمد'}</span>
            </div>

            <h1 
              className="text-3xl sm:text-5xl font-black leading-tight tracking-tight"
              style={{ color: tokens.text }}
            >
              {activeTenant.name}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed opacity-80 max-w-xl">
              {activeTenant.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#products-section"
                className="py-3 px-6 rounded-xl text-white font-black text-xs sm:text-sm shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
                style={{ backgroundColor: tokens.primary }}
              >
                <span>تصفح المنتجات والعروض</span>
                <ArrowLeft className="w-4 h-4" />
              </a>

              <div className="flex items-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold" style={{ borderColor: tokens.border }}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>ضمان ذهبي 100% ومفحوص مخبرياً</span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t max-w-lg" style={{ borderColor: tokens.border }}>
              <div>
                <div className="text-base sm:text-xl font-black" style={{ color: tokens.primary }}>+10,000</div>
                <div className="text-[11px] text-slate-400">عميل سعيد وموثق</div>
              </div>
              <div>
                <div className="text-base sm:text-xl font-black" style={{ color: tokens.primary }}>100%</div>
                <div className="text-[11px] text-slate-400">طبيعي ونقي تماماً</div>
              </div>
              <div>
                <div className="text-base sm:text-xl font-black" style={{ color: tokens.primary }}>24 ساعة</div>
                <div className="text-[11px] text-slate-400">سرعة تجهيز الشحن</div>
              </div>
            </div>
          </div>

          {/* Right Featured Hero Image */}
          <div className="lg:col-span-5 relative">
            <div 
              className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border transition-all duration-300 hover:scale-[1.02]"
              style={{ borderColor: tokens.border }}
            >
              <img 
                src={activeTenant.logo} 
                alt={activeTenant.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 right-4 left-4 text-white text-right">
                <div className="text-xs font-bold text-amber-300">أصالة وجودة لا تضاهى</div>
                <div className="text-sm font-black">{activeTenant.slogan}</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export const StorefrontCategories: React.FC<{
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}> = ({ categories, selectedCategory, onSelectCategory }) => {
  const { activeTenant } = useCommerce();
  const tokens = activeTenant.theme.tokens;

  return (
    <section className="py-6 border-b" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === null ? 'shadow-md text-white' : 'opacity-80 hover:opacity-100'
            }`}
            style={{
              backgroundColor: selectedCategory === null ? tokens.primary : tokens.background,
              borderColor: selectedCategory === null ? tokens.primary : tokens.border,
              color: selectedCategory === null ? '#ffffff' : tokens.text
            }}
          >
            جميع الأصناف
          </button>

          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected ? 'shadow-md text-white' : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? tokens.primary : tokens.background,
                  borderColor: isSelected ? tokens.primary : tokens.border,
                  color: isSelected ? '#ffffff' : tokens.text
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const StorefrontBenefits: React.FC = () => {
  const { activeTenant } = useCommerce();
  const tokens = activeTenant.theme.tokens;

  const benefits = [
    { title: 'فحص مخبري معتمد 100%', desc: 'كل دفعة مصحوبة بشهادة تحليل نقاء معتمدة من مختبرات الجودة والغذاء.', icon: ShieldCheck },
    { title: 'توصيل مبرد وسريع', desc: 'شحن آمن في مركبات مبردة مخصصة للحفاظ على الخصائص والإنزيمات الحية.', icon: Truck },
    { title: 'ضمان الاسترجاع الذهبي', desc: 'في حال لم يطابق المنتج توقعاتك، يحق لك الاسترجاع واسترداد القيمة فوراً.', icon: Award },
    { title: 'خيارات دفع مرنة وآمنة', desc: 'دعم كامل لمدى، Apple Pay، والتقسيط المريح عبر تمارا بدون فوائد.', icon: CheckCircle2 }
  ];

  return (
    <section className="py-12 border-b" style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black" style={{ color: tokens.primary }}>التزامنا تجاهكم</span>
          <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: tokens.text }}>
            معايير الجودة والضمان الفاخر
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div 
                key={i}
                className="p-5 rounded-2xl border text-right transition-all hover:shadow-lg"
                style={{ backgroundColor: tokens.background, borderColor: tokens.border }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 shadow-md"
                  style={{ backgroundColor: tokens.primaryLight, color: tokens.primaryDark }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold mb-1" style={{ color: tokens.text }}>{b.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const StorefrontTestimonials: React.FC = () => {
  const { activeTenant } = useCommerce();
  const tokens = activeTenant.theme.tokens;

  const reviews = [
    { name: 'فهد الشمري', city: 'الرياض', comment: 'ما شاء الله عسل السدر الجبلي ممتاز جداً وقوامه ملكي، وسرعة التوصيل في نفس اليوم كانت مبهرة!', rating: 5, date: 'قبل يومين' },
    { name: 'د. منيرة الدوسري', city: 'الخبر', comment: 'خلطة المناعة أصبحت روتين يومي لعائلتي، نقاء وطعم لا يعلى عليه مع فحص مخبري موثوق.', rating: 5, date: 'قبل 4 أيام' },
    { name: 'خالد باوزير', city: 'جدة', comment: 'التغليف فاخر جداً ومناسب للإهداء. تعامل راقي وسعر يستحق كل ريال.', rating: 5, date: 'قبل أسبوع' }
  ];

  return (
    <section className="py-12 border-b" style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-black" style={{ color: tokens.primary }}>تجارب حقيقية</span>
          <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: tokens.text }}>
            ماذا يقول عملاؤنا الكرام؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev, i) => (
            <div 
              key={i}
              className="p-5 rounded-2xl border flex flex-col justify-between text-right"
              style={{ backgroundColor: tokens.background, borderColor: tokens.border }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
                <p className="text-xs leading-relaxed opacity-85 mb-4">"{rev.comment}"</p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: tokens.border }}>
                <div 
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: tokens.primary }}
                >
                  {rev.name[0]}
                </div>
                <div>
                  <div className="text-xs font-bold" style={{ color: tokens.text }}>{rev.name}</div>
                  <div className="text-[10px] text-slate-400">{rev.city} (عميل موثق)</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StorefrontFAQ: React.FC = () => {
  const { activeTenant } = useCommerce();
  const tokens = activeTenant.theme.tokens;

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: 'هل المنتجات مفحوصة ومضمونة مخبرياً؟', a: 'نعم، تخضع كافة أعسالنا ومنتجاتنا لفحص مخبري دوري دقيق للتأكد من خلوها تماماً من السكريات المضافة والمتبقيات ونقاء إنزيمات العسل الطبيعية.' },
    { q: 'كم يستغرق التوصيل والشحن؟', a: 'داخل مدينة الرياض يتم التوصيل خلال ساعات معدودة، وباقي مدن المملكة خلال 1-3 أيام عمل عبر أسطول شحن مبرد ومخصص.' },
    { q: 'ما هي سياسة الاسترجاع والضمان؟', a: 'نقدم ضماناً ذهبياً كاملاً: إذا لم يعجبك طعم أو جودة العسل لأي سبب، يمكنك طلب استرجاع المبلغ بالكامل دون أي تعقيد.' },
    { q: 'كيف يمكنني تقسيط قيمة الطلب؟', a: 'يمكنك اختيار الدفع عبر تمارا عند صفحة الدفع وتقسيم المبلغ على 4 دفعات ميسرة بدون أي فوائد إضافية.' }
  ];

  return (
    <section className="py-12 border-b" style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-xs font-black" style={{ color: tokens.primary }}>إجابات واضحة</span>
          <h2 className="text-xl sm:text-2xl font-black mt-1" style={{ color: tokens.text }}>
            الأسئلة الأكثر شيوعاً
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="rounded-xl border overflow-hidden transition-all text-right"
              style={{ backgroundColor: tokens.background, borderColor: tokens.border }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-4 flex items-center justify-between text-xs sm:text-sm font-bold text-right"
                style={{ color: tokens.text }}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openIndex === i ? 'rotate-180 text-amber-500' : 'text-slate-400'}`} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-xs leading-relaxed text-slate-500 border-t pt-2" style={{ borderColor: tokens.border }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const StorefrontFooter: React.FC = () => {
  const { activeTenant } = useCommerce();
  const tokens = activeTenant.theme.tokens;

  return (
    <footer 
      className="py-12 border-t text-right"
      style={{ backgroundColor: tokens.background, borderColor: tokens.border }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <img src={activeTenant.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-base font-black" style={{ color: tokens.text }}>{activeTenant.name}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {activeTenant.description}
            </p>
            <div className="text-xs text-slate-400">
              <span>الرقم الضريبي / السجل التجاري معتمد لدى منصة الأعمال السعودية.</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-black mb-3" style={{ color: tokens.text }}>روابط المتجر</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#products-section" className="hover:text-amber-500 transition-colors">كافة المنتجات</a></li>
              <li><a href="#benefits" className="hover:text-amber-500 transition-colors">شهادات الجودة والمختبر</a></li>
              <li><a href="#faq" className="hover:text-amber-500 transition-colors">الأسئلة الشائعة</a></li>
              <li><a href="#contact" className="hover:text-amber-500 transition-colors">الشحن والتوصيل</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black mb-3" style={{ color: tokens.text }}>تواصل وخدمة العملاء</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div>الهاتف: <span className="font-mono text-slate-300">{activeTenant.contact.phone}</span></div>
              <div>البريد: <span className="font-mono text-slate-300">{activeTenant.contact.email}</span></div>
              <div>الموقع: <span>{activeTenant.contact.city}، {activeTenant.contact.country}</span></div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3" style={{ borderColor: tokens.border }}>
          <div>
            جميع الحقوق محفوظة © {activeTenant.name} 2026 • مدعوم بواسطة <span className="font-bold text-amber-500">CommerceOS</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>بوابات دفع مشفرة وآمنة 🔒</span>
            <span>Mada • Apple Pay • Visa • Tamara</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
