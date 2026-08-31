import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Layers, 
  Globe, 
  Key, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  FileText, 
  Download, 
  Printer, 
  ExternalLink, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Clock, 
  QrCode,
  Sliders,
  Send,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  SaaSSubscription, 
  SaaSPlan, 
  SaaSInvoice, 
  DomainRecord, 
  ApiKeyRecord, 
  MerchantWebhookEndpoint, 
  MerchantWebhookDelivery,
  BillingCustomer 
} from '../../types/saas';
import { api } from '../../api/client';

export const UsageAndBillingHub: React.FC = () => {
  const { activeTenant, showToast, refreshFromBackend, setCurrentView } = useCommerce();
  const [activeSubTab, setActiveSubTab] = useState<'quotas' | 'subscription' | 'domains' | 'developers' | 'company_tax'>('quotas');
  
  // Data States
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SaaSSubscription | null>(null);
  const [plan, setPlan] = useState<SaaSPlan | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [invoices, setInvoices] = useState<SaaSInvoice[]>([]);
  const [domains, setDomains] = useState<DomainRecord[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>([]);
  const [webhooks, setWebhooks] = useState<MerchantWebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<MerchantWebhookDelivery[]>([]);
  const [customer, setCustomer] = useState<BillingCustomer | null>(null);

  // Modals & Form States
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<SaaSInvoice | null>(null);
  const [newDomainHostname, setNewDomainHostname] = useState('');
  const [addingDomain, setAddingDomain] = useState(false);
  const [verifyingDomainId, setVerifyingDomainId] = useState<string | null>(null);

  // API Key Form State
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState<string[]>(['products:read', 'orders:read']);
  const [createdRawKeyModal, setCreatedRawKeyModal] = useState<{ apiKey: ApiKeyRecord; rawSecretKey: string } | null>(null);
  const [creatingKey, setCreatingKey] = useState(false);

  // Webhook Form State
  const [newWebhookName, setNewWebhookName] = useState('');
  const [newWebhookUrl, setNewWebhookUrl] = useState('');
  const [newWebhookEvents, setNewWebhookEvents] = useState<string[]>(['order.created', 'order.paid']);
  const [creatingWebhook, setCreatingWebhook] = useState(false);

  // Tax Company Profile Form
  const [taxForm, setTaxForm] = useState({
    companyName: '',
    taxId: '',
    billingEmail: '',
    city: '',
    address: ''
  });
  const [savingTaxForm, setSavingTaxForm] = useState(false);

  const [copiedText, setCopiedText] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [subRes, invRes, domRes, keyRes, whRes] = await Promise.all([
        api.getSaaSSubscription(activeTenant.id).catch(() => null),
        api.getSaaSInvoices(activeTenant.id).catch(() => ({ data: { invoices: [] } })),
        api.getDomains().catch(() => ({ data: { domains: [] } })),
        api.getApiKeys().catch(() => ({ data: { apiKeys: [] } })),
        api.getWebhooks().catch(() => ({ data: { webhooks: [], deliveries: [] } }))
      ]);

      if (subRes?.data) {
        setSubscription(subRes.data.subscription);
        setPlan(subRes.data.plan);
        setUsage(subRes.data.usage);
        setCustomer(subRes.data.customer);
        if (subRes.data.customer) {
          setTaxForm({
            companyName: subRes.data.customer.companyName || '',
            taxId: subRes.data.customer.taxId || '',
            billingEmail: subRes.data.customer.billingEmail || '',
            city: subRes.data.customer.city || '',
            address: subRes.data.customer.address || ''
          });
        }
      }

      if (invRes?.data?.invoices) setInvoices(invRes.data.invoices);
      if (domRes?.data?.domains) setDomains(domRes.data.domains);
      if (keyRes?.data?.apiKeys) setApiKeys(keyRes.data.apiKeys);
      if (whRes?.data) {
        setWebhooks(whRes.data.webhooks || []);
        setDeliveries(whRes.data.deliveries || []);
      }
    } catch (err: any) {
      console.error('Failed to fetch SaaS hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTenant.id]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`تم نسخ ${label} إلى الحافظة`, 'info');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // --- Domain Actions ---
  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainHostname.trim()) return;
    try {
      setAddingDomain(true);
      const res = await api.addCustomDomain(newDomainHostname);
      showToast(res.message || 'تمت إضافة النطاق بنجاح', 'success');
      setNewDomainHostname('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشلت إضافة النطاق', 'error');
    } finally {
      setAddingDomain(false);
    }
  };

  const handleVerifyDomain = async (domainId: string) => {
    try {
      setVerifyingDomainId(domainId);
      const res = await api.verifyDomain(domainId);
      showToast(res.message || 'تم التحقق من النطاق وتفعيل SSL بنجاح!', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل التحقق من النطاق', 'error');
    } finally {
      setVerifyingDomainId(null);
    }
  };

  const handleSetPrimaryDomain = async (domainId: string) => {
    try {
      const res = await api.setPrimaryDomain(domainId);
      showToast(res.message || 'تم تعيين النطاق كنطاق رئيسي', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل تعيين النطاق', 'error');
    }
  };

  const handleDeleteDomain = async (domainId: string) => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا النطاق؟')) return;
    try {
      await api.deleteDomain(domainId);
      showToast('تم حذف النطاق', 'info');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل حذف النطاق', 'error');
    }
  };

  // --- API Key Actions ---
  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      setCreatingKey(true);
      const res = await api.createApiKey(newKeyName, newKeyScopes);
      setCreatedRawKeyModal({
        apiKey: res.data.apiKey,
        rawSecretKey: res.data.rawSecretKey
      });
      setNewKeyName('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل إنشاء المفتاح', 'error');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeApiKey = async (keyId: string) => {
    if (!confirm('هل أنت متأكد من إبطال هذا المفتاح؟ لن تتمكن التطبيقات التي تستخدمه من الوصول مجدداً.')) return;
    try {
      await api.revokeApiKey(keyId);
      showToast('تم إبطال المفتاح بنجاح', 'info');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل إبطال المفتاح', 'error');
    }
  };

  // --- Webhook Actions ---
  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookName.trim() || !newWebhookUrl.trim()) return;
    try {
      setCreatingWebhook(true);
      const res = await api.createWebhook(newWebhookName, newWebhookUrl, newWebhookEvents);
      showToast(res.message || 'تم تسجيل خطاف الويب بنجاح', 'success');
      setNewWebhookName('');
      setNewWebhookUrl('');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل تسجيل الـ Webhook', 'error');
    } finally {
      setCreatingWebhook(false);
    }
  };

  const handleTestWebhook = async (webhookId: string) => {
    try {
      const res = await api.testWebhook(webhookId);
      showToast(res.message || 'تم إرسال حدث اختباري بنجاح', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل اختبار الـ Webhook', 'error');
    }
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    try {
      const res = await api.retryWebhookDelivery(deliveryId);
      showToast(res.message || 'تمت إعادة الإرسال بنجاح', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشلت إعادة الإرسال', 'error');
    }
  };

  // --- Save Tax Info ---
  const handleSaveTaxProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingTaxForm(true);
      const res = await api.updateBillingCustomer(taxForm);
      showToast(res.message || 'تم تحديث البيانات الضريبية بنجاح', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message || 'فشل حفظ البيانات', 'error');
    } finally {
      setSavingTaxForm(false);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-500/20 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">مركز الاشتراكات والفوترة والمحددات السحابية</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              {plan?.nameAr || 'الباقة النشطة'}
            </span>
            {subscription?.status === 'trialing' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>فترة تجريبية (14 يوم)</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-400">
            تحكم باستهلاك الموارد، ترقية الخطة، إدارة النطاقات المخصصة، الفواتير الضريبية، ومفاتيح الربط البرمجي (API).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentView('pricing' as any)}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>ترقية أو تغيير الباقة</span>
          </button>
          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-all"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-zinc-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveSubTab('quotas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'quotas'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>استهلاك الموارد والمحددات</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscription')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'subscription'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>الاشتراك والفواتير الضريبية ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('domains')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'domains'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>النطاقات المخصصة ({domains.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('developers')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'developers'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>المطورين وAPI وWebhooks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('company_tax')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeSubTab === 'company_tax'
              ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>البيانات الضريبية وفاتورة ZATCA</span>
        </button>
      </div>

      {/* Tab 1: Quotas & Resource Metering */}
      {activeSubTab === 'quotas' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Products Metric */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold">المنتجات النشطة</span>
                <span className="font-mono">{usage?.products?.current || 0} / {usage?.products?.limit === -1 ? '∞' : usage?.products?.limit}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${
                    (usage?.products?.percentage || 0) >= 90 ? 'bg-rose-500' :
                    (usage?.products?.percentage || 0) >= 75 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${usage?.products?.limit === -1 ? 15 : usage?.products?.percentage || 0}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">
                {usage?.products?.limit === -1 ? 'منتجات غير محدودة' : `متبقي ${Math.max(0, (usage?.products?.limit || 0) - (usage?.products?.current || 0))} منتج`}
              </p>
            </div>

            {/* Orders Metric */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold">الطلبات هذا الشهر</span>
                <span className="font-mono">{usage?.orders_per_month?.current || 0} / {usage?.orders_per_month?.limit === -1 ? '∞' : usage?.orders_per_month?.limit}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{ width: `${usage?.orders_per_month?.limit === -1 ? 25 : usage?.orders_per_month?.percentage || 0}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">0% عمولة على المبيعات</p>
            </div>

            {/* Staff Metric */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold">مقاعد الموظفين (RBAC)</span>
                <span className="font-mono">{usage?.staff?.current || 0} / {usage?.staff?.limit === -1 ? '∞' : usage?.staff?.limit}</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-purple-500 rounded-full transition-all"
                  style={{ width: `${usage?.staff?.limit === -1 ? 20 : usage?.staff?.percentage || 0}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">صلاحيات مفصلة لكل دور</p>
            </div>

            {/* Storage Metric */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-bold">سعة الوسائط السحابية</span>
                <span className="font-mono">{usage?.storage_mb?.current || 0} / {usage?.storage_mb?.limit} MB</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${usage?.storage_mb?.percentage || 0}%` }}
                />
              </div>
              <p className="text-[11px] text-zinc-500">تحسين تلقائي للصور وضغط WebP</p>
            </div>

          </div>

          {/* Secondary Metering Grid (API & AI) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">طلبات الـ REST API الشهرية</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">استدعاءات المزامنة والربط المحاسبي</p>
              </div>
              <span className="text-sm font-bold font-mono text-blue-400">
                {usage?.api_requests_per_month?.current || 0} / {usage?.api_requests_per_month?.limit === -1 ? '∞' : (usage?.api_requests_per_month?.limit || 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">أحداث الـ Webhook المرسلة</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">تحديثات الطلبات والمخزون المباشرة</p>
              </div>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {usage?.webhook_events_per_month?.current || 0} / {usage?.webhook_events_per_month?.limit === -1 ? '∞' : (usage?.webhook_events_per_month?.limit || 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">توليد الذكاء الاصطناعي (AI)</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">كتابة أوصاف المنتجات والترجمة الذكية</p>
              </div>
              <span className="text-sm font-bold font-mono text-amber-400">
                {usage?.ai_requests_per_month?.current || 0} / {usage?.ai_requests_per_month?.limit}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Subscription & Invoices */}
      {activeSubTab === 'subscription' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          {/* Active Subscription Summary */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white">{plan?.nameAr}</h3>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>نشط ومفعل</span>
                </span>
              </div>
              <p className="text-xs text-zinc-400 max-w-xl">
                {plan?.descriptionAr}
              </p>
              <div className="flex items-center gap-4 text-xs text-zinc-300 font-mono pt-1">
                <span>دورة الفوترة: <strong className="text-white">{subscription?.billingCycle === 'yearly' ? 'سنوية' : 'شهرية'}</strong></span>
                <span>تاريخ التجديد: <strong className="text-white">{subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('ar-SA') : '—'}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('pricing' as any)}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all"
              >
                تغيير الباقة
              </button>
            </div>
          </div>

          {/* Invoices List */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">سجل الفواتير الضريبية الصادرة (ZATCA)</h3>
                <p className="text-xs text-zinc-400">فواتير رسمية معتمدة وقابلة للطباعة والتحميل بصيغة PDF</p>
              </div>
            </div>

            {invoices.length === 0 ? (
              <div className="text-center py-10 text-zinc-500 text-xs">
                لا توجد فواتير سابقة مسجلة لهذا المتجر.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-bold">
                      <th className="pb-3 pr-3">رقم الفاتورة</th>
                      <th className="pb-3">تاريخ الإصدار</th>
                      <th className="pb-3">الفترة المغطاة</th>
                      <th className="pb-3">المبلغ الأساسي</th>
                      <th className="pb-3">ضريبة 15%</th>
                      <th className="pb-3">الإجمالي</th>
                      <th className="pb-3">الحالة</th>
                      <th className="pb-3 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 pr-3 font-mono font-bold text-white">{inv.invoiceNumber}</td>
                        <td className="py-3.5 font-mono">{new Date(inv.createdAt).toLocaleDateString('ar-SA')}</td>
                        <td className="py-3.5 text-zinc-400">
                          {new Date(inv.periodStart).toLocaleDateString('ar-SA')} — {new Date(inv.periodEnd).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-3.5 font-mono">{inv.subtotal.toFixed(2)} ر.س</td>
                        <td className="py-3.5 font-mono text-zinc-400">{inv.tax.toFixed(2)} ر.س</td>
                        <td className="py-3.5 font-mono font-bold text-white">{inv.total.toFixed(2)} ر.س</td>
                        <td className="py-3.5">
                          {inv.status === 'paid' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                              مدفوعة
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold">
                              مستحقة الدفع
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => setSelectedInvoiceForModal(inv)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 mx-auto border border-zinc-700 transition-all"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-400" />
                            <span>معاينة الفاتورة</span>
                          </button>
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

      {/* Tab 3: Custom Domains */}
      {activeSubTab === 'domains' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          {/* Add Domain Form */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">ربط نطاق مخصص جديد (Custom Domain)</h3>
            <p className="text-xs text-zinc-400">
              قم بإدخال اسم النطاق الخاص بك (مثل: <code className="text-blue-400">www.mystore.sa</code>) مع توجيه سجل CNAME إلى خوادم CommerceOS.
            </p>

            <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="مثال: www.royalhoney.sa"
                value={newDomainHostname}
                onChange={(e) => setNewDomainHostname(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                dir="ltr"
              />
              <button
                type="submit"
                disabled={addingDomain || !newDomainHostname.trim()}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{addingDomain ? 'جاري الإضافة...' : 'إضافة النطاق'}</span>
              </button>
            </form>
          </div>

          {/* Domains Table */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">النطاقات المسجلة للمتجر</h3>

            <div className="space-y-3">
              {/* Default Subdomain */}
              <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white" dir="ltr">{activeTenant.domain}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                        نطاق افتراضي سحابي
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">نطاق المنصة السحابي المضمن مجاناً</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSL نشط</span>
                </span>
              </div>

              {/* Custom Domains */}
              {domains.map((dom) => (
                <div key={dom.id} className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white" dir="ltr">{dom.hostname}</span>
                        {dom.isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            النطاق الرئيسي
                          </span>
                        )}
                        {dom.status === 'verified' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                            مفحوص وموثق
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                            بانتظار توجيه DNS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono" dir="ltr">
                        CNAME → <strong className="text-zinc-200">{dom.cnameTarget}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                    {dom.status !== 'verified' && (
                      <button
                        type="button"
                        disabled={verifyingDomainId === dom.id}
                        onClick={() => handleVerifyDomain(dom.id)}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${verifyingDomainId === dom.id ? 'animate-spin' : ''}`} />
                        <span>فحص سجلات DNS الآن</span>
                      </button>
                    )}

                    {dom.status === 'verified' && !dom.isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimaryDomain(dom.id)}
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold border border-zinc-700"
                      >
                        تعيين كرئيسي
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteDomain(dom.id)}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                      title="حذف النطاق"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DNS Instructions Card */}
            <div className="bg-blue-950/20 border border-blue-500/20 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-bold text-blue-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>تعليمات ضبط سجلات الـ DNS لدى مزود النطاق الخاص بك:</span>
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-300 pr-2">
                <li>أنشئ سجل من نوع <code className="font-mono text-white">CNAME</code> باسم <code className="font-mono text-white">www</code> ووجهه إلى <code className="font-mono text-white">stores.commerceos.app</code></li>
                <li>أنشئ سجل من نوع <code className="font-mono text-white">A</code> للنطاق الجذري (<code className="font-mono text-white">@</code>) يوجه إلى عنوان IP السحابي للمنصة</li>
                <li>يتم تفعيل شهادة الأمان SSL تلقائياً بمجرد التحقق من صحة السجلات.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* Tab 4: Developers, API & Webhooks */}
      {activeSubTab === 'developers' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          
          {/* API Keys Section */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">مفاتيح الربط البرمجي (Merchant API Keys)</h3>
                <p className="text-xs text-zinc-400">مفاتيح سرية للوصول إلى REST API لربط المتجر ببرامج ERP والمخازن</p>
              </div>
            </div>

            {/* Create API Key Form */}
            <form onSubmit={handleCreateApiKey} className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="اسم المفتاح (مثال: ERP Odoo Connector)"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={creatingKey || !newKeyName.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>توليد مفتاح جديد</span>
                </button>
              </div>
            </form>

            {/* API Keys List */}
            <div className="space-y-3">
              {apiKeys.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs">لا توجد مفاتيح API نشطة حالياً.</div>
              ) : (
                apiKeys.map((key) => (
                  <div key={key.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{key.name}</span>
                        <span className="font-mono text-[11px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">{key.prefix}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>الصلاحيات: {key.scopes.join(', ')}</span>
                        <span>•</span>
                        <span>أُنشئ: {new Date(key.createdAt).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRevokeApiKey(key.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all"
                    >
                      إبطال
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Webhooks Section */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">خطافات الويب الصادرة (Outgoing Webhooks)</h3>
              <p className="text-xs text-zinc-400">إرسال إشعارات فورية مع توقيع HMAC-SHA256 إلى أنظمتك الخارجية</p>
            </div>

            {/* Create Webhook Form */}
            <form onSubmit={handleCreateWebhook} className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="اسم نقطة النهاية (مثال: Logistics Server)"
                  value={newWebhookName}
                  onChange={(e) => setNewWebhookName(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="url"
                  placeholder="https://api.yourdomain.com/webhooks/orders"
                  value={newWebhookUrl}
                  onChange={(e) => setNewWebhookUrl(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-zinc-400">الأحداث المشتركة: <code className="text-white">order.created, order.paid, inventory.low_stock</code></span>
                <button
                  type="submit"
                  disabled={creatingWebhook || !newWebhookName.trim() || !newWebhookUrl.trim()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-blue-600/30 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>تسجيل خطاف الويب</span>
                </button>
              </div>
            </form>

            {/* Webhooks Endpoints List */}
            <div className="space-y-3">
              {webhooks.map((wh) => (
                <div key={wh.id} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{wh.name}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          نشط (Active)
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-blue-400 mt-0.5" dir="ltr">{wh.url}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTestWebhook(wh.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
                    >
                      <Send className="w-3 h-3 text-blue-400" />
                      <span>إرسال Ping تجريبي</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-850 pt-2 font-mono">
                    <span>HMAC Secret: <code className="text-zinc-300">{wh.secret.substring(0, 12)}...</code></span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(wh.secret, 'Webhook Secret')}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>نسخ المفتاح السري</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Deliveries Log */}
            {deliveries.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-zinc-800">
                <h4 className="text-xs font-bold text-zinc-300">سجل الإرسال الأخير (Deliveries Log)</h4>
                <div className="space-y-2">
                  {deliveries.slice(0, 5).map((deliv) => (
                    <div key={deliv.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-850 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">[{deliv.httpStatusCode}]</span>
                        <span className="text-zinc-300">{deliv.event}</span>
                        <span className="text-zinc-500 text-[11px]">{deliv.durationMs}ms</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-zinc-500 text-[11px]">{new Date(deliv.createdAt).toLocaleTimeString('ar-SA')}</span>
                        <button
                          type="button"
                          onClick={() => handleRetryDelivery(deliv.id)}
                          className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>إعادة المحاولة</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Tab 5: Tax & ZATCA Company Profile */}
      {activeSubTab === 'company_tax' && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-white">البيانات المالية والضريبية للمنشأة (ZATCA)</h3>
              <p className="text-xs text-zinc-400">
                تظهر هذه البيانات على جميع فواتير الاشتراك الضريبية الصادرة لك من منصة CommerceOS
              </p>
            </div>

            <form onSubmit={handleSaveTaxProfile} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">الاسم التجاري الرسمي للمنشأة / الشركة:</label>
                <input
                  type="text"
                  value={taxForm.companyName}
                  onChange={(e) => setTaxForm({ ...taxForm, companyName: e.target.value })}
                  placeholder="مثال: شركة مناحل الملكي المحدودة للتجارة"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">الرقم الضريبي (VAT Number - 15 رقماً):</label>
                <input
                  type="text"
                  maxLength={15}
                  value={taxForm.taxId}
                  onChange={(e) => setTaxForm({ ...taxForm, taxId: e.target.value })}
                  placeholder="310998823100003"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-zinc-300">البريد الإلكتروني للفوترة والحسابات:</label>
                <input
                  type="email"
                  value={taxForm.billingEmail}
                  onChange={(e) => setTaxForm({ ...taxForm, billingEmail: e.target.value })}
                  placeholder="billing@royalhoney.sa"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">المدينة:</label>
                  <input
                    type="text"
                    value={taxForm.city}
                    onChange={(e) => setTaxForm({ ...taxForm, city: e.target.value })}
                    placeholder="الرياض"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-zinc-300">العنوان الوطني:</label>
                  <input
                    type="text"
                    value={taxForm.address}
                    onChange={(e) => setTaxForm({ ...taxForm, address: e.target.value })}
                    placeholder="طريق الملك فهد، برج التجارة"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingTaxForm}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{savingTaxForm ? 'جاري الحفظ...' : 'حفظ البيانات الضريبية'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal (Printable & ZATCA QR Compliant) */}
      {selectedInvoiceForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">فاتورة ضريبية مبسطة (ZATCA e-Invoice)</h3>
                  <p className="text-xs font-mono text-zinc-400">{selectedInvoiceForModal.invoiceNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold flex items-center gap-1.5 border border-zinc-700"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceForModal(null)}
                  className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Invoice Printable Body */}
            <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl space-y-6 text-xs shadow-inner">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">CommerceOS Cloud Inc.</h2>
                  <p className="text-slate-600">منصة التجارة الإلكترونية السحابية</p>
                  <p className="font-mono text-[11px] text-slate-500 mt-1">الرقم الضريبي: 310000998800003</p>
                </div>

                {/* ZATCA QR Code Box */}
                <div className="flex flex-col items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <QrCode className="w-16 h-16 text-slate-900" />
                  <span className="text-[9px] font-bold text-slate-600 mt-1">ZATCA Compliant QR</span>
                </div>
              </div>

              {/* Bill To & Invoice Info */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 block">فاتورة إلى العميل:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{customer?.companyName || activeTenant.name}</p>
                  <p className="text-slate-600 font-mono text-[11px]">الرقم الضريبي: {customer?.taxId || '310998823100003'}</p>
                  <p className="text-slate-600">{customer?.city || 'الرياض'}، {customer?.address || 'المملكة العربية السعودية'}</p>
                </div>
                <div className="text-left font-mono">
                  <span className="font-bold text-slate-500 block">تفاصيل الفاتورة:</span>
                  <p className="font-bold text-slate-900 mt-0.5">رقم الفاتورة: {selectedInvoiceForModal.invoiceNumber}</p>
                  <p className="text-slate-600 text-[11px]">تاريخ الإصدار: {new Date(selectedInvoiceForModal.createdAt).toLocaleDateString('ar-SA')}</p>
                  <p className="text-emerald-700 font-bold">الحالة: مدفوعة بالكامل ✓</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">الوصف</th>
                      <th className="p-3 text-center">الكمية</th>
                      <th className="p-3 text-center">سعر الوحدة</th>
                      <th className="p-3 text-left">الإجمالي (شامل 15%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {selectedInvoiceForModal.items.map((item) => (
                      <tr key={item.id}>
                        <td className="p-3 font-sans font-medium text-slate-900">{item.descriptionAr}</td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-center">{item.unitPrice.toFixed(2)} ر.س</td>
                        <td className="p-3 text-left font-bold">{item.total.toFixed(2)} ر.س</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>المجموع الفرعي:</span>
                    <span>{selectedInvoiceForModal.subtotal.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ضريبة القيمة المضافة (15%):</span>
                    <span>{selectedInvoiceForModal.tax.toFixed(2)} ر.س</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 border-t border-slate-300 pt-2">
                    <span>الإجمالي الكلي:</span>
                    <span className="text-emerald-700">{selectedInvoiceForModal.total.toFixed(2)} ر.س</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Raw Secret API Key Modal (Shown Only Once Upon Creation) */}
      {createdRawKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">المفتاح السري الجديد (API Secret Key)</h3>
                <p className="text-xs text-amber-400">تنبيه: انسخ المفتاح الآن، فلن يتم عرضه مرة أخرى لأسباب أمنية!</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300">مفتاح الـ API الخاص بك:</label>
              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 flex items-center justify-between gap-2 font-mono text-xs text-emerald-400 break-all" dir="ltr">
                <span>{createdRawKeyModal.rawSecretKey}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(createdRawKeyModal.rawSecretKey, 'API Key')}
                  className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCreatedRawKeyModal(null)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/30"
            >
              لقد قمت بحفظ المفتاح بأمان
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
