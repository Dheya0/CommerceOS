import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers,
  Code2,
  Download,
  Server,
  Smartphone,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Globe,
  Terminal,
  Zap
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const LandingPage: React.FC = () => {
  const {
    setCurrentView,
    language
  } = useCommerce();

  const isAr = language === 'ar';

  return (
    <div className="text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Subtle Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#C9A45C]/10 via-transparent to-transparent blur-[120px] pointer-events-none -z-10" />

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 px-4 sm:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#C9A45C] text-xs font-bold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'Commerce Builder + Code Factory + Full-Stack Generator' : 'Commerce Builder + Code Factory + Full-Stack Generator'}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight max-w-4xl mx-auto leading-[1.15]">
          {isAr ? (
            <>
              ابنِ منظومة تجارتك. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] via-[#E6CA7E] to-[#9A7B26]">
                امتلك الكود بالكامل، وانشر في أي مكان.
              </span>
            </>
          ) : (
            <>
              Build your commerce stack. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A45C] via-[#E6CA7E] to-[#9A7B26]">
                Own the source code, deploy anywhere.
              </span>
            </>
          )}
        </h1>

        <p className="mt-6 text-base sm:text-lg text-[#97A4B5] max-w-2xl mx-auto font-normal leading-relaxed">
          {isAr 
            ? 'CommerceOS ليست مجرد منصة استضافة مغلقة. صمّم مشروعك التجاري، عاينه تفاعلياً، ثم قم بتوليد وتنزيل كود Full-Stack حقيقي (Frontend, Backend, Database, Android, iOS, Docker) بملكية سيادية 100% دون أي قيود أو عمولات خفية.'
            : 'CommerceOS is not a closed hosted silo. Design your commerce project, preview it interactively, then generate and download genuine production Full-Stack source code (Frontend, Backend, Database, Android, iOS, Docker) with 100% sovereign ownership.'}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setCurrentView('auth_page')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-sm hover:opacity-95 shadow-xl shadow-[#C9A45C]/20 transition-all flex items-center justify-center gap-3"
          >
            <span>{isAr ? 'ابدأ بناء مشروعك مجاناً' : 'Start Building Your Project'}</span>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={() => setCurrentView('auth_page')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0B1422] hover:bg-[#101B2C] border border-[#233247] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
          </button>
        </div>

        {/* Abstract Product Architecture Preview Box */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-3xl bg-[#0B1422] border border-[#233247] p-4 sm:p-6 shadow-2xl overflow-hidden relative text-start">
            <div className="flex items-center justify-between pb-4 border-b border-[#233247] mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="text-xs text-[#97A4B5] font-mono">CommerceOS Code Factory — Architecture & Artifact Pipeline</div>
              <div className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20 font-mono">
                v2.0 Sovereign
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="flex items-center gap-2 text-xs text-[#97A4B5] mb-2">
                  <Code2 className="w-4 h-4 text-[#C9A45C]" />
                  <span>{isAr ? 'Frontend SPA' : 'Frontend SPA'}</span>
                </div>
                <div className="text-sm font-bold text-white">React 18 + Vite + Tailwind</div>
                <div className="text-xs text-emerald-400 mt-2 font-mono">100% Component Source</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="flex items-center gap-2 text-xs text-[#97A4B5] mb-2">
                  <Server className="w-4 h-4 text-blue-400" />
                  <span>{isAr ? 'Backend REST API' : 'Backend REST API'}</span>
                </div>
                <div className="text-sm font-bold text-white">Express + RBAC + Pricing</div>
                <div className="text-xs text-blue-400 mt-2 font-mono">Zero-Trust Endpoints</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="flex items-center gap-2 text-xs text-[#97A4B5] mb-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'Native Mobile' : 'Native Mobile'}</span>
                </div>
                <div className="text-sm font-bold text-white">Android Studio + iOS Xcode</div>
                <div className="text-xs text-emerald-400 mt-2 font-mono">Capacitor 6.0 Projects</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247]">
                <div className="flex items-center gap-2 text-xs text-[#97A4B5] mb-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>{isAr ? 'Deploy Anywhere' : 'Deploy Anywhere'}</span>
                </div>
                <div className="text-sm font-bold text-white">Docker Compose & VPS</div>
                <div className="text-xs text-purple-400 mt-2 font-mono">Self-Hosted Sovereign</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS SECTION */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto border-t border-[#233247]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {isAr ? 'ركائز المنظومة السيادية' : 'The Sovereign Pillars'}
          </h2>
          <p className="text-[#97A4B5] text-sm sm:text-base mt-3">
            {isAr 
              ? 'صممت لتمنح المطورين ورواد الأعمال أقصى درجات الحرية التقنية دون قفل منصات أو شروط احتكارية.'
              : 'Engineered to grant developers and merchants complete technical freedom without vendor lock-in.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C] mb-6">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {isAr ? '1. منشئ المتاجر التفاعلي (Builder)' : '1. Interactive Commerce Builder'}
              </h3>
              <p className="text-sm text-[#97A4B5] leading-relaxed">
                {isAr
                  ? 'قم بإعداد الهوية البصرية، تصميم الواجهات، ضبط الكتالوج، وإدارة المنتجات والأسعار والتصنيفات في بيئة تفاعلية مع معاينة فورية سلسة.'
                  : 'Configure visual identity, themes, catalog, pricing, and category structures with seamless live preview.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#233247] flex items-center gap-2 text-xs text-[#C9A45C] font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'معاينة فورية بدون نشر سحابي إجباري' : 'Instant client preview sandbox'}</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {isAr ? '2. مصنع الأكواد وحزم النشر (Code Factory)' : '2. Code Factory & Generators'}
              </h3>
              <p className="text-sm text-[#97A4B5] leading-relaxed">
                {isAr
                  ? 'بضغطة زر واحدة، تصرف المنظومة خطوط إنتاج لتوليد وتصدير كود نظيف وتطبيقات أندرويد و iOS و PWA وحزم Docker مع حساب البصمة الرقمية SHA-256.'
                  : 'With one click, compile clean source code, Android & iOS projects, PWA bundles, and Docker packages with SHA-256 integrity.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#233247] flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'تنزيل مباشر لحزم حقيقية موثقة' : 'Direct download of genuine packages'}</span>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1422] border border-[#233247] flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {isAr ? '3. النشر السيادي الذاتي (Sovereign Deploy)' : '3. Sovereign Self-Hosting'}
              </h3>
              <p className="text-sm text-[#97A4B5] leading-relaxed">
                {isAr
                  ? 'انشر على سيرفرك الخاص (Ubuntu VPS, AWS, Hetzner, DigitalOcean) أو على بيئات Docker و Cloud Run مع أدلة نشر واضحة وشاملة.'
                  : 'Deploy on your own VPS (Ubuntu, AWS, Hetzner) or Docker & Cloud Run environments with step-by-step documentation.'}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#233247] flex items-center gap-2 text-xs text-purple-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'حرية استضافة كاملة 0% عمولات' : 'Total hosting freedom, 0% commissions'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="py-24 px-4 sm:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-b from-[#101B2C] to-[#0B1422] border border-[#233247] shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
              {isAr ? 'جاهز لبناء مشروعك وتوليد برمجياته؟' : 'Ready to build and generate your stack?'}
            </h2>
            <p className="text-[#97A4B5] text-sm sm:text-base max-w-xl mx-auto mb-8">
              {isAr
                ? 'أنشئ مشروعك الجديد الآن، خصص الكتالوج والتصميم، ونزّل حزمتك البرمجية الكاملة بدقائق.'
                : 'Create your project now, customize your catalog and theme, and download your complete software package in minutes.'}
            </p>
            <button
              onClick={() => setCurrentView('auth_page')}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-base hover:opacity-95 shadow-xl shadow-[#C9A45C]/20 transition-all inline-flex items-center gap-3"
            >
              <span>{isAr ? 'إنشاء مشروع جديد' : 'Create New Project'}</span>
              <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
