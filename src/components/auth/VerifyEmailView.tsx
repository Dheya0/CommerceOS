import React, { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw, CheckCircle2, ShieldCheck, KeyRound } from 'lucide-react';
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
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Show verification code hint on load
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast(isAr ? 'رمز التحقق الخاص بك هو: 123456' : 'Your verification code is: 123456', 'info');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleResend = () => {
    setIsResending(true);
    setTimeout(() => {
      setIsResending(false);
      setCountdown(45);
      setCanResend(false);
      showToast(isAr ? 'تم إعادة إرسال رمز التحقق (123456) بنجاح' : 'Verification code (123456) resent successfully', 'success');
    }, 1000);
  };

  const handleInputChange = (value: string, index: number) => {
    const val = value.replace(/[^0-9]/g, '');
    if (!val) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    const newCode = [...code];
    newCode[index] = val.substring(val.length - 1);
    setCode(newCode);
    setError(null);

    // Focus next element
    if (index < 5 && val) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (pastedData.length >= 6) {
      const newCode = pastedData.substring(0, 6).split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const enteredCode = code.join('');
    if (enteredCode.length < 6) {
      setError(isAr ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام كاملاً' : 'Please enter the complete 6-digit code');
      return;
    }

    if (enteredCode === '123456') {
      setIsVerified(true);
      showToast(isAr ? 'تم التحقق من بريدك الإلكتروني بنجاح!' : 'Email verified successfully!', 'success');
    } else {
      setError(isAr ? 'رمز التحقق غير صحيح، يرجى تجربة الرمز: 123456' : 'Invalid verification code, try code: 123456');
    }
  };

  const handleBackToLogin = () => {
    const event = new CustomEvent('nav-auth', { detail: 'login' });
    window.dispatchEvent(event);
  };

  return (
    <AuthShell
      titleAr="رمز التحقق من البريد الإلكتروني"
      titleEn="Email Verification Code"
      subtitleAr="الرجاء إدخال رمز التحقق لتأكيد هويتك وتفعيل حسابك الشخصي."
      subtitleEn="Please enter the verification code to activate your personal account."
    >
      {!isVerified ? (
        <div className="space-y-6 text-center py-2">
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-300">
              {isAr ? 'تم إرسال رمز تحقق مؤلف من 6 أرقام إلى:' : 'A 6-digit verification code has been sent to:'}
            </h3>
            <span className="text-base font-black text-white block select-all">{email}</span>
          </div>

          {/* Golden code hint */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 max-w-sm mx-auto leading-relaxed">
            {isAr ? '💡 رمز التحقق المفعّل للتجربة هو: 123456' : '💡 The active sandbox verification code is: 123456'}
          </div>

          <div className="space-y-4">
            <div className="flex justify-center gap-2.5" dir="ltr">
              {code.map((num, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={num}
                  onChange={(e) => handleInputChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  className="w-11 h-12 text-center text-lg font-bold bg-[#07111F] text-white border border-white/10 rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
              ))}
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-400 animate-fadeIn">{error}</p>
            )}

            <button
              type="button"
              onClick={handleVerify}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all"
            >
              {isAr ? 'تأكيد رمز التحقق' : 'Verify Code'}
            </button>

            <div className="flex items-center justify-between text-xs pt-4 border-t border-white/10">
              <button
                type="button"
                disabled={!canResend || isResending}
                onClick={handleResend}
                className="text-[#D4AF37] hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 focus:outline-none"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                <span>
                  {canResend
                    ? (isAr ? 'إعادة إرسال الرمز' : 'Resend code')
                    : (isAr ? `إعادة الإرسال خلال 00:${countdown < 10 ? `0${countdown}` : countdown}` : `Resend in 00:${countdown < 10 ? `0${countdown}` : countdown}`)}
                </span>
              </button>

              <button
                type="button"
                onClick={handleBackToLogin}
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
              {isAr ? 'تم التحقق من الحساب بنجاح!' : 'Account verified successfully!'}
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'لقد تم تأكيد وتفعيل حسابك الشخصي في المنصة بنجاح. يرجى تسجيل الدخول للوصول إلى مساحة مشاريعك.'
                : 'Your personal platform account has been successfully verified. Please sign in to access your projects workspace.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all"
            >
              {isAr ? 'الانتقال إلى تسجيل الدخول' : 'Proceed to Sign In'}
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
};
