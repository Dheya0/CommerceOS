import React from 'react';
import { 
  MoveUp, 
  MoveDown, 
  Trash2, 
  CopyPlus, 
  Settings2, 
  Plus, 
  Sparkles, 
  Scale, 
  Receipt, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Clock, 
  Package, 
  Type, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck,
  CreditCard,
  Hash,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Truck,
  Percent,
  Gift,
  Video,
  Layers2,
  Sliders,
  Award,
  MapPin,
  Split,
  Coins,
  FileSpreadsheet,
  Anchor,
  Play,
  Check,
  Tag,
  ArrowRight
} from 'lucide-react';
import { 
  NoCodeAppProject, 
  AppStudioScreen, 
  AppStudioField 
} from '../../types/appStudio';

interface StudioCanvasProps {
  project: NoCodeAppProject;
  activeScreen: AppStudioScreen;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleMoveField: (id: string, dir: 'up' | 'down') => void;
  handleDuplicateField: (field: AppStudioField) => void;
  handleDeleteField: (id: string) => void;
  handleAddField: (type: AppStudioField['type']) => void;
  device: 'mobile' | 'tablet' | 'desktop';
  zoom?: number;
  showGrid?: boolean;
  isLandscape?: boolean;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  project,
  activeScreen,
  selectedFieldId,
  setSelectedFieldId,
  handleMoveField,
  handleDuplicateField,
  handleDeleteField,
  handleAddField,
  device,
  zoom = 100,
  showGrid = true,
  isLandscape = false,
  showToast
}) => {
  const scaleRatio = zoom / 100;

  return (
    <div 
      className={`w-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-[#1E2E48] relative ${
        showGrid ? 'bg-radial-grid' : ''
      }`}
      style={{ 
        backgroundColor: project.theme.backgroundColor,
        color: project.theme.textColor,
        fontFamily: project.theme.fontFamily,
        transform: scaleRatio !== 1 ? `scale(${scaleRatio})` : undefined,
        transformOrigin: 'top center'
      }}
    >
      
      {/* 1. DEVICE TOP STATUS BAR WITH TELEMETRY */}
      <div className="px-6 py-2 bg-black/50 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="font-black text-amber-400">09:41</span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
            60 FPS
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-[10px]">
          <span>5G Ultra</span>
          <span>100% 🔋</span>
          {isLandscape && <span className="text-amber-400">🔄 وضع أفقي</span>}
        </div>
      </div>

      {/* 2. SCREEN BREADCRUMB & HEADER */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
            <span>{project.nameAr}</span>
            <span>/</span>
            <span className="text-amber-400 font-bold">{activeScreen.titleAr}</span>
          </div>
          <h2 className="text-sm font-black text-white mt-0.5">{activeScreen.titleAr}</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-lg font-mono">
            {activeScreen.fields.length} عناصر
          </span>
          <span className="text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-300 px-2 py-0.5 rounded-lg font-mono">
            {project.currencySymbol}
          </span>
        </div>
      </div>

      {/* 3. CANVAS ELEMENTS CONTAINER */}
      <div className="p-4 pt-6 pb-6 space-y-5 min-h-[440px] max-h-[680px] overflow-y-auto">
        
        {activeScreen.fields.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl border-2 border-dashed border-white/10 space-y-3 bg-white/[0.01]">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mx-auto">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">الشاشة فارغة حالياً</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                انقر أدناه لإضافة منتج أو عداد عروض أو بوابات دفع لهذه الشاشة.
              </p>
            </div>
            <button
              onClick={() => handleAddField('product_card')}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-transform"
            >
              + إضافة كرت منتج فاخر
            </button>
          </div>
        ) : (
          activeScreen.fields.map((field, idx) => {
            const isSelected = selectedFieldId === field.id;
            return (
              <div
                key={field.id}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedFieldId(field.id);
                }}
                className={`relative group rounded-2xl transition-all cursor-pointer ${
                  isSelected 
                    ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-[#080D17] shadow-xl' 
                    : 'hover:ring-1 hover:ring-amber-400/40'
                }`}
              >
                {/* FLOATING ACTION TOOLBAR ON ELEMENT */}
                <div 
                  className={`absolute -top-3.5 left-3 z-30 flex items-center gap-1 bg-[#0A101C] border border-amber-400/60 rounded-xl px-2 py-0.5 shadow-2xl transition-opacity duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  onClick={e => e.stopPropagation()}
                >
                  <span className="text-[9px] font-mono font-black text-amber-400 mr-1">
                    {field.labelAr.slice(0, 14)}...
                  </span>

                  <button
                    disabled={idx === 0}
                    onClick={() => handleMoveField(field.id, 'up')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                    title="تحريك لأعلى"
                  >
                    <MoveUp className="w-3 h-3" />
                  </button>
                  <button
                    disabled={idx === activeScreen.fields.length - 1}
                    onClick={() => handleMoveField(field.id, 'down')}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20"
                    title="تحريك لأسفل"
                  >
                    <MoveDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDuplicateField(field)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    title="تكرار"
                  >
                    <CopyPlus className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setSelectedFieldId(field.id)}
                    className="p-1 rounded hover:bg-slate-800 text-amber-400"
                    title="تعديل الخصائص"
                  >
                    <Settings2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteField(field.id)}
                    className="p-1 rounded hover:bg-rose-900/50 text-rose-400"
                    title="حذف"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* 1. PRODUCT CARD */}
                {field.type === 'product_card' && (
                  <div 
                    className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 shadow-md"
                    style={{ 
                      backgroundColor: project.theme.isDarkMode ? '#0F1826' : '#FFFFFF',
                      borderColor: project.theme.isDarkMode ? '#1E2D42' : '#E2E8F0'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={field.value?.image || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80'} 
                        alt={field.labelAr}
                        className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-black text-white">{field.labelAr}</h4>
                        <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="font-bold">{field.value?.rating || 4.9}</span>
                          <span className="text-slate-400 mr-1">• متبقي {field.value?.stock || 5} قطع</span>
                        </div>
                        <div className="text-xs font-black text-amber-400 font-mono mt-1">
                          {field.value?.price || 380} {project.currencySymbol}
                        </div>
                      </div>
                    </div>

                    <button 
                      className="px-3 py-1.5 rounded-xl text-xs font-black text-slate-950 shadow-md shrink-0"
                      style={{ backgroundColor: project.theme.primaryColor }}
                    >
                      + إضافة
                    </button>
                  </div>
                )}

                {/* 2. COUNTDOWN TIMER */}
                {field.type === 'countdown_timer' && (
                  <div className="p-3.5 rounded-2xl border space-y-2 bg-gradient-to-r from-amber-500/10 via-[#0F1826] to-[#0A101C] border-amber-400/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-[10px] bg-rose-500/20 text-rose-400 font-black px-2 py-0.5 rounded-full">
                        خصم 35%
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center">
                      {[{ val: '04', lbl: 'يوم' }, { val: '18', lbl: 'ساعة' }, { val: '32', lbl: 'دقيقة' }, { val: '45', lbl: 'ثانية' }].map((b, i) => (
                        <div key={i} className="p-1 rounded-lg bg-black/40 border border-white/10">
                          <div className="text-xs font-black font-mono text-white">{b.val}</div>
                          <div className="text-[8px] text-slate-400">{b.lbl}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. B2B WHOLESALE TABLE */}
                {field.type === 'b2b_wholesale_table' && (
                  <div className="p-3 rounded-2xl border border-[#1E2D42] bg-[#0F1826] space-y-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <span className="text-xs font-black text-white">{field.labelAr}</span>
                      <span className="text-[9px] bg-amber-400/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">B2B Tier</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      {[
                        { q: '1 - 5 حبات (تجزئة)', p: 380, s: 'سعر القطاعي' },
                        { q: '6 - 24 حبة (نصف درزن)', p: 320, s: 'وفر 15%' }
                      ].map((t, idx) => (
                        <div key={idx} className="flex justify-between p-1.5 rounded-lg bg-black/20 text-[11px]">
                          <span className="text-white font-bold">{t.q}</span>
                          <span className="text-amber-400 font-mono font-black">{t.p} {project.currencySymbol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. PAYMENT SLOT */}
                {field.type === 'payment_slot' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0B1422] to-[#060B12] border border-amber-400/30 text-white space-y-2">
                    <span className="text-[11px] font-black text-amber-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>الدفع الإلكتروني الفوري (مدى، أبل باي، تمارا)</span>
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-bold">
                      <div className="p-1 rounded bg-white/5 text-emerald-300">مدى</div>
                      <div className="p-1 rounded bg-white/5 text-slate-200">Apple Pay</div>
                      <div className="p-1 rounded bg-white/5 text-amber-300">تمارا</div>
                      <div className="p-1 rounded bg-white/5 text-blue-300">فيزا</div>
                    </div>
                  </div>
                )}

                {/* 5. INVOICE SUMMARY (ZATCA) */}
                {field.type === 'invoice_summary' && (
                  <div className="p-3 rounded-2xl border border-[#1E2D42] bg-[#0F1826] space-y-1.5 text-xs">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1">
                      <span className="font-black text-white text-[11px]">فاتورة ضريبية مبسطة (ZATCA)</span>
                      <span className="text-[9px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-bold">متوافقة 100%</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span>الإجمالي شامل الضريبة ({project.taxRate}%):</span>
                      <span className="text-amber-400 font-mono font-bold">437.00 {project.currencySymbol}</span>
                    </div>
                  </div>
                )}

                {/* 6. BUTTON CTA */}
                {field.type === 'button' && (
                  <button 
                    className="w-full py-2.5 rounded-2xl font-black text-xs text-slate-950 shadow-md flex items-center justify-center gap-1.5"
                    style={{ backgroundColor: project.theme.primaryColor }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{field.labelAr}</span>
                  </button>
                )}

                {/* 7. REVIEWS WALL */}
                {field.type === 'reviews_wall' && (
                  <div className="p-3 rounded-2xl border border-[#1E2D42] bg-[#0F1826] space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-[11px] font-black text-white">
                      <span>{field.labelAr}</span>
                      <span className="text-amber-400 font-bold">⭐ 4.9 (142 تقييم)</span>
                    </div>
                    <p className="text-[10px] text-slate-300 bg-black/20 p-2 rounded-xl">
                      "جودة استثنائية وتغليف فاخر جداً، التوصيل خلال 24 ساعة في الرياض."
                    </p>
                  </div>
                )}

                {/* 8. FAQ ACCORDION */}
                {field.type === 'faq_accordion' && (
                  <div className="p-3 rounded-2xl border border-[#1E2D42] bg-[#0F1826] space-y-1 text-xs">
                    <div className="text-[11px] font-black text-white">{field.labelAr}</div>
                    <div className="p-1.5 rounded-lg bg-black/20 text-[10px] text-slate-300 flex justify-between">
                      <span>كم تستغرق مدة التوصيل؟</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </div>
                )}

                {/* 9. DEBT / CREDIT CARD */}
                {field.type === 'debt_credit_card' && (
                  <div className="p-3 rounded-2xl border border-emerald-500/20 bg-[#0A1718] text-emerald-300 space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span>ميزان الحسابات:</span>
                      <span className="font-mono text-emerald-400 font-black">+24,850 {project.currencySymbol}</span>
                    </div>
                  </div>
                )}

                {/* 10. HEADING */}
                {field.type === 'heading' && (
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-black text-white">{field.labelAr}</h3>
                    {field.placeholderAr && (
                      <p className="text-[11px] text-slate-400">{field.placeholderAr}</p>
                    )}
                  </div>
                )}

                {/* 11. URGENCY & SCARCITY BAR */}
                {field.type === 'urgency_scarcity_bar' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-black/40 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                        <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full">
                        🔥 طلب متكرر
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-300 bg-black/30 p-2 rounded-xl">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-amber-400" />
                        <span>يشاهده الآن <b className="text-white font-mono">{field.value?.viewersCount || 19}</b> شخصاً</span>
                      </span>
                      <span className="text-rose-400 font-black">
                        متبقي {field.value?.remainingStock || 4} قطع بالمخزن فقط!
                      </span>
                    </div>
                  </div>
                )}

                {/* 12. FREE SHIPPING PROGRESS METER */}
                {field.type === 'free_shipping_meter' && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0F1D32] to-[#0A1322] border border-blue-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
                        <Truck className="w-4 h-4 text-blue-400 animate-pulse" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold font-mono">
                        باقي 80 {project.currencySymbol}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: '73%' }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400">
                      <span>السلة الحالية: 220 {project.currencySymbol}</span>
                      <span className="text-amber-400 font-bold">هدف الشحن: 300 {project.currencySymbol}</span>
                    </div>
                  </div>
                )}

                {/* 13. FREQUENTLY BOUGHT TOGETHER (BUNDLES) */}
                {field.type === 'frequently_bought_together' && (
                  <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-amber-400/30 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs">
                        <Layers2 className="w-4 h-4" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full">
                        وفر 120 {project.currencySymbol}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=150&q=80" 
                        alt="Product 1" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                      />
                      <span className="text-amber-400 font-black text-sm">+</span>
                      <img 
                        src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=150&q=80" 
                        alt="Product 2" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                      />
                      <span className="text-amber-400 font-black text-sm">+</span>
                      <img 
                        src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=150&q=80" 
                        alt="Product 3" 
                        className="w-12 h-12 rounded-xl object-cover border border-white/10" 
                      />
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-slate-400">سعر الحزمة الكاملة:</div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-amber-400 font-mono text-xs">760 {project.currencySymbol}</span>
                          <span className="line-through text-slate-500 text-[10px] font-mono">880 {project.currencySymbol}</span>
                        </div>
                      </div>
                      <button 
                        className="px-3 py-1.5 rounded-xl font-black text-[11px] text-slate-950 shadow-md"
                        style={{ backgroundColor: project.theme.primaryColor }}
                      >
                        + إضافة الحزمة كاملة
                      </button>
                    </div>
                  </div>
                )}

                {/* 14. VARIANT SELECTOR (SWATCHES) */}
                {field.type === 'variant_selector' && (
                  <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-white text-[11px]">{field.labelAr}</span>
                      <span className="text-amber-400 text-[10px] font-bold">تولة كاملة (12 مل)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { title: 'تولة كاملة', price: '450', selected: true },
                        { title: 'نصف تولة', price: '260', selected: false },
                        { title: 'ربع تولة', price: '150', selected: false }
                      ].map((v, i) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded-xl border text-center transition-all ${
                            v.selected 
                              ? 'bg-amber-400/10 border-amber-400 text-amber-300 shadow-sm' 
                              : 'bg-black/30 border-white/5 text-slate-400'
                          }`}
                        >
                          <div className="text-[10px] font-bold">{v.title}</div>
                          <div className="text-[9px] font-mono mt-0.5">{v.price} {project.currencySymbol}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 15. TIERED QUANTITY DISCOUNT */}
                {field.type === 'tiered_quantity_discount' && (
                  <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-xs">{field.labelAr}</span>
                      <span className="text-[9px] bg-amber-400/20 text-amber-400 font-bold px-2 py-0.5 rounded-full">
                        وفر أكثر مع الكميات
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { qty: '1 حبة', price: 380, save: 'سعر القطاعي', active: false },
                        { qty: '2 حبة (الأكثر طلباً)', price: 620, save: 'وفر 140 ر.س 🔥', active: true },
                        { qty: '3 حبات (باقة الإهداء)', price: 790, save: 'وفر 350 ر.س 🎁', active: false }
                      ].map((t, i) => (
                        <div 
                          key={i}
                          className={`p-2 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            t.active 
                              ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-md' 
                              : 'bg-black/20 border-white/5 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-amber-400 flex items-center justify-center text-[9px] font-bold">
                              {t.active ? '✓' : ''}
                            </span>
                            <span>{t.qty}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-emerald-400 font-bold">{t.save}</span>
                            <span className="font-mono font-black">{t.price} {project.currencySymbol}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 16. TRUST BADGES */}
                {field.type === 'trust_badges' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-[#0B1526] to-[#080D17] border border-white/10 space-y-2">
                    <div className="text-[11px] font-black text-white">{field.labelAr}</div>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-bold text-white">المركز السعودي للأعمال</div>
                          <div className="text-[8px] text-slate-400">توثيق رسمي ومعتمد</div>
                        </div>
                      </div>
                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <div className="font-bold text-white">الضمان الذهبي سنتين</div>
                          <div className="text-[8px] text-slate-400">استرجاع فوري بدون شروط</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 17. COUPON BOX */}
                {field.type === 'coupon_box' && (
                  <div className="p-3 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <span className="text-xs font-black text-white">{field.labelAr}</span>
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        readOnly 
                        value="RAMADAN2026" 
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-bold text-amber-400 text-center"
                      />
                      <button 
                        className="px-3 py-1.5 rounded-xl font-black text-xs text-slate-950"
                        style={{ backgroundColor: project.theme.primaryColor }}
                      >
                        تطبيق الكود
                      </button>
                    </div>
                  </div>
                )}

                {/* 18. DELIVERY ESTIMATOR */}
                {field.type === 'delivery_estimator' && (
                  <div className="p-3 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-white font-black text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-emerald-400 text-[10px] font-bold">الرياض (غداً 4-8 م)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/20 flex items-center justify-between text-[10px] text-slate-300">
                      <span>خيارات الشحن: سمسا، أرامكس، مندوب خاص</span>
                      <span className="text-amber-400 font-bold">شحن سريع ومبرد ❄️</span>
                    </div>
                  </div>
                )}

                {/* 19. VIDEO REEL CARD */}
                {field.type === 'video_reel_card' && (
                  <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl group">
                    <img 
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" 
                      alt="Reel" 
                      className="w-full h-44 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3">
                      <div className="flex justify-between items-center">
                        <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                          <span>مباشر LIVE</span>
                        </span>
                        <span className="text-[10px] text-white/80 font-mono bg-black/50 px-2 py-0.5 rounded-md">0:45</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-black text-white">شاهد ثبات دهن العود الفاخر بالفيديو</h5>
                          <p className="text-[10px] text-amber-300">معتق 18 عاماً</p>
                        </div>
                        <button 
                          className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                        >
                          <Play className="w-4 h-4 fill-current mr-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 20. BEFORE / AFTER SLIDER */}
                {field.type === 'before_after_slider' && (
                  <div className="p-3 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-white text-[11px]">{field.labelAr}</span>
                      <span className="text-[9px] text-amber-400 font-bold">اسحب للمقارنة</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                      <div className="space-y-1">
                        <img 
                          src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=300&q=80" 
                          alt="Before" 
                          className="w-full h-20 rounded-xl object-cover border border-white/10"
                        />
                        <span className="text-slate-400 font-bold">قبل الاستخدام</span>
                      </div>
                      <div className="space-y-1">
                        <img 
                          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80" 
                          alt="After" 
                          className="w-full h-20 rounded-xl object-cover border border-amber-400/50 ring-2 ring-amber-400/20"
                        />
                        <span className="text-amber-400 font-bold">بعد الاستخدام (ثبات 72 ساعة)</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 21. SPECS TABLE */}
                {field.type === 'specs_table' && (
                  <div className="p-3 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                    <div className="text-xs font-black text-white">{field.labelAr}</div>
                    <div className="divide-y divide-white/5 text-[10px]">
                      {[
                        { k: 'بلد المنشأ', v: 'غابات كلمنتان - إندونيسيا' },
                        { k: 'فترة التعتيق', v: '18 عاماً معتق أصلي' },
                        { k: 'مدة الثبات', v: 'من 48 إلى 72 ساعة' }
                      ].map((s, idx) => (
                        <div key={idx} className="flex justify-between py-1.5">
                          <span className="text-slate-400 font-bold">{s.k}</span>
                          <span className="text-white font-mono">{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 22. LOYALTY REWARDS CARD */}
                {field.type === 'loyalty_rewards_card' && (
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0F1826] to-[#0A101C] border border-amber-400/30 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                        <Coins className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-white">{field.labelAr}</div>
                        <div className="text-[10px] text-slate-400">تكسب <b className="text-amber-400">45 نقطة</b> عند إتمام هذا الطلب</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                      +15 ر.س كاش باك
                    </span>
                  </div>
                )}

                {/* 23. STICKY BUY BAR */}
                {field.type === 'sticky_buy_bar' && (
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-amber-400/40 shadow-2xl flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-300 font-bold">شراء فوري مباشر:</div>
                      <div className="text-xs font-black text-amber-400 font-mono">450 {project.currencySymbol}</div>
                    </div>
                    <button 
                      className="px-4 py-2 rounded-xl font-black text-xs text-slate-950 shadow-lg"
                      style={{ backgroundColor: project.theme.primaryColor }}
                    >
                      ⚡ اطلب الآن
                    </button>
                  </div>
                )}

                {/* 24. PERSONALIZED GIFT UPLOAD */}
                {field.type === 'personalized_gift_upload' && (
                  <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black text-white">
                        <Gift className="w-4 h-4 text-amber-400" />
                        <span>{field.labelAr}</span>
                      </div>
                      <span className="text-[9px] bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                        تغليف مجاني 🎁
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <input 
                        type="text" 
                        placeholder="اسم المهدى إليه (مثال: أخي الغالي محمد)"
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                        readOnly
                      />
                      <input 
                        type="text" 
                        placeholder="عبارة كرت الإهداء المطبوعة..."
                        className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500"
                        readOnly
                      />
                    </div>
                  </div>
                )}

                {/* 25. PRODUCT GRID */}
                {field.type === 'product_grid' && (
                  <div className="space-y-2">
                    <div className="text-xs font-black text-white">{field.labelAr}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { title: 'دهن عود كلمنتان', price: 450, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
                        { title: 'مبخرة كريستال ملكية', price: 280, img: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=300&q=80' }
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-[#0F1826] border border-white/5 space-y-1 text-center">
                          <img src={item.img} alt={item.title} className="w-full h-20 rounded-lg object-cover" />
                          <div className="text-[10px] font-bold text-white truncate">{item.title}</div>
                          <div className="text-[10px] font-mono font-black text-amber-400">{item.price} {project.currencySymbol}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 26. IMAGE BANNER */}
                {field.type === 'image_banner' && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                    <img 
                      src={field.placeholderAr || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=80'} 
                      alt={field.labelAr} 
                      className="w-full h-28 object-cover"
                    />
                  </div>
                )}

              </div>
            );
          })
        )}

        {/* QUICK ADD ELEMENT TRIGGER */}
        <button
          onClick={() => handleAddField('product_card')}
          className="w-full py-2.5 rounded-2xl border border-dashed border-white/20 hover:border-amber-400 text-slate-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 bg-white/[0.02] hover:bg-white/[0.05]"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          <span>إضافة عنصر أو منتج جديد لهذه الشاشة</span>
        </button>

      </div>

      {/* 4. MOBILE BOTTOM HOME BAR & TELEMETRY */}
      <div className="p-3 border-t border-white/5 flex flex-col items-center justify-center gap-1.5 bg-black/40">
        <div className="w-28 h-1 bg-white/20 rounded-full" />
        <div className="flex items-center justify-between w-full px-2 text-[9px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">بناء فوري 0.18s</span>
          </div>
          <span>الخط: {project.theme.fontFamily}</span>
          <span className="text-amber-400 font-bold">{project.taxRate}% ضريبة ({project.currencySymbol})</span>
        </div>
      </div>

    </div>
  );
};
