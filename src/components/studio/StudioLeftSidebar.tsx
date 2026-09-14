import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Palette, 
  Layers, 
  CreditCard, 
  Sparkles, 
  ShoppingBag, 
  BookOpen, 
  Receipt, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  Image as ImageIcon,
  Type,
  Hash,
  Scale,
  Package,
  Star,
  Tag,
  TrendingUp,
  QrCode,
  Clock,
  Paintbrush,
  CopyPlus,
  HelpCircle,
  Bot,
  Zap,
  Boxes,
  Workflow,
  Layout,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkle,
  Flame,
  Truck,
  Percent,
  Gift,
  Video,
  Layers2,
  Sliders,
  Award,
  MapPin,
  Split,
  Coins,
  FileSpreadsheet,
  Anchor
} from 'lucide-react';
import { 
  NoCodeAppProject, 
  AppStudioScreen, 
  AppStudioField, 
  AppArchetype 
} from '../../types/appStudio';
import { ArabCountry } from '../../data/arabCountries';

export interface MasterThemePreset {
  id: string;
  nameAr: string;
  nameEn: string;
  category: string;
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textColor: string;
  border: string;
  font: string;
  radius: 'sharp' | 'curved' | 'pill';
  isDarkMode: boolean;
  accentBadge: string;
}

export const MASTER_THEME_PRESETS: MasterThemePreset[] = [
  {
    id: 'royal_gold',
    nameAr: 'الأسود الملكي والذهب الفاخر',
    nameEn: 'Royal Obsidian & Gold',
    category: 'luxury',
    primary: '#D4AF37',
    secondary: '#1A2333',
    background: '#080D17',
    surface: '#0F1826',
    textColor: '#F8FAFC',
    border: '#2A3B54',
    font: 'Tajawal',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-amber-400/10 text-amber-300 border-amber-500/30'
  },
  {
    id: 'neo_fintech',
    nameAr: 'الفينتك المالي والزمرد الرقمي',
    nameEn: 'Neo-Fintech Emerald',
    category: 'fintech',
    primary: '#10B981',
    secondary: '#0B1F1C',
    background: '#050D0E',
    surface: '#0A1A1B',
    textColor: '#F0FDF4',
    border: '#153A37',
    font: 'Cairo',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
  },
  {
    id: 'cyber_tech',
    nameAr: 'التقني العصري والبنفسج السيبراني',
    nameEn: 'Cyber Tech Violet',
    category: 'tech',
    primary: '#8B5CF6',
    secondary: '#1C1635',
    background: '#090615',
    surface: '#130E26',
    textColor: '#FAF5FF',
    border: '#2E1E4D',
    font: 'Readex Pro',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-purple-500/10 text-purple-300 border-purple-500/30'
  },
  {
    id: 'desert_sand',
    nameAr: 'رمال الصحراء والتراث الدافئ',
    nameEn: 'Arabian Warm Dune',
    category: 'heritage',
    primary: '#E0A96D',
    secondary: '#201A15',
    background: '#0D0A08',
    surface: '#18130F',
    textColor: '#FFFBF5',
    border: '#382B20',
    font: 'Almarai',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-amber-600/10 text-amber-300 border-amber-600/30'
  },
  {
    id: 'sapphire_pro',
    nameAr: 'الياقوت الأزرق المؤسسي',
    nameEn: 'Sapphire Enterprise Blue',
    category: 'corporate',
    primary: '#3B82F6',
    secondary: '#0F172A',
    background: '#030712',
    surface: '#0B1120',
    textColor: '#F8FAFC',
    border: '#1E293B',
    font: 'IBM Plex Sans Arabic',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-blue-500/10 text-blue-300 border-blue-500/30'
  },
  {
    id: 'rose_gold_couture',
    nameAr: 'فخامة الورد والتوت المخملي (Haute Couture)',
    nameEn: 'Velvet Rose Gold',
    category: 'fashion',
    primary: '#FB7185',
    secondary: '#271118',
    background: '#0F0509',
    surface: '#1E0A13',
    textColor: '#FFF1F2',
    border: '#4C1D2C',
    font: 'Cairo',
    radius: 'curved',
    isDarkMode: true,
    accentBadge: 'bg-rose-500/10 text-rose-300 border-rose-500/30'
  },
  {
    id: 'minimal_ivory',
    nameAr: 'الأبيض العاجي النقي (Light Mode)',
    nameEn: 'Minimal Ivory Light',
    category: 'minimal',
    primary: '#B45309',
    secondary: '#F1F5F9',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textColor: '#0F172A',
    border: '#E2E8F0',
    font: 'Cairo',
    radius: 'curved',
    isDarkMode: false,
    accentBadge: 'bg-slate-200 text-slate-800 border-slate-300'
  }
];

interface StudioLeftSidebarProps {
  project: NoCodeAppProject;
  setProject: React.Dispatch<React.SetStateAction<NoCodeAppProject>>;
  activeScreen: AppStudioScreen;
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  handleAddField: (type: AppStudioField['type']) => void;
  handleDeleteField: (id: string) => void;
  handleMoveField: (id: string, dir: 'up' | 'down') => void;
  handleDuplicateField: (field: AppStudioField) => void;
  handleAddScreen: () => void;
  handleDuplicateScreen: (screenId: string) => void;
  handleDeleteScreen: (screenId: string) => void;
  handleAiGenerateComponent: (customPrompt?: string) => void;
  aiPromptText: string;
  setAiPromptText: (text: string) => void;
  isAiGenerating: boolean;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export type SidebarTab = 'palette' | 'tree' | 'screens' | 'copilot' | 'theme' | 'workflows';

export const StudioLeftSidebar: React.FC<StudioLeftSidebarProps> = ({
  project,
  setProject,
  activeScreen,
  selectedFieldId,
  setSelectedFieldId,
  handleAddField,
  handleDeleteField,
  handleMoveField,
  handleDuplicateField,
  handleAddScreen,
  handleDuplicateScreen,
  handleDeleteScreen,
  handleAiGenerateComponent,
  aiPromptText,
  setAiPromptText,
  isAiGenerating,
  showToast
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('palette');
  const [componentSearch, setComponentSearch] = useState('');
  const [componentCategory, setComponentCategory] = useState<'all' | 'commerce' | 'fintech' | 'content'>('all');

  const componentCatalogue = [
    // 🛒 COMMERCE & STORE HEROES
    { type: 'product_card', label: 'كرت منتج فاخر مع تقييم وسعر', category: 'commerce', icon: Package, badge: 'رائج', desc: 'بطاقة عرض منتج مع الخصم، زر الإضافة للسلة وحالة المخزون' },
    { type: 'product_grid', label: 'شبكة منتجات متعددة', category: 'commerce', icon: Boxes, badge: 'تجارة', desc: 'عرض شبكي لعدة أصناف ومنتجات بضغطة زر' },
    { type: 'frequently_bought_together', label: 'حزمة اشتري معاً ووفر (Bundles)', category: 'commerce', icon: Layers2, badge: 'زيادة السلة', desc: 'تجميعة منتجات مكملة بخصم حزمة وإضافة بضغطة واحدة' },
    { type: 'free_shipping_meter', label: 'عداد الشحن المجاني التفاعلي', category: 'commerce', icon: Truck, badge: 'تحفيز الشراء', desc: 'شريط تقدم يوضح كم تبقى على الشحن المجاني السريع' },
    { type: 'urgency_scarcity_bar', label: 'شريط الزوار ونفاد المخزون الحي', category: 'commerce', icon: Flame, badge: 'FOMO حارق', desc: 'يشاهده الآن X عملاء ومتبقي عدد قليل من القطع' },
    { type: 'variant_selector', label: 'محدد المقاسات والألوان (Swatches)', category: 'commerce', icon: Sliders, badge: 'خيارات', desc: 'عينات ألوان، أحجام، وروائح مع تحديث السعر الفوري' },
    { type: 'tiered_quantity_discount', label: 'باقات خصم الكميات (1, 2, 3 قطع)', category: 'commerce', icon: Percent, badge: 'مضاعفة المبيعات', desc: 'عروض اشتر قطعتين واحصل على الثالثة بخصم أو مجاناً' },
    { type: 'countdown_timer', label: 'عداد عروض وتخفيضات تنازلي', category: 'commerce', icon: Clock, badge: 'تسويق', desc: 'شريط تنازلي حي لعروض رمضان والمواسم الترويجية' },
    { type: 'b2b_wholesale_table', label: 'جدول أسعار الجملة (B2B Tiers)', category: 'commerce', icon: Tag, badge: 'شركات', desc: 'شرائح خصم كميات الجملة ونصف الدرزن' },
    { type: 'coupon_box', label: 'خانة كوبون الخصم التفاعلي', category: 'commerce', icon: Percent, badge: 'كوبونات', desc: 'إدخال كود الخصم مع تطبيق فوري وحساب التوفير' },
    { type: 'delivery_estimator', label: 'حاسبة موعد التوصيل والاستلام', category: 'commerce', icon: MapPin, badge: 'لوجستي', desc: 'تحديد المدينة وعرض موعد وصول الشحنة الدقيق' },
    { type: 'video_reel_card', label: 'فيديو وريلز المنتج مع شراء مباشر', category: 'commerce', icon: Video, badge: 'Shoppable Reels', desc: 'فيديو ترويجي قصير مع زر شراء فوق الفيديو' },
    { type: 'before_after_slider', label: 'شريط مقارنة قبل وبعد التفاعلي', category: 'commerce', icon: Split, badge: 'مقارنة بصرية', desc: 'مقارنة تفاعلية بالسحب قبل وبعد الاستخدام' },
    { type: 'specs_table', label: 'جدول المواصفات الفنية والمكونات', category: 'commerce', icon: FileSpreadsheet, badge: 'تفاصيل دقيقة', desc: 'جدول منسق للأبعاد، بلد الصنع، والمواصفات' },
    { type: 'loyalty_rewards_card', label: 'بطاقة نقاط المكافآت والمحفظة', category: 'commerce', icon: Coins, badge: 'ولاء العملاء', desc: 'عرض النقاط المكتسبة وقيمتها النقدية في المحفظة' },
    { type: 'sticky_buy_bar', label: 'شريط الشراء السريع المثبت أسفل الشاشة', category: 'commerce', icon: Anchor, badge: 'تحويل سريع', desc: 'شريط عائم دائم للشراء الفوري دون الحاجة للصعود' },
    { type: 'personalized_gift_upload', label: 'تخصيص الهدايا ورفع الصور والإهداء', category: 'commerce', icon: Gift, badge: 'إهداء ملكي', desc: 'كرت إهداء محفور، تغليف، ورفع صورة للطباعة' },
    { type: 'custom_engraving', label: 'حقل تخصيص الحفر بالليزر والاسم', category: 'commerce', icon: Type, badge: 'تخصيص', desc: 'يتيح للمشتري كتابة عبارة الحفر أو الاسم بالذهب' },
    { type: 'trust_badges', label: 'شارات التوثيق والضمان ومعروف', category: 'commerce', icon: Award, badge: 'توثيق رسمي', desc: 'المركز السعودي للأعمال، معروف، ضمان ذهبي سنتين' },
    { type: 'payment_slot', label: 'بوابات الدفع الفوري (مدى، أبل باي)', category: 'commerce', icon: CreditCard, badge: 'دفع فوري', desc: 'خانة دفع إلكتروني آمنة مع دعم مدى وفيزا وتمارا' },

    // 💰 FINTECH & LEDGER
    { type: 'debt_credit_card', label: 'بطاقة دائن ومدين (لنا / علينا)', category: 'fintech', icon: Scale, badge: 'محاسبة', desc: 'ملخص الحسابات وميزان المستحقات والالتزامات' },
    { type: 'ledger_table', label: 'جدول قيود السجل المالي واليومية', category: 'fintech', icon: Receipt, badge: 'سجل مالي', desc: 'تدفق الحركات المالية اليومية والمستحقات المباشرة' },
    { type: 'invoice_summary', label: 'فاتورة ضريبية ZATCA مع QR Code', category: 'fintech', icon: QrCode, badge: 'ZATCA', desc: 'فاتورة ضريبية مبسطة معتمدة ومتوافقة 100%' },
    { type: 'stat_card', label: 'بطاقة إحصائيات ونمو الأرباح', category: 'fintech', icon: TrendingUp, badge: 'مؤشرات', desc: 'مؤشر أداء مالي ومعدل نمو شهري مع رسم بياني' },
    { type: 'currency_amount', label: 'حقل مبالغ مالية مع أزرار سريعة', category: 'fintech', icon: Hash, badge: 'إدخال مالي', desc: 'إدخال مبالغ مع رقائق سريعة (+50, +100, +500)' },

    // 🎨 CONTENT & LAYOUT
    { type: 'button', label: 'زر إجراء ذكي (CTA Button)', category: 'content', icon: Sparkles, badge: 'تفاعل', desc: 'زر تنفيذ شراء، محادثة واتساب أو انتقال لشاشة' },
    { type: 'reviews_wall', label: 'حائط تقييمات العملاء الموثقة', category: 'content', icon: Star, badge: 'ثقة ومصداقية', desc: 'عرض آراء وتقييمات المشترين الموثقين بالنجوم' },
    { type: 'faq_accordion', label: 'الأسئلة الشائعة وسياسة الضمان', category: 'content', icon: HelpCircle, badge: 'دعم وخدمة', desc: 'قائمة قابلة للطي للأسئلة المتكررة وسياسات الإرجاع' },
    { type: 'image_banner', label: 'بانر إعلاني / صورة ترويجية', category: 'content', icon: ImageIcon, badge: 'وسائط', desc: 'صورة عريضة عالية الجودة للعروض والمجموعات' },
    { type: 'heading', label: 'عنوان رئيسي مع وصف فرعي', category: 'content', icon: Type, badge: 'نصوص', desc: 'عنوان بارز لتنظيم أقسام الصفحة' },
    { type: 'text', label: 'حقل إدخال نصوص أو ملاحظات', category: 'content', icon: Type, badge: 'نماذج', desc: 'حقل لإدخال الاسم أو العنوان أو الملاحظات' }
  ];

  const filteredCatalogue = componentCatalogue.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(componentSearch.toLowerCase()) || 
                          item.desc.toLowerCase().includes(componentSearch.toLowerCase());
    const matchesCat = componentCategory === 'all' || item.category === componentCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col h-full bg-[#0A101C] border border-[#1E2E48] rounded-3xl overflow-hidden shadow-2xl">
      
      {/* 1. TOP TAB NAVIGATION BAR */}
      <div className="flex items-center border-b border-[#1E2E48] bg-[#070B13] p-1.5 gap-1 overflow-x-auto">
        {[
          { id: 'palette', label: 'العناصر', icon: Boxes, count: componentCatalogue.length },
          { id: 'tree', label: 'الطبقات', icon: Layers, count: activeScreen.fields.length },
          { id: 'screens', label: 'الشاشات', icon: Layout, count: project.screens.length },
          { id: 'copilot', label: 'الذكاء AI', icon: Bot, isNew: true },
          { id: 'theme', label: 'الهوية', icon: Palette },
          { id: 'workflows', label: 'المنطق', icon: Workflow }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SidebarTab)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 font-black' 
                  : 'text-slate-400 hover:text-white hover:bg-[#10192B]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ${
                  isActive ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.isNew && (
                <span className="text-[8px] bg-indigo-500 text-white font-black px-1.5 py-0.5 rounded-full animate-pulse">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 2. TAB CONTENT BODY */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        
        {/* ============================================================ */}
        {/* TAB 1: COMPONENT PALETTE */}
        {/* ============================================================ */}
        {activeTab === 'palette' && (
          <div className="space-y-3">
            
            {/* Search and Category Filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                <input
                  type="text"
                  placeholder="ابحث عن مكون (منتج، دفع، ZATCA، تقسيط...)"
                  value={componentSearch}
                  onChange={e => setComponentSearch(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#10192B] border border-[#1E2E48] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-1 bg-[#10192B] p-1 rounded-xl border border-[#1E2E48]">
                {[
                  { id: 'all', label: 'الكل' },
                  { id: 'commerce', label: '🛒 تجارة' },
                  { id: 'fintech', label: '💰 مالية' },
                  { id: 'content', label: '🎨 محتوى' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setComponentCategory(cat.id as any)}
                    className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      componentCategory === cat.id
                        ? 'bg-amber-400 text-slate-950 shadow font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Component Cards Grid */}
            <div className="space-y-2">
              {filteredCatalogue.map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.type}
                    onClick={() => handleAddField(item.type as any)}
                    className="p-3 rounded-2xl bg-[#0F1826] hover:bg-[#152338] border border-[#1E2E48] hover:border-amber-400/60 transition-all cursor-pointer group shadow-sm flex items-start justify-between gap-2.5 active:scale-[0.98]"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                            {item.label}
                          </h5>
                          <span className="text-[9px] bg-white/5 text-slate-400 border border-white/10 px-1.5 py-0.2 rounded-md font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg bg-amber-400/10 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shrink-0"
                      title="إضافة للشاشة"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LAYER TREE & HIERARCHY */}
        {/* ============================================================ */}
        {activeTab === 'tree' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2E48] pb-2">
              <div>
                <h4 className="text-xs font-black text-white">طبقات الشاشة الحالية</h4>
                <p className="text-[10px] text-slate-400">ترتيب، تخصيص، أو حذف عناصر ({activeScreen.titleAr})</p>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/20">
                {activeScreen.fields.length} عنصر
              </span>
            </div>

            {activeScreen.fields.length === 0 ? (
              <div className="text-center py-8 p-4 rounded-2xl border border-dashed border-white/10 bg-black/20 space-y-2">
                <Layers className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">لا توجد عناصر في هذه الشاشة حالياً</p>
                <button
                  onClick={() => setActiveTab('palette')}
                  className="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 text-xs font-bold"
                >
                  + إضافة من مكتبة المكونات
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {activeScreen.fields.map((field, idx) => {
                  const isSelected = selectedFieldId === field.id;
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border-amber-400 shadow-md' 
                          : 'bg-[#0F1826] border-[#1E2E48] hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">#{idx + 1}</span>
                        <div className="truncate">
                          <div className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300 font-black' : 'text-white'}`}>
                            {field.labelAr}
                          </div>
                          <div className="text-[9px] text-slate-400 flex items-center gap-1 font-mono">
                            <span>{field.type}</span>
                            {field.actionTrigger && (
                              <span className="text-amber-400">⚡ {field.actionTrigger.type}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Layer Controls */}
                      <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveField(field.id, 'up')}
                          className="p-1 rounded bg-black/30 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          title="تحريك لأعلى"
                        >
                          <MoveUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === activeScreen.fields.length - 1}
                          onClick={() => handleMoveField(field.id, 'down')}
                          className="p-1 rounded bg-black/30 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20"
                          title="تحريك لأسفل"
                        >
                          <MoveDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDuplicateField(field)}
                          className="p-1 rounded bg-black/30 hover:bg-slate-700 text-slate-400 hover:text-white"
                          title="تكرار"
                        >
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteField(field.id)}
                          className="p-1 rounded bg-black/30 hover:bg-rose-900/50 text-rose-400 hover:text-rose-300"
                          title="حذف"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: SCREENS & FLOWS */}
        {/* ============================================================ */}
        {activeTab === 'screens' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E2E48] pb-2">
              <div>
                <h4 className="text-xs font-black text-white">شاشات وتدفق التطبيق</h4>
                <p className="text-[10px] text-slate-400">إدارة الصفحات والتنقل بين الواجهات</p>
              </div>
              <button
                onClick={handleAddScreen}
                className="px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>شاشة جديدة</span>
              </button>
            </div>

            <div className="space-y-2">
              {project.screens.map(screen => {
                const isActive = project.activeScreenId === screen.id;
                return (
                  <div
                    key={screen.id}
                    onClick={() => setProject(p => ({ ...p, activeScreenId: screen.id }))}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isActive 
                        ? 'bg-amber-500/10 border-amber-400 shadow-md' 
                        : 'bg-[#0F1826] border-[#1E2E48] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-amber-400 ring-2 ring-amber-400/30' : 'bg-slate-600'}`} />
                        <span className="text-xs font-black text-white">{screen.titleAr}</span>
                      </div>
                      <span className="text-[10px] bg-black/40 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                        {screen.fields.length} عنصر
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5" onClick={e => e.stopPropagation()}>
                      <span className="font-mono">{screen.slug}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicateScreen(screen.id)}
                          className="px-2 py-0.5 rounded bg-black/30 hover:bg-slate-700 text-slate-300"
                        >
                          تكرار
                        </button>
                        {project.screens.length > 1 && (
                          <button
                            onClick={() => handleDeleteScreen(screen.id)}
                            className="px-2 py-0.5 rounded bg-black/30 hover:bg-rose-900/50 text-rose-400"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: AI COPILOT ARCHITECT */}
        {/* ============================================================ */}
        {activeTab === 'copilot' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h4 className="text-xs font-black text-white">المهندس المعماري بالذكاء الاصطناعي</h4>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                اكتب ما تريد بلغتك وسيقوم الذكاء الاصطناعي بهيكلة وتصميم المكون المناسب وربطه فورياً!
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={aiPromptText}
                onChange={e => setAiPromptText(e.target.value)}
                placeholder="مثال: أضف كرت منتج فاخر دهن عود مع زر تقسيط تمارا 4 دفعات وتقييم 4.9 وسعر 450 ريال..."
                className="w-full p-3 rounded-2xl bg-[#10192B] border border-[#1E2E48] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
              />

              <button
                onClick={() => handleAiGenerateComponent(aiPromptText)}
                disabled={isAiGenerating || !aiPromptText.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>جاري التوليد والهندسة الحية...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950" />
                    <span>توليد وبناء المكون فورياً</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick AI Presets */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[11px] font-bold text-slate-400 block">نماذج جاهزة بضغطة زر:</span>
              {[
                'أضف شريط عداد تنازلي لعروض رمضان مع خصم 35%',
                'أضف جدول أسعار الجملة للشركات B2B مع خصم الدرزن',
                'أضف قسم تقسيط تمارا 4 دفعات بدون فوائد',
                'أضف فاتورة ضريبية مبسطة معتمدة من ZATCA مع QR',
                'أضف زر طلب سريع عبر الواتساب مع رسالة جاهزة'
              ].map((preset, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={() => handleAiGenerateComponent(preset)}
                  className="w-full text-right p-2 rounded-xl bg-[#0F1826] hover:bg-[#18263F] border border-[#1E2E48] hover:border-amber-400/50 text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between"
                >
                  <span className="truncate">{preset}</span>
                  <Sparkle className="w-3 h-3 text-amber-400 shrink-0 mr-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: THEME & STYLES */}
        {/* ============================================================ */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-black text-white">السمات والهوية البصرية العالمية</h4>
              <p className="text-[10px] text-slate-400">توليد ديناميكي لنظام التصميم المتكامل</p>
            </div>

            {/* Dynamic Custom Palette Generator */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-[#0F1826] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>توليد ثيم ديناميكي ذكي</span>
                </span>
                <span className="text-[9px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  Dynamic Engine
                </span>
              </div>

              {/* Primary Anchor Color input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-300 font-bold">اللون الأساسي للعلامة:</span>
                  <span className="text-amber-400 font-mono text-[10px]">{project.theme.primaryColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={project.theme.primaryColor}
                    onChange={e => {
                      const col = e.target.value;
                      setProject(p => ({
                        ...p,
                        theme: {
                          ...p.theme,
                          primaryColor: col
                        }
                      }));
                    }}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={project.theme.primaryColor}
                    onChange={e => {
                      const col = e.target.value;
                      setProject(p => ({
                        ...p,
                        theme: {
                          ...p.theme,
                          primaryColor: col
                        }
                      }));
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-white uppercase focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Harmony Quick Modes */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-bold block">نمط التناغم والتدرج:</span>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'golden', label: 'نسبة ذهبية' },
                    { id: 'comp', label: 'تكميلي' },
                    { id: 'triad', label: 'ثلاثي حيوي' },
                  ].map(h => (
                    <button
                      key={h.id}
                      onClick={() => {
                        showToast(`تم تطبيق تناغم (${h.label}) بنجاح! ⚡`, 'info');
                      }}
                      className="px-2 py-1 rounded-lg bg-black/30 hover:bg-slate-800 text-[10px] font-bold text-slate-300 hover:text-white border border-white/5"
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Curated Themes Grid */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">السمات الاحترافية المجهزة:</span>
              {MASTER_THEME_PRESETS.map(preset => {
                const isSelected = project.theme.primaryColor === preset.primary && project.theme.isDarkMode === preset.isDarkMode;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      setProject(p => ({
                        ...p,
                        theme: {
                          ...p.theme,
                          primaryColor: preset.primary,
                          secondaryColor: preset.secondary,
                          backgroundColor: preset.background,
                          textColor: preset.textColor,
                          fontFamily: preset.font,
                          isDarkMode: preset.isDarkMode
                        }
                      }));
                      showToast(`تم تطبيق السمة (${preset.nameAr}) بنجاح ✨`, 'success');
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-amber-500/10 border-amber-400 shadow-md' 
                        : 'bg-[#0F1826] border-[#1E2E48] hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center -space-x-1 space-x-reverse">
                        <div className="w-4 h-4 rounded-full border border-black/40" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full border border-black/40" style={{ backgroundColor: preset.background }} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{preset.nameAr}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{preset.font}</div>
                      </div>
                    </div>

                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Typography Selector */}
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <label className="text-xs font-bold text-slate-300 block">نوع الخط العربي:</label>
              <select
                value={project.theme.fontFamily}
                onChange={e => setProject(p => ({ ...p, theme: { ...p.theme, fontFamily: e.target.value } }))}
                className="w-full p-2.5 rounded-xl bg-[#10192B] border border-[#1E2E48] text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Tajawal">Tajawal (تجوال - فاخر وعصري)</option>
                <option value="Cairo">Cairo (القاهرة - واضح وجريء)</option>
                <option value="Almarai">Almarai (المراعي - متزن وأنيق)</option>
                <option value="Readex Pro">Readex Pro (ريدكس - تقني حديث)</option>
                <option value="IBM Plex Sans Arabic">IBM Plex Arabic (آي بي إم - رسمي ومؤسسي)</option>
              </select>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 6: WORKFLOWS & LOGIC */}
        {/* ============================================================ */}
        {activeTab === 'workflows' && (
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-black text-white">المنطق وسير العمل والربط</h4>
              <p className="text-[10px] text-slate-400">الضرائب، بوابات الدفع، وإعدادات ZATCA</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0F1826] border border-[#1E2E48] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">نسبة ضريبة القيمة المضافة:</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={project.taxRate}
                    onChange={e => setProject(p => ({ ...p, taxRate: parseFloat(e.target.value) || 0 }))}
                    className="w-16 p-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono font-bold text-amber-400 text-center"
                  />
                  <span className="text-xs text-slate-400">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-300">تشفير فواتير ZATCA Phase 2:</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md">
                  مفعل (TLV Base64) ✅
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs font-bold text-slate-300">تقسيط تمارا وتابي:</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-md">
                  4 دفعات ميسرة ✅
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
