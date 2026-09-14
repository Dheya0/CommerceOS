import React, { useMemo } from 'react';
import { Store, Check, Plus, Globe, Shield, X, ArrowRight } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkspaceSwitcherModal: React.FC<WorkspaceSwitcherModalProps> = ({ isOpen, onClose }) => {
  const { tenants, activeTenantId, setActiveTenantId, activeTenant, showToast, language, setCurrentView } = useCommerce();
  const isAr = language === 'ar';

  // Ensure unique list of tenants by ID to guarantee unique React keys
  const uniqueTenants = useMemo(() => {
    const seen = new Set<string>();
    const list: typeof tenants = [];
    (tenants || []).forEach((tenant, idx) => {
      const id = tenant?.id || `tenant-${idx}`;
      if (!seen.has(id)) {
        seen.add(id);
        list.push({ ...tenant, id });
      }
    });
    return list;
  }, [tenants]);

  if (!isOpen) return null;

  const handleSwitch = (tenantId: string, storeName: string) => {
    setActiveTenantId(tenantId);
    showToast(isAr ? `تم الانتقال إلى متجر: ${storeName}` : `Switched to workspace: ${storeName}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0B1626] border border-white/15 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Store className="w-5 h-5 text-[#D4AF37]" />
              <span>{isAr ? 'متاجر العمل (Workspaces)' : 'Your Workspaces'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr ? 'التبديل الفوري بين المتاجر والمشاريع الخاصة بك' : 'Instant switching between your managed stores'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tenant Stores List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {uniqueTenants.map((tenant, index) => {
            const isActive = tenant.id === activeTenantId;
            const storeTitle = tenant.name || (tenant as any).storeName || (isAr ? 'متجر' : 'Store');
            const storeSlug = tenant.slug || (tenant as any).storeSlug || 'store';
            const status = (tenant as any).status || 'active';

            return (
              <div
                key={`workspace-tenant-${tenant.id}-${index}`}
                onClick={() => !isActive && handleSwitch(tenant.id, storeTitle)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  isActive 
                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-lg' 
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold text-sm ${
                    isActive ? 'bg-[#D4AF37] text-[#07111F]' : 'bg-white/10 text-white'
                  }`}>
                    {storeTitle.charAt(0) || 'S'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate">{storeTitle}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        status === 'live' || status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                      <Store className="w-3 h-3 text-[#D4AF37]" />
                      <span className="truncate">workspace/{storeSlug}</span>
                    </div>
                  </div>
                </div>

                {isActive && (
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#07111F] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              setCurrentView('builder_wizard');
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-all w-full justify-center active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>{isAr ? 'إنشاء متجر جديد (معالج البناء)' : 'Create New Store (Builder Wizard)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
