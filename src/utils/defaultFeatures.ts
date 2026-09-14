import { OptionalStoreFeatures, BusinessType } from '../types';

export const DEFAULT_STORE_FEATURES: OptionalStoreFeatures = {
  // Storefront optional features (enabled by default, fully toggleable by merchant)
  installmentsCalculator: true,
  wholesaleB2BTiers: true,
  laserEngravingOption: true,
  luxuryGiftWrapping: true,
  fragrancePyramidSFDA: true,
  electronicsWarranty: true,
  fashionSizeGuide: true,
  whatsappDirectInquiry: true,
  shareProductLink: true,
  zatcaQrCodeInvoice: true,
  customerReviewsSystem: true,

  // Backoffice optional modules
  posCashierModule: true,
  debtsLedgerModule: true,
  expensesTrackerModule: true,
  commercialSectorsHub: true,
  openBankingIntegration: true,
  couponsMarketingModule: true,
  inventoryAlerts: true
};

export function getTenantFeatures(featuresConfig?: Partial<OptionalStoreFeatures>): OptionalStoreFeatures {
  return {
    ...DEFAULT_STORE_FEATURES,
    ...(featuresConfig || {})
  };
}
