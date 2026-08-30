import React, { useState } from 'react';
import { Monitor, Printer, Barcode, Cpu, RefreshCw, Download, CheckCircle2, AlertCircle, Wifi, Database } from 'lucide-react';

interface DesktopPOSManagerProps {
  tenant: any;
}

export const DesktopPOSManager: React.FC<DesktopPOSManagerProps> = ({ tenant }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'sync' | 'download'>('overview');
  const [serialPorts, setSerialPorts] = useState<string[]>(['COM1', 'COM2 (USB Thermal Printer)', 'COM3 (Barcode Scanner)', 'COM4 (Customer VFD Display)']);
  const [selectedPrinterPort, setSelectedPrinterPort] = useState('COM2 (USB Thermal Printer)');
  const [selectedScannerPort, setSelectedScannerPort] = useState('COM3 (Barcode Scanner)');
  const [selectedDisplayPort, setSelectedDisplayPort] = useState('COM4 (Customer VFD Display)');
  const [isTestingHardware, setIsTestingHardware] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [offlineQueueCount, setOfflineQueueCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTestPrinter = () => {
    setIsTestingHardware(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTestingHardware(false);
      setTestResult(`تم إرسال أمر اختبار طباعة الإيصال عبر منفذ السيريال ${selectedPrinterPort} بنجاح!`);
    }, 1200);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setOfflineQueueCount(0);
      setTestResult('تمت مزامنة معاملات نقطة البيع (Offline POS) مع السحابة بنجاح تام!');
    }, 1500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-900 to-indigo-950 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/30">
              <Monitor className="w-3.5 h-3.5" />
              <span>نظام سطح المكتب لنقطة البيع (Desktop POS & Rust Tauri)</span>
            </div>
            <h2 className="text-2xl font-black text-white">إدارة نقاط البيع وتكامل عتاد التجزئة (Hardware POS)</h2>
            <p className="text-sm text-slate-300 mt-1">
              تصدير تطبيق سطح مكتب خفيف ومستقل بمعمارية Rust و Tauri مع اتصال مباشر بطابعات الإيصالات، قارئ الباركود، وشاشات العملاء عبر منافذ السيريال (RS232/USB).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('download')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-xs shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>تنزيل تطبيق Desktop POS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          نظرة عامة والخصائص
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hardware' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          منافذ العتاد والسيريال (Serial/USB)
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sync' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          المزامنة اللحظية (Offline & Cloud)
        </button>
        <button
          onClick={() => setActiveTab('download')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'download' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-900 hover:text-white'
          }`}
        >
          حزم التحميل والتصدير
        </button>
      </div>

      {/* Test Result Alert */}
      {testResult && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{testResult}</span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-emerald-400 hover:text-white font-bold">✕</button>
        </div>
      )}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">معمارية Tauri & Rust</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              تطبيق سطح مكتب فائق السرعة وخفيف الوزن (أقل من 25 ميجابايت) يعمل بكفاءة تامة على أنظمة Windows و macOS و Linux دون الحاجة لمتصفح ثقيل.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Printer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">تكامل العتاد المباشر</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اتصال مباشر عبر منافذ السيريال (RS232/USB) بطابعات الإيصالات الحرارية، أدراج النقود (Cash Drawers)، وأجهزة قراءة الباركود السريعة.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Wifi className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">العمل دون انترنت (Offline First)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              يستمر المعرض في بيع المنتجات وإصدار الإيصالات حتى لو انقطع الإنترنت تماماً، مع مزامنة تلقائية فور عودة الاتصال مع السحابة.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Hardware & Serial Ports */}
      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Printer className="w-5 h-5 text-indigo-400" />
              <span>إعدادات طابعة الإيصالات الحرارية (Thermal Printer)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">منفذ السيريال (Serial Port)</label>
                <select
                  value={selectedPrinterPort}
                  onChange={e => setSelectedPrinterPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {serialPorts.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">نوع البروتوكول / الأوامر</label>
                <input
                  type="text"
                  readOnly
                  value="ESC/POS Direct Commands (Standard)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono"
                />
              </div>
              <button
                onClick={handleTestPrinter}
                disabled={isTestingHardware}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2"
              >
                {isTestingHardware ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
                <span>اختبار طباعة إيصال تجريبي</span>
              </button>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Barcode className="w-5 h-5 text-indigo-400" />
              <span>قارئ الباركود وشاشة عرض العملاء (Scanner & VFD Display)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">منفذ قارئ الباركود (Barcode Scanner)</label>
                <select
                  value={selectedScannerPort}
                  onChange={e => setSelectedScannerPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {serialPorts.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">منفذ شاشة عرض الأسعار (Customer VFD Display)</label>
                <select
                  value={selectedDisplayPort}
                  onChange={e => setSelectedDisplayPort(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {serialPorts.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>جميع الأجهزة متصلة وجاهزة لاستقبال نبضات الباركود والطباعة الفورية.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Real-time Sync */}
      {activeTab === 'sync' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">حالة المزامنة بين المعرض (Offline) والسحابة (Online)</h3>
              <p className="text-xs text-slate-400 mt-1">تتم مزامنة المبيعات والمخزون بشكل لحظي عبر قنوات آمنة ومشفقة.</p>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>مزامنة فورية الآن</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <div className="text-xs text-slate-400">حالة الاتصال السحابي</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>متصل بالسحابة (Online)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <div className="text-xs text-slate-400">المعاملات المحلية غير المزامنة</div>
              <div className="text-xl font-black text-amber-400">{offlineQueueCount} معاملة</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <div className="text-xs text-slate-400">آخر مزامنة ناجحة</div>
              <div className="text-xs font-mono text-white">قبل دقيقتين (منذ بدء التشغيل)</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Download */}
      {activeTab === 'download' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">حزم تطبيق نقطة البيع لسطح المكتب (Desktop POS Installers)</h3>
          <p className="text-xs text-slate-300">
            يمكنك تحميل حزمة التثبيت الخاصة بنظام التشغيل لديك لتشغيل نقطة البيع في معرضك الفعلي مع دعم كامل للطابعات وأجهزة الباركود:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center font-black text-lg">WIN</div>
              <div>
                <div className="text-sm font-bold text-white">Windows 10 / 11 (x64)</div>
                <div className="text-[11px] text-slate-400 mt-1">حزمة MSIX مع دعم Serial & ESC/POS</div>
              </div>
              <a
                href={`#download-win`}
                onClick={(e) => { e.preventDefault(); alert('جارٍ تنزيل مثبت Windows POS لنظام ' + tenant.name); }}
                className="block w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all"
              >
                تنزيل لـ Windows
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-700 text-slate-200 mx-auto flex items-center justify-center font-black text-lg">MAC</div>
              <div>
                <div className="text-sm font-bold text-white">macOS (Apple Silicon & Intel)</div>
                <div className="text-[11px] text-slate-400 mt-1">حزمة DMG موقعة ومفحوصة أمنياً</div>
              </div>
              <a
                href={`#download-mac`}
                onClick={(e) => { e.preventDefault(); alert('جارٍ تنزيل مثبت macOS POS لنظام ' + tenant.name); }}
                className="block w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                تنزيل لـ macOS
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center font-black text-lg">LIN</div>
              <div>
                <div className="text-sm font-bold text-white">Linux AppImage / Deb</div>
                <div className="text-[11px] text-slate-400 mt-1">مخصص لمحطات الكاشير العاملة بـ Linux</div>
              </div>
              <a
                href={`#download-lin`}
                onClick={(e) => { e.preventDefault(); alert('جارٍ تنزيل مثبت Linux POS لنظام ' + tenant.name); }}
                className="block w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                تنزيل لـ Linux
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
