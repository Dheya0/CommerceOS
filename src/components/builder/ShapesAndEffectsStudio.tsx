import React from 'react';
import { Layout, Sliders, Eye, Sparkles, Check } from 'lucide-react';
import { RadiusPreset, StoreTheme } from '../../types';

interface ShapesAndEffectsStudioProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
}

export const ShapesAndEffectsStudio: React.FC<ShapesAndEffectsStudioProps> = ({ draftTheme, onThemeChange }) => {
  const currentRadius = draftTheme.customRadiusPx !== undefined 
    ? draftTheme.customRadiusPx 
    : draftTheme.radius === 'none' ? 0 
    : draftTheme.radius === 'sm' ? 8 
    : draftTheme.radius === 'md' ? 16 
    : draftTheme.radius === 'lg' ? 24 : 32;

  const handleRadiusSlider = (px: number) => {
    onThemeChange(prev => ({
      ...prev,
      customRadiusPx: px,
      radius: px === 0 ? 'none' : px <= 8 ? 'sm' : px <= 16 ? 'md' : px <= 24 ? 'lg' : 'full'
    }));
  };

  const handlePresetRadius = (preset: RadiusPreset, px: number) => {
    onThemeChange(prev => ({
      ...prev,
      radius: preset,
      customRadiusPx: px
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Precision Corner Radius */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">
            انحناء واستدارة الحواف والبطاقات (Border Radius)
          </label>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-400 font-bold">
            {currentRadius}px
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min="0"
          max="36"
          step="2"
          value={currentRadius}
          onChange={(e) => handleRadiusSlider(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        {/* Preset Chips */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {[
            { id: 'none' as const, label: 'حادة 0px', px: 0 },
            { id: 'sm' as const, label: 'ناعمة 8px', px: 8 },
            { id: 'md' as const, label: 'وسط 16px', px: 16 },
            { id: 'lg' as const, label: 'دائرية 24px', px: 24 },
            { id: 'full' as const, label: 'كبسولة', px: 36 }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => handlePresetRadius(r.id, r.px)}
              className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                currentRadius === r.px
                  ? 'border-amber-500 bg-amber-500/15 text-white'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Live Visual Card Shape Preview */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <div 
            className="w-20 h-10 bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-300 transition-all"
            style={{ borderRadius: `${currentRadius}px` }}
          >
            زر تجريبي
          </div>
          <div 
            className="w-28 h-14 bg-slate-900 border border-amber-500/40 flex items-center justify-center text-[10px] font-bold text-amber-300 transition-all"
            style={{ borderRadius: `${currentRadius}px` }}
          >
            بطاقة منتج
          </div>
        </div>
      </div>

      {/* 2. Button Styling Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-300">طراز وتأثير الأزرار التفاعلية (Button Styling)</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'solid', label: 'مصمت كلاسيكي (Solid)', desc: 'لون موحد واضح ومقروء' },
            { id: 'gradient', label: 'تدرج لوني انسيابي (Gradient)', desc: 'تدرج فخم من درجات علامتك' },
            { id: 'glow', label: 'توهج نيون مشع (Glow)', desc: 'إضاءة محيطية ساحرة للأزرار' },
            { id: 'outline', label: 'إطار أنيق مفرغ (Outline)', desc: 'خلفية شفافة مع خط محيطي ملون' },
          ].map(btn => {
            const isSelected = (draftTheme.buttonStyle || 'solid') === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => onThemeChange(prev => ({ ...prev, buttonStyle: btn.id as any }))}
                className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 text-white font-bold shadow-sm'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs font-bold text-slate-200">{btn.label}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                </div>
                <span className="text-[10px] text-slate-500">{btn.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Card Styling Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-300">مظهر بطاقات المنتجات (Card Elevation & Material)</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'flat', label: 'مسطح بإطار', desc: 'بسيط وهادئ' },
            { id: 'elevated', label: 'ظلال ثلاثية', desc: 'عمق وارتفاع' },
            { id: 'glass', label: 'زجاجي Blur', desc: 'شفافية بلورية' },
          ].map(card => {
            const isSelected = (draftTheme.cardStyle || 'flat') === card.id;
            return (
              <button
                key={card.id}
                onClick={() => onThemeChange(prev => ({ ...prev, cardStyle: card.id as any }))}
                className={`p-3 rounded-xl border text-right transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{card.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{card.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Header Navigation Style */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-300">طراز الترويسة وشريط التنقل (Header Style)</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'glass', label: 'عائم زجاجي', desc: 'خلفية بلورية تفاعلية' },
            { id: 'solid', label: 'ثابت موحد', desc: 'خلفية بلون متناسق' },
            { id: 'minimal', label: 'مينيمال شفاف', desc: 'بدون حدود أو فواصل' },
          ].map(head => {
            const isSelected = (draftTheme.headerStyle || 'glass') === head.id;
            return (
              <button
                key={head.id}
                onClick={() => onThemeChange(prev => ({ ...prev, headerStyle: head.id as any }))}
                className={`p-3 rounded-xl border text-right transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/15 text-white font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-slate-200">{head.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{head.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
