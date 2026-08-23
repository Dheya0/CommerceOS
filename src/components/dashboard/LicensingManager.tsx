import React, { useState } from 'react';
import { 
  Sparkles, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  ExternalLink, 
  FileCode, 
  Layers, 
  AlertTriangle, 
  Save, 
  HardDrive,
  Cpu,
  Package,
  Users,
  Rocket,
  ShieldAlert
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { generateLicenseKey } from '../../utils/licensingEngine';

export const LicensingManager: React.FC = () => {
  const { 
    activeTenant, 
    updateTenant, 
    applyLicenseToTenant, 
    toggleWhiteLabel, 
    platformConfig, 
    showToast,
    setCurrentView 
  } = useCommerce();

  const [enteredKey, setEnteredKey] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isActivating, setIsActivating] = useState(false);

  const licensing = activeTenant.licensing || {
    tier: 'free',
    isWhiteLabel: false,
    verified: false,
    customBranding: {
      removeCommerceOSFooter: false,
      hideWatermarkInExports: false
    }
  };

  const quotas = activeTenant.quotas || {
    maxProducts: 500,
    maxStaff: 5,
    maxMonthlyBuilds: 30,
    usedMonthlyBuilds: 4,
    allowCustomDomain: true,
    allowDockerSelfHost: true,
    allowNativeIosAndroid: true,
    storageQuotaMb: 1000,
    usedStorageMb: 85
  };

  const [brandingForm, setBrandingForm] = useState({
    removeCommerceOSFooter: licensing.customBranding?.removeCommerceOSFooter ?? licensing.isWhiteLabel,
    customFooterText: licensing.customBranding?.customFooterText || `جميع الحقوق محفوظة لمتجر ${activeTenant.name} © 2026`,
    customPoweredBy: licensing.customBranding?.customPoweredBy || '',
    customPoweredByUrl: licensing.customBranding?.customPoweredByUrl || '',
    hideWatermarkInExports: licensing.customBranding?.hideWatermarkInExports ?? licensing.isWhiteLabel
  });

  const handleApplyLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredKey.trim()) return;
    const success = applyLicenseToTenant(activeTenant.id, enteredKey.trim());
    if (success) {
      setEnteredKey('');
    }
  };

  const handleSimulatePurchase = () => {
    setIsActivating(true);
    setTimeout(() => {
      const generated = generateLicenseKey(activeTenant.id, 'white_label_single');
      const success = applyLicenseToTenant(activeTenant.id, generated.key);
      setIsActivating(false);
      if (success) {
        showToast('تهانينا! تم تفعيل رخصة White-Label للمتجر بنجاح وحذف الشارة بالكامل.', 'success');
      }
    }, 800);
  };

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licensing.isWhiteLabel) {
      showToast('يجب تفعيل ترخيص White-Label أولاً لتعديل العلامة التجارية والتذييل', 'warning');
      return;
    }

    updateTenant(activeTenant.id, {
      licensing: {
        ...licensing,
        customBranding: brandingForm
      }
    });
    showToast('تم حفظ إعدادات الهوية والعلامة التجارية بنجاح', 'success');
  };

  const handleCopyKey = () => {
    if (licensing.licenseKey) {
      navigator.clipboard.writeText(licensing.licenseKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
      showToast('تم نسخ مفتاح الترخيص للحافظة', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
              Micro-Licensing & White-Label Matrix
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            إدارة التراخيص والعلامة التجارية (White-Label)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            إزالة شارة المنصة بالكامل، تخصيص تذييل المتجر، وتوليد كود نقي 100% بدون أي تشفير أو علامات مائية.
          </p>
        </div>

        {licensing.isWhiteLabel ? (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>ترخيص White-Label نشط وموثق</span>
          </div>
        ) : (
          <button
            onClick={handleSimulatePurchase}
            disabled={isActivating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isActivating ? 'جارِ التوثيق...' : `ترقية فورية إلى White-Label (${platformConfig.whiteLabelSingleStorePrice} ر.س)`}</span>
          </button>
        )}
      </div>

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current License Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                licensing.isWhiteLabel 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {licensing.isWhiteLabel ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm font-black text-white">
                  {licensing.isWhiteLabel ? 'رخصة السيادة الكاملة (White-Label Sovereign Single)' : 'النسخة المجانية (Free Core with Watermark)'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {licensing.isWhiteLabel 
                    ? 'كافة حزم البناء (PWA, Android, iOS, Docker) خالية 100% من شارة CommerceOS'
                    : 'يتم دمج شارة المنصة مشفرة ضمن حزم التصدير والمتجر مع حماية النزاهة'}
                </div>
              </div>
            </div>

            <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
              licensing.isWhiteLabel 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {licensing.tier.toUpperCase()}
            </span>
          </div>

          {/* License Key Details */}
          {licensing.isWhiteLabel && licensing.licenseKey ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">مفتاح الترخيص الرقمي (Digital License Key):</span>
                <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> تم التوثيق والتوقيع
                </span>
              </div>
              
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono text-xs text-amber-300 select-all font-bold">
                  {licensing.licenseKey}
                </span>
                <button
                  onClick={handleCopyKey}
                  className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="نسخ المفتاح"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 font-mono">
                <span>تاريخ الإصدار: {licensing.issuedAt ? new Date(licensing.issuedAt).toLocaleDateString('ar-SA') : '2026-01-15'}</span>
                <span>الحالة: دائم مدى الحياة (Lifetime)</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs text-slate-300 font-bold">
                لديك مفتاح ترخيص صادر من المنصة أو المشرف؟
              </div>
              <form onSubmit={handleApplyLicense} className="flex gap-2">
                <input
                  type="text"
                  value={enteredKey}
                  onChange={e => setEnteredKey(e.target.value)}
                  placeholder="أدخل مفتاح الترخيص e.g. COSLIC-WL-ROYAL-XXXX-XXXXXX"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>تفعيل</span>
                </button>
              </form>
            </div>
          )}

          {/* Custom Branding Form */}
          <form onSubmit={handleSaveBranding} className="space-y-4 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>تخصيص الهوية والشارات (Custom White-Label Branding)</span>
              </h3>
              {!licensing.isWhiteLabel && (
                <span className="text-[11px] text-amber-400 font-bold">
                  (يتطلب ترخيص White-Label)
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  نص حقوق الملكية في تذييل المتجر (Footer Copyright):
                </label>
                <input
                  type="text"
                  disabled={!licensing.isWhiteLabel}
                  value={brandingForm.customFooterText}
                  onChange={e => setBrandingForm({ ...brandingForm, customFooterText: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    شارة "مدعوم بواسطة" المخصصة (اختياري):
                  </label>
                  <input
                    type="text"
                    disabled={!licensing.isWhiteLabel}
                    value={brandingForm.customPoweredBy}
                    onChange={e => setBrandingForm({ ...brandingForm, customPoweredBy: e.target.value })}
                    placeholder="e.g. Royal Enterprise Core"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    رابط الشارة المخصصة (URL):
                  </label>
                  <input
                    type="text"
                    disabled={!licensing.isWhiteLabel}
                    value={brandingForm.customPoweredByUrl}
                    onChange={e => setBrandingForm({ ...brandingForm, customPoweredByUrl: e.target.value })}
                    placeholder="https://youragency.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white disabled:opacity-50 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!licensing.isWhiteLabel}
                    checked={brandingForm.removeCommerceOSFooter}
                    onChange={e => setBrandingForm({ ...brandingForm, removeCommerceOSFooter: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 disabled:opacity-50"
                  />
                  <span className="text-xs text-slate-300">
                    حذف شارة "صُنِع بواسطة CommerceOS" من واجهة المتجر الحية تماماً
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!licensing.isWhiteLabel}
                    checked={brandingForm.hideWatermarkInExports}
                    onChange={e => setBrandingForm({ ...brandingForm, hideWatermarkInExports: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800 disabled:opacity-50"
                  />
                  <span className="text-xs text-slate-300">
                    توليد وتصدير كود مصدري نقي (Clean Export) بدون أي حزم تشفير أو مراقبة
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={!licensing.isWhiteLabel}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 disabled:opacity-50 transition-all shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ إعدادات الهوية والتذييل</span>
            </button>
          </form>
        </div>

        {/* Project Limits & Quotas Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>حدود الحساب وحصص المشروع (Quotas)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              الموارد المتاحة لمتجرك ومعدل الاستهلاك الحالي.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Products quota */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-amber-400" />
                  <span>المنتجات المسموحة:</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {quotas.maxProducts === -1 ? 'غير محدود (∞)' : `${activeTenant.id ? 8 : 0} / ${quotas.maxProducts}`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: quotas.maxProducts === -1 ? '15%' : '20%' }} />
              </div>
            </div>

            {/* Builds quota */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                  <span>حزم البناء الشهرية:</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {quotas.usedMonthlyBuilds} / {quotas.maxMonthlyBuilds}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${Math.min(100, (quotas.usedMonthlyBuilds / quotas.maxMonthlyBuilds) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Storage quota */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                  <span>المساحة السحابية (Media):</span>
                </span>
                <span className="font-mono font-bold text-white">
                  {quotas.usedStorageMb} MB / {quotas.storageQuotaMb} MB
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full" 
                  style={{ width: `${Math.min(100, (quotas.usedStorageMb / quotas.storageQuotaMb) * 100)}%` }} 
                />
              </div>
            </div>

            {/* Feature Flags */}
            <div className="pt-2 border-t border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span>تصدير Docker & VPS:</span>
                <span className={`font-bold ${quotas.allowDockerSelfHost ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quotas.allowDockerSelfHost ? 'مفعل ✓' : 'غير مفعل ✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>تطبيقات Android & iOS الأصلية:</span>
                <span className={`font-bold ${quotas.allowNativeIosAndroid ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quotas.allowNativeIosAndroid ? 'مفعل ✓' : 'غير مفعل ✗'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>نطاق CNAME مخصص:</span>
                <span className={`font-bold ${quotas.allowCustomDomain ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {quotas.allowCustomDomain ? 'مفعل ✓' : 'غير مفعل ✗'}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
