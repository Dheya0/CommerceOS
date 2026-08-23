import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  RefreshCw, 
  FileCheck, 
  Zap, 
  Code, 
  Copy, 
  Check, 
  Terminal, 
  AlertTriangle,
  Smartphone,
  Layers,
  Database
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { WebhookLog } from '../../types';

export const SecurityCenter: React.FC = () => {
  const { activeTenant, showToast } = useCommerce();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Code Signing Generator State
  const [csPlatform, setCsPlatform] = useState<'android' | 'ios'>('android');
  const [keystoreAlias, setKeystoreAlias] = useState<string>('release-key');
  const [keystorePass, setKeystorePass] = useState<string>('SecureStorePass2026!');
  const [validityYears, setValidityYears] = useState<number>(25);
  const [orgName, setOrgName] = useState<string>(activeTenant.name || 'CommerceOS Merchant');
  const [teamId, setTeamId] = useState<string>('TEAM123456');

  const [webhookLogs] = useState<WebhookLog[]>([
    {
      id: 'wh-01',
      gateway: 'tamara',
      eventId: 'evt_tamara_984321',
      eventType: 'order_approved',
      signature: 'sha256=4f9b8c2d1e0a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
      verified: true,
      timestamp: '2026-08-21 21:40',
      payload: { order_id: 'ord-101', status: 'approved', captured_amount: 540 },
      orderId: 'ord-101',
      status: 'processed',
      processingTimeMs: 14
    },
    {
      id: 'wh-02',
      gateway: 'moyasar',
      eventId: 'evt_moyasar_771239',
      eventType: 'payment_paid',
      signature: 'sha256=8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b',
      verified: true,
      timestamp: '2026-08-21 19:22',
      payload: { payment_id: 'pay_771239', amount: 320, currency: 'SAR', source: 'ApplePay' },
      orderId: 'ord-102',
      status: 'processed',
      processingTimeMs: 11
    },
    {
      id: 'wh-03',
      gateway: 'tamara',
      eventId: 'evt_tamara_984321',
      eventType: 'order_approved',
      signature: 'sha256=4f9b8c2d1e0a8b7c6d5e4f3a2b1c0d9e8f7a6b5c',
      verified: true,
      timestamp: '2026-08-21 21:42',
      payload: { order_id: 'ord-101', status: 'approved' },
      orderId: 'ord-101',
      status: 'replay_detected',
      processingTimeMs: 2
    }
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    showToast('تم نسخ الأمر إلى الحافظة بنجاح!', 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Keytool Script
  const androidKeytoolCmd = `keytool -genkey -v -keystore release.keystore -alias "${keystoreAlias}" -keyalg RSA -keysize 2048 -validity ${validityYears * 365} -storepass "${keystorePass}" -keypass "${keystorePass}" -dname "CN=${activeTenant.name}, O=${orgName}, C=SA"`;

  const androidGradleConfig = `android {
    signingConfigs {
        release {
            storeFile file("release.keystore")
            storePassword "${keystorePass}"
            keyAlias "${keystoreAlias}"
            keyPassword "${keystorePass}"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}`;

  const iosExportOptions = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>${teamId}</string>
    <key>signingStyle</key>
    <string>manual</string>
    <key>provisioningProfiles</key>
    <dict>
        <key>${activeTenant.mobileApp?.bundleId || 'com.store.app'}</key>
        <string>Store_AppStore_Distribution</string>
    </dict>
</dict>
</plist>`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Security Status Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">حماية تضارب المخزون (Mutex)</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Atomic Locks نشط
          </div>
          <div className="text-[11px] text-slate-400 mt-1">يمنع البيع المزدوج في الشراء المتزامن</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">التحقق من الـ Webhooks</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-blue-400">HMAC-SHA256</div>
          <div className="text-[11px] text-slate-400 mt-1">مقاومة هجمات التكرار (Anti-Replay)</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">عزل ملفات التحويل البنكي</span>
            <FileCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black text-purple-400">MIME Sanitized</div>
          <div className="text-[11px] text-slate-400 mt-1">فحص Magic Bytes وحظر الـ Webshells</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">مفاتيح Idempotency للعمليات</span>
            <Key className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">Idempotency 100%</div>
          <div className="text-[11px] text-slate-400 mt-1">منع تكرار الخصم عند انقطاع الشبكة</div>
        </div>

      </div>

      {/* Code Signing & Keystore Automation Studio */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              أداة أتمتة وتوليد مفاتيح توقيع التطبيقات (Code Signing & Keystore Generator)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              توليد مفاتيح الإنتاج الرقمية لأندرويد (Keystore) وملفات تصدير iOS (ExportOptions.plist) للرفع الفوري على Google Play و App Store.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCsPlatform('android')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                csPlatform === 'android' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android Keystore
            </button>
            <button
              onClick={() => setCsPlatform('ios')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                csPlatform === 'ios' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              iOS Distribution
            </button>
          </div>
        </div>

        {csPlatform === 'android' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">اسم المفتاح (Alias):</label>
                <input
                  type="text"
                  value={keystoreAlias}
                  onChange={e => setKeystoreAlias(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">كلمة المرور (Keystore Password):</label>
                <input
                  type="text"
                  value={keystorePass}
                  onChange={e => setKeystorePass(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">صلاحية المفتاح (سنة):</label>
                <input
                  type="number"
                  value={validityYears}
                  onChange={e => setValidityYears(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Generated Command 1: keytool */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  أمر توليد الـ Keystore (نفذه في مجلد android/app):
                </span>
                <button
                  onClick={() => copyToClipboard(androidKeytoolCmd, 'cmd')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedKey === 'cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  نسخ الأمر
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {androidKeytoolCmd}
              </pre>
            </div>

            {/* Generated Config 2: build.gradle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" />
                  كود التوقيع التلقائي لملف android/app/build.gradle:
                </span>
                <button
                  onClick={() => copyToClipboard(androidGradleConfig, 'gradle')}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedKey === 'gradle' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  نسخ الكود
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {androidGradleConfig}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Apple Developer Team ID:</label>
                <input
                  type="text"
                  value={teamId}
                  onChange={e => setTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">iOS Bundle Identifier:</label>
                <input
                  type="text"
                  disabled
                  value={activeTenant.mobileApp?.bundleId || 'com.store.app'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700 text-xs text-slate-400 font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-blue-400" />
                  ملف التصدير (ExportOptions.plist):
                </span>
                <button
                  onClick={() => copyToClipboard(iosExportOptions, 'plist')}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-[11px] font-bold"
                >
                  {copiedKey === 'plist' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  نسخ الملف
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-blue-300/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {iosExportOptions}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Webhooks & Anti-Replay Security Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>سجل معالجة الـ Webhooks والتحقق الرقمي من التواقيع</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
              {webhookLogs.length}
            </span>
          </div>
          <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
            Anti-Replay Guard: Active
          </span>
        </div>

        <div className="divide-y divide-slate-800/70">
          {webhookLogs.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="uppercase text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {log.gateway}
                  </span>
                  <span className="text-xs font-bold text-white">{log.eventType}</span>
                  <span className="text-[10px] font-mono text-slate-400">({log.eventId})</span>
                  <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                  <span>الطلب: #{log.orderId}</span>
                  <span>•</span>
                  <span>زمن المعالجة: {log.processingTimeMs}ms</span>
                </div>
              </div>

              <div>
                {log.status === 'processed' && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    توقيع صحيح ومعتمد
                  </span>
                )}
                {log.status === 'replay_detected' && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    تم اعتراض تكرار الـ Webhook (Idempotent ACK)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
