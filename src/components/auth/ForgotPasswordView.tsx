import React, { useState } from 'react';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

export const ForgotPasswordView: React.FC = () => {
  const { language, showToast } = useCommerce();
  const isAr = language === 'ar';

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <AuthShell
      titleAr="استعادة كلمة المرور"
      titleEn="Reset your password"
      subtitleAr="أدخل بريدك الإلكتروني وسنرسل لك تعليمات استعادة الوصول إلى مساحة عملك."
      subtitleEn="Enter your email and we'll send instructions to restore workspace access."
    >
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {isAr ? 'البريد الإلكتروني' : 'Email address'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              {isAr ? 'إذا كان البريد مرتبطًا بحساب، فستصلك رسالة تعليمات الاستعادة.' : 'If the email is associated with an account, instructions will be sent.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#07111F] border-t-transparent rounded-full animate-spin" />
                <span>{isAr ? 'جاري الإرسال...' : 'Sending instructions...'}</span>
              </>
            ) : (
              <span>{isAr ? 'إرسال تعليمات الاستعادة' : 'Send recovery instructions'}</span>
            )}
          </button>

          <div className="text-center pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'login' });
                window.dispatchEvent(event);
              }}
              className="inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white transition-colors focus:outline-none"
            >
              <ArrowLeft className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              <span>{isAr ? 'العودة إلى تسجيل الدخول' : 'Back to sign in'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 text-center py-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'تحقق من بريدك الإلكتروني' : 'Check your inbox'}
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              {isAr
                ? `إذا كان البريد (${email}) مسجلاً لدينا، فقد أرسلنا إليك رابطًا لإعادة تعيين كلمة المرور.`
                : `If (${email}) is registered, we have sent a password reset link.`}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'login' });
                window.dispatchEvent(event);
              }}
              className="w-full py-3 px-4 bg-[#101C2C] border border-white/10 hover:border-[#D4AF37]/50 text-white font-semibold text-sm rounded-lg transition-all"
            >
              {isAr ? 'العودة إلى تسجيل الدخول' : 'Back to sign in'}
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
};
