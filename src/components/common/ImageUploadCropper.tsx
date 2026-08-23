import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Crop, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Check, 
  X, 
  Sparkles, 
  Image as ImageIcon,
  Smartphone,
  Globe,
  Sliders,
  Maximize2,
  RefreshCw,
  Eye
} from 'lucide-react';

export interface ImageUploadCropperProps {
  initialImage?: string;
  onImageChange: (imageUrl: string) => void;
  aspectRatio?: number; // e.g., 1 for square (1:1), 16/9 for banner, etc.
  cropTitle?: string;
  recommendedSize?: string;
  isLogoMode?: boolean; // If true, shows favicon (.ico) & app icon preview
  accentColor?: string;
}

export const ImageUploadCropper: React.FC<ImageUploadCropperProps> = ({
  initialImage = '',
  onImageChange,
  aspectRatio = 1,
  cropTitle = 'تخصيص وضبط الصورة',
  recommendedSize = '512x512 بكسل (PNG, WebP, SVG)',
  isLogoMode = true,
  accentColor = '#D4A017'
}) => {
  const [currentImage, setCurrentImage] = useState<string>(initialImage);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState<boolean>(false);
  
  // Crop & Transform state
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [cropShape, setCropShape] = useState<'square' | 'circle' | 'squircle'>('squircle');
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (initialImage) {
      setCurrentImage(initialImage);
    }
  }, [initialImage]);

  // Handle File Input from Device
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setRawImageSrc(result);
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle URL confirmation
  const handleUrlConfirm = () => {
    if (urlInput.trim()) {
      setRawImageSrc(urlInput.trim());
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
      setIsCropModalOpen(true);
    }
  };

  // Load Image Object when rawImageSrc changes
  useEffect(() => {
    if (rawImageSrc) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageObjRef.current = img;
        drawCanvas();
      };
      img.onerror = () => {
        // Fallback for CORS restricted images
        imageObjRef.current = img;
        drawCanvas();
      };
      img.src = rawImageSrc;
    }
  }, [rawImageSrc]);

  // Redraw Canvas when transforms change
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img || !img.width) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save context state
    ctx.save();

    // Center and transform
    ctx.translate(canvasWidth / 2 + position.x, canvasHeight / 2 + position.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect ratio fit
    const imgAspect = img.width / img.height;
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;

    if (imgAspect > 1) {
      drawHeight = canvasWidth / imgAspect;
    } else {
      drawWidth = canvasHeight * imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

    ctx.restore();
  }, [position, rotation, zoom]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Mouse / Touch Dragging for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Export cropped canvas
  const handleApplyCrop = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const croppedDataUrl = canvas.toDataURL('image/png', 0.95);
        setCurrentImage(croppedDataUrl);
        onImageChange(croppedDataUrl);
        setIsCropModalOpen(false);
      } catch (err) {
        // Fallback if canvas is tainted by CORS
        if (rawImageSrc) {
          setCurrentImage(rawImageSrc);
          onImageChange(rawImageSrc);
        }
        setIsCropModalOpen(false);
      }
    }
  };

  const handleDirectUseWithoutCrop = () => {
    if (rawImageSrc) {
      setCurrentImage(rawImageSrc);
      onImageChange(rawImageSrc);
    }
    setIsCropModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Visual Preview & Quick Trigger Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border bg-slate-900/60 border-slate-800">
        
        {/* Logo / Image Display */}
        <div className="relative group shrink-0">
          <div className={`w-24 h-24 overflow-hidden border-2 flex items-center justify-center bg-slate-950 transition-all ${
            cropShape === 'circle' ? 'rounded-full' : cropShape === 'squircle' ? 'rounded-2xl' : 'rounded-lg'
          }`} style={{ borderColor: accentColor }}>
            {currentImage ? (
              <img 
                src={currentImage} 
                alt="Store Visual" 
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-slate-600" />
            )}
          </div>

          {currentImage && (
            <button
              onClick={() => {
                setRawImageSrc(currentImage);
                setIsCropModalOpen(true);
              }}
              title="قص وتعديل الصورة الحالية"
              className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500 text-slate-950 shadow-lg hover:scale-110 transition-transform"
            >
              <Crop className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Input Choices & Instructions */}
        <div className="flex-1 text-right space-y-2 w-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {isLogoMode ? 'شعار المتجر والأيقونة الرسمية' : 'الصورة البصرية'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {recommendedSize}
            </span>
          </div>

          {/* Toggle Tab: File Upload vs URL */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setInputMode('upload')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                inputMode === 'upload' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع ملف من جهازك</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                inputMode === 'url' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>رابط صورة مباشر</span>
            </button>
          </div>

          {/* Input Control Area */}
          {inputMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/svg+xml, image/x-icon"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/40 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center gap-2 transition-all group"
              >
                <Upload className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
                <span>اختر ملف من جهازك (PNG, WebP, SVG, JPG)</span>
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://example.com/logo.png"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 py-1.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono text-left"
                dir="ltr"
              />
              <button
                type="button"
                onClick={handleUrlConfirm}
                disabled={!urlInput.trim()}
                className="py-1.5 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold flex items-center gap-1 shrink-0"
              >
                <span>ضبط وقص</span>
                <Crop className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Sample quick icons */}
          {isLogoMode && (
            <div className="flex items-center gap-2 pt-1 overflow-x-auto text-[11px] text-slate-400">
              <span>نماذج جاهزة:</span>
              {[
                { name: 'عسل ملكي', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=80' },
                { name: 'بن مختص', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80' },
                { name: 'أزياء فاخرة', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80' },
                { name: 'عطور وبخور', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&auto=format&fit=crop&q=80' },
                { name: 'إلكترونيات', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80' }
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRawImageSrc(sample.url);
                    setZoom(1);
                    setRotation(0);
                    setPosition({ x: 0, y: 0 });
                    setIsCropModalOpen(true);
                  }}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Crop & Tuning Modal */}
      {isCropModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2 text-right">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <Crop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-100">{cropTitle}</h3>
                  <p className="text-xs text-slate-400">اسحب وحرك الصورة للتحكم بمركز الظهور، ثم اضبط التكبير والشكل</p>
                </div>
              </div>

              <button
                onClick={() => setIsCropModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Editor & Previews */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Interactive Crop Canvas */}
              <div className="md:col-span-7 flex flex-col items-center justify-center">
                <div 
                  className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-amber-500/60 rounded-2xl overflow-hidden bg-slate-950 cursor-grab active:cursor-grabbing shadow-inner flex items-center justify-center select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    className="w-full h-full object-contain"
                  />

                  {/* Mask Outline overlay */}
                  <div className={`absolute inset-0 pointer-events-none border-2 transition-all ${
                    cropShape === 'circle' ? 'rounded-full border-amber-400' :
                    cropShape === 'squircle' ? 'rounded-3xl border-amber-400' : 'rounded-none border-amber-400'
                  }`} />

                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-slate-900/80 text-[10px] font-bold text-amber-300 pointer-events-none">
                    اسحب للتحريك ✋
                  </div>
                </div>

                {/* Canvas Controls: Zoom, Rotate, Shape */}
                <div className="w-full max-w-xs mt-4 space-y-3">
                  {/* Zoom Slider */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>

                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-1 accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />

                    <button
                      type="button"
                      onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Rotate & Reset Controls */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRotation(prev => (prev + 90) % 360)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>تدوير 90°</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setZoom(1);
                          setRotation(0);
                          setPosition({ x: 0, y: 0 });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>إعادة ضبط</span>
                      </button>
                    </div>

                    {/* Shape Presets */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                      <button
                        type="button"
                        onClick={() => setCropShape('squircle')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          cropShape === 'squircle' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        ناعم
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropShape('circle')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          cropShape === 'circle' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        دائري
                      </button>
                      <button
                        type="button"
                        onClick={() => setCropShape('square')}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          cropShape === 'square' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                        }`}
                      >
                        مربع
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Column (Browser Favicon, App Icon, Header) */}
              <div className="md:col-span-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-4 text-right">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>المعاينة الحية للشعار</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    PNG / ICO جاهز
                  </span>
                </div>

                {/* 1. Browser Tab Favicon Preview */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>أيقونة تبويب المتصفح (Favicon .ico)</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-2 flex items-center gap-2 max-w-[200px]">
                    <div className="w-4 h-4 rounded-sm overflow-hidden bg-white shrink-0">
                      {rawImageSrc && (
                        <img src={rawImageSrc} alt="ico" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="text-[11px] text-slate-300 truncate font-sans">متجري الرسمي | الرئيسية</span>
                  </div>
                </div>

                {/* 2. Mobile App Icon (PWA / iOS / Android) */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                    <span>أيقونة تطبيق الجوال (iOS / Android Icon)</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg border border-slate-700 bg-slate-950">
                      {rawImageSrc && (
                        <img src={rawImageSrc} alt="app icon" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-200">تطبيق المتجر</div>
                      <div className="text-[10px] text-slate-400">جاهز للتثبيت السريع PWA</div>
                    </div>
                  </div>
                </div>

                {/* 3. Header Bar Preview */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-bold">معاينة الهيدر الرئيسي:</div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-950 border border-slate-700">
                        {rawImageSrc && (
                          <img src={rawImageSrc} alt="header logo" className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-black text-slate-100">اسم المتجر</div>
                        <div className="text-[9px] text-amber-400">المتجر الرسمي</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <button
                type="button"
                onClick={handleDirectUseWithoutCrop}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all"
              >
                استخدام الصورة كما هي بدون قص
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-bold transition-all"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  onClick={handleApplyCrop}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black shadow-xl hover:scale-105 flex items-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد وقص الشعار</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
