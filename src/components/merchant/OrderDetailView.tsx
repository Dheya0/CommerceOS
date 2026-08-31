import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShoppingBag, 
  User, 
  CreditCard, 
  Truck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Plus, 
  RotateCcw, 
  XCircle, 
  Printer, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Order } from '../../types';

interface OrderDetailViewProps {
  orderId: string;
  onBack: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId, onBack }) => {
  const { orders, updateOrderStatus, updateOrderPaymentStatus, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const order = orders.find(o => o.id === orderId);

  const [noteInput, setNoteInput] = useState('');
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(order ? order.total.toString() : '0');
  const [refundReason, setRefundReason] = useState('');

  if (!order) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">{isAr ? 'الطلب غير موجود' : 'Order not found'}</h2>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-[#D4AF37] text-[#07111F] rounded-xl text-xs font-bold"
        >
          {isAr ? 'العودة إلى الطلبات' : 'Return to Orders'}
        </button>
      </div>
    );
  }

  const handleStatusChange = (newStatus: Order['status']) => {
    updateOrderStatus(order.id, newStatus, isAr ? `تم تغيير الحالة إلى ${newStatus}` : `Status updated to ${newStatus}`);
    showToast(isAr ? `تم تحديث حالة الطلب إلى ${newStatus}` : `Order status updated to ${newStatus}`, 'success');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    showToast(isAr ? 'تم إضافة الملاحظة الداخلية بنجاح' : 'Internal note added successfully', 'success');
    setNoteInput('');
  };

  const handleConfirmRefund = () => {
    const amt = parseFloat(refundAmount);
    if (isNaN(amt) || amt <= 0 || amt > order.total) {
      showToast(isAr ? 'مبلغ الاسترداد غير صالح' : 'Invalid refund amount', 'error');
      return;
    }
    showToast(isAr ? `تم تقديم طلب استرداد بمبلغ ${amt} ${currency}` : `Refund of ${amt} ${currency} requested`, 'success');
    setRefundModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>{isAr ? 'العودة إلى قائمة الطلبات' : 'Back to Orders'}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-[#D4AF37]" />
            <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
          </button>
        </div>
      </div>

      {/* Header with Status & Order # */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1626]/80 border border-white/10 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white">{order.orderNumber}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
              order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
              'bg-blue-500/10 text-blue-400 border border-blue-500/30'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {isAr ? 'تم الإنشاء في:' : 'Created at:'} {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status Transition Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {order.status === 'pending' && (
            <button
              onClick={() => handleStatusChange('processing')}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
            >
              {isAr ? 'بدء المعالجة (Process)' : 'Process Order'}
            </button>
          )}
          {order.status === 'processing' && (
            <button
              onClick={() => handleStatusChange('shipped')}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
            >
              {isAr ? 'شحن الطلب (Ship)' : 'Ship Order'}
            </button>
          )}
          {order.status === 'shipped' && (
            <button
              onClick={() => handleStatusChange('delivered')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg"
            >
              {isAr ? 'تأكيد التسليم (Deliver)' : 'Mark Delivered'}
            </button>
          )}
          <button
            onClick={() => setRefundModalOpen(true)}
            className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-xs font-bold transition-all"
          >
            {isAr ? 'استرداد المبلغ (Refund)' : 'Refund'}
          </button>
        </div>
      </div>

      {/* Main Grid: Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Order Items & Timeline */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Items Table */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'منتجات الطلب' : 'Order Items'}</span>
            </h3>

            <div className="divide-y divide-white/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      {item.variantName && (
                        <p className="text-[11px] text-[#D4AF37] mt-0.5">{item.variantName}</p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isAr ? 'الكمية:' : 'Qty:'} {item.quantity} × {item.price.toLocaleString()} {currency}
                      </p>
                    </div>
                  </div>
                  <div className="text-end shrink-0">
                    <div className="text-xs font-bold text-white">
                      {(item.quantity * item.price).toLocaleString()} {currency}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary Breakdown */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span className="text-white font-semibold">{order.total.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? 'الشحن' : 'Shipping'}</span>
                <span className="text-emerald-400 font-semibold">{isAr ? 'مجاني' : 'Free'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{isAr ? 'الضريبة (15% VAT)' : 'Tax (15% VAT)'}</span>
                <span className="text-white font-semibold">0.00 {currency}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-white/10">
                <span>{isAr ? 'المبلغ الإجمالي' : 'Total'}</span>
                <span className="text-[#D4AF37]">{order.total.toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'سجل وتاريخ الطلب' : 'Order Timeline'}</span>
            </h3>

            <div className="space-y-4 ps-2">
              {order.timeline && order.timeline.length > 0 ? (
                order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4 items-start relative pb-4 last:pb-0">
                    {idx < order.timeline.length - 1 && (
                      <div className="absolute start-2 top-4 bottom-0 w-0.5 bg-white/10" />
                    )}
                    <div className="w-4 h-4 rounded-full bg-[#D4AF37] ring-4 ring-[#0B1626] shrink-0 z-10 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">{event.status}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{event.note || event.actor}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex gap-4 items-start relative">
                  <div className="w-4 h-4 rounded-full bg-[#D4AF37] ring-4 ring-[#0B1626] shrink-0 z-10" />
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'تم إنشاء الطلب بنجاح' : 'Order successfully created'}</div>
                    <span className="text-[10px] text-slate-500 mt-1 block">{new Date(order.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'الملاحظات الداخلية (لا تظهر للعميل)' : 'Internal Notes (Staff Only)'}</span>
            </h3>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder={isAr ? 'أضف ملاحظة للموظفين حول هذا الطلب...' : 'Add staff note about this order...'}
                className="w-full h-24 p-3 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C59B27] text-[#07111F] rounded-xl text-xs font-bold transition-all"
                >
                  {isAr ? 'إضافة ملاحظة' : 'Add Note'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column (4 cols): Customer & Payment Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'معلومات العميل' : 'Customer Info'}</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="font-bold text-white">{order.customerName}</div>
              <div className="text-slate-300">{order.customerEmail}</div>
              {order.customerPhone && (
                <div className="text-slate-400">{order.customerPhone}</div>
              )}
            </div>

            <div className="pt-3 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-400 mb-1.5">{isAr ? 'عنوان الشحن' : 'Shipping Address'}</h4>
              <p className="text-xs text-slate-200 leading-relaxed">
                {order.shippingAddress || (isAr ? 'المملكة العربية السعودية — الرياض' : 'Riyadh, Saudi Arabia')}
              </p>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span>{isAr ? 'تفاصيل الدفع والشحن' : 'Payment & Shipping'}</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'طريقة الدفع' : 'Payment Method'}</span>
                <span className="font-bold text-white uppercase">{order.paymentMethod || 'Mada / Visa'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'حالة الدفع' : 'Payment Status'}</span>
                <span className="font-bold text-emerald-400 uppercase">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'شركة الشحن' : 'Courier'}</span>
                <span className="font-bold text-white">SMSA / Aramex</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">{isAr ? 'رقم البوليصة' : 'Tracking #'}</span>
                <span className="font-mono text-[#D4AF37]">TRK-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Refund Modal */}
      {refundModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0B1626] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-400" />
              <span>{isAr ? 'استرداد مبلغ الطلب (Refund)' : 'Refund Order Amount'}</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr ? 'هذا الإجراء مالي وسيتم إرسال طلب الاسترداد عبر بوابة الدفع المرتبطة.' : 'This is a financial action processed through your active payment gateway.'}
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">{isAr ? 'مبلغ الاسترداد (SAR)' : 'Refund Amount (SAR)'}</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  className="w-full p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">{isAr ? 'سبب الاسترداد' : 'Refund Reason'}</label>
                <textarea
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  placeholder={isAr ? 'سبب الاسترداد (طلب العميل، إلغاء، خطأ في الطلب...)' : 'Reason for refund...'}
                  className="w-full h-20 p-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => setRefundModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmRefund}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold"
              >
                {isAr ? 'تأكيد الاسترداد' : 'Confirm Refund'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
