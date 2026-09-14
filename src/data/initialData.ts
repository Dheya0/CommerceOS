import { 
  Category, 
  Coupon, 
  Customer, 
  Order, 
  Product, 
  StaffMember, 
  SubscriptionPlan, 
  TenantStore,
  DebtRecord,
  ExpenseRecord
} from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'starter',
    name: 'Starter Plan',
    nameAr: 'الباقة الأساسية',
    price: 199,
    billingCycle: 'monthly',
    limits: {
      products: 100,
      staff: 2,
      themes: 'Standard',
      customDomain: false,
      analytics: 'basic',
      api: false,
      whiteLabel: false
    }
  },
  {
    id: 'business',
    name: 'Business Plan',
    nameAr: 'باقة الأعمال',
    price: 499,
    billingCycle: 'monthly',
    limits: {
      products: 1000,
      staff: 6,
      themes: 'Full Library',
      customDomain: true,
      analytics: 'advanced',
      api: false,
      whiteLabel: false
    }
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    nameAr: 'الباقة الاحترافية',
    price: 899,
    billingCycle: 'monthly',
    limits: {
      products: -1, // unlimited
      staff: 16,
      themes: 'Premium & Custom',
      customDomain: true,
      analytics: 'advanced',
      api: true,
      whiteLabel: true
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    nameAr: 'باقة المؤسسات',
    price: 1899,
    billingCycle: 'monthly',
    limits: {
      products: -1,
      staff: 50,
      themes: 'Bespoke Custom',
      customDomain: true,
      analytics: 'advanced',
      api: true,
      whiteLabel: true
    }
  }
];

// 1. Initial Luxury Arab Tenant Stores
export const INITIAL_TENANTS: TenantStore[] = [
  {
    id: 'store-royal-honey-oud',
    name: 'قصر السدر والعود الملكي',
    nameEn: 'Palace of Sidr & Royal Oud',
    slug: 'royal-sidr-oud',
    description: 'المتجر الرائد في إنتاج أجود أنواع عسل السدر الدوعني الأصيل ودهن العود الكمبودي الملكي المعتمد مخبرياً.',
    descriptionEn: 'The leading purveyor of genuine Doani Sidr honey and royal vintage Cambodi agarwood oil.',
    businessType: 'honey',
    logo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Crown',
    slogan: 'فخامة التراث وعبير الأصالة العربية',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310982345600003',
    status: 'active',
    plan: 'enterprise',
    theme: {
      style: 'luxury',
      layout: 'modern',
      fontFamily: 'tajawal',
      radius: 'lg',
      shadow: 'soft',
      headerStyle: 'island_blur',
      heroStyle: 'cinematic',
      cardStyle: 'elevated',
      buttonStyle: 'glow',
      darkMode: true,
      heroBannerImage: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&auto=format&fit=crop&q=85',
      announcementBar: {
        enabled: true,
        text: '✨ شحن ملكي مجاني لكافة مدن المملكة للطلبات فوق 300 ر.س مع كود خصم ROYAL20',
        textEn: 'Free express shipping on orders over 300 SAR with code ROYAL20',
        bgColor: '#101B2C',
        textColor: '#C9A45C'
      },
      tokens: {
        primary: '#C9A45C',
        primaryHover: '#B8934A',
        primaryLight: '#E0C078',
        primaryDark: '#8F6E28',
        secondary: '#0B1422',
        accent: '#D4AF37',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#F4F6F8',
        textMuted: '#97A4B5',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    },
    quotas: {
      maxProducts: 1000,
      maxStaff: 20,
      maxMonthlyBuilds: 50,
      usedMonthlyBuilds: 2,
      allowCustomDomain: true,
      allowDockerSelfHost: true,
      allowNativeIosAndroid: true,
      storageQuotaMb: 50000,
      usedStorageMb: 120
    }
  },
  {
    id: 'store-al-areej-coffee',
    name: 'محمصة الأريج للقهوة المختصة',
    nameEn: 'Al-Areej Specialty Coffee Roastery',
    slug: 'al-areej-coffee',
    description: 'محاصيل بن مختصة منتقاة من أرقى مزارع إثيوبيا وكولومبيا واليمن، محمصة بحرفية عالية تليق بذائقتك.',
    descriptionEn: 'Single origin specialty coffee beans roasted to perfection from Ethiopia, Colombia, and Yemen.',
    businessType: 'coffee',
    logo: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Coffee',
    slogan: 'كل رشفة تحكي قصة أصالة واحتراف',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '311452987100003',
    status: 'active',
    plan: 'pro',
    theme: {
      style: 'modern',
      layout: 'bento',
      fontFamily: 'ibm_plex',
      radius: 'md',
      shadow: 'subtle',
      headerStyle: 'floating',
      heroStyle: 'split',
      cardStyle: 'bordered',
      buttonStyle: 'solid',
      darkMode: true,
      heroBannerImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&auto=format&fit=crop&q=85',
      announcementBar: {
        enabled: true,
        text: '☕ تذوق محصول اليمن حراز الطبيعي الجديد - متوفر بكميات محدودة',
        textEn: 'Taste our new Yemen Haraz specialty micro-lot - limited edition',
        bgColor: '#161F2E',
        textColor: '#E5A93C'
      },
      tokens: {
        primary: '#E5A93C',
        primaryHover: '#C98F27',
        primaryLight: '#F5C672',
        primaryDark: '#9E6D14',
        secondary: '#1A1412',
        accent: '#D97706',
        background: '#090D14',
        surface: '#111827',
        surfaceMuted: '#1F2937',
        text: '#F9FAFB',
        textMuted: '#9CA3AF',
        border: '#374151',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  {
    id: 'store-wholesale-hub',
    name: 'مجموعة الراقي لتجارة الجملة والتجزئة',
    nameEn: 'Al-Raqi Wholesale & Retail Group',
    slug: 'alraqi-wholesale',
    description: 'المورد الشامل لكبرى المحلات والشركات، أسعار جملة تنافسية وتوريد مباشر مع إمكانية الشراء بالكرتون والدرزن.',
    descriptionEn: 'Comprehensive B2B wholesale and retail hub with tiered bulk volume pricing.',
    businessType: 'wholesale',
    logo: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Package',
    slogan: 'شريكك الموثوق في تجارة الجملة والتوريد',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310893452100003',
    status: 'active',
    plan: 'enterprise',
    theme: {
      style: 'modern',
      layout: 'bento',
      fontFamily: 'cairo',
      radius: 'md',
      shadow: 'subtle',
      headerStyle: 'solid',
      heroStyle: 'split',
      cardStyle: 'bordered',
      buttonStyle: 'solid',
      darkMode: true,
      tokens: {
        primary: '#3B82F6',
        primaryHover: '#2563EB',
        primaryLight: '#60A5FA',
        primaryDark: '#1D4ED8',
        secondary: '#0F172A',
        accent: '#F59E0B',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  {
    id: 'store-apex-tech',
    name: 'القمة للإلكترونيات والأجهزة الذكية',
    nameEn: 'Apex Electronics & Smart Devices',
    slug: 'apex-electronics',
    description: 'أحدث الهواتف الذكية والأجهزة اللوحية والحواسيب مع ضمان محلي معتمد سنتين وتتبع فوري للأرقام التسلسلية.',
    descriptionEn: 'Cutting edge electronics, laptops and smartphones with 2-year warranty and serial tracking.',
    businessType: 'electronics',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Cpu',
    slogan: 'عالم التقنية بين يديك',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310992384100003',
    status: 'active',
    plan: 'pro',
    theme: {
      style: 'modern',
      layout: 'bento',
      fontFamily: 'alexandria',
      radius: 'lg',
      shadow: 'soft',
      headerStyle: 'floating',
      heroStyle: 'cinematic',
      cardStyle: 'elevated',
      buttonStyle: 'glow',
      darkMode: true,
      tokens: {
        primary: '#A855F7',
        primaryHover: '#9333EA',
        primaryLight: '#C084FC',
        primaryDark: '#7E22CE',
        secondary: '#0F172A',
        accent: '#06B6D4',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#F8FAFC',
        textMuted: '#94A3B8',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  {
    id: 'store-elegance-jewelry',
    name: 'دار الأناقة للمجوهرات والإكسسوارات',
    nameEn: 'Elegance Fine Jewelry & Accessories',
    slug: 'elegance-jewelry',
    description: 'إكسسوارات ومجوهرات مصاغة بحرفية عالية مع خيارات الحفر بالليزر وتغليف الهدايا الملكي المخملي.',
    descriptionEn: 'Luxury jewelry, watches, accessories with custom engraving and gift wrapping.',
    businessType: 'accessories',
    logo: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Gem',
    slogan: 'لمسة من السحر والأناقة الخالدة',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310771239800003',
    status: 'active',
    plan: 'enterprise',
    theme: {
      style: 'luxury',
      layout: 'editorial',
      fontFamily: 'el_messiri',
      radius: 'lg',
      shadow: 'soft',
      headerStyle: 'island_blur',
      heroStyle: 'cinematic',
      cardStyle: 'elevated',
      buttonStyle: 'glow',
      darkMode: true,
      tokens: {
        primary: '#F59E0B',
        primaryHover: '#D97706',
        primaryLight: '#FCD34D',
        primaryDark: '#B45309',
        secondary: '#0F172A',
        accent: '#D4AF37',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#FDF8F0',
        textMuted: '#9CA3AF',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  {
    id: 'store-velvet-fashion',
    name: 'دار المخمل للأزياء والملابس الفاخرة',
    nameEn: 'Velvet Haute Couture & Apparel',
    slug: 'velvet-fashion',
    description: 'أرقى خطوط الموضة والأزياء الخليجية والعالمية، خامات متميزة ودليل قياسات دقيق لكافة المقاسات.',
    descriptionEn: 'Haute couture fashion, luxury apparel and curated seasonal collections.',
    businessType: 'fashion',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Shirt',
    slogan: 'أناقتك عنوان تميزك',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310665431200003',
    status: 'active',
    plan: 'pro',
    theme: {
      style: 'editorial',
      layout: 'editorial',
      fontFamily: 'playfair',
      radius: 'sm',
      shadow: 'subtle',
      headerStyle: 'centered_logo',
      heroStyle: 'split',
      cardStyle: 'minimal',
      buttonStyle: 'solid',
      darkMode: true,
      tokens: {
        primary: '#FB7185',
        primaryHover: '#F43F5E',
        primaryLight: '#FDA4AF',
        primaryDark: '#E11D48',
        secondary: '#18181B',
        accent: '#E11D48',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#FFF1F2',
        textMuted: '#A1A1AA',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  },
  {
    id: 'store-oasis-beauty',
    name: 'واحة الجمال ومستحضرات التجميل والعطور',
    nameEn: 'Oasis Beauty, Cosmetics & Perfumes',
    slug: 'oasis-beauty',
    description: 'أفخم مستحضرات التجميل والعناية بالبشرة والعطور النيش المرخصة من هيئة الغذاء والدواء SFDA.',
    descriptionEn: 'SFDA certified luxury beauty products, skincare routines, and niche fragrances.',
    businessType: 'beauty',
    logo: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Sparkles',
    slogan: 'سر الجمال والإشراقة الطبيعية',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    country: 'SA',
    vatNumber: '310554329100003',
    status: 'active',
    plan: 'enterprise',
    theme: {
      style: 'luxury',
      layout: 'modern',
      fontFamily: 'tajawal',
      radius: 'lg',
      shadow: 'soft',
      headerStyle: 'island_blur',
      heroStyle: 'cinematic',
      cardStyle: 'elevated',
      buttonStyle: 'glow',
      darkMode: true,
      tokens: {
        primary: '#34D399',
        primaryHover: '#10B981',
        primaryLight: '#6EE7B7',
        primaryDark: '#059669',
        secondary: '#064E3B',
        accent: '#10B981',
        background: '#050B14',
        surface: '#0B1422',
        surfaceMuted: '#101B2C',
        text: '#ECFDF5',
        textMuted: '#9CA3AF',
        border: '#233247',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444'
      }
    }
  }
];

// 2. Initial Categories
export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-sidr-honey',
    tenantId: 'store-royal-honey-oud',
    name: 'عسل السدر الفاخر',
    nameEn: 'Sidr Honey',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'cat-royal-oud',
    tenantId: 'store-royal-honey-oud',
    name: 'العود وبخور الملوك',
    nameEn: 'Royal Oud & Incense',
    icon: 'Flame',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    productCount: 4
  },
  {
    id: 'cat-special-boxes',
    tenantId: 'store-royal-honey-oud',
    name: 'بكجات الإهداء الفاخرة',
    nameEn: 'Luxury Gift Sets',
    icon: 'Gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80',
    productCount: 3
  },
  {
    id: 'cat-safran-amber',
    tenantId: 'store-royal-honey-oud',
    name: 'الزعفران والعنبر الطبيعي',
    nameEn: 'Saffron & Natural Amber',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop&q=80',
    productCount: 2
  }
];

// 3. Initial Products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-sidr-doani-1kg',
    tenantId: 'store-royal-honey-oud',
    name: 'عسل سدر دوعني ملكي فاخر (1 كجم)',
    nameEn: 'Royal Doani Sidr Honey (1kg)',
    description: 'مستخرج من أودية دوعن العريقة، خام 100% غير مبستر ومفحوص مخبرياً بنسبة سكروز 0% وغني بمضادات الأكسدة والإنزيمات الطبيعية.',
    descriptionEn: 'Pure raw 100% natural Yemeni Doani Sidr honey, laboratory certified with rich aroma and therapeutic benefits.',
    categoryId: 'cat-sidr-honey',
    price: 380,
    comparePrice: 460,
    costPrice: 210,
    sku: 'HONEY-SIDR-01',
    barcode: '6281100990012',
    stock: 45,
    lowStockAlert: 8,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.95,
    reviewsCount: 128,
    isFeatured: true,
    isBestseller: true,
    weight: '1.0 kg',
    tags: ['عسل طبيعي', 'دوعني', 'أصلي', 'مفحوص مخبرياً'],
    variants: [
      { id: 'var-500g', name: 'نصف كيلو (500 جم)', price: 210, stock: 30, sku: 'HONEY-SIDR-500G' },
      { id: 'var-1kg', name: 'كيلو كامل (1 كجم)', price: 380, stock: 45, sku: 'HONEY-SIDR-1KG' },
      { id: 'var-2kg', name: 'عبوة التوفير (2 كجم)', price: 710, stock: 15, sku: 'HONEY-SIDR-2KG' }
    ]
  },
  {
    id: 'prod-oud-cambodi-vintage',
    tenantId: 'store-royal-honey-oud',
    name: 'دهن عود كمبودي ملكي معتق 25 عاماً (تولة)',
    nameEn: 'Aged Royal Cambodi Agarwood Oil (1 Tola)',
    description: 'دهن عود بيور نقي مستخلص من غابات كوه كونغ الكمبودية، معتق بأسلوب تقليدي ليعطيك ثباتاً يتجاوز 48 ساعة وفوحاناً مخملياً آسراً.',
    descriptionEn: 'Vintage aged pure Cambodi Oud oil extracted from old agarwood trees with remarkable longevity and sillage.',
    categoryId: 'cat-royal-oud',
    price: 650,
    comparePrice: 820,
    costPrice: 340,
    sku: 'OUD-CAMB-01',
    barcode: '6281100990029',
    stock: 22,
    lowStockAlert: 5,
    images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewsCount: 94,
    isFeatured: true,
    isBestseller: true,
    weight: '12 ml (1 Tola)',
    tags: ['دهن عود', 'كمبودي معتق', 'ملكي', 'ثبات عالي'],
    variants: [
      { id: 'var-quarter-tola', name: 'ربع تولة (3 مل)', price: 190, stock: 25, sku: 'OUD-CAMB-QTR' },
      { id: 'var-half-tola', name: 'نصف تولة (6 مل)', price: 350, stock: 18, sku: 'OUD-CAMB-HALF' },
      { id: 'var-full-tola', name: 'تولة كاملة (12 مل)', price: 650, stock: 22, sku: 'OUD-CAMB-FULL' }
    ]
  },
  {
    id: 'prod-royal-gift-box',
    tenantId: 'store-royal-honey-oud',
    name: 'صندوق الهيبة الملكي (سدر دوعني + تولة عود + زعفران)',
    nameEn: 'The Royal Prestige Gift Box Set',
    description: 'صندوق فاخر مبطن بالحرير والمخمل الملكي يحتوي على كيلو عسل سدر دوعني، تولة دهن عود كمبودي معتق، وجرامين من زعفران سوبر نقيل الفاخر.',
    descriptionEn: 'Ultra-luxury curated wooden box with premium honey, vintage oud oil, and Grade-A Super Negin saffron.',
    categoryId: 'cat-special-boxes',
    price: 1150,
    comparePrice: 1400,
    costPrice: 620,
    sku: 'GIFT-BOX-ROYAL',
    barcode: '6281100990036',
    stock: 14,
    lowStockAlert: 3,
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.98,
    reviewsCount: 67,
    isFeatured: true,
    isBestseller: true,
    weight: '2.5 kg',
    tags: ['بكج إهداء', 'فاخر', 'مناسبات خاصة', 'VIP']
  },
  {
    id: 'prod-super-negin-saffron',
    tenantId: 'store-royal-honey-oud',
    name: 'زعفران سوبر نقيل إيراني أصلي (5 جم)',
    nameEn: 'Super Negin Premium Saffron (5g)',
    description: 'خيوط زعفران نقية وطبيعية 100% مفرزة يدوياً بأعلى درجات التلوين والنكهة العطرية الملكية.',
    descriptionEn: 'Top-grade Persian Super Negin Saffron with intense color, deep aroma and unmatched purity.',
    categoryId: 'cat-safran-amber',
    price: 145,
    comparePrice: 180,
    costPrice: 75,
    sku: 'SAFFRON-5G',
    barcode: '6281100990043',
    stock: 60,
    lowStockAlert: 10,
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.88,
    reviewsCount: 43,
    isFeatured: false,
    weight: '5 grams',
    tags: ['زعفران', 'سوبر نقيل', 'عطري']
  },
  {
    id: 'prod-maroki-oud-chips',
    tenantId: 'store-royal-honey-oud',
    name: 'خشب عود مروكي طبيعي دبل سوبر (أوقية 30 جم)',
    nameEn: 'Natural Double Super Marooki Oud Wood (30g)',
    description: 'كسر عود مروكي إندونيسي طبيعي مشبع بالدهن، يعبق برائحة سويتية باردة تدوم طويلاً في المجالس والصالات.',
    descriptionEn: 'High-resinous Indonesian Marooki agarwood incense chips perfect for VIP hospitality and gatherings.',
    categoryId: 'cat-royal-oud',
    price: 320,
    comparePrice: 390,
    costPrice: 170,
    sku: 'OUD-WOOD-MAROKI-30G',
    barcode: '6281100990050',
    stock: 35,
    lowStockAlert: 6,
    images: [
      'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.92,
    reviewsCount: 51,
    isFeatured: true,
    weight: '30g',
    tags: ['بخور', 'عود مروكي', 'طبيعي دبل سوبر']
  }
];

// 4. Initial Realistic Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    tenantId: 'store-royal-honey-oud',
    orderNumber: 'ORD-98421',
    customer: {
      name: 'عبدالرحمن بن سعود القحطاني',
      email: 'a.qahtani@saudi-invest.sa',
      phone: '+966 50 123 4567',
      city: 'الرياض',
      address: 'حي حطين، طريق الأمير تركي الأول، فيلا 42'
    },
    items: [
      {
        productId: 'prod-royal-gift-box',
        productName: 'صندوق الهيبة الملكي (سدر دوعني + تولة عود + زعفران)',
        price: 1150,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=200&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-oud-cambodi-vintage',
        productName: 'دهن عود كمبودي ملكي معتق 25 عاماً',
        variantName: 'تولة كاملة (12 مل)',
        price: 650,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 1800,
    discount: 180,
    shipping: 0,
    tax: 243,
    total: 1863,
    status: 'processing',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    notes: 'يرجى تغليف الصندوق بغلاف إهداء مخملي أسود مع كتابة بطاقة إهداء مخصصة.',
    timeline: [
      { status: 'new', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'تم استلام الطلب وتأكيد الدفع عبر Apple Pay بنجاح' },
      { status: 'processing', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'جاري التجهيز والتغليف في مستودع الرياض المركزي' }
    ]
  },
  {
    id: 'ord-1002',
    tenantId: 'store-royal-honey-oud',
    orderNumber: 'ORD-98420',
    customer: {
      name: 'د. فيصل بن عبدالله الغامدي',
      email: 'faisal.ghamdi@kfshrc.edu.sa',
      phone: '+966 55 987 6543',
      city: 'جدة',
      address: 'حي الشاطئ، شارع الكورنيش، برج النورس'
    },
    items: [
      {
        productId: 'prod-sidr-doani-1kg',
        productName: 'عسل سدر دوعني ملكي فاخر (1 كجم)',
        variantName: 'كيلو كامل (1 كجم)',
        price: 380,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 760,
    discount: 0,
    shipping: 25,
    tax: 117.75,
    total: 902.75,
    status: 'shipped',
    paymentMethod: 'mada',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
    timeline: [
      { status: 'new', timestamp: new Date(Date.now() - 3600000 * 26).toISOString(), note: 'تم إنشاء الطلب والدفع ببطاقة مدى' },
      { status: 'processing', timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), note: 'تم فحص جودة المنتج والتغليف' },
      { status: 'shipped', timestamp: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'تم تسليم الشحنة لشركة سمسا - رقم التتبع: SMSA90284729' }
    ]
  },
  {
    id: 'ord-1003',
    tenantId: 'store-royal-honey-oud',
    orderNumber: 'ORD-98419',
    customer: {
      name: 'سارة بنت منصور الدوسري',
      email: 'sara.dosari@aramco.com',
      phone: '+966 54 332 1199',
      city: 'الخبر',
      address: 'حي الحزام الذهبي، شارع الأمير فيصل بن فهد'
    },
    items: [
      {
        productId: 'prod-super-negin-saffron',
        productName: 'زعفران سوبر نقيل إيراني أصلي (5 جم)',
        price: 145,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 435,
    discount: 43.5,
    shipping: 0,
    tax: 58.72,
    total: 450.22,
    status: 'delivered',
    paymentMethod: 'tamara',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    timeline: [
      { status: 'new', timestamp: new Date(Date.now() - 3600000 * 72).toISOString(), note: 'تم الدفع بالتقسيط عبر تمارا' },
      { status: 'delivered', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), note: 'تم استلام الشحنة وتوقيع العميل' }
    ]
  }
];

// 5. Initial Customers
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-101',
    tenantId: 'store-royal-honey-oud',
    name: 'عبدالرحمن بن سعود القحطاني',
    email: 'a.qahtani@saudi-invest.sa',
    phone: '+966 50 123 4567',
    city: 'الرياض',
    ordersCount: 8,
    totalSpent: 9450,
    lastOrderDate: new Date(Date.now() - 3600000 * 4).toISOString(),
    tags: ['عميل VIP', 'عاشق العود', 'شراء دوري'],
    status: 'vip'
  },
  {
    id: 'cust-102',
    tenantId: 'store-royal-honey-oud',
    name: 'د. فيصل بن عبدالله الغامدي',
    email: 'faisal.ghamdi@kfshrc.edu.sa',
    phone: '+966 55 987 6543',
    city: 'جدة',
    ordersCount: 4,
    totalSpent: 3200,
    lastOrderDate: new Date(Date.now() - 3600000 * 26).toISOString(),
    tags: ['عميل دائم', 'عسل سدر'],
    status: 'active'
  },
  {
    id: 'cust-103',
    tenantId: 'store-royal-honey-oud',
    name: 'سارة بنت منصور الدوسري',
    email: 'sara.dosari@aramco.com',
    phone: '+966 54 332 1199',
    city: 'الخبر',
    ordersCount: 3,
    totalSpent: 1850,
    lastOrderDate: new Date(Date.now() - 3600000 * 72).toISOString(),
    tags: ['تمارا', 'زعفران'],
    status: 'active'
  },
  {
    id: 'cust-104',
    tenantId: 'store-royal-honey-oud',
    name: 'م. طارق بن خالد الشمري',
    email: 'tariq.shammari@redsea.sa',
    phone: '+966 56 445 7788',
    city: 'الدمام',
    ordersCount: 2,
    totalSpent: 1400,
    lastOrderDate: new Date(Date.now() - 3600000 * 120).toISOString(),
    tags: ['هدايا'],
    status: 'active'
  }
];

// 6. Initial Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'cpn-royal20',
    tenantId: 'store-royal-honey-oud',
    code: 'ROYAL20',
    type: 'percentage',
    value: 20,
    minSpend: 300,
    usageLimit: 500,
    usageCount: 84,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true
  },
  {
    id: 'cpn-first50',
    tenantId: 'store-royal-honey-oud',
    code: 'FIRST50',
    type: 'fixed',
    value: 50,
    minSpend: 250,
    usageLimit: 200,
    usageCount: 42,
    expiresAt: '2026-10-30T23:59:59Z',
    isActive: true
  },
  {
    id: 'cpn-vip10',
    tenantId: 'store-royal-honey-oud',
    code: 'VIP10',
    type: 'percentage',
    value: 10,
    minSpend: 0,
    usageLimit: 1000,
    usageCount: 198,
    expiresAt: '2026-12-31T23:59:59Z',
    isActive: true
  }
];

// 7. Initial Staff
export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-owner-01',
    tenantId: 'store-royal-honey-oud',
    name: 'سلطان بن فهد التميمي',
    email: 'sultan@royaloud.sa',
    role: 'store_owner',
    permissions: {
      products: true,
      orders: true,
      customers: true,
      inventory: true,
      coupons: true,
      theme: true,
      staff: true,
      settings: true,
      reports: true
    },
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'staff-admin-02',
    tenantId: 'store-royal-honey-oud',
    name: 'مها بنت إبراهيم العتيبي',
    email: 'maha@royaloud.sa',
    role: 'store_admin',
    permissions: {
      products: true,
      orders: true,
      customers: true,
      inventory: true,
      coupons: true,
      theme: true,
      staff: false,
      settings: false,
      reports: true
    },
    status: 'active',
    createdAt: '2026-02-01T12:00:00Z'
  }
];

// 8. Initial Debts & Credit Ledger (دفتر الديون والذمم المالية)
export const INITIAL_DEBTS: DebtRecord[] = [
  {
    id: 'debt-101',
    tenantId: 'store-royal-honey-oud',
    personName: 'شركة النخبة للفنادق والضيافة',
    personPhone: '+966 11 482 9900',
    personType: 'customer',
    type: 'receivable', // مستحق لنا
    totalAmount: 14500,
    paidAmount: 6000,
    remainingAmount: 8500,
    dueDate: '2026-09-25',
    status: 'partially_paid',
    notes: 'توريد صناديق إهداء ملكية لجناح كبار الشخصيات بفندق الريتز - دفعة آجلة 30 يوم',
    transactions: [
      { id: 'dtx-1', date: '2026-08-25', amount: 6000, paymentMethod: 'bank_transfer', note: 'دفعة أولى عند التسليم' }
    ],
    createdAt: '2026-08-25T14:00:00Z'
  },
  {
    id: 'debt-102',
    tenantId: 'store-royal-honey-oud',
    personName: 'مناحل وادي دوعن التخصصية (المورد الشيخ سالم)',
    personPhone: '+967 77 123 9988',
    personType: 'supplier',
    type: 'payable', // مستحق علينا
    totalAmount: 28000,
    paidAmount: 18000,
    remainingAmount: 10000,
    dueDate: '2026-10-01',
    status: 'partially_paid',
    notes: 'شحنة محصول موسم السدر الجبلي الأصيل دفعة أغسطس (150 كجم)',
    transactions: [
      { id: 'dtx-2', date: '2026-08-15', amount: 18000, paymentMethod: 'bank_transfer', note: 'حوالة بنكية معتمدة عبر الراجحي' }
    ],
    createdAt: '2026-08-15T09:30:00Z'
  },
  {
    id: 'debt-103',
    tenantId: 'store-royal-honey-oud',
    personName: 'الشيخ عبدالمحسن السبيعي',
    personPhone: '+966 50 555 1212',
    personType: 'customer',
    type: 'receivable',
    totalAmount: 4800,
    paidAmount: 0,
    remainingAmount: 4800,
    dueDate: '2026-09-18',
    status: 'pending',
    notes: 'شراء كسر عود مروكي دبل سوبر ودهن عود كمبودي - حساب آجل مفتوح',
    transactions: [],
    createdAt: '2026-08-30T16:20:00Z'
  }
];

// 9. Initial Operating Expenses (سجل المصروفات التشغيلية)
export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-101',
    tenantId: 'store-royal-honey-oud',
    title: 'إيجار معرض الرياض - بوليفارد العليا (دفعة الربع الثالث)',
    category: 'rent',
    amount: 35000,
    taxAmount: 5250,
    paymentMethod: 'bank_transfer',
    paidTo: 'شركة العليا العقارية الاستثمارية',
    date: '2026-08-01',
    notes: 'إيجار الفرع الرئيسي شامل مواقف الزوار وخدمات الأمن'
  },
  {
    id: 'exp-102',
    tenantId: 'store-royal-honey-oud',
    title: 'طباعة وتصنيع علب التغليف الخشبية الملكية المخملية',
    category: 'marketing',
    amount: 8500,
    taxAmount: 1275,
    paymentMethod: 'mada',
    paidTo: 'مطابع الفخامة الحديثة للكرتون والتغليف',
    date: '2026-08-18',
    notes: 'دفعة 500 صندوق خشبي محفور بالليزر مع أكياس حريرية'
  },
  {
    id: 'exp-103',
    tenantId: 'store-royal-honey-oud',
    title: 'رواتب موظفي المبيعات وخبراء العود (شهر أغسطس)',
    category: 'salaries',
    amount: 24000,
    taxAmount: 0,
    paymentMethod: 'bank_transfer',
    paidTo: 'فريق العمل - مسير الرواتب المعتمد',
    date: '2026-08-28',
    notes: 'رواتب 4 موظفين في المعرض ومستودع الشحن'
  },
  {
    id: 'exp-104',
    tenantId: 'store-royal-honey-oud',
    title: 'حملة إعلانات تيك توك وسناب شات لموسم العسل الجديد',
    category: 'marketing',
    amount: 6200,
    taxAmount: 930,
    paymentMethod: 'credit_card',
    paidTo: 'Snap Inc & TikTok Ads MENA',
    date: '2026-08-22',
    notes: 'حملة ترويجية استهدفت الرياض وجدة والشرقية وحققت عائد ROAS 4.8x'
  }
];
