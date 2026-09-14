import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Product, POSReceipt } from '../../types';
import { getTenantFeatures } from '../../utils/defaultFeatures';
import { 
  Calculator, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  DollarSign, 
  Smartphone, 
  Receipt, 
  User, 
  CheckCircle2, 
  Printer, 
  QrCode, 
  X, 
  RotateCcw,
  Sparkles,
  ShoppingBag,
  Percent,
  Clock,
  ShieldCheck,
  Building2,
  Wallet
} from 'lucide-react';

export const POSView: React.FC = () => {
  const { products, categories, activeTenant, addOrder, addDebt, showToast, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';
  const features = getTenantFeatures(activeTenant?.featuresConfig);

  // POS Cart State
  const [posCart, setPosCart] = useState<{ product: Product; quantity: number; selectedVariantId?: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transaction & Payment State
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'mada' | 'cash' | 'apple_pay' | 'visa' | 'debt'>('mada');
  const [cashTendered, setCashTendered] = useState<string>('');
  
  // Customer Credit / Debt Info (if method is debt)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Receipt Modal State
  const [completedReceipt, setCompletedReceipt] = useState<POSReceipt | null>(null);

  // Filtered Products for POS
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.barcode && p.barcode.includes(searchQuery));
    return matchesCategory && matchesSearch;
  });

  // Cart Calculations
  const subtotal = posCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * 15) / 115; // Standard 15% inclusive VAT
  const grandTotal = Math.max(0, taxableAmount);
  
  const cashGiven = parseFloat(cashTendered) || 0;
  const changeDue = Math.max(0, cashGiven - grandTotal);

  const handleAddToCart = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleClearCart = () => {
    setPosCart([]);
    setDiscountPercent(0);
    setCashTendered('');
    setCustomerName('');
    setCustomerPhone('');
  };

  const handleCompleteSale = async () => {
    if (posCart.length === 0 || !activeTenant) return;

    if (paymentMethod === 'cash' && cashGiven < grandTotal) {
      showToast(isAr ? 'المبلغ المستلم أقل من إجمالي الفاتورة' : 'Tendered cash is less than total', 'warning');
      return;
    }

    if (paymentMethod === 'debt' && (!customerName || !customerPhone)) {
      showToast(isAr ? 'يرجى إدخال اسم العميل ورقم هاتفه لقيد الحساب الآجل' : 'Enter customer name and phone for credit sale', 'warning');
      return;
    }

    const receiptNumber = `POS-${Date.now().toString().slice(-6)}`;
    const orderNumber = `ORD-POS-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    // Generate ZATCA Phase-2 QR Mock Code
    const zatcaPayload = `Seller:${activeTenant.name}|VAT:${activeTenant.vatNumber || '310982345600003'}|Time:${now}|Total:${grandTotal}|Tax:${taxAmount.toFixed(2)}`;
    const zatcaQrCode = btoa(unescape(encodeURIComponent(zatcaPayload)));

    const receipt: POSReceipt = {
      receiptNumber,
      tenantId: activeTenant.id,
      storeName: activeTenant.name,
      vatNumber: activeTenant.vatNumber || '310982345600003',
      cashierName: isAr ? 'الكاشير الملكي (الفرع الرئيسي)' : 'Cashier #1',
      customerName: customerName || undefined,
      customerPhone: customerPhone || undefined,
      items: posCart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        unitPrice: item.product.price,
        quantity: item.quantity,
        total: item.product.price * item.quantity,
        tax: ((item.product.price * item.quantity) * 15) / 115
      })),
      subtotal,
      discount: discountAmount,
      taxAmount,
      total: grandTotal,
      paymentMethod,
      cashTendered: paymentMethod === 'cash' ? cashGiven : undefined,
      changeDue: paymentMethod === 'cash' ? changeDue : undefined,
      zatcaQrCode,
      timestamp: now
    };

    // Save as order in system
    try {
      await addOrder({
        tenantId: activeTenant.id,
        customerName: customerName || (isAr ? 'عميل المعرض الفوري' : 'Walk-in Customer'),
        customerPhone: customerPhone || '+966 50 000 0000',
        customerCity: isAr ? 'الرياض' : 'Riyadh',
        items: posCart.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        total: grandTotal,
        subtotal: subtotal,
        tax: taxAmount,
        shippingCost: 0,
        discount: discountAmount,
        currency: currencySymbol,
        status: 'delivered',
        paymentStatus: paymentMethod === 'debt' ? 'pending' : 'paid',
        paymentMethod: paymentMethod === 'cash' ? 'cod' : paymentMethod === 'mada' ? 'mada' : paymentMethod === 'apple_pay' ? 'apple_pay' : 'visa',
        deliveryMethod: 'pickup',
        source: 'pos',
        notes: `نقطة بيع كاشير - إيصال رقم ${receiptNumber}`
      });

      // If debt, record in debts ledger
      if (paymentMethod === 'debt') {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);
        addDebt({
          tenantId: activeTenant.id,
          personName: customerName,
          personPhone: customerPhone,
          personType: 'customer',
          type: 'receivable',
          totalAmount: grandTotal,
          paidAmount: 0,
          dueDate: dueDate.toISOString().split('T')[0],
          notes: `فاتورة نقطة بيع آجلة رقم ${receiptNumber}`
        });
      }

      setCompletedReceipt(receipt);
      handleClearCart();
      showToast(isAr ? 'تمت عملية البيع وطباعة الإيصال بنجاح' : 'Sale completed successfully', 'success');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
      {/* Left Column: Product Catalog & Search */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0B1422] rounded-2xl border border-[#233247] overflow-hidden">
        {/* Search & Category Filter Bar */}
        <div className="p-4 border-b border-[#233247] space-y-3 bg-[#101B2C]">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#97A4B5] absolute start-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'مسح الباركود أو البحث بالاسم / رمز SKU...' : 'Scan barcode or search products...'}
                className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-9 pe-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
              />
            </div>
          </div>

          {/* Categories Pill Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategoryId('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategoryId === 'all'
                  ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
                  : 'bg-[#050B14] text-[#97A4B5] hover:text-white border border-[#233247]'
              }`}
            >
              {isAr ? 'كافة المنتجات' : 'All Products'}
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategoryId === cat.id
                    ? 'bg-[#C9A45C] text-[#050B14] font-bold shadow-md shadow-[#C9A45C]/20'
                    : 'bg-[#050B14] text-[#97A4B5] hover:text-white border border-[#233247]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredProducts.map(product => {
              const inCartItem = posCart.find(item => item.product.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => handleAddToCart(product)}
                  className={`group relative p-3 rounded-xl bg-[#050B14] border text-start flex flex-col justify-between transition-all hover:border-[#C9A45C] hover:scale-[1.02] ${
                    inCartItem ? 'border-[#C9A45C] shadow-lg shadow-[#C9A45C]/5' : 'border-[#233247]'
                  }`}
                >
                  {inCartItem && (
                    <div className="absolute top-2 end-2 w-6 h-6 rounded-full bg-[#C9A45C] text-[#050B14] text-xs font-black flex items-center justify-center shadow">
                      {inCartItem.quantity}
                    </div>
                  )}

                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#101B2C] mb-2">
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{product.name}</h4>
                    <p className="text-xs font-black text-[#C9A45C] mt-1.5">
                      {product.price.toLocaleString()} <span className="text-[10px] font-normal text-[#97A4B5]">{currencySymbol}</span>
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Column: POS Cart, Checkout & Payment Panel */}
      <div className="w-full lg:w-96 bg-[#0B1422] rounded-2xl border border-[#233247] flex flex-col shrink-0 overflow-hidden">
        {/* Cart Header */}
        <div className="p-4 border-b border-[#233247] flex items-center justify-between bg-[#101B2C]">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#C9A45C]" />
            <h3 className="font-bold text-white text-sm">{isAr ? 'فاتورة البيع الحالية' : 'Current Ticket'}</h3>
          </div>
          {posCart.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'إفراغ' : 'Clear'}</span>
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 p-3 overflow-y-auto space-y-2">
          {posCart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#97A4B5]">
              <ShoppingBag className="w-12 h-12 mb-2 opacity-30 text-[#C9A45C]" />
              <p className="text-sm font-semibold text-white">{isAr ? 'الفاتورة فارغة' : 'Ticket is empty'}</p>
              <p className="text-xs text-[#97A4B5] mt-1">{isAr ? 'انقر على المنتجات لإضافتها فورياً' : 'Click items to add to cart'}</p>
            </div>
          ) : (
            posCart.map(item => (
              <div key={item.product.id} className="p-2.5 rounded-xl bg-[#050B14] border border-[#233247] flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{item.product.name}</p>
                  <p className="text-xs font-semibold text-[#C9A45C] mt-0.5">
                    {(item.product.price * item.quantity).toLocaleString()} {currencySymbol}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#101B2C] p-1 rounded-lg border border-[#233247]">
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, -1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#97A4B5] hover:text-white hover:bg-white/5"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-black text-white px-1.5">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, 1)}
                    className="w-6 h-6 rounded flex items-center justify-center text-[#97A4B5] hover:text-white hover:bg-white/5"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Totals & Discounts */}
        <div className="p-4 bg-[#101B2C] border-t border-[#233247] space-y-3">
          {/* Quick Discount Buttons */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-[#97A4B5] flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-[#C9A45C]" />
              {isAr ? 'خصم فوري:' : 'Discount:'}
            </span>
            <div className="flex items-center gap-1">
              {[0, 5, 10, 15, 20].map(pct => (
                <button
                  key={pct}
                  onClick={() => setDiscountPercent(pct)}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                    discountPercent === pct 
                      ? 'bg-[#C9A45C] text-[#050B14]' 
                      : 'bg-[#050B14] text-[#97A4B5] hover:text-white border border-[#233247]'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-[#97A4B5]">
            <div className="flex justify-between">
              <span>{isAr ? 'المجموع قبل الخصم:' : 'Subtotal:'}</span>
              <span className="text-white font-medium">{subtotal.toLocaleString()} {currencySymbol}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>{isAr ? `الخصم (${discountPercent}%):` : 'Discount:'}</span>
                <span>-{discountAmount.toLocaleString()} {currencySymbol}</span>
              </div>
            )}
            <div className="flex justify-between text-[11px] text-[#97A4B5]/80">
              <span>{isAr ? 'ضريبة القيمة المضافة 15% (مشمولة):' : 'VAT 15% (Included):'}</span>
              <span>{taxAmount.toFixed(2)} {currencySymbol}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#233247]">
              <span>{isAr ? 'المبلغ الإجمالي المستحق:' : 'Grand Total:'}</span>
              <span className="text-[#C9A45C]">{grandTotal.toLocaleString()} {currencySymbol}</span>
            </div>
          </div>

          {/* Payment Methods Tabs */}
          <div className="space-y-2 pt-2 border-t border-[#233247]">
            <label className="block text-xs font-semibold text-[#97A4B5]">
              {isAr ? 'وسيلة الدفع:' : 'Payment Method:'}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentMethod('mada')}
                className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'mada'
                    ? 'bg-[#C9A45C] text-[#050B14] border-[#C9A45C]'
                    : 'bg-[#050B14] text-[#97A4B5] border-[#233247] hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>{isAr ? 'مدى Mada' : 'Mada'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#C9A45C] text-[#050B14] border-[#C9A45C]'
                    : 'bg-[#050B14] text-[#97A4B5] border-[#233247] hover:text-white'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>{isAr ? 'نقداً Cash' : 'Cash'}</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('debt')}
                className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
                  paymentMethod === 'debt'
                    ? 'bg-amber-500 text-[#050B14] border-amber-500 font-black'
                    : 'bg-[#050B14] text-[#97A4B5] border-[#233247] hover:text-white'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>{isAr ? 'آجل (دين)' : 'Credit'}</span>
              </button>
            </div>

            {/* If Cash, show tendered input & quick notes */}
            {paymentMethod === 'cash' && (
              <div className="bg-[#050B14] p-3 rounded-xl border border-[#233247] space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#97A4B5]">{isAr ? 'المبلغ المستلم:' : 'Cash Given:'}</span>
                  <input
                    type="number"
                    value={cashTendered}
                    onChange={e => setCashTendered(e.target.value)}
                    placeholder={String(grandTotal)}
                    className="w-28 bg-[#101B2C] border border-[#233247] rounded-lg px-2.5 py-1 text-end text-sm text-white font-bold focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
                {cashGiven >= grandTotal && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold pt-1 border-t border-[#233247]">
                    <span>{isAr ? 'المبلغ المتبقي للعميل (الباقي):' : 'Change Due:'}</span>
                    <span>{changeDue.toFixed(2)} {currencySymbol}</span>
                  </div>
                )}
              </div>
            )}

            {/* If Debt, prompt for customer info */}
            {paymentMethod === 'debt' && (
              <div className="bg-[#050B14] p-3 rounded-xl border border-amber-500/30 space-y-2 animate-in fade-in">
                <p className="text-[11px] text-amber-400 font-semibold">{isAr ? 'بيانات العميل لقيد الذمة الآجلة:' : 'Customer Debt Ledger:'}</p>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder={isAr ? 'اسم العميل / الشركة' : 'Customer Name'}
                  className="w-full bg-[#101B2C] border border-[#233247] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9A45C]"
                />
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                  className="w-full bg-[#101B2C] border border-[#233247] rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            )}

            {/* Complete Sale Button */}
            <button
              onClick={handleCompleteSale}
              disabled={posCart.length === 0}
              className={`w-full py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
                posCart.length > 0
                  ? 'bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] hover:shadow-[#C9A45C]/30 hover:scale-[1.01]'
                  : 'bg-[#233247] text-[#97A4B5] cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isAr ? `تأكيد الدفع (${grandTotal.toLocaleString()} ${currencySymbol})` : `Charge ${grandTotal.toLocaleString()} ${currencySymbol}`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Thermal Receipt Print / Preview Modal */}
      {completedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-[#233247] flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#C9A45C]">
                <Receipt className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">{isAr ? 'إيصال ضريبي مبسط (ZATCA)' : 'ZATCA Tax Receipt'}</h3>
              </div>
              <button onClick={() => setCompletedReceipt(null)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thermal Slip Content */}
            <div className="p-6 bg-white text-black font-mono text-xs space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="text-center space-y-1">
                <h2 className="text-base font-black uppercase">{completedReceipt.storeName}</h2>
                <p className="text-[11px] text-neutral-600">{isAr ? 'المملكة العربية السعودية' : 'Kingdom of Saudi Arabia'}</p>
                <p className="text-[11px] text-neutral-600 font-bold">الرقم الضريبي: {completedReceipt.vatNumber}</p>
                <div className="border-b border-dashed border-neutral-400 my-2" />
                <p className="text-[11px] font-bold">فاتورة ضريبية مبسطة</p>
                <p className="text-[10px] text-neutral-500">رقم الفاتورة: {completedReceipt.receiptNumber}</p>
                <p className="text-[10px] text-neutral-500">{new Date(completedReceipt.timestamp).toLocaleString('ar-SA')}</p>
              </div>

              <div className="border-b border-dashed border-neutral-400" />

              {/* Items List */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold border-b border-neutral-300 pb-1">
                  <span>الصنف</span>
                  <span>الكمية × السعر</span>
                  <span>الإجمالي</span>
                </div>
                {completedReceipt.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="font-semibold truncate max-w-[140px]">{item.name}</span>
                    <span>{item.quantity} × {item.unitPrice}</span>
                    <span className="font-bold">{item.total.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-neutral-400" />

              {/* Totals */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span>{completedReceipt.subtotal.toFixed(2)} ر.س</span>
                </div>
                {completedReceipt.discount > 0 && (
                  <div className="flex justify-between text-neutral-600">
                    <span>الخصم الممنوح:</span>
                    <span>-{completedReceipt.discount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ضريبة القيمة المضافة (15%):</span>
                  <span>{completedReceipt.taxAmount.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t border-black pt-1">
                  <span>الإجمالي شامل الضريبة:</span>
                  <span>{completedReceipt.total.toFixed(2)} ر.س</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="text-center pt-2 flex flex-col items-center">
                <div className="w-28 h-28 bg-neutral-100 border border-neutral-300 p-2 flex items-center justify-center">
                  <QrCode className="w-full h-full text-black" />
                </div>
                <p className="text-[9px] text-neutral-500 mt-1">مشفر طبقاً لمعايير هيئة الزكاة والضريبة والجمارك (ZATCA Phase 2)</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#233247] bg-[#101B2C] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>{isAr ? 'طباعة الإيصال الحراري' : 'Print Receipt'}</span>
              </button>
              <button
                onClick={() => setCompletedReceipt(null)}
                className="px-4 py-2.5 rounded-xl bg-[#233247] hover:bg-[#324560] text-white text-xs font-bold"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
