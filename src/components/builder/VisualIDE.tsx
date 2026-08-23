import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  MoveUp, 
  MoveDown, 
  Eye, 
  EyeOff, 
  Settings2, 
  Sparkles, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Palette, 
  Check, 
  Layout, 
  Type, 
  Sliders, 
  Zap, 
  Globe, 
  ShoppingBag,
  ExternalLink,
  Code,
  Tag,
  Star,
  HelpCircle,
  Mail,
  ShieldCheck,
  Percent,
  Play
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { VisualBlock, VisualBlockType, FontFamily, ThemeStyle } from '../../types';
import { generateDesignTokens, PRESET_COLOR_PALETTES } from '../../utils/themeEngine';

export const VisualIDE: React.FC = () => {
  const { 
    activeTenant, 
    updateTheme, 
    updateTenant, 
    products, 
    categories, 
    showToast,
    setCurrentView 
  } = useCommerce();

  // Device Preview State
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>('block-hero');
  const [activeSideTab, setActiveSideTab] = useState<'blocks' | 'inspector' | 'styling' | 'templates'>('blocks');

  // Live JIT Styling State (in-memory)
  const [primaryColor, setPrimaryColor] = useState<string>(activeTenant.theme.tokens?.primary || '#D4A017');
  const [selectedFont, setSelectedFont] = useState<FontFamily>(activeTenant.theme.fontFamily || 'tajawal');
  const [selectedStyle, setSelectedStyle] = useState<ThemeStyle>(activeTenant.theme.style || 'luxury');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(activeTenant.theme.darkMode || false);

  // Initial Visual Blocks (Memory-State)
  const [blocks, setBlocks] = useState<VisualBlock[]>([
    {
      id: 'block-hero',
      type: 'hero_banner',
      nameAr: 'الهيرو بانر الرئيسي (Hero Banner)',
      nameEn: 'Hero Banner',
      enabled: true,
      order: 1,
      props: {
        title: activeTenant.name || 'العسل الملكي الفاخر',
        subtitle: activeTenant.slogan || 'طبيعي 100% مستخلص من أجود المناحل الجبلية',
        ctaText: 'تسوق التشكيلة الملكية',
        badgeText: 'موسم 2026 الحصري ⭐',
        bgGradient: 'from-amber-950/60 to-slate-950',
        align: 'center'
      }
    },
    {
      id: 'block-features',
      type: 'features_bar',
      nameAr: 'شريط المميزات والضمان (Features Bar)',
      nameEn: 'Features Bar',
      enabled: true,
      order: 2,
      props: {
        items: [
          { title: 'طبيعي ومفحوص مخبرياً', desc: 'معتمد من هيئة الغذاء والدواء' },
          { title: 'شحن سريع ومبرد', desc: 'توصيل خلال 24-48 ساعة' },
          { title: 'ضمان ذهبي للاسترجاع', desc: 'استرداد كامل في حال عدم الرضا' }
        ]
      }
    },
    {
      id: 'block-categories',
      type: 'categories_slider',
      nameAr: 'شريط التصنيفات السريع (Categories Slider)',
      nameEn: 'Categories Slider',
      enabled: true,
      order: 3,
      props: {
        title: 'تصفح حسب الأصناف',
        showAllButton: true,
        style: 'pills'
      }
    },
    {
      id: 'block-flash-sale',
      type: 'flash_sale',
      nameAr: 'بانر العروض الترويجية والخصومات (Flash Sale)',
      nameEn: 'Flash Sale Banner',
      enabled: true,
      order: 4,
      props: {
        tagText: 'عرض خاص ومحدود 🔥',
        heading: 'خصم 20% على باقة العسل الدوعني الملكي',
        couponCode: 'ROYAL20',
        timerHours: 12
      }
    },
    {
      id: 'block-products',
      type: 'product_grid',
      nameAr: 'شبكة المنتجات التفاعلية (Product Grid)',
      nameEn: 'Product Grid',
      enabled: true,
      order: 5,
      props: {
        heading: 'أكثر المنتجات طلباً',
        columnsDesktop: 3,
        showBadge: true,
        showQuickAdd: true
      }
    },
    {
      id: 'block-testimonials',
      type: 'testimonials',
      nameAr: 'آراء وتقييمات العملاء (Testimonials)',
      nameEn: 'Testimonials',
      enabled: true,
      order: 6,
      props: {
        heading: 'ماذا يقول عملاؤنا المميزون',
        ratingScore: '4.9 / 5'
      }
    },
    {
      id: 'block-newsletter',
      type: 'newsletter',
      nameAr: 'النشرة البريدية والعروض الحصرية',
      nameEn: 'Newsletter',
      enabled: true,
      order: 7,
      props: {
        title: 'انضم لنادي التميز واحصل على خصم 10% فوراً',
        buttonText: 'اشتراك فوري'
      }
    }
  ]);

  // JIT CSS Variable Injection into the current DOM
  useEffect(() => {
    const tokens = generateDesignTokens(primaryColor, selectedStyle, isDarkMode);
    const root = document.documentElement;

    root.style.setProperty('--color-primary', tokens.primary);
    root.style.setProperty('--color-secondary', tokens.secondary);
    root.style.setProperty('--color-accent', tokens.accent);
  }, [primaryColor, selectedStyle, isDarkMode]);

  // Reorder Blocks
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[targetIndex];
    newBlocks[targetIndex] = temp;

    // update order numbers
    newBlocks.forEach((b, i) => { b.order = i + 1; });
    setBlocks(newBlocks);
  };

  const toggleBlock = (id: string) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, enabled: !b.enabled } : b));
  };

  const updateBlockProp = (blockId: string, key: string, value: any) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === blockId) {
        return {
          ...b,
          props: {
            ...b.props,
            [key]: value
          }
        };
      }
      return b;
    }));
  };

  const handlePublishLive = () => {
    const tokens = generateDesignTokens(primaryColor, selectedStyle, isDarkMode);
    
    updateTheme(activeTenant.id, {
      ...activeTenant.theme,
      tokens,
      fontFamily: selectedFont,
      style: selectedStyle,
      darkMode: isDarkMode
    });

    showToast('تم نشر هيكل وتصميم المتجر المحدث بنجاح! 🚀✨', 'success');
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Top IDE Toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between gap-4 sticky top-16 z-30 shadow-md">
        
        {/* Title & Mode Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Visual IDE & Zero-Domain Engine</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Live Memory JIT
              </span>
            </div>
            <div className="text-[10px] text-slate-400">بناء وتصيير مرئي لحظي دون الحاجة لنطاق أو خادم</div>
          </div>
        </div>

        {/* Viewport Device Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              device === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="معاينة سطح المكتب (Desktop)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">شاشة كاملة</span>
          </button>
          <button
            onClick={() => setDevice('tablet')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              device === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="معاينة الآيباد واللوحي (Tablet)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">تابلت</span>
          </button>
          <button
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all ${
              device === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
            title="معاينة الجوال (Mobile Phone)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">هاتف ذكي</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('storefront')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">معاينة المتجر</span>
          </button>

          <button
            onClick={handlePublishLive}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>نشر حي للمتجر</span>
          </button>
        </div>

      </div>

      {/* Main IDE Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Visual Inspector & Block Tree */}
        <div className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 z-20">
          
          {/* Side Tabs */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 p-1">
            <button
              onClick={() => setActiveSideTab('blocks')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'blocks' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              المركبات ({blocks.filter(b => b.enabled).length})
            </button>
            <button
              onClick={() => setActiveSideTab('inspector')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'inspector' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings2 className="w-3.5 h-3.5" />
              الخصائص
            </button>
            <button
              onClick={() => setActiveSideTab('styling')}
              className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeSideTab === 'styling' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              JIT الألوان
            </button>
          </div>

          {/* Tab 1: Blocks Drag & Reorder List */}
          {activeSideTab === 'blocks' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400 px-1 mb-2">
                اسحب ورتّب عناصر متجرك بالترتيب المطلوب:
              </div>

              {blocks.map((block, index) => (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    selectedBlockId === block.id 
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md' 
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  } ${!block.enabled ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-md bg-slate-900 text-slate-400 text-[10px] font-mono flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{block.nameAr.split('(')[0]}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">{block.type}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                      title="تحريك لأعلى"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                      title="تحريك لأسفل"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => toggleBlock(block.id)}
                      className={`p-1 rounded ${block.enabled ? 'text-emerald-400 bg-emerald-950/60' : 'text-slate-500 bg-slate-900'}`}
                      title={block.enabled ? 'إخفاء' : 'إظهار'}
                    >
                      {block.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Visual Property Inspector */}
          {activeSideTab === 'inspector' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedBlock ? (
                <>
                  <div className="border-b border-slate-800 pb-3">
                    <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">{selectedBlock.type}</div>
                    <div className="text-sm font-black text-white mt-0.5">{selectedBlock.nameAr}</div>
                  </div>

                  {/* Dynamic Form Props for Block */}
                  {selectedBlock.type === 'hero_banner' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">العنوان الرئيسي:</label>
                        <input
                          type="text"
                          value={selectedBlock.props.title || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">الوصف والرسالة الترويجية:</label>
                        <textarea
                          rows={2}
                          value={selectedBlock.props.subtitle || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'subtitle', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">نص زر الشراء (CTA):</label>
                        <input
                          type="text"
                          value={selectedBlock.props.ctaText || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'ctaText', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">شارة العرض (Badge):</label>
                        <input
                          type="text"
                          value={selectedBlock.props.badgeText || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'badgeText', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlock.type === 'flash_sale' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">عنوان العرض الخاطف:</label>
                        <input
                          type="text"
                          value={selectedBlock.props.heading || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'heading', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">كود الخصم المقترح:</label>
                        <input
                          type="text"
                          value={selectedBlock.props.couponCode || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'couponCode', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {selectedBlock.type === 'product_grid' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">عنوان قسم المنتجات:</label>
                        <input
                          type="text"
                          value={selectedBlock.props.heading || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'heading', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">عدد الأعمدة (Desktop Columns):</label>
                        <div className="grid grid-cols-3 gap-2">
                          {[2, 3, 4].map(cols => (
                            <button
                              key={cols}
                              type="button"
                              onClick={() => updateBlockProp(selectedBlock.id, 'columnsDesktop', cols)}
                              className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                selectedBlock.props.columnsDesktop === cols 
                                  ? 'bg-amber-500 text-slate-950 border-amber-500' 
                                  : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}
                            >
                              {cols} أعمدة
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBlock.type === 'newsletter' && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">دعوة الاشتراك:</label>
                        <input
                          type="text"
                          value={selectedBlock.props.title || ''}
                          onChange={e => updateBlockProp(selectedBlock.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  اختر مركباً من القائمة لتعديل خصائصه مباشرة
                </div>
              )}
            </div>
          )}

          {/* Tab 3: JIT Color & Font Tokens */}
          {activeSideTab === 'styling' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-2">اللون الرئيسي الحي (JIT Primary Color):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={e => setPrimaryColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-2">لوحات ألوان سريعة:</label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESET_COLOR_PALETTES.slice(0, 6).map(p => (
                    <button
                      key={p.hex}
                      onClick={() => setPrimaryColor(p.hex)}
                      className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 flex items-center gap-2 text-right transition-all text-xs"
                    >
                      <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: p.hex }} />
                      <span className="truncate text-slate-200">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-2">الخط التيبوغرافي:</label>
                <select
                  value={selectedFont}
                  onChange={e => setSelectedFont(e.target.value as FontFamily)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none"
                >
                  <option value="tajawal">تجوال (Tajawal) - رسمي وعصري</option>
                  <option value="alexandria">الإسكندرية (Alexandria) - هندسي فاخر</option>
                  <option value="cairo">القاهرة (Cairo) - بارز وقوي</option>
                  <option value="playfair">Playfair Display - كلاسيكي فاخر</option>
                  <option value="jakarta">Plus Jakarta Sans - تقني معاصر</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>يتم حقن متغيرات الألوان والخطوط لحظياً دون أي تأخير أو وميض.</span>
              </div>
            </div>
          )}

        </div>

        {/* Center: Live Memory-State Canvas */}
        <div className="flex-1 bg-slate-950 p-4 sm:p-6 overflow-y-auto flex items-start justify-center">
          
          <div 
            className={`transition-all duration-300 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col ${
              device === 'desktop' ? 'w-full max-w-5xl min-h-[800px]' :
              device === 'tablet' ? 'w-[768px] min-h-[700px]' :
              'w-[390px] min-h-[650px]'
            }`}
          >
            {/* Mock Browser Header */}
            <div className="h-10 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
              </div>

              <div className="px-4 py-1 rounded-md bg-slate-950 text-[11px] font-mono text-slate-400 border border-slate-800 flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-emerald-400" />
                <span>https://{activeTenant.slug}.commerceos.app</span>
              </div>

              <div className="text-[10px] text-slate-500 font-mono font-bold">
                {device.toUpperCase()}
              </div>
            </div>

            {/* Live Rendered Canvas Sections */}
            <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col divide-y divide-slate-900">
              
              {/* Store Header Mock */}
              <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-xs">
                    {activeTenant.name?.charAt(0) || 'C'}
                  </div>
                  <span className="font-bold text-sm text-white">{activeTenant.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="hover:text-amber-400 cursor-pointer">الرئيسية</span>
                  <span className="hover:text-amber-400 cursor-pointer">المنتجات</span>
                  <span className="hover:text-amber-400 cursor-pointer">العروض</span>
                  <div className="p-1.5 rounded-lg bg-slate-800 text-slate-200 flex items-center gap-1 font-bold text-[11px]">
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>2</span>
                  </div>
                </div>
              </div>

              {/* Render Blocks in order */}
              {blocks.filter(b => b.enabled).map(block => (
                <div key={block.id} className="relative group">
                  
                  {/* Block Hover Badge */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-900/90 border border-slate-700 px-2 py-0.5 rounded text-[10px] text-amber-400 font-bold font-mono">
                    {block.nameAr.split('(')[0]}
                  </div>

                  {/* 1. Hero Banner */}
                  {block.type === 'hero_banner' && (
                    <div className="relative py-16 px-6 text-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 border-b border-slate-800/80 overflow-hidden">
                      <div className="max-w-2xl mx-auto space-y-4">
                        {block.props.badgeText && (
                          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold">
                            {block.props.badgeText}
                          </span>
                        )}
                        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                          {block.props.title}
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {block.props.subtitle}
                        </p>
                        <div>
                          <button 
                            className="px-6 py-2.5 rounded-xl text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-transform active:scale-95"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {block.props.ctaText}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Features Bar */}
                  {block.type === 'features_bar' && (
                    <div className="py-6 px-4 bg-slate-900/60 border-b border-slate-800">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                        {block.props.items?.map((item: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                            <div className="text-xs font-bold text-white">{item.title}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Categories Slider */}
                  {block.type === 'categories_slider' && (
                    <div className="py-8 px-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white">{block.props.title}</h3>
                        <span className="text-xs text-amber-400 font-bold cursor-pointer">عرض الكل ←</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {categories.slice(0, 5).map(c => (
                          <div key={c.id} className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 shrink-0 cursor-pointer">
                            {c.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Flash Sale Banner */}
                  {block.type === 'flash_sale' && (
                    <div className="p-6 mx-4 my-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1 text-center sm:text-right">
                        <div className="text-xs font-bold text-amber-400">{block.props.tagText}</div>
                        <div className="text-sm sm:text-base font-black text-white">{block.props.heading}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-lg bg-slate-950 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                          {block.props.couponCode}
                        </div>
                        <button 
                          className="px-4 py-2 rounded-xl text-slate-950 text-xs font-bold shadow-md"
                          style={{ backgroundColor: primaryColor }}
                        >
                          تفعيل الخصم
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5. Product Grid */}
                  {block.type === 'product_grid' && (
                    <div className="py-8 px-6 space-y-4">
                      <h3 className="text-sm font-bold text-white">{block.props.heading}</h3>
                      <div className={`grid gap-4 ${
                        block.props.columnsDesktop === 4 ? 'grid-cols-2 sm:grid-cols-4' :
                        block.props.columnsDesktop === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                        'grid-cols-1 sm:grid-cols-3'
                      }`}>
                        {products.slice(0, 6).map(p => (
                          <div key={p.id} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 group">
                            <div className="aspect-square rounded-xl overflow-hidden bg-slate-950 relative">
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-black">
                                خصم خاص
                              </span>
                            </div>
                            <div className="text-xs font-bold text-white line-clamp-1">{p.name}</div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-400">{p.price} ر.س</span>
                              <button 
                                className="p-1.5 rounded-lg text-slate-950"
                                style={{ backgroundColor: primaryColor }}
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 6. Testimonials */}
                  {block.type === 'testimonials' && (
                    <div className="py-8 px-6 bg-slate-900/40 border-t border-slate-800 text-center space-y-4">
                      <h3 className="text-sm font-bold text-white">{block.props.heading}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-right space-y-1">
                          <div className="flex text-amber-400 text-[10px]">⭐⭐⭐⭐⭐</div>
                          <p>«تجربة ممتازة وجودة العسل فاخرة جداً، سرعة التوصيل مبهرة!»</p>
                          <div className="text-[10px] text-slate-500 font-bold">محمد الحربي — الرياض</div>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 text-right space-y-1">
                          <div className="flex text-amber-400 text-[10px]">⭐⭐⭐⭐⭐</div>
                          <p>«أفضل متجر تعاملت معه، التغليف راقي والمنتج أصلي 100%.»</p>
                          <div className="text-[10px] text-slate-500 font-bold">هند الشريف — جدة</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 7. Newsletter */}
                  {block.type === 'newsletter' && (
                    <div className="py-8 px-6 bg-slate-950 border-t border-slate-800 text-center space-y-3">
                      <div className="text-xs font-bold text-white">{block.props.title}</div>
                      <div className="max-w-md mx-auto flex items-center gap-2">
                        <input 
                          type="email" 
                          placeholder="أدخل بريدك الإلكتروني" 
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none" 
                        />
                        <button 
                          className="px-4 py-2 rounded-xl text-slate-950 text-xs font-bold shrink-0"
                          style={{ backgroundColor: primaryColor }}
                        >
                          {block.props.buttonText}
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}

              {/* Store Footer */}
              <div className="p-6 bg-slate-950 border-t border-slate-800 text-center text-xs text-slate-500">
                جميع الحقوق محفوظة © 2026 {activeTenant.name} — مدعوم بواسطة CommerceOS
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
