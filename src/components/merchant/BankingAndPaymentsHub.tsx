import React, { useState } from 'react';
import { useCommerce } from '../../context/CommerceContext';
import { 
  CreditCard, 
  Building2, 
  Smartphone, 
  QrCode, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  Zap, 
  Layers, 
  DollarSign, 
  Wallet, 
  Plus, 
  X, 
  Check, 
  Share2, 
  Sparkles,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Globe2,
  Cpu,
  Radio
} from 'lucide-react';

interface BankConfig {
  id: string;
  bankNameAr: string;
  bankNameEn: string;
  code: string;
  logoColor: string;
  accountHolder: string;
  iban: string;
  accountNumber: string;
  status: 'connected' | 'pending_verification' | 'disabled';
  openBankingConnected: boolean;
  autoReconciliation: boolean;
  dailyVolume: number;
}

interface PaymentGatewayConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'cards' | 'wallets' | 'bnpl' | 'gcc';
  iconColor: string;
  enabled: boolean;
  feePercentage: number;
  fixedFee: number;
  settlementPeriod: string;
  currencies: string[];
  liveStatus: 'active' | 'testing' | 'offline';
}

const DEFAULT_BANKS: BankConfig[] = [
  {
    id: 'rajhi',
    bankNameAr: 'مصرف الراجحي',
    bankNameEn: 'Al Rajhi Bank',
    code: 'RJHI',
    logoColor: 'from-blue-600 to-blue-800',
    accountHolder: 'مؤسسة التجارة السيادية الرقمية',
    iban: 'SA44 8000 0456 6080 1012 3456',
    accountNumber: '456608010123456',
    status: 'connected',
    openBankingConnected: true,
    autoReconciliation: true,
    dailyVolume: 124500
  },
  {
    id: 'snb',
    bankNameAr: 'البنك الأهلي السعودي (SNB)',
    bankNameEn: 'Saudi National Bank',
    code: 'NCBK',
    logoColor: 'from-emerald-700 to-emerald-900',
    accountHolder: 'مؤسسة التجارة السيادية الرقمية',
    iban: 'SA12 1000 0001 2345 6789 0123',
    accountNumber: '100000012345678',
    status: 'connected',
    openBankingConnected: true,
    autoReconciliation: true,
    dailyVolume: 89200
  },
  {
    id: 'inma',
    bankNameAr: 'مصرف الإنماء',
    bankNameEn: 'Alinma Bank',
    code: 'INMA',
    logoColor: 'from-amber-700 to-amber-900',
    accountHolder: 'مؤسسة التجارة السيادية الرقمية',
    iban: 'SA05 0500 0068 2012 3456 7890',
    accountNumber: '050000682012345',
    status: 'connected',
    openBankingConnected: true,
    autoReconciliation: false,
    dailyVolume: 43100
  },
  {
    id: 'riyad',
    bankNameAr: 'بنك الرياض',
    bankNameEn: 'Riyad Bank',
    code: 'RIBL',
    logoColor: 'from-sky-700 to-sky-900',
    accountHolder: 'مؤسسة التجارة السيادية الرقمية',
    iban: 'SA78 2000 0001 9876 5432 1098',
    accountNumber: '200000019876543',
    status: 'pending_verification',
    openBankingConnected: false,
    autoReconciliation: false,
    dailyVolume: 0
  }
];

const DEFAULT_GATEWAYS: PaymentGatewayConfig[] = [
  {
    id: 'mada',
    nameAr: 'شبكة مدى الوطنية (Mada)',
    nameEn: 'Mada Debit Cards',
    category: 'cards',
    iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    enabled: true,
    feePercentage: 1.0,
    fixedFee: 1.0,
    settlementPeriod: 'T+1 (خلال 24 ساعة)',
    currencies: ['SAR'],
    liveStatus: 'active'
  },
  {
    id: 'apple_pay',
    nameAr: 'أبل باي (Apple Pay)',
    nameEn: 'Apple Pay Direct',
    category: 'wallets',
    iconColor: 'bg-white/10 text-white border-white/20',
    enabled: true,
    feePercentage: 1.2,
    fixedFee: 1.0,
    settlementPeriod: 'T+1 (فوري للمحفظة)',
    currencies: ['SAR', 'AED', 'KWD', 'USD'],
    liveStatus: 'active'
  },
  {
    id: 'visa_mastercard',
    nameAr: 'فيزا وماستركارد (Visa / Mastercard)',
    nameEn: 'Visa & Mastercard International',
    category: 'cards',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    enabled: true,
    feePercentage: 2.2,
    fixedFee: 1.0,
    settlementPeriod: 'T+2 (يومي عمل)',
    currencies: ['SAR', 'USD', 'EUR', 'AED', 'KWD'],
    liveStatus: 'active'
  },
  {
    id: 'stc_pay',
    nameAr: 'إس تي سي باي (STC Pay / Bank)',
    nameEn: 'STC Pay Digital Wallet',
    category: 'wallets',
    iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    enabled: true,
    feePercentage: 1.5,
    fixedFee: 0.5,
    settlementPeriod: 'T+0 (تسوية فورية)',
    currencies: ['SAR'],
    liveStatus: 'active'
  },
  {
    id: 'tamara',
    nameAr: 'تمارا - قسّمها على 3 أو 4 دفعات (Tamara BNPL)',
    nameEn: 'Tamara Buy Now Pay Later',
    category: 'bnpl',
    iconColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    enabled: true,
    feePercentage: 3.5,
    fixedFee: 1.5,
    settlementPeriod: 'T+3 (3 أيام عمل)',
    currencies: ['SAR', 'AED', 'KWD'],
    liveStatus: 'active'
  },
  {
    id: 'tabby',
    nameAr: 'تابي - ادفع لاحقاً بدون فوائد (Tabby BNPL)',
    nameEn: 'Tabby Buy Now Pay Later',
    category: 'bnpl',
    iconColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    enabled: true,
    feePercentage: 3.5,
    fixedFee: 1.5,
    settlementPeriod: 'T+3 (3 أيام عمل)',
    currencies: ['SAR', 'AED', 'KWD', 'BHD'],
    liveStatus: 'active'
  },
  {
    id: 'knet',
    nameAr: 'كي نت الكويتية (KNET)',
    nameEn: 'KNET Kuwait Switch',
    category: 'gcc',
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    enabled: true,
    feePercentage: 1.5,
    fixedFee: 0.25,
    settlementPeriod: 'T+2',
    currencies: ['KWD', 'SAR'],
    liveStatus: 'active'
  },
  {
    id: 'benefit',
    nameAr: 'بنفت البحرين (Benefit / BenefitPay)',
    nameEn: 'Benefit Bahrain Switch',
    category: 'gcc',
    iconColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    enabled: true,
    feePercentage: 1.5,
    fixedFee: 0.3,
    settlementPeriod: 'T+2',
    currencies: ['BHD', 'SAR'],
    liveStatus: 'active'
  }
];

export const BankingAndPaymentsHub: React.FC = () => {
  const { activeTenant, showToast, language } = useCommerce();
  const isAr = language === 'ar';
  const currencySymbol = activeTenant?.currencySymbol || 'ر.س';

  const [activeTab, setActiveTab] = useState<'gateways' | 'banks' | 'payment_links' | 'pos_terminals' | 'bnpl_simulator'>('gateways');
  const [banks, setBanks] = useState<BankConfig[]>(DEFAULT_BANKS);
  const [gateways, setGateways] = useState<PaymentGatewayConfig[]>(DEFAULT_GATEWAYS);

  // Quick Payment Link Generator State
  const [linkAmount, setLinkAmount] = useState('');
  const [linkCustomerName, setLinkCustomerName] = useState('');
  const [linkCustomerPhone, setLinkCustomerPhone] = useState('');
  const [linkPurpose, setLinkPurpose] = useState('');
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Add Bank Modal State
  const [isAddBankModalOpen, setIsAddBankModalOpen] = useState(false);
  const [newBankNameAr, setNewBankNameAr] = useState('');
  const [newIban, setNewIban] = useState('');
  const [newAccountHolder, setNewAccountHolder] = useState('');

  // BNPL Calculator State
  const [simCartAmount, setSimCartAmount] = useState<number>(1200);

  const toggleGateway = (gatewayId: string) => {
    setGateways(prev => prev.map(g => {
      if (g.id === gatewayId) {
        const updated = !g.enabled;
        showToast(
          isAr 
            ? `${updated ? 'تم تفعيل' : 'تم تعطيل'} بوابة ${g.nameAr}` 
            : `${g.nameEn} ${updated ? 'enabled' : 'disabled'}`, 
          'success'
        );
        return { ...g, enabled: updated };
      }
      return g;
    }));
  };

  const handleGeneratePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkAmount) return;

    const linkId = `pay_${Date.now().toString(36)}`;
    const fullLink = `https://${activeTenant?.domain || 'store.commerceos.app'}/checkout/link/${linkId}?amount=${linkAmount}`;
    setGeneratedLink(fullLink);
    showToast(isAr ? 'تم إنشاء رابط الدفع بنجاح' : 'Payment link generated', 'success');
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    showToast(isAr ? 'تم نسخ الرابط إلى الحافظة' : 'Link copied to clipboard', 'success');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBankNameAr || !newIban || !newAccountHolder) return;

    const newBank: BankConfig = {
      id: `bank_${Date.now()}`,
      bankNameAr: newBankNameAr,
      bankNameEn: newBankNameAr,
      code: 'GENB',
      logoColor: 'from-slate-700 to-slate-900',
      accountHolder: newAccountHolder,
      iban: newIban.toUpperCase(),
      accountNumber: newIban.slice(-10),
      status: 'connected',
      openBankingConnected: true,
      autoReconciliation: true,
      dailyVolume: 0
    };

    setBanks(prev => [...prev, newBank]);
    setIsAddBankModalOpen(false);
    setNewBankNameAr('');
    setNewIban('');
    setNewAccountHolder('');
    showToast(isAr ? 'تم ربط الحساب البنكي الجديد بنجاح' : 'Bank account connected', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0B1422] to-[#101B2C] p-6 rounded-2xl border border-[#233247]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAr ? 'منظومة المدفوعات والربط البنكي المعتمد' : 'Certified Banking & Payment Suite'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-[#C9A45C]" />
            {isAr ? 'بوابة المدفوعات الإلكترونية والربط البنكي' : 'Banking & Online Payments Hub'}
          </h1>
          <p className="text-sm text-[#97A4B5] mt-1">
            {isAr 
              ? 'إدارة قنوات الدفع (مدى، أبل باي، تمارا، تابي)، والربط المباشر مع الحسابات البنكية ومطابقة التحويلات آلياً'
              : 'Configure payment gateways, link corporate bank accounts, and reconcile wire transfers'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('payment_links')}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#050B14] border border-[#C9A45C]/40 text-[#C9A45C] font-bold text-xs hover:bg-[#C9A45C]/10 transition-all shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isAr ? 'إنشاء رابط دفع سريع' : 'Quick Payment Link'}</span>
          </button>
          <button
            onClick={() => setIsAddBankModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg shadow-[#C9A45C]/20 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'ربط حساب بنكي جديد' : 'Connect Bank'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#233247] pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('gateways')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'gateways'
              ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
              : 'bg-[#0B1422] text-[#97A4B5] hover:text-white border border-[#233247]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>{isAr ? 'بوابات الدفع والمحافظ (8)' : 'Payment Gateways'}</span>
        </button>

        <button
          onClick={() => setActiveTab('banks')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'banks'
              ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
              : 'bg-[#0B1422] text-[#97A4B5] hover:text-white border border-[#233247]'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{isAr ? 'الحسابات المصرفية المباشرة (Open Banking)' : 'Bank Accounts & IBANs'}</span>
        </button>

        <button
          onClick={() => setActiveTab('bnpl_simulator')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'bnpl_simulator'
              ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
              : 'bg-[#0B1422] text-[#97A4B5] hover:text-white border border-[#233247]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{isAr ? 'حاسبة التقسيط (تمارا وتابي)' : 'BNPL Installment Widget'}</span>
        </button>

        <button
          onClick={() => setActiveTab('payment_links')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'payment_links'
              ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
              : 'bg-[#0B1422] text-[#97A4B5] hover:text-white border border-[#233247]'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>{isAr ? 'روابط الدفع وفواتير سداد' : 'Payment Links'}</span>
        </button>

        <button
          onClick={() => setActiveTab('pos_terminals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'pos_terminals'
              ? 'bg-[#C9A45C] text-[#050B14] shadow-md shadow-[#C9A45C]/20'
              : 'bg-[#0B1422] text-[#97A4B5] hover:text-white border border-[#233247]'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{isAr ? 'أجهزة نقاط البيع الشبكية (SoftPOS)' : 'POS Terminals'}</span>
        </button>
      </div>

      {/* Tab 1: Payment Gateways & Wallets */}
      {activeTab === 'gateways' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gateways.map(gw => (
              <div 
                key={gw.id}
                className={`bg-[#0B1422] rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                  gw.enabled ? 'border-[#233247] hover:border-[#C9A45C]' : 'border-[#233247]/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-xs ${gw.iconColor}`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm leading-snug">{isAr ? gw.nameAr : gw.nameEn}</h3>
                        <span className="text-[11px] text-[#97A4B5]">
                          {gw.category === 'cards' ? (isAr ? 'بطاقات خصم وائتمان' : 'Cards')
                            : gw.category === 'wallets' ? (isAr ? 'محافظ رقمية ذكية' : 'Wallets')
                            : gw.category === 'bnpl' ? (isAr ? 'اشتر الآن وادفع لاحقاً' : 'BNPL')
                            : (isAr ? 'الشبكات الخليجية' : 'GCC Switch')}
                        </span>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={gw.enabled} 
                        onChange={() => toggleGateway(gw.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-[#050B14] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="space-y-2 py-3 border-y border-[#233247] text-xs text-[#97A4B5]">
                    <div className="flex justify-between">
                      <span>{isAr ? 'رسوم المعاملة:' : 'Transaction Fee:'}</span>
                      <span className="text-white font-semibold">{gw.feePercentage}% + {gw.fixedFee} {currencySymbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isAr ? 'دورة التسوية البنكية:' : 'Settlement:'}</span>
                      <span className="text-emerald-400 font-semibold">{gw.settlementPeriod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isAr ? 'العملات المدعومة:' : 'Currencies:'}</span>
                      <div className="flex gap-1">
                        {gw.currencies.map(c => (
                          <span key={c} className="px-1.5 py-0.5 rounded bg-[#050B14] text-[10px] text-white font-mono">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAr ? 'مشفر ومرخص من البنك المركزي' : 'SAMA Compliant'}
                  </span>
                  <button 
                    onClick={() => showToast(isAr ? `إعدادات الربط المتقدمة لـ ${gw.nameAr}` : `Settings for ${gw.nameEn}`, 'info')}
                    className="text-[#C9A45C] hover:underline font-semibold"
                  >
                    {isAr ? 'إعدادات API' : 'API Keys'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Bank Accounts & Open Banking Wire Reconciliation */}
      {activeTab === 'banks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map(bank => (
              <div 
                key={bank.id}
                className="bg-[#0B1422] rounded-2xl border border-[#233247] p-6 relative overflow-hidden flex flex-col justify-between hover:border-[#C9A45C] transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bank.logoColor} text-white flex items-center justify-center font-black text-sm shadow`}>
                        {bank.code}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{isAr ? bank.bankNameAr : bank.bankNameEn}</h3>
                        <p className="text-xs text-[#97A4B5]">{bank.accountHolder}</p>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {isAr ? 'ربط مصرفي نشط' : 'Active'}
                    </span>
                  </div>

                  {/* IBAN Card Box */}
                  <div className="bg-[#050B14] p-4 rounded-xl border border-[#233247] space-y-2 font-mono text-xs">
                    <div className="flex justify-between items-center text-[#97A4B5]">
                      <span className="font-sans">{isAr ? 'رقم الآيبان الدولي (IBAN):' : 'IBAN:'}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(bank.iban.replace(/\s+/g, ''));
                          showToast(isAr ? 'تم نسخ رقم الآيبان' : 'IBAN copied', 'success');
                        }}
                        className="text-[#C9A45C] hover:text-white flex items-center gap-1 font-sans text-[11px]"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{isAr ? 'نسخ' : 'Copy'}</span>
                      </button>
                    </div>
                    <p className="text-white font-bold text-sm tracking-wider">{bank.iban}</p>
                    <div className="flex justify-between text-[11px] text-[#97A4B5] pt-1 border-t border-[#233247]">
                      <span className="font-sans">{isAr ? 'رقم الحساب المحلي:' : 'Account No:'}</span>
                      <span className="text-white">{bank.accountNumber}</span>
                    </div>
                  </div>

                  {/* Open Banking Feeds */}
                  <div className="mt-4 pt-3 border-t border-[#233247] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[#97A4B5]">
                      <Zap className="w-3.5 h-3.5 text-[#C9A45C]" />
                      <span>{isAr ? 'مطابقة الحوالات الواردة آلياً (سريع SARIE):' : 'Auto SARIE Match:'}</span>
                    </div>
                    <span className="font-bold text-emerald-400">
                      {bank.autoReconciliation ? (isAr ? 'مفعل ⚡' : 'Enabled') : (isAr ? 'يدوي' : 'Manual')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#233247] flex items-center justify-between text-xs text-[#97A4B5]">
                  <span>{isAr ? 'حجم التدفقات المعالجة اليوم:' : 'Today Volume:'}</span>
                  <span className="text-white font-bold">{bank.dailyVolume.toLocaleString()} {currencySymbol}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: BNPL Installment Widget Simulator */}
      {activeTab === 'bnpl_simulator' && (
        <div className="bg-[#0B1422] rounded-2xl border border-[#233247] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C9A45C]" />
              {isAr ? 'محاكي ودجت التقسيط الذكي لمتجرك (تمارا وتابي)' : 'Tamara & Tabby Storefront Widget Simulator'}
            </h3>
            <p className="text-xs text-[#97A4B5] mt-1">
              {isAr 
                ? 'معاينة طريقة ظهور خيارات التقسيط للعميل في صفحة المنتج وسلة الشراء لزيادة معدل التحويل والمبيعات'
                : 'Preview how installment options will render in your storefront product and checkout pages'}
            </p>
          </div>

          <div className="bg-[#050B14] p-4 rounded-xl border border-[#233247] max-w-md">
            <label className="block text-xs font-semibold text-[#97A4B5] mb-2">
              {isAr ? 'قيمة سلة الشراء الافتراضية للاختبار:' : 'Simulated Cart Value:'}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                step="50"
                value={simCartAmount}
                onChange={e => setSimCartAmount(parseFloat(e.target.value) || 0)}
                className="bg-[#101B2C] border border-[#233247] rounded-xl px-4 py-2 text-white font-bold text-base focus:outline-none focus:border-[#C9A45C] w-48"
              />
              <span className="text-sm font-bold text-[#C9A45C]">{currencySymbol}</span>
            </div>
          </div>

          {/* Widgets Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tamara Widget Preview */}
            <div className="bg-[#050B14] p-5 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-bold text-xs border border-amber-500/20">
                  تمارا Tamara
                </span>
                <span className="text-xs text-amber-400 font-bold">بدون فوائد ولا رسوم خفية</span>
              </div>
              <p className="text-sm text-white font-semibold">
                أو قسّمها على 3 أو 4 دفعات شهرية بقيمة:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className="bg-[#101B2C] p-2.5 rounded-xl border border-[#233247] text-center">
                    <p className="text-[10px] text-[#97A4B5]">الدفعة {n}</p>
                    <p className="text-xs font-bold text-white mt-0.5">{(simCartAmount / 3).toFixed(2)} {currencySymbol}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabby Widget Preview */}
            <div className="bg-[#050B14] p-5 rounded-2xl border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  تابي Tabby
                </span>
                <span className="text-xs text-emerald-400 font-bold">متوافق مع أحكام الشريعة</span>
              </div>
              <p className="text-sm text-white font-semibold">
                أو قسّمها على 4 دفعات بدون أي فوائد:
              </p>
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="bg-[#101B2C] p-2 rounded-xl border border-[#233247] text-center">
                    <p className="text-[9px] text-[#97A4B5]">دفعة {n}</p>
                    <p className="text-[11px] font-bold text-white mt-0.5">{(simCartAmount / 4).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Quick Payment Links */}
      {activeTab === 'payment_links' && (
        <div className="bg-[#0B1422] rounded-2xl border border-[#233247] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#C9A45C]" />
              {isAr ? 'إنشاء رابط دفع إلكتروني مخصص وفوري' : 'Create Custom Payment Link'}
            </h3>
            <p className="text-xs text-[#97A4B5] mt-1">
              {isAr 
                ? 'أرسل روابط دفع فورية لعملائك عبر الواتساب أو الرسائل النصية لتحصيل المستحقات والطلبات الخاصة'
                : 'Generate shareable checkout links for custom orders and direct client settlements'}
            </p>
          </div>

          <form onSubmit={handleGeneratePaymentLink} className="max-w-xl space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                {isAr ? `المبلغ المطلوب تحصيله (${currencySymbol})` : `Amount (${currencySymbol})`} *
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={linkAmount}
                onChange={e => setLinkAmount(e.target.value)}
                placeholder="500.00"
                className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'اسم العميل / المستلم' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  value={linkCustomerName}
                  onChange={e => setLinkCustomerName(e.target.value)}
                  placeholder={isAr ? 'الشيخ عبد الله' : 'e.g. John Doe'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'رقم الواتساب' : 'WhatsApp Number'}
                </label>
                <input
                  type="text"
                  value={linkCustomerPhone}
                  onChange={e => setLinkCustomerPhone(e.target.value)}
                  placeholder="+966 50 123 4567"
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                {isAr ? 'الغرض / وصف الفاتورة' : 'Payment Purpose / Description'}
              </label>
              <input
                type="text"
                value={linkPurpose}
                onChange={e => setLinkPurpose(e.target.value)}
                placeholder={isAr ? 'دفعة حجز طلبية خاصة رقم 491' : 'Order advance payment'}
                className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'توليد رابط الدفع الذكي' : 'Generate Payment Link'}</span>
            </button>
          </form>

          {generatedLink && (
            <div className="bg-[#050B14] p-5 rounded-2xl border border-[#C9A45C]/40 space-y-3 animate-in zoom-in-95 max-w-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isAr ? 'رابط الدفع جاهز ومفعل للتحصيل' : 'Link Ready'}
                </span>
                <span className="text-xs font-bold text-white">{linkAmount} {currencySymbol}</span>
              </div>

              <div className="bg-[#101B2C] p-3 rounded-xl border border-[#233247] flex items-center justify-between gap-3">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="bg-transparent text-xs text-white font-mono flex-1 outline-none truncate"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1 rounded-lg bg-[#C9A45C] text-[#050B14] font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`https://wa.me/${linkCustomerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً بك، يرجى سداد المبلغ المستحق (${linkAmount} ${currencySymbol}) عبر الرابط الآمن التالي: ${generatedLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إرسال عبر الواتساب' : 'Share via WhatsApp'}</span>
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: POS Network Terminals */}
      {activeTab === 'pos_terminals' && (
        <div className="bg-[#0B1422] rounded-2xl border border-[#233247] p-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#C9A45C]" />
              {isAr ? 'إدارة أجهزة نقاط البيع الشبكية (Mada POS & SoftPOS)' : 'POS Terminals & Hardware'}
            </h3>
            <p className="text-xs text-[#97A4B5] mt-1">
              {isAr 
                ? 'ربط أجهزة الدفع بالبطاقات في الفروع والمعارض (Geidea, Nearpay, Foodics) ومزامنة العمليات فورياً مع النظام'
                : 'Connect card reader terminals with automatic cloud ledger synchronization'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#050B14] p-5 rounded-2xl border border-[#233247] space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
                  POS-1
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isAr ? 'متصل سحابياً' : 'Online'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{isAr ? 'كاشير المعرض الرئيسي (الرياض)' : 'Main Branch Terminal'}</h4>
                <p className="text-xs text-[#97A4B5] mt-0.5">جهاز مدى الذكي - تسلسل: GD-9921-SA</p>
              </div>
              <div className="pt-2 border-t border-[#233247] text-xs text-[#97A4B5] flex justify-between">
                <span>{isAr ? 'عمليات اليوم:' : 'Today Sales:'}</span>
                <span className="text-white font-bold">42 عملية (18,400 {currencySymbol})</span>
              </div>
            </div>

            <div className="bg-[#050B14] p-5 rounded-2xl border border-[#233247] space-y-3">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
                  POS-2
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isAr ? 'متصل سحابياً' : 'Online'}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">{isAr ? 'نقطة بيع الجملة والمستودع' : 'Warehouse Wholesale Terminal'}</h4>
                <p className="text-xs text-[#97A4B5] mt-0.5">SoftPOS Nearpay - جوال الكاشير</p>
              </div>
              <div className="pt-2 border-t border-[#233247] text-xs text-[#97A4B5] flex justify-between">
                <span>{isAr ? 'عمليات اليوم:' : 'Today Sales:'}</span>
                <span className="text-white font-bold">14 عملية (46,800 {currencySymbol})</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Bank Modal */}
      {isAddBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1422] border border-[#233247] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-[#233247] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#C9A45C]" />
                {isAr ? 'ربط حساب بنكي تجاري جديد' : 'Connect Bank Account'}
              </h3>
              <button onClick={() => setIsAddBankModalOpen(false)} className="p-1 rounded-lg text-[#97A4B5] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBank} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'اسم المصرف / البنك' : 'Bank Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newBankNameAr}
                  onChange={e => setNewBankNameAr(e.target.value)}
                  placeholder={isAr ? 'مثال: مصرف الراجحي أو بنك دبي التجاري' : 'e.g. Al Rajhi Bank'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'اسم صاحب الحساب (كما هو بالشهادة البنكية)' : 'Account Holder Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={newAccountHolder}
                  onChange={e => setNewAccountHolder(e.target.value)}
                  placeholder={isAr ? 'اسم المؤسسة أو الشركة' : 'Company Legal Name'}
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#97A4B5] mb-1.5">
                  {isAr ? 'رقم الآيبان الدولي (IBAN)' : 'IBAN Number'} *
                </label>
                <input
                  type="text"
                  required
                  value={newIban}
                  onChange={e => setNewIban(e.target.value)}
                  placeholder="SA00 0000 0000 0000 0000 0000"
                  className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-3.5 py-2 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-[#C9A45C]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBankModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#97A4B5] hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#B8934A] text-[#050B14] font-bold text-xs shadow-lg hover:shadow-[#C9A45C]/30"
                >
                  {isAr ? 'تأكيد وربط الحساب' : 'Connect Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
