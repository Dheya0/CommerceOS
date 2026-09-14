import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { DebtRecord, DebtTransaction } from '../../types';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  User, 
  Phone, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  Receipt, 
  ChevronRight,
  X,
  Trash2,
  FileText,
  Building2,
  Wallet
} from 'lucide-react';

export const DebtsView: React.FC = () => {
  const { debts, addDebt, recordDebtPayment, deleteDebt, activeTenant, language } = useCommerce();
  const isAr = language === 'ar';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receivable' | 'payable'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'partially_paid' | 'settled' | 'overdue'>('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDebtForPayment, setSelectedDebtForPayment] = useState<DebtRecord | null>(null);
  const [selectedDebtForDetails, setSelectedDebtForDetails] = useState<DebtRecord | null>(null);

  // New Debt Form State
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonPhone, setNewPersonPhone] = useState('');
  const [newPersonType, setNewPersonType] = useState<'customer' | 'supplier'>('customer');
  const [newType, setNewType] = useState<'receivable' | 'payable'>('receivable');
  const [newTotalAmount, setNewTotalAmount] = useState('');
  const [newPaidAmount, setNewPaidAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Payment Form State
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<DebtTransaction['paymentMethod']>('bank_transfer');
  const [payNote, setPayNote] = useState('');

  // Calculations
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const totalReceivable = debts
    .filter(d => d.type === 'receivable')
    .reduce((acc, d) => acc + d.remainingAmount, 0);

  const totalPayable = debts
    .filter(d => d.type === 'payable')
    .reduce((acc, d) => acc + d.remainingAmount, 0);

  const filteredDebts = debts.filter(debt => {
    const matchesSearch = 
      debt.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      debt.personPhone.includes(searchTerm) ||
      (debt.notes && debt.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || debt.type === filterType;
    const matchesStatus = filterStatus === 'all' || debt.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName || !newTotalAmount || !newDueDate) return;

    if (!activeTenant) return;

    const total = parseFloat(newTotalAmount) || 0;
    const initialPaid = parseFloat(newPaidAmount) || 0;

    addDebt({
      tenantId: activeTenant.id,
      personName: newPersonName,
      personPhone: newPersonPhone,
      personType: newPersonType,
      type: newType,
      totalAmount: total,
      paidAmount: initialPaid,
      dueDate: newDueDate,
      notes: newNotes
    });

    // Reset Form
    setNewPersonName('');
    setNewPersonPhone('');
    setNewTotalAmount('');
    setNewPaidAmount('');
    setNewDueDate('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDebtForPayment || !payAmount) return;

    const amount = parseFloat(payAmount) || 0;
    if (amount <= 0) return;

    recordDebtPayment(selectedDebtForPayment.id, amount, payMethod, payNote);
    setSelectedDebtForPayment(null);
    setPayAmount('');
    setPayNote('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20">
              {isAr ? 'الإدارة المالية المتقدمة' : 'Financial Ledger'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Wallet className="w-6 h-6 text-[#C9A45C]" />
            {isAr ? 'سجل الحسابات الآجلة والديون' : 'Debts & Receivables'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'متابعة الذمم المدينة للعملاء والمستحقات الدائنة للموردين مع تحصيل الدفعات وإصدار السندات'
              : 'Track customer credit accounts and supplier payables with payment reconciliation'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-sm shadow-lg shadow-[#C9A45C]/20 hover:shadow-[#C9A45C]/30 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'تسجيل حساب آجل جديد' : 'New Debt Record'}</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'مستحقات لنا (ذمم مدينة - عملاء)' : 'Receivables (Due from Customers)'}</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">
              {totalReceivable.toLocaleString()} <span className="text-xs font-normal text-[#97A4B5]">{currencySymbol}</span>
            </p>
            <p className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              {isAr ? 'مبالغ سيتم تحصيلها للمتجر' : 'Incoming cash flow'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'مستحقات علينا (ذمم دائنة - موردين)' : 'Payables (Due to Suppliers)'}</p>
            <p className="text-2xl font-black text-rose-400 mt-1">
              {totalPayable.toLocaleString()} <span className="text-xs font-normal text-[#97A4B5]">{currencySymbol}</span>
            </p>
            <p className="text-[11px] text-rose-500/80 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              {isAr ? 'التزامات ومستحقات واجبة السداد' : 'Outbound obligations'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <CreditCard className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'صافي الموقف الائتماني' : 'Net Credit Position'}</p>
            <p className={`text-2xl font-black mt-1 ${totalReceivable - totalPayable >= 0 ? 'text-[#C9A45C]' : 'text-amber-400'}`}>
              {(totalReceivable - totalPayable).toLocaleString()} <span className="text-xs font-normal text-[#97A4B5]">{currencySymbol}</span>
            </p>
            <p className="text-[11px] text-[#97A4B5] mt-1">
              {isAr ? `${debts.length} حساب مسجل بالسجلات` : `${debts.length} active records in ledger`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/20 flex items-center justify-center text-[#C9A45C]">
            <Receipt className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1422] p-4 rounded-xl border border-[#233247] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#97A4B5] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث باسم الطرف، الهاتف، أو الملاحظات...' : 'Search by name, phone, notes...'}
            className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-9 pe-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Type Filter */}
          <div className="flex bg-[#050B14] p-1 rounded-xl border border-[#233247]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'all' ? 'bg-[#C9A45C] text-[#050B14] font-bold' : 'text-[#97A4B5] hover:text-white'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('receivable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'receivable' ? 'bg-emerald-500 text-white font-bold' : 'text-[#97A4B5] hover:text-white'
              }`}
            >
              {isAr ? 'لنا (عملاء)' : 'Receivables'}
            </button>
            <button
              onClick={() => setFilterType('payable')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filterType === 'payable' ? 'bg-rose-500 text-white font-bold' : 'text-[#97A4B5] hover:text-white'
              }`}
            >
              {isAr ? 'علينا (موردين)' : 'Payables'}
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A45C]"
          >
            <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
            <option value="pending">{isAr ? 'بانتظار السداد' : 'Pending'}</option>
            <option value="partially_paid">{isAr ? 'سداد جزئي' : 'Partially Paid'}</option>
            <option value="settled">{isAr ? 'تمت التسوية بالكامل' : 'Settled'}</option>
            <option value="overdue">{isAr ? 'متأخرة عن الاستحقاق' : 'Overdue'}</option>
          </select>
        </div>
      </div>

      {/* Debts Table */}
      <div className="bg-[#0B1422] rounded-xl border border-[#233247] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#101B2C] text-[#97A4B5] text-xs uppercase border-b border-[#233247]">
              <tr>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'الطرف / الحساب' : 'Party / Account'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'نوع الذمة' : 'Type'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'الإجمالي' : 'Total'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'المدفوع' : 'Paid'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'المتبقي' : 'Remaining'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="px-5 py-3.5 text-end font-semibold">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233247]">
              {filteredDebts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#97A4B5]">
                    <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#C9A45C]" />
                    <p className="text-base font-semibold text-white">{isAr ? 'لا توجد سجلات مطابقة للبحث' : 'No matching debt records'}</p>
                    <p className="text-xs text-[#97A4B5] mt-1">{isAr ? 'قم بإضافة حساب آجل جديد أو تعديل معايير الفلترة' : 'Add a new record or adjust filters'}</p>
                  </td>
                </tr>
              ) : (
                filteredDebts.map(debt => (
                  <tr key={debt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          debt.personType === 'customer' 
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}>
                          {debt.personType === 'customer' ? <User className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-white">{debt.personName}</p>
                          <p className="text-xs text-[#97A4B5] flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {debt.personPhone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {debt.type === 'receivable' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <ArrowDownLeft className="w-3 h-3" />
                          {isAr ? 'لنا (عميل)' : 'Receivable'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <ArrowUpRight className="w-3 h-3" />
                          {isAr ? 'علينا (مورد)' : 'Payable'}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 font-bold text-white">
                      {debt.totalAmount.toLocaleString()} <span className="text-xs text-[#97A4B5]">{currencySymbol}</span>
                    </td>

                    <td className="px-5 py-4 text-emerald-400 font-semibold">
                      {debt.paidAmount.toLocaleString()} <span className="text-xs text-[#97A4B5]">{currencySymbol}</span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`font-bold ${debt.remainingAmount > 0 ? 'text-amber-400' : 'text-[#97A4B5]'}`}>
                        {debt.remainingAmount.toLocaleString()} <span className="text-xs">{currencySymbol}</span>
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-[#97A4B5]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                        {debt.dueDate}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {debt.status === 'settled' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {isAr ? 'مسدد بالكامل' : 'Settled'}
                        </span>
                      ) : debt.status === 'partially_paid' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" />
                          {isAr ? 'سداد جزئي' : 'Partial'}
                        </span>
                      ) : debt.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          {isAr ? 'متأخر' : 'Overdue'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Clock className="w-3 h-3" />
                          {isAr ? 'بانتظار السداد' : 'Pending'}
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        {debt.remainingAmount > 0 && (
                          <button
                            onClick={() => setSelectedDebtForPayment(debt)}
                            className="px-3 py-1.5 rounded-lg bg-[#C9A45C]/10 text-[#C9A45C] hover:bg-[#C9A45C] hover:text-[#050B14] text-xs font-bold transition-all border border-[#C9A45C]/30 flex items-center gap-1"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تسجيل دفعة' : 'Pay'}</span>
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedDebtForDetails(debt)}
                          className="p-1.5 rounded-lg text-[#97A4B5] hover:text-white hover:bg-white/5 transition-colors"
                          title={isAr ? 'عرض الحركات والتفاصيل' : 'View Transactions'}
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا السجل؟' : 'Delete this record?')) {
                              deleteDebt(debt.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title={isAr ? 'حذف السجل' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Debt Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C9A45C]" />
                {isAr ? 'تسجيل حساب آجل جديد' : 'New Debt Record'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDebt} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'نوع الطرف' : 'Party Type'}
                  </label>
                  <select
                    value={newPersonType}
                    onChange={e => {
                      const val = e.target.value as 'customer' | 'supplier';
                      setNewPersonType(val);
                      setNewType(val === 'customer' ? 'receivable' : 'payable');
                    }}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="customer">{isAr ? 'عميل (ذمة مدينة لنا)' : 'Customer'}</option>
                    <option value="supplier">{isAr ? 'مورد (ذمة دائنة علينا)' : 'Supplier'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'طبيعة الدين' : 'Debt Type'}
                  </label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as 'receivable' | 'payable')}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="receivable">{isAr ? 'مستحق لنا (Receivable)' : 'Receivable'}</option>
                    <option value="payable">{isAr ? 'مستحق علينا (Payable)' : 'Payable'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'اسم الطرف / الشركة / العميل' : 'Party / Client Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newPersonName}
                  onChange={e => setNewPersonName(e.target.value)}
                  placeholder={isAr ? 'مثال: فندق الريتز كارلتون أو الشيخ فيصل' : 'e.g. John Doe'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'رقم الهاتف / التواصل' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={newPersonPhone}
                  onChange={e => setNewPersonPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? `إجمالي المبلغ (${currencySymbol})` : `Total Amount (${currencySymbol})`} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={newTotalAmount}
                    onChange={e => setNewTotalAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? `الدفعة الأولى إن وجدت (${currencySymbol})` : `Initial Deposit (${currencySymbol})`}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPaidAmount}
                    onChange={e => setNewPaidAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'تاريخ الاستحقاق المتفق عليه' : 'Due Date'} *
                </label>
                <input
                  type="date"
                  required
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'ملاحظات وتفاصيل المعاملة' : 'Notes & Contract Details'}
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder={isAr ? 'تفاصيل الطلبية أو رقم الفاتورة أو شروط السداد...' : 'Invoice number or payment terms...'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white hover:bg-white/5"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30"
                >
                  {isAr ? 'حفظ الحساب الآجل' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Installment Modal */}
      {selectedDebtForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-[#C9A45C]" />
                  {isAr ? 'تسجيل دفعة سداد' : 'Record Payment'}
                </h3>
                <p className="text-xs text-[#97A4B5] mt-0.5">{selectedDebtForPayment.personName}</p>
              </div>
              <button onClick={() => setSelectedDebtForPayment(null)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="p-5 space-y-4">
              <div className="bg-[#050B14] p-3.5 rounded-xl border border-[#233247] flex justify-between items-center text-xs">
                <span className="text-[#97A4B5]">{isAr ? 'المبلغ المتبقي واجب السداد:' : 'Remaining Balance:'}</span>
                <span className="text-amber-400 font-bold text-sm">
                  {selectedDebtForPayment.remainingAmount.toLocaleString()} {currencySymbol}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? `مبلغ السداد (${currencySymbol})` : `Payment Amount (${currencySymbol})`} *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedDebtForPayment.remainingAmount}
                  step="0.01"
                  value={payAmount}
                  onChange={e => setPayAmount(e.target.value)}
                  placeholder={String(selectedDebtForPayment.remainingAmount)}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'طريقة السداد' : 'Payment Method'}
                </label>
                <select
                  value={payMethod}
                  onChange={e => setPayMethod(e.target.value as any)}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                >
                  <option value="bank_transfer">{isAr ? 'حوالة بنكية معتمدة' : 'Bank Transfer'}</option>
                  <option value="mada">{isAr ? 'مدى / بطاقة بنكية' : 'Mada Card'}</option>
                  <option value="cash">{isAr ? 'نقداً (كاش بالمعرض)' : 'Cash'}</option>
                  <option value="cheque">{isAr ? 'شيك بنكي معتمد' : 'Cheque'}</option>
                  <option value="other">{isAr ? 'أخرى' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'ملاحظة السند / رقم الإيصال' : 'Transaction Note / Receipt No.'}
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  placeholder={isAr ? 'مثال: حوالة مصرف الراجحي رقم 88291' : 'e.g. Bank transfer ref #88291'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDebtForPayment(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-lg hover:shadow-emerald-500/20"
                >
                  {isAr ? 'تأكيد وقيد السداد' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Debt Details & Transactions Modal */}
      {selectedDebtForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDebtForDetails.personName}</h3>
                <p className="text-xs text-[#97A4B5] mt-0.5">{selectedDebtForDetails.personPhone}</p>
              </div>
              <button onClick={() => setSelectedDebtForDetails(null)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#050B14] p-3 rounded-xl border border-[#233247]">
                  <p className="text-[11px] text-[#97A4B5]">{isAr ? 'الإجمالي' : 'Total'}</p>
                  <p className="text-base font-bold text-white mt-0.5">
                    {selectedDebtForDetails.totalAmount.toLocaleString()} {currencySymbol}
                  </p>
                </div>
                <div className="bg-[#050B14] p-3 rounded-xl border border-[#233247]">
                  <p className="text-[11px] text-[#97A4B5]">{isAr ? 'المدفوع' : 'Paid'}</p>
                  <p className="text-base font-bold text-emerald-400 mt-0.5">
                    {selectedDebtForDetails.paidAmount.toLocaleString()} {currencySymbol}
                  </p>
                </div>
                <div className="bg-[#050B14] p-3 rounded-xl border border-[#233247]">
                  <p className="text-[11px] text-[#97A4B5]">{isAr ? 'المتبقي' : 'Remaining'}</p>
                  <p className="text-base font-bold text-amber-400 mt-0.5">
                    {selectedDebtForDetails.remainingAmount.toLocaleString()} {currencySymbol}
                  </p>
                </div>
              </div>

              {selectedDebtForDetails.notes && (
                <div className="bg-[#050B14] p-3 rounded-xl border border-[#233247] text-xs">
                  <p className="text-[#97A4B5] font-semibold mb-1">{isAr ? 'الملاحظات:' : 'Notes:'}</p>
                  <p className="text-white leading-relaxed">{selectedDebtForDetails.notes}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-[#C9A45C] uppercase tracking-wider mb-2">
                  {isAr ? 'سجل الحركات والدفعات المسددة' : 'Payment History'}
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedDebtForDetails.transactions.length === 0 ? (
                    <p className="text-xs text-center py-4 text-[#97A4B5] bg-[#050B14] rounded-xl">
                      {isAr ? 'لا توجد دفعات مسجلة حتى الآن' : 'No payments recorded yet'}
                    </p>
                  ) : (
                    selectedDebtForDetails.transactions.map((tx, idx) => (
                      <div key={tx.id || idx} className="bg-[#050B14] p-3 rounded-xl border border-[#233247] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-emerald-400">+{tx.amount.toLocaleString()} {currencySymbol}</p>
                          <p className="text-[11px] text-[#97A4B5] mt-0.5">{tx.note || tx.paymentMethod}</p>
                        </div>
                        <span className="text-[#97A4B5]">{tx.date}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#233247] bg-[#101B2C] flex items-center justify-between">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 rounded-xl bg-[#C9A45C] hover:bg-[#B8934A] text-[#050B14] text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <FileText className="w-4 h-4" />
                <span>{isAr ? 'طباعة كشف حساب معتمد' : 'Print Statement'}</span>
              </button>
              <button
                onClick={() => setSelectedDebtForDetails(null)}
                className="px-4 py-2 rounded-xl bg-[#233247] hover:bg-[#324560] text-white text-xs font-bold"
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
