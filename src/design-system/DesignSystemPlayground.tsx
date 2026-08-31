import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Layers,
  Type,
  Palette,
  Square,
  CheckSquare,
  Layout,
  Table as TableIcon,
  Bell,
  Sliders,
  Play,
  Check,
  AlertTriangle,
  Info,
  XCircle,
  Search,
  Lock,
  Mail,
  User,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  BarChart3,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Globe
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';

import {
  rawColors,
  semanticColors,
  typography,
  spacing,
  radius,
  shadows,
  glass,
  Button,
  IconButton,
  Input,
  SearchInput,
  PasswordInput,
  Textarea,
  Select,
  Field,
  Checkbox,
  Radio,
  Switch,
  Card,
  MetricCard,
  ChartCard,
  Badge,
  StatusBadge,
  DataTable,
  Modal,
  ConfirmDialog,
  Drawer,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  Spinner,
  Progress,
  EmptyState,
  ErrorState,
  Tooltip,
  Popover,
  PageHeader,
  PageContainer,
  PageSection
} from './index';

export const DesignSystemPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'tokens' | 'buttons' | 'forms' | 'cards' | 'badges' | 'tables' | 'modals' | 'states'
  >('tokens');

  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Interactive Component States
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [inputText, setInputText] = useState('CommerceOS Enterprise Suite');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkboxVal, setCheckboxVal] = useState(true);
  const [radioVal, setRadioVal] = useState('opt1');
  const [switchVal, setSwitchVal] = useState(true);
  const [progressVal, setProgressVal] = useState(68);

  // Modals & Drawers State
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sample Table Data
  const sampleTableData = [
    { id: 'ORD-9021', customer: 'عبدالله السبيعي', store: 'عسل السدر الملكي', amount: '840.00 SAR', status: 'healthy', date: '2026-08-30' },
    { id: 'ORD-9022', customer: 'نورة المنصور', store: 'دخون للعطور الفاخرة', amount: '1,250.00 SAR', status: 'pending', date: '2026-08-30' },
    { id: 'ORD-9023', customer: 'خالد العمري', store: 'بن النخبة المختص', amount: '320.00 SAR', status: 'healthy', date: '2026-08-29' },
    { id: 'ORD-9024', customer: 'سارة الدوسري', store: 'عسل السدر الملكي', amount: '560.00 SAR', status: 'degraded', date: '2026-08-29' },
    { id: 'ORD-9025', customer: 'فهد القحطاني', store: 'أزياء ريفان', amount: '2,100.00 SAR', status: 'failed', date: '2026-08-28' },
  ];
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>(['ORD-9021']);

  // Sample Chart Data
  const sampleChartData = [
    { hour: '00:00', sales: 12000 },
    { hour: '04:00', sales: 6500 },
    { hour: '08:00', sales: 34000 },
    { hour: '12:00', sales: 68000 },
    { hour: '16:00', sales: 94000 },
    { hour: '20:00', sales: 128420 },
  ];

  return (
    <div dir={dir} className="min-h-screen bg-[#07111F] text-[#F1F5F9] antialiased selection:bg-[#D4AF37] selection:text-[#07111F]">
      {/* Top Header Banner */}
      <header className="border-b border-white/10 bg-[#0B1626]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-xl text-[#D4AF37] shadow-[0_0_16px_rgba(212,175,55,0.2)]">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">
                  CommerceOS Design System
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#E0C77A] font-bold font-mono border border-[#D4AF37]/30">
                  PHASE D0 FOUNDATION
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                مكتبة المكونات ونظام التصميم الموحد — Sovereign Dark Enterprise Aesthetic
              </p>
            </div>
          </div>

          {/* Interactive Environment Toggles */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center bg-[#07111F] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setDir('rtl')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  dir === 'rtl' ? 'bg-[#D4AF37] text-[#07111F]' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                العربية (RTL)
              </button>
              <button
                onClick={() => setDir('ltr')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  dir === 'ltr' ? 'bg-[#D4AF37] text-[#07111F]' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                English (LTR)
              </button>
            </div>

            <div className="flex items-center bg-[#07111F] p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setDensity('comfortable')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  density === 'comfortable' ? 'bg-[#142238] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Comfortable
              </button>
              <button
                onClick={() => setDensity('compact')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                  density === 'compact' ? 'bg-[#142238] text-white' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                Compact
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-white/5 py-2">
          {[
            { id: 'tokens', label: 'Design Tokens', icon: <Palette className="w-4 h-4" /> },
            { id: 'buttons', label: 'Buttons & Icons', icon: <Play className="w-4 h-4" /> },
            { id: 'forms', label: 'Inputs & Forms', icon: <CheckSquare className="w-4 h-4" /> },
            { id: 'cards', label: 'Cards & Metrics', icon: <Layout className="w-4 h-4" /> },
            { id: 'badges', label: 'Badges & Status', icon: <Shield className="w-4 h-4" /> },
            { id: 'tables', label: 'Data Tables', icon: <TableIcon className="w-4 h-4" /> },
            { id: 'modals', label: 'Modals & Drawers', icon: <Sliders className="w-4 h-4" /> },
            { id: 'states', label: 'Feedback States', icon: <Bell className="w-4 h-4" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'bg-[#D4AF37]/15 text-[#E0C77A] border border-[#D4AF37]/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Playground Content Container */}
      <PageContainer maxWidth="default" className="space-y-10">
        {/* ========================================================================= */}
        {/* TAB 1: DESIGN TOKENS */}
        {/* ========================================================================= */}
        {activeTab === 'tokens' && (
          <div className="space-y-8">
            <PageHeader
              title="Design Tokens Inventory"
              description="القيم الأساسية والألوان والمقاييس الهندسية التي تشكل الهوية البصرية لمنصة CommerceOS."
            />

            {/* Colors Section */}
            <PageSection title="1. Color System (Deep Navy & Sovereign Gold)">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#07111F] border border-white/10">
                  <div className="h-16 rounded-lg bg-[#07111F] border border-white/10 flex items-center justify-center font-mono text-xs text-white">
                    #07111F
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2">Navy Base</h4>
                  <p className="text-[11px] text-[#94A3B8]">خلفية التطبيق الأساسية</p>
                </div>

                <div className="p-4 rounded-xl bg-[#101C2C] border border-white/10">
                  <div className="h-16 rounded-lg bg-[#0B1626] border border-white/10 flex items-center justify-center font-mono text-xs text-white">
                    #0B1626
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2">Navy Elevated</h4>
                  <p className="text-[11px] text-[#94A3B8]">القوائم الجانبية والعناصر المرتفعة</p>
                </div>

                <div className="p-4 rounded-xl bg-[#101C2C] border border-white/10">
                  <div className="h-16 rounded-lg bg-[#101C2C] border border-white/10 flex items-center justify-center font-mono text-xs text-white">
                    #101C2C
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2">Navy Surface</h4>
                  <p className="text-[11px] text-[#94A3B8]">البطاقات والأسطح التفاعلية</p>
                </div>

                <div className="p-4 rounded-xl bg-[#101C2C] border border-white/10">
                  <div className="h-16 rounded-lg bg-[#D4AF37] flex items-center justify-center font-mono text-xs text-[#07111F] font-bold">
                    #D4AF37
                  </div>
                  <h4 className="text-xs font-bold text-[#E0C77A] mt-2">Sovereign Gold (400)</h4>
                  <p className="text-[11px] text-[#94A3B8]">اللون المميز للأزرار والتأكيدات</p>
                </div>
              </div>

              {/* Semantic Colors */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="text-xs font-bold">Success (Emerald)</span>
                  <p className="text-[10px] text-emerald-500/80 mt-0.5">عمليات الدفع والطلبات المكتملة</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <span className="text-xs font-bold">Warning (Amber)</span>
                  <p className="text-[10px] text-amber-500/80 mt-0.5">التنبيهات ونفاد المخزون</p>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <span className="text-xs font-bold">Danger (Rose)</span>
                  <p className="text-[10px] text-rose-500/80 mt-0.5">الأخطاء وحذف المتاجر والإلغاء</p>
                </div>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <span className="text-xs font-bold">Info (Sky)</span>
                  <p className="text-[10px] text-sky-500/80 mt-0.5">المعلومات الإرشادية والمزامنة</p>
                </div>
              </div>
            </PageSection>

            {/* Typography Matrix */}
            <PageSection title="2. Typography Scale (Arabic & English)">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 space-y-6">
                <div className="pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Display / 40px (800)</span>
                  <h1 className="text-4xl font-extrabold text-white mt-1">
                    منصة التجارة السيادية CommerceOS
                  </h1>
                </div>

                <div className="pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Heading 1 / 32px (700)</span>
                  <h2 className="text-3xl font-bold text-white mt-1">
                    لوحة تحكم التاجر وإدارة الطلبات
                  </h2>
                </div>

                <div className="pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Heading 2 / 24px (700)</span>
                  <h3 className="text-2xl font-bold text-[#F1F5F9] mt-1">
                    المؤشرات المالية وتقارير المبيعات اليومية
                  </h3>
                </div>

                <div className="pb-4 border-b border-white/5">
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Body Large / 18px (400)</span>
                  <p className="text-lg text-[#CBD5E1] mt-1 leading-relaxed">
                    توفر المنصة عزلًا صارمًا لبيانات المتاجر مع تجربة مستخدم فائقة السرعة تتوافق مع أرقى المعايير العالمية.
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">Body / 16px (400)</span>
                  <p className="text-base text-[#94A3B8] mt-1 leading-relaxed">
                    Sovereign CommerceOS Design System ensures pixel-perfect consistency, accessibility, and high contrast for mission-critical enterprise workflows.
                  </p>
                </div>
              </div>
            </PageSection>

            {/* Geometry, Shadows, and Glass */}
            <PageSection title="3. Radii, Glass, and Shadow Foundations">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-lg bg-[#101C2C] border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 mx-auto flex items-center justify-center text-[#D4AF37] font-bold">
                    8px
                  </div>
                  <h4 className="text-xs font-bold text-white mt-3">Radius MD (8px)</h4>
                  <p className="text-[11px] text-[#94A3B8]">الأزرار وحقول الإدخال القياسية</p>
                </div>

                <div className="p-5 rounded-xl bg-[#101C2C] border border-white/10 text-center">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 mx-auto flex items-center justify-center text-[#D4AF37] font-bold">
                    16px
                  </div>
                  <h4 className="text-xs font-bold text-white mt-3">Radius XL (16px)</h4>
                  <p className="text-[11px] text-[#94A3B8]">البطاقات والحاويات الرئيسية</p>
                </div>

                <div className="p-5 rounded-2xl bg-[#101C2C]/60 backdrop-blur-md border border-white/10 text-center shadow-lg">
                  <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 mx-auto flex items-center justify-center text-[#D4AF37] font-bold">
                    Glass
                  </div>
                  <h4 className="text-xs font-bold text-white mt-3">Glass Medium</h4>
                  <p className="text-[11px] text-[#94A3B8]">النوافذ المنبثقة والقوائم العائمة</p>
                </div>
              </div>
            </PageSection>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BUTTONS & ACTIONS */}
        {/* ========================================================================= */}
        {activeTab === 'buttons' && (
          <div className="space-y-8">
            <PageHeader
              title="Button Component System"
              description="أزرار المنصة الموحدة مع كافة المتغيرات والأحجام وحالات التفاعل."
            />

            {/* Controls Bar */}
            <div className="p-4 rounded-xl bg-[#101C2C] border border-white/10 flex items-center gap-4 flex-wrap text-xs">
              <span className="font-bold text-[#CBD5E1]">اختبار الحالات:</span>
              <Checkbox
                label="جاري التحميل (isLoading)"
                checked={btnLoading}
                onChange={e => setBtnLoading(e.target.checked)}
              />
              <Checkbox
                label="معطل (disabled)"
                checked={btnDisabled}
                onChange={e => setBtnDisabled(e.target.checked)}
              />
            </div>

            {/* Variants Matrix */}
            <PageSection title="Button Variants">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" isLoading={btnLoading} disabled={btnDisabled} leftIcon={<Sparkles className="w-4 h-4" />}>
                    زر رئيسي (Primary Gold)
                  </Button>
                  <Button variant="secondary" isLoading={btnLoading} disabled={btnDisabled} leftIcon={<ShoppingBag className="w-4 h-4" />}>
                    زر ثانوي (Secondary)
                  </Button>
                  <Button variant="tertiary" isLoading={btnLoading} disabled={btnDisabled}>
                    زر فرعي (Tertiary)
                  </Button>
                  <Button variant="ghost" isLoading={btnLoading} disabled={btnDisabled}>
                    زر شفاف (Ghost)
                  </Button>
                  <Button variant="success" isLoading={btnLoading} disabled={btnDisabled} leftIcon={<Check className="w-4 h-4" />}>
                    زر تأكيد (Success)
                  </Button>
                  <Button variant="danger" isLoading={btnLoading} disabled={btnDisabled} leftIcon={<Trash2 className="w-4 h-4" />}>
                    زر خطر (Danger)
                  </Button>
                </div>
              </div>
            </PageSection>

            {/* Sizes Matrix */}
            <PageSection title="Button Sizes">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="xs">Extra Small (xs)</Button>
                  <Button variant="primary" size="sm">Small (sm)</Button>
                  <Button variant="primary" size="md">Medium (md - Default)</Button>
                  <Button variant="primary" size="lg">Large (lg)</Button>
                </div>
              </div>
            </PageSection>

            {/* Icon Buttons */}
            <PageSection title="Icon Buttons">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 flex items-center gap-3 flex-wrap">
                <IconButton variant="primary" size="md" ariaLabel="حفظ" icon={<Sparkles className="w-4 h-4" />} />
                <IconButton variant="secondary" size="md" ariaLabel="تعديل" icon={<Edit className="w-4 h-4" />} />
                <IconButton variant="ghost" size="md" ariaLabel="عرض" icon={<Eye className="w-4 h-4" />} />
                <IconButton variant="danger" size="md" ariaLabel="حذف" icon={<Trash2 className="w-4 h-4" />} />
              </div>
            </PageSection>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FORMS & INPUTS */}
        {/* ========================================================================= */}
        {activeTab === 'forms' && (
          <div className="space-y-8">
            <PageHeader
              title="Form Controls & Inputs"
              description="حقول الإدخال، الاختيار، التحقق من الأخطاء والملاحظات الإرشادية."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Text Inputs */}
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  حقول النصوص القياسية
                </h3>

                <Field label="اسم المتجر" required description="الاسم الظاهر في واجهة المتجر للمستهلكين">
                  <Input
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                  />
                </Field>

                <Field label="البحث السريع">
                  <SearchInput
                    placeholder="ابحث عن الطلبات أو العملاء..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onClear={() => setSearchQuery('')}
                  />
                </Field>

                <Field label="كلمة المرور الحساسة" required tooltip="يجب أن تحتوي على 8 خانات على الأقل">
                  <PasswordInput placeholder="أدخل كلمة المرور..." defaultValue="CommerceOS2026!" />
                </Field>

                <Field label="خطة الاشتراك">
                  <Select
                    options={[
                      { value: 'trial', label: 'الخطة التجريبية (Free Trial)' },
                      { value: 'growth', label: 'خطة النمو المتقدمة (Growth Pro)' },
                      { value: 'enterprise', label: 'المؤسسات الكبرى (Sovereign Enterprise)' },
                    ]}
                  />
                </Field>
              </div>

              {/* Validation States & Controls */}
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2">
                  حالات التحقق والاختيار
                </h3>

                <Field label="البريد الإلكتروني" error="صيغة البريد الإلكتروني غير صحيحة">
                  <Input defaultValue="invalid-email@" error leftIcon={<Mail className="w-4 h-4" />} />
                </Field>

                <Field label="النطاق المخصص" success="تم التحقق من سجلات DNS بنجاح">
                  <Input defaultValue="store.brand.sa" leftIcon={<Globe className="w-4 h-4" />} />
                </Field>

                <div className="pt-2 space-y-3">
                  <Checkbox
                    checked={checkboxVal}
                    onChange={e => setCheckboxVal(e.target.checked)}
                    label="تفعيل الإشعارات الفورية للطلبات الجديدة"
                    description="سيتم إرسال بريد وتنبيه فوري عند كل عملية شراء ناجحة"
                  />

                  <Switch
                    checked={switchVal}
                    onChange={setSwitchVal}
                    label="وضع الصيانة المؤقت للمتجر"
                    description="إغلاق الواجهة أمام الزوار مؤقتاً"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CARDS & METRICS */}
        {/* ========================================================================= */}
        {activeTab === 'cards' && (
          <div className="space-y-8">
            <PageHeader
              title="Cards & Data Visualizations"
              description="بطاقات المؤشرات، الرسوم البيانية، وهرمية الأسطح."
            />

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard
                label="إجمالي المبيعات اليومية"
                value="128,420 SAR"
                trend={{ value: '+14.2%', direction: 'up' }}
                comparison="مقارنة بيوم أمس"
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <MetricCard
                label="الطلبات الجديدة"
                value="432 طلب"
                trend={{ value: '+8.1%', direction: 'up' }}
                comparison="خلال آخر 24 ساعة"
                icon={<ShoppingBag className="w-4 h-4" />}
              />
              <MetricCard
                label="متوسط قيمة السلة"
                value="297.20 SAR"
                trend={{ value: '-2.4%', direction: 'down' }}
                comparison="متوسط الأسبوع"
                icon={<BarChart3 className="w-4 h-4" />}
              />
              <MetricCard
                label="المخزون المنخفض"
                value="3 منتجات"
                trend={{ value: 'تحذير', direction: 'neutral' }}
                comparison="يتطلب إعادة التوريد"
                icon={<AlertTriangle className="w-4 h-4" />}
              />
            </div>

            {/* Chart Container Card */}
            <ChartCard
              title="حركة المبيعات والتدفقات المالية"
              subtitle="البيانات الحية المجمعة لكافة فروع ومتاجر المستأجر"
              headerAction={
                <Button variant="secondary" size="xs" leftIcon={<SlidersHorizontal className="w-3.5 h-3.5" />}>
                  تصفية التاريخ
                </Button>
              }
            >
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sampleChartData}>
                    <XAxis dataKey="hour" stroke="#64748B" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0B1626', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#D4AF37', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="sales" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: BADGES & STATUS */}
        {/* ========================================================================= */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            <PageHeader
              title="Badge & Status System"
              description="الشارات ومؤشرات الصحة الرقمية للأداء والعمليات."
            />

            <PageSection title="Badge Variants">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 flex items-center gap-3 flex-wrap">
                <Badge variant="gold">خطة المؤسسات (Sovereign)</Badge>
                <Badge variant="success" dot>مكتمل (Captured)</Badge>
                <Badge variant="warning" dot>معلق (Pending)</Badge>
                <Badge variant="danger" dot>فشل الدفع (Failed)</Badge>
                <Badge variant="info">مسترجع جزئياً</Badge>
                <Badge variant="neutral">مسودة (Draft)</Badge>
              </div>
            </PageSection>

            <PageSection title="Platform Health Indicators">
              <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 grid grid-cols-2 md:grid-cols-5 gap-3">
                <StatusBadge status="healthy" label="قاعدة البيانات: سليمة" />
                <StatusBadge status="pending" label="المزامنة: جارية" />
                <StatusBadge status="degraded" label="بوابة الدفع: بطيئة" />
                <StatusBadge status="failed" label="الخطافات: خطأ" />
                <StatusBadge status="offline" label="الخادم الاحتياطي: متوقف" />
              </div>
            </PageSection>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: DATA TABLES */}
        {/* ========================================================================= */}
        {activeTab === 'tables' && (
          <div className="space-y-8">
            <PageHeader
              title="DataTable System"
              description="جداول البيانات المتطورة مع الفرز، التحديد المتعدد، والترقيم."
            />

            <DataTable
              data={sampleTableData}
              keyExtractor={row => row.id}
              selectable
              selectedIds={selectedTableIds}
              onSelectRow={(id, selected) => {
                setSelectedTableIds(prev =>
                  selected ? [...prev, id] : prev.filter(i => i !== id)
                );
              }}
              onSelectAll={selected => {
                setSelectedTableIds(selected ? sampleTableData.map(r => r.id) : []);
              }}
              density={density}
              columns={[
                { key: 'id', header: 'رقم الطلب', sortable: true, render: r => <span className="font-mono font-bold text-white">{r.id}</span> },
                { key: 'customer', header: 'العميل', sortable: true },
                { key: 'store', header: 'المتجر المستأجر' },
                { key: 'amount', header: 'المبلغ', sortable: true, render: r => <span className="font-mono font-bold text-[#E0C77A]">{r.amount}</span> },
                { key: 'status', header: 'حالة الطلب', render: r => <StatusBadge status={r.status as any} /> },
                { key: 'date', header: 'التاريخ', sortable: true, render: r => <span className="text-xs text-[#94A3B8] font-mono">{r.date}</span> },
              ]}
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MODALS & OVERLAYS */}
        {/* ========================================================================= */}
        {activeTab === 'modals' && (
          <div className="space-y-8">
            <PageHeader
              title="Modals, Dialogs & Drawers"
              description="نوافذ التأكيد المنبثقة، الأدراج الجانبية، والتلميحات."
            />

            <div className="p-6 rounded-xl bg-[#101C2C] border border-white/10 flex items-center gap-3 flex-wrap">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                فتح نافذة تجريبية (Modal)
              </Button>
              <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                تأكيد إجراء حساس (Confirm Dialog)
              </Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                فتح الدرج الجانبي (Drawer)
              </Button>
              <Tooltip content="هذا تلميح توضيحي لعنصر حساس" position="top">
                <Button variant="ghost" leftIcon={<Info className="w-4 h-4" />}>
                  مرر الفأرة هنا (Tooltip)
                </Button>
              </Tooltip>
            </div>

            {/* Test Modal Instance */}
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="إعدادات الأمان والتشفير"
              description="تخصيص مفاتيح واجهات برمجة التطبيقات ونطاقات الدخول"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModalOpen(false)}>إلغاء</Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>حفظ التغييرات</Button>
                </>
              }
            >
              <div className="space-y-4">
                <Field label="اسم المفتاح السحابي">
                  <Input defaultValue="Production-API-Key-2026" />
                </Field>
                <Field label="أقصى معدل للطلبات في الدقيقة">
                  <Input defaultValue="1000 req/min" />
                </Field>
              </div>
            </Modal>

            {/* Test Confirm Dialog Instance */}
            <ConfirmDialog
              isOpen={confirmOpen}
              onClose={() => setConfirmOpen(false)}
              onConfirm={() => {
                setConfirmOpen(false);
              }}
              title="هل أنت متأكد من حذف بيانات المستأجر؟"
              message="سيؤدي هذا الإجراء إلى حذف كافة المنتجات والطلبات بشكل نهائي ولا يمكن التراجع عنه."
              variant="danger"
            />

            {/* Test Drawer Instance */}
            <Drawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              title="تصفية الطلبات المتقدمة"
            >
              <div className="space-y-4">
                <Field label="النطاق الزمني">
                  <Select
                    options={[
                      { value: 'today', label: 'اليوم' },
                      { value: 'week', label: 'آخر 7 أيام' },
                      { value: 'month', label: 'آخر 30 يوماً' },
                    ]}
                  />
                </Field>
                <Field label="حالة الدفع">
                  <Select
                    options={[
                      { value: 'all', label: 'كافة الحالات' },
                      { value: 'paid', label: 'مدفوع بالكامل' },
                      { value: 'pending', label: 'قيد المراجعة' },
                    ]}
                  />
                </Field>
                <div className="pt-4">
                  <Button variant="primary" fullWidth onClick={() => setDrawerOpen(false)}>
                    تطبيق التصفية
                  </Button>
                </div>
              </div>
            </Drawer>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: FEEDBACK STATES */}
        {/* ========================================================================= */}
        {activeTab === 'states' && (
          <div className="space-y-8">
            <PageHeader
              title="Feedback & Loading States"
              description="عناصر التحميل، الهياكل العظمية، وحالات الخطأ والشاشات الفارغة."
            />

            {/* Skeletons & Spinners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl bg-[#101C2C] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white">الهيكل العظمي (Skeleton Text)</h4>
                <SkeletonText lines={4} />
              </div>

              <div className="p-5 rounded-xl bg-[#101C2C] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white">مؤشرات الدوران (Spinners)</h4>
                <div className="flex items-center gap-4 py-4">
                  <Spinner size="xs" />
                  <Spinner size="sm" />
                  <Spinner size="md" />
                  <Spinner size="lg" />
                </div>
              </div>

              <div className="p-5 rounded-xl bg-[#101C2C] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-white">شريط التقدم (Progress: {progressVal}%)</h4>
                <Progress value={progressVal} variant="gold" />
                <div className="flex items-center gap-2 pt-2">
                  <Button size="xs" variant="secondary" onClick={() => setProgressVal(p => Math.max(0, p - 10))}>-10%</Button>
                  <Button size="xs" variant="secondary" onClick={() => setProgressVal(p => Math.min(100, p + 10))}>+10%</Button>
                </div>
              </div>
            </div>

            {/* Error State */}
            <ErrorState
              title="تعذر الاتصال بخادم المعاملات المالية"
              description="تأكد من استقرار اتصالك بالإنترنت ثم أعد المحاولة مرة أخرى."
              onRetry={() => {}}
            />

            {/* Empty State */}
            <EmptyState
              icon={<ShoppingBag className="w-6 h-6" />}
              title="لا توجد طلبات جديدة حالياً"
              description="عندما يقوم العملاء بالشراء من متجرك الإلكتروني، ستظهر تفاصيل الطلبات هنا فوراً."
              primaryAction={{
                label: 'عرض واجهة المتجر',
                onClick: () => {},
                icon: <ExternalLink className="w-4 h-4" />,
              }}
            />
          </div>
        )}
      </PageContainer>
    </div>
  );
};
