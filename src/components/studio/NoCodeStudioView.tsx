import React, { useState, useEffect } from 'react';
import { 
  Store,
  Rocket,
  Smartphone, 
  Tablet, 
  Monitor, 
  Download, 
  Code2, 
  Plus, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Palette, 
  Layers, 
  CreditCard, 
  Sparkles, 
  Globe, 
  ShoppingBag, 
  BookOpen, 
  Wallet, 
  Receipt, 
  Settings2, 
  Check, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  ExternalLink, 
  FileCode, 
  X, 
  ChevronDown, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  Type,
  Hash,
  DollarSign,
  Scale,
  Sliders,
  Layout,
  Package,
  Star,
  Tag,
  TrendingUp,
  TrendingDown,
  QrCode,
  Printer,
  Share2,
  Clock,
  ArrowUpRight,
  SlidersHorizontal,
  Paintbrush,
  Sun,
  Moon,
  CopyPlus,
  CheckCircle,
  HelpCircle,
  Bot,
  Zap,
  Play,
  Terminal,
  MessageSquare,
  BadgePercent,
  ShieldAlert,
  FileJson,
  ListPlus,
  Send,
  Cpu,
  Boxes,
  Workflow,
  Sparkle,
  Undo2,
  Redo2,
  Grid
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { StorefrontView } from '../storefront/StorefrontView';
import { TenantStore, StoreTheme } from '../../types';
import { ARAB_COUNTRIES, PAYMENT_GATEWAY_PROVIDERS, ArabCountry } from '../../data/arabCountries';
import { 
  NoCodeAppProject, 
  AppArchetype, 
  AppStudioScreen, 
  AppStudioField, 
  ExportTargetPlatform,
  PaymentSlotConfig 
} from '../../types/appStudio';
import { NoCodeCodeGenerator } from '../../utils/noCodeCodeGenerator';
import { exportNoCodeAppZip, triggerBlobDownload } from '../../utils/noCodeZipExporter';
import { StudioLeftSidebar, MASTER_THEME_PRESETS } from './StudioLeftSidebar';
import { StudioPropertyInspector } from './StudioPropertyInspector';
import { StudioCanvas } from './StudioCanvas';
import { StudioLiveSimulator } from './StudioLiveSimulator';
import { StudioModals } from './StudioModals';

export const NoCodeStudioView: React.FC = () => {
  const { 
    activeTenant, 
    updateTheme, 
    updateTenant, 
    setCurrentView,
    tenants,
    activeTenantId,
    setActiveTenantId,
    cloneTenant
  } = useCommerce();

  // Curated Archetype Presets
  const ARCHETYPE_PRESETS: Record<AppArchetype, {
    nameAr: string;
    descriptionAr: string;
    icon: string;
    screens: AppStudioScreen[];
  }> = {
    store: {
      nameAr: 'متجر العطور والعود الملكي الفاخر',
      descriptionAr: 'تطبيق متجر إلكتروني متكامل لبيع العطور الفاخرة والدفع الفوري وتقسيط تمارا',
      icon: '🛍️',
      screens: [
        {
          id: 'scr_store_home',
          titleAr: 'الرئيسية والمتجر',
          titleEn: 'Home Store',
          slug: 'home',
          fields: [
            {
              id: 'f_store_hdr',
              type: 'heading',
              labelAr: 'المجموعة الملكية الحصرية 2026',
              placeholderAr: 'أفخم خلطات العود الكمبودي والمسك الصافي مع شحن سريع وضمان ذهبي',
              styling: { fontSize: 'xl', align: 'center', shadow: 'soft' }
            },
            {
              id: 'f_store_countdown',
              type: 'countdown_timer',
              labelAr: 'عروض وتخفيضات شهر رمضان المبارك 🌙',
              value: { discountPercent: 35, targetDate: '2026-04-01' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_store_prod1',
              type: 'product_card',
              labelAr: 'دهن عود كلمنتان مالينو المعتق',
              placeholderAr: 'ثبات فواح يدوم لأيام مع نقاء استثنائي',
              value: {
                price: 450,
                originalPrice: 620,
                rating: 4.9,
                stock: 8,
                tag: 'الأكثر طلباً',
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'tamara' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_store_prod2',
              type: 'product_card',
              labelAr: 'مبخرة كريستال فاخرة مع حفر الاسم بالليزر',
              placeholderAr: 'إهداء فاخر محفور بالاسم بالذهب الخالص',
              value: {
                price: 280,
                originalPrice: 350,
                rating: 4.8,
                stock: 15,
                tag: 'جديد',
                image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'whatsapp' },
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_store_pay',
              type: 'payment_slot',
              labelAr: 'بوابات الدفع الإلكتروني والتقسيط المعتمدة',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_store_reviews',
              type: 'reviews_wall',
              labelAr: 'تجارب وآراء عملاء النخبة الموثقة ⭐',
              value: {
                reviews: [
                  { name: 'د. خالد التميمي', text: 'جودة استثنائية وتغليف فاخر جداً، التوصيل خلال 24 ساعة في الرياض.', city: 'الرياض' },
                  { name: 'أ / سارة الغامدي', text: 'النقش بالليزر طلع تحفة فنية، شكراً لكم على الاحترافية العالية.', city: 'جدة' }
                ]
              },
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_store_faq',
              type: 'faq_accordion',
              labelAr: 'الأسئلة الشائعة وسياسة الضمان الذهبي',
              value: {
                items: [
                  { q: 'كم تستغرق مدة التوصيل داخل المملكة؟', a: 'التوصيل خلال 24-48 ساعة عبر شحن سريع ومبرد.' },
                  { q: 'هل يشمل الطلب الضمان الذهبي؟', a: 'نعم، ضمان استبدال واسترجاع فوري لمدة سنتين كاملتين.' }
                ]
              }
            }
          ]
        }
      ]
    },
    coffee_roastery: {
      nameAr: 'محمصة القهوة المختصة والسبيرشالتي',
      descriptionAr: 'تطبيق محمصة قهوة متكامل لبيع المحاصيل الفاخرة، أدوات التقطير وحزم التوفير',
      icon: '☕',
      screens: [
        {
          id: 'scr_coffee_home',
          titleAr: 'الرئيسية والمحاصيل',
          titleEn: 'Coffee Store',
          slug: 'home',
          fields: [
            {
              id: 'f_cof_hdr',
              type: 'heading',
              labelAr: 'محاصيل القهوة المختصة الطازجة ☕',
              placeholderAr: 'تحميص أسبوعي طازج من أفضل مزارع إثيوبيا وكولومبيا واليمن',
              styling: { fontSize: 'xl', align: 'center', shadow: 'soft' }
            },
            {
              id: 'f_cof_ship',
              type: 'free_shipping_meter',
              labelAr: 'شحن مجاني سريع عند الشراء بـ 250 ر.س فأكثر',
              value: { goal: 250, current: 180 },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_cof_urgency',
              type: 'urgency_scarcity_bar',
              labelAr: 'محصول موسمي محدود - تحميص جديد',
              value: { viewersCount: 28, remainingStock: 6 },
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_cof_prod1',
              type: 'product_card',
              labelAr: 'إثيوبيا قوجي مجففة - إيحاءات توت وياسمين',
              placeholderAr: 'معالجة مجففة نقية، ممتازة للفلتر والاسبريسو',
              value: {
                price: 78,
                originalPrice: 95,
                rating: 4.95,
                stock: 12,
                tag: 'محصول الموسم',
                image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'tamara' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_cof_prod2',
              type: 'product_card',
              labelAr: 'كولومبيا هويلا مغسولة - قوام شوكولاتة وكراميل',
              placeholderAr: 'قوام كلاسيكي متوازن يناسب مشروبات الحليب ومقطرة V60',
              value: {
                price: 72,
                originalPrice: 88,
                rating: 4.88,
                stock: 19,
                tag: 'الأكثر مبيعاً',
                image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'tamara' },
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_cof_bundle',
              type: 'frequently_bought_together',
              labelAr: 'باقة عشاق القهوة الثلاثية + فلاتر يابانية مجانية',
              value: { discountAmount: 55 },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_cof_pay',
              type: 'payment_slot',
              labelAr: 'الدفع الإلكتروني وتقسيط تمارا 4 دفعات بدون فوائد',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_cof_reviews',
              type: 'reviews_wall',
              labelAr: 'آراء وتقييمات باريستا وعشاق القهوة ⭐',
              value: {
                reviews: [
                  { name: 'بدر الشمري', text: 'التحميص احترافي والإيحاءات واضحة جداً بالـ V60، توصيل سريع ونظيف.', city: 'الرياض' },
                  { name: 'ريم العتيبي', text: 'أفضل قوجي جربتها هذا الموسم، شكراً على هدية الفلاتر!', city: 'الدمام' }
                ]
              },
              styling: { shadow: 'soft' }
            }
          ]
        }
      ]
    },
    fashion_boutique: {
      nameAr: 'بوتيك العبايات والأزياء الفاخرة',
      descriptionAr: 'تطبيق متجر أزياء وعبايات راقية مع جدول المقاسات والتقسيط والشحن السريع',
      icon: '👗',
      screens: [
        {
          id: 'scr_fashion_home',
          titleAr: 'المجموعة الحصرية والعبايات',
          titleEn: 'Haute Couture',
          slug: 'home',
          fields: [
            {
              id: 'f_fsh_hdr',
              type: 'heading',
              labelAr: 'تشكيلة رمضان والعيد الحصرية 2026 ✨',
              placeholderAr: 'تصاميم ملكية من الحرير والكتان الفاخر مع طرحة مجانية وشحن مبرد',
              styling: { fontSize: 'xl', align: 'center', shadow: 'soft' }
            },
            {
              id: 'f_fsh_countdown',
              type: 'countdown_timer',
              labelAr: 'خصم التدشين الحصري 25% لفترة محدودة ⏳',
              value: { discountPercent: 25, targetDate: '2026-04-10' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_fsh_prod1',
              type: 'product_card',
              labelAr: 'عباية كلوش حرير كوري مع تطريز شك يدوي بالخرز',
              placeholderAr: 'قصة انسيابية راقية، قماش ناعم وبارد مع طرحة متطابقة',
              value: {
                price: 490,
                originalPrice: 650,
                rating: 4.96,
                stock: 5,
                tag: 'إصدار محدود',
                image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'tamara' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_fsh_variants',
              type: 'variant_selector',
              labelAr: 'اختيار المقاس والطول (52, 54, 56, 58, 60)',
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_fsh_tiered',
              type: 'tiered_quantity_discount',
              labelAr: 'باقة الصديقات: اطلبي عبايتين واحصلي على خصم 150 ر.س',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_fsh_pay',
              type: 'payment_slot',
              labelAr: 'قسطيها على 4 دفعات بدون فوائد مع تمارا وتابي',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_fsh_trust',
              type: 'trust_badges',
              labelAr: 'ضمان الاستبدال المجاني للمقاس وتوثيق المركز السعودي للأعمال',
              styling: { shadow: 'soft' }
            }
          ]
        }
      ]
    },
    electronics_gadgets: {
      nameAr: 'متجر الإلكترونيات والأجهزة الذكية',
      descriptionAr: 'تطبيق بيع إلكترونيات وأجهزة ذكية وملحقات مع جداول المواصفات والضمان',
      icon: '📱',
      screens: [
        {
          id: 'scr_elec_home',
          titleAr: 'الأجهزة والتقنية الذكية',
          titleEn: 'Gadgets & Tech',
          slug: 'home',
          fields: [
            {
              id: 'f_elc_hdr',
              type: 'heading',
              labelAr: 'عالم التقنية والابتكارات الذكية ⚡',
              placeholderAr: 'أحدث الأجهزة الأصلية 100% مع ضمان سنتين واستبدال فوري',
              styling: { fontSize: 'xl', align: 'center', shadow: 'soft' }
            },
            {
              id: 'f_elc_prod1',
              type: 'product_card',
              labelAr: 'سماعات Pro اللاسلكية مع عزل الضوضاء النشط ANC',
              placeholderAr: 'صوت مكاني نقي، بطارية تدوم 40 ساعة ومقاومة للماء IPX7',
              value: {
                price: 349,
                originalPrice: 499,
                rating: 4.92,
                stock: 14,
                tag: 'عرض خاص',
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80'
              },
              actionTrigger: { type: 'tamara' },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_elc_specs',
              type: 'specs_table',
              labelAr: 'المواصفات الفنية المعتمدة',
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_elc_pay',
              type: 'payment_slot',
              labelAr: 'ادفع بأمان عبر أبل باي ومدى أو قسطها مع تمارا',
              styling: { shadow: 'glow' }
            }
          ]
        }
      ]
    },
    b2b_wholesale: {
      nameAr: 'مركز تجارة الجملة والتوريد B2B',
      descriptionAr: 'منصة توريد كميات الجملة للشركات والمتاجر مع شرائح الأسعار والفواتير الضريبية',
      icon: '🏢',
      screens: [
        {
          id: 'scr_b2b_home',
          titleAr: 'بوابة التوريد وأسعار الجملة',
          titleEn: 'Wholesale B2B',
          slug: 'home',
          fields: [
            {
              id: 'f_b2b_hdr',
              type: 'heading',
              labelAr: 'بوابة الموردين وطلبات الجملة المعتمدة 🏢',
              placeholderAr: 'أسعار تفضيلية للمحلات والموزعين مع فوترة ضريبية معتمدة من هيئة الزكاة ZATCA',
              styling: { fontSize: 'xl', align: 'center', shadow: 'soft' }
            },
            {
              id: 'f_b2b_table',
              type: 'b2b_wholesale_table',
              labelAr: 'شرائح خصم الكميات والكرتون',
              value: {
                tiers: [
                  { qty: '1 - 5 حبات (تجزئة)', price: 380, saving: 'سعر القطاعي' },
                  { qty: '6 - 24 حبة (نصف درزن)', price: 310, saving: 'وفر 18%' },
                  { qty: '25 - 100 حبة (كرتون جملة)', price: 250, saving: 'وفر 34% 🔥' }
                ]
              },
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_b2b_invoice',
              type: 'invoice_summary',
              labelAr: 'فاتورة ضريبية إلكترونية معتمدة شاملة ضريبة القيمة المضافة 15%',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_b2b_btn',
              type: 'button',
              labelAr: 'طلب تسعيرة رسمية وتوريد مباشر عبر الواتساب 💬',
              actionTrigger: { type: 'whatsapp' },
              styling: { shadow: 'glow' }
            }
          ]
        }
      ]
    },
    ledger_debt: {
      nameAr: 'دفتر الحسابات والديون والقيود المحاسبية',
      descriptionAr: 'نظام إدارة الديون والمستحقات والعملاء والموردين وميزان المدفوعات',
      icon: '⚖️',
      screens: [
        {
          id: 'scr_ledger_home',
          titleAr: 'سجل الحسابات والديون',
          titleEn: 'Ledger & Debts',
          slug: 'ledger',
          fields: [
            {
              id: 'f_led_hdr',
              type: 'heading',
              labelAr: 'ميزان القيود المحاسبية والمستحقات',
              placeholderAr: 'تتبع ديون العملاء والتزامات الموردين بصورة فورية',
              styling: { fontSize: 'lg', align: 'start' }
            },
            {
              id: 'f_led_balance',
              type: 'debt_credit_card',
              labelAr: 'ملخص الحسابات (صافي الميزان المالي)',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_led_table',
              type: 'ledger_table',
              labelAr: 'حركات القيود الحديثة لليوم',
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_led_add_btn',
              type: 'button',
              labelAr: '+ تسجيل حركة مالية أو قيد جديد',
              actionTrigger: { type: 'ledger_entry' },
              styling: { shadow: 'glow' }
            }
          ]
        }
      ]
    },
    pos_invoicing: {
      nameAr: 'كاشير وفواتير إلكترونية ZATCA المرحلة الثانية',
      descriptionAr: 'نظام نقطة بيع متوافقة مع متطلبات هيئة الزكاة والضريبة والجمارك مع رمز الاستجابة المشفر',
      icon: '🧾',
      screens: [
        {
          id: 'scr_pos_home',
          titleAr: 'نقطة البيع وإصدار الفاتورة',
          titleEn: 'POS & Invoices',
          slug: 'pos',
          fields: [
            {
              id: 'f_pos_hdr',
              type: 'heading',
              labelAr: 'إصدار فاتورة ضريبية مبسطة معتمدة (ZATCA Phase 2)',
              placeholderAr: 'متوافقة بالكامل مع تشفير TLV Base64',
              styling: { fontSize: 'lg', align: 'center' }
            },
            {
              id: 'f_pos_summary',
              type: 'invoice_summary',
              labelAr: 'ملخص الحساب والضريبة المضافة (15%)',
              styling: { shadow: 'glow' }
            },
            {
              id: 'f_pos_print_btn',
              type: 'button',
              labelAr: '🖨️ طباعة وتصدير الفاتورة الضريبية المشفرة',
              actionTrigger: { type: 'zatca_qr' },
              styling: { shadow: 'glow' }
            }
          ]
        }
      ]
    },
    expenses_tracker: {
      nameAr: 'مدير الميزانية والمصروفات التشغيلية',
      descriptionAr: 'تطبيق تحليل المصاريف وتوزيع التكاليف على الفئات المختلفة',
      icon: '📊',
      screens: [
        {
          id: 'scr_exp_home',
          titleAr: 'المصروفات والميزانية',
          titleEn: 'Expenses',
          slug: 'expenses',
          fields: [
            {
              id: 'f_exp_stat',
              type: 'stat_card',
              labelAr: 'إجمالي المصاريف التشغيلية للشهر الحالي',
              value: '14,200',
              styling: { shadow: 'soft' }
            },
            {
              id: 'f_exp_btn',
              type: 'button',
              labelAr: '+ إضافة سند صرف جديد',
              actionTrigger: { type: 'confetti' }
            }
          ]
        }
      ]
    },
    services_booking: {
      nameAr: 'حجوزات واستشارات تقنية وتجارية',
      descriptionAr: 'تطبيق حجز مواعيد وخدمات استشارية مع بوابات دفع مسبقة',
      icon: '📅',
      screens: [
        {
          id: 'scr_srv_home',
          titleAr: 'حجز موعد استشاري',
          titleEn: 'Booking',
          slug: 'booking',
          fields: [
            {
              id: 'f_srv_hdr',
              type: 'heading',
              labelAr: 'جلسة استشارية متخصصة في التجارة والمالية',
              placeholderAr: 'جلسة 60 دقيقة عبر زووم مع خبير معتمد',
              styling: { fontSize: 'lg', align: 'center' }
            },
            {
              id: 'f_srv_pay',
              type: 'payment_slot',
              labelAr: 'تأكيد الحجز والدفع المسبق الآمن',
              styling: { shadow: 'glow' }
            }
          ]
        }
      ]
    },
    custom_canvas: {
      nameAr: 'تطبيق مخصص بالكامل من الصفر',
      descriptionAr: 'لوحة عمل بيضاء فارغة تتيح لك بناء ما يحلو لك بدون قيود',
      icon: '🎨',
      screens: [
        {
          id: 'scr_blank',
          titleAr: 'الصفحة الرئيسية',
          titleEn: 'Home',
          slug: 'home',
          fields: []
        }
      ]
    }
  };

  // State Management & History Stack (Undo/Redo)
  const [project, setProject] = useState<NoCodeAppProject>(() => {
    const defaultArchetype: AppArchetype = 'store';
    const preset = ARCHETYPE_PRESETS[defaultArchetype];
    return {
      id: `app_${Date.now()}`,
      nameAr: preset.nameAr,
      nameEn: 'Elite Arab Commerce App',
      descriptionAr: preset.descriptionAr,
      countryCode: 'SA',
      currencyCode: 'SAR',
      currencySymbol: 'ر.س',
      taxRate: 15.0,
      archetype: defaultArchetype,
      theme: {
        primaryColor: '#D4AF37',
        secondaryColor: '#1A2333',
        backgroundColor: '#080D17',
        textColor: '#F8FAFC',
        fontFamily: 'Tajawal',
        borderRadius: 'curved' as any,
        isDarkMode: true,
        logoUrl: ''
      },
      screens: preset.screens,
      activeScreenId: preset.screens[0].id,
      payments: [
        { providerId: 'tamara', enabled: true, environment: 'live', keys: { public_key: 'pk_live_tamara', secret_key: 'sk_live_tamara' }, verified: true },
        { providerId: 'paymob', enabled: true, environment: 'live', keys: { api_key: 'pk_live_paymob', secret_key: 'sk_live_paymob' }, verified: true },
        { providerId: 'hyperpay', enabled: true, environment: 'live', keys: { access_token: 'pk_live_hyperpay', entity_id: '8a829417' }, verified: true }
      ],
      selectedExportPlatforms: ['all', 'web', 'android', 'ios', 'windows'] as ExportTargetPlatform[],
      updatedAt: new Date().toISOString()
    };
  });

  // Undo / Redo History Stack (Optimized with debounced snapshots)
  const [history, setHistory] = useState<NoCodeAppProject[]>([project]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const historyDebounceRef = React.useRef<any>(null);

  const updateProjectWithHistory = (newProject: NoCodeAppProject | ((prev: NoCodeAppProject) => NoCodeAppProject)) => {
    setProject(prev => {
      const next = typeof newProject === 'function' ? newProject(prev) : newProject;
      if (historyDebounceRef.current) clearTimeout(historyDebounceRef.current);
      historyDebounceRef.current = setTimeout(() => {
        setHistory(prevHist => {
          const newHistory = prevHist.slice(0, historyIndex + 1);
          newHistory.push(next);
          if (newHistory.length > 15) newHistory.shift();
          setHistoryIndex(newHistory.length - 1);
          return newHistory;
        });
      }, 250);
      return next;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
      showToast('تم التراجع عن التعديل ↩️', 'info');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
      showToast('تمت إعادة التعديل ↪️', 'info');
    }
  };

  // Studio UI View Controls
  const [studioMode, setStudioMode] = useState<'canvas' | 'simulator' | 'code'>('canvas');
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [zoom, setZoom] = useState<number>(100);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);

  // Modals & Code Export State
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [codePlatform, setCodePlatform] = useState<ExportTargetPlatform | 'backend' | 'json_ast'>('web');
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isTamaraModalOpen, setIsTamaraModalOpen] = useState(false);
  const [isZatcaModalOpen, setIsZatcaModalOpen] = useState(false);
  const [jsonAstInput, setJsonAstInput] = useState('');

  // AI Copilot State
  const [aiPromptText, setAiPromptText] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3800);
  };

  const currentCountry = ARAB_COUNTRIES.find(c => c.code === project.countryCode) || ARAB_COUNTRIES[0];
  const activeScreen = project.screens.find(s => s.id === project.activeScreenId) || project.screens[0];
  const selectedField = activeScreen.fields.find(f => f.id === selectedFieldId) || null;

  // Global Keyboard Shortcuts (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey && !isInput) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Y / Cmd+Shift+Z
      else if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && !isInput) ||
               ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z' && !isInput)) {
        e.preventDefault();
        handleRedo();
      }
      // Duplicate: Ctrl+D / Cmd+D
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && !isInput) {
        e.preventDefault();
        if (selectedField) {
          handleDuplicateField(selectedField);
        }
      }
      // Save / Snapshot: Ctrl+S / Cmd+S
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        showToast('تم حفظ لقطة المشروع وتحديث الذاكرة الحية بنجاح 💾', 'success');
      }
      // Code Inspection: Ctrl+E / Cmd+E
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsCodeModalOpen(true);
      }
      // Delete Selected Field: Delete or Backspace
      else if ((e.key === 'Delete' || e.key === 'Backspace') && !isInput && selectedFieldId) {
        e.preventDefault();
        handleDeleteField(selectedFieldId);
      }
      // Deselect: Escape
      else if (e.key === 'Escape') {
        setSelectedFieldId(null);
        setIsCodeModalOpen(false);
        setIsTamaraModalOpen(false);
        setIsZatcaModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history, selectedFieldId, selectedField]);

  // Sync JSON AST input only when code editor or modal is open (major performance optimization)
  useEffect(() => {
    if (isCodeModalOpen || studioMode === 'code') {
      setJsonAstInput(JSON.stringify(project, null, 2));
    }
  }, [isCodeModalOpen, studioMode, project]);

  // Archetype Switcher Handler
  const handleSelectArchetype = (arch: AppArchetype) => {
    const preset = ARCHETYPE_PRESETS[arch];
    if (!preset) return;
    updateProjectWithHistory(p => ({
      ...p,
      archetype: arch,
      nameAr: preset.nameAr,
      descriptionAr: preset.descriptionAr,
      screens: preset.screens,
      activeScreenId: preset.screens[0].id
    }));
    setSelectedFieldId(null);
    showToast(`تم تطبيق نموذج (${preset.nameAr}) مع شاشاته وعناصره بنجاح ✨`, 'success');
  };

  // Country & Currency Binding
  const handleSelectCountry = (country: ArabCountry) => {
    updateProjectWithHistory(p => ({
      ...p,
      countryCode: country.code,
      currencyCode: country.currencyCode,
      currencySymbol: country.currencySymbol,
      taxRate: country.vatRate
    }));
    showToast(`تم ضبط الدولة (${country.nameAr}) وتعيين العملة (${country.currencySymbol}) والضريبة (${country.vatRate}%) 🌍`, 'success');
  };

  // Field Add / Move / Duplicate / Delete Handlers
  const handleAddField = (type: AppStudioField['type']) => {
    const timestamp = Date.now();
    let newField: AppStudioField = {
      id: `f_${type}_${timestamp}`,
      type,
      labelAr: 'عنصر جديد',
      styling: { shadow: 'soft' }
    };

    if (type === 'product_card') {
      newField = {
        id: `f_prod_${timestamp}`,
        type: 'product_card',
        labelAr: 'عطر مسك الفخامة الملكي',
        placeholderAr: 'ثبات فواح ونقاء فاخر مع تغليف هدية',
        value: {
          price: 380,
          originalPrice: 480,
          rating: 4.9,
          stock: 6,
          tag: 'الأكثر مبيعاً',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80'
        },
        actionTrigger: { type: 'tamara' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'countdown_timer') {
      newField = {
        id: `f_timer_${timestamp}`,
        type: 'countdown_timer',
        labelAr: 'تخفيضات العيد واليوم الوطني 🇸🇦',
        value: { discountPercent: 30, targetDate: '2026-05-01' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'b2b_wholesale_table') {
      newField = {
        id: `f_b2b_${timestamp}`,
        type: 'b2b_wholesale_table',
        labelAr: 'جدول أسعار الجملة ونصف الدرزن (B2B Tiers)',
        value: {
          tiers: [
            { qty: '1 - 5 حبات (تجزئة)', price: 380, saving: 'سعر القطاعي' },
            { qty: '6 - 24 حبة (نصف درزن)', price: 320, saving: 'وفر 15%' },
            { qty: '25+ حبة (كرتون جملة)', price: 270, saving: 'وفر 29%' }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'reviews_wall') {
      newField = {
        id: `f_rev_${timestamp}`,
        type: 'reviews_wall',
        labelAr: 'تقييمات وتجارب العملاء الموثقة ⭐',
        value: {
          reviews: [
            { name: 'د. خالد التميمي', text: 'جودة استثنائية وتغليف فاخر جداً، التوصيل خلال 24 ساعة في الرياض.', city: 'الرياض' },
            { name: 'أ / سارة الغامدي', text: 'النقش بالليزر طلع تحفة فنية، شكراً لكم على الاحترافية العالية.', city: 'جدة' }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'custom_engraving') {
      newField = {
        id: `f_engrave_${timestamp}`,
        type: 'custom_engraving',
        labelAr: 'تخصيص الحفر بالليزر والاسم',
        value: { freeWithOrder: true },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'faq_accordion') {
      newField = {
        id: `f_faq_${timestamp}`,
        type: 'faq_accordion',
        labelAr: 'الأسئلة الشائعة وسياسة الضمان',
        value: {
          items: [
            { q: 'كم تستغرق مدة التوصيل داخل المملكة؟', a: 'التوصيل خلال 24-48 ساعة عبر شحن سريع ومبرد.' },
            { q: 'هل يشمل الطلب الضمان الذهبي؟', a: 'نعم، ضمان استبدال واسترجاع فوري لمدة سنتين كاملتين.' }
          ]
        }
      };
    } else if (type === 'payment_slot') {
      newField = {
        id: `f_pay_${timestamp}`,
        type: 'payment_slot',
        labelAr: 'بوابات الدفع الإلكتروني والتقسيط المعتمدة',
        styling: { shadow: 'glow' }
      };
    } else if (type === 'invoice_summary') {
      newField = {
        id: `f_inv_${timestamp}`,
        type: 'invoice_summary',
        labelAr: 'فاتورة ضريبية مبسطة (ZATCA Phase 2)',
        styling: { shadow: 'glow' }
      };
    } else if (type === 'debt_credit_card') {
      newField = {
        id: `f_debt_${timestamp}`,
        type: 'debt_credit_card',
        labelAr: 'ميزان الحسابات (صافي المستحقات)',
        styling: { shadow: 'glow' }
      };
    } else if (type === 'ledger_table') {
      newField = {
        id: `f_led_${timestamp}`,
        type: 'ledger_table',
        labelAr: 'حركات القيود اليومية في السجل المالي',
        styling: { shadow: 'soft' }
      };
    } else if (type === 'stat_card') {
      newField = {
        id: `f_stat_${timestamp}`,
        type: 'stat_card',
        labelAr: 'صافي الأرباح المحققة للشهر الحالي',
        value: '28,450',
        styling: { shadow: 'soft' }
      };
    } else if (type === 'button') {
      newField = {
        id: `f_btn_${timestamp}`,
        type: 'button',
        labelAr: 'إتمام الطلب والدفع الفوري الآمن',
        actionTrigger: { type: 'tamara' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'frequently_bought_together') {
      newField = {
        id: `f_bundle_${timestamp}`,
        type: 'frequently_bought_together',
        labelAr: 'حزمة النخبة الملكية (اشتري معاً ووفر 120 ر.س)',
        value: {
          mainProduct: { title: 'دهن عود كلمنتان مالينو', price: 450, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80' },
          bundleItems: [
            { id: 'b1', title: 'مبخرة كريستال فاخرة', price: 280, image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=300&q=80', selected: true },
            { id: 'b2', title: 'مسك الطهارة الصافي المعتق', price: 150, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=80', selected: true }
          ],
          discountAmount: 120
        },
        actionTrigger: { type: 'tamara' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'free_shipping_meter') {
      newField = {
        id: `f_shipmeter_${timestamp}`,
        type: 'free_shipping_meter',
        labelAr: 'مؤشر الشحن المجاني السريع 🚚',
        value: {
          threshold: 300,
          currentAmount: 220
        },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'urgency_scarcity_bar') {
      newField = {
        id: `f_urgency_${timestamp}`,
        type: 'urgency_scarcity_bar',
        labelAr: 'إقبال قياسي وعرض حصري محدود 🔥',
        value: {
          viewersCount: 19,
          remainingStock: 4,
          soldCount: 86
        },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'variant_selector') {
      newField = {
        id: `f_var_${timestamp}`,
        type: 'variant_selector',
        labelAr: 'اختر الحجم ونوع التعتيق المفضل',
        value: {
          variants: [
            { id: 'v1', name: 'تولة كاملة (12 مل)', price: 450, stock: 8, isSelected: true },
            { id: 'v2', name: 'نصف تولة (6 مل)', price: 260, stock: 14, isSelected: false },
            { id: 'v3', name: 'ربع تولة (3 مل)', price: 150, stock: 22, isSelected: false }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'tiered_quantity_discount') {
      newField = {
        id: `f_tierqty_${timestamp}`,
        type: 'tiered_quantity_discount',
        labelAr: 'عروض وباقات التوفير المضاعف 🎁',
        value: {
          tiers: [
            { qty: 1, title: 'قطعة واحدة', price: 380, saving: 'سعر الحبة', popular: false },
            { qty: 2, title: 'قطعتين (الأكثر طلباً)', price: 620, saving: 'وفر 140 ر.س', popular: true },
            { qty: 3, title: '3 قطع (باقة الإهداء)', price: 790, saving: 'وفر 350 ر.س', popular: false }
          ]
        },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'trust_badges') {
      newField = {
        id: `f_trust_${timestamp}`,
        type: 'trust_badges',
        labelAr: 'ضمانات وتوثيقات المتجر الرسمية 🛡️',
        value: {
          badges: [
            { icon: 'shield', title: 'موثق بالمركز السعودي للأعمال', subtitle: 'سجل تجاري موثق 100%' },
            { icon: 'gold', title: 'الضمان الذهبي سنتين', subtitle: 'استبدال واسترجاع فوري' },
            { icon: 'lock', title: 'دفع مشفر وآمن 100%', subtitle: 'مدى، أبل باي، تمارا' },
            { icon: 'truck', title: 'شحن مبرد وسريع', subtitle: 'خلال 24-48 ساعة' }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'coupon_box') {
      newField = {
        id: `f_coupon_${timestamp}`,
        type: 'coupon_box',
        labelAr: 'كوبون الخصم الإضافي والرموز الترويجية',
        value: {
          defaultCode: 'RAMADAN2026',
          discountPercent: 15
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'delivery_estimator') {
      newField = {
        id: `f_deliver_${timestamp}`,
        type: 'delivery_estimator',
        labelAr: 'حاسبة موعد وصول الشحنة والاستلام 📍',
        value: {
          defaultCity: 'الرياض',
          estimatedDays: 'غداً بين 4 - 8 مساءً'
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'video_reel_card') {
      newField = {
        id: `f_reel_${timestamp}`,
        type: 'video_reel_card',
        labelAr: 'تجربة حية وعرض فيديو المنتج الفاخر 🎥',
        value: {
          thumbnail: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
          title: 'شاهد فخامة التعتيق وثبات الرائحة بالفيديو',
          duration: '0:45'
        },
        actionTrigger: { type: 'tamara' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'before_after_slider') {
      newField = {
        id: `f_beforeafter_${timestamp}`,
        type: 'before_after_slider',
        labelAr: 'مقارنة النقاء واللمعان (قبل وبعد الاستخدام)',
        value: {
          beforeImage: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=500&q=80',
          afterImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
          sliderPosition: 50
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'specs_table') {
      newField = {
        id: `f_specs_${timestamp}`,
        type: 'specs_table',
        labelAr: 'جدول المواصفات الفنية والمكونات العطرية',
        value: {
          specs: [
            { key: 'بلد المنشأ', val: 'غابات كلمنتان - إندونيسيا' },
            { key: 'درجة التعتيق', val: 'معتق أكثر من 18 عاماً' },
            { key: 'درجة الثبات', val: 'يدوم من 48 إلى 72 ساعة على القماش' },
            { key: 'درجة الفوحان', val: 'انتشار عالي واستثنائي' },
            { key: 'شهادة الأصالة', val: 'مفحوص وموثق لدى مختبرات الجودة' }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'loyalty_rewards_card') {
      newField = {
        id: `f_loyalty_${timestamp}`,
        type: 'loyalty_rewards_card',
        labelAr: 'مكافآت النخبة ورصيد المحفظة 🪙',
        value: {
          earnedPoints: 45,
          cashbackValue: 15,
          tierName: 'عضوية البلاتينيوم'
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'sticky_buy_bar') {
      newField = {
        id: `f_sticky_${timestamp}`,
        type: 'sticky_buy_bar',
        labelAr: 'شريط الشراء السريع والتقسيط المثبت',
        value: {
          productName: 'دهن عود كلمنتان مالينو',
          price: 450,
          tamaraMonthly: 112.5
        },
        actionTrigger: { type: 'tamara' },
        styling: { shadow: 'glow' }
      };
    } else if (type === 'personalized_gift_upload') {
      newField = {
        id: `f_gift_${timestamp}`,
        type: 'personalized_gift_upload',
        labelAr: 'تخصيص الهدية، كرت الإهداء، وطباعة الصورة 🎁',
        value: {
          freeWrapping: true,
          supportCustomImage: true,
          supportQrAudioVoice: true
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'product_grid') {
      newField = {
        id: `f_grid_${timestamp}`,
        type: 'product_grid',
        labelAr: 'المجموعة الأكثر طلباً في المملكة',
        value: {
          items: [
            { id: 'p1', title: 'دهن عود كلمنتان', price: 450, rating: 4.9, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=400&q=80' },
            { id: 'p2', title: 'مبخرة ملكية كريستال', price: 280, rating: 4.8, image: 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=400&q=80' }
          ]
        },
        styling: { shadow: 'soft' }
      };
    } else if (type === 'image_banner') {
      newField = {
        id: `f_banner_${timestamp}`,
        type: 'image_banner',
        labelAr: 'بانر العروض والمواسم الملكية',
        placeholderAr: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1200&q=80',
        styling: { shadow: 'glow' }
      };
    }

    updateProjectWithHistory(p => ({
      ...p,
      screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, newField] } : s)
    }));
    setSelectedFieldId(newField.id);
    setIsInspectorOpen(true);
    showToast(`تمت إضافة (${newField.labelAr}) للشاشة الحالية بنجاح 🪄`, 'success');
  };

  const handleUpdateField = (updated: Partial<AppStudioField>) => {
    if (!selectedFieldId) return;
    updateProjectWithHistory(p => ({
      ...p,
      screens: p.screens.map(s => s.id === p.activeScreenId ? {
        ...s,
        fields: s.fields.map(f => f.id === selectedFieldId ? { ...f, ...updated } : f)
      } : s)
    }));
  };

  const handleDeleteField = (fieldId: string) => {
    updateProjectWithHistory(p => ({
      ...p,
      screens: p.screens.map(s => s.id === p.activeScreenId ? {
        ...s,
        fields: s.fields.filter(f => f.id !== fieldId)
      } : s)
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    showToast('تم حذف العنصر بنجاح 🗑️', 'info');
  };

  const handleMoveField = (fieldId: string, direction: 'up' | 'down') => {
    const fields = [...activeScreen.fields];
    const index = fields.findIndex(f => f.id === fieldId);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const temp = fields[index];
    fields[index] = fields[targetIndex];
    fields[targetIndex] = temp;

    updateProjectWithHistory(p => ({
      ...p,
      screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields } : s)
    }));
  };

  const handleDuplicateField = (field: AppStudioField) => {
    const timestamp = Date.now();
    const duplicated: AppStudioField = {
      ...field,
      id: `${field.id}_dup_${timestamp}`,
      labelAr: `${field.labelAr} (نسخة)`
    };
    updateProjectWithHistory(p => ({
      ...p,
      screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, duplicated] } : s)
    }));
    setSelectedFieldId(duplicated.id);
    showToast('تم تكرار العنصر بنجاح 📋', 'success');
  };

  // Screen Add / Duplicate / Delete Handlers
  const handleAddScreen = () => {
    const id = `scr_${Date.now()}`;
    const newScreen: AppStudioScreen = {
      id,
      titleAr: `شاشة جديدة ${project.screens.length + 1}`,
      titleEn: `Screen ${project.screens.length + 1}`,
      slug: `screen-${project.screens.length + 1}`,
      fields: []
    };
    updateProjectWithHistory(p => ({
      ...p,
      screens: [...p.screens, newScreen],
      activeScreenId: id
    }));
    setSelectedFieldId(null);
    showToast(`تم إنشاء (${newScreen.titleAr}) بنجاح 📱`, 'success');
  };

  const handleDuplicateScreen = (screenId: string) => {
    const screen = project.screens.find(s => s.id === screenId);
    if (!screen) return;
    const id = `scr_${Date.now()}`;
    const duplicated: AppStudioScreen = {
      ...screen,
      id,
      titleAr: `${screen.titleAr} (نسخة)`,
      slug: `${screen.slug}-copy`,
      fields: screen.fields.map(f => ({ ...f, id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 4)}` }))
    };
    updateProjectWithHistory(p => ({
      ...p,
      screens: [...p.screens, duplicated],
      activeScreenId: id
    }));
    showToast('تم تكرار الشاشة بنجاح 📱', 'success');
  };

  const handleDeleteScreen = (screenId: string) => {
    if (project.screens.length <= 1) {
      showToast('لا يمكن حذف الشاشة الوحيدة المتبقية في التطبيق', 'error');
      return;
    }
    const remaining = project.screens.filter(s => s.id !== screenId);
    updateProjectWithHistory(p => ({
      ...p,
      screens: remaining,
      activeScreenId: remaining[0].id
    }));
    setSelectedFieldId(null);
    showToast('تم حذف الشاشة بنجاح', 'info');
  };

  // AI Copilot Generator
  const handleAiGenerateComponent = (customPrompt?: string) => {
    const prompt = (customPrompt || aiPromptText).trim();
    if (!prompt) return;

    setIsAiGenerating(true);
    const timestamp = Date.now();

    // Domain Store Generators
    if (prompt.includes('قهوة') || prompt.includes('محمصة') || prompt.includes('باريستا') || prompt.includes('coffee')) {
      const preset = ARCHETYPE_PRESETS.coffee_roastery;
      updateProjectWithHistory(p => ({
        ...p,
        archetype: 'coffee_roastery',
        nameAr: preset.nameAr,
        descriptionAr: preset.descriptionAr,
        screens: preset.screens,
        activeScreenId: preset.screens[0].id,
        theme: {
          ...p.theme,
          primaryColor: '#F59E0B',
          fontFamily: 'Cairo'
        }
      }));
      showToast('قام الذكاء الاصطناعي ببناء وهندسة متجر القهوة المختصة والسبيرشالتي بالكامل! ☕✨', 'success');
    } else if (prompt.includes('عباية') || prompt.includes('أزياء') || prompt.includes('فاشن') || prompt.includes('boutique') || prompt.includes('فساتين')) {
      const preset = ARCHETYPE_PRESETS.fashion_boutique;
      updateProjectWithHistory(p => ({
        ...p,
        archetype: 'fashion_boutique',
        nameAr: preset.nameAr,
        descriptionAr: preset.descriptionAr,
        screens: preset.screens,
        activeScreenId: preset.screens[0].id,
        theme: {
          ...p.theme,
          primaryColor: '#FB7185',
          fontFamily: 'Cairo'
        }
      }));
      showToast('قام الذكاء الاصطناعي ببناء وهندسة بوتيك الأزياء والعبايات الملكية بالكامل! 👗✨', 'success');
    } else if (prompt.includes('إلكترونيات') || prompt.includes('أجهزة') || prompt.includes('تقنية') || prompt.includes('سماعات') || prompt.includes('gadgets')) {
      const preset = ARCHETYPE_PRESETS.electronics_gadgets;
      updateProjectWithHistory(p => ({
        ...p,
        archetype: 'electronics_gadgets',
        nameAr: preset.nameAr,
        descriptionAr: preset.descriptionAr,
        screens: preset.screens,
        activeScreenId: preset.screens[0].id,
        theme: {
          ...p.theme,
          primaryColor: '#38BDF8',
          fontFamily: 'IBM Plex Sans Arabic'
        }
      }));
      showToast('قام الذكاء الاصطناعي ببناء وهندسة متجر الإلكترونيات والأجهزة الذكية! 📱⚡', 'success');
    } else if (prompt.includes('تحويل') || prompt.includes('مبيعات') || prompt.includes('booster') || prompt.includes('سلة') || prompt.includes('fomo')) {
      // Conversion Booster Stack: Shipping Meter + Urgency Bar + Bundle + Reviews
      const boosterFields: AppStudioField[] = [
        {
          id: `f_boost_ship_${timestamp}`,
          type: 'free_shipping_meter',
          labelAr: 'شحن مجاني فوري وسريع عند إتمام الطلب الآن',
          value: { goal: 300, current: 220 },
          styling: { shadow: 'glow' }
        },
        {
          id: `f_boost_urgency_${timestamp}`,
          type: 'urgency_scarcity_bar',
          labelAr: 'طلب مرتفع جداً - متبقي قطع معدودة في المستودع',
          value: { viewersCount: 34, remainingStock: 3 },
          styling: { shadow: 'glow' }
        }
      ];
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...boosterFields, ...s.fields] } : s)
      }));
      showToast('تم تطبيق حزمة تعزيز التحويل والمبيعات (Conversion Booster) بنجاح! 🚀🔥', 'success');
    } else if (prompt.includes('عداد') || prompt.includes('رمضان') || prompt.includes('تخفيض') || prompt.includes('خصم')) {
      const timerField: AppStudioField = {
        id: `f_timer_${timestamp}`,
        type: 'countdown_timer',
        labelAr: 'عروض وتخفيضات شهر رمضان المبارك 🌙',
        value: { discountPercent: 35, targetDate: '2026-04-01' },
        styling: { shadow: 'glow' }
      };
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, timerField] } : s)
      }));
      setSelectedFieldId(timerField.id);
      showToast('قام الذكاء الاصطناعي ببناء شريط العداد التنازلي الحصري ⚡', 'success');
    } else if (prompt.includes('جملة') || prompt.includes('B2B') || prompt.includes('شركات') || prompt.includes('درزن')) {
      const b2bField: AppStudioField = {
        id: `f_b2b_${timestamp}`,
        type: 'b2b_wholesale_table',
        labelAr: 'جدول أسعار الجملة للشركات والكميات',
        value: {
          tiers: [
            { qty: '1 - 5 حبات (تجزئة)', price: 380, saving: 'سعر القطاعي' },
            { qty: '6 - 24 حبة (نصف درزن)', price: 320, saving: 'وفر 15%' },
            { qty: '25+ حبة (كرتون جملة)', price: 270, saving: 'وفر 29%' }
          ]
        },
        styling: { shadow: 'soft' }
      };
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, b2bField] } : s)
      }));
      setSelectedFieldId(b2bField.id);
      showToast('تمت هندسة جدول أسعار الجملة B2B بنجاح 📦', 'success');
    } else if (prompt.includes('تمارا') || prompt.includes('تابي') || prompt.includes('تقسيط') || prompt.includes('دفع')) {
      const tamaraField: AppStudioField = {
        id: `f_tamara_${timestamp}`,
        type: 'payment_slot',
        labelAr: 'بوابات تقسيط تمارا 4 دفعات بدون فوائد والدفع الفوري',
        styling: { shadow: 'glow' }
      };
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, tamaraField] } : s)
      }));
      setSelectedFieldId(tamaraField.id);
      showToast('تم بناء قسم بوابات التقسيط والدفع الفوري 💳', 'success');
    } else if (prompt.includes('فاتورة') || prompt.includes('زكاة') || prompt.includes('ZATCA') || prompt.includes('QR')) {
      const zatcaField: AppStudioField = {
        id: `f_zatca_${timestamp}`,
        type: 'invoice_summary',
        labelAr: 'فاتورة ضريبية مبسطة معتمدة (ZATCA Phase 2)',
        styling: { shadow: 'glow' }
      };
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, zatcaField] } : s)
      }));
      setSelectedFieldId(zatcaField.id);
      showToast('تم إنشاء ملخص الفاتورة الضريبية ZATCA المعتمد 🧾', 'success');
    } else {
      const customField: AppStudioField = {
        id: `f_ai_custom_${timestamp}`,
        type: 'product_card',
        labelAr: prompt.slice(0, 45),
        placeholderAr: 'مكون تم تصميمه وهيكلته آلياً بالذكاء الاصطناعي مع ربط البيانات',
        value: {
          price: 290,
          originalPrice: 370,
          rating: 4.9,
          stock: 8,
          tag: 'موصى به',
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80'
        },
        styling: { shadow: 'soft' }
      };
      updateProjectWithHistory(p => ({
        ...p,
        screens: p.screens.map(s => s.id === p.activeScreenId ? { ...s, fields: [...s.fields, customField] } : s)
      }));
      setSelectedFieldId(customField.id);
      showToast('قام الذكاء الاصطناعي ببناء المكون بنجاح ✨', 'success');
    }

    setAiPromptText('');
    setIsAiGenerating(false);
  };

  // Bi-directional JSON AST Code Application
  const handleApplyJsonAst = () => {
    try {
      const parsed = JSON.parse(jsonAstInput);
      if (parsed && typeof parsed === 'object' && parsed.screens && Array.isArray(parsed.screens)) {
        updateProjectWithHistory(parsed);
        showToast('تم تطبيق شجرة JSON AST على المشروع فورياً! 🚀', 'success');
      } else {
        showToast('صيغة JSON غير صحيحة أو تفتقد مصفوفة الشاشات', 'error');
      }
    } catch (e: any) {
      showToast(`خطأ في معالجة JSON: ${e.message}`, 'error');
    }
  };

  // ZIP Package Downloader
  const handleDownloadZipPackage = async () => {
    setIsExportingZip(true);
    try {
      const blob = await exportNoCodeAppZip(project);
      triggerBlobDownload(blob, `${project.nameAr.replace(/\s+/g, '_')}_Production_Package.zip`);
      showToast('تم إنشاء وتنزيل حزمة الإنتاج الشاملة بنجاح! 📦', 'success');
    } catch (e: any) {
      showToast(`فشل تصدير الحزمة: ${e.message}`, 'error');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Code Generation for modal
  const getGeneratedCodeForPlatform = (platform: ExportTargetPlatform | 'backend' | 'json_ast') => {
    if (platform === 'backend') {
      return `/**
 * ====================================================================
 * خادم API متكامل وخلفية جاهزة للإنتاج (Node.js + Express + ZATCA Engine)
 * التطبيق: ${project.nameAr}
 * الدولة: ${currentCountry.nameAr} | العملة: ${project.currencySymbol}
 * ====================================================================
 */

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// محرك توليد الفواتير المشفرة ZATCA TLV Base64
function generateZatcaQR(sellerName, vatNumber, timestamp, totalWithVat, vatAmount) {
  const getTLV = (tag, value) => {
    const valBuf = Buffer.from(value, 'utf8');
    const tagBuf = Buffer.from([tag]);
    const lenBuf = Buffer.from([valBuf.length]);
    return Buffer.concat([tagBuf, lenBuf, valBuf]);
  };
  const qrBuffer = Buffer.concat([
    getTLV(1, sellerName),
    getTLV(2, vatNumber),
    getTLV(3, timestamp),
    getTLV(4, totalWithVat.toString()),
    getTLV(5, vatAmount.toString())
  ]);
  return qrBuffer.toString('base64');
}

// مسار صحة الخادم
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', app: '${project.nameAr}', currency: '${project.currencySymbol}' });
});

// مسار إصدار فاتورة ZATCA
app.post('/api/invoices/zatca', (req, res) => {
  const { amount = 380, vatRate = ${project.taxRate} } = req.body;
  const vat = (amount * vatRate) / 100;
  const total = amount + vat;
  const qrBase64 = generateZatcaQR('${project.nameAr}', '310984726100003', new Date().toISOString(), total.toFixed(2), vat.toFixed(2));
  
  res.json({
    invoiceNumber: 'INV-' + Date.now(),
    seller: '${project.nameAr}',
    vatNumber: '310984726100003',
    subtotal: amount,
    vatAmount: vat,
    total: total,
    currency: '${project.currencySymbol}',
    qrCodeTLVBase64: qrBase64
  });
});

app.listen(PORT, () => {
  console.log('⚡ CommerceOS Backend Server running on port ' + PORT);
});`;
    } else if (platform === 'json_ast') {
      return jsonAstInput;
    } else if (platform === 'web') {
      return NoCodeCodeGenerator.generateReactWebCode(project);
    } else if (platform === 'android') {
      return NoCodeCodeGenerator.generateAndroidKotlinCode(project);
    } else if (platform === 'ios') {
      return NoCodeCodeGenerator.generateIosSwiftCode(project);
    } else if (platform === 'windows') {
      return NoCodeCodeGenerator.generateWindowsDesktopCode(project);
    } else {
      return NoCodeCodeGenerator.generateReadmeGuide(project);
    }
  };

  // Live Store Publisher
  const handlePublishToLiveStore = () => {
    updateTheme(activeTenant.id, {
      ...activeTenant.theme,
      name: project.nameAr,
      primaryColor: project.theme.primaryColor,
      backgroundColor: project.theme.backgroundColor,
      textColor: project.theme.textColor,
      fontFamily: project.theme.fontFamily,
      isDarkMode: project.theme.isDarkMode,
      tokens: {
        ...activeTenant.theme.tokens,
        primary: project.theme.primaryColor,
        background: project.theme.backgroundColor,
        surface: project.theme.isDarkMode ? '#0E1726' : '#FFFFFF',
        surfaceMuted: project.theme.isDarkMode ? '#131F33' : '#F8FAFC',
        text: project.theme.textColor,
        border: project.theme.isDarkMode ? '#23334D' : '#E2E8F0',
      }
    });
    updateTenant(activeTenant.id, {
      name: project.nameAr,
      storeName: project.nameAr,
      slogan: project.descriptionAr,
      description: project.descriptionAr,
      currency: project.currencyCode,
      currencySymbol: project.currencySymbol
    });
    showToast('تم نشر وتطبيق كافة التعديلات على المتجر الإلكتروني الحي بنجاح! 🚀', 'success');
  };

  return (
    <div className="min-h-screen bg-[#060A11] text-[#F1F5F9] font-sans pb-16 selection:bg-amber-400 selection:text-slate-950 flex flex-col">
      
      {/* TOAST FLOATING NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0A101C] border border-amber-400/50 shadow-2xl text-xs font-bold text-white animate-in fade-in slide-in-from-top-4 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. TOP MASTER APP BAR */}
      <header className="sticky top-0 z-40 bg-[#0A101C]/95 backdrop-blur-2xl border-b border-[#1E293B] px-6 py-3 shadow-xl">
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Project Identity & Undo / Redo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentView('merchant_dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700/50"
              title="العودة إلى لوحة تحكم التاجر"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-0" />
              <span className="hidden sm:inline">لوحة التحكم</span>
            </button>

            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 text-base">
              ✨
            </div>

            <div>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  value={project.nameAr}
                  onChange={e => updateProjectWithHistory(p => ({ ...p, nameAr: e.target.value }))}
                  className="bg-transparent text-sm sm:text-base font-black text-white hover:text-amber-400 focus:text-amber-400 border-b border-dashed border-white/20 hover:border-amber-400 focus:border-amber-400 focus:outline-none px-1 transition-colors"
                />
                <span className="text-[9px] bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                  Studio Pro
                </span>

                {/* Project Selector & Multi-tenant Switching */}
                <select
                  value={activeTenantId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setActiveTenantId(newId);
                    const selectedT = tenants.find(t => t.id === newId);
                    if (selectedT) {
                      updateProjectWithHistory(p => ({
                        ...p,
                        nameAr: selectedT.name,
                        nameEn: selectedT.nameEn || selectedT.name
                      }));
                      showToast(`تم التبديل إلى مشروع: ${selectedT.name} 🔄`, 'success');
                    }
                  }}
                  className="bg-[#10192B] text-slate-300 hover:text-white text-xs font-bold border border-[#1E2E48] rounded-xl px-2 py-1 focus:outline-none focus:border-amber-400 cursor-pointer hidden md:inline-block"
                  title="تبديل مشروع المتجر النشط"
                >
                  {tenants.map((t, idx) => (
                    <option key={`studio-tenant-${t.id}-${idx}`} value={t.id} className="bg-[#0B1422] text-white">
                      {t.name}
                    </option>
                  ))}
                </select>

                {/* Clone Project Button */}
                <button
                  onClick={async () => {
                    if (cloneTenant) {
                      const cloned = await cloneTenant(activeTenantId);
                      updateProjectWithHistory(p => ({
                        ...p,
                        id: `app_${Date.now()}`,
                        nameAr: cloned.name
                      }));
                    }
                  }}
                  className="p-1 rounded-lg bg-[#10192B] hover:bg-[#1A2840] border border-[#1E2E48] text-slate-400 hover:text-amber-400 transition-colors hidden sm:inline-flex"
                  title="استنساخ المشروع الحالي"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Undo / Redo Controls */}
            <div className="flex items-center bg-[#10192B] border border-[#1E2E48] rounded-xl p-0.5 gap-0.5 mr-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-all"
                title="تراجع (Ctrl+Z)"
              >
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-20 transition-all"
                title="إعادة (Ctrl+Y)"
              >
                <Redo2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Tools: View Mode Switcher, Country Selector & Device Frame */}
          <div className="flex items-center gap-3">
            
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#10192B] border border-[#1E2E48] rounded-xl p-1 gap-1">
              <button
                onClick={() => setStudioMode('canvas')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  studioMode === 'canvas'
                    ? 'bg-amber-400 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                <span>محرر التصميم</span>
              </button>

              <button
                onClick={() => setStudioMode('simulator')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  studioMode === 'simulator'
                    ? 'bg-amber-400 text-slate-950 font-black shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>المعاينة التفاعلية</span>
              </button>
            </div>

            {/* Country Selector */}
            <div className="flex items-center gap-1 bg-[#10192B] border border-[#1E2E48] rounded-xl px-2.5 py-1.5 text-xs">
              <span className="text-base">{currentCountry.flag}</span>
              <select
                value={project.countryCode}
                onChange={e => {
                  const c = ARAB_COUNTRIES.find(item => item.code === e.target.value);
                  if (c) handleSelectCountry(c);
                }}
                className="bg-transparent text-slate-200 text-xs font-bold focus:outline-none cursor-pointer"
              >
                {ARAB_COUNTRIES.map(c => (
                  <option key={c.code} value={c.code} className="bg-[#0A101C] text-white">
                    {c.nameAr} ({c.currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Device Frame Switcher */}
            <div className="flex items-center bg-[#10192B] border border-[#1E2E48] rounded-xl p-0.5 gap-0.5">
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  device === 'mobile' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="جوال (iPhone 16 Pro)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  device === 'tablet' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="تابلت (iPad Pro)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                  device === 'desktop' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="كمبيوتر وموقع ويب (Desktop)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Hub: Publish, Code & ZIP */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePublishToLiveStore}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>نشر على المتجر الحي</span>
            </button>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#10192B] hover:bg-[#18263F] text-white border border-[#1E2E48]"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>فحص الكود</span>
            </button>

            <button
              onClick={handleDownloadZipPackage}
              disabled={isExportingZip}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {isExportingZip ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
              <span>تحميل (.ZIP)</span>
            </button>
          </div>

        </div>
      </header>

      {/* 2. ARCHETYPE PRESET PICKER STRIP */}
      <div className="max-w-[1700px] mx-auto px-6 mt-4 w-full">
        <div className="p-3 rounded-2xl bg-[#0A101C] border border-[#1E2E48] flex flex-wrap items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>نماذج التطبيقات الجاهزة بضغطة زر:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(Object.keys(ARCHETYPE_PRESETS) as AppArchetype[]).map(archKey => {
              const item = ARCHETYPE_PRESETS[archKey];
              const isSelected = project.archetype === archKey;
              return (
                <button
                  key={archKey}
                  onClick={() => handleSelectArchetype(archKey)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md shadow-amber-500/20 scale-105'
                      : 'bg-[#10192B] text-slate-300 hover:text-white border border-[#1E2E48] hover:border-slate-600'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.nameAr.split(' ')[0]} {item.nameAr.split(' ')[1] || ''}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE 3-PANE LAYOUT */}
      <main className="max-w-[1700px] mx-auto px-6 mt-4 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT PANE: RESOURCE & TOOL HUB (3 COLS) */}
        <div className="lg:col-span-3 h-[calc(100vh-140px)] min-h-[720px]">
          <StudioLeftSidebar
            project={project}
            setProject={updateProjectWithHistory}
            activeScreen={activeScreen}
            selectedFieldId={selectedFieldId}
            setSelectedFieldId={setSelectedFieldId}
            handleAddField={handleAddField}
            handleDeleteField={handleDeleteField}
            handleMoveField={handleMoveField}
            handleDuplicateField={handleDuplicateField}
            handleAddScreen={handleAddScreen}
            handleDuplicateScreen={handleDuplicateScreen}
            handleDeleteScreen={handleDeleteScreen}
            handleAiGenerateComponent={handleAiGenerateComponent}
            aiPromptText={aiPromptText}
            setAiPromptText={setAiPromptText}
            isAiGenerating={isAiGenerating}
            showToast={showToast}
          />
        </div>

        {/* CENTER PANE: INTERACTIVE CANVAS / SIMULATOR (6 COLS) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-start min-h-[720px] space-y-3">
          
          {/* AI COPILOT SUPER BAR (DIRECT 1-CLICK GENERATOR) */}
          <div className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0E1726] to-purple-500/10 border border-amber-500/30 shadow-lg space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={aiPromptText}
                onChange={e => setAiPromptText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleAiGenerateComponent();
                  }
                }}
                placeholder="اكتب فكرة متجرك أو المكون المطلوب (مثال: متجر قهوة مختصة، بوتيك عبايات، باقة زيادة المبيعات)..."
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() => handleAiGenerateComponent()}
                disabled={isAiGenerating || !aiPromptText.trim()}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1 shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-40"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">توليد فوري</span>
              </button>
            </div>

            {/* Quick 1-Click Action Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[10px]">
              <span className="text-slate-400 font-bold whitespace-nowrap">اقتراحات سريعة:</span>
              {[
                { label: '🚀 حزمة زيادة التحويل (FOMO)', prompt: 'حزمة زيادة التحويل والمبيعات' },
                { label: '☕ متجر قهوة مختصة', prompt: 'متجر قهوة مختصة' },
                { label: '👗 بوتيك عبايات فاخرة', prompt: 'بوتيك عبايات وأزياء' },
                { label: '📱 متجر إلكترونيات Pro', prompt: 'متجر إلكترونيات وأجهزة' },
                { label: '🌙 عداد عروض رمضان 35%', prompt: 'عداد عروض رمضان' },
                { label: '💳 تقسيط تمارا 4 دفعات', prompt: 'تقسيط تمارا 4 دفعات' },
                { label: '🧾 فاتورة ZATCA Phase 2', prompt: 'فاتورة ZATCA Phase 2' }
              ].map((chip, cIdx) => (
                <button
                  key={cIdx}
                  type="button"
                  onClick={() => handleAiGenerateComponent(chip.prompt)}
                  className="px-2.5 py-1 rounded-lg bg-black/30 hover:bg-amber-400/20 text-slate-300 hover:text-amber-300 border border-white/5 hover:border-amber-400/40 font-bold whitespace-nowrap transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Floating Quick Controls (Zoom, Grid, Orientation & Stats) */}
          <div className="w-full flex items-center justify-between px-3 py-2 rounded-2xl bg-[#0A101C] border border-[#1E2E48] text-xs text-slate-300 shadow-md">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#10192B] border border-[#1E2E48] rounded-xl p-0.5">
              {[50, 75, 100, 125].map(z => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    zoom === z ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {z}%
                </button>
              ))}
            </div>

            {/* Grid & Alignment Guides Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                  showGrid
                    ? 'bg-amber-400/10 text-amber-300 border-amber-500/30'
                    : 'bg-[#10192B] text-slate-400 border-[#1E2E48]'
                }`}
                title="إظهار/إخفاء شبكة المحاذاة الدقيقة"
              >
                <Grid className="w-3 h-3" />
                <span>الشبكة</span>
              </button>

              <button
                onClick={() => setIsLandscape(!isLandscape)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
                  isLandscape
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-[#10192B] text-slate-400 border-[#1E2E48]'
                }`}
                title="تدوير الشاشة أفقي / رأسي"
              >
                <RefreshCw className={`w-3 h-3 ${isLandscape ? 'rotate-90' : ''}`} />
                <span>{isLandscape ? 'أفقي' : 'رأسي'}</span>
              </button>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">Ctrl+Z تراجع</span>
              <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded">Ctrl+D تكرار</span>
            </div>
          </div>

          <div 
            className={`w-full transition-all duration-300 mx-auto ${
              isLandscape 
                ? 'max-w-[720px]' 
                : device === 'mobile' ? 'max-w-[390px]' :
                  device === 'tablet' ? 'max-w-[560px]' : 'max-w-[760px]'
            }`}
          >
            {studioMode === 'canvas' ? (
              <StudioCanvas
                project={project}
                activeScreen={activeScreen}
                selectedFieldId={selectedFieldId}
                setSelectedFieldId={setSelectedFieldId}
                handleMoveField={handleMoveField}
                handleDuplicateField={handleDuplicateField}
                handleDeleteField={handleDeleteField}
                handleAddField={handleAddField}
                device={device}
                zoom={zoom}
                showGrid={showGrid}
                isLandscape={isLandscape}
                showToast={showToast}
              />
            ) : (
              <StudioLiveSimulator
                project={project}
                activeScreen={activeScreen}
                onNavigateScreen={id => updateProjectWithHistory(p => ({ ...p, activeScreenId: id }))}
                onOpenTamaraModal={() => setIsTamaraModalOpen(true)}
                onOpenZatcaModal={() => setIsZatcaModalOpen(true)}
                showToast={showToast}
              />
            )}
          </div>

        </div>

        {/* RIGHT PANE: DEDICATED PROPERTY INSPECTOR (3 COLS) */}
        <div className="lg:col-span-3 h-[calc(100vh-140px)] min-h-[720px]">
          <StudioPropertyInspector
            selectedField={selectedField}
            onClose={() => setSelectedFieldId(null)}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
            onDuplicateField={handleDuplicateField}
            project={project}
            showToast={showToast}
          />
        </div>

      </main>

      {/* 4. UNIFIED PRO MODALS */}
      <StudioModals
        isCodeModalOpen={isCodeModalOpen}
        setIsCodeModalOpen={setIsCodeModalOpen}
        codePlatform={codePlatform}
        setCodePlatform={setCodePlatform}
        getGeneratedCodeForPlatform={getGeneratedCodeForPlatform}
        jsonAstInput={jsonAstInput}
        setJsonAstInput={setJsonAstInput}
        handleApplyJsonAst={handleApplyJsonAst}
        handleDownloadZipPackage={handleDownloadZipPackage}
        isExportingZip={isExportingZip}
        isTamaraModalOpen={isTamaraModalOpen}
        setIsTamaraModalOpen={setIsTamaraModalOpen}
        isZatcaModalOpen={isZatcaModalOpen}
        setIsZatcaModalOpen={setIsZatcaModalOpen}
        project={project}
        showToast={showToast}
      />

    </div>
  );
};
