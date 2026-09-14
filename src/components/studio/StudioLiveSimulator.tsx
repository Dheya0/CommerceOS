import React, { useState } from 'react';
import { 
  ShoppingBag, 
  CreditCard, 
  ArrowRight, 
  Sparkles, 
  Scale, 
  Receipt, 
  QrCode, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Star, 
  Plus, 
  Clock, 
  Package, 
  Type, 
  HelpCircle, 
  ChevronDown,
  MessageSquare,
  PartyPopper,
  CheckCircle2,
  Eye,
  RefreshCw,
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
  Pause,
  Check,
  Tag,
  Volume2
} from 'lucide-react';
import { 
  NoCodeAppProject, 
  AppStudioScreen, 
  AppStudioField 
} from '../../types/appStudio';

interface StudioLiveSimulatorProps {
  project: NoCodeAppProject;
  activeScreen: AppStudioScreen;
  onNavigateScreen: (screenId: string) => void;
  onOpenTamaraModal: () => void;
  onOpenZatcaModal: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const StudioLiveSimulator: React.FC<StudioLiveSimulatorProps> = ({
  project,
  activeScreen,
  onNavigateScreen,
  onOpenTamaraModal,
  onOpenZatcaModal,
  showToast
}) => {
  const [simulatedCartCount, setSimulatedCartCount] = useState(2);
  const [simulatedCartTotal, setSimulatedCartTotal] = useState(760);
  const [activeTab, setActiveTab] = useState('home');
  const [couponInput, setCouponInput] = useState('RAMADAN2026');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState('v1');
  const [selectedQuantityTier, setSelectedQuantityTier] = useState(2);
  const [bundleItemsSelected, setBundleItemsSelected] = useState<Record<string, boolean>>({ b1: true, b2: true });
  const [beforeAfterPos, setBeforeAfterPos] = useState(50);
  const [selectedCity, setSelectedCity] = useState('الرياض');
  const [isPlayingReel, setIsPlayingReel] = useState(false);
  const [giftRecipient, setGiftRecipient] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [engravingText, setEngravingText] = useState('');

  const freeShippingThreshold = 300;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - simulatedCartTotal);
  const shippingPercent = Math.min(100, Math.round((simulatedCartTotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = () => {
    if (discountApplied) {
      showToast('كود الخصم مفعل مسبقاً! 🎉', 'info');
      return;
    }
    const clean = couponInput.trim().toUpperCase();
    if (clean === 'RAMADAN2026' || clean === 'SAVE15' || clean === 'PROMO10') {
      const discount = simulatedCartTotal * 0.15;
      setSimulatedCartTotal(t => Math.max(0, t - discount));
      setDiscountApplied(true);
      showToast(`🎉 مبروك! تم تطبيق كود الخصم (${clean}) وخصم 15% بنجاح!`, 'success');
    } else {
      showToast('⚠️ كود الخصم غير صالح أو منتهي الصلاحية', 'error');
    }
  };

  const handleFieldAction = (field: AppStudioField) => {
    const trigger = field.actionTrigger?.type;
    if (trigger === 'tamara' || trigger === 'tabby') {
      onOpenTamaraModal();
    } else if (trigger === 'zatca_qr' || trigger === 'print_zatca') {
      onOpenZatcaModal();
    } else if (trigger === 'whatsapp') {
      const msg = encodeURIComponent(field.actionTrigger?.payload?.message || `مرحباً، أود الاستفسار بخصوص ${field.labelAr}`);
      showToast(`💬 محاكاة: فتح محادثة الواتساب مع العميل بنص الطلب المجهز!`, 'success');
    } else if (trigger === 'navigate') {
      const targetId = field.actionTrigger?.payload?.targetScreenId;
      if (targetId) {
        onNavigateScreen(targetId);
        showToast(`📱 تم الانتقال إلى الشاشة المطلوبة بنجاح`, 'info');
      }
    } else if (trigger === 'ledger_entry') {
      showToast('💰 تم ترحيل قيد مالي مباشر في السجل بنجاح ✅', 'success');
    } else if (trigger === 'confetti') {
      showToast('🎉 تهانينا! تم إتمام العملية بنجاح!', 'success');
    } else {
      if (field.type === 'payment_slot' || field.type === 'sticky_buy_bar') {
        onOpenTamaraModal();
      } else if (field.type === 'invoice_summary') {
        onOpenZatcaModal();
      } else {
        showToast(`⚡ تم تنفيذ الإجراء التفاعلي للعنصر: ${field.labelAr}`, 'info');
      }
    }
  };

  return (
    <div 
      className="w-full flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300"
      style={{ 
        backgroundColor: project.theme.backgroundColor,
        color: project.theme.textColor,
        fontFamily: project.theme.fontFamily
      }}
    >
      
      {/* 1. APP HEADER & CART FLOATING BADGE */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md sticky top-0 z-30">
        <div>
          <h3 className="text-sm font-black text-white">{project.nameAr}</h3>
          <p className="text-[10px] text-slate-400">{activeScreen.titleAr}</p>
        </div>

        <div className="flex items-center gap-2">
          {project.screens.length > 1 && (
            <select
              value={activeScreen.id}
              onChange={e => onNavigateScreen(e.target.value)}
              className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-bold text-white focus:outline-none"
            >
              {project.screens.map(s => (
                <option key={s.id} value={s.id}>{s.titleAr}</option>
              ))}
            </select>
          )}

          <div 
            onClick={() => {
              showToast(`سلة التسوق: ${simulatedCartCount} منتجات بإجمالي ${simulatedCartTotal.toFixed(2)} ${project.currencySymbol}`, 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md active:scale-95 transition-transform"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="font-mono">{simulatedCartCount}</span>
          </div>
        </div>
      </div>

      {/* 2. SCREEN FIELDS STREAM */}
      <div className="p-4 space-y-4 max-h-[620px] overflow-y-auto">
        {activeScreen.fields.map(field => {
          return (
            <div key={field.id} className="transition-all">
              
              {/* HEADING */}
              {field.type === 'heading' && (
                <div className="space-y-1">
                  <h3 className="text-base font-black text-white">{field.labelAr}</h3>
                  {field.placeholderAr && (
                    <p className="text-xs text-slate-400 leading-relaxed">{field.placeholderAr}</p>
                  )}
                </div>
              )}

              {/* PRODUCT CARD */}
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
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-black text-white line-clamp-1">{field.labelAr}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-black text-amber-400 font-mono">
                          {field.value?.price || 380} {project.currencySymbol}
                        </span>
                        {field.value?.originalPrice && (
                          <span className="text-[10px] line-through text-slate-500 font-mono">
                            {field.value.originalPrice} {project.currencySymbol}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="font-bold">{field.value?.rating || 4.9}</span>
                        <span className="text-slate-400 mr-1">• متبقي {field.value?.stock || 5} قطع</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSimulatedCartCount(c => c + 1);
                      setSimulatedCartTotal(t => t + (field.value?.price || 380));
                      showToast(`تمت إضافة (${field.labelAr}) لسلة الشراء بنجاح 🛍️`, 'success');
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-black text-slate-950 shadow-md active:scale-95 transition-transform shrink-0"
                    style={{ backgroundColor: project.theme.primaryColor }}
                  >
                    + إضافة
                  </button>
                </div>
              )}

              {/* COUNTDOWN TIMER */}
              {field.type === 'countdown_timer' && (
                <div 
                  onClick={() => handleFieldAction(field)}
                  className="p-3.5 rounded-2xl border space-y-2 bg-gradient-to-r from-amber-500/15 via-[#0F1826] to-[#0A101C] border-amber-400/40 cursor-pointer shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs">
                      <Clock className="w-4 h-4 animate-pulse" />
                      <span>{field.labelAr || 'عروض وتخفيضات رمضان الحصرية'}</span>
                    </div>
                    <span className="text-[10px] bg-rose-500/20 text-rose-400 font-black px-2 py-0.5 rounded-full">
                      خصم {field.value?.discountPercent || 35}%
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {[
                      { val: '04', label: 'يوم' },
                      { val: '18', label: 'ساعة' },
                      { val: '32', label: 'دقيقة' },
                      { val: '45', label: 'ثانية' }
                    ].map((box, bIdx) => (
                      <div key={bIdx} className="p-1.5 rounded-xl bg-black/40 border border-white/10">
                        <div className="text-sm font-black font-mono text-white">{box.val}</div>
                        <div className="text-[9px] text-slate-400">{box.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* B2B WHOLESALE TABLE */}
              {field.type === 'b2b_wholesale_table' && (
                <div 
                  className="p-3.5 rounded-2xl border space-y-2 shadow-sm"
                  style={{ 
                    backgroundColor: project.theme.isDarkMode ? '#0F1826' : '#FFFFFF',
                    borderColor: project.theme.isDarkMode ? '#1E2D42' : '#E2E8F0'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white">{field.labelAr}</span>
                    </div>
                    <span className="text-[9px] bg-amber-400/20 text-amber-400 font-bold px-2 py-0.5 rounded-md">
                      B2B
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {(field.value?.tiers || [
                      { qty: '1 - 5 حبات (تجزئة)', price: 380, saving: 'سعر القطاعي' },
                      { qty: '6 - 24 حبة (نصف درزن)', price: 320, saving: 'وفر 15%' },
                      { qty: '25+ حبة (كرتون جملة)', price: 270, saving: 'وفر 29%' }
                    ]).map((tier: any, tIdx: number) => (
                      <div key={tIdx} className={`flex items-center justify-between p-2 rounded-xl ${tIdx === 1 ? 'bg-amber-500/10 border border-amber-400/30' : 'bg-black/20'}`}>
                        <div>
                          <div className="font-bold text-white text-[11px]">{tier.qty}</div>
                          <div className="text-[9px] text-amber-400 font-bold">{tier.saving}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-white text-xs">{tier.price} {project.currencySymbol}</span>
                          <span className="text-[9px] text-slate-400 block">/ للقطعة</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PAYMENT SLOT */}
              {field.type === 'payment_slot' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1422] to-[#060B12] border border-amber-400/40 text-white space-y-2.5 shadow-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>الدفع الفوري والآمن (256-bit SSL)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-emerald-300">💳 مدى</div>
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200">Apple Pay</div>
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-amber-300">تمارا / تابي</div>
                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-blue-300">فيزا / ماستر</div>
                  </div>

                  <button 
                    onClick={() => handleFieldAction(field)}
                    className="w-full py-2.5 rounded-xl text-xs font-black text-slate-950 shadow-lg transition-transform active:scale-95"
                    style={{ backgroundColor: project.theme.primaryColor }}
                  >
                    إتمام الدفع الفوري الآمن
                  </button>
                </div>
              )}

              {/* ZATCA INVOICE SUMMARY */}
              {field.type === 'invoice_summary' && (
                <div 
                  onClick={() => onOpenZatcaModal()}
                  className="p-3.5 rounded-2xl border space-y-2 shadow-md cursor-pointer hover:border-amber-400/50 transition-colors"
                  style={{ 
                    backgroundColor: project.theme.isDarkMode ? '#0F1826' : '#FFFFFF',
                    borderColor: project.theme.isDarkMode ? '#1E2D42' : '#E2E8F0'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white">فاتورة ضريبية مبسطة (ZATCA)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                      متوافقة 100%
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>المبلغ الخاضع للضريبة:</span>
                      <span className="font-mono font-bold">{simulatedCartTotal.toFixed(2)} {project.currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ضريبة القيمة المضافة ({project.taxRate}%):</span>
                      <span className="font-mono font-bold">{((simulatedCartTotal * project.taxRate) / 100).toFixed(2)} {project.currencySymbol}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-white/10 font-black text-amber-400">
                      <span>المجموع الإجمالي:</span>
                      <span className="font-mono">{(simulatedCartTotal + (simulatedCartTotal * project.taxRate) / 100).toFixed(2)} {project.currencySymbol}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SMART CTA BUTTON */}
              {field.type === 'button' && (
                <button
                  onClick={() => handleFieldAction(field)}
                  className="w-full py-3 rounded-2xl font-black text-xs text-slate-950 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
                  style={{ backgroundColor: project.theme.primaryColor }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{field.labelAr}</span>
                </button>
              )}

              {/* DEBT / CREDIT FINTECH CARD */}
              {field.type === 'debt_credit_card' && (
                <div 
                  className="p-4 rounded-2xl border shadow-md space-y-3"
                  style={{ 
                    backgroundColor: project.theme.isDarkMode ? '#0A1718' : '#F0FDF4',
                    borderColor: project.theme.isDarkMode ? '#133535' : '#BBF7D0'
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black flex items-center gap-1 text-emerald-400">
                      <Scale className="w-4 h-4" />
                      <span>ميزان الحسابات (صافي المستحقات)</span>
                    </span>
                    <span className="font-mono text-emerald-400 font-black">+24,850 {project.currencySymbol}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                      <div className="text-[10px] flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                        <span>لنا (دائن / مستحقات):</span>
                      </div>
                      <div className="text-sm font-black mt-1 font-mono">+32,100 {project.currencySymbol}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                      <div className="text-[10px] flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-400" />
                        <span>علينا (مدين / التزامات):</span>
                      </div>
                      <div className="text-sm font-black mt-1 font-mono">-7,250 {project.currencySymbol}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* REVIEWS WALL */}
              {field.type === 'reviews_wall' && (
                <div 
                  className="p-3.5 rounded-2xl border space-y-2 shadow-sm"
                  style={{ 
                    backgroundColor: project.theme.isDarkMode ? '#0F1826' : '#FFFFFF',
                    borderColor: project.theme.isDarkMode ? '#1E2D42' : '#E2E8F0'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-white">{field.labelAr}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-black">4.9 / 5.0 (142 تقييم)</span>
                  </div>

                  <div className="space-y-1.5">
                    {(field.value?.reviews || [
                      { name: 'د. خالد التميمي', text: 'جودة استثنائية وتغليف فاخر جداً، التوصيل خلال 24 ساعة في الرياض.', city: 'الرياض' },
                      { name: 'أ / سارة الغامدي', text: 'النقش بالليزر تحفة فنية، شكراً لكم.', city: 'جدة' }
                    ]).map((rev: any, rIdx: number) => (
                      <div key={rIdx} className="p-2 rounded-xl bg-black/20 text-xs">
                        <div className="flex justify-between text-[11px] font-bold text-white">
                          <span>{rev.name}</span>
                          <span className="text-[9px] text-slate-400">{rev.city} • موثق ✅</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ ACCORDION */}
              {field.type === 'faq_accordion' && (
                <div 
                  className="p-3.5 rounded-2xl border space-y-2 shadow-sm"
                  style={{ 
                    backgroundColor: project.theme.isDarkMode ? '#0F1826' : '#FFFFFF',
                    borderColor: project.theme.isDarkMode ? '#1E2D42' : '#E2E8F0'
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <div className="flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-black text-white">{field.labelAr}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {(field.value?.items || [
                      { q: 'كم تستغرق مدة التوصيل؟', a: 'يتم التوصيل خلال 24-48 ساعة داخل المملكة.' },
                      { q: 'هل يشمل المنتج ضمان ذهبي؟', a: 'نعم، ضمان استبدال واسترجاع فوري لمدة سنتين كاملتين.' }
                    ]).map((faq: any, fIdx: number) => (
                      <details key={fIdx} className="p-2.5 rounded-xl bg-black/20 group">
                        <summary className="font-bold text-white text-[11px] cursor-pointer flex items-center justify-between list-none">
                          <span>{faq.q}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="text-[10px] text-slate-300 mt-2 pt-2 border-t border-white/5 leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {/* URGENCY & SCARCITY BAR */}
              {field.type === 'urgency_scarcity_bar' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-black/40 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-rose-400 font-black text-[11px]">
                      <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                      <span>{field.labelAr}</span>
                    </div>
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-full animate-pulse">
                      🔥 إقبال عالي جداً
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-300 bg-black/40 p-2.5 rounded-xl">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>يشاهد هذا المنتج الآن <b className="text-white font-mono">{field.value?.viewersCount || 19}</b> عميلاً</span>
                    </span>
                    <span className="text-rose-400 font-black">
                      متبقي {field.value?.remainingStock || 4} حبات فقط!
                    </span>
                  </div>
                </div>
              )}

              {/* FREE SHIPPING PROGRESS METER */}
              {field.type === 'free_shipping_meter' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#0F1D32] to-[#0A1322] border border-blue-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
                      <Truck className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span>{field.labelAr}</span>
                    </div>
                    {remainingForFreeShipping > 0 ? (
                      <span className="text-[10px] text-amber-400 font-black font-mono">
                        أضف {remainingForFreeShipping.toFixed(0)} {project.currencySymbol} للشحن المجاني!
                      </span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-black flex items-center gap-1">
                        <Check className="w-3 h-3" /> مبروك! مؤهل للشحن المجاني 🎁
                      </span>
                    )}
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${shippingPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>السلة الحالية: {simulatedCartTotal.toFixed(0)} {project.currencySymbol}</span>
                    <span className="text-amber-400 font-bold">هدف الشحن: {freeShippingThreshold} {project.currencySymbol}</span>
                  </div>
                </div>
              )}

              {/* FREQUENTLY BOUGHT TOGETHER (BUNDLES) */}
              {field.type === 'frequently_bought_together' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-amber-400/30 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <div className="flex items-center gap-1.5 text-amber-400 font-black text-xs">
                      <Layers2 className="w-4 h-4" />
                      <span>{field.labelAr}</span>
                    </div>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-black px-2 py-0.5 rounded-full">
                      وفر {field.value?.discountAmount || 120} {project.currencySymbol}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-black/20">
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=100&q=80" 
                          alt="Main" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-white text-[11px]">دهن عود كلمنتان مالينو (المنتج الأساسي)</div>
                          <div className="text-[10px] text-amber-400 font-mono">450 {project.currencySymbol}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">محدد دائماً</span>
                    </div>

                    <div 
                      onClick={() => setBundleItemsSelected(b => ({ ...b, b1: !b.b1 }))}
                      className={`flex items-center justify-between text-xs p-2 rounded-xl cursor-pointer transition-all ${
                        bundleItemsSelected.b1 ? 'bg-amber-400/10 border border-amber-400/40' : 'bg-black/20 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={bundleItemsSelected.b1} readOnly className="rounded text-amber-400" />
                        <img 
                          src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=100&q=80" 
                          alt="Bundle 1" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-white text-[11px]">مبخرة كريستال فاخرة</div>
                          <div className="text-[10px] text-slate-400 font-mono">280 {project.currencySymbol}</div>
                        </div>
                      </div>
                      <span className="text-amber-400 font-bold text-[10px]">+280 {project.currencySymbol}</span>
                    </div>

                    <div 
                      onClick={() => setBundleItemsSelected(b => ({ ...b, b2: !b.b2 }))}
                      className={`flex items-center justify-between text-xs p-2 rounded-xl cursor-pointer transition-all ${
                        bundleItemsSelected.b2 ? 'bg-amber-400/10 border border-amber-400/40' : 'bg-black/20 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={bundleItemsSelected.b2} readOnly className="rounded text-amber-400" />
                        <img 
                          src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=100&q=80" 
                          alt="Bundle 2" 
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-bold text-white text-[11px]">مسك الطهارة المعتق</div>
                          <div className="text-[10px] text-slate-400 font-mono">150 {project.currencySymbol}</div>
                        </div>
                      </div>
                      <span className="text-amber-400 font-bold text-[10px]">+150 {project.currencySymbol}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400">إجمالي الحزمة بعد الخصم:</div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-400 font-mono text-sm">
                          {(450 + (bundleItemsSelected.b1 ? 280 : 0) + (bundleItemsSelected.b2 ? 150 : 0) - (bundleItemsSelected.b1 && bundleItemsSelected.b2 ? 120 : 0))} {project.currencySymbol}
                        </span>
                        {bundleItemsSelected.b1 && bundleItemsSelected.b2 && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded">
                            خصم 120 ر.س
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        const bundleTotal = 450 + (bundleItemsSelected.b1 ? 280 : 0) + (bundleItemsSelected.b2 ? 150 : 0) - (bundleItemsSelected.b1 && bundleItemsSelected.b2 ? 120 : 0);
                        setSimulatedCartCount(c => c + 3);
                        setSimulatedCartTotal(t => t + bundleTotal);
                        showToast('تمت إضافة الحزمة الملكية كاملة إلى السلة بضغطة واحدة! 🎁', 'success');
                      }}
                      className="px-3 py-2 rounded-xl font-black text-xs text-slate-950 shadow-lg active:scale-95 transition-transform"
                      style={{ backgroundColor: project.theme.primaryColor }}
                    >
                      + إضافة الحزمة للسلة
                    </button>
                  </div>
                </div>
              )}

              {/* VARIANT SELECTOR (SWATCHES) */}
              {field.type === 'variant_selector' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white text-[11px]">{field.labelAr}</span>
                    <span className="text-amber-400 text-[10px] font-bold">
                      {selectedVariantId === 'v1' ? 'تولة كاملة (12 مل)' : selectedVariantId === 'v2' ? 'نصف تولة (6 مل)' : 'ربع تولة (3 مل)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'v1', title: 'تولة كاملة (12 مل)', price: 450, stock: 8 },
                      { id: 'v2', title: 'نصف تولة (6 مل)', price: 260, stock: 14 },
                      { id: 'v3', title: 'ربع تولة (3 مل)', price: 150, stock: 22 }
                    ].map(v => (
                      <button 
                        key={v.id}
                        onClick={() => {
                          setSelectedVariantId(v.id);
                          showToast(`تم اختيار المقاس: ${v.title} بسعر ${v.price} ${project.currencySymbol}`, 'info');
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedVariantId === v.id
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold shadow-md scale-105'
                            : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px]">{v.title}</div>
                        <div className="text-[10px] font-mono font-black mt-1 text-amber-400">{v.price} {project.currencySymbol}</div>
                        <div className="text-[8px] text-slate-500 mt-0.5">متبقي {v.stock}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TIERED QUANTITY DISCOUNT */}
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
                      { qty: 1, title: 'قطعة واحدة', price: 380, saving: 'سعر القطاعي', pop: false },
                      { qty: 2, title: 'قطعتين (الأكثر طلباً)', price: 620, saving: 'وفر 140 ر.س 🔥', pop: true },
                      { qty: 3, title: '3 قطع (باقة الإهداء)', price: 790, saving: 'وفر 350 ر.س 🎁', pop: false }
                    ].map(t => (
                      <div 
                        key={t.qty}
                        onClick={() => {
                          setSelectedQuantityTier(t.qty);
                          showToast(`تم اختيار باقة ${t.title} بنجاح!`, 'success');
                        }}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                          selectedQuantityTier === t.qty
                            ? 'bg-amber-400/15 border-amber-400 text-amber-300 font-bold shadow-md'
                            : 'bg-black/20 border-white/5 text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            selectedQuantityTier === t.qty ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-500'
                          }`}>
                            {selectedQuantityTier === t.qty ? '✓' : ''}
                          </span>
                          <span>{t.title}</span>
                          {t.pop && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded font-bold">الأكثر مبيعاً</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-emerald-400 font-bold">{t.saving}</span>
                          <span className="font-mono font-black">{t.price} {project.currencySymbol}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TRUST BADGES */}
              {field.type === 'trust_badges' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0B1526] to-[#080D17] border border-white/10 space-y-2">
                  <div className="text-[11px] font-black text-white">{field.labelAr}</div>
                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">المركز السعودي للأعمال</div>
                        <div className="text-[8px] text-slate-400">سجل تجاري موثق 100%</div>
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="font-bold text-white">الضمان الذهبي سنتين</div>
                        <div className="text-[8px] text-slate-400">استرجاع فوري بدون شروط</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COUPON BOX */}
              {field.type === 'coupon_box' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                  <span className="text-xs font-black text-white">{field.labelAr}</span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value)}
                      placeholder="أدخل كود الخصم (مثال: RAMADAN2026)"
                      className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono font-bold text-amber-400 text-center focus:outline-none focus:border-amber-400"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl font-black text-xs text-slate-950 shadow-md active:scale-95 transition-transform"
                      style={{ backgroundColor: project.theme.primaryColor }}
                    >
                      {discountApplied ? 'تم التفعيل ✓' : 'تطبيق'}
                    </button>
                  </div>
                  {discountApplied && (
                    <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم خصم 15% من إجمالي السلة!</span>
                    </div>
                  )}
                </div>
              )}

              {/* DELIVERY ESTIMATOR */}
              {field.type === 'delivery_estimator' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-white font-black text-[11px]">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span>{field.labelAr}</span>
                    </div>
                    <select 
                      value={selectedCity}
                      onChange={e => {
                        setSelectedCity(e.target.value);
                        showToast(`تم حساب موعد التوصيل لمدينة (${e.target.value})`, 'info');
                      }}
                      className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-bold text-amber-400 focus:outline-none"
                    >
                      <option value="الرياض">الرياض</option>
                      <option value="جدة">جدة</option>
                      <option value="الدمام">الدمام والخبر</option>
                      <option value="مكة المكرمة">مكة المكرمة</option>
                      <option value="المدينة المنورة">المدينة المنورة</option>
                    </select>
                  </div>

                  <div className="p-2.5 rounded-xl bg-black/30 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300">
                      موعد الوصول المتوقع: <b className="text-emerald-400 font-bold">{selectedCity === 'الرياض' ? 'غداً بين 4 - 8 م' : 'خلال 48 ساعة'}</b>
                    </span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">شحن سريع ⚡</span>
                  </div>
                </div>
              )}

              {/* VIDEO REEL CARD */}
              {field.type === 'video_reel_card' && (
                <div className="relative rounded-2xl overflow-hidden border border-amber-400/30 shadow-xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" 
                    alt="Reel" 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex justify-between items-center">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] flex items-center gap-1.5 shadow-md">
                        <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                        <span>مباشر LIVE REEL</span>
                      </span>
                      <span className="text-[10px] text-white font-mono bg-black/60 px-2 py-0.5 rounded-md">0:45</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-black text-white">شاهد فخامة دهن العود وثباته بالفيديو</h5>
                        <p className="text-[10px] text-amber-300">معتق 18 عاماً</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setIsPlayingReel(p => !p);
                            showToast(isPlayingReel ? 'تم إيقاف الفيديو' : 'جاري تشغيل فيديو التجربة الحية 🎬', 'info');
                          }}
                          className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                        >
                          {isPlayingReel ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current mr-0.5" />}
                        </button>
                        <button 
                          onClick={() => {
                            setSimulatedCartCount(c => c + 1);
                            setSimulatedCartTotal(t => t + 450);
                            showToast('تمت إضافة المنتج مباشرة من الفيديو إلى السلة! ⚡', 'success');
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-[10px] shadow-lg active:scale-95"
                        >
                          شراء الآن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BEFORE / AFTER SLIDER */}
              {field.type === 'before_after_slider' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-white text-[11px]">{field.labelAr}</span>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">مقارنة بصرية تفاعلية</span>
                  </div>

                  <div className="relative h-36 rounded-xl overflow-hidden border border-white/10 select-none">
                    <img 
                      src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80" 
                      alt="After" 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div 
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${beforeAfterPos}%` }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=600&q=80" 
                        alt="Before" 
                        className="w-full h-full object-cover"
                        style={{ width: '100%' }}
                      />
                    </div>
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-xl"
                      style={{ left: `${beforeAfterPos}%` }}
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                      بعد الاستخدام
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                      قبل الاستخدام
                    </div>
                  </div>

                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={beforeAfterPos}
                    onChange={e => setBeforeAfterPos(parseInt(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>
              )}

              {/* SPECS TABLE */}
              {field.type === 'specs_table' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                  <div className="text-xs font-black text-white">{field.labelAr}</div>
                  <div className="divide-y divide-white/5 text-[11px]">
                    {[
                      { k: 'بلد المنشأ', v: 'غابات كلمنتان - إندونيسيا' },
                      { k: 'فترة التعتيق', v: '18 عاماً معتق أصلي' },
                      { k: 'درجة الثبات', v: 'من 48 إلى 72 ساعة على القماش' },
                      { k: 'درجة الفوحان', v: 'انتشار استثنائي وفواح' },
                      { k: 'شهادة الأصالة', v: 'مفحوص وموثق لدى مختبرات الجودة' }
                    ].map((s, idx) => (
                      <div key={idx} className="flex justify-between py-2">
                        <span className="text-slate-400 font-bold">{s.k}</span>
                        <span className="text-white font-mono">{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* LOYALTY REWARDS CARD */}
              {field.type === 'loyalty_rewards_card' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0F1826] to-[#0A101C] border border-amber-400/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">{field.labelAr}</div>
                      <div className="text-[10px] text-slate-400">تكسب <b className="text-amber-400">45 نقطة</b> عند إتمام هذا الطلب</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                    +15 ر.س كاش باك
                  </span>
                </div>
              )}

              {/* STICKY BUY BAR */}
              {field.type === 'sticky_buy_bar' && (
                <div className="p-3 rounded-2xl bg-slate-900 border border-amber-400/50 shadow-2xl flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-300 font-bold">شراء فوري مباشر:</div>
                    <div className="text-xs font-black text-amber-400 font-mono">450 {project.currencySymbol}</div>
                    <div className="text-[9px] text-slate-400">أو 4 دفعات بقيمة 112.5 ر.س مع تمارا</div>
                  </div>
                  <button 
                    onClick={() => onOpenTamaraModal()}
                    className="px-4 py-2 rounded-xl font-black text-xs text-slate-950 shadow-lg active:scale-95 transition-transform"
                    style={{ backgroundColor: project.theme.primaryColor }}
                  >
                    ⚡ اطلب وقسّط الآن
                  </button>
                </div>
              )}

              {/* PERSONALIZED GIFT UPLOAD */}
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
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={giftRecipient}
                      onChange={e => setGiftRecipient(e.target.value)}
                      placeholder="اسم المهدى إليه (مثال: أخي الغالي محمد)"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input 
                      type="text" 
                      value={giftMessage}
                      onChange={e => setGiftMessage(e.target.value)}
                      placeholder="عبارة كرت الإهداء المطبوعة..."
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* CUSTOM ENGRAVING */}
              {field.type === 'custom_engraving' && (
                <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2D42] space-y-2">
                  <span className="text-xs font-black text-white">{field.labelAr}</span>
                  <input 
                    type="text" 
                    value={engravingText}
                    onChange={e => setEngravingText(e.target.value)}
                    placeholder="اكتب الاسم أو العبارة للحفر بالليزر الذهبي..."
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[9px] text-amber-400 font-bold">✨ حفر مجاني بتقنية الليزر مع هذا الطلب</span>
                </div>
              )}

              {/* PRODUCT GRID */}
              {field.type === 'product_grid' && (
                <div className="space-y-2">
                  <div className="text-xs font-black text-white">{field.labelAr}</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { title: 'دهن عود كلمنتان', price: 450, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
                      { title: 'مبخرة كريستال ملكية', price: 280, img: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=300&q=80' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-[#0F1826] border border-white/5 space-y-2 text-center">
                        <img src={item.img} alt={item.title} className="w-full h-24 rounded-lg object-cover" />
                        <div className="text-[11px] font-bold text-white truncate">{item.title}</div>
                        <div className="text-xs font-mono font-black text-amber-400">{item.price} {project.currencySymbol}</div>
                        <button 
                          onClick={() => {
                            setSimulatedCartCount(c => c + 1);
                            setSimulatedCartTotal(t => t + item.price);
                            showToast(`تمت إضافة (${item.title}) لسلة الشراء! 🛍️`, 'success');
                          }}
                          className="w-full py-1 rounded-lg bg-amber-400/20 text-amber-300 font-bold text-[10px] hover:bg-amber-400 hover:text-slate-950 transition-colors"
                        >
                          + إضافة للسلة
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IMAGE BANNER */}
              {field.type === 'image_banner' && (
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                  <img 
                    src={field.placeholderAr || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=80'} 
                    alt={field.labelAr} 
                    className="w-full h-32 object-cover"
                  />
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* 3. MOBILE BOTTOM HOME BAR */}
      <div className="p-3 border-t border-white/10 flex flex-col items-center justify-center gap-1 bg-black/30">
        <div className="w-28 h-1 bg-white/30 rounded-full" />
        <span className="text-[9px] text-slate-500 font-mono">
          {project.nameAr} • المحاكاة التفاعلية المباشرة
        </span>
      </div>

    </div>
  );
};
