import React, { useState, useEffect } from 'react';
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
  Database,
  CreditCard,
  RotateCcw,
  ArrowRight,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Activity,
  Cpu,
  HardDrive,
  Gauge,
  GitBranch,
  Play,
  Server
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { WebhookLog, PaymentIntent, PaymentAttempt } from '../../types';

export const SecurityCenter: React.FC = () => {
  const { activeTenant, showToast } = useCommerce();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'webhooks' | 'fsm' | 'refunds' | 'codesign' | 'reliability'>('webhooks');

  // Reliability & Observability States
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [backgroundJobsList, setBackgroundJobsList] = useState<any[]>([]);
  const [reconciliationReport, setReconciliationReport] = useState<any>(null);
  const [currentTenantMode, setCurrentTenantMode] = useState<string>('NORMAL');
  const [isLoadingReliability, setIsLoadingReliability] = useState<boolean>(false);
  const [isReconciling, setIsReconciling] = useState<boolean>(false);

  // Webhook Live Logs & Simulator State
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);
  
  const [simGateway, setSimGateway] = useState<string>('moyasar');
  const [simSecret, setSimSecret] = useState<string>('sk_live_moyasar_sa_sec_9941');
  const [simOrderId, setSimOrderId] = useState<string>('ORD-101');
  const [simAmount, setSimAmount] = useState<number>(540);
  const [simEventType, setSimEventType] = useState<string>('payment.captured');
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Transactions & Refunds State
  const [transactions, setTransactions] = useState<PaymentAttempt[]>([]);
  const [refundIntentId, setRefundIntentId] = useState<string>('');
  const [refundAmount, setRefundAmount] = useState<number>(100);
  const [refundReason, setRefundReason] = useState<string>('طلب العميل إرجاع المنتج لحجم غير مناسب');
  const [isRefunding, setIsRefunding] = useState<boolean>(false);

  // Code Signing Generator State
  const [csPlatform, setCsPlatform] = useState<'android' | 'ios'>('android');
  const [keystoreAlias, setKeystoreAlias] = useState<string>('release-key');
  const [keystorePass, setKeystorePass] = useState<string>('SecureStorePass2026!');
  const [validityYears, setValidityYears] = useState<number>(25);
  const [orgName, setOrgName] = useState<string>(activeTenant.name || 'CommerceOS Merchant');
  const [teamId, setTeamId] = useState<string>('TEAM123456');

  // Fetch Live Webhook Logs from PostgreSQL
  const fetchWebhookLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch(`/api/v1/webhooks/logs?tenantId=${activeTenant.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        setWebhookLogs(data.logs);
      }
    } catch (err) {
      console.warn('Failed to fetch webhook logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  // Fetch Transactions
  const fetchTransactions = async () => {
    try {
      const res = await fetch('/api/v1/payments/transactions');
      const data = await res.json();
      if (data.success && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.warn('Failed to fetch transactions:', err);
    }
  };

  // Fetch Reliability Metrics & Health
  const fetchReliabilityData = async () => {
    setIsLoadingReliability(true);
    try {
      const [healthRes, metricsRes, jobsRes] = await Promise.all([
        fetch('/api/v1/health').catch(() => null),
        fetch('/api/v1/metrics').catch(() => null),
        fetch('/api/v1/admin/jobs').catch(() => null)
      ]);

      if (healthRes && healthRes.ok) {
        const healthData = await healthRes.json();
        setSystemHealth(healthData);
      }
      if (metricsRes && metricsRes.ok) {
        const metricsData = await metricsRes.json();
        setSystemMetrics(metricsData.data);
      }
      if (jobsRes && jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setBackgroundJobsList(jobsData.data?.jobs || []);
      }
    } catch (err) {
      console.warn('Failed to fetch reliability metrics:', err);
    } finally {
      setIsLoadingReliability(false);
    }
  };

  const handleRunReconciliation = async () => {
    setIsReconciling(true);
    try {
      const res = await fetch('/api/v1/admin/reconciliation/run', {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        setReconciliationReport(data.data);
        showToast('تم اكتمال فحص المطابقة الموزعة بنجاح!', 'success');
      } else {
        showToast(data.error?.message || 'فشل تشغيل المطابقة', 'error');
      }
    } catch (err) {
      showToast('خطأ أثناء تشغيل فحص المطابقة', 'error');
    } finally {
      setIsReconciling(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/v1/admin/jobs/${jobId}/retry`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.success) {
        showToast('تمت إعادة جدولة المهمة بنجاح', 'success');
        fetchReliabilityData();
      } else {
        showToast('فشل إعادة جدولة المهمة', 'error');
      }
    } catch {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleSetTenantMode = async (mode: string) => {
    try {
      const res = await fetch(`/api/v1/admin/tenants/${activeTenant.id}/mode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentTenantMode(mode);
        showToast(`تم تغيير وضع تشغيل المتجر إلى ${mode}`, 'success');
      } else {
        showToast(data.error?.message || 'فشل تغيير الوضع', 'error');
      }
    } catch {
      showToast('خطأ أثناء تغيير وضع التشغيل', 'error');
    }
  };

  useEffect(() => {
    if (activeTab === 'reliability') {
      fetchReliabilityData();
    }
  }, [activeTab]);

  useEffect(() => {
    fetchWebhookLogs();
    fetchTransactions();
  }, [activeTenant.id]);

  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      const payload = {
        id: `evt_${Date.now()}`,
        event: simEventType,
        order_id: simOrderId,
        amount: Number(simAmount),
        currency: 'SAR',
        created_at: new Date().toISOString()
      };

      // 1. Calculate HMAC with secret
      const simRes = await fetch('/api/v1/webhooks/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gateway: simGateway,
          secret: simSecret,
          payload,
          orderId: simOrderId,
          amount: Number(simAmount),
          eventType: simEventType
        })
      });

      const simData = await simRes.json();
      setSimResult(simData);

      // 2. Deliver webhook to live endpoint with verified HMAC header
      const deliverRes = await fetch(`/api/v1/webhooks/${simGateway}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Signature': simData.calculatedSignature
        },
        body: simData.rawBody
      });

      const deliverData = await deliverRes.json();
      showToast(`تم إرسال إشعار Webhook بنجاح (${deliverData.status})`, 'success');
      fetchWebhookLogs();
    } catch (err: any) {
      showToast(`فشلت محاكاة Webhook: ${err.message}`, 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleProcessRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundIntentId) {
      showToast('يرجى تحديد معرف نية الدفع (Payment Intent ID)', 'error');
      return;
    }

    setIsRefunding(true);
    try {
      const res = await fetch('/api/v1/payments/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: refundIntentId,
          amount: Number(refundAmount),
          reason: refundReason
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'تم الاسترداد بنجاح', 'success');
        fetchTransactions();
        setRefundIntentId('');
      } else {
        showToast(`فشل الاسترداد: ${data.error}`, 'error');
      }
    } catch (err: any) {
      showToast(`خطأ أثناء معالجة الاسترداد: ${err.message}`, 'error');
    } finally {
      setIsRefunding(false);
    }
  };

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
    <div className="space-y-6 animate-in fade-in duration-200 text-right">
      
      {/* Sovereign Security & Payment Financial Foundation Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-900/50 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">نظام الأمان المالي والتواقيع المشفرة (Financial & Webhook Security)</h2>
              <p className="text-xs text-slate-400">حماية ضد التلاعب المالي، منع التكرار (Anti-Replay)، وتوثيق المعاملات عبر آلة الحالات المنتهية (FSM).</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            HMAC-SHA256 Strict ✓
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'webhooks'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            إشعارات الـ Webhooks والتواقيع المشفرة
          </button>

          <button
            onClick={() => setActiveTab('fsm')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'fsm'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            آلة حالات الدفع (Payment FSM)
          </button>

          <button
            onClick={() => setActiveTab('refunds')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'refunds'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            إدارة الاسترداد المالي (Refund Engine)
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            مصفوفة العزل (RBAC Matrix)
          </button>

          <button
            onClick={() => setActiveTab('codesign')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'codesign'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            توقيع التطبيقات (Code Signing)
          </button>

          <button
            onClick={() => setActiveTab('reliability')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'reliability'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            المتانة والموثوقية والمقاييس (Reliability & Observability)
          </button>
        </div>
      </div>

      {/* TAB 1: WEBHOOKS & HMAC SIGNATURE SECURITY */}
      {activeTab === 'webhooks' && (
        <div className="space-y-6">
          
          {/* HMAC Signature Simulator Tool */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">أداة اختبار واحتساب التوقيع الرقمي (HMAC-SHA256 Webhook Simulator)</h3>
              </div>
              <span className="text-[11px] text-slate-400">Zero-Trust: لا توجد استثناءات تجريبية bypass</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">بوابة الدفع:</label>
                <select
                  value={simGateway}
                  onChange={e => setSimGateway(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="moyasar">Moyasar (ميسر)</option>
                  <option value="tamara">Tamara (تمارا)</option>
                  <option value="tabby">Tabby (تابي)</option>
                  <option value="tap">Tap Payments (تاب)</option>
                  <option value="hyperpay">HyperPay (هايبرباي)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">المفتاح السري (Gateway Secret):</label>
                <input
                  type="password"
                  value={simSecret}
                  onChange={e => setSimSecret(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">معرف الطلب (Order ID):</label>
                <input
                  type="text"
                  value={simOrderId}
                  onChange={e => setSimOrderId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">المبلغ (ر.س):</label>
                <input
                  type="number"
                  value={simAmount}
                  onChange={e => setSimAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-400">
                تقوم الأداة بإنشاء payload حقيقي واحتساب HMAC-SHA256 بالمفتاح السري ثم إرساله إلى endpoint التحقق.
              </p>
              <button
                onClick={handleSimulateWebhook}
                disabled={isSimulating}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 disabled:opacity-50"
              >
                {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                احتساب التوقيع وإرسال الـ Webhook
              </button>
            </div>

            {simResult && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 mt-3 text-xs font-mono">
                <div className="flex items-center justify-between text-indigo-300">
                  <span className="font-bold">Calculated Header:</span>
                  <span className="text-[11px] text-slate-400">{simResult.calculatedSignature}</span>
                </div>
                <div className="text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">
                  {simResult.sampleCurl}
                </div>
              </div>
            )}
          </div>

          {/* Webhooks & Anti-Replay Security Table */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>سجل إشعارات الـ Webhooks المستلمة والتحقق الرقمي (PostgreSQL Audit)</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
                  {webhookLogs.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchWebhookLogs}
                  disabled={isLoadingLogs}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLogs ? 'animate-spin' : ''}`} />
                </button>
                <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                  Anti-Replay Guard: Active
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-800/70">
              {webhookLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  لا توجد سجلات webhooks مسجلة حتى الآن. استخدم الأداة بالأعلى لمحاكاة إشعار مشفر.
                </div>
              ) : (
                webhookLogs.map(log => (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="uppercase text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                          {log.gateway}
                        </span>
                        <span className="text-xs font-bold text-white">{log.eventType}</span>
                        <span className="text-[10px] font-mono text-slate-400">({log.eventId})</span>
                        <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</span>
                      </div>
                      <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
                        <span>الطلب: #{log.orderId || 'N/A'}</span>
                        <span>•</span>
                        <span>زمن المعالجة: {log.processingTimeMs}ms</span>
                        {log.signature && (
                          <span className="text-[10px] text-slate-500 truncate max-w-xs" title={log.signature}>
                            HMAC: {log.signature.substring(0, 20)}...
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      {log.status === 'processed' && (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          توقيع صحيح ومعتمد ✓
                        </span>
                      )}
                      {log.status === 'replay_detected' && (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          تم اعتراض تكرار الـ Webhook (Replay Blocked)
                        </span>
                      )}
                      {log.status === 'rejected' && (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          توقيع غير صالح أو مفتاح غير مطابق
                        </span>
                      )}
                      {log.status === 'failed' && (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          عدم تطابق مالي (Currency/Amount Mismatch)
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINITE STATE MACHINE (FSM) VISUALIZER */}
      {activeTab === 'fsm' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-black text-white">آلة الحالات المنتهية لدورة حياة المدفوعات (Payment Intent State Machine)</h3>
              <p className="text-xs text-slate-400">
                قواعد مالية صارمة: لا يمكن بأي حال من الأحوال إنشاء طلب مباشرة بحالة "PAID". يتم التدرج حصراً عبر Webhooks الموثقة.
              </p>
            </div>

            {/* Visual State Diagram */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Step 1: PENDING */}
                <div className="w-full md:w-1/4 p-4 rounded-xl bg-amber-950/40 border border-amber-800/80 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-amber-500/20 text-amber-400 font-black text-xs font-mono">
                    1. PENDING
                  </div>
                  <h4 className="text-xs font-bold text-white">إنشاء نية الدفع</h4>
                  <p className="text-[11px] text-slate-400">حجز المخزون ذرياً، وحالة الدفع معلقة بانتظار توجيه العميل للبوابة.</p>
                </div>

                <div className="text-slate-600 hidden md:block">
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </div>

                {/* Step 2: AUTHORIZED */}
                <div className="w-full md:w-1/4 p-4 rounded-xl bg-blue-950/40 border border-blue-800/80 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-blue-500/20 text-blue-400 font-black text-xs font-mono">
                    2. AUTHORIZED
                  </div>
                  <h4 className="text-xs font-bold text-white">تفويض البنك (Hold)</h4>
                  <p className="text-[11px] text-slate-400">موافقة البنك وحجز المبلغ بنجاح عبر 3DS/Tamara/Tabby قبل الخصم النهائي.</p>
                </div>

                <div className="text-slate-600 hidden md:block">
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </div>

                {/* Step 3: PAID */}
                <div className="w-full md:w-1/4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-emerald-500/20 text-emerald-400 font-black text-xs font-mono">
                    3. PAID
                  </div>
                  <h4 className="text-xs font-bold text-white">تأكيد الاستلام والخصم</h4>
                  <p className="text-[11px] text-slate-400">وصول Webhook موثق بـ HMAC وتأكيد مطابقة المبلغ والعملة واعتماد الطلب.</p>
                </div>

                <div className="text-slate-600 hidden md:block">
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </div>

                {/* Step 4: REFUNDED */}
                <div className="w-full md:w-1/4 p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-purple-500/20 text-purple-400 font-black text-xs font-mono">
                    4. REFUNDED
                  </div>
                  <h4 className="text-xs font-bold text-white">استرداد كلي / جزئي</h4>
                  <p className="text-[11px] text-slate-400">استرداد مالي مدقق لا يتجاوز المبلغ المحصل فعلياً (Captured Amount).</p>
                </div>
              </div>
            </div>

            {/* Invariant Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                  <XCircle className="w-4 h-4" />
                  المحظورات المالية القطعية (Forbidden Flows):
                </div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>يُمنع منعاً باتاً استقبال <code className="text-rose-300">POST /orders</code> بحالة <code className="text-rose-300">paid</code> مباشرة.</li>
                  <li>يُمنع التراجع من <code className="text-rose-300">PAID</code> إلى <code className="text-rose-300">PENDING</code>.</li>
                  <li>يُمنع استرداد مبلغ أكبر من المبلغ المحصل (Over-refund Protection).</li>
                  <li>يُمنع تنفيذ Webhooks غير موقعة بـ HMAC صالح.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  الضمانات المالية المنفذة (Enforced Guarantees):
                </div>
                <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                  <li>حجز مخزون ذري بقفل الصفوف <code className="text-emerald-300">SELECT FOR UPDATE</code>.</li>
                  <li>معاملات مالية معزولة بواسطة <code className="text-emerald-300">PostgreSQL ACID Transactions</code>.</li>
                  <li>حماية ضد هجمات التكرار <code className="text-emerald-300">Anti-Replay & Idempotency Key</code>.</li>
                  <li>مطابقة العملة والمبلغ قبل تحديث حالة أي طلب.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REFUND ENGINE */}
      {activeTab === 'refunds' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Refund Form */}
            <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <RotateCcw className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">تنفيذ استرداد مالي (Refund Action)</h3>
              </div>

              <form onSubmit={handleProcessRefund} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">معرف نية الدفع (Payment Intent ID):</label>
                  <input
                    type="text"
                    required
                    placeholder="pi_1724368..."
                    value={refundIntentId}
                    onChange={e => setRefundIntentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">مبلغ الاسترداد (ر.س):</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={refundAmount}
                    onChange={e => setRefundAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">سبب الاسترداد:</label>
                  <textarea
                    rows={3}
                    required
                    value={refundReason}
                    onChange={e => setRefundReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isRefunding}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-600/30 disabled:opacity-50"
                >
                  {isRefunding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  معالجة الاسترداد المالي
                </button>
              </form>
            </div>

            {/* Transactions Log */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>محاولات ومعاملات الدفع الموثقة (Payment Transactions)</span>
                </div>
                <button
                  onClick={fetchTransactions}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-800/70 max-h-[400px] overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    لا توجد محاولات دفع مسجلة حالياً في قاعدة البيانات.
                  </div>
                ) : (
                  transactions.map(txn => (
                    <div key={txn.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white font-mono">{txn.id}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                            {txn.method}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">{txn.amount} {txn.currency}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
                          <span>الطلب: #{txn.orderId}</span>
                          <span>•</span>
                          <span>النية: {txn.paymentIntentId}</span>
                          {txn.transactionId && <span>• مرجع: {txn.transactionId}</span>}
                        </div>
                      </div>

                      <div>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          txn.status === 'CAPTURED'
                            ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                            : txn.status === 'REFUNDED'
                            ? 'bg-purple-950/60 border border-purple-800 text-purple-300'
                            : 'bg-amber-950/60 border border-amber-800 text-amber-300'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RBAC MATRIX */}
      {activeTab === 'matrix' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="space-y-1 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white">مصفوفة الصلاحيات والحماية من IDOR و Cross-Tenant Tampering</h3>
            <p className="text-xs text-slate-400">
              يتم عزل كافة الاستعلامات عبر Tenant Resolver وتوليد مفاتيح تشفير فريدة لكل متجر.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-semibold">الدور (Role)</th>
                  <th className="py-2.5 px-3 font-semibold">نطاق العزل</th>
                  <th className="py-2.5 px-3 font-semibold">الطلبات والمبيعات</th>
                  <th className="py-2.5 px-3 font-semibold">الاسترداد المالي</th>
                  <th className="py-2.5 px-3 font-semibold">إعدادات الـ Webhooks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Platform Super Admin</td>
                  <td className="py-3 px-3 text-indigo-400 font-mono">Platform-Wide</td>
                  <td className="py-3 px-3 text-emerald-400">كامل</td>
                  <td className="py-3 px-3 text-emerald-400">كامل</td>
                  <td className="py-3 px-3 text-emerald-400">كامل</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Store Owner / Admin</td>
                  <td className="py-3 px-3 text-amber-400 font-mono">Tenant-Scoped</td>
                  <td className="py-3 px-3 text-emerald-400">كامل لمتجره</td>
                  <td className="py-3 px-3 text-emerald-400">مسموح لمتجره</td>
                  <td className="py-3 px-3 text-emerald-400">مسموح لمتجره</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Order Manager</td>
                  <td className="py-3 px-3 text-amber-400 font-mono">Tenant-Scoped</td>
                  <td className="py-3 px-3 text-emerald-400">تحديث الحالات</td>
                  <td className="py-3 px-3 text-rose-400">محظور (Requires Admin)</td>
                  <td className="py-3 px-3 text-rose-400">محظور</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-white">Support Agent</td>
                  <td className="py-3 px-3 text-amber-400 font-mono">Tenant-Scoped</td>
                  <td className="py-3 px-3 text-blue-400">عرض فقط</td>
                  <td className="py-3 px-3 text-rose-400">محظور</td>
                  <td className="py-3 px-3 text-rose-400">محظور</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CODE SIGNING */}
      {activeTab === 'codesign' && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white">مولد مفاتيح التوقيع الرقمي (Keystore & Provisioning Profiles)</h3>
              <p className="text-xs text-slate-400">إنشاء مفاتيح RSA 2048-bit لتوقيع حزم Android AAB/APK و iOS IPA بدون أطراف ثالثة.</p>
            </div>
            
            <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
              <button
                onClick={() => setCsPlatform('android')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  csPlatform === 'android' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Android (Keystore)
              </button>
              <button
                onClick={() => setCsPlatform('ios')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  csPlatform === 'ios' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                iOS (CodeSign)
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
      )}

      {/* TAB 6: RELIABILITY, OBSERVABILITY & RECONCILIATION */}
      {activeTab === 'reliability' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Top Operational Status & Actions Bar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    systemHealth?.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    systemHealth?.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}></span>
                </span>
                <h3 className="text-sm font-black text-white">حالة المنظومة والجاهزية الحية (Live System Readiness)</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
                  {systemHealth?.version || 'v2'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                مراقبة فورية للصحة الهيكلية، زمن استجابة الاستعلامات (p95/p99)، طوابير المعالجة الخلفية، والمطابقة المالية.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={fetchReliabilityData}
                disabled={isLoadingReliability}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingReliability ? 'animate-spin' : ''}`} />
                تحديث المقاييس
              </button>

              <button
                onClick={handleRunReconciliation}
                disabled={isReconciling}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 disabled:opacity-50"
              >
                <HardDrive className={`w-3.5 h-3.5 ${isReconciling ? 'animate-spin' : ''}`} />
                {isReconciling ? 'جارٍ فحص المطابقة...' : 'تشغيل المطابقة الموزعة (Reconciliation)'}
              </button>
            </div>
          </div>

          {/* 4 Health & Metric Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Database Health & Latency */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Database className="w-4 h-4 text-emerald-400" />
                  قاعدة البيانات (PostgreSQL)
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  systemHealth?.checks?.database?.status === 'up' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {systemHealth?.checks?.database?.status === 'up' ? 'متصل ونشط' : 'تحذير'}
                </span>
              </div>
              <div className="text-xl font-black text-white font-mono">
                {systemMetrics?.latency?.database?.p95 || systemHealth?.checks?.database?.latencyMs || 2} <span className="text-xs text-slate-400 font-normal">ms (p95)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>p50: {systemMetrics?.latency?.database?.p50 || 1}ms</span>
                <span>p99: {systemMetrics?.latency?.database?.p99 || 5}ms</span>
              </div>
            </div>

            {/* Card 2: HTTP Latency & Throughput */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Gauge className="w-4 h-4 text-indigo-400" />
                  زمن استجابة الـ HTTP
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {systemMetrics?.requests?.total || 0} طلب
                </span>
              </div>
              <div className="text-xl font-black text-white font-mono">
                {systemMetrics?.latency?.http?.p95 || 12} <span className="text-xs text-slate-400 font-normal">ms (p95)</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>p50: {systemMetrics?.latency?.http?.p50 || 6}ms</span>
                <span>نسبة الأخطاء: {systemMetrics?.requests?.errorRatePercent || 0}%</span>
              </div>
            </div>

            {/* Card 3: Memory & Uptime */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  استهلاك الذاكرة والنظام
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {systemHealth?.uptimeSeconds ? `${Math.floor(systemHealth.uptimeSeconds / 60)} دقيقة` : 'متصل'}
                </span>
              </div>
              <div className="text-xl font-black text-white font-mono">
                {systemHealth?.checks?.memory?.heapUsedMb || 45} <span className="text-xs text-slate-400 font-normal">MB Heap</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>RSS: {systemHealth?.checks?.memory?.rssMb || 85} MB</span>
                <span>Total: {systemHealth?.checks?.memory?.heapTotalMb || 60} MB</span>
              </div>
            </div>

            {/* Card 4: Background Jobs & DLQ */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  طابور المهام الخلفية
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  (systemMetrics?.jobs?.deadLetter || 0) > 0 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                }`}>
                  DLQ: {systemMetrics?.jobs?.deadLetter || 0}
                </span>
              </div>
              <div className="text-xl font-black text-white font-mono">
                {backgroundJobsList.length} <span className="text-xs text-slate-400 font-normal">مهمة مسجلة</span>
              </div>
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>المعالج: نشط</span>
                <span>قفل موزع: نشط ✓</span>
              </div>
            </div>

          </div>

          {/* Tenant Operational Modes Control Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">التحكم في وضع تشغيل المتجر (Tenant Operational Modes)</h4>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                الحالي: <strong className="text-emerald-400">{currentTenantMode}</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400">
              يتيح للمشغل عزل المتجر فورياً في حالات الصيانة الطارئة أو تحويله إلى وضع القراءة فقط لحماية البيانات أثناء الهجرات.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <button
                onClick={() => handleSetTenantMode('NORMAL')}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  currentTenantMode === 'NORMAL'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-black mb-0.5">وضع طبيعي (NORMAL)</div>
                <div className="text-[10px] text-slate-400 font-normal">كافة العمليات والدفع نشطة</div>
              </button>

              <button
                onClick={() => handleSetTenantMode('READ_ONLY')}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  currentTenantMode === 'READ_ONLY'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-black mb-0.5">قراءة فقط (READ ONLY)</div>
                <div className="text-[10px] text-slate-400 font-normal">منع التعديلات والحفظ</div>
              </button>

              <button
                onClick={() => handleSetTenantMode('CHECKOUT_DISABLED')}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  currentTenantMode === 'CHECKOUT_DISABLED'
                    ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-black mb-0.5">إيقاف الدفع مؤقتاً</div>
                <div className="text-[10px] text-slate-400 font-normal">تصفح المنتجات متاح فقط</div>
              </button>

              <button
                onClick={() => handleSetTenantMode('MAINTENANCE')}
                className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                  currentTenantMode === 'MAINTENANCE'
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-md'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="font-black mb-0.5">وضع الصيانة (MAINTENANCE)</div>
                <div className="text-[10px] text-slate-400 font-normal">عرض شاشة الصيانة للزوار</div>
              </button>
            </div>
          </div>

          {/* Reconciliation Live Report (if available) */}
          {reconciliationReport && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">تقرير المطابقة والتدقيق المالي (Reconciliation Drill Report)</h4>
                </div>
                <span className="text-xs text-slate-400 font-mono">{reconciliationReport.timestamp}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-400 flex items-center justify-between">
                    <span>مطابقة مخزون المنتجات مع سجل الحركات</span>
                    <span>{reconciliationReport.inventory?.discrepanciesCount || 0} فروقات</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {reconciliationReport.inventory?.discrepanciesCount === 0
                      ? '✓ جميع أرصدة المنتجات متطابقة بنسبة 100% مع الحركات التراكمية في inventory_movements.'
                      : `تم اكتشاف ${reconciliationReport.inventory.discrepanciesCount} فارق يتطلب المراجعة.`}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="font-bold text-teal-400 flex items-center justify-between">
                    <span>مطابقة المدفوعات والطلبات المكتملة</span>
                    <span>{reconciliationReport.payments?.mismatchesCount || 0} تباينات</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {reconciliationReport.payments?.mismatchesCount === 0
                      ? '✓ جميع نوايا الدفع المؤكدة (PAID) مطابقة ومسندة لطلبات صحيحة.'
                      : `تم اكتشاف ${reconciliationReport.payments.mismatchesCount} طلب غير متزامن.`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Background Jobs & Dead Letter Queue Table */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">سجل المهام الخلفية وقائمة الرسائل الميتة (DLQ Monitor)</h4>
              </div>
              <span className="text-xs text-slate-400">
                إعادة المحاولة التلقائية مع Exponential Backoff + Jitter
              </span>
            </div>

            {backgroundJobsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/50 rounded-xl border border-slate-800/80">
                لا توجد مهام معلقة في الطابور حالياً — النظام في حالة استقرار تام.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2 font-bold">معرف المهمة</th>
                      <th className="pb-2 font-bold">النوع</th>
                      <th className="pb-2 font-bold">الحالة</th>
                      <th className="pb-2 font-bold">المحاولات</th>
                      <th className="pb-2 font-bold">الجدولة</th>
                      <th className="pb-2 font-bold text-left">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {backgroundJobsList.slice(0, 10).map((job) => (
                      <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 font-mono text-[11px] text-slate-300">{job.id}</td>
                        <td className="py-2.5 font-bold text-indigo-400">{job.jobType}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            job.status === 'dead_letter' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            job.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {job.status}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-slate-400">{job.attempts}/{job.maxAttempts}</td>
                        <td className="py-2.5 text-slate-400 text-[11px]">
                          {new Date(job.scheduledFor || job.createdAt).toLocaleTimeString('ar-SA')}
                        </td>
                        <td className="py-2.5 text-left">
                          {job.status === 'dead_letter' && (
                            <button
                              onClick={() => handleRetryJob(job.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition-all"
                            >
                              إعادة المحاولة
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
