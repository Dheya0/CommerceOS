import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  DollarSign, 
  Users, 
  Plus, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertOctagon,
  ArrowUpRight,
  Sparkles,
  Layers,
  Key,
  ShieldAlert,
  Sliders,
  Save,
  Lock,
  Unlock,
  AlertTriangle,
  FileCode,
  HardDrive,
  Cpu,
  RefreshCw,
  Edit3,
  X,
  Radio,
  Check,
  CreditCard
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { SecurityRedTeamDashboard } from './SecurityRedTeamDashboard';
import { useCommerce } from '../../context/CommerceContext';
import { LicenseTier, TenantQuotas, TenantStore } from '../../types';
import { generateLicenseKey } from '../../utils/licensingEngine';
import { api } from '../../api/client';

export const PlatformAdminDashboard: React.FC = () => {
  const { 
    tenants, 
    setActiveTenantId, 
    setCurrentView, 
    showToast,
    platformConfig,
    updatePlatformConfig,
    updateTenantStatus,
    updateTenantQuotas,
    applyLicenseToTenant,
    toggleWhiteLabel,
    refreshFromBackend
  } = useCommerce();

  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'saas_billing' | 'licensing_pricing' | 'tamper_telemetry' | 'security_redteam'>('overview');
  const [searchTenant, setSearchTenant] = useState('');
  
  // SaaS Billing Admin State
  const [saasAnalytics, setSaasAnalytics] = useState<any>(null);
  const [billingAuditLogs, setBillingAuditLogs] = useState<any[]>([]);
  const [selectedTenantForOverride, setSelectedTenantForOverride] = useState<TenantStore | null>(null);
  const [overrideForm, setOverrideForm] = useState({
    overrideType: 'plan',
    planId: 'business',
    status: 'active',
    reason: ''
  });
  const [submittingOverride, setSubmittingOverride] = useState(false);
  
  // Tenant Edit & Quotas Modal State
  const [selectedTenantForEdit, setSelectedTenantForEdit] = useState<TenantStore | null>(null);
  const [quotaForm, setQuotaForm] = useState<TenantQuotas>({
    maxProducts: 500,
    maxStaff: 5,
    maxMonthlyBuilds: 30,
    usedMonthlyBuilds: 4,
    allowCustomDomain: true,
    allowDockerSelfHost: true,
    allowNativeIosAndroid: true,
    storageQuotaMb: 1000,
    usedStorageMb: 50
  });

  // Licensing Pricing Form State
  const [pricingForm, setPricingForm] = useState({
    whiteLabelSingleStorePrice: platformConfig.whiteLabelSingleStorePrice || 189,
    agencySovereignMonthlyPrice: platformConfig.agencySovereignMonthlyPrice || 749,
    agencySovereignLifetimePrice: platformConfig.agencySovereignLifetimePrice || 2490,
    watermarkEnforcement: platformConfig.watermarkEnforcement || 'strict_tamper_lock',
    obfuscationLevel: platformConfig.obfuscationLevel || 'high_ast_xor',
    superAdminEmail: platformConfig.superAdminEmail || 'Dia840990@gmail.com'
  });

  // Platform Metrics
  const totalTenantsCount = tenants.length;
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  const suspendedTenantsCount = tenants.filter(t => t.status === 'suspended').length;
  const whiteLabelTenantsCount = tenants.filter(t => t.licensing?.isWhiteLabel).length;
  
  const mrr = tenants.reduce((sum, t) => {
    if (t.plan === 'enterprise' || t.plan === 'pro') return sum + 749;
    if (t.plan === 'growth' || t.plan === 'business') return sum + 349;
    return sum + 99;
  }, 0);

  const tenantGrowthData = [
    { month: 'يناير', stores: 12, mrr: 4200 },
    { month: 'فبراير', stores: 24, mrr: 8900 },
    { month: 'مارس', stores: 38, mrr: 14500 },
    { month: 'أبريل', stores: 55, mrr: 21200 },
    { month: 'مايو', stores: 82, mrr: 33400 },
    { month: 'يونيو', stores: 110, mrr: 45000 }
  ];

  const handleImpersonateTenant = (tenantId: string) => {
    setActiveTenantId(tenantId);
    setCurrentView('merchant_dashboard');
    showToast(`تم التبديل بنجاح إلى لوحة تحكم المتجر 🚀`, 'success');
  };

  const handleOpenQuotaModal = (tenant: TenantStore) => {
    setSelectedTenantForEdit(tenant);
    setQuotaForm(tenant.quotas || {
      maxProducts: 500,
      maxStaff: 5,
      maxMonthlyBuilds: 30,
      usedMonthlyBuilds: 0,
      allowCustomDomain: true,
      allowDockerSelfHost: true,
      allowNativeIosAndroid: true,
      storageQuotaMb: 1000,
      usedStorageMb: 40
    });
  };

  const handleSaveQuotas = () => {
    if (!selectedTenantForEdit) return;
    updateTenantQuotas(selectedTenantForEdit.id, quotaForm);
    setSelectedTenantForEdit(null);
  };

  const handleGenerateAndApplyLicense = (tenantId: string, tier: LicenseTier) => {
    const { key } = generateLicenseKey(tenantId, tier);
    applyLicenseToTenant(tenantId, key);
    showToast(`تم إصدار وتفعيل مفتاح الترخيص: ${key}`, 'success');
  };

  const handleSavePricingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformConfig(pricingForm);
  };

  const fetchSaaSAdminData = async () => {
    try {
      const [analyticsRes, logsRes] = await Promise.all([
        api.getSaaSAdminAnalytics().catch(() => null),
        api.getSaaSAdminAuditLogs().catch(() => null)
      ]);
      if (analyticsRes?.data?.metrics) setSaasAnalytics(analyticsRes.data.metrics);
      if (logsRes?.data?.logs) setBillingAuditLogs(logsRes.data.logs);
    } catch (err) {
      console.error('Failed to load SaaS admin metrics:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'saas_billing' || activeTab === 'overview') {
      fetchSaaSAdminData();
    }
  }, [activeTab]);

  const handleOpenOverrideModal = (tenant: TenantStore) => {
    setSelectedTenantForOverride(tenant);
    setOverrideForm({
      overrideType: 'plan',
      planId: (tenant.plan as any) || 'business',
      status: tenant.status || 'active',
      reason: ''
    });
  };

  const handleSaveOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenantForOverride) return;
    if (!overrideForm.reason.trim()) {
      showToast('يجب كتابة سبب صريح للتعديل الإداري لأغراض التدقيق والامتثال', 'error');
      return;
    }

    try {
      setSubmittingOverride(true);
      const val = overrideForm.overrideType === 'plan' ? overrideForm.planId : overrideForm.status;
      const res = await api.adminOverrideSaaS(selectedTenantForOverride.id, overrideForm.overrideType, val, overrideForm.reason);
      showToast(res.message || 'تم التعديل الإداري بنجاح', 'success');
      setSelectedTenantForOverride(null);
      await refreshFromBackend();
      fetchSaaSAdminData();
    } catch (err: any) {
      showToast(err.message || 'فشل التعديل الإداري', 'error');
    } finally {
      setSubmittingOverride(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-8 text-right">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                Platform Super Admin Control Plane
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono">
                v2.6 Enterprise Multi-Tenant
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              غرفة القيادة المركزية ومصفوفة التراخيص
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              إدارة شاملة للمستأجرين، تجميد/تفعيل الحسابات، تسعير رخص White-Label ومراقبة محاولات فك التشفير لحظياً.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('builder_wizard')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>توليد متجر جديد (Store Wizard)</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>نظرة عامة والنمو (KPIs)</span>
          </button>

          <button
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tenants'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>إدارة المستأجرين والحصص ({tenants.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saas_billing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'saas_billing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>الفوترة والاشتراكات السحابية (SaaS)</span>
          </button>

          <button
            onClick={() => setActiveTab('licensing_pricing')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'licensing_pricing'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>تسعير التراخيص وسياسة الشارة</span>
          </button>

          <button
            onClick={() => setActiveTab('tamper_telemetry')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tamper_telemetry'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>سجل فحص النزاهة والتلاعب ({platformConfig.tamperLog?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('security_redteam')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'security_redteam'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>الأمن السيبراني وفريق الاختراق (Phase 5 Red Team)</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Platform KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>إجمالي المتاجر (Tenants)</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{totalTenantsCount}</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  {activeTenantsCount} متجر نشط • {whiteLabelTenantsCount} مرخص White-Label
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>الدخل الشهري المتكرر (MRR)</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">{mrr.toLocaleString()} ر.س</div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  +28.4% نمو الاشتراكات الشهرية
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>محرك البناء والأمان</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {platformConfig.watermarkEnforcement === 'strict_tamper_lock' ? 'Strict Active' : 'Monitored'}
                </div>
                <div className="text-[11px] text-blue-400 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> حماية مشفرة على حزم التصدير
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>استقرار الخوادم اللحظية</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Server className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">99.98%</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  متوسط زمن استجابة API: 18ms
                </div>
              </div>

            </div>

            {/* Growth Analytics Chart */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">مؤشر نمو المستأجرين والإيرادات (Onboarding & MRR Growth)</h3>
                  <p className="text-xs text-slate-400 mt-0.5">معدل الانضمام الشهري التراكمي للمتاجر عبر محرك CommerceOS</p>
                </div>
                <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                  Fiscal 2026
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tenantGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Bar dataKey="stores" fill="#f59e0b" radius={[6, 6, 0, 0]} name="عدد المتاجر الجديدة" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TENANTS MANAGEMENT & QUOTAS */}
        {activeTab === 'tenants' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">إدارة الحسابات، تجميد النشاط وحدود المشاريع</h3>
                <p className="text-xs text-slate-400">تعديل حصص المنتجات، صلاحيات التصدير، ومنح رخص الـ White-Label بنقرة زر واحدة.</p>
              </div>

              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  value={searchTenant}
                  onChange={e => setSearchTenant(e.target.value)}
                  placeholder="ابحث بالاسم أو المعرف أو الدومين..."
                  className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">المتجر والعلامة</th>
                    <th className="pb-3">حالة الحساب</th>
                    <th className="pb-3">ترخيص الشارة (Licensing)</th>
                    <th className="pb-3">حد المنتجات والموظفين</th>
                    <th className="pb-3">حصص البناء الشهري</th>
                    <th className="pb-3 text-left">إجراءات الإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tenants
                    .filter(t => {
                      const query = (searchTenant || '').toLowerCase().trim();
                      if (!query) return true;
                      const nameMatch = (t.name || '').toLowerCase().includes(query) || (t.nameEn || '').toLowerCase().includes(query);
                      const slugMatch = (t.slug || '').toLowerCase().includes(query);
                      const idMatch = (t.id || '').toLowerCase().includes(query);
                      return nameMatch || slugMatch || idMatch;
                    })
                    .map(tenant => {
                      const isWhiteLabel = tenant.licensing?.isWhiteLabel;
                      const isSuspended = tenant.status === 'suspended';

                      return (
                        <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={tenant.logo} 
                                alt="" 
                                className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0" 
                              />
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span>{tenant.name}</span>
                                  {isSuspended && (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-bold">
                                      مجمد
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">{tenant.slug} • ID: {tenant.id}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-4">
                            <div className="flex items-center gap-2">
                              {tenant.status === 'active' ? (
                                <button
                                  onClick={() => updateTenantStatus(tenant.id, 'suspended')}
                                  title="انقر لتجميد الحساب فوراً"
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30 transition-colors flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>نشط (تجميد؟)</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => updateTenantStatus(tenant.id, 'active')}
                                  title="انقر لتفعيل الحساب"
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors flex items-center gap-1 font-bold text-[11px]"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>حساب مجمد (تنشيط)</span>
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="py-4">
                            {isWhiteLabel ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                                  <Sparkles className="w-3 h-3" />
                                  <span>White-Label Certified</span>
                                </span>
                                {tenant.licensing?.licenseKey && (
                                  <div className="text-[9px] font-mono text-slate-400 truncate max-w-[140px]">
                                    {tenant.licensing.licenseKey}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                                  نسخة مجانية مع الشارة
                                </span>
                                <button
                                  onClick={() => handleGenerateAndApplyLicense(tenant.id, 'white_label_single')}
                                  className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/20 text-[10px] font-bold transition-all"
                                >
                                  منح ترخيص
                                </button>
                              </div>
                            )}
                          </td>

                          <td className="py-4 font-mono text-slate-300">
                            <div>منتجات: <span className="font-bold text-white">{tenant.quotas?.maxProducts === -1 ? 'غير محدود (∞)' : (tenant.quotas?.maxProducts || 500)}</span></div>
                            <div>فريق العمل: <span className="font-bold text-white">{tenant.quotas?.maxStaff || 5}</span></div>
                          </td>

                          <td className="py-4 font-mono text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <span>{tenant.quotas?.usedMonthlyBuilds || 0} / {tenant.quotas?.maxMonthlyBuilds || 30}</span>
                              <span className="text-[10px] text-slate-500">حزم</span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Docker & Mobile: {tenant.quotas?.allowDockerSelfHost ? 'مفعل' : 'معطل'}
                            </div>
                          </td>

                          <td className="py-4 text-left">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenQuotaModal(tenant)}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 border border-slate-700 transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                                <span>تعديل الحصص</span>
                              </button>

                              <button
                                onClick={() => handleImpersonateTenant(tenant.id)}
                                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow transition-all"
                              >
                                <span>دخول المتجر</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: SAAS BUSINESS & BILLING CORE */}
        {activeTab === 'saas_billing' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* SaaS Commercial KPIs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>الإيرادات الشهرية المتكررة (MRR)</span>
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {saasAnalytics?.mrr?.toLocaleString() || '45,800'} <span className="text-xs font-normal text-slate-400">SAR</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-bold mt-1">
                  ARR التقديري: {saasAnalytics?.arr?.toLocaleString() || '549,600'} SAR
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>متوسط العائد لكل متجر (ARPU)</span>
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {saasAnalytics?.arpu || '416'} <span className="text-xs font-normal text-slate-400">SAR / متجر</span>
                </div>
                <div className="text-[11px] text-blue-400 font-bold mt-1">
                  القيمة الدائمة (LTV): ~12,400 SAR
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>معدل التحويل من التجربة (Conversion)</span>
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  34.5%
                </div>
                <div className="text-[11px] text-purple-400 font-bold mt-1">
                  معدل الإلغاء (Churn): 2.1% شهرياً
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                  <span>حالات الاشتراكات النشطة</span>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {tenants.length} <span className="text-xs font-normal text-slate-400">اشتراك</span>
                </div>
                <div className="text-[11px] text-amber-400 font-bold mt-1">
                  0 فواتير متعثرة (Past Due)
                </div>
              </div>
            </div>

            {/* Subscriptions Table with Manual Override Actions */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>سجل اشتراكات المتاجر والتحكم الإداري (SaaS Subscriptions)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    ترقية فورية، تجميد أو تعديل باقة أي متجر يدوياً مع تسجيل إلزامي لسبب التدقيق في Audit Trail.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold">
                      <th className="pb-3 pr-3">المتجر / المستأجر</th>
                      <th className="pb-3">الخطة الحالية</th>
                      <th className="pb-3">حالة الاشتراك</th>
                      <th className="pb-3">دورة الفوترة</th>
                      <th className="pb-3">المحددات (Quotas)</th>
                      <th className="pb-3 text-left">إجراءات الإدارة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {tenants.map((tenant) => (
                      <tr key={tenant.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 pr-3">
                          <div className="font-bold text-white text-sm">{tenant.name}</div>
                          <div className="font-mono text-slate-500 text-[11px]" dir="ltr">{tenant.domain}</div>
                        </td>

                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            tenant.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            tenant.plan === 'business' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                            tenant.plan === 'growth' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {tenant.plan?.toUpperCase() || 'STARTER'}
                          </span>
                        </td>

                        <td className="py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            tenant.status === 'suspended' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {tenant.status === 'active' ? 'نشط (Active)' : tenant.status === 'suspended' ? 'موقوف (Suspended)' : 'تجريبي (Trial)'}
                          </span>
                        </td>

                        <td className="py-4 font-mono text-slate-400">
                          شهري / تجديد تلقائي
                        </td>

                        <td className="py-4 font-mono text-[11px] text-slate-400">
                          <div>منتجات: <strong className="text-white">{tenant.quotas?.maxProducts || 50}</strong></div>
                          <div>موظفين: <strong className="text-white">{tenant.quotas?.maxStaff || 1}</strong></div>
                        </td>

                        <td className="py-4 text-left">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenOverrideModal(tenant)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/20 font-bold text-xs transition-all flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>تعديل إداري (Override)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleImpersonateTenant(tenant.id)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all"
                            >
                              دخول
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SaaS Audit Trail Log */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>سجل التدقيق والعمليات الإدارية (SaaS Audit Trail)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    تسجيل غير قابل للحذف لجميع عمليات الترقية، الدفع، وتدخلات المسؤولين
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {billingAuditLogs.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs font-mono">
                    لا توجد أحداث تدقيق حديثة.
                  </div>
                ) : (
                  billingAuditLogs.map((log, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-blue-400 font-bold">[{log.action}]</span>
                        <span className="text-slate-300 font-mono">متجر: {log.tenantId}</span>
                        {log.reason && (
                          <span className="text-amber-300/90 text-[11px]">السبب: "{log.reason}"</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                        <span>بواسطة: {log.actor}</span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString('ar-SA')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: LICENSING PRICING & DEFENSE MATRIX */}
        {activeTab === 'licensing_pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Pricing Controls Form */}
            <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>تعديل تسعير التراخيص وقواعد الملكية الفكرية</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  تعديل أسعار الرخص الفورية ورسوم إزالة الشارة دون الحاجة لإعادة نشر الكود.
                </p>
              </div>

              <form onSubmit={handleSavePricingConfig} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      سعر ترخيص White-Label للمتجر الفردي (SAR):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pricingForm.whiteLabelSingleStorePrice}
                        onChange={e => setPricingForm({ ...pricingForm, whiteLabelSingleStorePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">ر.س / لمرة واحدة</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      اشتراك باقة الوكالات السيادية (Agency Sovereign MRR):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pricingForm.agencySovereignMonthlyPrice}
                        onChange={e => setPricingForm({ ...pricingForm, agencySovereignMonthlyPrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">ر.س / شهرياً</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      رخصة الوكالات مدى الحياة (Lifetime Sovereign):
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={pricingForm.agencySovereignLifetimePrice}
                        onChange={e => setPricingForm({ ...pricingForm, agencySovereignLifetimePrice: Number(e.target.value) })}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-slate-500">ر.س / مدى الحياة</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      بريد المشرف الأعلى لإشعارات التلاعب:
                    </label>
                    <input
                      type="email"
                      value={pricingForm.superAdminEmail}
                      onChange={e => setPricingForm({ ...pricingForm, superAdminEmail: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Enforcement mode */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-bold text-slate-300">
                    مستوى فرض سلامة الشارة ونظام الدفاع ضد الهندسة العكسية:
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div 
                      onClick={() => setPricingForm({ ...pricingForm, watermarkEnforcement: 'strict_tamper_lock' })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        pricingForm.watermarkEnforcement === 'strict_tamper_lock'
                          ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5 mb-1 text-amber-400">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Strict Lock (قفل إتمام الطلب عند التلاعب)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        إذا أزال المستخدم المجاني كود الشارة، يُعلّق زر الدفع فوراً ويُعرض تنبيه الترقية.
                      </p>
                    </div>

                    <div 
                      onClick={() => setPricingForm({ ...pricingForm, watermarkEnforcement: 'soft_warning' })}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        pricingForm.watermarkEnforcement === 'soft_warning'
                          ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5 mb-1 text-slate-300">
                        <Radio className="w-3.5 h-3.5" />
                        <span>Soft Warning (تسجيل الحدث فقط دون قفل)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        يتم تسجيل محاولات إزالة الشارة في سجل الأمان المركزي دون تعطيل عملية الشراء.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التسعير وسياسات التراخيص</span>
                  </button>
                </div>
              </form>
            </div>

            {/* License Key Test Generator Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Key className="w-4 h-4" />
                <span>مُولّد التراخيص الفورية (Instant License Forge)</span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                توليد مفاتيح مشفرة وموقعة رقمياً بالملح السري لنظام CommerceOS للتسليم المباشر للمشتركين خارج المتجر.
              </p>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => {
                    const key = generateLicenseKey('demo-manual-tenant', 'white_label_single').key;
                    navigator.clipboard.writeText(key);
                    showToast(`تم نسخ مفتاح White-Label للمتجر: ${key}`, 'success');
                  }}
                  className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-amber-300 flex items-center justify-between transition-colors"
                >
                  <span>توليد مفتاح متجر منفرد (WL-Single)</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <button
                  onClick={() => {
                    const key = generateLicenseKey('agency-master-license', 'agency_sovereign').key;
                    navigator.clipboard.writeText(key);
                    showToast(`تم نسخ مفتاح وكالة سيادي: ${key}`, 'success');
                  }}
                  className="w-full py-2.5 px-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-purple-300 flex items-center justify-between transition-colors"
                >
                  <span>توليد مفتاح وكالة غير محدود (AGENCY)</span>
                  <Key className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
                <div className="font-bold text-slate-300">طريقة فحص الشارة:</div>
                <div>1. حقن نص برمجي Base64 + XOR مشفر في حزمة PWA و NodeJS.</div>
                <div>2. مراقب MutationObserver حي يعيد الحقن عند الحذف.</div>
                <div>3. فحص HMAC فوري قبل اعتماد عمليات الدفع.</div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: TAMPER TELEMETRY */}
        {activeTab === 'tamper_telemetry' && (
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>سجل الدفاع ضد الهندسة العكسية والتلاعب بالشارة (Tamper Telemetry Log)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  رصد ومتابعة محاولات إزالة كود الشارة أو حجبها من قبل مستخدمي النسخ المجانية.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-mono font-bold">
                {platformConfig.tamperLog?.length || 0} أحداث مسجلة
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">التوقيت والتاريخ</th>
                    <th className="pb-3">المتجر المستهدف</th>
                    <th className="pb-3">نوع التلاعب المكتشف</th>
                    <th className="pb-3">الإجراء المتخذ</th>
                    <th className="pb-3">عنوان IP والمتصفح</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {(platformConfig.tamperLog || []).map(log => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-3 text-slate-400 text-[11px]">
                        {new Date(log.detectedAt).toLocaleString('ar-SA')}
                      </td>
                      <td className="py-3 font-sans font-bold text-white">
                        {log.tenantName} ({log.tenantId})
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.tamperType === 'dom_removal' ? 'bg-rose-500/20 text-rose-300' :
                          log.tamperType === 'css_hiding' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {log.tamperType}
                        </span>
                      </td>
                      <td className="py-3 font-sans">
                        <span className="text-emerald-400 font-bold">
                          {log.actionTaken === 'checkout_locked' ? '🔒 قفل عملية الدفع وعرض ترخيص' : '⚠️ تم تسجيل التنبيه'}
                        </span>
                      </td>
                      <td className="py-3 text-slate-500 text-[10px]">
                        {log.ipAddress || '127.0.0.1'} • {log.userAgent?.slice(0, 30) || 'WebKit / DevTools'}...
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY RED TEAM & COMPLIANCE */}
        {activeTab === 'security_redteam' && (
          <SecurityRedTeamDashboard />
        )}

      </div>

      {/* EDIT TENANT QUOTAS MODAL */}
      {selectedTenantForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 text-right">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <img src={selectedTenantForEdit.logo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h3 className="text-base font-black text-white">
                    تعديل حصص ومتطلبات المتجر (Tenant Quotas)
                  </h3>
                  <div className="text-xs text-slate-400">{selectedTenantForEdit.name}</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedTenantForEdit(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">الحد الأقصى للمنتجات (-1 = لا محدود):</label>
                  <input
                    type="number"
                    value={quotaForm.maxProducts}
                    onChange={e => setQuotaForm({ ...quotaForm, maxProducts: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">الحد الأقصى لحسابات الموظفين:</label>
                  <input
                    type="number"
                    value={quotaForm.maxStaff}
                    onChange={e => setQuotaForm({ ...quotaForm, maxStaff: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">حزم البناء الشهرية المسموحة:</label>
                  <input
                    type="number"
                    value={quotaForm.maxMonthlyBuilds}
                    onChange={e => setQuotaForm({ ...quotaForm, maxMonthlyBuilds: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">مساحة التخزين السحابي (MB):</label>
                  <input
                    type="number"
                    value={quotaForm.storageQuotaMb}
                    onChange={e => setQuotaForm({ ...quotaForm, storageQuotaMb: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotaForm.allowCustomDomain}
                    onChange={e => setQuotaForm({ ...quotaForm, allowCustomDomain: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span className="text-slate-300 font-medium">السماح بربط دومين مخصص (Custom Domain CNAME)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotaForm.allowDockerSelfHost}
                    onChange={e => setQuotaForm({ ...quotaForm, allowDockerSelfHost: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span className="text-slate-300 font-medium">السماح بتصدير حزم Docker & VPS Self-Hosting</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quotaForm.allowNativeIosAndroid}
                    onChange={e => setQuotaForm({ ...quotaForm, allowNativeIosAndroid: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-800"
                  />
                  <span className="text-slate-300 font-medium">السماح بتصدير تطبيقات Android & iOS الأصلية</span>
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedTenantForEdit(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveQuotas}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black"
              >
                حفظ الحصص
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SaaS Manual Override Modal with Mandatory Audit Reason */}
      {selectedTenantForOverride && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">تعديل اشتراك المتجر إدارياً (Admin Override)</h3>
                  <p className="text-xs text-slate-400">متجر: {selectedTenantForOverride.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTenantForOverride(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOverride} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">نوع التعديل الإداري:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOverrideForm({ ...overrideForm, overrideType: 'plan' })}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      overrideForm.overrideType === 'plan'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    تغيير الباقة (Plan)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOverrideForm({ ...overrideForm, overrideType: 'status' })}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      overrideForm.overrideType === 'status'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    تغيير الحالة (Status)
                  </button>
                </div>
              </div>

              {overrideForm.overrideType === 'plan' ? (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">اختر الخطة الجديدة:</label>
                  <select
                    value={overrideForm.planId}
                    onChange={(e) => setOverrideForm({ ...overrideForm, planId: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="starter">الابتدائية (Starter - 50 منتج)</option>
                    <option value="growth">النمو (Growth - 500 منتج)</option>
                    <option value="business">الأعمال (Business - 5,000 منتج)</option>
                    <option value="enterprise">السيادية (Enterprise - غير محدود)</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">اختر الحالة التشغيلية:</label>
                  <select
                    value={overrideForm.status}
                    onChange={(e) => setOverrideForm({ ...overrideForm, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="suspended">موقوف (Suspended - تجميد المتجر)</option>
                    <option value="trial">تجريبي (Trial)</option>
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-amber-300 flex items-center gap-1">
                  <span>سبب التعديل الإداري (إلزامي للتدقيق والامتثال):</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideForm.reason}
                  onChange={(e) => setOverrideForm({ ...overrideForm, reason: e.target.value })}
                  placeholder="مثال: ترقية استثنائية لعميل استراتيجي / تجميد بسبب شكوى مالية..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedTenantForOverride(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submittingOverride || !overrideForm.reason.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
                >
                  {submittingOverride ? 'جاري الحفظ...' : 'تأكيد التعديل وتسجيله'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
