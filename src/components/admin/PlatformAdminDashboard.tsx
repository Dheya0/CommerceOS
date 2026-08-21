import React, { useState } from 'react';
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
  Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useCommerce } from '../../context/CommerceContext';

export const PlatformAdminDashboard: React.FC = () => {
  const { 
    tenants, 
    setActiveTenantId, 
    setCurrentView, 
    showToast 
  } = useCommerce();

  const [searchTenant, setSearchTenant] = useState('');

  // Platform Metrics
  const totalTenantsCount = tenants.length;
  const activeTenantsCount = tenants.filter(t => t.status === 'active').length;
  const mrr = tenants.reduce((sum, t) => {
    if (t.plan === 'enterprise') return sum + 1499;
    if (t.plan === 'growth') return sum + 499;
    return sum + 199;
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
                Platform Super Admin (White-Label Cockpit)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              لوحة الإدارة المركزية لمنصة CommerceOS
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              إدارة كافة المستأجرين (Tenants)، الاشتراكات الشهرية، البنية السحابية والصلاحيات.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('builder_wizard')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>توليد متجر جديد (Store Wizard)</span>
          </button>
        </div>

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
              {activeTenantsCount} متجر نشط • جاهز للعمل
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
              +24% نمو الاشتراكات
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>حالة البنية التحتية</span>
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Server className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">99.99%</div>
            <div className="text-[11px] text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> استقرار تام بكافة الخوادم
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
              <span>المعالجات اللحظية</span>
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">1.2k /sec</div>
            <div className="text-[11px] text-slate-400 mt-1">
              زمن الاستجابة: 24ms
            </div>
          </div>

        </div>

        {/* Growth Analytics Chart */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">نمو المتاجر المشتركة في المنصة (Store Onboarding Growth)</h3>
            <span className="text-xs text-slate-400 font-mono">2026</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="stores" fill="#f59e0b" radius={[6, 6, 0, 0]} name="عدد المتاجر" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All Tenants Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-base font-bold text-white">قائمة المتاجر المسجلة (Active Tenants)</h3>
              <p className="text-xs text-slate-400">تحكم كامل في كل متجر وتعديل الخطة أو الدخول المباشر.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              <input
                type="text"
                value={searchTenant}
                onChange={e => setSearchTenant(e.target.value)}
                placeholder="ابحث بالاسم أو الدومين..."
                className="w-full pr-9 pl-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3">المتجر والعلامة</th>
                  <th className="pb-3">نوع النشاط</th>
                  <th className="pb-3">الباقة الحالية</th>
                  <th className="pb-3">النطاق (Domain)</th>
                  <th className="pb-3">الحالة</th>
                  <th className="pb-3 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenants
                  .filter(t => {
                    const query = (searchTenant || '').toLowerCase().trim();
                    if (!query) return true;
                    const nameMatch = (t.name || '').toLowerCase().includes(query) || (t.nameEn || '').toLowerCase().includes(query);
                    const slugMatch = (t.slug || '').toLowerCase().includes(query);
                    return nameMatch || slugMatch;
                  })
                  .map(tenant => (
                    <tr key={tenant.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <img 
                          src={tenant.logo} 
                          alt="" 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-700" 
                        />
                        <div>
                          <div className="font-bold text-white text-sm">{tenant.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {tenant.id}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className="capitalize text-slate-300 font-medium">{tenant.businessType}</span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono ${
                          tenant.plan === 'enterprise' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          tenant.plan === 'growth' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {tenant.plan}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-slate-400">
                        {tenant.customDomain || `${tenant.slug}.commerceos.sa`}
                      </td>
                      <td className="py-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {tenant.status === 'active' ? 'نشط' : tenant.status}
                        </span>
                      </td>
                      <td className="py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleImpersonateTenant(tenant.id)}
                            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow transition-all"
                          >
                            <span>إدارة المتجر</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
};
