import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

interface RegisterViewProps {
  onRegistered: (email: string) => void;
}

export const RegisterView: React.FC<RegisterViewProps> = ({ onRegistered }) => {
  const { register, language, showToast } = useCommerce();
  const isAr = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password requirements calculation
  const hasMinLength = password.length >= 8;
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const getStrength = () => {
    if (!password) return { label: '', color: 'bg-white/15', width: 'w-0' };
    let score = 0;
    if (hasMinLength) score++;
    if (hasUpperLower) score++;
    if (hasNumber) score++;
    if (password.length >= 12) score++;

    if (score <= 1) return { label: isAr ? 'ضعيفة' : 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (score === 2) return { label: isAr ? 'مقبولة' : 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { label: isAr ? 'جيدة' : 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: isAr ? 'قوية جداً' : 'Strong', color: 'bg-emerald-500', width: 'w-full' };
  };

  const strength = getStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage(isAr ? 'يرجى تعبئة كافة الحقول المطلوبة.' : 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(isAr ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage(isAr ? 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.' : 'You must agree to the Terms and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await register({
        name,
        email,
        password
      });
      if (success) {
        onRegistered(email);
      } else {
        setErrorMessage(isAr ? 'تعذر إنشاء الحساب. البريد الإلكتروني مستخدم مسبقاً أو غير صالح.' : 'Registration failed. Email may already be in use.');
      }
    } catch (err: any) {
      setErrorMessage(isAr ? 'تعذر إنشاء الحساب. البريد الإلكتروني مستخدم مسبقاً أو غير صالح.' : 'Registration failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      titleAr="أنشئ حساب CommerceOS"
      titleEn="Create your CommerceOS account"
      subtitleAr="ابدأ ببناء وإدارة متجرك من مساحة عمل واحدة."
      subtitleEn="Start building and managing your store from a single workspace."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            {isAr ? 'الاسم الكامل' : 'Full Name'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAr ? 'محمد أحمد' : 'John Doe'}
              className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-4 py-2.5 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>
        </div>

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
              className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-4 py-2.5 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            {isAr ? 'كلمة المرور' : 'Password'}
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
              className="w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border border-white/10 ps-10 pe-10 py-2.5 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
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

          {/* Password Strength Indicator & Requirements */}
          {password && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">{isAr ? 'قوة كلمة المرور:' : 'Password strength:'}</span>
                <span className="font-semibold text-white">{strength.label}</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`} />
              </div>
              <ul className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-1">
                <li className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : ''}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  {isAr ? '8 أحرف على الأقل' : '8+ characters'}
                </li>
                <li className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-400' : ''}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${hasNumber ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                  {isAr ? 'يحتوي على أرقام' : 'Includes numbers'}
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
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
              className={`w-full bg-[#07111F] text-white placeholder-slate-500 text-sm rounded-lg border ${
                confirmPassword && confirmPassword !== password
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-white/10 focus:border-[#D4AF37]'
              } ps-10 pe-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 transition-all`}
            />
          </div>
          {confirmPassword && confirmPassword !== password && (
            <p className="text-[11px] text-rose-400">
              {isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'}
            </p>
          )}
        </div>

        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded bg-[#07111F] border-white/20 text-[#D4AF37] focus:ring-[#D4AF37]/30 focus:ring-offset-0 cursor-pointer flex-shrink-0"
            />
            <span>
              {isAr ? 'أوافق على ' : 'I agree to the '}
              <a href="#terms" onClick={(e) => e.preventDefault()} className="text-[#D4AF37] underline">
                {isAr ? 'شروط الاستخدام' : 'Terms of Service'}
              </a>
              {isAr ? ' و ' : ' and '}
              <a href="#privacy" onClick={(e) => e.preventDefault()} className="text-[#D4AF37] underline">
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#07111F] border-t-transparent rounded-full animate-spin" />
              <span>{isAr ? 'جاري إنشاء الحساب...' : 'Creating account...'}</span>
            </>
          ) : (
            <>
              <span>{isAr ? 'إنشاء الحساب' : 'Create account'}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </>
          )}
        </button>

        <div className="text-center pt-2 border-t border-white/10">
          <p className="text-xs text-slate-400">
            {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'login' });
                window.dispatchEvent(event);
              }}
              className="text-[#D4AF37] font-semibold hover:underline focus:outline-none ms-1"
            >
              {isAr ? 'تسجيل الدخول' : 'Sign in'}
            </button>
          </p>
        </div>
      </form>
    </AuthShell>
  );
};
