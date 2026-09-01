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
  ExternalLink
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const SettingsView: React.FC = () => {
  const { activeTenant, updateTenant, showToast, language, currentUser } = useCommerce();
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<string>('general');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>('');

  // Form Local State mirroring activeTenant
  const [formData, setFormData] = useState({
    storeName: activeTenant?.storeName || '',
    nameEn: activeTenant?.nameEn || '',
    slug: activeTenant?.slug || '',
    description: activeTenant?.description || '',
    status: activeTenant?.status || 'live',
    currency: activeTenant?.currency || 'SAR',
    country: activeTenant?.country || 'المملكة العربية السعودية',
    timezone: activeTenant?.timezone || 'Asia/Riyadh',
    contactEmail: activeTenant?.contact?.email || currentUser?.email || '',
    contactPhone: activeTenant?.contact?.phone || '',
    address: activeTenant?.contact?.address || '',
    businessType: activeTenant?.businessType || 'general'
  });

  useEffect(() => {
    if (activeTenant) {
      setFormData({
        storeName: activeTenant.storeName || '',
        nameEn: activeTenant.nameEn || '',
        slug: activeTenant.slug || '',
        description: activeTenant.description || '',
        status: activeTenant.status || 'live',
        currency: activeTenant.currency || 'SAR',
        country: activeTenant.country || 'المملكة العربية السعودية',
        timezone: activeTenant.timezone || 'Asia/Riyadh',
        contactEmail: activeTenant.contact?.email || currentUser?.email || '',
        contactPhone: activeTenant.contact?.phone || '',
        address: activeTenant.contact?.address || '',
        businessType: activeTenant.businessType || 'general'
      });
      setHasUnsavedChanges(false);
    }
  }, [activeTenant]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    if (!activeTenant) return;
    setIsSaving(true);
    try {
      await updateTenant(activeTenant.id, {
        storeName: formData.storeName,
        nameEn: formData.nameEn,
        slug: formData.slug,
        description: formData.description,
        status: formData.status as any,
        currency: formData.currency,
        country: formData.country,
        timezone: formData.timezone,
        businessType: formData.businessType as any,
        contact: {
          email: formData.contactEmail,
          phone: formData.contactPhone,
          address: formData.address
        }
      });
      setHasUnsavedChanges(false);
      showToast(isAr ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(isAr ? 'تعذر حفظ الإعدادات. يرجى المحاولة لاحقاً' : 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: isAr ? 'عام' : 'General', icon: Building2 },
    { id: 'business', label: isAr ? 'معلومات النشاط' : 'Business', icon: Globe },
    { id: 'localization', label: isAr ? 'اللغة والعملة' : 'Localization', icon: Coins },
    { id: 'payments', label: isAr ? 'المدفوعات' : 'Payments', icon: CreditCard },
    { id: 'shipping', label: isAr ? 'الشحن والتوصيل' : 'Shipping', icon: Truck },
    { id: 'notifications', label: isAr ? 'الإشعارات' : 'Notifications', icon: Bell },
    { id: 'team', label: isAr ? 'فريق العمل' : 'Team & Staff', icon: Users },
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
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'الإعدادات العامة للعلامة التجارية' : 'General Store Identity'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'اسم المتجر، الشعار، والوصف المعروض للعملاء.' : 'Store name, logo, and customer-facing description.'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'اسم المتجر (بالعربية)' : 'Store Name (Arabic)'}</label>
                    <input
                      type="text"
                      value={formData.storeName}
                      onChange={(e) => handleChange('storeName', e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'اسم المتجر (بالإنجليزية)' : 'Store Name (English)'}</label>
                    <input
                      type="text"
                      value={formData.nameEn}
                      onChange={(e) => handleChange('nameEn', e.target.value)}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رابط المتجر (Slug)' : 'Store URL Slug'}</label>
                  <div className="flex rounded-xl overflow-hidden border border-[#233247] bg-[#050B14]">
                    <span className="px-4 py-3 bg-white/[0.03] text-[#97A4B5] text-xs flex items-center font-mono">commerceos.app/store/</span>
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
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'حالة المتجر' : 'Store Status'}</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="live">{isAr ? 'نشط (Live)' : 'Live / Published'}</option>
                    <option value="draft">{isAr ? 'مسودة (Draft)' : 'Draft'}</option>
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
                <h2 className="text-lg font-bold text-white">{isAr ? 'معلومات النشاط التجاري' : 'Business Information'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'بيانات التواصل القانونية والعنوان.' : 'Legal contact details and address.'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'البريد الإلكتروني للتواصل' : 'Contact Email'}</label>
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
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
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

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'العنوان المادي' : 'Physical Address'}</label>
                  <div className="relative">
                    <MapPin className="absolute start-3 top-3.5 w-4 h-4 text-[#97A4B5]" />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder={isAr ? 'الرياض، المملكة العربية السعودية' : 'Riyadh, Saudi Arabia'}
                      className="w-full bg-[#050B14] border border-[#233247] rounded-xl ps-10 pe-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'قطاع النشاط' : 'Industry'}</label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleChange('businessType', e.target.value)}
                    className="w-full bg-[#050B14] border border-[#233247] rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-[#C9A45C]"
                  >
                    <option value="general">{isAr ? 'تجارة عامة' : 'General Retail'}</option>
                    <option value="fashion">{isAr ? 'أزياء وملابس' : 'Fashion & Apparel'}</option>
                    <option value="electronics">{isAr ? 'إلكترونيات' : 'Electronics'}</option>
                    <option value="cosmetics">{isAr ? 'مستحضرات وعطور' : 'Cosmetics & Perfumes'}</option>
                    <option value="food">{isAr ? 'أغذية ومشروبات' : 'Food & Beverage'}</option>
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
                    <label className="block text-xs font-bold text-[#97A4B5] uppercase tracking-wider mb-2">{isAr ? 'العملة الأساسية (قفل لمنع تكسير الطلبات)' : 'Primary Currency (Locked)'}</label>
                    <select
                      value={formData.currency}
                      disabled
                      className="w-full bg-[#050B14]/50 border border-[#233247] rounded-xl px-4 py-3 text-slate-400 text-xs cursor-not-allowed"
                    >
                      <option value="SAR">SAR (ريال سعودي)</option>
                      <option value="AED">AED (درهم إماراتي)</option>
                      <option value="USD">USD (دولار أمريكي)</option>
                    </select>
                    <p className="text-[10px] text-[#97A4B5] mt-1">{isAr ? 'العملة الأساسية مقفلة لضمان استقرار سجلات الطلبات والمعاملات المالية.' : 'Currency is locked to protect order history integrity.'}</p>
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

          {/* PAYMENTS TAB */}
          {activeTab === 'payments' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'بوابات المدفوعات السيادية' : 'Payment Gateways'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'طرق الدفع المفعلة لمتجرك.' : 'Active payment methods for your store.'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Mada / Visa / Mastercard (HyperPay / Tap)</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{isAr ? 'نشط وآمن (وضع الإنتاج)' : 'Active (Live Mode)'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعل' : 'Enabled'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Apple Pay & STC Pay</div>
                      <div className="text-[10px] text-blue-400 mt-0.5">{isAr ? 'مدعوم تلقائياً' : 'Auto-configured'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعل' : 'Enabled'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{isAr ? 'اختياري للعملاء' : 'Optional for customers'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعل' : 'Enabled'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SHIPPING TAB */}
          {activeTab === 'shipping' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'خيارات الشحن والتوصيل' : 'Shipping & Delivery'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'شركات الشحن والأسعار المحلية والدولية.' : 'Carrier integration and rates.'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Aramex / SPL Express (شحن سريع)</div>
                      <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'التوصيل خلال 2-3 أيام عمل - 25 SAR' : '2-3 business days - 25 SAR'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعل' : 'Active'}</span>
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center font-bold">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{isAr ? 'التوصيل المحلي داخل المدينة' : 'Local City Delivery'}</div>
                      <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'نفس اليوم - 15 SAR' : 'Same day delivery - 15 SAR'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full">{isAr ? 'مفعل' : 'Active'}</span>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'إعدادات الإشعارات والتنبيهات' : 'Notifications'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'إشعارات الطلبات والعملاء.' : 'Order and customer notification rules.'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'إشعارات الطلبات الجديدة (بريد إلكتروني)' : 'New Order Email Notifications'}</div>
                    <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'إرسال تنبيه فوري عند استلام طلب جديد' : 'Instant email alert on new orders'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C9A45C]" />
                </div>

                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'تنبيهات انخفاض المخزون' : 'Low Stock Inventory Alerts'}</div>
                    <div className="text-[10px] text-[#97A4B5] mt-0.5">{isAr ? 'تنبيه عندما يقل مخزون المنتج عن 5 قطع' : 'Alert when stock falls below 5'}</div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C9A45C]" />
                </div>
              </div>
            </div>
          )}

          {/* TEAM TAB */}
          {activeTab === 'team' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">{isAr ? 'فريق العمل والصلاحيات (RBAC)' : 'Team & Staff Permissions'}</h2>
                  <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'الأعضاء وصلاحياتهم في المتجر.' : 'Staff members and role access.'}</p>
                </div>
                <button 
                  onClick={() => showToast(isAr ? 'تم إرسال دعوة جديدة للعضو' : 'Staff invitation sent', 'success')}
                  className="px-4 py-2 bg-[#C9A45C] text-[#050B14] rounded-xl text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'دعوة عضو جديد' : 'Invite Member'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C9A45C] to-[#9A7B26] text-[#050B14] font-bold text-xs flex items-center justify-center">
                      {currentUser?.name?.charAt(0) || 'M'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{currentUser?.name || 'Store Owner'} ({currentUser?.email || 'owner@store.sa'})</div>
                      <div className="text-[10px] text-[#C9A45C] font-semibold mt-0.5">{isAr ? 'مالك المتجر (Full Access)' : 'Store Owner (Full Access)'}</div>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded-full">{isAr ? 'نشط' : 'Active'}</span>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{isAr ? 'الأمان والجلسات النشطة' : 'Security & Active Sessions'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'جلسات المتصفح وحماية الحساب.' : 'Browser sessions and account protection.'}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#050B14] border border-[#233247] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#C9A45C]" />
                    <div>
                      <div className="text-xs font-bold text-white">Current Browser Session (Cloud Run Secure)</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">{isAr ? 'نشط الآن - IP مؤمن' : 'Active now - Secure IP'}</div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Current</span>
                </div>
              </div>
            </div>
          )}

          {/* DANGER ZONE TAB */}
          {activeTab === 'danger' && (
            <div className="bg-[#0B1422] border border-red-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-red-400">{isAr ? 'منطقة الخطر (إجراءات حساسة)' : 'Danger Zone'}</h2>
                <p className="text-xs text-[#97A4B5] mt-0.5">{isAr ? 'تعطيل أو حذف المتجر النهائي.' : 'Pause or permanently delete store.'}</p>
              </div>

              <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'حذف المتجر نهائياً' : 'Permanently Delete Store'}</div>
                    <div className="text-[10px] text-red-400 mt-0.5">{isAr ? 'سيتم إزالة جميع المنتجات، الطلبات، والبيانات المرتبطة نهائياً.' : 'This will remove all products, orders, and data permanently.'}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (deleteConfirmText === activeTenant?.storeName) {
                        showToast(isAr ? 'تم حذف المتجر بنجاح' : 'Store deleted successfully', 'success');
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
                    {isAr ? `اكتب "${activeTenant?.storeName}" للتأكيد:` : `Type "${activeTenant?.storeName}" to confirm:`}
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={activeTenant?.storeName}
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
