import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  Loader2, 
  Check, 
  Scale, 
  MapPin, 
  Info, 
  Box, 
  X, 
  Sparkles,
  DollarSign,
  Clock,
  Copy,
  ChevronRight,
  ShieldCheck,
  Package,
  Layers,
  Building2,
  Store,
  RefreshCw
} from 'lucide-react';
import { ShippingMethod } from '../../types';

interface ShippingManagerProps {
  shippingMethods: ShippingMethod[];
  onChange: (methods: ShippingMethod[]) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  currency: string;
  isAr: boolean;
}

// Carrier presets with distinctive branding & presets
export const CARRIER_PRESETS: {
  id: string;
  carrierKey: string;
  nameAr: string;
  nameEn: string;
  carrierName: string;
  cost: number;
  estimatedDays: string;
  description: string;
  baseWeightKg: number;
  extraKgCost: number;
  maxWeightKg: number;
  freeShippingThreshold: number;
  coverageArea: 'all' | 'local' | 'custom' | 'gcc';
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}[] = [
  {
    id: 'preset-smsa',
    carrierKey: 'smsa',
    nameAr: 'سمسا إكسبريس (شحن سريع لكافة المدن)',
    nameEn: 'SMSA Express Door-to-Door',
    carrierName: 'سمسا إكسبريس SMSA',
    cost: 28,
    estimatedDays: '1-3 أيام عمل',
    description: 'شحن موثوق وسريع لكافة مدن ومحافظات المملكة مع التتبع المباشر لحظة بلحظة',
    baseWeightKg: 5,
    extraKgCost: 2,
    maxWeightKg: 35,
    freeShippingThreshold: 250,
    coverageArea: 'all',
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    borderColor: 'border-amber-500/40'
  },
  {
    id: 'preset-aramex',
    carrierKey: 'aramex',
    nameAr: 'أرامكس للشحن السريع حتى باب المنزل',
    nameEn: 'Aramex Home Express Delivery',
    carrierName: 'أرامكس Aramex',
    cost: 25,
    estimatedDays: '2-3 أيام عمل',
    description: 'توصيل موثوق لباب المنزل في كافة المدن مع خدمة الدفع عند الاستلام',
    baseWeightKg: 5,
    extraKgCost: 2.5,
    maxWeightKg: 30,
    freeShippingThreshold: 200,
    coverageArea: 'all',
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
    borderColor: 'border-rose-500/40'
  },
  {
    id: 'preset-spl',
    carrierKey: 'spl',
    nameAr: 'سبل البريد السعودي SPL (اقتصادي وموثوق)',
    nameEn: 'SPL Saudi Post Standard',
    carrierName: 'سبل SPL البريد السعودي',
    cost: 19,
    estimatedDays: '2-4 أيام عمل',
    description: 'توصيل شامل للعنوان الوطني أو الاستلام من فروع سبل المنتشرة بالمملكة',
    baseWeightKg: 10,
    extraKgCost: 1.5,
    maxWeightKg: 50,
    freeShippingThreshold: 180,
    coverageArea: 'all',
    badgeBg: 'bg-blue-500/15',
    badgeText: 'text-blue-400',
    borderColor: 'border-blue-500/40'
  },
  {
    id: 'preset-dhl',
    carrierKey: 'dhl',
    nameAr: 'دي إتش إل إكسبريس (شحن فائق السرعة ودولي)',
    nameEn: 'DHL Express Priority',
    carrierName: 'دي إتش إل DHL Express',
    cost: 45,
    estimatedDays: '1-2 أيام عمل',
    description: 'توصيل عالي الأولوية لجميع مناطق المملكة ودول الخليج العربي',
    baseWeightKg: 3,
    extraKgCost: 5,
    maxWeightKg: 40,
    freeShippingThreshold: 350,
    coverageArea: 'gcc',
    badgeBg: 'bg-yellow-500/15',
    badgeText: 'text-yellow-400',
    borderColor: 'border-yellow-500/40'
  },
  {
    id: 'preset-redbox',
    carrierKey: 'redbox',
    nameAr: 'ريد بوكس RedBox (استلام ذاتي من الخزائن الذكية)',
    nameEn: 'RedBox Smart Lockers Pickup',
    carrierName: 'ريد بوكس RedBox',
    cost: 13,
    estimatedDays: '1-2 أيام عمل',
    description: 'استلم شحنتك 24/7 من أقرب خزانة ذكية في حيك بكل سهولة وبدون انتظار المندوب',
    baseWeightKg: 5,
    extraKgCost: 2,
    maxWeightKg: 15,
    freeShippingThreshold: 150,
    coverageArea: 'all',
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-400',
    borderColor: 'border-purple-500/40'
  },
  {
    id: 'preset-local',
    carrierKey: 'fleet',
    nameAr: 'توصيل محلي فوري (مندوب المتجر)',
    nameEn: 'Local Instant Delivery (Store Fleet)',
    carrierName: 'مندوب المتجر الخاص',
    cost: 15,
    estimatedDays: 'نفس اليوم خلال ساعات',
    description: 'توصيل فوري ومباشر لعملاء مدينتك في نفس اليوم بواسطة أسطول المتجر',
    baseWeightKg: 10,
    extraKgCost: 0,
    maxWeightKg: 25,
    freeShippingThreshold: 150,
    coverageArea: 'local',
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    borderColor: 'border-emerald-500/40'
  },
  {
    id: 'preset-pickup',
    carrierKey: 'pickup',
    nameAr: 'استلام مجاني مباشر من الفرع / المستودع',
    nameEn: 'In-Store / Warehouse Free Pickup',
    carrierName: 'الفرع الرئيسي للمتجر',
    cost: 0,
    estimatedDays: 'جاهز للاستلام خلال ساعتين',
    description: 'يمكن للعميل استلام الطلب مجاناً من معرض المتجر بعد تجهيزه',
    baseWeightKg: 100,
    extraKgCost: 0,
    maxWeightKg: 100,
    freeShippingThreshold: 0,
    coverageArea: 'local',
    badgeBg: 'bg-cyan-500/15',
    badgeText: 'text-cyan-400',
    borderColor: 'border-cyan-500/40'
  }
];

export const ShippingManager: React.FC<ShippingManagerProps> = ({
  shippingMethods,
  onChange,
  onSave,
  isSaving,
  currency,
  isAr
}) => {
  // Editing state
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [showPresetDropdown, setShowPresetDropdown] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Weight test simulator state
  const [simulatedWeight, setSimulatedWeight] = useState<number>(7);

  // Helper to get carrier badge styling
  const getCarrierBadge = (carrierKey?: string) => {
    switch (carrierKey) {
      case 'smsa':
        return { label: 'سمسا إكسبريس', color: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'aramex':
        return { label: 'أرامكس', color: 'bg-rose-500/15 text-rose-400 border-rose-500/30' };
      case 'spl':
        return { label: 'سبل SPL', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' };
      case 'dhl':
        return { label: 'DHL إكسبريس', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' };
      case 'redbox':
        return { label: 'ريد بوكس RedBox', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' };
      case 'fleet':
        return { label: 'مندوب المتجر', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'pickup':
        return { label: 'استلام من الفرع', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      default:
        return { label: isAr ? 'ناقل مخصص' : 'Custom Carrier', color: 'bg-slate-500/15 text-slate-300 border-slate-500/30' };
    }
  };

  // Quick In-place updates
  const handleToggleActive = (id: string) => {
    const updated = shippingMethods.map(m => m.id === id ? { ...m, active: !m.active } : m);
    onChange(updated);
  };

  const handleCostChange = (id: string, cost: number) => {
    const updated = shippingMethods.map(m => m.id === id ? { ...m, cost: Math.max(0, cost) } : m);
    onChange(updated);
  };

  const handleEstimatedDaysChange = (id: string, estimatedDays: string) => {
    const updated = shippingMethods.map(m => m.id === id ? { ...m, estimatedDays } : m);
    onChange(updated);
  };

  const handleDeleteMethod = (id: string) => {
    const updated = shippingMethods.filter(m => m.id !== id);
    onChange(updated);
    setDeleteConfirmId(null);
  };

  const handleDuplicateMethod = (method: ShippingMethod) => {
    const newMethod: ShippingMethod = {
      ...method,
      id: `ship-${Date.now()}`,
      name: `${method.name} (${isAr ? 'نسخة' : 'Copy'})`,
      nameEn: `${method.nameEn || method.name} (Copy)`,
      active: false
    };
    onChange([...shippingMethods, newMethod]);
  };

  // Add from Preset
  const handleAddPreset = (preset: typeof CARRIER_PRESETS[0]) => {
    const newMethod: ShippingMethod = {
      id: `ship-${preset.carrierKey}-${Date.now()}`,
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
      active: true
    };
    onChange([...shippingMethods, newMethod]);
    setShowPresetDropdown(false);
  };

  // Open Edit Modal for a method
  const handleOpenEditModal = (method: ShippingMethod) => {
    setEditingMethod({
      ...method,
      baseWeightKg: method.baseWeightKg ?? 5,
      extraKgCost: method.extraKgCost ?? 2,
      maxWeightKg: method.maxWeightKg ?? 30,
      freeShippingThreshold: method.freeShippingThreshold ?? 0,
      coverageArea: method.coverageArea ?? 'all',
      carrierName: method.carrierName || method.name
    });
    setIsCreatingNew(false);
  };

  // Open Create Modal from scratch
  const handleOpenCreateModal = () => {
    const newMethod: ShippingMethod = {
      id: `ship-custom-${Date.now()}`,
      name: isAr ? 'شركة شحن مخصصة' : 'Custom Shipping Option',
      nameEn: 'Custom Shipping Carrier',
      carrier: 'custom',
      carrierName: isAr ? 'الناقل المخصص' : 'Custom Carrier',
      cost: 25,
      estimatedDays: isAr ? '2-3 أيام عمل' : '2-3 business days',
      description: isAr ? 'توصيل قياسي حتى باب المنزل' : 'Standard door-to-door delivery',
      baseWeightKg: 5,
      extraKgCost: 2,
      maxWeightKg: 30,
      freeShippingThreshold: 200,
      coverageArea: 'all',
      active: true
    };
    setEditingMethod(newMethod);
    setIsCreatingNew(true);
    setShowPresetDropdown(false);
  };

  // Save Modal changes
  const handleSaveModal = () => {
    if (!editingMethod) return;

    if (isCreatingNew) {
      onChange([...shippingMethods, editingMethod]);
    } else {
      onChange(shippingMethods.map(m => m.id === editingMethod.id ? editingMethod : m));
    }
    setEditingMethod(null);
    setIsCreatingNew(false);
  };

  // Weight cost calculator helper
  const calculateWeightCost = (method: ShippingMethod, weightKg: number) => {
    const baseWeight = method.baseWeightKg ?? 5;
    const extraKgRate = method.extraKgCost ?? 0;
    if (weightKg <= baseWeight) {
      return method.cost;
    }
    const extraKg = Math.ceil(weightKg - baseWeight);
    return method.cost + (extraKg * extraKgRate);
  };

  const activeCount = shippingMethods.filter(m => m.active).length;

  return (
    <div className="space-y-6">
      {/* Top Header with Status & Save */}
      <div className="bg-[#0B1422] border border-[#233247] rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-[#233247]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <span>{isAr ? 'إدارة خيارات وشركات الشحن' : 'Shipping & Carrier Management'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#C9A45C]/20 text-[#C9A45C] border border-[#C9A45C]/30 font-semibold">
                    {activeCount} {isAr ? 'مفعّلة' : 'Active'}
                  </span>
                </h2>
                <p className="text-xs text-[#97A4B5] mt-1">
                  {isAr 
                    ? 'ضبط أسماء شركات الشحن، أوزان الطرود، تكلفة الكيلو الزائد، وشروط الشحن المجاني للعملاء.' 
                    : 'Manage carriers, package weight policies, extra weight costs, and free delivery thresholds.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Add Carrier Dropdown */}
            <div className="relative">
              <button
                type="button"
                id="btn-add-shipping-carrier"
                onClick={() => setShowPresetDropdown(!showPresetDropdown)}
                className="px-4 py-2.5 rounded-xl bg-[#050B14] hover:bg-[#101B2C] border border-[#233247] hover:border-[#C9A45C]/50 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4 text-[#C9A45C]" />
                <span>{isAr ? 'إضافة شركة أو طريقة شحن' : 'Add Carrier / Method'}</span>
              </button>

              {showPresetDropdown && (
                <div className="absolute end-0 mt-2 w-80 sm:w-96 bg-[#0B1422] border border-[#233247] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[11px] font-bold text-[#97A4B5] px-2 py-1 mb-1">
                    {isAr ? 'قوالب سريعة لشركات الشحن المعتمدة:' : 'Select pre-configured carrier preset:'}
                  </div>
                  <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                    {CARRIER_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleAddPreset(preset)}
                        className="w-full text-start p-2.5 rounded-xl hover:bg-[#050B14] border border-transparent hover:border-[#233247] flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${preset.badgeBg} ${preset.badgeText}`}>
                            <Truck className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-[#C9A45C] transition-colors">
                              {isAr ? preset.nameAr : preset.nameEn}
                            </div>
                            <div className="text-[10px] text-[#97A4B5]">
                              {preset.cost === 0 ? (isAr ? 'مجاني' : 'Free') : `${preset.cost} ${currency}`} • {preset.estimatedDays}
                            </div>
                          </div>
                        </div>
                        <Plus className="w-3.5 h-3.5 text-[#97A4B5] group-hover:text-[#C9A45C] transition-transform group-hover:scale-125" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-2 border-t border-[#233247]">
                    <button
                      type="button"
                      onClick={handleOpenCreateModal}
                      className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#C9A45C]/15 text-[#C9A45C] text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إنشاء طريقة شحن مخصصة بالكامل' : 'Create Custom Carrier From Scratch'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              type="button"
              id="btn-save-shipping-settings"
              onClick={onSave}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-[#C9A45C] hover:bg-[#B38F27] text-[#050B14] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isAr ? 'حفظ وتفعيل التعديلات' : 'Save & Activate Changes'}</span>
            </button>
          </div>
        </div>

        {/* Live Weight & Package Fee Simulator Widget */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#050B14] border border-[#233247] relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{isAr ? 'مُحاكي احتساب رسوم وزن الشحنات' : 'Live Package Weight Rate Simulator'}</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-medium">
                    {isAr ? 'سياسة الوزن الزائد' : 'Extra Weight Policy'}
                  </span>
                </div>
                <div className="text-[11px] text-[#97A4B5] mt-0.5">
                  {isAr 
                    ? 'يتم احتساب السعر الأساسي حتى وزن محدد، وكل 1 كجم إضافي يُضاف لسعر الشحنة تلقائياً.' 
                    : 'Base rate covers packages up to base weight. Any extra kg adds to the total shipping fee.'}
                </div>
              </div>
            </div>

            {/* Slider Control */}
            <div className="flex items-center gap-4 bg-[#0B1422] p-2.5 px-4 rounded-xl border border-[#233247]">
              <span className="text-xs text-[#97A4B5] whitespace-nowrap">{isAr ? 'وزن الطرد التجريبي:' : 'Test Weight:'}</span>
              <input
                type="range"
                min="1"
                max="30"
                value={simulatedWeight}
                onChange={(e) => setSimulatedWeight(Number(e.target.value))}
                className="w-28 sm:w-36 accent-[#C9A45C] cursor-pointer"
              />
              <span className="text-xs font-black text-[#C9A45C] min-w-[50px] text-center">
                {simulatedWeight} {isAr ? 'كجم' : 'kg'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Carrier List Cards */}
      <div className="space-y-4">
        {shippingMethods.map((method) => {
          const badge = getCarrierBadge(method.carrier);
          const baseWeight = method.baseWeightKg ?? 5;
          const extraKg = method.extraKgCost ?? 2;
          const maxWeight = method.maxWeightKg ?? 30;
          const simulatedCost = calculateWeightCost(method, simulatedWeight);
          const hasExtraWeightCharged = simulatedWeight > baseWeight && extraKg > 0;

          return (
            <div
              key={method.id}
              id={`shipping-card-${method.id}`}
              className={`p-5 rounded-3xl border transition-all ${
                method.active
                  ? 'bg-[#0B1422] border-[#233247] hover:border-[#C9A45C]/50 shadow-lg'
                  : 'bg-[#080F1A] border-[#233247]/50 opacity-70'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Carrier Information & Badges */}
                <div className="flex items-start gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-md ${
                    method.active ? 'bg-[#C9A45C]/15 text-[#C9A45C] border border-[#C9A45C]/30' : 'bg-white/5 text-slate-500 border border-white/5'
                  }`}>
                    <Truck className="w-6 h-6" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.color}`}>
                        {method.carrierName || badge.label}
                      </span>

                      {method.coverageArea && (
                        <span className="text-[10px] text-[#97A4B5] bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#C9A45C]" />
                          <span>
                            {method.coverageArea === 'all' && (isAr ? 'كافة مدن المملكة' : 'All Saudi Cities')}
                            {method.coverageArea === 'local' && (isAr ? 'توصيل محلي بالمدينة' : 'Local City')}
                            {method.coverageArea === 'gcc' && (isAr ? 'المملكة ودول الخليج' : 'Saudi & GCC')}
                            {method.coverageArea === 'custom' && (isAr ? 'مدن مخصصة' : 'Custom Cities')}
                          </span>
                        </span>
                      )}

                      {method.freeShippingThreshold && method.freeShippingThreshold > 0 && (
                        <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                          {isAr ? `شحن مجاني فوق ${method.freeShippingThreshold} ${currency}` : `Free over ${method.freeShippingThreshold} ${currency}`}
                        </span>
                      )}
                    </div>

                    {/* Method Names */}
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {isAr ? method.name : (method.nameEn || method.name)}
                      </h3>
                      {method.nameEn && isAr && (
                        <div className="text-[11px] text-[#97A4B5] font-mono">{method.nameEn}</div>
                      )}
                    </div>

                    {/* Description */}
                    {method.description && (
                      <p className="text-xs text-[#97A4B5] leading-relaxed max-w-xl">
                        {method.description}
                      </p>
                    )}

                    {/* Weight Policy Pill */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] text-[#97A4B5] flex-wrap">
                      <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
                        <Scale className="w-3 h-3 text-amber-400" />
                        <span>{isAr ? `الوزن الأساسي: حتى ${baseWeight} كجم` : `Base weight: up to ${baseWeight} kg`}</span>
                      </span>
                      <span>•</span>
                      <span>
                        {extraKg === 0 
                          ? (isAr ? 'لا توجد رسوم وزن إضافي' : 'No extra weight fee') 
                          : (isAr ? `الكيلو الزائد: +${extraKg} ${currency}` : `Extra kg: +${extraKg} ${currency}`)}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400">
                        {isAr ? `أقصى وزن: ${maxWeight} كجم` : `Max: ${maxWeight} kg`}
                      </span>

                      {/* Simulator preview indicator */}
                      <span className={`ms-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                        hasExtraWeightCharged 
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                          : 'bg-emerald-500/15 text-emerald-400'
                      }`}>
                        {isAr ? `لسعر طرد ${simulatedWeight} كجم: ${simulatedCost} ${currency}` : `For ${simulatedWeight} kg: ${simulatedCost} ${currency}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Controls & Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#233247]">
                  {/* Quick Price Input */}
                  <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-1.5 text-xs">
                    <span className="text-[#97A4B5] ms-1 text-[11px]">{isAr ? 'الأساسي:' : 'Base:'}</span>
                    <input
                      type="number"
                      min="0"
                      value={method.cost}
                      onChange={(e) => handleCostChange(method.id, Number(e.target.value))}
                      className="w-16 bg-transparent text-white font-bold text-center outline-none"
                    />
                    <span className="text-[#C9A45C] text-[10px] font-bold">{currency}</span>
                  </div>

                  {/* Quick Days Input */}
                  <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#97A4B5] me-1" />
                    <input
                      type="text"
                      value={method.estimatedDays}
                      onChange={(e) => handleEstimatedDaysChange(method.id, e.target.value)}
                      placeholder={isAr ? 'مدة التوصيل' : 'Delivery time'}
                      className="w-24 sm:w-28 bg-transparent text-white text-xs outline-none"
                    />
                  </div>

                  {/* Active Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(method.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      method.active
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${method.active ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                    <span>{method.active ? (isAr ? 'مفعّل' : 'Active') : (isAr ? 'معطّل' : 'Disabled')}</span>
                  </button>

                  {/* Edit Modal Button */}
                  <button
                    type="button"
                    title={isAr ? 'تعديل كافة تفاصيل وخيارات هذا الناقل' : 'Edit full carrier details'}
                    onClick={() => handleOpenEditModal(method)}
                    className="p-2 rounded-xl bg-[#050B14] hover:bg-[#101B2C] border border-[#233247] hover:border-[#C9A45C]/50 text-[#C9A45C] transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Duplicate Button */}
                  <button
                    type="button"
                    title={isAr ? 'تكرار طريقة الشحن' : 'Duplicate shipping method'}
                    onClick={() => handleDuplicateMethod(method)}
                    className="p-2 rounded-xl bg-[#050B14] hover:bg-[#101B2C] border border-[#233247] text-slate-400 hover:text-white transition-all"
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    title={isAr ? 'حذف طريقة الشحن' : 'Delete method'}
                    onClick={() => setDeleteConfirmId(method.id)}
                    className="p-2 rounded-xl bg-[#050B14] hover:bg-rose-950/40 border border-[#233247] hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inline Delete Confirmation */}
              {deleteConfirmId === method.id && (
                <div className="mt-4 pt-4 border-t border-rose-500/20 flex items-center justify-between gap-3 bg-rose-500/5 p-3 rounded-2xl">
                  <span className="text-xs text-rose-300 font-semibold">
                    {isAr ? 'هل أنت متأكد من رغبتك في حذف خيار الشحن هذا؟' : 'Are you sure you want to delete this carrier option?'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteMethod(method.id)}
                      className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                    >
                      {isAr ? 'نعم، احذف' : 'Yes, Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FULL EDIT / CREATE MODAL */}
      {editingMethod && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1422] border border-[#233247] rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#233247] flex items-center justify-between bg-gradient-to-r from-[#0B1422] to-[#050B14]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C9A45C]/15 border border-[#C9A45C]/30 flex items-center justify-center text-[#C9A45C]">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isCreatingNew 
                      ? (isAr ? 'إضافة طريقة وشركة شحن جديدة' : 'Add New Shipping Carrier') 
                      : (isAr ? 'تعديل تفاصيل طريقة وشركة الشحن' : 'Edit Shipping Carrier Details')}
                  </h3>
                  <p className="text-[11px] text-[#97A4B5] mt-0.5">
                    {isAr ? 'تعديل الأسماء، أسماء الشحن، أوزان الطرود، والتكلفة الإضافية.' : 'Customize names, carrier identity, package weights, and rates.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingMethod(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* 1. الأسماء وأسماء الشحن */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#C9A45C] uppercase tracking-wider pb-1 border-b border-[#233247]">
                  <Truck className="w-4 h-4" />
                  <span>{isAr ? 'الأسماء وهوية شركة الشحن' : 'Carrier Names & Identity'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Carrier Select */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'شركة الشحن / الناقل' : 'Shipping Carrier'}
                    </label>
                    <select
                      value={editingMethod.carrier || 'custom'}
                      onChange={(e) => {
                        const val = e.target.value;
                        const matchingPreset = CARRIER_PRESETS.find(p => p.carrierKey === val);
                        setEditingMethod({
                          ...editingMethod,
                          carrier: val,
                          carrierName: matchingPreset ? matchingPreset.carrierName : editingMethod.carrierName
                        });
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C]"
                    >
                      <option value="smsa">سمسا إكسبريس (SMSA)</option>
                      <option value="aramex">أرامكس (Aramex)</option>
                      <option value="spl">سبل البريد السعودي (SPL)</option>
                      <option value="dhl">دي إتش إل إكسبريس (DHL)</option>
                      <option value="redbox">ريد بوكس RedBox (خزائن ذكية)</option>
                      <option value="fleet">مندوب المتجر الخاص (Store Fleet)</option>
                      <option value="pickup">استلام من الفرع / المعرض</option>
                      <option value="custom">{isAr ? 'شركة شحن أخرى مخصصة' : 'Other Custom Carrier'}</option>
                    </select>
                  </div>

                  {/* Written Carrier Name */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'اسم شركة الشحن الظاهر (اسماء الشحن)' : 'Carrier Display Brand Name'}
                    </label>
                    <input
                      type="text"
                      value={editingMethod.carrierName || ''}
                      onChange={(e) => setEditingMethod({ ...editingMethod, carrierName: e.target.value })}
                      placeholder={isAr ? 'مثال: أرامكس للشحن السريع' : 'e.g. Aramex Express'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  {/* Method Name Arabic */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'اسم طريقة الشحن (باللغة العربية)' : 'Shipping Method Name (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={editingMethod.name}
                      onChange={(e) => setEditingMethod({ ...editingMethod, name: e.target.value })}
                      placeholder={isAr ? 'مثال: توصيل سريع لباب المنزل' : 'e.g. Express Home Delivery'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C]"
                    />
                  </div>

                  {/* Method Name English */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'اسم طريقة الشحن (بالإنجليزية)' : 'Shipping Method Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={editingMethod.nameEn || ''}
                      onChange={(e) => setEditingMethod({ ...editingMethod, nameEn: e.target.value })}
                      placeholder="e.g. Fast Doorstep Delivery"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Customer Facing Description */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    {isAr ? 'وصف طريقة الشحن للعميل عند الدفع' : 'Customer Facing Description at Checkout'}
                  </label>
                  <textarea
                    rows={2}
                    value={editingMethod.description || ''}
                    onChange={(e) => setEditingMethod({ ...editingMethod, description: e.target.value })}
                    placeholder={isAr ? 'توصيل حتى باب منزلك مع إشعار تتبع برقم الشحنة فور إرسالها.' : 'Safe delivery with tracking code sent via SMS.'}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C] resize-none"
                  />
                </div>
              </div>

              {/* 2. إعدادات الوزن والوزن الزائد ("وو ز") */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider pb-1 border-b border-[#233247]">
                  <Scale className="w-4 h-4" />
                  <span>{isAr ? 'إعدادات الوزن وحساب الكيلو الإضافي (الوزن)' : 'Package Weight & Extra Kg Policies'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Base weight */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'الوزن الأساسي المشمول (كجم)' : 'Base Weight (kg)'}
                    </label>
                    <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editingMethod.baseWeightKg ?? 5}
                        onChange={(e) => setEditingMethod({ ...editingMethod, baseWeightKg: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-xs outline-none"
                      />
                      <span className="text-[#97A4B5] text-xs ms-1">{isAr ? 'كجم' : 'kg'}</span>
                    </div>
                    <p className="text-[10px] text-[#97A4B5] mt-1">
                      {isAr ? 'الوزن المشمول في السعر الأساسي' : 'Included in base price'}
                    </p>
                  </div>

                  {/* Extra kg cost */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'تكلفة الكيلو الإضافي' : 'Cost per Extra kg'}
                    </label>
                    <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={editingMethod.extraKgCost ?? 2}
                        onChange={(e) => setEditingMethod({ ...editingMethod, extraKgCost: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-xs outline-none"
                      />
                      <span className="text-[#C9A45C] text-xs font-bold ms-1">{currency}</span>
                    </div>
                    <p className="text-[10px] text-[#97A4B5] mt-1">
                      {isAr ? 'لكل 1 كجم زائد فوق الأساسي' : 'Per extra 1 kg'}
                    </p>
                  </div>

                  {/* Max weight */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'أقصى وزن مسموح به' : 'Max Weight Limit'}
                    </label>
                    <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="1"
                        max="200"
                        value={editingMethod.maxWeightKg ?? 35}
                        onChange={(e) => setEditingMethod({ ...editingMethod, maxWeightKg: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-xs outline-none"
                      />
                      <span className="text-[#97A4B5] text-xs ms-1">{isAr ? 'كجم' : 'kg'}</span>
                    </div>
                    <p className="text-[10px] text-[#97A4B5] mt-1">
                      {isAr ? 'الحد الأقصى للشحنة الواحدة' : 'Maximum parcel weight'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. الأسعار والشحن المجاني والمدة */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider pb-1 border-b border-[#233247]">
                  <DollarSign className="w-4 h-4" />
                  <span>{isAr ? 'التكلفة، الشحن المجاني، والمدة' : 'Cost, Free Threshold & Delivery Time'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Base Cost */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'سعر الشحن الأساسي' : 'Base Shipping Cost'}
                    </label>
                    <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={editingMethod.cost}
                        onChange={(e) => setEditingMethod({ ...editingMethod, cost: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-xs outline-none"
                      />
                      <span className="text-[#C9A45C] text-xs font-bold ms-1">{currency}</span>
                    </div>
                  </div>

                  {/* Free Shipping Threshold */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'حد الشحن المجاني (اختياري)' : 'Free Shipping Threshold'}
                    </label>
                    <div className="flex items-center bg-[#050B14] border border-[#233247] rounded-xl px-3 py-2">
                      <input
                        type="number"
                        min="0"
                        value={editingMethod.freeShippingThreshold ?? 0}
                        onChange={(e) => setEditingMethod({ ...editingMethod, freeShippingThreshold: Number(e.target.value) })}
                        placeholder="0 = غير مفعّل"
                        className="w-full bg-transparent text-white font-bold text-xs outline-none"
                      />
                      <span className="text-[#C9A45C] text-xs font-bold ms-1">{currency}</span>
                    </div>
                    <p className="text-[10px] text-[#97A4B5] mt-1">
                      {isAr ? 'مجاني للطلبات فوق هذا المبلغ (0 للإلغاء)' : 'Free if order exceeds this (0 to disable)'}
                    </p>
                  </div>

                  {/* Estimated Days */}
                  <div>
                    <label className="block text-xs font-bold text-white mb-1.5">
                      {isAr ? 'مدة التوصيل المتوقعة' : 'Estimated Delivery Time'}
                    </label>
                    <input
                      type="text"
                      value={editingMethod.estimatedDays}
                      onChange={(e) => setEditingMethod({ ...editingMethod, estimatedDays: e.target.value })}
                      placeholder={isAr ? 'مثال: 2-3 أيام عمل' : 'e.g. 2-3 business days'}
                      className="w-full px-3 py-2 rounded-xl bg-[#050B14] border border-[#233247] text-white text-xs outline-none focus:border-[#C9A45C]"
                    />
                  </div>
                </div>

                {/* Coverage Area Selection */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    {isAr ? 'نطاق وتغطية الشحن' : 'Coverage Scope'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'all', label: isAr ? 'كافة مدن المملكة' : 'All Saudi Arabia' },
                      { key: 'local', label: isAr ? 'محلي داخل المدينة' : 'Local City Only' },
                      { key: 'gcc', label: isAr ? 'السعودية والخليج' : 'Saudi & GCC' },
                      { key: 'custom', label: isAr ? 'مدن مخصصة' : 'Specific Cities' }
                    ].map(cov => (
                      <button
                        key={cov.key}
                        type="button"
                        onClick={() => setEditingMethod({ ...editingMethod, coverageArea: cov.key as any })}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                          editingMethod.coverageArea === cov.key
                            ? 'bg-[#C9A45C]/20 text-[#C9A45C] border-[#C9A45C]'
                            : 'bg-[#050B14] text-[#97A4B5] border-[#233247] hover:border-slate-600'
                        }`}
                      >
                        {cov.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Switch */}
                <div className="pt-2 flex items-center justify-between p-3 rounded-xl bg-[#050B14] border border-[#233247]">
                  <div>
                    <div className="text-xs font-bold text-white">{isAr ? 'تفعيل طريقة الشحن هذه للمتجر' : 'Activate this method in storefront'}</div>
                    <div className="text-[10px] text-[#97A4B5]">{isAr ? 'ستظهر للعملاء في سلة الشراء وصفحة الدفع.' : 'Will be selectable by customers during checkout.'}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingMethod({ ...editingMethod, active: !editingMethod.active })}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      editingMethod.active ? 'bg-emerald-500 text-[#050B14]' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {editingMethod.active ? (isAr ? 'مفعّلة' : 'Active') : (isAr ? 'معطّلة' : 'Disabled')}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-[#233247] bg-[#050B14] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingMethod(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                id="btn-modal-save-carrier"
                onClick={handleSaveModal}
                className="px-6 py-2 rounded-xl bg-[#C9A45C] hover:bg-[#B38F27] text-[#050B14] text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{isAr ? 'تطبيق التعديلات' : 'Apply Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
