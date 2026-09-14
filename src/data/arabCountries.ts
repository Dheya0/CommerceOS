export interface ArabCountry {
  code: string;
  nameAr: string;
  nameEn: string;
  flag: string;
  currencyCode: string;
  currencyNameAr: string;
  currencySymbol: string;
  phoneCode: string;
  vatRate: number; // percentage, e.g. 15 for 15%
  popularPayments: string[];
}

export const ARAB_COUNTRIES: ArabCountry[] = [
  {
    code: 'SA',
    nameAr: 'المملكة العربية السعودية',
    nameEn: 'Saudi Arabia',
    flag: '🇸🇦',
    currencyCode: 'SAR',
    currencyNameAr: 'ريال سعودي',
    currencySymbol: 'ر.س',
    phoneCode: '+966',
    vatRate: 15,
    popularPayments: ['Mada', 'Apple Pay', 'STC Pay', 'Tabby', 'Tamara', 'Visa/Mastercard']
  },
  {
    code: 'AE',
    nameAr: 'الإمارات العربية المتحدة',
    nameEn: 'United Arab Emirates',
    flag: '🇦🇪',
    currencyCode: 'AED',
    currencyNameAr: 'درهم إماراتي',
    currencySymbol: 'د.إ',
    phoneCode: '+971',
    vatRate: 5,
    popularPayments: ['Apple Pay', 'Google Pay', 'Tabby', 'Tamara', 'Visa/Mastercard']
  },
  {
    code: 'EG',
    nameAr: 'جمهورية مصر العربية',
    nameEn: 'Egypt',
    flag: '🇪🇬',
    currencyCode: 'EGP',
    currencyNameAr: 'جنيه مصري',
    currencySymbol: 'ج.م',
    phoneCode: '+20',
    vatRate: 14,
    popularPayments: ['Fawry', 'Vodafone Cash', 'InstaPay', 'Meeza', 'Paymob', 'ValU']
  },
  {
    code: 'KW',
    nameAr: 'دولة الكويت',
    nameEn: 'Kuwait',
    flag: '🇰🇼',
    currencyCode: 'KWD',
    currencyNameAr: 'دينار كويتي',
    currencySymbol: 'د.ك',
    phoneCode: '+965',
    vatRate: 0,
    popularPayments: ['KNET', 'Apple Pay', 'MyFatoorah', 'Visa/Mastercard']
  },
  {
    code: 'QA',
    nameAr: 'دولة قطر',
    nameEn: 'Qatar',
    flag: '🇶🇦',
    currencyCode: 'QAR',
    currencyNameAr: 'ريال قطري',
    currencySymbol: 'ر.ق',
    phoneCode: '+974',
    vatRate: 0,
    popularPayments: ['NAPS', 'Apple Pay', 'QNB SimpliPay', 'Visa/Mastercard']
  },
  {
    code: 'OM',
    nameAr: 'سلطنة عُمان',
    nameEn: 'Oman',
    flag: '🇴🇲',
    currencyCode: 'OMR',
    currencyNameAr: 'ريال عماني',
    currencySymbol: 'ر.ع',
    phoneCode: '+968',
    vatRate: 5,
    popularPayments: ['OmanNet', 'Thawani', 'Apple Pay', 'Visa/Mastercard']
  },
  {
    code: 'BH',
    nameAr: 'مملكة البحرين',
    nameEn: 'Bahrain',
    flag: '🇧🇭',
    currencyCode: 'BHD',
    currencyNameAr: 'دينار بحريني',
    currencySymbol: 'د.ب',
    phoneCode: '+973',
    vatRate: 10,
    popularPayments: ['BenefitPay', 'Apple Pay', 'Tap Payments', 'Visa/Mastercard']
  },
  {
    code: 'JO',
    nameAr: 'المملكة الأردنية الهاشمية',
    nameEn: 'Jordan',
    flag: '🇯🇴',
    currencyCode: 'JOD',
    currencyNameAr: 'دينار أردني',
    currencySymbol: 'د.أ',
    phoneCode: '+962',
    vatRate: 16,
    popularPayments: ['CliQ', 'Zain Cash', 'Orange Money', 'Visa/Mastercard']
  },
  {
    code: 'IQ',
    nameAr: 'جمهورية العراق',
    nameEn: 'Iraq',
    flag: '🇮🇶',
    currencyCode: 'IQD',
    currencyNameAr: 'دينار عراقي',
    currencySymbol: 'د.ع',
    phoneCode: '+964',
    vatRate: 0,
    popularPayments: ['ZainCash Iraq', 'Qi Card', 'FastPay', 'AsiaPay']
  },
  {
    code: 'MA',
    nameAr: 'المملكة المغربية',
    nameEn: 'Morocco',
    flag: '🇲🇦',
    currencyCode: 'MAD',
    currencyNameAr: 'درهم مغربي',
    currencySymbol: 'د.م',
    phoneCode: '+212',
    vatRate: 20,
    popularPayments: ['CMI', 'Cash Plus', 'Wafacash', 'Visa/Mastercard']
  },
  {
    code: 'DZ',
    nameAr: 'الجمهورية الجزائرية',
    nameEn: 'Algeria',
    flag: '🇩🇿',
    currencyCode: 'DZD',
    currencyNameAr: 'دينار جزائري',
    currencySymbol: 'د.ج',
    phoneCode: '+213',
    vatRate: 19,
    popularPayments: ['Edahabia (بريد الجزائر)', 'CIB', 'BaridiMob']
  },
  {
    code: 'TN',
    nameAr: 'الجمهورية التونسية',
    nameEn: 'Tunisia',
    flag: '🇹🇳',
    currencyCode: 'TND',
    currencyNameAr: 'دينار تونسي',
    currencySymbol: 'د.ت',
    phoneCode: '+216',
    vatRate: 19,
    popularPayments: ['Konnect', 'Sobflous', 'D17', 'Visa/Mastercard']
  },
  {
    code: 'YE',
    nameAr: 'الجمهورية اليمنية',
    nameEn: 'Yemen',
    flag: '🇾🇪',
    currencyCode: 'YER',
    currencyNameAr: 'ريال يمني',
    currencySymbol: 'ر.ي',
    phoneCode: '+967',
    vatRate: 5,
    popularPayments: ['Kuraimi Jawwal Pay', 'Floosak', 'OneCash', 'Cash on Delivery']
  },
  {
    code: 'LY',
    nameAr: 'دولة ليبيا',
    nameEn: 'Libya',
    flag: '🇱🇾',
    currencyCode: 'LYD',
    currencyNameAr: 'دينار ليبي',
    currencySymbol: 'د.ل',
    phoneCode: '+218',
    vatRate: 0,
    popularPayments: ['Sadad (سداد)', 'Tadawul', 'Moamalat', 'MobiCash']
  },
  {
    code: 'LB',
    nameAr: 'الجمهورية اللبنانية',
    nameEn: 'Lebanon',
    flag: '🇱🇧',
    currencyCode: 'USD', // Often transacted in USD / LBP
    currencyNameAr: 'دولار أمريكي / ليرة لبنانية',
    currencySymbol: '$ / ل.ل',
    phoneCode: '+961',
    vatRate: 11,
    popularPayments: ['Whish Money', 'OMT Pay', 'Cash on Delivery', 'Visa/Mastercard']
  },
  {
    code: 'SD',
    nameAr: 'جمهورية السودان',
    nameEn: 'Sudan',
    flag: '🇸🇩',
    currencyCode: 'SDG',
    currencyNameAr: 'جنيه سوداني',
    currencySymbol: 'ج.س',
    phoneCode: '+249',
    vatRate: 17,
    popularPayments: ['Bankak (بنكك)', 'Fawry Sudan', 'Cash on Delivery']
  },
  {
    code: 'PS',
    nameAr: 'دولة فلسطين',
    nameEn: 'Palestine',
    flag: '🇵🇸',
    currencyCode: 'ILS',
    currencyNameAr: 'شيكل / دينار أردني',
    currencySymbol: '₪ / د.أ',
    phoneCode: '+970',
    vatRate: 16,
    popularPayments: ['PalPay', 'Jawwal Pay', 'Refah', 'Visa/Mastercard']
  }
];

export const PAYMENT_GATEWAY_PROVIDERS = [
  {
    id: 'mada_applepay',
    nameAr: 'مدى و Apple Pay',
    nameEn: 'Mada & Apple Pay',
    badge: 'الأكثر طلباً بالسعودية والخليج',
    category: 'cards',
    supportedCountries: ['SA', 'AE', 'KW', 'QA', 'BH', 'OM'],
    fields: [
      { key: 'merchant_id', labelAr: 'معرف التاجر (Merchant ID)', placeholder: 'merchant.com.yourstore' },
      { key: 'api_key', labelAr: 'مفتاح الـ API العام (Publishable Key)', placeholder: 'pk_live_...' },
      { key: 'secret_key', labelAr: 'المفتاح السري (Secret Key)', placeholder: 'sk_live_...' }
    ]
  },
  {
    id: 'fawry_vodafone',
    nameAr: 'فوري ومحافظ المحمول (فودافون كاش)',
    nameEn: 'Fawry & Mobile Wallets',
    badge: 'مصر والمنطقة',
    category: 'wallets',
    supportedCountries: ['EG'],
    fields: [
      { key: 'merchant_code', labelAr: 'كود التاجر فوري (Merchant Code)', placeholder: '1000000000' },
      { key: 'security_key', labelAr: 'مفتاح الحماية السري (Security Key)', placeholder: 'sec_live_...' }
    ]
  },
  {
    id: 'tabby_tamara',
    nameAr: 'تابي وتمارا (اشتري الآن وادفع لاحقاً)',
    nameEn: 'Tabby & Tamara BNPL',
    badge: 'تقسيط بدون فوائد',
    category: 'bnpl',
    supportedCountries: ['SA', 'AE', 'KW', 'BH'],
    fields: [
      { key: 'public_key', labelAr: 'المفتاح العام (Public Key)', placeholder: 'pk_test_...' },
      { key: 'secret_key', labelAr: 'المفتاح السري (Secret Key)', placeholder: 'sk_test_...' }
    ]
  },
  {
    id: 'myfatoorah',
    nameAr: 'ماي فاتورة (MyFatoorah)',
    nameEn: 'MyFatoorah Multi-Gateway',
    badge: 'تغطية خليجية وعربية شاملة',
    category: 'aggregator',
    supportedCountries: ['KW', 'SA', 'AE', 'QA', 'BH', 'OM', 'EG', 'JO'],
    fields: [
      { key: 'api_token', labelAr: 'رمز الـ API الموحد (Bearer Token)', placeholder: 'eyJhbGciOiJIUzI1Ni...' }
    ]
  },
  {
    id: 'paymob',
    nameAr: 'باي موب (Paymob)',
    nameEn: 'Paymob Gateway',
    badge: 'مصر والسعودية والإمارات',
    category: 'aggregator',
    supportedCountries: ['EG', 'SA', 'AE'],
    fields: [
      { key: 'api_key', labelAr: 'مفتاح الـ API', placeholder: 'ZXy...' },
      { key: 'integration_id', labelAr: 'معرف الدمج (Integration ID)', placeholder: '123456' },
      { key: 'iframe_id', labelAr: 'معرف الإطار (Iframe ID)', placeholder: '654321' }
    ]
  },
  {
    id: 'tap_payments',
    nameAr: 'تاب بيمنتس (Tap Payments)',
    nameEn: 'Tap Payments MENA',
    badge: 'شامل لكل دول الخليج',
    category: 'aggregator',
    supportedCountries: ['KW', 'SA', 'AE', 'BH', 'QA', 'OM', 'EG', 'JO', 'LB'],
    fields: [
      { key: 'publishable_key', labelAr: 'المفتاح العام (Publishable Key)', placeholder: 'pk_live_...' },
      { key: 'secret_key', labelAr: 'المفتاح السري (Secret Key)', placeholder: 'sk_live_...' }
    ]
  },
  {
    id: 'stripe_global',
    nameAr: 'سترايب العالمي (Stripe)',
    nameEn: 'Stripe International',
    badge: 'عالمي + الإمارات والسعودية',
    category: 'international',
    supportedCountries: ['AE', 'SA', 'US', 'GB', 'GLOBAL'],
    fields: [
      { key: 'publishable_key', labelAr: 'المفتاح العام (Publishable Key)', placeholder: 'pk_live_...' },
      { key: 'secret_key', labelAr: 'المفتاح السري (Secret Key)', placeholder: 'sk_live_...' },
      { key: 'webhook_secret', labelAr: 'سر الويب هوك (Webhook Secret)', placeholder: 'whsec_...' }
    ]
  },
  {
    id: 'cash_on_delivery',
    nameAr: 'الدفع عند الاستلام (COD) والدفع النقدي',
    nameEn: 'Cash on Delivery & In-Person',
    badge: 'بدون أي عمولات أو مفاتيح',
    category: 'offline',
    supportedCountries: ['ALL'],
    fields: [
      { key: 'instructions', labelAr: 'تعليمات الدفع للعميل', placeholder: 'يتم دفع المبلغ نقداً للمندوب أو عند استلام الطلب من المحل' }
    ]
  }
];
