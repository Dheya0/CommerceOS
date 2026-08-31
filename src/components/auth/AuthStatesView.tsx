import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, WifiOff, Lock, ArrowRight } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AuthShell } from './AuthShell';

export type AuthStateType = 'session_expired' | 'account_locked' | 'rate_limited' | 'network_error' | 'unauthorized';

interface AuthStatesViewProps {
  stateType: AuthStateType;
  onRetry?: () => void;
}

export const AuthStatesView: React.FC<AuthStatesViewProps> = ({ stateType, onRetry }) => {
  const { language, setCurrentView } = useCommerce();
  const isAr = language === 'ar';

  const getStateDetails = () => {
    switch (stateType) {
      case 'session_expired':
        return {
          icon: Clock,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          titleAr: 'انتهت جلسة تسجيل الدخول',
          titleEn: 'Session Expired',
          descAr: 'انتهت صلاحية جلستك الحالية لأسباب تتعلق بالأمان. يرجى تسجيل الدخول مرة أخرى للمتابعة.',
          descEn: 'Your current session has expired for security reasons. Please sign in again to continue.',
          ctaAr: 'تسجيل الدخول مرة أخرى',
          ctaEn: 'Sign in again'
        };
      case 'account_locked':
        return {
          icon: Lock,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          titleAr: 'تم تعليق الحساب مؤقتًا',
          titleEn: 'Account Temporarily Locked',
          descAr: 'تم تعليق محاولات تسجيل الدخول مؤقتًا بسبب تكرار المحاولات الخاطئة. حاول مرة أخرى لاحقًا أو استخدم استعادة كلمة المرور.',
          descEn: 'Sign-in attempts temporarily locked due to multiple incorrect attempts. Try again later or use password recovery.',
          ctaAr: 'استعادة كلمة المرور',
          ctaEn: 'Recover password'
        };
      case 'rate_limited':
        return {
          icon: AlertTriangle,
          color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
          titleAr: 'تم تجاوز عدد المحاولات المسموح بها',
          titleEn: 'Rate Limit Exceeded (429)',
          descAr: 'يرجى الانتظار قليلًا قبل إعادة المحاولة لمنع عمليات الوصول غير المصرح بها.',
          descEn: 'Please wait a moment before trying again to prevent unauthorized access.',
          ctaAr: 'إعادة المحاولة',
          ctaEn: 'Try again'
        };
      case 'network_error':
        return {
          icon: WifiOff,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          titleAr: 'تعذر الوصول إلى CommerceOS',
          titleEn: 'Network Connection Error',
          descAr: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
          descEn: 'Check your internet connection and try again.',
          ctaAr: 'إعادة المحاولة',
          ctaEn: 'Retry connection'
        };
      case 'unauthorized':
      default:
        return {
          icon: ShieldAlert,
          color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
          titleAr: 'غير مصرح بالوصول (403)',
          titleEn: 'Unauthorized Access',
          descAr: 'ليس لديك الصلاحيات الكافية للوصول إلى مساحة العمل هذه.',
          descEn: 'You do not have sufficient permissions to access this workspace.',
          ctaAr: 'العودة لتسجيل الدخول',
          ctaEn: 'Back to sign in'
        };
    }
  };

  const details = getStateDetails();
  const Icon = details.icon;

  const handleAction = () => {
    if (onRetry) {
      onRetry();
      return;
    }
    if (stateType === 'account_locked') {
      const event = new CustomEvent('nav-auth', { detail: 'forgot-password' });
      window.dispatchEvent(event);
    } else {
      const event = new CustomEvent('nav-auth', { detail: 'login' });
      window.dispatchEvent(event);
    }
  };

  return (
    <AuthShell
      titleAr={details.titleAr}
      titleEn={details.titleEn}
      subtitleAr={details.descAr}
      subtitleEn={details.descEn}
    >
      <div className="space-y-6 text-center py-4 animate-fadeIn">
        <div className={`w-16 h-16 border rounded-full flex items-center justify-center mx-auto ${details.color}`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            {isAr ? details.titleAr : details.titleEn}
          </h3>
          <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            {isAr ? details.descAr : details.descEn}
          </p>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-3">
          <button
            type="button"
            onClick={handleAction}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#E0C77A] hover:to-[#D4AF37] text-[#07111F] font-bold text-sm rounded-lg shadow-lg shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isAr ? details.ctaAr : details.ctaEn}</span>
            <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          </button>

          {stateType !== 'unauthorized' && (
            <button
              type="button"
              onClick={() => {
                const event = new CustomEvent('nav-auth', { detail: 'login' });
                window.dispatchEvent(event);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors focus:outline-none"
            >
              {isAr ? 'العودة لتسجيل الدخول الرئيسي' : 'Return to main sign in'}
            </button>
          )}
        </div>
      </div>
    </AuthShell>
  );
};
