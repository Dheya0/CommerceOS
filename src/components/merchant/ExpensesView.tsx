import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { ExpenseRecord } from '../../types';
import { 
  TrendingDown, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Building, 
  Users, 
  Megaphone, 
  Package, 
  Truck, 
  Zap, 
  Wrench, 
  MoreHorizontal,
  Trash2,
  Receipt,
  FileText,
  X,
  CreditCard,
  Building2,
  PieChart
} from 'lucide-react';

const CATEGORY_MAP: Record<ExpenseRecord['category'], { labelAr: string; labelEn: string; icon: any; color: string }> = {
  rent: { labelAr: 'إيجار المعارض والمستودعات', labelEn: 'Rent', icon: Building, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  salaries: { labelAr: 'الرواتب ومستحقات الموظفين', labelEn: 'Salaries', icon: Users, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  marketing: { labelAr: 'التسويق والإعلانات الممولة', labelEn: 'Marketing', icon: Megaphone, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  inventory_purchase: { labelAr: 'شراء وتوريد بضائع ومحاصيل', labelEn: 'Inventory Purchase', icon: Package, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  logistics: { labelAr: 'الشحن والتوصيل واللوجستيات', labelEn: 'Logistics', icon: Truck, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  utilities: { labelAr: 'الخدمات والكهرباء والإنترنت', labelEn: 'Utilities', icon: Zap, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  maintenance: { labelAr: 'الصيانة والتجهيزات الفنية', labelEn: 'Maintenance', icon: Wrench, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  other: { labelAr: 'مصروفات تشغيلية متنوعة', labelEn: 'Other', icon: MoreHorizontal, color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
};

export const ExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, activeTenant, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Expense Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseRecord['category']>('marketing');
  const [amount, setAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<ExpenseRecord['paymentMethod']>('bank_transfer');
  const [paidTo, setPaidTo] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  // Calculations
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalTax = expenses.reduce((sum, e) => sum + (e.taxAmount || 0), 0);

  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !activeTenant) return;

    const numericAmount = parseFloat(amount) || 0;
    const numericTax = parseFloat(taxAmount) || 0;

    addExpense({
      tenantId: activeTenant.id,
      title,
      category,
      amount: numericAmount,
      taxAmount: numericTax,
      paymentMethod,
      paidTo: paidTo || 'جهة غير محددة',
      date,
      notes: notes || undefined,
      receiptUrl: receiptUrl || undefined
    });

    // Reset
    setTitle('');
    setCategory('marketing');
    setAmount('');
    setTaxAmount('');
    setPaidTo('');
    setNotes('');
    setReceiptUrl('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {isAr ? 'المحاسبة والمصروفات' : 'Cost Center'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingDown className="w-6 h-6 text-rose-400" />
            {isAr ? 'سجل المصروفات والتكاليف التشغيلية' : 'Operating Expenses'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'توثيق وتصنيف نفقات المتجر من إيجارات، رواتب، إعلانات، ومشتريات لحساب صافي الأرباح بدقة'
              : 'Track and categorize operational costs including rent, salaries, ads, and inventory'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-sm shadow-lg shadow-[#C9A45C]/20 hover:shadow-[#C9A45C]/30 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'تسجيل مصروف جديد' : 'New Expense'}</span>
        </button>
      </div>

      {/* Expense Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'إجمالي المصروفات التشغيلية' : 'Total Operating Costs'}</p>
            <p className="text-2xl font-black text-rose-400 mt-1">
              {totalExpenses.toLocaleString()} <span className="text-xs font-normal text-[#97A4B5]">{currencySymbol}</span>
            </p>
            <p className="text-[11px] text-[#97A4B5] mt-1">
              {isAr ? `${expenses.length} عملية موثقة بالسجلات` : `${expenses.length} documented transactions`}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'ضريبة القيمة المضافة المدفوعة (VAT)' : 'Total VAT Paid'}</p>
            <p className="text-2xl font-black text-amber-400 mt-1">
              {totalTax.toLocaleString()} <span className="text-xs font-normal text-[#97A4B5]">{currencySymbol}</span>
            </p>
            <p className="text-[11px] text-amber-400/80 mt-1">
              {isAr ? 'مسترجعة من هيئة الزكاة والضريبة' : 'Eligible for ZATCA input tax'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0B1422] p-5 rounded-xl border border-[#233247] flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#97A4B5]">{isAr ? 'أعلى بند إنفاق هذا الشهر' : 'Top Cost Driver'}</p>
            <p className="text-lg font-bold text-white mt-1">
              {isAr ? 'الإيجار والرواتب' : 'Rent & Payroll'}
            </p>
            <p className="text-[11px] text-[#C9A45C] mt-1">
              {isAr ? 'يمثل 72% من إجمالي النفقات' : '72% of total operational outlays'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/20 flex items-center justify-center text-[#C9A45C]">
            <PieChart className="w-6 h-6" />
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
            placeholder={isAr ? 'بحث في المصروفات أو الجهة المستفيدة...' : 'Search expenses or beneficiaries...'}
            className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-9 pe-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#C9A45C]"
          >
            <option value="all">{isAr ? 'جميع تصنيفات المصروفات' : 'All Expense Categories'}</option>
            {Object.entries(CATEGORY_MAP).map(([key, info]) => (
              <option key={key} value={key}>
                {isAr ? info.labelAr : info.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-[#0B1422] rounded-xl border border-[#233247] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-[#101B2C] text-[#97A4B5] text-xs uppercase border-b border-[#233247]">
              <tr>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'بيان المصروف' : 'Title'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'التصنيف' : 'Category'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'المبلغ الصافي' : 'Amount'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'الضريبة VAT' : 'VAT'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'الجهة المستفيدة' : 'Paid To'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'طريقة الدفع' : 'Payment'}</th>
                <th className="px-5 py-3.5 text-start font-semibold">{isAr ? 'التاريخ' : 'Date'}</th>
                <th className="px-5 py-3.5 text-end font-semibold">{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233247]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#97A4B5]">
                    <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-30 text-rose-400" />
                    <p className="text-base font-semibold text-white">{isAr ? 'لا توجد مصروفات مسجلة' : 'No expenses recorded'}</p>
                    <p className="text-xs text-[#97A4B5] mt-1">{isAr ? 'قم بإضافة مصروف تشغيلي جديد' : 'Add your first operational cost entry'}</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => {
                  const catInfo = CATEGORY_MAP[exp.category] || CATEGORY_MAP.other;
                  const Icon = catInfo.icon;
                  return (
                    <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${catInfo.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-white">{exp.title}</p>
                            {exp.notes && (
                              <p className="text-xs text-[#97A4B5] line-clamp-1 mt-0.5">{exp.notes}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[#97A4B5]">
                          {isAr ? catInfo.labelAr : catInfo.labelEn}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-rose-400">
                        {exp.amount.toLocaleString()} <span className="text-xs text-[#97A4B5]">{currencySymbol}</span>
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-amber-400">
                        {exp.taxAmount > 0 ? `${exp.taxAmount.toLocaleString()} ${currencySymbol}` : '-'}
                      </td>

                      <td className="px-5 py-4 text-xs font-medium text-white">
                        {exp.paidTo}
                      </td>

                      <td className="px-5 py-4 text-xs text-[#97A4B5]">
                        <span className="px-2 py-0.5 rounded-lg bg-[#050B14] border border-[#233247]">
                          {exp.paymentMethod === 'bank_transfer' ? (isAr ? 'حوالة بنكية' : 'Bank Transfer')
                            : exp.paymentMethod === 'mada' ? 'مدى Mada'
                            : exp.paymentMethod === 'credit_card' ? (isAr ? 'بطاقة ائتمان' : 'Credit Card')
                            : (isAr ? 'نقداً Cash' : 'Cash')}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-[#97A4B5]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#C9A45C]" />
                          {exp.date}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-end">
                        <button
                          onClick={() => {
                            if (window.confirm(isAr ? 'هل أنت متأكد من حذف هذا المصروف؟' : 'Delete this expense?')) {
                              deleteExpense(exp.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title={isAr ? 'حذف المصروف' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C9A45C]" />
                {isAr ? 'تسجيل مصروف تشغيلي جديد' : 'Record New Expense'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'بيان / عنوان المصروف' : 'Expense Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: إيجار المعرض لشهر سبتمبر أو إعلانات تيك توك' : 'e.g. Store Rent'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'التصنيف المحاسبي' : 'Expense Category'} *
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  >
                    {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                      <option key={key} value={key}>
                        {isAr ? info.labelAr : info.labelEn}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'طريقة الدفع' : 'Payment Method'}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="bank_transfer">{isAr ? 'حوالة بنكية معتمدة' : 'Bank Transfer'}</option>
                    <option value="mada">{isAr ? 'بطاقة مدى' : 'Mada Card'}</option>
                    <option value="credit_card">{isAr ? 'بطاقة ائتمانية للشركة' : 'Corporate Card'}</option>
                    <option value="cash">{isAr ? 'نقداً (صندوق النثريات)' : 'Petty Cash'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? `المبلغ الصافي (${currencySymbol})` : `Net Amount (${currencySymbol})`} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={e => {
                      const val = e.target.value;
                      setAmount(val);
                      // Auto 15% VAT estimate
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setTaxAmount((num * 0.15).toFixed(2));
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? `ضريبة القيمة المضافة 15% (${currencySymbol})` : `VAT Amount (${currencySymbol})`}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={taxAmount}
                    onChange={e => setTaxAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'الجهة المستفيدة / المورد' : 'Paid To / Beneficiary'}
                  </label>
                  <input
                    type="text"
                    value={paidTo}
                    onChange={e => setPaidTo(e.target.value)}
                    placeholder={isAr ? 'مثال: شركة الكهرباء السعودية' : 'e.g. Vendor Name'}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'تاريخ الصرف' : 'Expense Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'ملاحظات وتفاصيل الفاتورة' : 'Notes & Invoice Reference'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={isAr ? 'رقم الفاتورة الضريبية أو تفاصيل السداد...' : 'Tax invoice number or details...'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30"
                >
                  {isAr ? 'حفظ المصروف' : 'Save Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
