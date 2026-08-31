import React, { useState, useEffect } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { LoginView } from './LoginView';
import { RegisterView } from './RegisterView';
import { ForgotPasswordView } from './ForgotPasswordView';
import { ResetPasswordView } from './ResetPasswordView';
import { VerifyEmailView } from './VerifyEmailView';
import { AuthStatesView, AuthStateType } from './AuthStatesView';
import { ShieldCheck, Sparkles, Sliders } from 'lucide-react';

export type AuthSubView = 
  | 'login' 
  | 'register' 
  | 'forgot-password' 
  | 'reset-password' 
  | 'verify-email' 
  | 'session_expired' 
  | 'account_locked' 
  | 'rate_limited' 
  | 'network_error' 
  | 'unauthorized';

export const AuthPageView: React.FC = () => {
  const { language } = useCommerce();
  const isAr = language === 'ar';
  const [subView, setSubView] = useState<AuthSubView>('login');
  const [registeredEmail, setRegisteredEmail] = useState('d***@example.com');
  const [showStateTester, setShowStateTester] = useState(false);

  useEffect(() => {
    const handleNavAuth = (e: Event) => {
      const customEvent = e as CustomEvent<AuthSubView>;
      if (customEvent.detail) {
        setSubView(customEvent.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('nav-auth', handleNavAuth as EventListener);
    return () => {
      window.removeEventListener('nav-auth', handleNavAuth as EventListener);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Active Auth Sub-View */}
      {subView === 'login' && <LoginView />}
      {subView === 'register' && (
        <RegisterView 
          onRegistered={(email) => {
            setRegisteredEmail(email);
            setSubView('verify-email');
          }} 
        />
      )}
      {subView === 'forgot-password' && <ForgotPasswordView />}
      {subView === 'reset-password' && <ResetPasswordView />}
      {subView === 'verify-email' && <VerifyEmailView email={registeredEmail} />}
      {subView === 'session_expired' && <AuthStatesView stateType="session_expired" />}
      {subView === 'account_locked' && <AuthStatesView stateType="account_locked" />}
      {subView === 'rate_limited' && <AuthStatesView stateType="rate_limited" />}
      {subView === 'network_error' && <AuthStatesView stateType="network_error" />}
      {subView === 'unauthorized' && <AuthStatesView stateType="unauthorized" />}

      {/* Floating State Simulator Toolbar for Testing Phase D1 Requirements */}
      <div className="fixed bottom-4 start-4 z-50">
        <div className="bg-[#0B1626]/90 backdrop-blur-md border border-white/10 rounded-xl p-2 shadow-2xl flex items-center gap-2">
          <button
            onClick={() => setShowStateTester(!showStateTester)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-xs font-semibold text-[#D4AF37] transition-all"
            title="اختبار حالات المصادقة (Auth States Tester)"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{isAr ? 'حالات المصادقة (D1 QA)' : 'Auth States (D1 QA)'}</span>
          </button>
        </div>

        {showStateTester && (
          <div className="absolute bottom-14 start-0 w-64 bg-[#0B1626] border border-white/15 rounded-xl p-3 shadow-2xl space-y-2 animate-fadeIn text-xs">
            <div className="font-semibold text-white pb-2 border-b border-white/10 flex items-center justify-between">
              <span>{isAr ? 'اختر شاشة أو حالة الأمان' : 'Select Screen / Security State'}</span>
              <button onClick={() => setShowStateTester(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button 
                onClick={() => { setSubView('login'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'login' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                1. Login (تسجيل الدخول)
              </button>
              <button 
                onClick={() => { setSubView('register'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'register' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                2. Register (إنشاء حساب)
              </button>
              <button 
                onClick={() => { setSubView('forgot-password'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'forgot-password' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                3. Forgot Password (استعادة)
              </button>
              <button 
                onClick={() => { setSubView('reset-password'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'reset-password' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                4. Reset Password (كلمة مرور جديدة)
              </button>
              <button 
                onClick={() => { setSubView('verify-email'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'verify-email' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                5. Verify Email (التحقق من البريد)
              </button>
              <button 
                onClick={() => { setSubView('session_expired'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'session_expired' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                6. Session Expired (انتهاء الجلسة)
              </button>
              <button 
                onClick={() => { setSubView('account_locked'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'account_locked' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                7. Account Locked (تعليق الحساب)
              </button>
              <button 
                onClick={() => { setSubView('rate_limited'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'rate_limited' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                8. Rate Limited 429 (تجاوز المحاولات)
              </button>
              <button 
                onClick={() => { setSubView('network_error'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'network_error' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                9. Network Error (خطأ الاتصال)
              </button>
              <button 
                onClick={() => { setSubView('unauthorized'); setShowStateTester(false); }}
                className={`text-start px-2.5 py-1.5 rounded hover:bg-white/5 transition-colors ${subView === 'unauthorized' ? 'text-[#D4AF37] font-bold bg-white/5' : 'text-slate-300'}`}
              >
                10. Unauthorized 403 (غير مصرح)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
