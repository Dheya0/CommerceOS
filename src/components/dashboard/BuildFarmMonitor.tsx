import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Server, 
  Layers, 
  Activity, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Clock, 
  Radio, 
  AlertCircle, 
  Database,
  ArrowUpRight,
  ShieldCheck,
  Terminal,
  Play,
  Maximize2
} from 'lucide-react';
import { buildFarm } from '../../utils/buildFarmEngine';
import { BuildWorkerNode, BuildJobQueueItem, BuildFarmMetrics } from '../../types';

export const BuildFarmMonitor: React.FC = () => {
  const [workers, setWorkers] = useState<BuildWorkerNode[]>(buildFarm.getWorkers());
  const [queue, setQueue] = useState<BuildJobQueueItem[]>(buildFarm.getQueue());
  const [metrics, setMetrics] = useState<BuildFarmMetrics>(buildFarm.getFarmMetrics());
  const [activeTab, setActiveTab] = useState<'workers' | 'queue' | 'architecture'>('workers');

  useEffect(() => {
    const timer = setInterval(() => {
      setWorkers(buildFarm.getWorkers());
      setQueue(buildFarm.getQueue());
      setMetrics(buildFarm.getFarmMetrics());
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6 text-right">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold">
              DevOps & Build Farm Orchestrator
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Redis & BullMQ Active</span>
            </span>
          </div>
          <h2 className="text-xl font-black text-white">
            مزرعة البناء السحابية وطوابير المعالجة المعزولة
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            فصل أعباء التجميع المعقدة (Capacitor Native Gradle / Docker / iOS CocoaPods) عن خادم الـ API عبر عقد معالجة مستقلة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('workers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'workers' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            عقد المعالجة ({workers.length})
          </button>
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            طابور المهام ({queue.length})
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'architecture' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            المخطط المعماري (DevOps)
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>سعة الـ CPU المتاحة</span>
            <Cpu className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white">{metrics.totalCpuCapacityCores} Cores</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">
            استهلاك المزرعة الحالي: {metrics.usedCpuPercentage}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>عقد العمال النشطة</span>
            <Server className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white">
            {metrics.activeWorkers} / {metrics.totalWorkers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {metrics.idleWorkers} عقد بوضع الاستعداد (Idle Ready)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>حالة وسيط Redis & BullMQ</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-black text-emerald-400">OPTIMAL</div>
          <div className="text-[10px] text-slate-400 mt-1">
            ذاكرة الوسيط: {metrics.redisMemoryUsageMb} MB
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>متوسط زمن إنجاز الحزمة</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-mono font-black text-white">{metrics.avgBuildTimeSec}s</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">
            {metrics.completedTodayCount} حزمة أُنجزت اليوم
          </div>
        </div>

      </div>

      {/* TAB 1: WORKERS NODES */}
      {activeTab === 'workers' && (
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-300">
            عقد التجميع المعزولة الحية (Live Isolated Compilation Chambers):
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map(worker => {
              const isBusy = worker.status === 'busy';

              return (
                <div 
                  key={worker.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isBusy 
                      ? 'bg-slate-950 border-amber-500/40 ring-1 ring-amber-500/20' 
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${
                        isBusy ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs flex items-center gap-2">
                          <span>{worker.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                            isBusy ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {worker.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{worker.region} • {worker.ip}</div>
                      </div>
                    </div>

                    <div className="text-left font-mono text-[10px] text-slate-400">
                      <div>Uptime: {worker.uptimeHours}h</div>
                      <div>Jobs: {worker.completedJobsCount}</div>
                    </div>
                  </div>

                  {isBusy ? (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-2 mb-3">
                      <div className="flex items-center justify-between font-bold text-amber-300">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 animate-spin" />
                          <span>يعالج الآن: {worker.currentTenantName}</span>
                        </span>
                        <span className="font-mono text-[10px] uppercase bg-amber-500/20 px-1.5 py-0.5 rounded">
                          {worker.activeTarget}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-mono truncate">
                        &gt; {worker.currentStage}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 flex items-center justify-between mb-3">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>جاهزة لاستقبال مهام التصدير الفورية</span>
                      </span>
                      <span className="font-mono text-[10px]">Zero Load</span>
                    </div>
                  )}

                  {/* Resource Gauges */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>CPU Load:</span>
                        <span className="font-mono font-bold text-white">{worker.cpuLoad}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            worker.cpuLoad > 75 ? 'bg-rose-500' : worker.cpuLoad > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${worker.cpuLoad}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span>RAM Load:</span>
                        <span className="font-mono font-bold text-white">{worker.ramLoad}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${worker.ramLoad}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: QUEUE STATUS */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">طابور مهام التجميع الفعلي (Active BullMQ Task Stream):</span>
            <span className="text-[11px] text-slate-400 font-mono">Channel: build-tasks-prod</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="pb-3">معرف المهمة والمتجر</th>
                  <th className="pb-3">الهدف المستهدف</th>
                  <th className="pb-3">الأولوية (Priority)</th>
                  <th className="pb-3">نسبة الإنجاز</th>
                  <th className="pb-3">العقدة المخصصة</th>
                  <th className="pb-3">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {queue.map(job => (
                  <tr key={job.id} className="hover:bg-slate-850/40">
                    <td className="py-3 font-sans">
                      <div className="font-bold text-white">{job.tenantName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{job.id}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-sans font-bold text-[10px]">
                        {job.targetName}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.priority === 'vip_enterprise' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {job.priority === 'vip_enterprise' ? '⭐ VIP Enterprise' : 'Standard'}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="w-32 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span>{job.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              job.progress === 100 ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400 text-[11px] font-sans">
                      {job.workerName || 'بانتظار تخصيص العقدة'}
                    </td>
                    <td className="py-3 font-sans">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        job.status === 'ready' ? 'bg-emerald-500/20 text-emerald-300' :
                        job.status === 'queued' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-amber-500/20 text-amber-300 animate-pulse'
                      }`}>
                        {job.status === 'ready' ? 'جاهز ✓' : job.status === 'queued' ? 'في الطابور...' : 'جارِ التجميع ⚙️'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ARCHITECTURE DIAGRAM */}
      {activeTab === 'architecture' && (
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Zap className="w-4 h-4" />
            <span>بنية العزل التام وحماية خادم الـ API الرئيسي من الانهيار</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono">1</span>
                <span>الواجهة وطلبات التصدير</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                عند طلب التاجر تصدير تطبيق Capacitor أو حزمة Docker، يرسل المتصفح طلباً خفيفاً إلى <code className="text-amber-300">/api/v1/builds/enqueue</code> دون تشغيل أي عمليات CPU على السيرفر الرئيسي.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono">2</span>
                <span>طابور المهام (Redis / BullMQ)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                يتم تخزين المهمة في وسيط الرسائل Redis وتوزيعها تلقائياً حسب أولوية الحساب وحالة العمال مع دعم التوسع اللحظي (Auto-Scaling Workers).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono">3</span>
                <span>البث المباشر (WebSockets / SSE)</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                يتلقى المتصفح نبضات التقدم اللحظية (Progress Bar) ونصوص السجلات (Live Terminal Logs) عبر قناة WebSockets معزولة حتى اكتمال التجميع والتسليم.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
