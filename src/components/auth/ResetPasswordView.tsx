import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

export const ResetPasswordView: React.FC = () => {
  const { language, showToast } = useCommerce();
  const isAr = language === 'ar';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password || !confirmPassword) {
      setErrorMessage(isAr ? 'يرجى إدخال وتأكيد كلمة المرور الجديدة.' : 'Please enter and confirm your new password.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage(isAr ? 'يجب ألا تقل كلمة المرور عن 8 أحرف.' : 'Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      showToast(isAr ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully', 'success');
    }, 1200);
  };

  return (
    <AuthShell
      titleAr="أنشئ كلمة مرور جديدة"
      titleEn="Create new password"
      subtitleAr="الرجاء اختيار كلمة مرور قوية لحماية حسابك في CommerceOS."
      subtitleEn="Please choose a strong password to secure your CommerceOS account."
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm animate-fadeIn">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {isAr ? 'كلمة المرور الجديدة' : 'New password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-10 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-white transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              {isAr ? 'تأكيد كلمة المرور' : 'Confirm password'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-4 py-3 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#07111F] border-t-transparent rounded-full animate-spin" />
                <span>{isAr ? 'جاري الحفظ...' : 'Saving password...'}</span>
              </>
            ) : (
              <span>{isAr ? 'حفظ كلمة المرور' : 'Save password'}</span>
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6 text-center py-4 animate-fadeIn">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              {isAr ? 'تم تحديث كلمة المرور بنجاح' : 'Password updated successfully'}
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              {isAr ? 'يمكنك الان تسجيل الدخول باستخدام كلمة المرور الجديدة.' : 'You can now sign in with your new password.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'login' });
                window.dispatchEvent(event);
              }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </button>
          </div>
        </div>
      )}
    </AuthShell>
  );
};
