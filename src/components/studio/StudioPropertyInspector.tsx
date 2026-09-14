import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  CopyPlus, 
  Sparkles, 
  Type, 
  DollarSign, 
  Zap, 
  Layers, 
  MessageSquare, 
  QrCode, 
  CreditCard, 
  Scale, 
  PartyPopper,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Image as ImageIcon,
  Plus,
  Minus,
  Tag,
  FileText
} from 'lucide-react';
import { 
  AppStudioField, 
  NoCodeAppProject, 
  AppStudioScreen 
} from '../../types/appStudio';

const CURATED_IMAGE_PRESETS = [
  { label: 'دهن عود كلمنتان', category: 'oud', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80' },
  { label: 'مبخرة كريستال', category: 'oud', url: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=500&q=80' },
  { label: 'عطر مسك ملكي', category: 'perfume', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=500&q=80' },
  { label: 'بن قهوة إثيوبي', category: 'coffee', url: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80' },
  { label: 'محصول كولومبي', category: 'coffee', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80' },
  { label: 'عباية حرير فاخرة', category: 'fashion', url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=500&q=80' },
  { label: 'ساعة أوتوماتيك', category: 'accessories', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80' },
  { label: 'سماعات Pro', category: 'electronics', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
  { label: 'تمور ملكية فاخرة', category: 'sweets', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80' },
  { label: 'باقة ورود وهدايا', category: 'gifts', url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=500&q=80' }
];

interface StudioPropertyInspectorProps {
  selectedField: AppStudioField | null;
  onClose: () => void;
  onUpdateField: (updated: Partial<AppStudioField>) => void;
  onDeleteField: (id: string) => void;
  onDuplicateField: (field: AppStudioField) => void;
  project: NoCodeAppProject;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const StudioPropertyInspector: React.FC<StudioPropertyInspectorProps> = ({
  selectedField,
  onClose,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  project,
  showToast
}) => {
  const [showImagePicker, setShowImagePicker] = useState(false);
  if (!selectedField) {
    return (
      <div className="flex flex-col h-full bg-[#0A101C] border border-[#1E2E48] rounded-3xl p-6 shadow-2xl items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
          <SlidersHorizontal className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white">مفتش الخصائص (Property Inspector)</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] leading-relaxed">
            حدد أي عنصر في الشاشة أو من شجرة الطبقات لتعديل نصوصه، أسعاره، ألوانه، وإجراءاته التفاعلية.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0A101C] border border-[#1E2E48] rounded-3xl overflow-hidden shadow-2xl">
      
      {/* 1. INSPECTOR HEADER */}
      <div className="p-4 border-b border-[#1E2E48] bg-[#070B13] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-black text-white">خصائص العنصر</h4>
              <span className="text-[9px] bg-amber-400/20 text-amber-400 font-mono font-bold px-1.5 py-0.2 rounded">
                {selectedField.type}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{selectedField.labelAr}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          title="إغلاق المفتش"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. INSPECTOR SECTIONS SCROLLABLE CONTAINER */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {/* SECTION A: CONTENT & LABELS */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            <span>النصوص والعناوين</span>
          </span>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">الاسم / العنوان بالعربية:</label>
              <input
                type="text"
                value={selectedField.labelAr}
                onChange={e => onUpdateField({ labelAr: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">النص التوضيحي (Placeholder):</label>
              <input
                type="text"
                value={selectedField.placeholderAr || ''}
                onChange={e => onUpdateField({ placeholderAr: e.target.value })}
                placeholder="اكتب هنا..."
                className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: PRICING & PRODUCT VALUES */}
        {(selectedField.type === 'product_card' || selectedField.type === 'stat_card' || selectedField.type === 'currency_amount') && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>الأسعار والأرقام ({project.currencySymbol})</span>
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">السعر الحالي:</label>
                <input
                  type="number"
                  value={selectedField.value?.price || selectedField.value || ''}
                  onChange={e => onUpdateField({
                    value: typeof selectedField.value === 'object' 
                      ? { ...selectedField.value, price: parseFloat(e.target.value) || 0 }
                      : parseFloat(e.target.value) || 0
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono font-bold text-amber-400 text-center focus:outline-none focus:border-amber-400"
                />
              </div>

              {typeof selectedField.value === 'object' && (
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">قبل الخصم:</label>
                  <input
                    type="number"
                    value={selectedField.value?.originalPrice || ''}
                    onChange={e => onUpdateField({
                      value: { ...selectedField.value, originalPrice: parseFloat(e.target.value) || 0 }
                    })}
                    placeholder="اختياري"
                    className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-slate-400 text-center focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            {typeof selectedField.value === 'object' && (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">التقييم:</label>
                  <input
                    type="number"
                    step="0.1"
                    max="5.0"
                    value={selectedField.value?.rating || 4.9}
                    onChange={e => onUpdateField({
                      value: { ...selectedField.value, rating: parseFloat(e.target.value) || 5.0 }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-amber-300 text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">المخزون المتبقي:</label>
                  <input
                    type="number"
                    value={selectedField.value?.stock || 10}
                    onChange={e => onUpdateField({
                      value: { ...selectedField.value, stock: parseInt(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-emerald-400 text-center"
                  />
                </div>
              </div>
            )}

            {/* PRODUCT IMAGE SELECTOR & CURATED GALLERY */}
            {typeof selectedField.value === 'object' && (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-amber-400" />
                    <span>صورة المنتج أو العرض:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="text-[9px] text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    {showImagePicker ? 'إخفاء المعرض' : 'تصفح مكتبة الصور'}
                  </button>
                </div>

                <input
                  type="text"
                  value={selectedField.value?.image || ''}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, image: e.target.value }
                  })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-[11px] font-mono text-white focus:outline-none focus:border-amber-400"
                />

                {/* Curated 1-click photos */}
                {showImagePicker && (
                  <div className="grid grid-cols-5 gap-1.5 p-2 rounded-xl bg-[#080D17] border border-white/5 animate-in fade-in duration-150">
                    {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          onUpdateField({
                            value: { ...selectedField.value, image: preset.url }
                          });
                          showToast(`تم اختيار صورة (${preset.label}) 📸`, 'success');
                        }}
                        className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-amber-400 focus:outline-none transition-all"
                        title={preset.label}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label} 
                          className="w-full h-10 object-cover group-hover:scale-110 transition-transform" 
                        />
                        <span className="sr-only">{preset.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SECTION B2: SPECIALIZED COMPONENT PROPERTIES */}
        {selectedField.type === 'free_shipping_meter' && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white block">إعدادات عداد الشحن المجاني</span>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">الحد الأدنى للشحن المجاني ({project.currencySymbol}):</label>
              <input
                type="number"
                value={selectedField.value?.goal || 300}
                onChange={e => onUpdateField({
                  value: { ...selectedField.value, goal: parseInt(e.target.value) || 300 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono font-bold text-amber-400"
              />
            </div>
          </div>
        )}

        {selectedField.type === 'urgency_scarcity_bar' && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white block">إعدادات شريط الإلحاح والطلب المباشر</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">عدد المشاهدين الآن:</label>
                <input
                  type="number"
                  value={selectedField.value?.viewersCount || 19}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, viewersCount: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-amber-300 text-center"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">المتبقي في المستودع:</label>
                <input
                  type="number"
                  value={selectedField.value?.remainingStock || 4}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, remainingStock: parseInt(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-rose-400 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {selectedField.type === 'frequently_bought_together' && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white block">إعدادات الحزمة الترويجية</span>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">مبلغ الخصم عند شراء الحزمة ({project.currencySymbol}):</label>
              <input
                type="number"
                value={selectedField.value?.discountAmount || 120}
                onChange={e => onUpdateField({
                  value: { ...selectedField.value, discountAmount: parseInt(e.target.value) || 0 }
                })}
                className="w-full px-3 py-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono font-bold text-emerald-400"
              />
            </div>
          </div>
        )}

        {selectedField.type === 'coupon_box' && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white block">إعدادات كود الخصم الترويجي</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">كود الخصم الافتراضي:</label>
                <input
                  type="text"
                  value={selectedField.value?.defaultCode || 'RAMADAN2026'}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, defaultCode: e.target.value }
                  })}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-amber-400 text-center uppercase"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">نسبة الخصم %:</label>
                <input
                  type="number"
                  value={selectedField.value?.discountPercent || 15}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, discountPercent: parseInt(e.target.value) || 10 }
                  })}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-emerald-400 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {selectedField.type === 'loyalty_rewards_card' && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
            <span className="text-xs font-black text-white block">إعدادات برنامج الولاء والنقاط</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">النقاط المكتسبة:</label>
                <input
                  type="number"
                  value={selectedField.value?.pointsEarned || 45}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, pointsEarned: parseInt(e.target.value) || 10 }
                  })}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-amber-300 text-center"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">قيمة الكاش باك ({project.currencySymbol}):</label>
                <input
                  type="number"
                  value={selectedField.value?.cashback || 15}
                  onChange={e => onUpdateField({
                    value: { ...selectedField.value, cashback: parseInt(e.target.value) || 5 }
                  })}
                  className="w-full px-2 py-1.5 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs font-mono text-emerald-400 text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* SECTION C: ACTION TRIGGERS & WORKFLOWS */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>محفز الإجراء التفاعلي</span>
            </span>
            <span className="text-[9px] bg-amber-400/10 text-amber-400 font-bold px-2 py-0.5 rounded-full">
              عند النقر
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'tamara', label: 'حاسبة وبوابة تقسيط تمارا (4 دفعات)', icon: CreditCard, color: 'text-amber-400' },
              { id: 'whatsapp', label: 'فتح محادثة واتساب مع تفاصيل مجهزة', icon: MessageSquare, color: 'text-emerald-400' },
              { id: 'zatca_qr', label: 'إنشاء وفحص فاتورة ضريبية ZATCA Phase 2', icon: QrCode, color: 'text-emerald-400' },
              { id: 'ledger_entry', label: 'ترحيل قيد في السجل المالي والمحاسبي', icon: Scale, color: 'text-blue-400' },
              { id: 'confetti', label: 'إطلاق تأثير احتفالي وإشعار نجاح', icon: PartyPopper, color: 'text-purple-400' },
              { id: 'navigate', label: 'الانتقال لشاشة أخرى داخل التطبيق', icon: ArrowRight, color: 'text-indigo-400' }
            ].map(trig => (
              <button
                key={trig.id}
                type="button"
                onClick={() => {
                  onUpdateField({
                    actionTrigger: {
                      type: trig.id as any,
                      targetScreenId: trig.id === 'navigate' ? project.screens[0]?.id : undefined,
                      payload: trig.id === 'whatsapp' ? { message: `مرحباً، أود طلب (${selectedField.labelAr})` } : undefined
                    }
                  });
                  showToast(`تم ضبط محفز (${trig.label}) بنجاح ⚡`, 'success');
                }}
                className={`w-full text-right p-2 rounded-xl border text-xs flex items-center justify-between transition-all ${
                  selectedField.actionTrigger?.type === trig.id
                    ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                    : 'bg-[#080D17] border-[#1E2E48] text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <trig.icon className={`w-3.5 h-3.5 ${trig.color}`} />
                  <span className="text-[11px]">{trig.label}</span>
                </div>
                {selectedField.actionTrigger?.type === trig.id && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* If navigate is chosen, show target screen selector */}
          {selectedField.actionTrigger?.type === 'navigate' && (
            <div className="pt-2 border-t border-white/5 space-y-1">
              <label className="text-[10px] text-slate-400 block">اختر الشاشة المستهدفة للانتقال:</label>
              <select
                value={selectedField.actionTrigger?.targetScreenId || project.screens[0]?.id}
                onChange={e => onUpdateField({
                  actionTrigger: {
                    ...selectedField.actionTrigger,
                    type: 'navigate',
                    targetScreenId: e.target.value
                  }
                })}
                className="w-full p-2 rounded-xl bg-[#080D17] border border-[#1E2E48] text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {project.screens.map(s => (
                  <option key={s.id} value={s.id}>{s.titleAr} ({s.slug})</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* SECTION D: STYLING & SHADOWS */}
        <div className="space-y-3 p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48]">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>المظهر والظلال والتوهج</span>
          </span>

          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'none', label: 'بدون' },
              { id: 'soft', label: 'ناعم' },
              { id: 'strong', label: 'بارز' },
              { id: 'glow', label: 'توهج ملكي ✨' }
            ].map(sh => (
              <button
                key={sh.id}
                type="button"
                onClick={() => onUpdateField({
                  styling: { ...selectedField.styling, shadow: sh.id as any }
                })}
                className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                  (selectedField.styling?.shadow || 'none') === sh.id
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-black'
                    : 'bg-[#080D17] text-slate-400 border-[#1E2E48] hover:text-white'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION E: QUICK ACTIONS (DUPLICATE & DELETE) */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onDuplicateField(selectedField)}
            className="flex-1 py-2.5 rounded-xl bg-[#10192B] hover:bg-[#18263F] border border-[#1E2E48] text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <CopyPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>تكرار العنصر</span>
          </button>

          <button
            onClick={() => onDeleteField(selectedField.id)}
            className="py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف</span>
          </button>
        </div>

      </div>

    </div>
  );
};
