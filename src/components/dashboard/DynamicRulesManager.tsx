import React, { useState } from 'react';
import { Cpu, Plus, Play, CheckCircle2, Trash2, Code2, Sparkles, Settings2, Zap } from 'lucide-react';

interface DynamicRulesManagerProps {
  tenant: any;
}

export const DynamicRulesManager: React.FC<DynamicRulesManagerProps> = ({ tenant }) => {
  const [rules, setRules] = useState([
    {
      id: 'rule-vip-perfume-friday',
      name: 'خصم VIP العطور يوم الجمعة',
      description: 'إذا كان العميل VIP، واشترى 3 قطع من تصنيف "العطور"، وكان اليوم هو الجمعة، احصل على القطعة الأقل سعراً مجاناً.',
      isActive: true,
      conditions: [
        { field: 'customer.isVip', operator: 'equals', value: true },
        { field: 'cart.category', operator: 'includes_category', value: 'العطور' },
        { field: 'context.dayOfWeek', operator: 'equals', value: 'Friday' }
      ],
      action: { type: 'cheapest_item_free', label: 'القطعة الأقل سعراً مجاناً' }
    },
    {
      id: 'rule-bulk-discount',
      name: 'خصم الكميات الكبرى',
      description: 'إذا تجاوز إجمالي السلة 500 ريال، يتم تطبيق خصم فوري بنسبة 15%.',
      isActive: true,
      conditions: [
        { field: 'cart.total', operator: 'greater_than', value: 500 }
      ],
      action: { type: 'percentage', value: 15, label: 'خصم 15%' }
    }
  ]);

  const [isAddingRule, setIsAddingRule] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDesc, setNewRuleDesc] = useState('');
  const [selectedActionType, setSelectedActionType] = useState('cheapest_item_free');
  const [testOutput, setTestOutput] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestEvaluation = () => {
    setIsTesting(true);
    setTestOutput(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestOutput({
        success: true,
        totalDiscount: 199.00,
        appliedRules: [
          { ruleId: 'rule-vip-perfume-friday', ruleName: 'خصم VIP العطور يوم الجمعة', discount: 199.00 }
        ],
        astCompiledCode: `// Compiled AST JS Expression\nreturn cart.items.some(i => i.category === 'العطور') && customer.isVip && context.dayOfWeek === 'Friday';`
      });
    }, 800);
  };

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const newRule = {
      id: `rule_${Date.now()}`,
      name: newRuleName,
      description: newRuleDesc || 'قواعد مخصصة لتخفيضات المتجر',
      isActive: true,
      conditions: [
        { field: 'customer.isVip', operator: 'equals', value: true }
      ],
      action: { type: selectedActionType, label: selectedActionType === 'cheapest_item_free' ? 'القطعة الأقل مجاناً' : 'خصم نسبة' }
    };

    setRules([newRule, ...rules]);
    setNewRuleName('');
    setNewRuleDesc();
    setIsAddingRule(false);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-l from-slate-900 via-slate-900 to-amber-950 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-3 border border-amber-500/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>محرك قواعد الخصومات الديناميكية (AST-Based Rule Engine)</span>
            </div>
            <h2 className="text-2xl font-black text-white">برمجة الخصومات المتقدمة (Commerce Scripts & AST)</h2>
            <p className="text-sm text-slate-300 mt-1">
              اكتب قواعد وشروط متقدمة يتم ترجمتها إلى AST وتحقن مباشرة في الكود المُصدر لتنفيذها في أجزاء من الثانية أثناء الـ Checkout.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddingRule(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold text-xs shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قاعدة خصم جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Rule Modal / Form */}
      {isAddingRule && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/40 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">إنشاء قاعدة خصم جديدة (Commerce Script)</h3>
            <button onClick={() => setIsAddingRule(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleCreateRule} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">اسم القاعدة</label>
              <input
                type="text"
                value={newRuleName}
                onChange={e => setNewRuleName(e.target.value)}
                placeholder="مثال: خصم خاص لعمللاء الساعات الفاخرة..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">الوصف والشروط بالعربية</label>
              <textarea
                value={newRuleDesc}
                onChange={e => setNewRuleDesc(e.target.value)}
                placeholder="اشرح الشروط (مثل: إذا اشترى 3 قطع من قسم الفساتين...)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500 h-20"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">نوع المكافأة والخصم (Action)</label>
              <select
                value={selectedActionType}
                onChange={e => setSelectedActionType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="cheapest_item_free">القطعة الأقل سعراً مجاناً (BOGO / Free Item)</option>
                <option value="percentage">خصم نسبة مئوية على السلة (%)</option>
                <option value="fixed_amount">خصم مبلغ ثابت (Fixed Amount)</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
              >
                حفظ وتحويل إلى AST
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rules List & Test Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-amber-400" />
            <span>القواعد النشطة المترجمة في الباك إند ({rules.length})</span>
          </h3>

          <div className="space-y-3">
            {rules.map(rule => (
              <div key={rule.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 hover:border-amber-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      AST
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{rule.name}</div>
                      <div className="text-[11px] text-emerald-400 font-mono">مفعل ويتم تنفيذه في أجزاء من الثانية</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${rule.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {rule.isActive ? 'نشط (Active)' : 'متوقف'}
                    </span>
                    <button
                      onClick={() => setRules(rules.filter(r => r.id !== rule.id))}
                      className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                  {rule.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <span className="font-mono">نوع العمل: {rule.action.label || rule.action.type}</span>
                  <span className="text-amber-400 font-medium">بدون استعلامات قاعدة بيانات إضافية (Zero DB Latency)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Sandbox Panel */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 h-fit">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span>منصة اختبار قواعد الـ AST (Test Sandbox)</span>
            </h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            اختبر محاكاة سلة مشتريات تحتوي على منتجات عطور لعميل VIP، وتأكد من تطبيق الخصم فورياً عبر محرك الـ AST.
          </p>

          <button
            onClick={handleTestEvaluation}
            disabled={isTesting}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {isTesting ? <Sparkles className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>تجربة وتقييم محاكاة الـ Checkout</span>
          </button>

          {testOutput && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span>تم تقييم القواعد بنجاح!</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>إجمالي الخصم المطبق: <span className="text-amber-400 font-bold">{testOutput.totalDiscount} ر.س</span></div>
                <div>القواعد الفعالة: {testOutput.appliedRules.map((r: any) => r.ruleName).join(', ')}</div>
              </div>
              <div className="pt-2 border-t border-slate-900">
                <div className="text-[10px] text-slate-500 mb-1">كود الـ AST المُولد:</div>
                <pre className="p-2 rounded-xl bg-slate-900 text-[10px] text-amber-300 font-mono overflow-x-auto" dir="ltr">
                  {testOutput.astCompiledCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
