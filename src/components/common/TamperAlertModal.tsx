import React, { useState } from 'react';
import { ShieldAlert, Lock, CheckCircle2, Sparkles, Key, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { generateLicenseKey } from '../../utils/licensingEngine';

export const TamperAlertModal: React.FC = () => {
  const { 
    tamperAlertModalOpen, 
    setTamperAlertModalOpen, 
    tamperModalData, 
    activeTenant, 
    applyLicenseToTenant,
    platformConfig,
    showToast 
  } = useCommerce();

  const [enteredKey, setEnteredKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  if (!tamperAlertModalOpen) return null;

  const handleQuickBuySimulation = () => {
    setIsActivating(true);
    setTimeout(() => {
      const generated = generateLicenseKey(activeTenant.id, 'white_label_single');
      const success = applyLicenseToTenant(activeTenant.id, generated.key);
      setIsActivating(false);
      if (success) {
        setTamperAlertModalOpen(false);
        showToast('تم تفعيل ترخيص White-Label بنجاح! تم فك قفل إتمام الطلب ومتابعة العملية.', 'success');
      }
    }, 900);
  };

  const handleApplyCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredKey.trim()) return;
    const success = applyLicenseToTenant(activeTenant.id, enteredKey.trim());
    if (success) {
      setTamperAlertModalOpen(false);
      setEnteredKey('');
    }
  };

  const handleDismissAndRestore = () => {
    setTamperAlertModalOpen(false);
    showToast('تمت استعادة شارة CommerceOS وإلغاء قفل العملية.', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl overflow-hidden text-right">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950/60 to-slate-900 border-b border-rose-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  REVERSE ENGINEERING DEFENSE
                </span>
              </div>
              <h3 className="text-lg font-black text-white mt-0.5">
                تنبيه فحص نزاهة الشارة والملكية الفكرية
              </h3>
            </div>
          </div>

          <button
            onClick={handleDismissAndRestore}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs leading-relaxed text-rose-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>تم اكتشاف محاولة تعديل أو إخفاء الشارة الرسمية للمنصة!</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              {tamperModalData?.reason || 'في الخطة المجانية، يتم ربط سلامة كود الشارة (Watermark Integrity) بإجراءات إتمام الطلب ومحرك الدفع لحماية الملكية الفكرية.'}
            </p>
          </div>

          {/* Upgrade Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 text-right space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                الحل المعتمد (White-Label License)
              </span>
              <div className="text-amber-400 font-mono font-black text-sm">
                {platformConfig.whiteLabelSingleStorePrice} ر.س / لمرة واحدة
              </div>
            </div>

            <h4 className="text-sm font-bold text-white">
              إزالة شارة المنصة بالكامل وتوليد كود نقي 100%
            </h4>

            <p className="text-xs text-slate-400">
              احصل على رخصة White-Label فورية تتيح لك تصدير الكود بدون أي حقوق ملكية أو تشفير مع إمكانية وضع علامتك التجارية الخاصة في التذييل والتطبيقات.
            </p>

            <button
              onClick={handleQuickBuySimulation}
              disabled={isActivating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isActivating ? (
                <span>جارِ التحقق وتوليد المفتاح المشفر...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>شراء وتفعيل الترخيص الفوري (1-Click Sovereign License)</span>
                </>
              )}
            </button>
          </div>

          {/* Or Enter Key */}
          <form onSubmit={handleApplyCustomKey} className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-slate-400">
              لديك مفتاح ترخيص صادر مسبقاً من Super Admin؟
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={enteredKey}
                onChange={e => setEnteredKey(e.target.value)}
                placeholder="e.g. COSLIC-WL-ROYAL-XXXX-XXXXXX"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>تفعيل</span>
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={handleDismissAndRestore}
            className="text-slate-400 hover:text-white transition-colors underline text-[11px]"
          >
            استعادة الشارة الافتراضية ومتابعة التصفح
          </button>

          <span className="text-[10px] text-slate-500 font-mono">
            Integrity Check: SHA-256 HMAC
          </span>
        </div>

      </div>
    </div>
  );
};
