import { ArabCountry } from '../data/arabCountries';

export type AppArchetype = 
  | 'store'                // متجر ومحل إلكتروني عام
  | 'coffee_roastery'      // محمصة القهوة المختصة والسبيرشالتي
  | 'fashion_boutique'     // بوتيك العبايات والأزياء الفاخرة
  | 'electronics_gadgets'  // متجر الإلكترونيات والأجهزة الذكية
  | 'b2b_wholesale'        // مركز تجارة الجملة والتوريد B2B
  | 'ledger_debt'          // دفتر الحسابات ودائن ومدين
  | 'expenses_tracker'     // تطبيق المصروفات والميزانية
  | 'pos_invoicing'        // تطبيق الدفع والفواتير والكاشير
  | 'services_booking'     // خدمات وحجوزات
  | 'custom_canvas';       // تطبيق مخصص بالكامل من الصفر

export type ExportTargetPlatform = 'web' | 'android' | 'ios' | 'windows' | 'all' | 'security_audit';

export interface AppStudioActionTrigger {
  type: 
    | 'navigate'          // الانتقال لشاشة أخرى
    | 'whatsapp'          // فتح محادثة واتساب مع تفاصيل
    | 'tamara'            // حاسبة وبوابة تمارا 4 دفعات
    | 'tabby'             // حاسبة وبوابة تابي
    | 'zatca_qr'          // إظهار فاتورة ZATCA والباركود
    | 'print_zatca'       // طباعة فاتورة ZATCA المشفرة
    | 'ledger_entry'      // تسجيل وترحيل قيد في السجل المالي
    | 'add_debt'          // تسجيل قيد فوري في سجل الديون
    | 'confetti'          // تأثير احتفالي وإشعار نجاح
    | 'custom_api';       // استدعاء Webhook / API
  targetScreenId?: string;
  payload?: any;
}

export interface AppStudioField {
  id: string;
  type: 
    | 'text'                     // نص عادي
    | 'heading'                  // عنوان
    | 'number'                   // حقل أرقام
    | 'currency_amount'          // مبلغ مالي مع العملة
    | 'debt_credit_card'         // بطاقة دائن ومدين (له / عليه)
    | 'ledger_table'             // جدول قيود محاسبي
    | 'product_card'             // بطاقة منتج / خدمة
    | 'product_grid'             // شبكة منتجات
    | 'expense_entry'            // بند مصروف مع الفئة
    | 'invoice_summary'          // ملخص فاتورة وحساب ضريبة
    | 'payment_slot'             // خانة دفع فوري (مدى، أبل باي...)
    | 'image_banner'             // صورة أو شعار
    | 'button'                   // زر إجراء (CTA)
    | 'stat_card'                // بطاقة إحصائيات وأرقام
    | 'dropdown'                 // قائمة منسدلة
    | 'checkbox'                 // مربع اختيار
    | 'countdown_timer'          // شريط عداد تنازلي للعروض
    | 'b2b_wholesale_table'      // جدول أسعار الجملة للشركات
    | 'reviews_wall'             // حائط تقييمات العملاء الموثقة
    | 'custom_engraving'         // حقل تخصيص الحفر بالليزر
    | 'faq_accordion'            // قائمة الأسئلة الشائعة القابلة للطي
    | 'urgency_scarcity_bar'      // شريط نفاد المخزون والزوار المباشرين
    | 'frequently_bought_together'// حزمة اشتري معاً ووفر (Bundles)
    | 'free_shipping_meter'      // عداد الشحن المجاني التفاعلي
    | 'variant_selector'         // محدد المقاسات والألوان والروائح (Swatches)
    | 'tiered_quantity_discount' // عروض باقات الكميات (اشتر أكثر ووفر)
    | 'trust_badges'             // شارات التوثيق، معروف، والضمان الذهبي
    | 'coupon_box'               // خانة كوبون الخصم التفاعلية
    | 'delivery_estimator'       // حاسبة موعد التوصيل ومواقع الاستلام
    | 'video_reel_card'          // ريلز وفيديو المنتج التفاعلي مع شراء مباشر
    | 'before_after_slider'      // مقارنة قبل وبعد التفاعلية
    | 'specs_table'              // جدول المواصفات الفنية والمكونات
    | 'loyalty_rewards_card'     // بطاقة نقاط المكافآت ورصيد المحفظة
    | 'sticky_buy_bar'           // شريط الشراء السريع المثبت أسفل الشاشة
    | 'personalized_gift_upload';// تخصيص الهدايا ورفع الصور وبطاقة إهداء
  labelAr: string;
  labelEn?: string;
  placeholderAr?: string;
  value?: any;
  options?: string[];
  actionTrigger?: AppStudioActionTrigger;
  styling?: {
    align?: 'start' | 'center' | 'end';
    colorScheme?: string;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
    isBold?: boolean;
    shadow?: 'none' | 'soft' | 'glow' | 'glass';
    borderStyle?: 'solid' | 'dashed' | 'gradient';
    padding?: 'compact' | 'normal' | 'spacious';
    colSpan?: 1 | 2 | 3;
    badge?: string;
  };
}

export interface AppStudioScreen {
  id: string;
  titleAr: string;
  titleEn: string;
  slug?: string;
  iconName?: string;
  fields: AppStudioField[];
  isInitialScreen?: boolean;
}

export interface PaymentSlotConfig {
  providerId: string;
  enabled: boolean;
  environment: 'sandbox' | 'live';
  keys: Record<string, string>; // e.g. { api_key: '', secret_key: '', merchant_id: '' }
  verified: boolean;
  lastCheckedAt?: string;
}

export interface NoCodeAppProject {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  archetype: AppArchetype;
  countryCode: string;
  currencyCode: string;
  currencySymbol: string;
  taxRate: number;
  
  // Theme & Styling
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string; // 'tajawal' | 'cairo' | 'almarai' | 'amiri' | 'dubai'
    borderRadius: 'sharp' | 'curved' | 'pill';
    isDarkMode: boolean;
    logoUrl: string;
  };

  // Multiple screens / pages
  screens: AppStudioScreen[];
  activeScreenId: string;

  // Payments & APIs
  payments: PaymentSlotConfig[];

  // Target platforms for code generation
  selectedExportPlatforms: ExportTargetPlatform[];

  // Created & Updated
  updatedAt: string;
}
