import { StoreTheme, Product, Category, HomepageSection } from '../types';

export interface StoreExportManifest {
  version: string;
  generatedAt: string;
  builderVersion: string;
  storeMeta: {
    id: string;
    slug: string;
    name: string;
    nameEn: string;
    businessType: string;
    currency: string;
    country: string;
    language: string;
    supportEmail: string;
    whatsapp: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
  theme: StoreTheme;
  homepage: {
    sections: HomepageSection[];
  };
  catalog: {
    categories: Category[];
    products: Product[];
  };
  localization: {
    defaultLocale: string;
    supportedLocales: string[];
    currencySymbol: string;
    taxIncluded: boolean;
  };
  paymentGateways: {
    mada: boolean;
    applePay: boolean;
    visa: boolean;
    stcPay: boolean;
    tamara: boolean;
    tabby: boolean;
    cod: boolean;
  };
  shippingZones: {
    name: string;
    rate: number;
    estimatedDays: string;
  }[];
}
