import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Truck, 
  AlertCircle,
  Eye,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Order } from '../../types';

interface OrdersViewProps {
  onSelectOrder: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onSelectOrder }) => {
  const { orders, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث قائمة الطلبات بنجاح' : 'Orders refreshed successfully', 'success');
    }, 600);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const completedCount = orders.filter(o => o.status === 'delivered' || o.status === 'shipped').length;

  const toggleSelectAll = () => {
    if (selectedOrderIds.length === filteredOrders.length) {
      setSelectedOrderIds([]);
    } else {
      setSelectedOrderIds(filteredOrders.map(o => o.id));
    }
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'إدارة الطلبات' : 'Orders Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr ? 'متابعة ومعالجة جميع طلبات العملاء وتحديث حالات الشحن والدفع.' : 'Monitor and fulfill customer orders and update shipping and payment states.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-xs font-semibold ${
              isRefreshing ? 'animate-pulse text-[#D4AF37]' : ''
            }`}
            title={isAr ? 'تحديث' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isAr ? 'تحديث' : 'Refresh'}</span>
          </button>

          <button
            onClick={() => showToast(isAr ? 'جاري تصدير تقرير الطلبات (CSV)...' : 'Exporting orders report (CSV)...', 'info')}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{isAr ? 'تصدير' : 'Export'}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'إجمالي الطلبات' : 'Total Orders'}</div>
          <div className="mt-2 text-2xl font-black text-white">{orders.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'جميع الطلبات المسجلة' : 'All recorded orders'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'الطلبات قيد المعالجة' : 'Pending & Processing'}</div>
          <div className="mt-2 text-2xl font-black text-amber-400">{pendingCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'تتطلب تجهيزاً أو شحناً' : 'Require fulfillment'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'الطلبات المكتملة' : 'Completed Orders'}</div>
          <div className="mt-2 text-2xl font-black text-emerald-400">{completedCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'تم شحنها أو تسليمها' : 'Shipped or delivered'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</div>
          <div className="mt-2 text-2xl font-black text-[#D4AF37]">{totalRevenue.toLocaleString()} <span className="text-xs">{currency}</span></div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'قيمة الطلبات الإجمالية' : 'Gross orders value'}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث برقم الطلب، اسم العميل، أو البريد...' : 'Search order #, customer name, email...'}
            className="w-full ps-10 pe-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#07111F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="pending">{isAr ? 'معلق (Pending)' : 'Pending'}</option>
            <option value="processing">{isAr ? 'قيد المعالجة (Processing)' : 'Processing'}</option>
            <option value="shipped">{isAr ? 'تم الشحن (Shipped)' : 'Shipped'}</option>
            <option value="delivered">{isAr ? 'مكتمل / تم التسليم' : 'Delivered'}</option>
            <option value="cancelled">{isAr ? 'ملغي (Cancelled)' : 'Cancelled'}</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#07111F] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            <option value="all">{isAr ? 'جميع حالات الدفع' : 'All Payments'}</option>
            <option value="paid">{isAr ? 'مدفوع (Paid)' : 'Paid'}</option>
            <option value="pending">{isAr ? 'معلق الدفع' : 'Pending Payment'}</option>
            <option value="failed">{isAr ? 'فشل الدفع' : 'Failed'}</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لا توجد طلبات مطابقة لبحثك' : 'No orders found'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isAr ? 'لم يتم العثور على طلبات تطابق الفلاتر أو كلمات البحث الحالية.' : 'Try adjusting your search query or status filters.'}
            </p>
            {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all' ? (
              <button
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); setPaymentFilter('all'); }}
                className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-all"
              >
                {isAr ? 'مسح الفلاتر' : 'Clear filters'}
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold">
                  <th className="p-4 w-10 text-center">
                    <input 
                      type="checkbox"
                      checked={selectedOrderIds.length === filteredOrders.length && filteredOrders.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'رقم الطلب' : 'Order #'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'المنتجات' : 'Items'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'المبلغ الإجمالي' : 'Total'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'حالة الدفع' : 'Payment'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'التاريخ' : 'Date'}</th>
                  <th className="p-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.map(order => {
                  const isSelected = selectedOrderIds.includes(order.id);
                  return (
                    <tr 
                      key={order.id}
                      onClick={() => onSelectOrder(order.id)}
                      className={`hover:bg-white/[0.04] transition-colors cursor-pointer group ${
                        isSelected ? 'bg-[#D4AF37]/10' : ''
                      }`}
                    >
                      <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOrder(order.id)}
                          className="rounded border-white/20 bg-black/40 text-[#D4AF37] focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-4 font-black text-white group-hover:text-[#D4AF37] transition-colors">
                        {order.orderNumber}
                      </td>
                      <td className="py-4">
                        <div className="font-bold text-slate-200">{order.customerName}</div>
                        <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                      </td>
                      <td className="py-4 text-slate-300">
                        {order.items.length} {isAr ? 'منتج(ات)' : 'item(s)'}
                      </td>
                      <td className="py-4 font-bold text-[#D4AF37]">
                        {order.total.toLocaleString()} {currency}
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          order.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          order.paymentStatus === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                          order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          order.status === 'shipped' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                          order.status === 'processing' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                          order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-end" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onSelectOrder(order.id)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-[#07111F] text-slate-300 transition-all font-semibold inline-flex items-center gap-1.5 text-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isAr ? 'عرض' : 'View'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
