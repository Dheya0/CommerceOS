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
  const [registeredEmail, setRegisteredEmail] = useState('');

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
    </div>
  );
};
