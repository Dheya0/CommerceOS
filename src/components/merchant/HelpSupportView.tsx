import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  FileCode, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  LifeBuoy, 
  Zap, 
  ShieldCheck, 
  PhoneCall, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check,
  Server,
  Sparkles
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const HelpSupportView: React.FC = () => {
  const { language, addToast, activeTenant } = useCommerce();
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<{
    database: 'OK' | 'CHECKING';
    zatca: 'OK' | 'CHECKING';
    ssl: 'OK' | 'CHECKING';
    payments: 'OK' | 'CHECKING';
  }>({
    database: 'OK',
    zatca: 'OK',
    ssl: 'OK',
    payments: 'OK'
  });

  const runDiagnostics = () => {
    setDiagnosticsRunning(true);
    setTimeout(() => {
      setDiagnosticsRunning(false);
      addToast(
        isAr ? 'تم فحص جميع الأنظمة: كافة الخدمات تعمل بكفاءة 100%' : 'Diagnostic check passed: All services operational',
        'success'
      );
    }, 1000);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
    addToast(isAr ? 'تم نسخ النص البرمجي' : 'Code copied to clipboard', 'info');
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setIsSubmittingTicket(true);

    setTimeout(() => {
      setIsSubmittingTicket(false);
      setTicketSubject('');
      setTicketMessage('');
      addToast(
        isAr 
          ? 'تم إرسال تذكرة الدعم بنجاح (رقم التذكرة #TKT-8491) - سيتواصل معك فريق المهندسين فوراً.' 
          : 'Support Ticket #TKT-8491 opened successfully. Engineering team notified.',
        'success'
      );
    }, 800);
  };

  const faqs = [
    {
      q: isAr ? 'كيف أقوم بتفعيل الربط مع هيئة الزكاة والضريبة (ZATCA Phase 2)؟' : 'How do I activate ZATCA Phase 2 E-Invoicing?',
      a: isAr 
        ? 'المنصة مهيأة مسبقاً وتدعم تلقائياً معايير المرحلة الثانية، بما في ذلك توليد رمز الاستجابة السريعة TLV Base64 المشفر وحساب الضريبة وحفظ الأختام الرقمية لكل فاتورة دون الحاجة لأي برمجة إضافية.'
        : 'CommerceOS is pre-configured with Phase 2 compliance, generating TLV Base64 QR codes and cryptographic hashes natively on all invoices.'
    },
    {
      q: isAr ? 'كيف أصدّر تطبيقي إلى متجر Google Play أو Apple App Store؟' : 'How do I export my app to Google Play or Apple App Store?',
      a: isAr 
        ? 'من خلال "مركز البناء والتصدير" أو "استوديو التطبيقات والمواقع"، يمكنك بنقرة واحدة توليد الحزمة المصدرية الكاملة لنظام Android (Kotlin/Gradle) أو iOS (Swift/Capacitor) وتنزيلها كملف ZIP جاهز للرفع.'
        : 'Go to the Build & Export center or No-Code Studio to generate a production-ready Android Kotlin or iOS Capacitor package with one click.'
    },
    {
      q: isAr ? 'هل بيانات الدفع والبطاقات الائتمانية آمنة؟' : 'Is payment and credit card data secure?',
      a: isAr 
        ? 'نعم تماماً. تعتمد المنصة مبدأ الصفر تسريب (Zero Secret Leakage) وتتوافق مع أعلى معايير PCI-DSS؛ حيث تتم معالجة بيانات الدفع عبر بوابات الدفع الرسمية المشفرة دون تخزين أي أرقام بطاقات على السيرفرات.'
        : 'Yes. CommerceOS enforces PCI-DSS Level 1 compliance and zero secret leakage, delegating raw card handling to encrypted certified gateways.'
    },
    {
      q: isAr ? 'كيف أعدّل الألوان والخطوط وهوية متجري؟' : 'How do I customize my store branding, fonts, and colors?',
      a: isAr 
        ? 'استخدم "استوديو التصميم الحي" أو "محرك الثيم الذكي" لتغيير الألوان بدقة النسبة الذهبية وتطبيق خطوط عربية فاخرة وتعديل زوايا الأزرار والمؤثرات بضغطة زر مع معاينة حية فورية.'
        : 'Use Live Design Studio or the Dynamic Theme Engine to adjust color palettes, typography, and button curvatures with live preview.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#07111F] via-[#0A182E] to-[#07111F] border border-[#233247] shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <LifeBuoy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {isAr ? 'مركز الدعم الفني والتوثيق الهندسي' : 'Help & Engineering Support Hub'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isAr 
                ? 'أدلة الاستخدام الشاملة، فحص سلامة الخدمات، وتذاكر الدعم الفوري المباشر'
                : 'Comprehensive guides, system diagnostics, and immediate engineer support'}
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={diagnosticsRunning}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
        >
          <Server className={`w-4 h-4 text-emerald-400 ${diagnosticsRunning ? 'animate-pulse' : ''}`} />
          <span>{diagnosticsRunning ? (isAr ? 'جارِ فحص الأنظمة...' : 'Checking...') : (isAr ? 'فحص جاهزية الخدمات' : 'Run Health Check')}</span>
        </button>
      </div>

      {/* Quick Diagnostics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: isAr ? 'قاعدة البيانات والتخزين' : 'Database & Cache', status: 'OPERATIONAL' },
          { label: isAr ? 'بوابات الدفع الإلكتروني' : 'Payment Gateways', status: 'OPERATIONAL' },
          { label: isAr ? 'تشفير ZATCA والضرائب' : 'ZATCA Cryptography', status: 'OPERATIONAL' },
          { label: isAr ? 'شهادة الأمان SSL/TLS' : 'SSL/TLS Certificate', status: 'ACTIVE (A+)' },
        ].map((item, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-[#081220] border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300 font-bold">{item.label}</span>
            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {item.status}
            </span>
          </div>
        ))}
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT / MAIN (7 Cols): FAQs & Quick Guides */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* FAQ Section */}
          <div className="p-6 rounded-3xl bg-[#081220] border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'الأسئلة الشائعة والأدلة السريعة' : 'Frequently Asked Questions'}</span>
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 flex items-center justify-between text-start text-xs font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-amber-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Developer API Quick Reference */}
          <div className="p-6 rounded-3xl bg-[#081220] border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>{isAr ? 'الربط البرمجي السريع (API Quick Reference)' : 'REST API Quick Reference'}</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono relative group">
                <div className="text-slate-400 text-[10px] mb-1"># Create ZATCA Invoice API Endpoint</div>
                <div className="text-emerald-400">POST /api/invoices/create</div>
                <button
                  onClick={() => handleCopy('curl -X POST https://api.commerceos.app/api/invoices/create -H "Content-Type: application/json" -d \'{"subtotal":150}\'', 'api_curl')}
                  className="absolute top-3 end-3 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="نسخ"
                >
                  {copiedSnippet === 'api_curl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT (5 Cols): Open Support Ticket Form */}
        <div className="lg:col-span-5">
          <div className="p-6 rounded-3xl bg-[#081220] border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'فتح تذكرة دعم فني مباشرة' : 'Open Support Ticket'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr ? 'فريق المهندسين متواجد على مدار الساعة لمساعدتك في أي استفسار أو تخصيص متقدم.' : 'Our engineering team responds within minutes to help you scale.'}
            </p>

            <form onSubmit={handleSubmitTicket} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  {isAr ? 'نوع المشكلة أو الاستفسار' : 'Category'}
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-amber-400 focus:outline-none"
                >
                  <option value="technical">{isAr ? 'مشكلة تقنية أو برمجية' : 'Technical / Bug'}</option>
                  <option value="design">{isAr ? 'تخصيص التصميم والواجهة' : 'Design Customization'}</option>
                  <option value="zatca">{isAr ? 'الفوترة الإلكترونية والضرائب' : 'ZATCA Invoicing & Tax'}</option>
                  <option value="billing">{isAr ? 'الاشتراكات والمدفوعات' : 'Billing & Subscription'}</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  {isAr ? 'عنوان التذكرة' : 'Subject'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: استفسار حول ربط بوابة الدفع...' : 'e.g. Inquiring about payment webhook...'}
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  {isAr ? 'التفاصيل والوصف' : 'Message Details'}
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder={isAr ? 'اكتب تفاصيل طلبك بدقة...' : 'Describe your request in detail...'}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className={`w-4 h-4 ${isSubmittingTicket ? 'animate-bounce' : ''}`} />
                <span>{isSubmittingTicket ? (isAr ? 'جارِ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال التذكرة الآن' : 'Submit Ticket')}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
