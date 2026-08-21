import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCommerce } from '../../context/CommerceContext';
import { Order, OrderItem } from '../../types';

export const CheckoutModal: React.FC = () => {
  const { 
    activeTenant, 
    cart, 
    checkoutOpen, 
    setCheckoutOpen, 
    addOrder, 
    setCurrentView 
  } = useCommerce();

  const [fullName, setFullName] = useState<string>('سلطان العتيبي');
  const [email, setEmail] = useState<string>('sultan@example.com');
  const [phone, setPhone] = useState<string>('+966 50 888 7766');
  const [city, setCity] = useState<string>('الرياض');
  const [address, setAddress] = useState<string>('حي الملقا، شارع أنس بن مالك، مبنى 44');
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'apple_pay' | 'visa' | 'cod' | 'tamara'>('apple_pay');
  const [notes, setNotes] = useState<string>('تغليف فاخر مع بطاقة إهداء إن أمكن');
  
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!checkoutOpen) return null;

  const tokens = activeTenant.theme.tokens;

  const subtotal = cart.reduce((sum, item) => {
    const price = item.variant ? item.variant.price : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= 300 ? 0 : 25;
  const total = subtotal + shipping;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(async () => {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        variantName: item.variant?.name,
        price: item.variant ? item.variant.price : item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
      }));

      const newOrd = await addOrder({
        tenantId: activeTenant.id,
        customer: {
          name: fullName,
          email,
          phone,
          city,
          address
        },
        items: orderItems,
        subtotal,
        discount: 0,
        shipping,
        tax: Math.round(subtotal * 0.15 * 100) / 100,
        total,
        status: 'new',
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
        notes
      });

      setCompletedOrder(newOrd);
      setIsSubmitting(false);

      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    }, 800);
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in text-right">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border transition-all"
        style={{ 
          backgroundColor: tokens.background, 
          borderColor: tokens.border,
          color: tokens.text
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-800/20 hover:bg-slate-800/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div 
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"
              style={{ backgroundColor: '#10b981' }}
            >
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                تم استلام طلبك بنجاح
              </span>
              <h2 className="text-2xl font-black mt-2" style={{ color: tokens.text }}>
                شكراً لطلبك من {activeTenant.name}!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                رقم التتبع الخاص بالطلب: <span className="font-mono text-amber-500 font-bold">{completedOrder.orderNumber}</span>
              </p>
            </div>

            {/* Order Details Card */}
            <div 
              className="p-4 rounded-xl border text-right space-y-2.5 text-xs"
              style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
            >
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">العميل المستلم:</span>
                <span className="font-bold">{completedOrder.customer.name} ({completedOrder.customer.city})</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">طريقة الدفع:</span>
                <span className="font-bold capitalize">{completedOrder.paymentMethod} (مؤكد)</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">عدد المنتجات:</span>
                <span className="font-bold">{completedOrder.items.length} منتجات</span>
              </div>
              <div className="flex justify-between pt-1 font-black text-sm">
                <span>المبلغ الإجمالي المدفوع:</span>
                <span style={{ color: tokens.primary }}>{completedOrder.total} {activeTenant.currencySymbol}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleClose}
                className="py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: tokens.primary }}
              >
                العودة للتسوق بالمتجر
              </button>

              <button
                onClick={() => {
                  handleClose();
                  setCurrentView('merchant_dashboard');
                }}
                className="py-3 px-4 rounded-xl text-xs font-bold border transition-colors hover:bg-slate-800/10"
                style={{ borderColor: tokens.border, color: tokens.text }}
              >
                معاينة الطلب في لوحة إدارة المتجر 📦
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg sm:text-xl font-black" style={{ color: tokens.text }}>
                  إتمام الطلب والدفع الآمن
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                أدخل بيانات التوصيل واختر طريقة الدفع لتأكيد الشحنة فورياً.
              </p>
            </div>

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 border-b pb-1.5" style={{ borderColor: tokens.border }}>
                1. بيانات المستلم والشحن
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">الاسم الكامل *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    <input
                      required
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none"
                      style={{ backgroundColor: tokens.surface, borderColor: tokens.border, color: tokens.text }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">رقم الجوال (للتوصيل) *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    <input
                      required
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none text-left font-mono"
                      style={{ backgroundColor: tokens.surface, borderColor: tokens.border, color: tokens.text }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">البريد الإلكتروني (لتأكيد الفاتورة)</label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none text-left"
                      style={{ backgroundColor: tokens.surface, borderColor: tokens.border, color: tokens.text }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1 opacity-80">المدينة *</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                    <input
                      required
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border focus:outline-none"
                      style={{ backgroundColor: tokens.surface, borderColor: tokens.border, color: tokens.text }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">العنوان بالتفصيل (الحي، الشارع، رقم المبنى) *</label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border focus:outline-none"
                  style={{ backgroundColor: tokens.surface, borderColor: tokens.border, color: tokens.text }}
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 border-b pb-1.5" style={{ borderColor: tokens.border }}>
                2. طريقة الدفع
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'apple_pay', name: 'Apple Pay', desc: 'دفع فوري سريع' },
                  { id: 'mada', name: 'بطاقة مدى (Mada)', desc: 'دفع محلي آمن' },
                  { id: 'visa', name: 'Visa / MasterCard', desc: 'بطاقة ائتمانية' },
                  { id: 'tamara', name: 'تمارا (Tamara)', desc: 'قسّم على 4 دفعات' },
                  { id: 'cod', name: 'الدفع عند الاستلام', desc: 'نقد / شبكة للمندوب' }
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as any)}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === item.id ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === item.id ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === item.id ? tokens.primary : tokens.border,
                      ringColor: tokens.primary
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>{item.name}</div>
                    <div className="text-[10px] text-slate-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary & Submit Button */}
            <div 
              className="p-4 rounded-xl border space-y-2"
              style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}
            >
              <div className="flex justify-between text-xs text-slate-500">
                <span>المجموع الفرعي ({cart.length} منتجات):</span>
                <span className="font-bold font-mono">{subtotal} {activeTenant.currencySymbol}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>رسوم التوصيل المبرد:</span>
                <span className="font-bold font-mono">{shipping === 0 ? 'مجاني' : `${shipping} ${activeTenant.currencySymbol}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t" style={{ borderColor: tokens.border, color: tokens.text }}>
                <span>المبلغ الإجمالي للدفع:</span>
                <span className="text-base font-mono" style={{ color: tokens.primary }}>
                  {total} {activeTenant.currencySymbol}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full py-4 px-6 rounded-xl text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
              style={{ backgroundColor: tokens.primary }}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>جاري معالجة الدفع وتأكيد الطلب...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>تأكيد الطلب والدفع الفوري • {total} {activeTenant.currencySymbol}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
