import React from 'react';
import { Store, Sparkles, Image, Megaphone, Sliders, Check } from 'lucide-react';
import { StoreTheme } from '../../types';
import { ImageUploadCropper } from '../common/ImageUploadCropper';

interface BrandingAssetsStudioProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
  storeName: string;
  setStoreName: (name: string) => void;
  storeNameEn: string;
  setStoreNameEn: (nameEn: string) => void;
  slogan: string;
  setSlogan: (slogan: string) => void;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
}

export const BrandingAssetsStudio: React.FC<BrandingAssetsStudioProps> = ({
  draftTheme,
  onThemeChange,
  storeName,
  setStoreName,
  storeNameEn,
  setStoreNameEn,
  slogan,
  setSlogan,
  logoUrl,
  setLogoUrl
}) => {
  const announcement = draftTheme.announcementBar || {
    enabled: true,
    text: '🎉 شحن مجاني لكافة مدن المملكة للطلبات فوق 200 ريال | كود الخصم: FIRST',
    backgroundColor: '#D4A017',
    textColor: '#0f172a'
  };

  const heroBannerPresets = [
    { name: 'عسل سدر ملكي فاخر', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=1400&q=80' },
    { name: 'محامص بن مختصة أرستقراطية', url: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1400&q=80' },
    { name: 'أزياء راقية ومجوهرات', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80' },
    { name: 'عود وعطور شرقية فاخرة', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1400&q=80' },
    { name: 'إلكترونيات وتقنية ذكية', url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1400&q=80' },
    { name: 'مزارع عضوية وطبيعة', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=80' },
  ];

  const handleAnnouncementToggle = (enabled: boolean) => {
    onThemeChange(prev => ({
      ...prev,
      announcementBar: {
        ...announcement,
        enabled
      }
    }));
  };

  const handleAnnouncementTextChange = (text: string) => {
    onThemeChange(prev => ({
      ...prev,
      announcementBar: {
        ...announcement,
        text
      }
    }));
  };

  const handleAnnouncementBg = (color: string) => {
    onThemeChange(prev => ({
      ...prev,
      announcementBar: {
        ...announcement,
        backgroundColor: color
      }
    }));
  };

  const handleAnnouncementTextColor = (color: string) => {
    onThemeChange(prev => ({
      ...prev,
      announcementBar: {
        ...announcement,
        textColor: color
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Store Names & Slogan */}
      <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <label className="text-xs font-bold text-slate-200 block">بيانات واسم العلامة التجارية</label>
        
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">اسم المتجر بالعربي</label>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="مثال: مناحل الريان للعسل الملكي"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">اسم المتجر بالإنجليزي (Store Name En)</label>
          <input
            type="text"
            value={storeNameEn}
            onChange={(e) => setStoreNameEn(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="e.g. Al Rayan Royal Honey"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1">العبارة الترويجية أو الشعار (Slogan)</label>
          <input
            type="text"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            placeholder="أنقى خيرات الطبيعة وأجود أنواع العسل المضمون"
          />
        </div>
      </div>

      {/* 2. Announcement Bar Studio */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">شريط الإعلانات العلوي (Announcement Bar)</span>
          </div>
          <input
            type="checkbox"
            checked={announcement.enabled !== false}
            onChange={(e) => handleAnnouncementToggle(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {announcement.enabled !== false && (
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">نص الشريط الإعلاني</label>
              <input
                type="text"
                value={announcement.text}
                onChange={(e) => handleAnnouncementTextChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="اكتب العرض الترويجي أو التنبيه هنا..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">لون خلفية الشريط</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={announcement.backgroundColor || '#D4A017'}
                    onChange={(e) => handleAnnouncementBg(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <span className="text-[10px] font-mono text-slate-300">
                    {announcement.backgroundColor || '#D4A017'}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">لون نص الشريط</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={announcement.textColor || '#0f172a'}
                    onChange={(e) => handleAnnouncementTextColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 shrink-0"
                  />
                  <span className="text-[10px] font-mono text-slate-300">
                    {announcement.textColor || '#0f172a'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Hero Banner Image */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">صورة بانر الواجهة (Hero Banner)</span>
          </div>
          {draftTheme.heroBannerImage && (
            <button
              onClick={() => onThemeChange(prev => ({ ...prev, heroBannerImage: undefined }))}
              className="text-[10px] text-rose-400 hover:underline"
            >
              إلغاء واستعادة التدرج
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-400">
          اختر صورة بانر عالية الدقة لمجال متجرك أو أدخل رابط صورة مخصصة:
        </p>

        {/* Banner Presets */}
        <div className="grid grid-cols-2 gap-2">
          {heroBannerPresets.map(preset => {
            const isSelected = draftTheme.heroBannerImage === preset.url;
            return (
              <button
                key={preset.name}
                onClick={() => onThemeChange(prev => ({ ...prev, heroBannerImage: preset.url }))}
                className={`relative h-16 rounded-xl overflow-hidden border text-right transition-all group ${
                  isSelected ? 'border-amber-500 ring-2 ring-amber-500/40' : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-slate-950/60 p-2 flex items-end justify-between">
                  <span className="text-[10px] font-bold text-white leading-tight">{preset.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Banner Image URL */}
        <div className="pt-1">
          <label className="text-[10px] font-bold text-slate-400 block mb-1">أو أدخل رابط صورة مخصصة (Custom URL)</label>
          <input
            type="url"
            value={draftTheme.heroBannerImage || ''}
            onChange={(e) => onThemeChange(prev => ({ ...prev, heroBannerImage: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
            placeholder="https://images.unsplash.com/..."
          />
        </div>
      </div>

      {/* 4. Logo Cropper & Height Control */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-200 block">شعار المتجر وارتفاعه (Logo & Height)</label>
        
        {/* Height Slider */}
        <div className="space-y-1.5 pb-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">ارتفاع الشعار في الترويسة:</span>
            <span className="font-mono text-amber-400">{draftTheme.logoHeight || 40}px</span>
          </div>
          <input
            type="range"
            min="24"
            max="80"
            step="2"
            value={draftTheme.logoHeight || 40}
            onChange={(e) => onThemeChange(prev => ({ ...prev, logoHeight: parseInt(e.target.value) }))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* Image Cropper */}
        <ImageUploadCropper
          initialImage={logoUrl}
          onImageChange={(newLogo) => setLogoUrl(newLogo)}
          isLogoMode={true}
          cropTitle="قص وتعديل شعار المتجر"
          accentColor={draftTheme.tokens.primary}
        />
      </div>

    </div>
  );
};
