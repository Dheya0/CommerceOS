import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, Sparkles, RefreshCw, Terminal, Download, Play } from 'lucide-react';
import { StoreTheme } from '../../types';
import { convertTokensToCSS, parseCSSToTokens } from '../../utils/themeEngine';

interface LiveCodeSyncStudioProps {
  draftTheme: StoreTheme;
  onThemeChange: (updater: (prev: StoreTheme) => StoreTheme) => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const LiveCodeSyncStudio: React.FC<LiveCodeSyncStudioProps> = ({
  draftTheme,
  onThemeChange,
  showToast
}) => {
  const [copied, setCopied] = useState(false);
  const [cssCode, setCssCode] = useState('');
  const [customCssCode, setCustomCssCode] = useState(draftTheme.customCss || '');

  // Keep generated CSS variables in sync with draftTheme
  useEffect(() => {
    setCssCode(convertTokensToCSS(draftTheme));
  }, [draftTheme]);

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    showToast('تم نسخ متغيرات CSS بنجاح!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync edits from CSS textarea back into visual theme tokens
  const handleApplyEditedCSS = () => {
    try {
      const parsedTokens = parseCSSToTokens(cssCode);
      if (Object.keys(parsedTokens).length > 0) {
        onThemeChange(prev => ({
          ...prev,
          tokens: {
            ...prev.tokens,
            ...parsedTokens
          }
        }));
        showToast('تمت مطابقة وتطبيق متغيرات CSS على المتجر بنجاح! ⚡', 'success');
      } else {
        showToast('لم يتم العثور على متغيرات CSS صالحة للتطبيق', 'info');
      }
    } catch (err) {
      showToast('حدث خطأ في معالجة كود CSS', 'error');
    }
  };

  // Save custom CSS rules into theme
  const handleSaveCustomCss = () => {
    onThemeChange(prev => ({
      ...prev,
      customCss: customCssCode
    }));
    showToast('تم حفظ وحقن كود CSS المخصص في المتجر! ✨', 'success');
  };

  // Preset CSS snippets
  const insertCssSnippet = (snippet: string, title: string) => {
    const updated = (customCssCode ? customCssCode + '\n\n' : '') + `/* ${title} */\n` + snippet;
    setCustomCssCode(updated);
    onThemeChange(prev => ({
      ...prev,
      customCss: updated
    }));
    showToast(`تم إدراج كود: ${title}`, 'success');
  };

  const handleDownloadThemeJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draftTheme, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `store-theme-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('تم تصدير ملف ثيم المتجر JSON بنجاح!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. Live Synchronized CSS Tokens */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              متغيرات التصميم الحية (Live CSS Tokens)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyCSS}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
            </button>
            <button
              onClick={handleDownloadThemeJson}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[11px] font-bold border border-slate-700 transition-colors"
              title="تصدير ملف JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400">
          أي تعديل تقوم به في الألوان أو الخطوط أو الحواف يتغير هنا تلقائياً في الكود لحظياً، ويمكنك أيضاً التعديل المباشر على الكود:
        </p>

        {/* Editable CSS Textarea */}
        <textarea
          value={cssCode}
          onChange={(e) => setCssCode(e.target.value)}
          rows={10}
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-300 focus:outline-none focus:border-amber-500 leading-relaxed dir-ltr text-left"
          spellCheck={false}
        />

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500">
            تعديل قيم Hex أو الأرقام ثم اضغط تطبيق
          </span>
          <button
            onClick={handleApplyEditedCSS}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>تطبيق الكود على المتجر</span>
          </button>
        </div>
      </div>

      {/* 2. Custom CSS Rules Injection */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-slate-200">
              حقن كود CSS مخصص (Custom Stylesheet)
            </span>
          </div>
          <button
            onClick={handleSaveCustomCss}
            className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
          >
            حقن وتفعيل
          </button>
        </div>

        <p className="text-[10px] text-slate-400">
          أضف أي قواعد CSS مخصصة لإضفاء لمسات جمالية فريدة على متجرك (تأثيرات حركة، هوفر، خطوط خارجية):
        </p>

        {/* Popular Snippets */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 block">إدراج تأثيرات جاهزة بنقرة واحدة:</span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => insertCssSnippet(
                `button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 10px 20px -5px rgba(212, 160, 23, 0.35);\n}`,
                'نبض وارتفاع الأزرار'
              )}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-amber-500/50 text-right transition-colors"
            >
              ✨ ارتفاع وتوهج الأزرار عند المرور
            </button>
            <button
              onClick={() => insertCssSnippet(
                `::-webkit-scrollbar {\n  width: 6px;\n}\n::-webkit-scrollbar-thumb {\n  background: #d4a017;\n  border-radius: 99px;\n}`,
                'شريط تمرير ذهبي رفيع'
              )}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-amber-500/50 text-right transition-colors"
            >
              📜 شريط تمرير ذهبي مصغر
            </button>
            <button
              onClick={() => insertCssSnippet(
                `.group:hover img {\n  filter: contrast(105%) brightness(102%);\n}`,
                'تحسين جودة صور المنتجات'
              )}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-amber-500/50 text-right transition-colors"
            >
              🖼️ إشراقة لصور المنتجات عند اللمس
            </button>
            <button
              onClick={() => insertCssSnippet(
                `@keyframes shimmer {\n  0% { background-position: -200% 0; }\n  100% { background-position: 200% 0; }\n}`,
                'حركة لمعان الشعار'
              )}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-amber-500/50 text-right transition-colors"
            >
              💫 تأثير البريق واللمعان
            </button>
          </div>
        </div>

        {/* Custom CSS text area */}
        <textarea
          value={customCssCode}
          onChange={(e) => setCustomCssCode(e.target.value)}
          rows={6}
          placeholder="/* اكتب أي كود CSS إضافي هنا ليتم حقنه في المتجر فوراً */"
          className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-sky-300 focus:outline-none focus:border-sky-500 leading-relaxed dir-ltr text-left"
          spellCheck={false}
        />
      </div>

    </div>
  );
};
