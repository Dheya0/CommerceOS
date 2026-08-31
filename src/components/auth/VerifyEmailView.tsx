import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

interface VerifyEmailViewProps {
  email?: string;
}

export const VerifyEmailView: React.FC<VerifyEmailViewProps> = ({ email = 'd***@example.com' }) => {
  const { language, showToast, setCurrentView } = useCommerce();
  const isAr = language === 'ar';

  const [countdown, setCountdown] = useState(42);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(45);
      setCanResend(false);
      showToast(isAr ? 'تم إعادة إرسال رمز التحقق بنجاح' : 'Verification code resent successfully', 'success');
    }, 1000);
  };

  const handleSimulateVerify = () => {
    setIsVerified(true);
    showToast(isAr ? 'تم التحقق من بريدك الإلكتروني بنجاح' : 'Email verified successfully', 'success');
  };

  return (
    <AuthShell
      titleAr="تحقق من بريدك الإلكتروني"
      titleEn="Verify your email"
      subtitleAr="أرسلنا رسالة تحقق إلى بريدك الإلكتروني المسجل."
      subtitleEn="We sent a verification link to your registered email."
    >
      {!isVerified ? (
        <div className="space-y-6 text-center py-2">
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">
              {email}
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              {isAr
                ? 'الرجاء النقر على رابط التحقق المرسل إلى بريدك الإلكتروني لمتابعة إعداد مساحة عملك في CommerceOS.'
                : 'Please click the verification link sent to your email to proceed with setting up your CommerceOS workspace.'}
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleSimulateVerify}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all"
            >
              {isAr ? 'محاكاة تأكيد التحقق (متابعة)' : 'Simulate Verification (Continue)'}
            </button>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
              <button
                type="button"
                disabled={!canResend || isResending}
                onClick={handleResend}
                className="text-[#D4AF37] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {canResend
                    ? (isAr ? 'إعادة إرسال البريد' : 'Resend email')
                    : (isAr ? `يمكنك إعادة الإرسال خلال 00:${countdown < 10 ? `0${countdown}` : countdown}` : `Resend in 00:${countdown < 10 ? `0${countdown}` : countdown}`)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const event = new CustomEvent('nav-auth', { detail: 'login' });
                  window.dispatchEvent(event);
                }}
                className="text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                {isAr ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-center py-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'تم التحقق من بريدك الإلكتروني' : 'Email successfully verified'}
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              {isAr ? 'حسابك مؤمن وجاهز الآن. انقر أدناه للبدء.' : 'Your account is now secured and ready. Click below to continue.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setCurrentView('merchant_dashboard');
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all"
            >
              {isAr ? 'متابعة إلى لوحة التحكم' : 'Continue to Dashboard'}
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
};
