import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

export const LoginView: React.FC = () => {
  const { login, setCurrentView, language, showToast } = useCommerce();
  const isAr = language === 'ar';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage(isAr ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' : 'Please enter email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        showToast(isAr ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully', 'success');
        setCurrentView('personal_profile');
      } else {
        setErrorMessage(isAr ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : 'Invalid email or password.');
      }
    } catch (err: any) {
      setErrorMessage(isAr ? 'تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.' : 'Sign in failed. Check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      titleAr="مرحبًا بعودتك"
      titleEn="Welcome back"
      subtitleAr="سجّل الدخول للوصول إلى مساحة عملك في CommerceOS."
      subtitleEn="Sign in to access your CommerceOS workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

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
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              {isAr ? 'كلمة المرور' : 'Password'}
            </label>
            <button
              type="button"
              onClick={() => setCurrentView('auth_page' as any)} // Will toggle to forgot password
              className="text-xs text-[#D4AF37] hover:underline focus:outline-none"
              onClickCapture={(e) => {
                e.preventDefault();
                // We can navigate to forgot password via custom event or state
                const event = new CustomEvent('nav-auth', { detail: 'forgot-password' });
                window.dispatchEvent(event);
              }}
            >
              {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </button>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
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

        <div className="flex items-center">
          <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="w-4 h-4 rounded bg-[#07111F] border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]/30 focus:ring-offset-0 cursor-pointer"
            />
            <span>{isAr ? 'تذكر هذا الجهاز' : 'Remember this device'}</span>
          </label>
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
              <span>{isAr ? 'جاري تسجيل الدخول...' : 'Signing in...'}</span>
            </>
          ) : (
            <>
              <span>{isAr ? 'تسجيل الدخول' : 'Sign in'}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-slate-400">
            {isAr ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'register' });
                window.dispatchEvent(event);
              }}
              className="text-[#D4AF37] font-semibold hover:underline focus:outline-none ms-1"
            >
              {isAr ? 'إنشاء حساب' : 'Create account'}
            </button>
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isAr ? 'تتم حماية جلسة تسجيل الدخول باستخدام آليات أمان حديثة.' : 'Protected by modern enterprise session security.'}</span>
        </div>
      </form>
    </AuthShell>
  );
};
