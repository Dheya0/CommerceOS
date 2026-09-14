import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Globe, 
  Coins, 
  CreditCard, 
  Truck, 
  Bell, 
  Users, 
  ShieldAlert, 
  Lock, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  PauseCircle, 
  Plus, 
  Mail, 
  Phone, 
  MapPin, 
  Key, 
  Smartphone,
  ExternalLink,
  Sparkles,
  Image as ImageIcon,
  Check,
  CheckCheck,
  X,
  ShieldCheck,
  Zap,
  DollarSign
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { FeatureManagerView } from './FeatureManagerView';
import { ShippingManager, CARRIER_PRESETS } from './ShippingManager';
import { ShippingMethod, BankAccount } from '../../types';

interface SettingsViewProps {
  initialTab?: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ initialTab }) => {
  const { activeTenant, updateTenant, showToast, language, currentUser, staff } = useCommerce();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<string>(initialTab || 'general');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const defaultShippingOptions: ShippingMethod[] = CARRIER_PRESETS.map(preset => ({
    id: `ship-${preset.carrierKey}`,
    name: preset.nameAr,
    nameEn: preset.nameEn,
    carrier: preset.carrierKey,
    carrierName: preset.carrierName,
    cost: preset.cost,
    estimatedDays: preset.estimatedDays,
    description: preset.description,
    baseWeightKg: preset.baseWeightKg,
    extraKgCost: preset.extraKgCost,
    maxWeightKg: preset.maxWeightKg,
    freeShippingThreshold: preset.freeShippingThreshold,
    coverageArea: preset.coverageArea,
    active: preset.carrierKey === 'smsa' || preset.carrierKey === 'aramex' || preset.carrierKey === 'fleet'
  }));

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(() => {
    if (activeTenant?.shippingMethods && activeTenant.shippingMethods.length > 0) {
      return activeTenant.shippingMethods;
    }
    return defaultShippingOptions;
  });

  // Form Local State mirroring activeTenant
  const [formData, setFormData] = useState({
    storeName: activeTenant?.name || '',
    nameEn: activeTenant?.nameEn || '',
    slug: activeTenant?.slug || '',
    description: activeTenant?.description || '',
    slogan: activeTenant?.slogan || '',
    logo: activeTenant?.logo || '',
    vatNumber: activeTenant?.vatNumber || '',
    crNumber: (activeTenant as any)?.crNumber || '',
    status: activeTenant?.status || 'live',
    currency: activeTenant?.currency || 'SAR',
    country: activeTenant?.country || 'المملكة العربية السعودية',
    timezone: activeTenant?.timezone || 'Asia/Riyadh',
    contactEmail: activeTenant?.contact?.email || currentUser?.email || '',
    contactPhone: activeTenant?.contact?.phone || '',
    contactWhatsapp: activeTenant?.contact?.whatsapp || '',
    city: activeTenant?.contact?.city || 'الرياض',
    address: activeTenant?.contact?.address || '',
    businessType: activeTenant?.businessType || 'general'
  });

  // Payment Gateways local state
  const [gateways, setGateways] = useState({
    mada: activeTenant?.paymentGateways?.mada ?? true,
    applePay: activeTenant?.paymentGateways?.applePay ?? true,
    visa: activeTenant?.paymentGateways?.visa ?? true,
    stcPay: activeTenant?.paymentGateways?.stcPay ?? true,
    tamara: activeTenant?.paymentGateways?.tamara ?? true,
    tabby: activeTenant?.paymentGateways?.tabby ?? false,
    cod: activeTenant?.paymentGateways?.cod ?? true,
    bankTransfer: activeTenant?.paymentGateways?.bankTransfer ?? true
  });

  // Bank Accounts local state
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(() => {
    if (activeTenant?.bankAccounts && activeTenant.bankAccounts.length > 0) {
      return activeTenant.bankAccounts;
    }
    return [
      {
        id: 'bank-1',
        bankName: 'مصرف الراجحي (Al Rajhi Bank)',
        accountHolder: activeTenant?.name || 'مؤسسة المتجر الرسمية',
        iban: 'SA0380000000608010167519',
        accountNumber: '608010167519',
        active: true
      }
    ];
  });

  // New Bank Form State
  const [showAddBank, setShowAddBank] = useState(false);
  const [newBank, setNewBank] = useState({
    bankName: 'مصرف الراجحي',
    accountHolder: '',
    iban: 'SA',
    accountNumber: ''
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    emailNewOrder: true,
    lowStockAlert: true,
    smsOrderUpdate: true,
    dailySalesDigest: false
  });

  // New Staff Invite Form State
  const [showInviteStaff, setShowInviteStaff] = useState(false);
  const [newStaffMember, setNewStaffMember] = useState({
    name: '',
    email: '',
    role: 'manager'
  });

  useEffect(() => {
    if (activeTenant) {
      setFormData({
        storeName: activeTenant.name || '',
        nameEn: activeTenant.nameEn || '',
        slug: activeTenant.slug || '',
        description: activeTenant.description || '',
        slogan: activeTenant.slogan || '',
        logo: activeTenant.logo || '',
        vatNumber: activeTenant.vatNumber || '',
        crNumber: (activeTenant as any)?.crNumber || '',
        status: activeTenant.status || 'live',
        currency: activeTenant.currency || 'SAR',
        country: activeTenant.country || 'المملكة العربية السعودية',
        timezone: activeTenant.timezone || 'Asia/Riyadh',
        contactEmail: activeTenant.contact?.email || currentUser?.email || '',
        contactPhone: activeTenant.contact?.phone || '',
        contactWhatsapp: activeTenant.contact?.whatsapp || '',
        city: activeTenant.contact?.city || 'الرياض',
        address: activeTenant.contact?.address || '',
        businessType: activeTenant.businessType || 'general'
      });
      if (activeTenant.paymentGateways) {
        setGateways({
          mada: activeTenant.paymentGateways.mada ?? true,
          applePay: activeTenant.paymentGateways.applePay ?? true,
          visa: activeTenant.paymentGateways.visa ?? true,
          stcPay: activeTenant.paymentGateways.stcPay ?? true,
          tamara: activeTenant.paymentGateways.tamara ?? true,
          tabby: activeTenant.paymentGateways.tabby ?? false,
          cod: activeTenant.paymentGateways.cod ?? true,
          bankTransfer: activeTenant.paymentGateways.bankTransfer ?? true
        });
      }
      if (activeTenant.bankAccounts && activeTenant.bankAccounts.length > 0) {
        setBankAccounts(activeTenant.bankAccounts);
      }
      if (activeTenant.shippingMethods && activeTenant.shippingMethods.length > 0) {
        setShippingMethods(activeTenant.shippingMethods);
      }
      setHasUnsavedChanges(false);
    }
  }, [activeTenant]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const toggleGateway = (gatewayKey: keyof typeof gateways) => {
    setGateways(prev => ({ ...prev, [gatewayKey]: !prev[gatewayKey] }));
    setHasUnsavedChanges(true);
  };

  const handleAddBankAccount = () => {
    if (!newBank.accountHolder.trim() || !newBank.iban.trim()) {
      showToast(isAr ? 'يرجى إدخال اسم صاحب الحساب والآيبان بدقة' : 'Please provide account holder and IBAN', 'error');
      return;
    }
    const account: BankAccount = {
      id: `bank-${Date.now()}`,
      bankName: newBank.bankName,
      accountHolder: newBank.accountHolder,
      iban: newBank.iban,
      accountNumber: newBank.accountNumber || newBank.iban.slice(-10),
      active: true
    };
    setBankAccounts(prev => [...prev, account]);
    setNewBank({ bankName: 'مصرف الراجحي', accountHolder: '', iban: 'SA', accountNumber: '' });
    setShowAddBank(false);
    setHasUnsavedChanges(true);
    showToast(isAr ? 'تمت إضافة الحساب البنكي بنجاح' : 'Bank account added successfully', 'success');
  };

  const handleRemoveBankAccount = (id: string) => {
    setBankAccounts(prev => prev.filter(b => b.id !== id));
    setHasUnsavedChanges(true);
    showToast(isAr ? 'تم حذف الحساب البنكي' : 'Bank account removed', 'info');
  };

  const handleSaveShippingOnly = async () => {
    if (!activeTenant) return;
    setIsSaving(true);
    try {
      await updateTenant(activeTenant.id, {
        shippingMethods: shippingMethods
      });
      setHasUnsavedChanges(false);
      showToast(isAr ? 'تم حفظ وتفعيل خيارات الشحن والتوصيل بنجاح' : 'Shipping settings saved and activated successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر حفظ إعدادات الشحن' : 'Failed to save shipping settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!activeTenant) return;
    setIsSaving(true);
    try {
      await updateTenant(activeTenant.id, {
        name: formData.storeName,
        nameEn: formData.nameEn,
        slug: formData.slug,
        description: formData.description,
        slogan: formData.slogan,
        logo: formData.logo,
        vatNumber: formData.vatNumber,
        status: formData.status as any,
        currency: formData.currency,
        country: formData.country,
        timezone: formData.timezone,
        businessType: formData.businessType as any,
        contact: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
          whatsapp: formData.contactWhatsapp,
          city: formData.city,
          country: formData.country,
          address: formData.address
        },
        paymentGateways: gateways,
        bankAccounts: bankAccounts,
        shippingMethods: shippingMethods
      });
      setHasUnsavedChanges(false);
      showToast(isAr ? 'تم حفظ وتطبيق كافة التغييرات بنجاح' : 'Settings saved successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر حفظ الإعدادات. يرجى المحاولة لاحقاً' : 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'features_hub', label: isAr ? 'مركز الميزات والوحدات' : 'Feature & Module Hub', icon: Sparkles },
    { id: 'general', label: isAr ? 'عام والهوية' : 'General & Brand', icon: Building2 },
    { id: 'business', label: isAr ? 'معلومات النشاط والضريبة' : 'Business & Tax', icon: Globe },
    { id: 'localization', label: isAr ? 'اللغة والعملة' : 'Localization', icon: Coins },
    { id: 'payments', label: isAr ? 'المدفوعات والبنوك' : 'Payments & Banking', icon: CreditCard },
    { id: 'shipping', label: isAr ? 'الشحن والتوصيل' : 'Shipping', icon: Truck },
    { id: 'notifications', label: isAr ? 'الإشعارات والتنبيهات' : 'Notifications', icon: Bell },
    { id: 'team', label: isAr ? 'فريق العمل والصلاحيات' : 'Team & Staff', icon: Users },
    { id: 'security', label: isAr ? 'الأمان والجلسات' : 'Security', icon: ShieldAlert },
    { id: 'danger', label: isAr ? 'منطقة الخطر' : 'Danger Zone', icon: Lock }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Header & Unsaved Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0B1422] border border-[#233247] p-6 rounded-3xl shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white">{isAr ? 'إعدادات المتجر السيادي' : 'Store Settings'}</h1>
          <p className="text-xs text-[#97A4B5] mt-1">
            {isAr ? 'إدارة الهوية، البوابات، الشحن، صلاحيات الفريق، والإعدادات الأمنية للمتجر الحالي.' : 'Manage identity, gateways, shipping, team permissions, and security.'}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {hasUnsavedChanges && (
            <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'تغييرات غير محفوظة' : 'Unsaved Changes'}</span>
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-xs hover:opacity-90 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout: Tabs + Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1 bg-[#0B1422] border border-[#233247] rounded-3xl p-3 space-y-1 h-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-start ${
                  isActive 
                    ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30 shadow-inner' 
                    : 'text-[#97A4B5] hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A45C]' : 'text-[#97A4B5]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* FEATURES & MODULES HUB TAB */}
          {activeTab === 'features_hub' && (
            <FeatureManagerView />
          )}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'الإعدادات العامة وهوية المتجر' : 'General Store Settings & Identity'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'اسم المتجر، الشعار، معرّف المتجر الداخلي، والسلوجان الترويجي.' : 'Store name, logo, internal ID, and slogan.'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}</label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      placeholder={isAr ? 'مثال: قصر العود الملكي' : 'Royal Oud Palace'}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'اسم المتجر (بالإنجليزية)' : 'Store Name (English)'}</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => handleChange('nameEn', e.target.value)}
                      placeholder="Royal Oud Palace"
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Slogan & Tagline */}
                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'شعار المتجر اللفظي (السلوجان)' : 'Store Slogan / Tagline'}</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => handleChange('slogan', e.target.value)}
                    placeholder={isAr ? 'مثال: فخامة التراث وعبير الأصالة العربية' : 'Heritage of Luxury & Authenticity'}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                {/* Logo URL & Live Preview */}
                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رابط شعار المتجر (Logo URL)' : 'Store Logo URL'}</label>
                  <div className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-xl bg-[#050B14] border border-[#233247] flex items-center justify-center shrink-0 overflow-hidden">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-[#97A4B5]" />
                      )}
                    </div>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleChange('logo', e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Slug / Identifier */}
                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'معرّف المتجر في النظام (Store ID / Slug)' : 'Store Identifier (Slug)'}</label>
                  <div className="flex rounded-xl overflow-hidden border border-[#233247] bg-[#050B14]">
                    <span className="px-4 py-3 bg-white/[0.03] text-[#97A4B5] text-xs flex items-center font-mono">store_id: </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleChange('slug', e.target.value)}
                      className="w-full bg-transparent px-4 py-3 text-white text-xs focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'وصف المتجر' : 'Store Description'}</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl p-4 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'حالة المتجر التشغيلية' : 'Store Operational Status'}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="live">{isAr ? 'نشط ومباشر (Live)' : 'Live / Published'}</option>
                    <option value="draft">{isAr ? 'مسودة وإعداد (Draft)' : 'Draft'}</option>
                    <option value="paused">{isAr ? 'متوقف مؤقتاً (Paused)' : 'Paused'}</option>
                    <option value="maintenance">{isAr ? 'تحت الصيانة (Maintenance)' : 'Maintenance'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* BUSINESS TAB */}
          {activeTab === 'business' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'معلومات النشاط التجاري والضريبة' : 'Business & Tax Information'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'بيانات التواصل الرسمية، الرقم الضريبي، والسجل التجاري.' : 'Legal contact details, VAT number, and commercial registration.'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'البريد الإلكتروني للطلبات' : 'Contact Email'}</label>
                    <div className="relative">
                      <Mail className="absolute start-3 top-3.5 w-4 h-4 text-[#97A4B5]" />
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => handleChange('contactEmail', e.target.value)}
                        className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-10 pe-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رقم هاتف الدعم' : 'Phone Number'}</label>
                    <div className="relative">
                      <Phone className="absolute start-3 top-3.5 w-4 h-4 text-[#97A4B5]" />
                      <input
                        type="text"
                        value={formData.contactPhone}
                        onChange={(e) => handleChange('contactPhone', e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-10 pe-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رقم الواتساب للطلبات' : 'WhatsApp Number'}</label>
                    <div className="relative">
                      <Smartphone className="absolute start-3 top-3.5 w-4 h-4 text-emerald-400" />
                      <input
                        type="text"
                        value={formData.contactWhatsapp}
                        onChange={(e) => handleChange('contactWhatsapp', e.target.value)}
                        placeholder="+966 50 000 0000"
                        className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-10 pe-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'المدينة' : 'City'}</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder={isAr ? 'الرياض' : 'Riyadh'}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Tax & Legal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'الرقم الضريبي (VAT Number)' : 'VAT Registration Number'}</label>
                    <input
                      type="text"
                      value={formData.vatNumber}
                      onChange={(e) => handleChange('vatNumber', e.target.value)}
                      placeholder="310982345600003"
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                    />
                    <p className="text-[10px] text-[#97A4B5] mt-1">{isAr ? 'يتكون من 15 خانة وفقاً لهيئة الزكاة والضريبة والجمارك ZATCA.' : '15 digits standard VAT format.'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رقم السجل التجاري (CR Number)' : 'Commercial Registration'}</label>
                    <input
                      type="text"
                      value={formData.crNumber}
                      onChange={(e) => handleChange('crNumber', e.target.value)}
                      placeholder="1010123456"
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'العنوان المادي والمستودع' : 'Physical Address / Warehouse'}</label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-3.5 w-4 h-4 text-[#97A4B5]" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder={isAr ? 'الرياض، حي العليا، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-10 pe-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'قطاع النشاط التجاري' : 'Industry'}</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleChange('businessType', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="general">{isAr ? 'تجارة عامة وتجزئة' : 'General Retail'}</option>
                    <option value="honey">{isAr ? 'عسل وتمور وأغذية تراثية' : 'Honey, Dates & Specialty Food'}</option>
                    <option value="coffee">{isAr ? 'محامص وبن مختص' : 'Specialty Coffee'}</option>
                    <option value="fashion">{isAr ? 'أزياء وعبايات وملابس' : 'Fashion & Apparel'}</option>
                    <option value="electronics">{isAr ? 'إلكترونيات وأجهزة' : 'Electronics & Hardware'}</option>
                    <option value="cosmetics">{isAr ? 'عطور ومستحضرات تجميل' : 'Perfumes & Cosmetics'}</option>
                    <option value="wholesale">{isAr ? 'تجارة الجملة والتوريد (B2B)' : 'Wholesale & B2B Hub'}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* LOCALIZATION TAB */}
          {activeTab === 'localization' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'اللغة والعملة والمنطقة الزمنية' : 'Localization & Currency'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'إعدادات العملات والمنطقة.' : 'Currency and regional configurations.'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'الدولة / المنطقة' : 'Country / Region'}</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'العملة الأساسية' : 'Primary Currency'}</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    >
                      <option value="SAR">SAR (ريال سعودي - ر.س)</option>
                      <option value="AED">AED (درهم إماراتي - د.إ)</option>
                      <option value="KWD">KWD (دينار كويتي - د.ك)</option>
                      <option value="BHD">BHD (دينار بحريني - د.ب)</option>
                      <option value="OMR">OMR (ريال عماني - ر.ع)</option>
                      <option value="QAR">QAR (ريال قطري - ر.ق)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'المنطقة الزمنية' : 'Timezone'}</label>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange('timezone', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="Asia/Riyadh">(GMT+3) Riyadh, Kuwait, Doha</option>
                    <option value="Asia/Dubai">(GMT+4) Dubai, Abu Dhabi</option>
                    <option value="Africa/Cairo">(GMT+2) Cairo</option>
                    <option value="UTC">(GMT+0) UTC</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PAYMENTS & BANKING TAB */}
          {activeTab === 'payments' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'بوابات المدفوعات والحسابات البنكية' : 'Payment Gateways & Bank Accounts'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'تفعيل بوابات الدفع الإلكتروني، خيارات التقسيط، والحسابات البنكية لاستقبال التحويلات.' : 'Enable electronic payment methods, BNPL, and store bank accounts.'}</p>
              </div>

              {/* Payment Gateways Toggles */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">{isAr ? 'طرق وبوابات الدفع الإلكتروني' : 'Payment Methods'}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { key: 'mada' as const, name: 'مدى (Mada)', sub: isAr ? 'البطاقات البنكية السعودية' : 'Saudi Debit Cards', color: 'text-emerald-400 bg-emerald-500/10' },
                    { key: 'applePay' as const, name: 'Apple Pay', sub: isAr ? 'الدفع السريع بنقرة واحدة' : 'One-tap Checkout', color: 'text-slate-100 bg-white/10' },
                    { key: 'visa' as const, name: 'Visa & Mastercard', sub: isAr ? 'البطاقات الائتمانية الدولية' : 'Credit Cards', color: 'text-blue-400 bg-blue-500/10' },
                    { key: 'stcPay' as const, name: 'STC Pay', sub: isAr ? 'المحفظة الرقمية' : 'Digital Wallet', color: 'text-purple-400 bg-purple-500/10' },
                    { key: 'tamara' as const, name: 'تمارا (Tamara)', sub: isAr ? 'اشتر الآن وادفع لاحقاً (تقسيط)' : 'Buy Now Pay Later', color: 'text-amber-400 bg-amber-500/10' },
                    { key: 'tabby' as const, name: 'تابي (Tabby)', sub: isAr ? 'قسط مشترياتك على 4 دفعات' : 'Split in 4 Payments', color: 'text-emerald-400 bg-emerald-500/10' },
                    { key: 'bankTransfer' as const, name: isAr ? 'التحويل البنكي المباشر' : 'Direct Bank Transfer', sub: isAr ? 'إرفاق إيصال التحويل' : 'Manual Receipt Upload', color: 'text-teal-400 bg-teal-500/10' },
                    { key: 'cod' as const, name: isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery', sub: isAr ? 'تحصيل نقدي عند التوصيل' : 'Pay Upon Delivery', color: 'text-amber-300 bg-amber-500/10' }
                  ].map(gateway => {
                    const isEnabled = gateways[gateway.key];
                    return (
                      <div 
                        key={gateway.key}
                        onClick={() => toggleGateway(gateway.key)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between select-none ${
                          isEnabled 
                            ? 'bg-[#050B14] border-emerald-500/40 hover:border-emerald-500/60' 
                            : 'bg-[#050B14]/60 border-[#233247] hover:border-slate-700 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${gateway.color}`}>
                            <CreditCard className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{gateway.name}</div>
                            <div className="text-[10px] text-[#97A4B5] mt-0.5">{gateway.sub}</div>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                          isEnabled ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-[#233247] bg-transparent'
                        }`}>
                          {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Official Store Bank Accounts */}
              <div className="space-y-4 pt-4 border-t border-[#233247]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9A45C]">{isAr ? 'الحسابات البنكية للتحويل المباشر' : 'Bank Accounts'}</h3>
                    <p className="text-[11px] text-[#97A4B5] mt-0.5">{isAr ? 'الحسابات التي تظهر للعملاء عند اختيار التحويل البنكي.' : 'Accounts displayed to customers during checkout.'}</p>
                  </div>
                  <button
                    onClick={() => setShowAddBank(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#C9A45C]/15 hover:bg-[#C9A45C]/25 text-[#C9A45C] border border-[#C9A45C]/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة حساب بنكي' : 'Add Bank Account'}</span>
                  </button>
                </div>

                {/* Add Bank Account Modal / Inline Form */}
                {showAddBank && (
                  <div className="p-5 rounded-2xl bg-[#050B14] border border-[#C9A45C]/40 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{isAr ? 'إضافة حساب بنكي جديد' : 'New Bank Account'}</span>
                      <button onClick={() => setShowAddBank(false)} className="text-slate-400 hover:text-white">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'اسم البنك' : 'Bank Name'}</label>
                        <select
                          value={newBank.bankName}
                          onChange={(e) => setNewBank(prev => ({ ...prev, bankName: e.target.value }))}
                          className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs"
                        >
                          <option value="مصرف الراجحي (Al Rajhi Bank)">مصرف الراجحي (Al Rajhi Bank)</option>
                          <option value="البنك الأهلي السعودي (SNB)">البنك الأهلي السعودي (SNB)</option>
                          <option value="مصرف الإنماء (Alinma Bank)">مصرف الإنماء (Alinma Bank)</option>
                          <option value="بنك الرياض (Riyad Bank)">بنك الرياض (Riyad Bank)</option>
                          <option value="بنك البلاد (Bank Albilad)">بنك البلاد (Bank Albilad)</option>
                          <option value="البنك السعودي الأول (SAB)">البنك السعودي الأول (SAB)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'اسم صاحب الحساب (كما في البنك)' : 'Account Holder'}</label>
                        <input
                          type="text"
                          value={newBank.accountHolder}
                          onChange={(e) => setNewBank(prev => ({ ...prev, accountHolder: e.target.value }))}
                          placeholder={isAr ? 'مثال: شركة المتجر للتجارة' : 'Store Trading LLC'}
                          className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'رقم الآيبان (IBAN)' : 'IBAN Number'}</label>
                        <input
                          type="text"
                          value={newBank.iban}
                          onChange={(e) => setNewBank(prev => ({ ...prev, iban: e.target.value.toUpperCase() }))}
                          placeholder="SA0000000000000000000000"
                          className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setShowAddBank(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        onClick={handleAddBankAccount}
                        className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#050B14] text-xs font-bold"
                      >
                        {isAr ? 'حفظ الحساب' : 'Save Account'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Bank Accounts List */}
                <div className="space-y-3">
                  {bankAccounts.map((account) => (
                    <div key={account.id} className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{account.bankName}</span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono">{isAr ? 'نشط' : 'Active'}</span>
                          </div>
                          <div className="text-[11px] text-[#97A4B5] mt-0.5">{account.accountHolder}</div>
                          <div className="text-[11px] text-[#C9A45C] font-mono mt-0.5">{account.iban}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBankAccount(account.id)}
                        className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                        title={isAr ? 'حذف الحساب' : 'Remove Account'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === 'shipping' && (
            <ShippingManager
              shippingMethods={shippingMethods}
              onChange={(updated) => {
                setShippingMethods(updated);
                setHasUnsavedChanges(true);
              }}
              onSave={handleSaveShippingOnly}
              isSaving={isSaving}
              currency={formData.currency}
              isAr={isAr}
            />
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'إعدادات الإشعارات والتنبيهات الفورية' : 'Notifications & Alerts'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'التحكم في تنبيهات الطلبات الجديدة والمخزون المنخفض.' : 'Order, stock, and customer notification rules.'}</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'emailNewOrder' as const,
                    title: isAr ? 'إشعارات الطلبات الجديدة (بريد إلكتروني)' : 'New Order Email Notifications',
                    desc: isAr ? 'إرسال تنبيه فوري إلى بريد الإدارة عند استلام أي طلب جديد' : 'Instant email alert on new orders'
                  },
                  {
                    key: 'lowStockAlert' as const,
                    title: isAr ? 'تنبيهات انخفاض المخزون' : 'Low Stock Inventory Alerts',
                    desc: isAr ? 'تنبيه فوري عندما يقل رصيد أي منتج عن الحد الأدنى المحدد' : 'Alert when stock falls below threshold'
                  },
                  {
                    key: 'smsOrderUpdate' as const,
                    title: isAr ? 'رسائل تحديث حالة الشحن للعملاء' : 'Customer SMS/WhatsApp Shipment Updates',
                    desc: isAr ? 'إرسال إشعار للعميل عند شحن الطلب وتحديث رقم التتبع' : 'Send update when tracking number is added'
                  },
                  {
                    key: 'dailySalesDigest' as const,
                    title: isAr ? 'التقرير المالي اليومي التلقائي' : 'Daily Sales Digest',
                    desc: isAr ? 'ملخص يومي بإجمالي المبيعات، عدد الطلبات، والأرباح' : 'Daily summary of sales, orders, and revenue'
                  }
                ].map((item) => (
                  <div 
                    key={item.key}
                    onClick={() => {
                      setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }));
                      setHasUnsavedChanges(true);
                    }}
                    className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between cursor-pointer select-none hover:border-[#C9A45C]/40 transition-all"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{item.title}</div>
                      <div className="text-[10px] text-[#97A4B5] mt-0.5">{item.desc}</div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      notifications[item.key] ? 'bg-[#C9A45C] border-[#C9A45C] text-[#050B14]' : 'border-[#233247]'
                    }`}>
                      {notifications[item.key] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{isAr ? 'فريق العمل والصلاحيات (RBAC)' : 'Team & Staff Permissions'}</h2>
                  <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'إدارة أعضاء الفريق وصلاحيات الوصول للوحة التحكم.' : 'Staff members and role access.'}</p>
                </div>
                <button 
                  onClick={() => setShowInviteStaff(true)}
                  className="px-4 py-2 bg-[#C9A45C] text-[#050B14] rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'دعوة عضو جديد' : 'Invite Member'}</span>
                </button>
              </div>

              {/* Staff Invite Form */}
              {showInviteStaff && (
                <div className="p-5 rounded-2xl bg-[#050B14] border border-[#C9A45C]/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{isAr ? 'دعوة عضو جديد لفريق العمل' : 'Invite New Staff Member'}</span>
                    <button onClick={() => setShowInviteStaff(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'الاسم' : 'Name'}</label>
                      <input
                        type="text"
                        value={newStaffMember.name}
                        onChange={(e) => setNewStaffMember(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={isAr ? 'اسم العضو' : 'Member Name'}
                        className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                      <input
                        type="email"
                        value={newStaffMember.email}
                        onChange={(e) => setNewStaffMember(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="staff@store.sa"
                        className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#97A4B5] mb-1">{isAr ? 'الصلاحية (الدور)' : 'Role'}</label>
                      <select
                        value={newStaffMember.role}
                        onChange={(e) => setNewStaffMember(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-[#0B1422] border border-[#233247] rounded-xl px-3 py-2 text-white text-xs"
                      >
                        <option value="manager">{isAr ? 'مدير عمليات (Operations)' : 'Manager'}</option>
                        <option value="support">{isAr ? 'خدمة عملاء ودعم' : 'Support'}</option>
                        <option value="accountant">{isAr ? 'محاسب ومدقق مالي' : 'Accountant'}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowInviteStaff(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      onClick={() => {
                        if (!newStaffMember.email.trim()) {
                          showToast(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email', 'error');
                          return;
                        }
                        showToast(isAr ? `تم إرسال دعوة الانضمام إلى ${newStaffMember.email}` : 'Invitation sent', 'success');
                        setShowInviteStaff(false);
                        setNewStaffMember({ name: '', email: '', role: 'manager' });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#C9A45C] text-[#050B14] text-xs font-bold"
                    >
                      {isAr ? 'إرسال الدعوة' : 'Send Invitation'}
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {/* Store Owner */}
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-black text-xs flex items-center justify-center">
                      {currentUser?.name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{currentUser?.name || 'Store Owner'} ({currentUser?.email || 'owner@store.sa'})</div>
                      <div className="text-[10px] text-[#C9A45C] font-semibold mt-0.5">{isAr ? 'مالك المتجر (صلاحية كاملة Root Access)' : 'Store Owner (Full Access)'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full">{isAr ? 'نشط' : 'Active'}</span>
                </div>

                {/* Additional Staff if any */}
                {staff && staff.map(member => (
                  <div key={member.id} className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{member.name} ({member.email})</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{member.role}</div>
                      </div>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full">{isAr ? 'نشط' : 'Active'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'الأمان والجلسات وحماية المتجر' : 'Security & Active Sessions'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'جلسات المتصفح النشطة وحماية الحساب المشفرة.' : 'Browser sessions and account protection.'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <div className="text-xs font-bold text-white">{isAr ? 'الجلسة الحالية المشفرة (Cloud Run Ingress)' : 'Current Browser Session'}</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{isAr ? 'مؤمنة بشهادة SSL 256-bit - نشطة الآن' : 'Active now - Secure SSL'}</div>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-full">{isAr ? 'جلسة حالية' : 'Current'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-xs font-bold text-white">{isAr ? 'المصادقة الثنائية (2FA OTP)' : 'Two-Factor Authentication'}</div>
                      <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'طلب رمز تأكيد إضافي عند تسجيل الدخول' : 'Extra security OTP on login'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعلة' : 'Enabled'}</span>
                </div>
              </div>
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <div className="bg-[#0B1422] border border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-red-400">{isAr ? 'منطقة الخطر (إجراءات حساسة)' : 'Danger Zone'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'إيقاف المتجر مؤقتاً أو الحذف النهائي.' : 'Pause or permanently delete store.'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'حذف المتجر نهائياً' : 'Permanently Delete Store'}</div>
                    <div className="text-[10px] text-red-400 mt-0.5">{isAr ? 'سيتم إزالة جميع المنتجات، الطلبات، والبيانات المرتبطة نهائياً.' : 'This will remove all products, orders, and data permanently.'}</div>
                  </div>
                  <button
                    onClick={() => {
                      const expectedName = activeTenant?.name || '';
                      if (deleteConfirmText.trim() === expectedName.trim()) {
                        showToast(isAr ? 'تم تأكيد طلب حذف المتجر' : 'Store deletion request processed', 'success');
                      } else {
                        showToast(isAr ? 'يرجى كتابة اسم المتجر بدقة لتأكيد الحذف' : 'Please type store name to confirm deletion', 'error');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white font-bold text-xs transition-all border border-red-500/40"
                  >
                    {isAr ? 'حذف المتجر' : 'Delete Store'}
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] text-[#97A4B5] mb-1.5">
                    {isAr ? `اكتب "${activeTenant?.name}" للتأكيد:` : `Type "${activeTenant?.name}" to confirm:`}
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={activeTenant?.name}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

