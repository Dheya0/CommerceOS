import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  X, 
  Phone, 
  Mail, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  Calendar,
  Receipt
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Order } from '../../types';

interface GuestOrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderId?: string;
}

export const GuestOrderTrackingModal: React.FC<GuestOrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderId = ''
}) => {
  const { orders, activeTenant } = useCommerce();

  const [orderQuery, setOrderQuery] = useState(initialOrderId);
  const [contactQuery, setContactQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearched(true);

    setTimeout(() => {
      const q = orderQuery.trim().toLowerCase();
      const contact = contactQuery.trim().toLowerCase();

      const matched = orders.find(ord => {
        const matchId = ord.id.toLowerCase() === q || ord.orderNumber.toLowerCase() === q;
        if (!matchId) return false;

        // If contact query provided, verify phone or email
        if (contact) {
          const matchPhone = ord.customer.phone.replace(/\s+/g, '').includes(contact.replace(/\s+/g, ''));
          const matchEmail = ord.customer.email.toLowerCase().includes(contact);
          return matchPhone || matchEmail;
        }
        return true;
      });

      setFoundOrder(matched || null);
      setIsSearching(false);
    }, 400);
  };

  const getTimelineSteps = (order: Order) => {
    const steps = [
      {
        key: 'placed',
        titleAr: 'تم استلام الطلب',
        descriptionAr: 'تم توثيق طلبك في النظام بنجاح',
        date: new Date(order.createdAt).toLocaleDateString('ar-SA'),
        isCompleted: true,
        isCurrent: order.status === 'new'
      },
      {
        key: 'paid',
        titleAr: order.paymentStatus === 'paid' ? 'تم تأكيد الدفع' : 'قيد تأكيد الدفع',
        descriptionAr: order.paymentStatus === 'paid' ? 'تم استلام وتأكيد الحوالة/المدفوعات' : 'بانتظار مراجعة الإيصال البنكي أو بوابة الدفع',
        date: order.paymentStatus === 'paid' ? 'مؤكد ✓' : 'قيد المراجعة',
        isCompleted: order.paymentStatus === 'paid',
        isCurrent: order.status === 'new' && order.paymentStatus !== 'paid'
      },
      {
        key: 'processing',
        titleAr: 'جاري التجهيز والتغليف',
        descriptionAr: 'يقوم فريق المستودع بفحص وتجهيز المنتجات',
        date: 'قيد التنفيذ',
        isCompleted: ['processing', 'shipped', 'delivered'].includes(order.status),
        isCurrent: order.status === 'processing'
      },
      {
        key: 'shipped',
        titleAr: 'تم الشحن والتسليم لشركة النقل',
        descriptionAr: `رقم بوليصة الشحن: ${(order as any).trackingNumber || 'TRK-SA-' + order.id.slice(-6)}`,
        date: order.status === 'shipped' || order.status === 'delivered' ? 'في الطريق' : 'بانتظار الناقل',
        isCompleted: ['shipped', 'delivered'].includes(order.status),
        isCurrent: order.status === 'shipped'
      },
      {
        key: 'delivered',
        titleAr: 'تم التوصيل بنجاح',
        descriptionAr: 'تم استلام الشحنة وتأكيد التسليم للعميل',
        date: order.status === 'delivered' ? 'مكتمل' : 'المتوقع: خلال 48 ساعة',
        isCompleted: order.status === 'delivered',
        isCurrent: order.status === 'delivered'
      }
    ];
    return steps;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      dir="rtl"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 text-right animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">تتبع حالة طلبك المباشرة</h3>
              <p className="text-xs text-zinc-400 mt-0.5">أدخل رقم الطلب لمعرفة أحدث مسار وتحديثات الشحن</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                رقم الطلب (Order ID) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="مثال: ORD-1002 أو رقم المعرف"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                رقم الجوال أو البريد للتحقق (اختياري)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={contactQuery}
                  onChange={(e) => setContactQuery(e.target.value)}
                  placeholder="05XXXXXXXX أو البريد"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSearching || !orderQuery.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>استعلام عن حالة الشحنة</span>
          </button>
        </form>

        {/* Search Results */}
        {searched && (
          <div>
            {foundOrder ? (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Order Summary Pill */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                    <div>
                      <span className="text-xs text-zinc-400">الطلب: </span>
                      <strong className="text-xs font-mono text-white">{foundOrder.orderNumber}</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        foundOrder.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        foundOrder.status === 'shipped' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        foundOrder.status === 'processing' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {foundOrder.status === 'delivered' ? 'تم التوصيل' :
                         foundOrder.status === 'shipped' ? 'جاري الشحن' :
                         foundOrder.status === 'processing' ? 'قيد التجهيز' : 'قيد الانتظار'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[11px]">العميل المستلم</span>
                      <span className="font-bold text-zinc-200">{foundOrder.customer.name}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">المدينة والتوصيل</span>
                      <span className="font-bold text-zinc-200">{foundOrder.customer.city}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[11px]">الإجمالي المطلوب</span>
                      <span className="font-bold text-emerald-400 font-mono">{foundOrder.total} {activeTenant.currency}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Stepper Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-zinc-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    مراحل تقدم الشحنة
                  </h4>

                  <div className="space-y-3 relative before:absolute before:top-2 before:bottom-2 before:right-3.5 before:w-0.5 before:bg-zinc-800">
                    {getTimelineSteps(foundOrder).map((step, idx) => (
                      <div key={idx} className="relative flex items-start gap-3.5 group">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 font-mono text-[11px] font-bold border transition-colors ${
                          step.isCompleted
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
                            : step.isCurrent
                            ? 'bg-blue-500 text-white border-blue-400 animate-pulse'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}>
                          {step.isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div className="flex-1 pb-1 text-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`font-bold ${step.isCompleted ? 'text-white' : step.isCurrent ? 'text-blue-400' : 'text-zinc-500'}`}>
                              {step.titleAr}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-mono">{step.date}</span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{step.descriptionAr}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Items in the Order */}
                <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <span className="text-xs font-bold text-zinc-400 block">محتويات الشحنة ({foundOrder.items.length} عناصر):</span>
                  <div className="space-y-1.5">
                    {foundOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-xs text-zinc-300">
                        <div className="flex items-center gap-2">
                          <img src={item.image} alt={item.productName} className="w-8 h-8 rounded-lg object-cover bg-zinc-800" />
                          <span>{item.productName} {item.variantName ? `(${item.variantName})` : ''}</span>
                        </div>
                        <span className="font-mono text-zinc-400">×{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-zinc-950 border border-rose-900/30 text-center space-y-2 animate-in fade-in">
                <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <h4 className="text-xs font-bold text-white">لم يتم العثور على هذا الطلب</h4>
                <p className="text-[11px] text-zinc-400">
                  يرجى التأكد من كتابة رقم الطلب بصورة صحيحة، أو التواصل مع خدمة عملاء المتجر للمساعدة المباشرة.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
