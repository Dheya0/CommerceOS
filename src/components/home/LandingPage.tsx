import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  ArrowRight, 
  Store, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CreditCard, 
  Box, 
  TrendingUp,
  Layers,
  CheckCircle2,
  Lock,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    isAuthenticated,
    currentUser,
    logout,
    language
  } = useCommerce();

  const isAr = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C9A45C]/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* HEADER / NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#050B14]/85 backdrop-blur-xl border-b border-[#233247]/60 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black shadow-lg shadow-[#C9A45C]/10">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">CommerceOS</div>
              <div className="text-[10px] text-[#C9A45C] font-bold uppercase tracking-wider">{isAr ? 'منصة التجارة السيادية' : 'Sovereign Commerce'}</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#97A4B5]">
            <a href="#platform" className="hover:text-white transition-colors">{isAr ? 'المنصة' : 'Platform'}</a>
            <a href="#solutions" className="hover:text-white transition-colors">{isAr ? 'الحلول' : 'Solutions'}</a>
            <button onClick={() => setCurrentView('pricing' as any)} className="hover:text-white transition-colors">{isAr ? 'الأسعار' : 'Pricing'}</button>
            <a href="#resources" className="hover:text-white transition-colors">{isAr ? 'الموارد' : 'Resources'}</a>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && currentUser ? (
              <button
                onClick={() => setCurrentView('merchant_dashboard')}
                className="px-4 py-2.5 rounded-xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-xs font-bold text-white transition-all flex items-center gap-2 shadow"
              >
                <Store className="w-4 h-4 text-[#C9A45C]" />
                <span>{currentUser.name}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCurrentView('auth_page')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors"
                >
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </button>
                <button
                  onClick={() => setCurrentView('auth_page')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] text-xs font-black hover:opacity-90 shadow-lg shadow-[#C9A45C]/20 transition-all flex items-center gap-2"
                >
                  <span>{isAr ? 'ابدأ مجانًا' : 'Start Free'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#0B1422] border border-[#233247] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#233247] pt-4 space-y-3">
            <a href="#platform" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 hover:text-white">{isAr ? 'المنصة' : 'Platform'}</a>
            <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300 hover:text-white">{isAr ? 'الحلول' : 'Solutions'}</a>
            <button onClick={() => { setMobileMenuOpen(false); setCurrentView('pricing' as any); }} className="block text-sm text-slate-300 hover:text-white text-start w-full">{isAr ? 'الأسعار' : 'Pricing'}</button>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); setCurrentView('auth_page'); }}
                className="w-full py-2.5 rounded-xl bg-[#0B1422] border border-[#233247] text-xs font-bold text-white text-center"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); setCurrentView('auth_page'); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] text-xs font-black text-center"
              >
                {isAr ? 'ابدأ مجانًا' : 'Start Free'}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'منصة التجارة الإلكترونية السيادية والمستقلة' : 'Sovereign & Independent Commerce Platform'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {isAr ? (
            <>
              ابنِ متجرك. أدر تجارتك. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] via-[#E6CA7E] to-[#9A7B26]">
                وانمُ من مكان واحد.
              </span>
            </>
          ) : (
            <>
              Build your store. Manage your business. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] via-[#E6CA7E] to-[#9A7B26]">
                Scale from one place.
              </span>
            </>
          )}
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#97A4B5] max-w-2xl mx-auto font-normal leading-relaxed">
          {isAr 
            ? 'منصة موحدة مصممة للعلامات التجارية الطموحة لامتلاك قنواتهم البيعية بملكية كاملة، أداء فائق، وخبرة تشغيلية بلا حدود.'
            : 'A unified platform built for ambitious brands to own their sales channels with full sovereignty, superior performance, and boundless operations.'}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('auth_page')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-sm hover:opacity-95 shadow-xl shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-3"
          >
            <span>{isAr ? 'ابدأ متجرك مجانًا' : 'Start Your Store Free'}</span>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setCurrentView('auth_page')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>
        </div>

        {/* Abstract Minimal Product Preview Composition */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-3xl bg-[#0B1422] border border-[#233247] p-4 sm:p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#233247] mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-xs text-[#97A4B5] font-mono">commerceos.app/dashboard</div>
              <div className="w-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-start">
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="text-xs text-[#97A4B5]">{isAr ? 'إيرادات المتجر' : 'Store Revenue'}</div>
                <div className="text-2xl font-black text-white mt-1">124,500 <span className="text-sm text-[#C9A45C]">SAR</span></div>
                <div className="text-xs text-emerald-400 mt-1">+18.4% vs last month</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="text-xs text-[#97A4B5]">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div>
                <div className="text-2xl font-black text-white mt-1">418</div>
                <div className="text-xs text-emerald-400 mt-1">+12 active fulfillments</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="text-xs text-[#97A4B5]">{isAr ? 'العملاء النشطون' : 'Active Customers'}</div>
                <div className="text-2xl font-black text-white mt-1">1,284</div>
                <div className="text-xs text-emerald-400 mt-1">High retention</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="text-xs text-[#97A4B5]">{isAr ? 'معدل التحويل' : 'Conversion Rate'}</div>
                <div className="text-2xl font-black text-white mt-1">3.42%</div>
                <div className="text-xs text-emerald-400 mt-1">Optimized checkout</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUE PILLARS (Build, Sell, Operate, Grow) */}
      <section id="platform" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#233247]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {isAr ? 'منصة متكاملة لكل مراحل نمو تجارتك' : 'An integrated platform for every growth stage'}
          </h2>
          <p className="text-[#97A4B5] text-sm mt-3">
            {isAr ? 'كل الأدوات التي تحتاجها لإطلاق متجرك، إدارة مخزونك، ومعالجة المدفوعات تحت سقف واحد.' : 'All the tools you need to launch your store, manage inventory, and process payments under one roof.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4 hover:border-[#C9A45C]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{isAr ? '1. ابنِ متجرك' : '1. Build Store'}</h3>
            <p className="text-xs text-[#97A4B5] leading-relaxed">
              {isAr ? 'أنشئ واجهة متجر تفاعلية ومخصصة بالكامل لتعكس هوية علامتك التجارية دون تعقيد.' : 'Create an interactive storefront fully customized to reflect your brand identity.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4 hover:border-[#C9A45C]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{isAr ? '2. بِع في كل مكان' : '2. Sell Everywhere'}</h3>
            <p className="text-xs text-[#97A4B5] leading-relaxed">
              {isAr ? 'استقبل مدفوعاتك بأمان تام عبر بوابات دفع محلية وعالمية متعددة وموثوقة.' : 'Accept payments securely through multiple trusted local and global gateways.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4 hover:border-[#C9A45C]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{isAr ? '3. أدر العمليات' : '3. Operate Seamlessly'}</h3>
            <p className="text-xs text-[#97A4B5] leading-relaxed">
              {isAr ? 'تابع الطلبات، أدر المخزون، ونظم شحناتك من لوحة تحكم مركزية سريعة ودقيقة.' : 'Track orders, manage inventory, and organize shipments from a fast centralized dashboard.'}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0B1422] border border-[#233247] space-y-4 hover:border-[#C9A45C]/50 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 text-[#C9A45C] flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{isAr ? '4. انمُ وتوسع' : '4. Grow & Scale'}</h3>
            <p className="text-xs text-[#97A4B5] leading-relaxed">
              {isAr ? 'راقب مؤشرات الأداء الحساسة، حلل سلوك العملاء، واتخذ قرارات دقيقة لزيادة مبيعاتك.' : 'Monitor key performance indicators, analyze customer behavior, and scale your sales.'}
            </p>
          </div>

        </div>
      </section>

      {/* PLATFORM STORY SECTION */}
      <section id="solutions" className="py-24 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#233247]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A45C]/10 text-[#C9A45C] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{isAr ? 'ملكية سيادية كاملة' : 'Full Sovereign Ownership'}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {isAr ? 'بياناتك ملكك بالكامل، بلا قيود وبأعلى مستويات الأمان' : 'Your data is strictly yours, unconstrained and secure'}
            </h2>
            <p className="text-sm text-[#97A4B5] leading-relaxed">
              {isAr 
                ? 'تمنحك CommerceOS سيادة كاملة على قاعدة بياناتك، سجلات عملائك، وتفاصيل عملياتك. لا توجد عمولات خفية على المبيعات، وتصميم معمارى يضمن سرعة تحميل استثنائية.'
                : 'CommerceOS gives you full sovereignty over your database, customer records, and operations. Zero hidden sales commissions and an architecture guaranteeing lightning speed.'}
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C]" />
                <span>{isAr ? 'بدون عمولة على المبيعات (0% عمولة)' : 'Zero commission on sales (0% fee)'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C]" />
                <span>{isAr ? 'دعم كامل للغة العربية والإنجليزية واتجاه RTL' : 'Full Arabic & English support with native RTL'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-200">
                <CheckCircle2 className="w-5 h-5 text-[#C9A45C]" />
                <span>{isAr ? 'إدارة متكاملة للصلاحيات والفريق (RBAC)' : 'Integrated team permissions & RBAC'}</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1422] border border-[#233247] relative space-y-6">
            <div className="text-lg font-black text-white">{isAr ? 'جاهز لإطلاق متجرك السيادي؟' : 'Ready to launch your sovereign store?'}</div>
            <p className="text-xs text-[#97A4B5]">
              {isAr ? 'انضم إلى الشركات والعلامات التجارية التي اختارت الاستقلالية والاحترافية.' : 'Join brands and enterprises that chose independence and professionalism.'}
            </p>
            <button
              onClick={() => setCurrentView('auth_page')}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-sm hover:opacity-95 shadow-xl shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{isAr ? 'أنشئ متجرك الآن مجانًا' : 'Create Your Store Free'}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#233247] py-16 px-4 sm:px-8 bg-[#050B14]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] flex items-center justify-center font-black">
                <Crown className="w-4 h-4" />
              </div>
              <span className="text-base font-black text-white">CommerceOS</span>
            </div>
            <p className="text-xs text-[#97A4B5] max-w-sm">
              {isAr ? 'منصة التجارة السيادية الرائدة للعلامات التجارية والمؤسسات.' : 'The leading sovereign commerce platform for brands and enterprises.'}
            </p>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">{isAr ? 'المنصة' : 'Platform'}</div>
            <ul className="space-y-2.5 text-xs text-[#97A4B5]">
              <li><a href="#platform" className="hover:text-white transition-colors">{isAr ? 'المميزات' : 'Features'}</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">{isAr ? 'الحلول' : 'Solutions'}</a></li>
              <li><button onClick={() => setCurrentView('pricing' as any)} className="hover:text-white transition-colors">{isAr ? 'الباقات والأسعار' : 'Pricing'}</button></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">{isAr ? 'الموارد' : 'Resources'}</div>
            <ul className="space-y-2.5 text-xs text-[#97A4B5]">
              <li><a href="#resources" className="hover:text-white transition-colors">{isAr ? 'التوثيق التقني' : 'Documentation'}</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">{isAr ? 'دعم العملاء' : 'Support'}</a></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">{isAr ? 'الشركة' : 'Company'}</div>
            <ul className="space-y-2.5 text-xs text-[#97A4B5]">
              <li><a href="#about" className="hover:text-white transition-colors">{isAr ? 'عن المنصة' : 'About'}</a></li>
              <li><a href="#legal" className="hover:text-white transition-colors">{isAr ? 'الشروط والأحكام' : 'Terms & Privacy'}</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-[#233247] flex flex-col sm:flex-row items-center justify-between text-xs text-[#97A4B5]">
          <div>© {new Date().getFullYear()} CommerceOS. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</div>
          <div className="mt-4 sm:mt-0 font-medium">Sovereign Commerce Platform</div>
        </div>
      </footer>

    </div>
  );
};
