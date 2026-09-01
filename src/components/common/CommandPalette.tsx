import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Store, 
  Plus, 
  Download, 
  Cpu, 
  Network, 
  Puzzle, 
  Monitor, 
  Rocket, 
  Sparkles, 
  Palette, 
  ShoppingBag, 
  Package, 
  Users, 
  ShieldCheck, 
  Settings, 
  ExternalLink,
  ArrowRight,
  Command,
  CornerDownLeft,
  X,
  Layers,
  Building2,
  Trash2,
  Lock
} from 'lucide-react';
import { useCommerce, AppView } from '../../context/CommerceContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const {
    tenants,
    activeTenant,
    setActiveTenantId,
    currentView,
    setCurrentView,
    openAuthModal,
    showToast,
    resetToCleanStore
  } = useCommerce();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Cmd+K listener handled in parent or here
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (isOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search items definition
  const actionItems = [
    // 1. Direct Actions
    {
      id: 'action-export-code',
      category: 'إجراءات سريعة (Quick Actions)',
      title: 'تصدير الكود البرمجي والحزمة الكاملة (Full Stack Export)',
      subtitle: 'توليد حزمة Node.js + Express + React + AST جاهزة للنشر',
      icon: Download,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      action: () => {
        setCurrentView('merchant_dashboard');
        showToast('جاري تحضير حزمة التصدير في مركز النشر...', 'info');
        onClose();
      }
    },
    {
      id: 'action-create-store',
      category: 'إجراءات سريعة (Quick Actions)',
      title: 'إنشاء متجر جديد (Launch New Store)',
      subtitle: 'بدء معالج بناء وتخصيص المتجر الذكي',
      icon: Plus,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        setCurrentView('builder_wizard');
        onClose();
      }
    },
    {
      id: 'action-view-storefront',
      category: 'إجراءات سريعة (Quick Actions)',
      title: `زيارة متجر "${activeTenant.name}" (Live Storefront)`,
      subtitle: 'عرض واجهة تسوق العميل وتجربة الشراء الحية',
      icon: ExternalLink,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      action: () => {
        setCurrentView('storefront');
        onClose();
      }
    },
    // 2. Navigation Tools & Engines
    {
      id: 'nav-dynamic-rules',
      category: 'محركات المنصة المتقدمة (Engines & Architecture)',
      title: 'محرك قواعد الخصومات الديناميكية (AST Rule Engine)',
      subtitle: 'برمجة قواعد الخصم وترجمتها لـ AST في الباك إند',
      icon: Cpu,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        setCurrentView('merchant_dashboard');
        onClose();
      }
    },
    {
      id: 'nav-event-cqrs',
      category: 'محركات المنصة المتقدمة (Engines & Architecture)',
      title: 'معمارية الأحداث وتدفق الطلبات (Event-Driven & CQRS)',
      subtitle: 'طابور الأحداث، عزل القراءة والكتابة، والتوجيه الجغرافي للمستودعات',
      icon: Network,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      action: () => {
        setCurrentView('merchant_dashboard');
        onClose();
      }
    },
    {
      id: 'nav-webhooks-plugins',
      category: 'محركات المنصة المتقدمة (Engines & Architecture)',
      title: 'هندسة الإضافات والخطافات السحابية (Webhooks & Plugins)',
      subtitle: 'إدارة مجلد plugins/ وتواقيع HMAC الرقمية',
      icon: Puzzle,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      action: () => {
        setCurrentView('merchant_dashboard');
        onClose();
      }
    },
    {
      id: 'nav-desktop-pos',
      category: 'محركات المنصة المتقدمة (Engines & Architecture)',
      title: 'نقطة البيع وتكامل العتاد (Desktop POS & Tauri)',
      subtitle: 'ربط طابعات الباركود ومنافذ السيريال والعمل Offline',
      icon: Monitor,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      action: () => {
        setCurrentView('merchant_dashboard');
        onClose();
      }
    },
    {
      id: 'nav-visual-ide',
      category: 'أدوات التصميم والبرمجة (Design & IDE)',
      title: 'المحرر المرئي الذكي (Visual IDE & Code Canvas)',
      subtitle: 'تعديل مكونات المتجر مباشرة ومرئياً',
      icon: Layers,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => {
        setCurrentView('visual_ide');
        onClose();
      }
    },
    {
      id: 'nav-live-customizer',
      category: 'أدوات التصميم والبرمجة (Design & IDE)',
      title: 'استوديو التصميم والهوية البصرية (Live Design Studio)',
      subtitle: 'تعديل الألوان، الخطوط، والأنماط المعمارية لحظياً',
      icon: Palette,
      color: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
      action: () => {
        setCurrentView('live_customizer');
        onClose();
      }
    },
    {
      id: 'nav-platform-hq',
      category: 'أدوات المنصة والسيادة (Platform HQ)',
      title: 'مركز إدارة المنصة السيادية (CommerceOS HQ)',
      subtitle: 'إدارة جميع المتاجر، التراخيص، وإزالة العلامة المائية',
      icon: Building2,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        setCurrentView('platform_admin');
        onClose();
      }
    }
  ];

  // Tenant items for switching
  const tenantItems = tenants.map(t => ({
    id: `tenant-${t.id}`,
    category: 'المتاجر والمشاريع (Stores & Projects)',
    title: t.name,
    subtitle: `ID: ${t.id} • الخطة: ${t.plan.toUpperCase()} • ${t.status === 'active' ? 'متصل وجاهز' : 'معلق'}`,
    icon: Store,
    color: t.id === activeTenant.id ? 'text-amber-400 bg-amber-500/20 border-amber-500/40' : 'text-slate-300 bg-zinc-800 border-zinc-700',
    isCurrent: t.id === activeTenant.id,
    action: () => {
      setActiveTenantId(t.id);
      showToast(`تم التبديل بنجاح إلى متجر "${t.name}" 🏬`, 'success');
      onClose();
    }
  }));

  const allItems = [...actionItems, ...tenantItems];

  const filteredItems = allItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-3xl bg-[#0B1422]/95 border border-[#233247] shadow-2xl overflow-hidden flex flex-col relative text-right"
        dir="rtl"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Ambient Gold Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A45C]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Header & Search Bar */}
        <div className="p-4 border-b border-[#233247] flex items-center gap-3 relative z-10">
          <div className="p-2 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/30 text-[#C9A45C]">
            <Search className="w-5 h-5" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="ابحث عن متجر، أداة، قاعدة خصم، تصدير الكود، أو إعداد..."
            className="flex-1 bg-transparent border-none text-[#F4F6F8] text-sm font-semibold placeholder:text-[#97A4B5] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#050B14] border border-[#233247] text-[10px] text-[#97A4B5] font-mono">
            <span>ESC للإغلاق</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#101B2C] text-[#97A4B5] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-3 space-y-1 relative z-10">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#97A4B5] text-xs">
              لا توجد نتائج مطابقة لـ "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-2xl cursor-pointer flex items-center justify-between gap-3 transition-all ${
                    isSelected 
                      ? 'bg-[#101B2C] border border-[#C9A45C]/50 shadow-lg text-white' 
                      : 'hover:bg-[#101B2C]/50 border border-transparent text-[#97A4B5]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isSelected ? 'bg-[#C9A45C]/20 border-[#C9A45C]/40 text-[#C9A45C]' : 'bg-[#050B14] border-[#233247] text-[#97A4B5]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold flex items-center gap-2 truncate text-white">
                        <span>{item.title}</span>
                        {'isCurrent' in item && item.isCurrent && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30">
                            المتجر النشط
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#97A4B5] truncate mt-0.5 font-mono">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#C9A45C] font-mono">
                        <span>تنفيذ</span>
                        <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="p-3 bg-[#050B14] border-t border-[#233247] flex items-center justify-between text-[11px] text-[#97A4B5] relative z-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-[#0B1422] text-[#F4F6F8] border border-[#233247] text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#0B1422] text-[#F4F6F8] border border-[#233247] text-[10px]">↓</kbd>
              <span>للتنقل</span>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <kbd className="px-1.5 py-0.5 rounded bg-[#0B1422] text-[#F4F6F8] border border-[#233247] text-[10px]">Enter</kbd>
              <span>للاختيار</span>
            </span>
          </div>
          <div className="font-mono text-[#C9A45C] text-[10px] flex items-center gap-1 font-bold">
            <Command className="w-3 h-3" />
            <span>CommerceOS Command Engine</span>
          </div>
        </div>
      </div>
    </div>
  );
};
