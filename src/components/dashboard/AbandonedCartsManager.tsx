import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Send, 
  Clock, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Sparkles, 
  MessageSquare, 
  RefreshCw,
  ExternalLink,
  Percent
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { AbandonedCart } from '../../types';

export const AbandonedCartsManager: React.FC = () => {
  const { activeTenant, showToast } = useCommerce();

  const [carts, setCarts] = useState<AbandonedCart[]>([
    {
      id: 'cart-ab-101',
      tenantId: activeTenant.id,
      customerName: 'فيصل العتيبي',
      customerPhone: '+966501234567',
      customerEmail: 'faisal.otb@gmail.com',
      items: [
        {
          product: {
            id: 'prod-101',
            name: 'عسل سدر ملكي فاخر دوعني',
            price: 240,
            images: ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=800'],
            stock: 45,
            sku: 'RHD-001',
            tenantId: activeTenant.id,
            description: 'عسل سدر طبيعي'
          } as any,
          quantity: 2
        }
      ],
      subtotal: 480,
      currency: 'SAR',
      abandonedAt: 'منذ 35 دقيقة',
      recoveryStatus: 'abandoned',
      recoveryAttempts: 0,
      recoveryUrl: `https://${activeTenant.slug}.commerceos.app/checkout?resume=cart-ab-101`
    },
    {
      id: 'cart-ab-102',
      tenantId: activeTenant.id,
      customerName: 'سارة الشمري',
      customerPhone: '+966559876543',
      customerEmail: 'sarah.sh@outlook.com',
      items: [
        {
          product: {
            id: 'prod-103',
            name: 'عسل حبة البركة العلاجي',
            price: 180,
            images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d39?auto=format&fit=crop&q=80&w=800'],
            stock: 28,
            sku: 'RHB-003',
            tenantId: activeTenant.id,
            description: 'عسل مع حبة البركة'
          } as any,
          quantity: 1
        }
      ],
      subtotal: 180,
      currency: 'SAR',
      abandonedAt: 'منذ ساعتين',
      recoveryStatus: 'notified',
      recoveryAttempts: 1,
      lastContactedAt: 'منذ ساعة',
      discountCodeOffered: 'COMEBACK10',
      recoveryUrl: `https://${activeTenant.slug}.commerceos.app/checkout?resume=cart-ab-102&code=COMEBACK10`
    },
    {
      id: 'cart-ab-103',
      tenantId: activeTenant.id,
      customerName: 'خالد المهيدب',
      customerPhone: '+966541122334',
      customerEmail: 'khaled.m@gmail.com',
      items: [
        {
          product: {
            id: 'prod-102',
            name: 'عسل سمر جبلي بري',
            price: 195,
            images: ['https://images.unsplash.com/photo-1587049352847-4a222e784d39?auto=format&fit=crop&q=80&w=800'],
            stock: 30,
            sku: 'RHS-002',
            tenantId: activeTenant.id,
            description: 'عسل سمر طبيعي'
          } as any,
          quantity: 3
        }
      ],
      subtotal: 585,
      currency: 'SAR',
      abandonedAt: 'منذ يوم',
      recoveryStatus: 'recovered',
      recoveryAttempts: 2,
      lastContactedAt: 'أمس',
      discountCodeOffered: 'SPECIAL15',
      recoveryUrl: `https://${activeTenant.slug}.commerceos.app/checkout?resume=cart-ab-103`
    }
  ]);

  const [selectedDiscount, setSelectedDiscount] = useState<number>(10);
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');
  const [sendingId, setSendingId] = useState<string | null>(null);

  const totalValue = carts.reduce((sum, c) => sum + c.subtotal, 0);
  const recoveredValue = carts.filter(c => c.recoveryStatus === 'recovered').reduce((sum, c) => sum + c.subtotal, 0);
  const recoveryRate = Math.round((carts.filter(c => c.recoveryStatus === 'recovered').length / carts.length) * 100);

  const handleRecover = (cartId: string) => {
    setSendingId(cartId);
    setTimeout(() => {
      setCarts(prev => prev.map(c => {
        if (c.id === cartId) {
          return {
            ...c,
            recoveryStatus: 'notified',
            recoveryAttempts: c.recoveryAttempts + 1,
            lastContactedAt: 'الآن',
            discountCodeOffered: `RECOVER${selectedDiscount}`
          };
        }
        return c;
      }));
      setSendingId(null);
      showToast(`تم إرسال رابط استعادة السلة مع كود خصم ${selectedDiscount}% بنجاح! 🚀`, 'success');
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">إجمالي السلات المتروكة</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{carts.length} سلات</div>
          <div className="text-[11px] text-amber-400 font-medium mt-1">فرص بيع تحتاج متابعة</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">قيمة السلات الإجمالية</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalValue} ر.س</div>
          <div className="text-[11px] text-rose-400 font-medium mt-1">مبيعات محتملة غير مكتملة</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">المبالغ المستعادة فعلياً</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{recoveredValue} ر.س</div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">عبر حملات الواتساب التلقائية</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold">معدل الاستعادة (Recovery Rate)</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{recoveryRate}%</div>
          <div className="text-[11px] text-blue-300 font-medium mt-1">متوسط التحويل أعلى بـ +18%</div>
        </div>
      </div>

      {/* Recovery Strategy Settings */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/30 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            استراتيجية استعادة السلات الذكية
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            إرسال رابط دفع فوري يفتح سلة العميل مباشرة مع تطبيق كود خصم تشجيعي بنقرة واحدة عبر الواتساب أو SMS.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            {[5, 10, 15, 20].map(pct => (
              <button
                key={pct}
                onClick={() => setSelectedDiscount(pct)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedDiscount === pct 
                    ? 'bg-amber-500 text-slate-950 shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {pct}% خصم
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeChannel === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              واتساب
            </button>
            <button
              onClick={() => setActiveChannel('sms')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeChannel === 'sms' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              SMS
            </button>
          </div>
        </div>
      </div>

      {/* Abandoned Carts Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="text-sm font-bold text-white flex items-center gap-2">
            <span>سجل السلات المتروكة المعلقة</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300 font-bold">
              {carts.length}
            </span>
          </div>
          <button 
            onClick={() => showToast('تم تحديث قائمة السلات المتروكة', 'info')}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            تحديث
          </button>
        </div>

        <div className="divide-y divide-slate-800/70">
          {carts.map(cart => (
            <div key={cart.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors">
              
              {/* Customer & Cart Info */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-white">{cart.customerName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    cart.recoveryStatus === 'recovered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    cart.recoveryStatus === 'notified' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {cart.recoveryStatus === 'recovered' ? 'تمت الاستعادة والشراء ✅' :
                     cart.recoveryStatus === 'notified' ? 'تم إرسال تذكير 📩' : 'بانتظار الإرسال ⏳'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {cart.customerPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {cart.abandonedAt}
                  </span>
                  {cart.discountCodeOffered && (
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Percent className="w-3.5 h-3.5" />
                      كود: {cart.discountCodeOffered}
                    </span>
                  )}
                </div>

                {/* Items preview */}
                <div className="flex items-center gap-2 mt-2">
                  {cart.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs text-slate-300">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-5 h-5 rounded object-cover" />
                      <span>{item.product.name}</span>
                      <span className="text-slate-500">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto pt-3 md:pt-0 border-t md:border-0 border-slate-800">
                <div className="text-right">
                  <div className="text-base font-black text-white">{cart.subtotal} {cart.currency}</div>
                  <div className="text-[10px] text-slate-400">{cart.recoveryAttempts} محاولات تواصل</div>
                </div>

                {cart.recoveryStatus !== 'recovered' ? (
                  <button
                    onClick={() => handleRecover(cart.id)}
                    disabled={sendingId === cart.id}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-900/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {sendingId === cart.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>استعادة عبر {activeChannel === 'whatsapp' ? 'الواتساب' : 'SMS'}</span>
                  </button>
                ) : (
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    تم الدفع بنجاح
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
