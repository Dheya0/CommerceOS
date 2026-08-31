import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  RefreshCw, 
  ShoppingBag, 
  Mail, 
  Phone, 
  ArrowRight,
  Eye,
  UserCheck
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { Customer } from '../../types';

interface CustomersViewProps {
  onSelectCustomer?: (customerId: string) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onSelectCustomer }) => {
  const { customers, orders, activeTenant, language, showToast } = useCommerce();
  const isAr = language === 'ar';
  const currency = activeTenant.currency || 'SAR';

  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(isAr ? 'تم تحديث قائمة العملاء بنجاح' : 'Customers refreshed successfully', 'success');
    }, 600);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {isAr ? 'إدارة العملاء (CRM)' : 'Customers Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isAr ? 'متابعة سجل العملاء، المشتريات الإجمالية، وبيانات التواصل.' : 'Monitor customer profiles, total spend, and purchase history.'}
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'إجمالي العملاء' : 'Total Customers'}</div>
          <div className="mt-2 text-2xl font-black text-white">{customers.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'العملاء المسجلين في المتجر' : 'Registered store customers'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'العملاء النشطون هذا الشهر' : 'Active This Month'}</div>
          <div className="mt-2 text-2xl font-black text-[#D4AF37]">{customers.length}</div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'أتموا عمليات شراء' : 'Completed purchases'}</div>
        </div>

        <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-bold text-slate-400">{isAr ? 'متوسط قيمة العميل' : 'Avg. Customer Value'}</div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {customers.length > 0 ? Math.round(customers.reduce((acc, c) => acc + c.totalSpent, 0) / customers.length) : 0} <span className="text-xs">{currency}</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">{isAr ? 'إجمالي المشتريات لكل عميل' : 'Lifetime spend per customer'}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'البحث بالاسم أو البريد الإلكتروني...' : 'Search by name or email...'}
            className="w-full ps-10 pe-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[#0B1626]/80 border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white">{isAr ? 'لا يوجد عملاء بعد' : 'No customers found'}</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {isAr ? 'سيظهر العملاء هنا تلقائياً بمجرد إتمام عمليات الشراء في المتجر.' : 'Customers will appear here automatically once purchases are completed.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-semibold">
                  <th className="pb-4 pt-4 px-4 text-start">{isAr ? 'العميل' : 'Customer'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'عدد الطلبات' : 'Orders'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                  <th className="pb-4 pt-4 text-start">{isAr ? 'تاريخ الانضمام' : 'Joined'}</th>
                  <th className="p-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="py-4 px-4 font-bold text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#C59B27] text-[#07111F] font-black flex items-center justify-center text-xs shadow-md">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-white font-bold">{customer.name}</div>
                        <div className="text-[11px] text-slate-400">{customer.phone || (isAr ? 'بدون هاتف' : 'No phone')}</div>
                      </div>
                    </td>
                    <td className="py-4 text-slate-300">{customer.email}</td>
                    <td className="py-4">
                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-slate-200 font-bold">
                        {customer.ordersCount} {isAr ? 'طلب' : 'orders'}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-[#D4AF37]">
                      {customer.totalSpent.toLocaleString()} {currency}
                    </td>
                    <td className="py-4 text-slate-400">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-end">
                      <button
                        onClick={() => onSelectCustomer && onSelectCustomer(customer.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#D4AF37] hover:text-[#07111F] text-slate-300 transition-all font-semibold inline-flex items-center gap-1.5 text-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isAr ? 'الملف' : 'Profile'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
