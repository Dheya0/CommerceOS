import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Wifi, AlertTriangle } from 'lucide-react';

export const OfflineNetworkBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top-4 duration-300">
      {isOffline ? (
        <div className="pointer-events-auto max-w-lg w-full px-4 py-3 rounded-2xl bg-rose-950/95 border border-rose-800/80 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-rose-200 text-xs font-bold">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-900/60 flex items-center justify-center text-rose-400 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-white">انقطع الاتصال بالإنترنت</p>
              <p className="text-[11px] text-rose-300 font-normal">تم حفظ مسوداتك والتغييرات محلياً في الذاكرة المؤقتة لحين عودة الشبكة.</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded-xl bg-rose-800/60 hover:bg-rose-800 text-white text-[11px] font-bold border border-rose-700/60 transition-colors shrink-0 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            إعادة المحاولة
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto max-w-md w-full px-4 py-2.5 rounded-2xl bg-emerald-950/95 border border-emerald-800/80 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-emerald-200 text-xs font-bold">
          <div className="w-7 h-7 rounded-xl bg-emerald-900/60 flex items-center justify-center text-emerald-400 shrink-0">
            <Wifi className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-bold text-white">عاد الاتصال بالإنترنت بنجاح</p>
            <p className="text-[11px] text-emerald-300 font-normal">تمت مزامنة العمليات والمسودات مع السيرفر.</p>
          </div>
        </div>
      )}
    </div>
  );
};
