import { Category, Coupon, Customer, Order, Product, StaffMember, SubscriptionPlan, TenantStore } from '../types';
import { generateDesignTokens } from '../utils/themeEngine';

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

export const INITIAL_TENANTS: TenantStore[] = [
  // 1. Flagship Store: Royal Honey (متجر الملكي للعسل)
  {
    id: 'tenant-royal-honey',
    name: 'متجر الملكي للعسل الطبيعي',
    nameEn: 'Royal Honey Boutique',
    slug: 'royal-honey',
    description: 'المتجر الرائد لإنتاج وتوزيع أجود أنواع العسل الطبيعي البري والمفحوص مخبرياً 100%. منتجات أصيلة من مناحلنا الخاصة بأعلى معايير الجودة العالمية.',
    descriptionEn: 'Premium certified raw natural honey and royal bee products harvested sustainably from pristine mountain apiaries.',
    businessType: 'honey',
    logo: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Crown',
    slogan: 'صفاء الطبيعة وأصالة المذاق في كل قطرة',
    sloganEn: 'Purity and heritage in every golden drop',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    domain: 'royalhoney.commerceos.app',
    customDomain: 'www.royalhoney.sa',
    customDomainVerified: true,
    plan: 'pro',
    status: 'active',
    createdAt: '2026-01-10T10:00:00Z',
    contact: {
      email: 'care@royalhoney.sa',
      phone: '+966 50 123 4567',
      whatsapp: '+966501234567',
      city: 'الرياض',
      country: 'المملكة العربية السعودية'
    },
    social: {
      instagram: '@royalhoney_sa',
      twitter: '@royalhoney_sa',
      tiktok: '@royalhoney'
    },
    theme: {
      style: 'luxury',
      layout: 'luxury',
      fontFamily: 'tajawal',
      radius: 'sm',
      shadow: 'subtle',
      headerStyle: 'floating',
      cardStyle: 'bordered',
      darkMode: false,
      tokens: generateDesignTokens('#D4A017', 'luxury', false)
    },
    sections: [
      { id: 'sec-1', type: 'hero', title: 'عسل ملكي طبيعي 100%', titleEn: '100% Pure Royal Honey', subtitle: 'نضمن لك الجودة والشهادة المخبرية المعتمدة مع كل عبوة', subtitleEn: 'Certified laboratory tested with satisfaction guarantee', enabled: true, order: 1 },
      { id: 'sec-2', type: 'categories', title: 'تشكيلات المناحل الملكية', titleEn: 'Our Royal Harvests', enabled: true, order: 2 },
      { id: 'sec-3', type: 'featured_products', title: 'المنتجات الأكثر طلباً', titleEn: 'Best Selling Honey Jars', subtitle: 'مختارات النخبة من أعسال السدر الجبلي والخلطات الخاصة', enabled: true, order: 3 },
      { id: 'sec-4', type: 'benefits', title: 'لماذا يختارنا عشاق العسل؟', titleEn: 'Why Choose Royal Honey?', subtitle: 'معايير صارمة تضمن لك تجربة علاجية وغذائية لا تضاهى', enabled: true, order: 4 },
      { id: 'sec-5', type: 'story', title: 'قصة مناحلنا في جبال السروات', titleEn: 'Our Mountain Apiary Heritage', enabled: true, order: 5 },
      { id: 'sec-6', type: 'testimonials', title: 'تجارب وآراء عملائنا الكرام', titleEn: 'Customer Reviews', enabled: true, order: 6 },
      { id: 'sec-7', type: 'faq', title: 'الأسئلة الشائعة حول العسل والتوصيل', titleEn: 'Frequently Asked Questions', enabled: true, order: 7 }
    ],
    pwaConfig: {
      appName: 'متجر الملكي للعسل',
      shortName: 'الملكي',
      themeColor: '#D4A017',
      backgroundColor: '#FAF9F6',
      enablePush: true
    },
    paymentGateways: {
      mada: true,
      applePay: true,
      visa: true,
      cod: true,
      tamara: true
    },
    shippingMethods: [
      { id: 'ship-1', name: 'شحن سريع مبرد (أرامكس)', nameEn: 'Aramex Chilled Express', cost: 25, estimatedDays: '1-2 أيام عمل', active: true },
      { id: 'ship-2', name: 'توصيل فوري بالرياض (خلال 3 ساعات)', nameEn: 'Riyadh Instant 3-Hour Delivery', cost: 35, estimatedDays: 'اليوم نفسه', active: true },
      { id: 'ship-3', name: 'شحن مجاني للطلبات فوق 300 ر.س', nameEn: 'Free Shipping (Over 300 SAR)', cost: 0, estimatedDays: '2-3 أيام', active: true }
    ]
  },

  // 2. Coffee House
  {
    id: 'tenant-coffee-house',
    name: 'بيت القهوة المختصة',
    nameEn: 'Artisan Coffee Roasters',
    slug: 'coffee-house',
    description: 'محامص مختصة تقدم أجود أنواع حبوب البن المحمصة أسبوعياً من مزارع إثيوبيا، كولومبيا، واليمن مع باقة أدوات التحضير الاحترافية.',
    businessType: 'coffee',
    logo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Coffee',
    slogan: 'كل رشفة بداية يوم استثنائي',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    domain: 'coffeehouse.commerceos.app',
    plan: 'business',
    status: 'active',
    createdAt: '2026-02-01T12:00:00Z',
    contact: {
      email: 'hello@coffeehouse.sa',
      phone: '+966 55 987 6543',
      city: 'جدة',
      country: 'المملكة العربية السعودية'
    },
    social: { instagram: '@coffeehouse_sa' },
    theme: {
      style: 'modern',
      layout: 'modern',
      fontFamily: 'alexandria',
      radius: 'md',
      shadow: 'soft',
      headerStyle: 'solid',
      cardStyle: 'elevated',
      darkMode: false,
      tokens: generateDesignTokens('#78350F', 'modern', false)
    },
    sections: [
      { id: 'sec-c1', type: 'hero', title: 'قهوة مختصة بطابع أصيل', titleEn: 'Artisanal Fresh Roasts', subtitle: 'تحميص أسبوعي طازج لضمان أفضل إيحاءات النكهة', enabled: true, order: 1 },
      { id: 'sec-c2', type: 'categories', title: 'أقسام المحاصيل والأدوات', titleEn: 'Categories', enabled: true, order: 2 },
      { id: 'sec-c3', type: 'featured_products', title: 'أحدث المحاصيل المحمصة', titleEn: 'Fresh Roasts', enabled: true, order: 3 },
      { id: 'sec-c4', type: 'story', title: 'رحلة حبة البن من المزرعة إلى فنجانك', titleEn: 'Our Journey', enabled: true, order: 4 }
    ],
    pwaConfig: {
      appName: 'بيت القهوة',
      shortName: 'CoffeeHouse',
      themeColor: '#78350F',
      backgroundColor: '#FFFFFF',
      enablePush: true
    },
    paymentGateways: { mada: true, applePay: true, visa: true, cod: true, tamara: true },
    shippingMethods: [
      { id: 'sm-c1', name: 'شحن قياسي (سمسا)', nameEn: 'SMSA Express', cost: 20, estimatedDays: '2-3 أيام', active: true }
    ]
  },

  // 3. Fashion Luxe
  {
    id: 'tenant-fashion-luxe',
    name: 'دار الأناقة للأزياء',
    nameEn: 'Luxe Fashion Atelier',
    slug: 'fashion-luxe',
    description: 'أزياء وتصاميم معاصرة تجمع بين الرقي الفاخر والراحة اليومية بخامات قطنية وحريرية منتقاة.',
    businessType: 'fashion',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&auto=format&fit=crop&q=80',
    logoIcon: 'Sparkles',
    slogan: 'أناقة تلائم حضورك البهي',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    domain: 'fashionluxe.commerceos.app',
    plan: 'business',
    status: 'active',
    createdAt: '2026-02-14T09:30:00Z',
    contact: {
      email: 'style@fashionluxe.sa',
      phone: '+966 54 321 0987',
      city: 'الخبر',
      country: 'المملكة العربية السعودية'
    },
    social: { instagram: '@fashionluxe' },
    theme: {
      style: 'minimal',
      layout: 'editorial',
      fontFamily: 'playfair',
      radius: 'none',
      shadow: 'none',
      headerStyle: 'floating',
      cardStyle: 'minimal',
      darkMode: false,
      tokens: generateDesignTokens('#18181B', 'minimal', false)
    },
    sections: [
      { id: 'sec-f1', type: 'hero', title: 'تشكيلة الموسم الجديد', titleEn: 'New Season Collection', subtitle: 'إطلالات كلاسيكية بروح عصرية متجددة', enabled: true, order: 1 },
      { id: 'sec-f2', type: 'categories', title: 'تصنيفات المجموعة', titleEn: 'Collections', enabled: true, order: 2 },
      { id: 'sec-f3', type: 'featured_products', title: 'القطع المميزة', titleEn: 'Featured Items', enabled: true, order: 3 }
    ],
    pwaConfig: {
      appName: 'دار الأناقة',
      shortName: 'FashionLuxe',
      themeColor: '#18181B',
      backgroundColor: '#FFFFFF',
      enablePush: false
    },
    paymentGateways: { mada: true, applePay: true, visa: true, cod: false, tamara: true },
    shippingMethods: [
      { id: 'sm-f1', name: 'شحن DHL السريع', nameEn: 'DHL Express', cost: 30, estimatedDays: '1-2 أيام', active: true }
    ]
  }
];

// Product Data
export const INITIAL_PRODUCTS: Product[] = [
  // --- Royal Honey Products ---
  {
    id: 'prod-h1',
    tenantId: 'tenant-royal-honey',
    name: 'عسل سدر جبلي فاخر (بلدي ملكي)',
    nameEn: 'Royal Mountain Sidr Honey (Grade A+)',
    description: 'مستخلص من زهور أشجار السدر البرية في جبال عسير. يتميز بقوامه الكثيف، ورائحته العطرية النفاذة، ولونه العنبري الداكن. عسل علاجي وغذائي نادر مع فحص مخبري شامل مرفق.',
    categoryId: 'cat-h1',
    price: 340,
    comparePrice: 420,
    costPrice: 180,
    sku: 'RH-SDR-1000',
    stock: 48,
    lowStockAlert: 10,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isBestseller: true,
    weight: '1 كجم',
    attributes: [
      { name: 'الوزن والحجم', values: ['500 جرام', '1 كجم (الأوفر)', '2 كجم'] }
    ],
    variants: [
      { id: 'v-h1-500', name: '500 جرام', price: 185, stock: 35, sku: 'RH-SDR-500' },
      { id: 'v-h1-1000', name: '1 كجم (الأوفر)', price: 340, stock: 48, sku: 'RH-SDR-1000' },
      { id: 'v-h1-2000', name: '2 كجم (علبة ملكية)', price: 630, stock: 15, sku: 'RH-SDR-2000' }
    ],
    tags: ['سدر', 'بلدي', 'أعسال ملكية', 'علاجي']
  },
  {
    id: 'prod-h2',
    tenantId: 'tenant-royal-honey',
    name: 'عسل الغابة السوداء الطبيعي',
    nameEn: 'Pure Black Forest Forest Honey',
    description: 'عسل عضوي داكن غني بالأملاح المعدنية ومضادات الأكسدة القوية. طعم معتدل الحلاوة بنكهة خشبية فريدة، مثالي لتقوية المناعة وصحة الجهاز الهضمي.',
    categoryId: 'cat-h2',
    price: 260,
    comparePrice: 310,
    costPrice: 130,
    sku: 'RH-BLK-1000',
    stock: 62,
    lowStockAlert: 12,
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.8,
    reviewsCount: 84,
    isFeatured: true,
    isNew: false,
    isBestseller: true,
    weight: '1 كجم',
    attributes: [
      { name: 'الوزن', values: ['500 جرام', '1 كجم'] }
    ],
    variants: [
      { id: 'v-h2-500', name: '500 جرام', price: 145, stock: 40, sku: 'RH-BLK-500' },
      { id: 'v-h2-1000', name: '1 كجم', price: 260, stock: 62, sku: 'RH-BLK-1000' }
    ],
    tags: ['غابة سوداء', 'مناعة', 'طبيعي']
  },
  {
    id: 'prod-h3',
    tenantId: 'tenant-royal-honey',
    name: 'خلطة المناعة الملكية (عسل + غذاء ملكات + عكبر + حبوب لقاح)',
    nameEn: 'Royal Immunity Blend (Honey + Royal Jelly + Propolis + Pollen)',
    description: 'التركيبة الملكية الذهبية الحصرية الأكثر طلباً. تجمع بين عسل السدر الطبيعي الصافي وغذاء ملكات النحل الطازج، صمغ العكبر المعقم، وحبوب اللقاح الإنزيمية لتعزيز الطاقة والحيوية.',
    categoryId: 'cat-h3',
    price: 390,
    comparePrice: 470,
    costPrice: 200,
    sku: 'RH-MIX-IMMUNE',
    stock: 24,
    lowStockAlert: 8,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewsCount: 96,
    isFeatured: true,
    isNew: true,
    isBestseller: true,
    weight: '1 كجم',
    tags: ['خلطات ملكية', 'غذاء ملكات', 'عكبر', 'طاقة']
  },
  {
    id: 'prod-h4',
    tenantId: 'tenant-royal-honey',
    name: 'عسل سمر حضرمي نخب أول',
    nameEn: 'Authentic Samar Acacia Honey',
    description: 'عسل سمر طبيعي مميز بنكهته الحادة ولونه الأحمر المائل للسواد. فعال جداً للقولون وقرحة المعدة ومشاكل الجهاز التنفسي وفق أبحاث التغذية العلاجية.',
    categoryId: 'cat-h1',
    price: 290,
    comparePrice: 350,
    costPrice: 150,
    sku: 'RH-SMR-1000',
    stock: 38,
    lowStockAlert: 10,
    images: [
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.9,
    reviewsCount: 52,
    isFeatured: true,
    weight: '1 كجم',
    tags: ['سمر', 'علاجي', 'معدة']
  },
  {
    id: 'prod-h5',
    tenantId: 'tenant-royal-honey',
    name: 'عسل طلح شوكة نجد بري',
    nameEn: 'Wild Acacia Thorn Honey',
    description: 'عسل شوكي بري خفيف السكر ومناسب جداً للحميات الغذائية والمحافظين على معدلات السكر. طعم خفيف ومنعش ونقاء فائق.',
    categoryId: 'cat-h1',
    price: 280,
    costPrice: 140,
    sku: 'RH-TLH-1000',
    stock: 19,
    lowStockAlert: 10,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 4.7,
    reviewsCount: 38,
    isFeatured: false,
    weight: '1 كجم',
    tags: ['طلح', 'بري', 'شوكة']
  },
  {
    id: 'prod-h6',
    tenantId: 'tenant-royal-honey',
    name: 'بكج الإهداء الملكي الفاخر (3 أصناف + ملاعق خشبية)',
    nameEn: 'Royal Luxury Gift Set (3 Jars + Wooden Dippers)',
    description: 'صندوق خشبي فاخر مبطن بالحرير، يحتوي على 3 عبوات نصف كيلو (سدر جبلي + غابة سوداء + خلطة ملكية) مع ملعقتين من خشب الزيتون الطبيعي، مثالي للإهداء في المناسبات.',
    categoryId: 'cat-h4',
    price: 520,
    comparePrice: 650,
    costPrice: 280,
    sku: 'RH-GIFT-LUX',
    stock: 12,
    lowStockAlert: 5,
    images: [
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'
    ],
    rating: 5.0,
    reviewsCount: 41,
    isFeatured: true,
    isBestseller: true,
    tags: ['هدايا', 'بكجات', 'فاخر']
  },

  // --- Coffee House Products ---
  {
    id: 'prod-c1',
    tenantId: 'tenant-coffee-house',
    name: 'محصول إثيوبيا قوجي (مجففة - إيحاءات خوخ وياسمين)',
    nameEn: 'Ethiopia Guji Natural Roast (Peach & Jasmine)',
    description: 'محصول أرابيكا فاخر بمعالجة مجففة طبيعية من مرتفعات قوجي. إيحاءات فاكهية منعشة وقوام حريري متوازن لعشاق قهوة الفلتر والإسبريسو.',
    categoryId: 'cat-c1',
    price: 68,
    costPrice: 32,
    sku: 'CH-ETH-250',
    stock: 85,
    lowStockAlert: 15,
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    reviewsCount: 77,
    isFeatured: true,
    isBestseller: true,
    weight: '250 جرام',
    tags: ['إثيوبيا', 'فلتر', 'مختصة']
  },
  {
    id: 'prod-c2',
    tenantId: 'tenant-coffee-house',
    name: 'محصول كولومبيا هويلا (مغسولة - شوكولاتة وكراميل)',
    nameEn: 'Colombia Huila Washed Roast',
    description: 'محصول كلاسيكي متوازن بقوام غني وإيحاءات حلاوة الشوكولاتة الداكنة والمكسرات المحمصة، ممتاز جداً لمشروبات الحليب والإسبريسو.',
    categoryId: 'cat-c1',
    price: 62,
    costPrice: 28,
    sku: 'CH-COL-250',
    stock: 54,
    lowStockAlert: 10,
    images: ['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80'],
    rating: 4.8,
    reviewsCount: 45,
    isFeatured: true,
    weight: '250 جرام',
    tags: ['كولومبيا', 'إسبريسو', 'حليب']
  },

  // --- Fashion Luxe Products ---
  {
    id: 'prod-f1',
    tenantId: 'tenant-fashion-luxe',
    name: 'عباءة حريرية مطرزة يدويًا',
    nameEn: 'Hand-Embroidered Silk Abaya',
    description: 'قصة انسيابية راقية بقماش كريب ياباني فاخر ولمسات تطريز خيط حريري ناعم على الأكمام والأطراف، تناسب المناسبات الراقية.',
    categoryId: 'cat-f1',
    price: 780,
    comparePrice: 950,
    costPrice: 350,
    sku: 'FL-ABY-01',
    stock: 18,
    lowStockAlert: 5,
    images: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80'],
    rating: 4.9,
    reviewsCount: 32,
    isFeatured: true,
    isBestseller: true,
    attributes: [{ name: 'المقاس', values: ['52', '54', '56', '58'] }],
    variants: [
      { id: 'v-f1-52', name: 'مقاس 52', price: 780, stock: 4, sku: 'FL-ABY-01-52' },
      { id: 'v-f1-54', name: 'مقاس 54', price: 780, stock: 6, sku: 'FL-ABY-01-54' },
      { id: 'v-f1-56', name: 'مقاس 56', price: 780, stock: 5, sku: 'FL-ABY-01-56' },
      { id: 'v-f1-58', name: 'مقاس 58', price: 780, stock: 3, sku: 'FL-ABY-01-58' }
    ],
    tags: ['عبايات', 'حرير', 'فاخر']
  }
];

// Categories
export const INITIAL_CATEGORIES: Category[] = [
  // Royal Honey Categories
  { id: 'cat-h1', tenantId: 'tenant-royal-honey', name: 'عسل السدر والسمر الجبلي', nameEn: 'Sidr & Mountain Honey', icon: 'Flame', productCount: 12 },
  { id: 'cat-h2', tenantId: 'tenant-royal-honey', name: 'عسل الغابة السوداء والزهور', nameEn: 'Black Forest & Blossom', icon: 'Sparkles', productCount: 8 },
  { id: 'cat-h3', tenantId: 'tenant-royal-honey', name: 'الخلطات الملكية ومنتجات النحل', nameEn: 'Royal Blends & Bee Products', icon: 'Crown', productCount: 6 },
  { id: 'cat-h4', tenantId: 'tenant-royal-honey', name: 'صناديق وبكجات الإهداء', nameEn: 'Gift Sets & Boxes', icon: 'Gift', productCount: 4 },

  // Coffee Categories
  { id: 'cat-c1', tenantId: 'tenant-coffee-house', name: 'محاصيل القهوة المختصة', nameEn: 'Single Origin Coffee', icon: 'Coffee', productCount: 14 },
  { id: 'cat-c2', tenantId: 'tenant-coffee-house', name: 'أدوات ومكائن التحضير V60', nameEn: 'Brewing Equipment', icon: 'Tool', productCount: 9 },

  // Fashion Categories
  { id: 'cat-f1', tenantId: 'tenant-fashion-luxe', name: 'تشكيلة العبايات والجلابيات', nameEn: 'Abayas & Kaftans', icon: 'Sparkles', productCount: 20 },
  { id: 'cat-f2', tenantId: 'tenant-fashion-luxe', name: 'إكسسوارات وحقائب فاخرة', nameEn: 'Luxury Accessories', icon: 'ShoppingBag', productCount: 15 }
];

// Initial Orders
export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    tenantId: 'tenant-royal-honey',
    orderNumber: '#RH-1024',
    customer: {
      name: 'عبدالله السبيعي',
      email: 'abdullah@example.com',
      phone: '+966 50 111 2233',
      city: 'الرياض',
      address: 'حي النرجس، شارع الأمير فيصل بن بندر، فيلا 12'
    },
    items: [
      {
        productId: 'prod-h1',
        productName: 'عسل سدر جبلي فاخر (1 كجم)',
        variantName: '1 كجم (الأوفر)',
        price: 340,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80'
      },
      {
        productId: 'prod-h3',
        productName: 'خلطة المناعة الملكية',
        price: 390,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 1070,
    discount: 50,
    shipping: 0,
    total: 1020,
    status: 'processing',
    paymentMethod: 'apple_pay',
    paymentStatus: 'paid',
    createdAt: '2026-08-20T14:32:00Z',
    notes: 'يرجى التوصيل في الفترة المسائية وتغليف العبوات بعناية',
    timeline: [
      { status: 'new', timestamp: '2026-08-20T14:32:00Z', note: 'تم استلام الطلب وتأكيد الدفع بنجاح عبر Apple Pay' },
      { status: 'processing', timestamp: '2026-08-20T15:10:00Z', note: 'جاري التجهيز والتغليف في مستودع الرياض المركزي' }
    ]
  },
  {
    id: 'ord-1002',
    tenantId: 'tenant-royal-honey',
    orderNumber: '#RH-1023',
    customer: {
      name: 'نورة المنصور',
      email: 'noura.m@example.com',
      phone: '+966 55 444 7788',
      city: 'جدة',
      address: 'حي الشاطئ، برج اللؤلؤة، شقة 402'
    },
    items: [
      {
        productId: 'prod-h6',
        productName: 'بكج الإهداء الملكي الفاخر',
        price: 520,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 520,
    discount: 0,
    shipping: 25,
    total: 545,
    status: 'shipped',
    paymentMethod: 'mada',
    paymentStatus: 'paid',
    createdAt: '2026-08-19T11:15:00Z',
    timeline: [
      { status: 'new', timestamp: '2026-08-19T11:15:00Z', note: 'تم إنشاء الطلب والدفع ببطاقة مدى' },
      { status: 'processing', timestamp: '2026-08-19T12:00:00Z', note: 'تم تجهيز البكج مع بطاقة إهداء مخصصة' },
      { status: 'shipped', timestamp: '2026-08-19T16:45:00Z', note: 'تم تسليم الشحنة لأرامكس (رقم التتبع: ARX-9988231)' }
    ]
  },
  {
    id: 'ord-1003',
    tenantId: 'tenant-royal-honey',
    orderNumber: '#RH-1022',
    customer: {
      name: 'فيصل القحطاني',
      email: 'faisal.q@example.com',
      phone: '+966 54 888 9900',
      city: 'الدمام',
      address: 'حي المزروعية، شارع الملك عبدالعزيز'
    },
    items: [
      {
        productId: 'prod-h2',
        productName: 'عسل الغابة السوداء الطبيعي (1 كجم)',
        price: 260,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=200&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 520,
    discount: 0,
    shipping: 0,
    total: 520,
    status: 'delivered',
    paymentMethod: 'tamara',
    paymentStatus: 'paid',
    createdAt: '2026-08-17T09:20:00Z',
    timeline: [
      { status: 'new', timestamp: '2026-08-17T09:20:00Z', note: 'تم إنشاء الطلب وتقسيطه عبر تمارا' },
      { status: 'shipped', timestamp: '2026-08-17T14:00:00Z', note: 'الشحنة في طريقها للعميل' },
      { status: 'delivered', timestamp: '2026-08-18T17:30:00Z', note: 'تم تسليم الشحنة للعميل بنجاح' }
    ]
  }
];

// Initial Customers
export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    tenantId: 'tenant-royal-honey',
    name: 'عبدالله السبيعي',
    email: 'abdullah@example.com',
    phone: '+966 50 111 2233',
    city: 'الرياض',
    ordersCount: 4,
    totalSpent: 3450,
    lastOrderDate: '2026-08-20',
    tags: ['عميل VIP', 'عاشق السدر'],
    status: 'vip'
  },
  {
    id: 'cust-2',
    tenantId: 'tenant-royal-honey',
    name: 'نورة المنصور',
    email: 'noura.m@example.com',
    phone: '+966 55 444 7788',
    city: 'جدة',
    ordersCount: 2,
    totalSpent: 1180,
    lastOrderDate: '2026-08-19',
    tags: ['مهتم بالهدايا'],
    status: 'active'
  },
  {
    id: 'cust-3',
    tenantId: 'tenant-royal-honey',
    name: 'فيصل القحطاني',
    email: 'faisal.q@example.com',
    phone: '+966 54 888 9900',
    city: 'الدمام',
    ordersCount: 3,
    totalSpent: 1640,
    lastOrderDate: '2026-08-17',
    tags: ['عسل الغابة السوداء'],
    status: 'active'
  },
  {
    id: 'cust-4',
    tenantId: 'tenant-royal-honey',
    name: 'سارة الشريف',
    email: 'sara.sh@example.com',
    phone: '+966 56 333 1122',
    city: 'مكة المكرمة',
    ordersCount: 1,
    totalSpent: 420,
    lastOrderDate: '2026-08-10',
    tags: ['عميل جديد'],
    status: 'active'
  }
];

// Coupons
export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    tenantId: 'tenant-royal-honey',
    code: 'ROYAL15',
    type: 'percentage',
    value: 15,
    minSpend: 250,
    usageLimit: 500,
    usageCount: 142,
    expiresAt: '2026-12-31',
    isActive: true
  },
  {
    id: 'coup-2',
    tenantId: 'tenant-royal-honey',
    code: 'SAVE50',
    type: 'fixed',
    value: 50,
    minSpend: 400,
    usageLimit: 200,
    usageCount: 89,
    expiresAt: '2026-10-31',
    isActive: true
  },
  {
    id: 'coup-3',
    tenantId: 'tenant-royal-honey',
    code: 'HONEYFIRST',
    type: 'percentage',
    value: 10,
    minSpend: 100,
    usageLimit: 1000,
    usageCount: 310,
    expiresAt: '2026-12-31',
    isActive: true
  }
];

// Staff & RBAC Members
export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-1',
    tenantId: 'tenant-royal-honey',
    name: 'أحمد الغامدي (مالك المتجر)',
    email: 'ahmed@royalhoney.sa',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
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
    createdAt: '2026-01-10'
  },
  {
    id: 'staff-2',
    tenantId: 'tenant-royal-honey',
    name: 'سارة الزهراني (مديرة المنتجات والمخزون)',
    email: 'sara.products@royalhoney.sa',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    role: 'product_manager',
    permissions: {
      products: true,
      orders: false,
      customers: false,
      inventory: true,
      coupons: true,
      theme: false,
      staff: false,
      settings: false,
      reports: true
    },
    status: 'active',
    createdAt: '2026-02-05'
  },
  {
    id: 'staff-3',
    tenantId: 'tenant-royal-honey',
    name: 'محمد الدوسري (مدير الطلبات والشحن)',
    email: 'mohammed.orders@royalhoney.sa',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'order_manager',
    permissions: {
      products: false,
      orders: true,
      customers: true,
      inventory: false,
      coupons: false,
      theme: false,
      staff: false,
      settings: false,
      reports: true
    },
    status: 'active',
    createdAt: '2026-03-12'
  }
];
