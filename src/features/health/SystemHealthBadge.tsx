import React from 'react';
import { Activity, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useHealth } from '../../hooks/useHealth.ts';

export const SystemHealthBadge: React.FC = () => {
  const { health, loading, refetch } = useHealth(20000);

  if (loading && !health) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700 text-[11px] text-slate-400">
        <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
        <span>فحص النظام...</span>
      </div>
    );
  }

  const isHealthy = health?.status === 'healthy';
  const dbLatency = health?.checks?.database?.latencyMs ?? 0;

  return (
    <div 
      onClick={() => refetch()}
      title={`المنصة: ${health?.platform} | فحص الاتصال: ${dbLatency}ms | الذاكرة: ${health?.checks?.memory?.heapUsedMb}MB`}
      className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-[11px] cursor-pointer transition-all shadow-sm group"
    >
      <div className="flex items-center gap-1">
        <span className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        <span className="font-mono text-slate-300 font-bold">API v1</span>
      </div>
      <span className="text-slate-600">•</span>
      <div className="flex items-center gap-1 text-slate-400 group-hover:text-slate-200">
        <Database className="w-3 h-3 text-indigo-400" />
        <span className="font-mono text-[10px]">{dbLatency}ms</span>
      </div>
    </div>
  );
};
