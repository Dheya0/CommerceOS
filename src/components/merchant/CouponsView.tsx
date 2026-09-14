import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { Coupon } from '../../types';
import { 
  Percent, 
  Plus, 
  Search, 
  Copy, 
  Check, 
  Calendar, 
  DollarSign, 
  Tag, 
  Trash2, 
  Sparkles, 
  X, 
  ShieldCheck,
  TrendingUp,
  Gift
} from 'lucide-react';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon, deleteCoupon, activeTenant, showToast, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (couponCode: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(couponCode);
    showToast(isAr ? 'تم نسخ رمز الكوبون' : 'Coupon code copied', 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !value || !activeTenant) return;

    addCoupon({
      tenantId: activeTenant.id,
      code: code.toUpperCase().trim(),
      type,
      value: parseFloat(value) || 0,
      minOrderAmount: minOrder ? parseFloat(minOrder) : undefined,
      maxDiscountAmount: maxDiscount ? parseFloat(maxDiscount) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      usageCount: 0,
      expiresAt: expiresAt || undefined,
      active: true
    });

    // Reset
    setCode('');
    setValue('');
    setMinOrder('');
    setMaxDiscount('');
    setUsageLimit('');
    setExpiresAt('');
    setIsAddModalOpen(false);
    showToast(isAr ? 'تم إنشاء كود الخصم بنجاح' : 'Coupon created successfully', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#C9A45C]/10 text-[#C9A45C] border border-[#C9A45C]/20">
              {isAr ? 'التسويق والعروض الترويجية' : 'Marketing & Promotions'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gift className="w-6 h-6 text-[#C9A45C]" />
            {isAr ? 'كوبونات وقسائم الخصم' : 'Discount Coupons'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'إنشاء وإدارة رموز الخصومات الترويجية، وتحديد سقف الاستخدام والحد الأدنى للطلبات'
              : 'Create promotional vouchers, set usage thresholds, and drive sales growth'}
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-sm shadow-lg shadow-[#C9A45C]/20 hover:shadow-[#C9A45C]/30 hover:scale-[1.02] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? 'إنشاء كوبون جديد' : 'New Coupon'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0B1422] p-4 rounded-xl border border-[#233247] flex justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#97A4B5] absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isAr ? 'بحث برمز الكوبون...' : 'Search coupon code...'}
            className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-9 pe-4 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
          />
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-[#0B1422] rounded-2xl border border-[#233247] text-[#97A4B5]">
            <Tag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#C9A45C]" />
            <p className="text-base font-semibold text-white">{isAr ? 'لا توجد كوبونات خصم' : 'No coupons found'}</p>
            <p className="text-xs text-[#97A4B5] mt-1">{isAr ? 'قم بإنشاء أول كود خصم لعملائك' : 'Create your first promo code'}</p>
          </div>
        ) : (
          filteredCoupons.map(coupon => (
            <div
              key={coupon.id}
              className="bg-[#0B1422] border border-[#233247] rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between hover:border-[#C9A45C] transition-all group"
            >
              {/* Header with Code Pill */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-[#050B14] border border-[#C9A45C]/40 text-[#C9A45C] font-mono font-black text-sm tracking-wider shadow">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => handleCopy(coupon.code)}
                      className="p-1.5 rounded-lg text-[#97A4B5] hover:text-white bg-white/5 transition-colors"
                      title={isAr ? 'نسخ الرمز' : 'Copy'}
                    >
                      {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#97A4B5] mt-2 font-medium">
                    {coupon.type === 'percentage'
                      ? (isAr ? `خصم بقيمة ${coupon.value}% على المشتريات` : `${coupon.value}% off cart total`)
                      : (isAr ? `خصم بقيمة ${coupon.value} ${currencySymbol}` : `${coupon.value} ${currencySymbol} off`)}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-[#C9A45C]/10 border border-[#C9A45C]/20 flex items-center justify-center text-[#C9A45C] shrink-0">
                  <Percent className="w-5 h-5" />
                </div>
              </div>

              {/* Conditions List */}
              <div className="my-4 pt-3 border-t border-[#233247] space-y-1.5 text-xs text-[#97A4B5]">
                {coupon.minOrderAmount && (
                  <div className="flex justify-between">
                    <span>{isAr ? 'الحد الأدنى للطلب:' : 'Min Order:'}</span>
                    <span className="text-white font-medium">{coupon.minOrderAmount} {currencySymbol}</span>
                  </div>
                )}
                {coupon.usageLimit && (
                  <div className="flex justify-between">
                    <span>{isAr ? 'مرات الاستخدام:' : 'Uses:'}</span>
                    <span className="text-white font-medium">{coupon.usageCount} / {coupon.usageLimit}</span>
                  </div>
                )}
                {coupon.expiresAt && (
                  <div className="flex justify-between">
                    <span>{isAr ? 'ينتهي في:' : 'Expires:'}</span>
                    <span className="text-white font-medium">{coupon.expiresAt}</span>
                  </div>
                )}
              </div>

              {/* Delete Button */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#233247]">
                <button
                  onClick={() => {
                    if (window.confirm(isAr ? `حذف الكوبون ${coupon.code}؟` : `Delete coupon ${coupon.code}?`)) {
                      deleteCoupon(coupon.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حذف' : 'Delete'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Coupon Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#C9A45C]" />
                {isAr ? 'إنشاء كود خصم جديد' : 'New Discount Code'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'رمز الكوبون (الرمز الترويجي)' : 'Coupon Code'} *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ROYAL20 or SUMMER50"
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'نوع الخصم' : 'Discount Type'}
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="percentage">{isAr ? 'نسبة مئوية (%)' : 'Percentage (%)'}</option>
                    <option value="fixed">{isAr ? `مبلغ ثابت (${currencySymbol})` : `Fixed Amount (${currencySymbol})`}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'قيمة الخصم' : 'Value'} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder={type === 'percentage' ? '20' : '50'}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? `الحد الأدنى للطلب (${currencySymbol})` : `Min Order (${currencySymbol})`}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minOrder}
                    onChange={e => setMinOrder(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                    {isAr ? 'الحد الأقصى لمرات الاستخدام' : 'Max Uses'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={e => setUsageLimit(e.target.value)}
                    placeholder="100"
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'تاريخ انتهاء الصلاحية' : 'Expiry Date'}
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={e => setExpiresAt(e.target.value)}
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
                  {isAr ? 'تفعيل الكوبون' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
