import React, { useState } from 'react';
import { 
  Smartphone, 
  Download, 
  QrCode, 
  Apple, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Monitor, 
  Terminal, 
  FileCode, 
  Cpu, 
  Globe, 
  ShieldCheck,
  Play,
  ArrowRight,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const MobileAppManager: React.FC = () => {
  const { activeTenant, updateTenant, showToast } = useCommerce();

  const [activePlatform, setActivePlatform] = useState<'all' | 'android' | 'ios' | 'pwa'>('all');
  const [isBuildingApk, setIsBuildingApk] = useState<boolean>(false);
  const [apkDownloadUrl, setApkDownloadUrl] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [appName, setAppName] = useState<string>(activeTenant.appDownloadConfig?.appName || activeTenant.name);
  const [packageName, setPackageName] = useState<string>(activeTenant.appDownloadConfig?.packageName || `sa.${activeTenant.slug}.app`);
  const [appVersion, setAppVersion] = useState<string>(activeTenant.appDownloadConfig?.version || '2.4.0');
  const [enablePush, setEnablePush] = useState<boolean>(activeTenant.pwaConfig?.enablePush ?? true);

  const storeUrl = `https://${activeTenant.domain}`;

  const handleSimulateBuildApk = () => {
    setIsBuildingApk(true);
    setApkDownloadUrl(null);

    setTimeout(() => {
      setIsBuildingApk(false);
      const fakeApk = `https://download.commerceos.app/apk/${activeTenant.slug}-v${appVersion}-release.apk`;
      setApkDownloadUrl(fakeApk);
      showToast('تم بناء حزمة أندرويد (APK / AAB) بنجاح!', 'success');
    }, 2500);
  };

  const handleDownloadManifest = () => {
    const manifest = {
      name: appName,
      short_name: activeTenant.pwaConfig?.shortName || appName,
      start_url: `/?store=${activeTenant.slug}`,
      display: 'standalone',
      background_color: activeTenant.pwaConfig?.backgroundColor || '#0F172A',
      theme_color: activeTenant.theme.tokens.primary,
      orientation: 'portrait',
      icons: [
        {
          src: activeTenant.logo,
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: activeTenant.logo,
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-${activeTenant.slug}.json`;
    a.click();
    showToast('تم تحميل ملف manifest.json بنجاح', 'success');
  };

  const handleDownloadCordovaCapacitorConfig = () => {
    const capacitorConfig = {
      appId: packageName,
      appName: appName,
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        url: storeUrl,
        cleartext: true
      },
      plugins: {
        PushNotifications: {
          presentationOptions: ['badge', 'sound', 'alert']
        }
      }
    };

    const blob = new Blob([JSON.stringify(capacitorConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'capacitor.config.json';
    a.click();
    showToast('تم تصدير إعدادات Capacitor / Cordova للتطبيقات', 'success');
  };

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopiedLink(true);
    showToast('تم نسخ رابط تثبيت التطبيق', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleSaveAppConfig = () => {
    updateTenant(activeTenant.id, {
      appDownloadConfig: {
        appName,
        packageName,
        bundleId: packageName.replace('.app', '.ios'),
        pwaEnabled: true,
        androidApkReady: true,
        iosReady: true,
        version: appVersion
      },
      pwaConfig: {
        ...activeTenant.pwaConfig,
        appName,
        shortName: appName.slice(0, 12),
        enablePush
      }
    });
    showToast('تم حفظ إعدادات التطبيق وتحديث الحزم بنجاح', 'success');
  };

  return (
    <div className="space-y-6 text-right animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-black text-white">تطبيق المتجر الذكي (Mobile App & PWA Studio)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            تحكّم بتطبيقات متجرك وقم بتصديرها لأندرويد (APK / Play Store)، آيفون (iOS Safari WebClip / IPA)، وتطبيق الويب التقدمي (PWA).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveAppConfig}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
          >
            حفظ إعدادات الحزم
          </button>
        </div>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Android Card */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Cpu className="w-4 h-4" />
              <span>تطبيق أندرويد (Android APK / AAB)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              v{appVersion} Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            توليد ملف APK مباشر للتثبيت على هواتف سامسونج، شاومي، وهواوي أو الرفع لـ Google Play.
          </p>
          <div className="pt-1 flex gap-2">
            <button
              onClick={handleSimulateBuildApk}
              disabled={isBuildingApk}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              {isBuildingApk ? (
                <>
                  <div className="w-3 h-3 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" />
                  <span>جاري البناء...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>توليد وتنزيل APK</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* iOS Card */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
              <Apple className="w-4 h-4" />
              <span>تطبيق آيفون وآيباد (iOS / Safari WebClip)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
              Fullscreen App
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            تثبيت فوري على شاشة الآيفون بلمسة واحدة بدون عمولة App Store مع إشعارات Push حية.
          </p>
          <div className="pt-1 flex gap-2">
            <button
              onClick={() => showToast('شارك رابط المتجر مع عملاء الآيفون ثم اضغط "إضافة إلى الشاشة الرئيسية"', 'info')}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>دليل تثبيت iOS</span>
            </button>
          </div>
        </div>

        {/* PWA Card */}
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Monitor className="w-4 h-4" />
              <span>تطبيق الويب والكمبيوتر (PWA)</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
              Offline Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            يعمل بدون إنترنت جزئياً، ويثبت على شاشات Windows, Mac, ChromeOS وأجهزة التابلت.
          </p>
          <div className="pt-1 flex gap-2">
            <button
              onClick={handleDownloadManifest}
              className="flex-1 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>تحميل Manifest.json</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: App Config & Bundling Studio */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>هوية وبيانات تطبيق المتجر</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم التطبيق في شاشة الهاتف *</label>
                <input
                  type="text"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">رقم الإصدار (Version) *</label>
                <input
                  type="text"
                  value={appVersion}
                  onChange={e => setAppVersion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Package Name (معرف حزمة أندرويد و iOS) *</label>
              <input
                type="text"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono text-left"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <div className="font-bold text-slate-200">تفعيل الإشعارات الفورية (Push Notifications)</div>
                <div className="text-[11px] text-slate-400">إرسال تنبيهات بالعروض وتحديثات الشحن لهواتف العملاء</div>
              </div>
              <input
                type="checkbox"
                checked={enablePush}
                onChange={e => setEnablePush(e.target.checked)}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            {/* Developer Package Exporters */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300 mb-2">تصدير حزم التطوير الأصلية (Developer Bundles):</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleDownloadCordovaCapacitorConfig}
                  className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-right text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">Capacitor / Flutter Wrapper</div>
                    <div className="text-[10px] text-slate-400">capacitor.config.json</div>
                  </div>
                  <Download className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  type="button"
                  onClick={handleDownloadManifest}
                  className="p-3 bg-slate-950 hover:bg-slate-800 rounded-xl border border-slate-800 text-right text-xs transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-white">PWA Web Manifest</div>
                    <div className="text-[10px] text-slate-400">manifest.webmanifest</div>
                  </div>
                  <Download className="w-4 h-4 text-purple-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 5 Columns: QR Code & Mobile Preview */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-slate-950 border border-slate-800 text-amber-400">
              <QrCode className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-sm font-black text-white">رمز QR لتثبيت التطبيق على الجوال فوراً</h3>
              <p className="text-xs text-slate-400 mt-1">
                وجّه كاميرا هاتفك لمسح الرمز وتثبيت متجر {activeTenant.name} مباشرة
              </p>
            </div>

            {/* QR Visual Canvas Box */}
            <div className="w-44 h-44 mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-4 border-amber-500/30">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(storeUrl)}`} 
                alt="QR Code" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-right space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">رابط التطبيق المباشر:</span>
                <button
                  type="button"
                  onClick={handleCopyStoreLink}
                  className="text-amber-400 hover:underline flex items-center gap-1 font-bold text-[11px]"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-slate-300 truncate bg-slate-900 p-2 rounded border border-slate-800">
                {storeUrl}
              </div>
            </div>

            {apkDownloadUrl && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 text-right space-y-1.5 animate-in zoom-in-95">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ملف التثبيت (APK) جاهز للتحميل:</span>
                </div>
                <div className="font-mono text-[10px] text-emerald-400/80 truncate">
                  {apkDownloadUrl}
                </div>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showToast('بدأ تحميل حزمة APK لجهازك 📱', 'success');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل APK الآن</span>
                </a>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
