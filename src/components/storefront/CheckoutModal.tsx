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
  ExternalLink,
  Building2,
  Upload,
  Copy,
  Check,
  Clock,
  AlertCircle,
  FileCheck2,
  Smartphone,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCommerce } from '../../context/CommerceContext';
import { Order, OrderItem } from '../../types';
import { verifyWatermarkIntegrity } from '../../utils/licensingEngine';

export const CheckoutModal: React.FC = () => {
  const { 
    activeTenant, 
    cart, 
    checkoutOpen, 
    setCheckoutOpen, 
    addOrder, 
    setCurrentView,
    showToast,
    setTamperAlertModalOpen,
    setTamperModalData,
    logTamperEvent,
    platformConfig
  } = useCommerce();

  const [fullName, setFullName] = useState<string>('سلطان العتيبي');
  const [email, setEmail] = useState<string>('sultan@example.com');
  const [phone, setPhone] = useState<string>('+966 50 888 7766');
  const [city, setCity] = useState<string>('الرياض');
  const [address, setAddress] = useState<string>('حي الملقا، شارع أنس بن مالك، مبنى 44');
  
  // Available gateways from activeTenant
  const gateways = activeTenant.paymentGateways || {
    mada: true,
    applePay: true,
    visa: true,
    cod: true,
    tamara: true,
    bankTransfer: true
  };

  const initialMethod: Order['paymentMethod'] = 
    gateways.applePay ? 'apple_pay' :
    gateways.mada ? 'mada' :
    gateways.visa ? 'visa' :
    gateways.bankTransfer ? 'bank_transfer' : 'cod';

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>(initialMethod);
  const [notes, setNotes] = useState<string>('تغليف فاخر مع بطاقة إهداء إن أمكن');

  // Bank Transfer Fields
  const [bankName, setBankName] = useState<string>(activeTenant.bankAccounts?.[0]?.bankName || 'مصرف الراجحي');
  const [accountHolder, setAccountHolder] = useState<string>('سلطان العتيبي');
  const [referenceNumber, setReferenceNumber] = useState<string>('TRX-' + Math.floor(100000 + Math.random() * 900000));
  const [receiptImage, setReceiptImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
  const [copiedIban, setCopiedIban] = useState<string | null>(null);

  // Gateway Simulation State
  const [gatewayStep, setGatewayStep] = useState<'form' | 'gateway_3ds' | 'completed'>('form');
  const [gatewayOtp, setGatewayOtp] = useState<string>('1234');
  const [isAuthorizing, setIsAuthorizing] = useState<boolean>(false);
  
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

  const handleCopyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(iban);
    showToast('تم نسخ رقم الآيبان للحافظة', 'success');
    setTimeout(() => setCopiedIban(null), 2500);
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReceiptImage(reader.result as string);
        showToast('تم رفع صورة الإيصال بنجاح', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const executeOrderCreation = async (isPaidElectronically: boolean = false) => {
    setIsSubmitting(true);
    
    const orderItems: OrderItem[] = cart.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      variantName: item.variant?.name,
      price: item.variant ? item.variant.price : item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]
    }));

    const initialStatus: Order['paymentStatus'] = 
      paymentMethod === 'bank_transfer' ? 'pending_verification' :
      paymentMethod === 'cod' ? 'pending' :
      isPaidElectronically ? 'paid' : 'pending';

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
      paymentStatus: initialStatus,
      bankTransferDetails: paymentMethod === 'bank_transfer' ? {
        bankName,
        accountHolder,
        receiptImage,
        referenceNumber,
        transferDate: new Date().toISOString()
      } : undefined,
      notes
    });

    setCompletedOrder(newOrd);
    setGatewayStep('completed');
    setIsSubmitting(false);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Reverse Engineering & Watermark Integrity Defense
    if (platformConfig.watermarkEnforcement === 'strict_tamper_lock') {
      const integrity = verifyWatermarkIntegrity(activeTenant);
      if (!integrity.valid) {
        logTamperEvent({
          tenantId: activeTenant.id,
          tenantName: activeTenant.name,
          tamperType: integrity.tamperCode === 'TAMPER_HIDDEN' ? 'css_hiding' : 'dom_removal',
          actionTaken: 'checkout_locked'
        });
        setTamperModalData({
          tenantName: activeTenant.name,
          reason: integrity.reason || 'تم اكتشاف حذف أو إخفاء شارة CommerceOS دون ترخيص White-Label صالح.',
          tamperCode: integrity.tamperCode
        });
        setTamperAlertModalOpen(true);
        showToast('تم تعليق إتمام الطلب مؤقتاً لحماية سلامة كود المنصة', 'error');
        return;
      }
    }

    if (paymentMethod === 'bank_transfer') {
      if (!receiptImage && !referenceNumber) {
        showToast('يرجى إرفاق إيصال التحويل أو إدخال رقم المرجع', 'error');
        return;
      }
      executeOrderCreation(false);
    } else if (paymentMethod === 'cod') {
      executeOrderCreation(false);
    } else {
      // Electronic payment: prompt simulated 3D Secure / Gateway authorization
      setGatewayStep('gateway_3ds');
    }
  };

  const handleSimulateGatewaySuccess = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      executeOrderCreation(true);
    }, 1200);
  };

  const handleClose = () => {
    setCheckoutOpen(false);
    setCompletedOrder(null);
    setGatewayStep('form');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in text-right">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border transition-all"
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

        {/* STEP: 3D Secure / Electronic Gateway Simulation Modal */}
        {gatewayStep === 'gateway_3ds' && (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                <span>بوابة الدفع الإلكتروني المعتمدة</span>
                <span className="capitalize font-mono font-black">({paymentMethod.replace('_', ' ')})</span>
              </div>
              <h2 className="text-xl font-black mt-3" style={{ color: tokens.text }}>
                التحقق الآمن ثلاثي الأبعاد (3D Secure)
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                تم إرسال رمز التحقق (OTP) المالي إلى جوالك المسجل لإتمام سداد مبلغ <span className="font-bold text-amber-500">{total} {activeTenant.currencySymbol}</span>
              </p>
            </div>

            <div 
              className="p-5 rounded-xl border text-right space-y-3 text-xs max-w-md mx-auto"
              style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
            >
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">المتجر المستفيد:</span>
                <span className="font-bold">{activeTenant.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">رقم بطاقة العميل:</span>
                <span className="font-mono font-bold">•••• •••• •••• 9842</span>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1.5 text-slate-300">أدخل رمز التحقق (للتجربة: 1234):</label>
                <input
                  type="text"
                  maxLength={6}
                  value={gatewayOtp}
                  onChange={e => setGatewayOtp(e.target.value)}
                  className="w-full py-2.5 px-3 text-center text-lg font-mono font-bold tracking-widest rounded-xl border focus:outline-none"
                  style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border, color: tokens.text }}
                />
              </div>
            </div>

            <div className="flex gap-3 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setGatewayStep('form')}
                className="flex-1 py-3 px-4 rounded-xl text-xs font-bold border hover:bg-slate-800/10 transition-colors"
                style={{ borderColor: tokens.border, color: tokens.text }}
              >
                رجوع
              </button>
              <button
                type="button"
                disabled={isAuthorizing || !gatewayOtp}
                onClick={handleSimulateGatewaySuccess}
                className="flex-2 py-3 px-6 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                style={{ backgroundColor: tokens.primary }}
              >
                {isAuthorizing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>جاري تفويض الدفع البنكي...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>تأكيد الخصم وسداد {total} {activeTenant.currencySymbol}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP: Order Confirmation View */}
        {gatewayStep === 'completed' && completedOrder && (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div 
              className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"
              style={{ backgroundColor: '#10b981' }}
            >
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {completedOrder.paymentMethod === 'bank_transfer'
                  ? 'تم استلام الطلب وبانتظار مراجعة الإيصال'
                  : 'تم استلام طلبك بنجاح'}
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
                <span className="font-bold capitalize">
                  {completedOrder.paymentMethod === 'bank_transfer' ? 'تحويل بنكي مباشر' :
                   completedOrder.paymentMethod === 'cod' ? 'الدفع عند الاستلام (COD)' :
                   completedOrder.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">حالة الدفع الحالية:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  completedOrder.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  completedOrder.paymentStatus === 'pending_verification' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                  'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {completedOrder.paymentStatus === 'paid' ? 'مدفوع ومؤكد' :
                   completedOrder.paymentStatus === 'pending_verification' ? 'قيد مراجعة التحويل البنكي' : 'معلق'}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                <span className="text-slate-400">عدد المنتجات:</span>
                <span className="font-bold">{completedOrder.items.length} منتجات</span>
              </div>
              <div className="flex justify-between pt-1 font-black text-sm">
                <span>المبلغ الإجمالي:</span>
                <span style={{ color: tokens.primary }}>{completedOrder.total} {activeTenant.currencySymbol}</span>
              </div>
            </div>

            {completedOrder.paymentMethod === 'bank_transfer' && (
              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 text-right flex items-start gap-2.5 text-xs text-amber-600">
                <Clock className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">سيتم مراجعة إيصال التحويل من فريق المتجر</div>
                  <div className="text-[11px] text-amber-600/80 mt-0.5">
                    بمجرد مطابقة الحوالة البنكية، ستتغير حالة طلبك إلى "قيد التنفيذ" وسيصلك إشعار فوري.
                  </div>
                </div>
              </div>
            )}

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
        )}

        {/* STEP: Checkout Form */}
        {gatewayStep === 'form' && (
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg sm:text-xl font-black" style={{ color: tokens.text }}>
                  إتمام الطلب وبوابات الدفع
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                أدخل بيانات التوصيل واختر طريقة الدفع المناسبة لتأكيد الشحنة فورياً.
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
              <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.border }}>
                <h3 className="text-xs font-bold text-slate-400">
                  2. طريقة الدفع (مفعلة للمتجر)
                </h3>
                <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> دفع مؤمن 256-bit
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {gateways.applePay && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'apple_pay' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'apple_pay' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'apple_pay' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>Apple Pay</div>
                    <div className="text-[10px] text-slate-400">دفع فوري سريع</div>
                  </button>
                )}

                {gateways.mada && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mada')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'mada' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'mada' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'mada' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>بطاقة مدى (Mada)</div>
                    <div className="text-[10px] text-slate-400">دفع محلي آمن</div>
                  </button>
                )}

                {gateways.visa && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('visa')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'visa' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'visa' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'visa' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>Visa / MasterCard</div>
                    <div className="text-[10px] text-slate-400">بطاقة ائتمانية</div>
                  </button>
                )}

                {gateways.bankTransfer && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'bank_transfer' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'bank_transfer' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'bank_transfer' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold flex items-center gap-1" style={{ color: tokens.text }}>
                      <Building2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>تحويل بنكي</span>
                    </div>
                    <div className="text-[10px] text-slate-400">رفع إيصال الحوالة</div>
                  </button>
                )}

                {gateways.tamara && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('tamara')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'tamara' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'tamara' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'tamara' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>تمارا (Tamara)</div>
                    <div className="text-[10px] text-slate-400">قسّم على 4 دفعات</div>
                  </button>
                )}

                {gateways.cod && (
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-right transition-all ${
                      paymentMethod === 'cod' ? 'ring-2' : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ 
                      backgroundColor: paymentMethod === 'cod' ? tokens.surfaceMuted : tokens.surface,
                      borderColor: paymentMethod === 'cod' ? tokens.primary : tokens.border
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: tokens.text }}>الدفع عند الاستلام</div>
                    <div className="text-[10px] text-slate-400">نقد / شبكة للمندوب</div>
                  </button>
                )}
              </div>

              {/* Bank Transfer Details Section */}
              {paymentMethod === 'bank_transfer' && (
                <div 
                  className="p-4 rounded-xl border space-y-4 animate-in fade-in duration-200"
                  style={{ backgroundColor: tokens.surface, borderColor: tokens.border }}
                >
                  <div className="flex items-center justify-between border-b pb-2" style={{ borderColor: tokens.border }}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold" style={{ color: tokens.text }}>
                        الحسابات البنكية المعتمدة للمتجر
                      </span>
                    </div>
                    <span className="text-[11px] text-amber-500 font-bold">
                      المبلغ للتحويل: {total} {activeTenant.currencySymbol}
                    </span>
                  </div>

                  {/* List of Store Bank Accounts */}
                  <div className="space-y-2">
                    {(activeTenant.bankAccounts && activeTenant.bankAccounts.length > 0 ? activeTenant.bankAccounts : [
                      {
                        id: 'def-ba',
                        bankName: 'مصرف الراجحي (Al Rajhi Bank)',
                        accountHolder: activeTenant.name,
                        accountNumber: '482000019283746',
                        iban: 'SA4480000482000019283746',
                        active: true
                      }
                    ]).filter(b => b.active).map(acc => (
                      <div 
                        key={acc.id}
                        className="p-3 rounded-lg border text-xs space-y-1.5"
                        style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{acc.bankName}</span>
                          <span className="text-[11px] text-slate-400">المستفيد: {acc.accountHolder}</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 font-mono text-[11px] bg-slate-900/40 p-2 rounded border border-slate-700/50">
                          <div>
                            <span className="text-slate-400 block text-[9px]">IBAN:</span>
                            <span className="text-amber-400 font-bold">{acc.iban}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyIban(acc.iban)}
                            className="p-1.5 rounded-md hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[10px]"
                          >
                            {copiedIban === acc.iban ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedIban === acc.iban ? 'تم النسخ' : 'نسخ الآيبان'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bank Transfer Proof Upload Form */}
                  <div className="space-y-3 pt-2 border-t" style={{ borderColor: tokens.border }}>
                    <div className="text-xs font-bold text-slate-300">
                      بيانات الحوالة وإرفاق الإيصال:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold mb-1 opacity-80">البنك المحول منه *</label>
                        <input
                          type="text"
                          value={bankName}
                          onChange={e => setBankName(e.target.value)}
                          placeholder="مثال: مصرف الراجحي"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none"
                          style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border, color: tokens.text }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold mb-1 opacity-80">اسم المحول / صاحب الحساب *</label>
                        <input
                          type="text"
                          value={accountHolder}
                          onChange={e => setAccountHolder(e.target.value)}
                          placeholder="الاسم المسجل في البنك"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border focus:outline-none"
                          style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border, color: tokens.text }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1 opacity-80">رقم المرجع / العملية البنكية *</label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={e => setReferenceNumber(e.target.value)}
                        placeholder="رقم مرجع التحويل أو الحوالة"
                        className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border focus:outline-none text-left"
                        style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border, color: tokens.text }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold mb-1.5 opacity-80">صورة إيصال التحويل (اختياري / موصى به)</label>
                      <div className="flex items-center gap-3">
                        <label 
                          className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-slate-600 hover:border-amber-500 transition-colors text-xs text-slate-300"
                        >
                          <Upload className="w-4 h-4 text-amber-500" />
                          <span>رفع صورة الإيصال أو السكرين شوت</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleReceiptUpload} 
                            className="hidden" 
                          />
                        </label>
                        {receiptImage && (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/50 shrink-0">
                            <img src={receiptImage} alt="Receipt" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Submit Button */}
            <div 
              className="p-4 rounded-xl border space-y-2"
              style={{ backgroundColor: tokens.surfaceMuted, borderColor: tokens.border }}
            >
              <div className="flex justify-between text-xs text-slate-400">
                <span>المجموع الفرعي ({cart.length} منتجات):</span>
                <span className="font-bold font-mono text-slate-200">{subtotal} {activeTenant.currencySymbol}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>رسوم التوصيل:</span>
                <span className="font-bold font-mono text-slate-200">{shipping === 0 ? 'مجاني' : `${shipping} ${activeTenant.currencySymbol}`}</span>
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
                  <span>جاري تسجيل وتأكيد الطلب...</span>
                </div>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'bank_transfer' ? 'تأكيد طلب التحويل البنكي' :
                     paymentMethod === 'cod' ? 'تأكيد الطلب والدفع عند الاستلام' :
                     `تأكيد الطلب والدفع الإلكتروني • ${total} ${activeTenant.currencySymbol}`}
                  </span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
