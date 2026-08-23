import React, { useState } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Settings, 
  Play, 
  ShieldCheck,
  Smartphone,
  ChevronRight
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { NotificationLog } from '../../types';

export const NotificationsManager: React.FC = () => {
  const { activeTenant, showToast } = useCommerce();

  const [testChannel, setTestChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [testRecipient, setTestRecipient] = useState<string>('+966501234567');
  const [testTemplate, setTestTemplate] = useState<string>('order_created');
  const [isSending, setIsSending] = useState<boolean>(false);

  const [logs, setLogs] = useState<NotificationLog[]>([
    {
      id: 'ntf-01',
      tenantId: activeTenant.id,
      channel: 'whatsapp',
      recipient: '+966501112233',
      recipientName: 'عبدالله السبيعي',
      triggerEvent: 'order_created',
      templateName: 'order_confirmation_ar',
      messageBody: 'عزيزي عبدالله السبيعي، تم استلام طلبك رقم (#ORD-101) بنجاح بقيمة 540 ريال. سنوافيك برابط التتبع فور الشحن 🍯',
      status: 'delivered',
      sentAt: 'اليوم، 21:15',
      provider: 'whatsapp_cloud_api'
    },
    {
      id: 'ntf-02',
      tenantId: activeTenant.id,
      channel: 'sms',
      recipient: '+966554443322',
      recipientName: 'نورة القحطاني',
      triggerEvent: 'order_shipped',
      templateName: 'order_shipping_tracking_ar',
      messageBody: 'تم شحن طلبك (#ORD-102) عبر أرامكس! رقم الشحنة: 394829104. التتبع: https://track.aramex.com/394829104 🚚',
      status: 'delivered',
      sentAt: 'اليوم، 18:30',
      provider: 'unifonic'
    },
    {
      id: 'ntf-03',
      tenantId: activeTenant.id,
      channel: 'whatsapp',
      recipient: '+966509988776',
      recipientName: 'فهد المطيري',
      triggerEvent: 'payment_confirmed',
      templateName: 'payment_success_ar',
      messageBody: 'تم تأكيد استلام الحوالة البنكية لطلبك (#ORD-103). شكراً لتعاملك معنا! 💳✅',
      status: 'delivered',
      sentAt: 'أمس، 14:10',
      provider: 'whatsapp_cloud_api'
    }
  ]);

  const templatePreviews: Record<string, { title: string; body: string }> = {
    order_created: {
      title: 'تأكيد استلام الطلب',
      body: `عزيزي {اسم_العميل}، تم استلام طلبك رقم {رقم_الطلب} في متجر ${activeTenant.name} بنجاح بقيمة {المجموع} ر.س. جاري تجهيز طلبك بعناية 🛍️`
    },
    payment_confirmed: {
      title: 'تأكيد نجاح الدفع',
      body: `تم تأكيد دفع طلبك {رقم_الطلب} بنجاح. شكراً لثقتك بـ ${activeTenant.name}! سيتم إشعارك فور الشحن 💳✨`
    },
    order_shipped: {
      title: 'إشعار الشحن ورقم التتبع',
      body: `طلبك {رقم_الطلب} في الطريق إليك الآن عبر {شركة_الشحن}! تتبع شحنتك عبر الرابط: {رابط_التتبع} 🚚📦`
    },
    order_delivered: {
      title: 'تم تسليم الطلب بنجاح',
      body: `تم تسليم طلبك {رقم_الطلب} بنجاح! يسعدنا تقييمك لتجربة التسوق معنا ⭐⭐⭐⭐⭐`
    },
    cart_recovery: {
      title: 'استعادة السلة المتروكة',
      body: `مرحباً {اسم_العميل} 👋 تركت منتجات رائعة في سلتك! استخدم كود خصم ({كود_الخصم}) لإتمام طلبك الآن: {رابط_السلة} 🎁`
    }
  };

  const handleSendTest = () => {
    setIsSending(true);
    setTimeout(() => {
      const newLog: NotificationLog = {
        id: `ntf-${Date.now()}`,
        tenantId: activeTenant.id,
        channel: testChannel,
        recipient: testRecipient,
        recipientName: 'عميل تجريبي',
        triggerEvent: testTemplate as any,
        templateName: `${testTemplate}_ar`,
        messageBody: templatePreviews[testTemplate]?.body.replace('{اسم_العميل}', 'عبدالعزيز').replace('{رقم_الطلب}', '#ORD-998') || '',
        status: 'delivered',
        sentAt: 'الآن',
        provider: testChannel === 'whatsapp' ? 'whatsapp_cloud_api' : 'unifonic'
      };

      setLogs(prev => [newLog, ...prev]);
      setIsSending(false);
      showToast(`تم إرسال إشعار تجريبي عبر ${testChannel === 'whatsapp' ? 'الواتساب' : 'SMS'} بنجاح!`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Integrations Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">WhatsApp Business Cloud API</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                متصل ونشط (Meta Verified)
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">رقم رسمي</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Unifonic & Twilio SMS Gateway</div>
              <div className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                متصل (Saudi Sender ID)
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">SMS</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">المحفزات التلقائية (Webhooks)</div>
              <div className="text-[11px] text-purple-300 font-semibold">تفعيل لحظي فور تغير حالة الطلب</div>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-1 rounded-lg">نشط 100%</span>
        </div>
      </div>

      {/* Simulator & Live Test Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Test Console */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>مختبر الإشعارات المباشر (Simulator)</span>
            </div>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Live Sandbox
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">قناة الإشعار:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTestChannel('whatsapp')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    testChannel === 'whatsapp' 
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 shadow-sm' 
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setTestChannel('sms')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    testChannel === 'sms' 
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 shadow-sm' 
                      : 'bg-slate-800/60 text-slate-400 border-slate-700'
                  }`}
                >
                  <Phone className="w-4 h-4 text-blue-400" />
                  SMS (رسالة نصية)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">حدث الإشعار / القالب:</label>
              <select
                value={testTemplate}
                onChange={e => setTestTemplate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="order_created">إنشاء طلب جديد (Order Created)</option>
                <option value="payment_confirmed">تأكيد نجاح الدفع (Payment Paid)</option>
                <option value="order_shipped">شحن الطلب وتتبع الشحنة (Order Shipped)</option>
                <option value="order_delivered">تسليم الطلب للعميل (Delivered)</option>
                <option value="cart_recovery">استعادة السلة المتروكة (Cart Recovery)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم جوال المستلم للتجربة:</label>
              <input
                type="text"
                value={testRecipient}
                onChange={e => setTestRecipient(e.target.value)}
                placeholder="+966501234567"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <button
              onClick={handleSendTest}
              disabled={isSending}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSending ? 'جاري الإرسال...' : 'إرسال إشعار تجريبي فوري'}</span>
            </button>
          </div>
        </div>

        {/* Message Live Preview Card */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>معاينة الرسالة كما ستصل لهاتف العميل</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {templatePreviews[testTemplate]?.title}
              </span>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="max-w-md mx-auto bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-2.5 pb-3 mb-3 border-b border-slate-800/80">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {testChannel === 'whatsapp' ? 'WA' : 'SMS'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{activeTenant.name}</div>
                  <div className="text-[10px] text-emerald-400">حساب أعمال رسمي وموثق ✔</div>
                </div>
              </div>

              <div className="bg-emerald-950/50 border border-emerald-800/50 text-emerald-100 p-3.5 rounded-2xl rounded-tr-none text-xs leading-relaxed">
                {templatePreviews[testTemplate]?.body}
                <div className="text-[9px] text-emerald-400 text-left mt-2 flex items-center justify-end gap-1 font-mono">
                  <span>الآن</span>
                  <span>✓✓</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>يتم إدراج المتغيرات (اسم العميل، رقم الشحنة، رابط التتبع) تلقائياً عبر مشغل الأحداث بالخادم.</span>
          </div>
        </div>

      </div>

      {/* Logs Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>سجل إرسال الإشعارات والرسائل التلقائية</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
              {logs.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/70">
          {logs.map(log => (
            <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    log.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {log.channel === 'whatsapp' ? 'واتساب' : 'SMS'}
                  </span>
                  <span className="text-xs font-bold text-white">{log.recipientName} ({log.recipient})</span>
                  <span className="text-[10px] text-slate-500 font-mono">{log.sentAt}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{log.messageBody}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[11px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  تم التوصيل ({log.provider})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
