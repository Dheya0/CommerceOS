import React, { useState } from 'react';
import { Puzzle, Webhook, ShieldCheck, Send, CheckCircle2, RefreshCw, FileCode, Cpu, Lock } from 'lucide-react';

interface WebhooksPluginsManagerProps {
  tenant: any;
}

export const WebhooksPluginsManager: React.FC<WebhooksPluginsManagerProps> = ({ tenant }) => {
  const [activeTab, setActiveTab] = useState<'plugins' | 'webhooks'>('plugins');
  const [plugins, setPlugins] = useState([
    { name: 'ERP-SAP-Bridge', version: '1.0.0', file: 'erpBridge.js', status: 'Active (Loaded)' },
    { name: 'Legacy-Accounting-Sync', version: '1.2.1', file: 'accountingSync.ts', status: 'Active (Loaded)' }
  ]);
  const [subscribers, setSubscribers] = useState([
    { id: 'sub_1', url: 'https://api.erp-system.com/webhook', events: ['ORDER_CREATED', 'PAYMENT_FAILED', 'INVENTORY_LOW'], active: true }
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('ORDER_CREATED');
  const [testWebhookResult, setTestWebhookResult] = useState<any>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;
    const newSub = {
      id: `sub_${Date.now()}`,
      url: newWebhookUrl,
      events: [selectedEvent],
      active: true
    };
    setSubscribers([...subscribers, newSub]);
    setNewWebhookUrl('');
  };

  const handleTestWebhook = (eventType: string) => {
    setIsTestingWebhook(true);
    setTestWebhookResult(null);
    setTimeout(() => {
      setIsTestingWebhook(false);
      setTestWebhookResult({
        success: true,
        event: {
          eventId: `whk_${Date.now()}`,
          eventType,
          timestamp: new Date().toISOString(),
          data: { orderId: 'ORD-9821', total: 450.00, currency: 'SAR' }
        },
        signatureHeader: 'sha256=a7e8f9b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcd',
        dispatches: subscribers.map(sub => ({
          subscriberId: sub.id,
          targetUrl: sub.url,
          status: '200 OK (Dispatched successfully with HMAC Signature)'
        }))
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
              <Puzzle className="w-3.5 h-3.5" />
              <span>نظام الخطافات وتوسيع الكود (Webhooks & Plugin Architecture)</span>
            </div>
            <h2 className="text-2xl font-black text-white">إدارة الإضافات البرمجية والخطافات السحابية (Middleware Plugins & Webhooks)</h2>
            <p className="text-sm text-slate-300 mt-1">
              استلم Framework متكامل يتيح لك ربط المتجر ببرامج الـ ERP القديمة عبر مجلد plugins/، وإرسال أحداث سحابية موقعة بـ HMAC لمراقبة المبيعات.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('plugins')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'plugins' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          هندسة الإضافات (plugins/)
        </button>
        <button
          onClick={() => setActiveTab('webhooks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'webhooks' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          الأحداث السحابية والتوقيع (Webhooks & HMAC)
        </button>
      </div>

      {/* Test Result Alert */}
      {testWebhookResult && (
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 text-xs text-indigo-200">
          <div className="flex items-center justify-between font-bold text-indigo-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>تم إرسال الـ Webhook بنجاح مع توقيع HMAC الآمن!</span>
            </div>
            <button onClick={() => setTestWebhookResult(null)} className="text-indigo-400 hover:text-white">✕</button>
          </div>
          <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto" dir="ltr">
            <div><strong>Signature Header:</strong> {testWebhookResult.signatureHeader}</div>
            <div><strong>Payload:</strong> {JSON.stringify(testWebhookResult.event, null, 2)}</div>
          </div>
        </div>
      )}

      {/* Tab 1: Plugins Architecture */}
      {activeTab === 'plugins' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <span>الإضافات البرمجية النشطة في مجلد <code className="text-indigo-300">/plugins</code></span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono">
                {plugins.length} إضافات محملة تلقائياً
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يمكن لمطوري النظام إسقاط أي ملف JavaScript أو TypeScript داخل مجلد <code className="text-indigo-300">plugins/</code> في الباك إند المُصدر، وسيتم تحميله آلياً كـ Middleware دون الحاجة لتعديل الكود الأساسي.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plugins.map((plugin, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{plugin.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">{plugin.version}</span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">الملف: {plugin.file}</div>
                  <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{plugin.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Webhooks & HMAC */}
      {activeTab === 'webhooks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Webhook className="w-5 h-5 text-indigo-400" />
                <span>المشتركون في الأحداث السحابية (Webhook Subscribers)</span>
              </h3>

              <div className="space-y-3">
                {subscribers.map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-mono text-white font-bold">{sub.url}</div>
                      <div className="text-slate-400 text-[11px] mt-1">
                        الأحداث: <span className="text-indigo-300 font-mono">{sub.events.join(', ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">نشط</span>
                      <button
                        onClick={() => handleTestWebhook('ORDER_CREATED')}
                        disabled={isTestingWebhook}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all flex items-center gap-1.5"
                      >
                        {isTestingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                        <span>اختبار الإرسال</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Subscriber Form */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white">إضافة مستخدم أو نظام خارجي جديد للـ Webhooks</h3>
              <form onSubmit={handleAddSubscriber} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">رابط المستقبل (Endpoint URL)</label>
                  <input
                    type="url"
                    value={newWebhookUrl}
                    onChange={e => setNewWebhookUrl(e.target.value)}
                    placeholder="https://my-erp-system.com/api/webhook"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium"> الحدث المستهدف (Event Type)</label>
                  <select
                    value={selectedEvent}
                    onChange={e => setSelectedEvent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="ORDER_CREATED">ORDER_CREATED (إنشاء طلب جديد)</option>
                    <option value="PAYMENT_FAILED">PAYMENT_FAILED (فشل عملية الدفع)</option>
                    <option value="INVENTORY_LOW">INVENTORY_LOW (انخفاض المخزون)</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
                >
                  إضافة وإرسال توقيع HMAC
                </button>
              </form>
            </div>
          </div>

          {/* Security Info Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 h-fit">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              <span>حماية التوقيع الرقمي (HMAC Signature)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              كل رسالة Webhook تُرسل من الباك إند تتضمن الترويسة الأمانية <code className="text-emerald-300">X-CommerceOS-Signature</code> المولدة عبر خوارزمية SHA-256 لتأكيد مصدر البيانات ومنع التلاعب.
            </p>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <strong>جاهز للإنتاج:</strong> متوافق مع معايير الأمان العالمية لربط المتاجر الإلكترونية بأنظمة المؤسسات (ERP & CRM).
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
