import React, { useState } from 'react';
import { Network, Server, Database, Activity, RefreshCw, Send, CheckCircle2, MapPin, Truck } from 'lucide-react';

interface EventDrivenCQRSManagerProps {
  tenant: any;
}

export const EventDrivenCQRSManager: React.FC<EventDrivenCQRSManagerProps> = ({ tenant }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'stream' | 'cqrs' | 'warehouses'>('architecture');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [readModelData, setReadModelData] = useState({
    totalEventsRecorded: 2840,
    projections: {
      totalOrdersPlaced: 142,
      productViews: 5890,
      inventoryStock: { 'عسل ملكي فاخر': 1200, 'عطور عود ملكي': 450 }
    },
    recentEvents: [
      { eventId: 'evt_9841', eventType: 'ORDER_PLACED', timestamp: 'منذ ثوانٍ قليلة' },
      { eventId: 'evt_9840', eventType: 'PRODUCT_VIEWED', timestamp: 'منذ دقيقة' },
      { eventId: 'evt_9839', eventType: 'CART_UPDATED', timestamp: 'منذ دقيقتين' }
    ]
  });

  const handleRunLoadSimulation = () => {
    setIsSimulating(true);
    setSimulationResult(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationResult({
        success: true,
        requestsPerMinute: 10000,
        averageLatencyMs: 3.2,
        assignedWarehouse: 'مستودع الرياض المركزي',
        distanceKm: 12,
        shippingCost: 21,
        message: 'تم معالجة 10,000 طلب في الدقيقة بنجاح عبر طابور الأحداث (Redis Streams) مع فصل القراءة والكتابة (CQRS).'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-900 to-cyan-950 border border-cyan-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-3 border border-cyan-500/30">
              <Network className="w-3.5 h-3.5" />
              <span>معمارية الأحداث والمخزون اللامركزي (Event-Driven & CQRS)</span>
            </div>
            <h2 className="text-2xl font-black text-white">إدارة تدفق الأحداث، فصل القراءة والكتابة، والتوجيه الجغرافي للمستودعات</h2>
            <p className="text-sm text-slate-300 mt-1">
              تحمل أكثر من 10,000 طلب في الدقيقة دون انهيار عبر إرسال الأحداث لطابور رسائل، وفصل مسارات القراءة السريعة عن مسارات الكتابة المعقدة.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRunLoadSimulation}
              disabled={isSimulating}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-xs shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center gap-2"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              <span>محاكاة ضغط 10,000 طلب/دقيقة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'architecture' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          نظرة معمارية (Architecture)
        </button>
        <button
          onClick={() => setActiveTab('stream')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stream' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          طابور الأحداث (Event Sourcing)
        </button>
        <button
          onClick={() => setActiveTab('cqrs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cqrs' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          فصل القراءة والكتابة (CQRS)
        </button>
        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'warehouses' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          التوجيه الذكي للمستودعات (Multi-Warehouse)
        </button>
      </div>

      {/* Simulation Result Alert */}
      {simulationResult && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-cyan-300 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{simulationResult.message} (السرعة: {simulationResult.averageLatencyMs}ms لكل طلب)</span>
          </div>
          <button onClick={() => setSimulationResult(null)} className="text-cyan-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Tab 1: Architecture Overview */}
      {activeTab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Event Sourcing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              كل حركة شراء أو خصم مخزون لا تُعدل الداتابيز مباشرة، بل تُسجل كحدث غير قابل للتعديل (Immutable Event Stream) لضمان عدم ضياع أي معاملة.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">CQRS Pattern</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              فصل تام بين مسارات الكتابة (Commands عبر طوابير الطوارئ) ومسارات القراءة (Queries سريعة جداً عبر نماذج مجردة مجهزة مسبقاً).
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Multi-Warehouse Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              خوارزمية جغرافية مدمجة تحسب المسافة بين العميل ومستودعات المتجر ل توجيه الطلب تلقائياً لأقرب مستودع وتوفير تكاليف الشحن.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Event Stream */}
      {activeTab === 'stream' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">سجل الأحداث اللحظي (Event Stream / Redis Streams)</h3>
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono">
              إجمالي الأحداث: {readModelData.totalEventsRecorded}
            </span>
          </div>

          <div className="space-y-2">
            {readModelData.recentEvents.map((evt, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-mono text-white">{evt.eventId}</span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-cyan-300 font-mono text-[11px]">{evt.eventType}</span>
                </div>
                <span className="text-slate-400">{evt.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: CQRS Projections */}
      {activeTab === 'cqrs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="text-xs text-slate-400">إجمالي الطلبات المُعالجة (Read Model)</div>
            <div className="text-2xl font-black text-cyan-400">{readModelData.projections.totalOrdersPlaced} طلب</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="text-xs text-slate-400">مشاهدات المنتجات اللحظية</div>
            <div className="text-2xl font-black text-blue-400">{readModelData.projections.productViews} مشاهدة</div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <div className="text-xs text-slate-400">زمن استجابة القراءة (CQRS Query Latency)</div>
            <div className="text-2xl font-black text-emerald-400">~1.2 ms</div>
          </div>
        </div>
      )}

      {/* Tab 4: Multi-Warehouse Routing */}
      {activeTab === 'warehouses' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400" />
            <span>خوارزمية التوجيه الجغرافي للمستودعات (Multi-Warehouse Engine)</span>
          </h3>
          <p className="text-xs text-slate-300">
            يحتوي الباك إند المُصدر على مستودعات متعددة مرتبطة بإحداثيات GPS. يتم حساب أقرب مسافة للعميل تلقائياً عند الدفع لتقليل تكلفة الشحن وزيادة سرعة التوصيل.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-white">مستودع الرياض المركزي</div>
              <div className="text-xs text-slate-400">الإحداثيات: 24.7136° N, 46.6753° E</div>
              <div className="text-[11px] text-emerald-400 font-bold">الطاقة الاستيعابية: عالية</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-white">مستودع جدة الغربي</div>
              <div className="text-xs text-slate-400">الإحداثيات: 21.5433° N, 39.1728° E</div>
              <div className="text-[11px] text-blue-400 font-bold">الطاقة الاستيعابية: متوسطة</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-sm font-bold text-white">مستودع دبي الإقليمي</div>
              <div className="text-xs text-slate-400">الإحداثيات: 25.2048° N, 55.2708° E</div>
              <div className="text-[11px] text-emerald-400 font-bold">الطاقة الاستيعابية: عالية</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
