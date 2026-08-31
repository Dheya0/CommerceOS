import React, { useState } from 'react';
import { Bell, CheckCheck, ShoppingBag, CreditCard, Package, Store, Shield, AlertTriangle, X, CheckCircle2 } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

interface NotificationItem {
  id: string;
  category: 'Order' | 'Payment' | 'Inventory' | 'Store' | 'System' | 'Security';
  title: string;
  description: string;
  timestamp: string;
  unread: boolean;
  severity: 'critical' | 'warning' | 'info';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { language } = useCommerce();
  const isAr = language === 'ar';

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      category: 'Order',
      title: isAr ? 'طلب جديد #1048' : 'New Order #1048',
      description: isAr ? 'طلب جديد بقيمة 450 ريال من عميل جديد.' : 'New order worth 450 SAR received.',
      timestamp: isAr ? 'منذ 5 دقائق' : '5 mins ago',
      unread: true,
      severity: 'info'
    },
    {
      id: 'n2',
      category: 'Inventory',
      title: isAr ? 'تنبيه مخزون منخفض' : 'Low Stock Alert',
      description: isAr ? 'المنتج "ساعة ذهبية فاخرة" وصل إلى الحد الأدنى (قطعتان).' : '"Luxury Gold Watch" stock reached threshold (2 left).',
      timestamp: isAr ? 'منذ ساعة' : '1 hour ago',
      unread: true,
      severity: 'warning'
    },
    {
      id: 'n3',
      category: 'Payment',
      title: isAr ? 'فشل عملية دفع' : 'Payment Failed',
      description: isAr ? 'فشلت محاولة دفع للطلب #1042 عبر بطاقة مدى.' : 'Payment attempt failed for order #1042.',
      timestamp: isAr ? 'منذ 3 ساعات' : '3 hours ago',
      unread: false,
      severity: 'critical'
    },
    {
      id: 'n4',
      category: 'Security',
      title: isAr ? 'تسجيل دخول جديد' : 'New Login Detected',
      description: isAr ? 'تم تسجيل الدخول من جهاز جديد (متصفح كروم / الرياض).' : 'Login detected from new device (Chrome / Riyadh).',
      timestamp: isAr ? 'منذ يوم' : '1 day ago',
      unread: false,
      severity: 'info'
    }
  ]);

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const filteredNotifications = activeCategoryFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category.toLowerCase() === activeCategoryFilter.toLowerCase());

  if (!isOpen) return null;

  return (
    <div className="absolute end-0 top-12 w-80 sm:w-96 bg-[#0B1626] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#D4AF37]" />
          <h3 className="font-bold text-sm text-[#F8FAFC]">{isAr ? 'الإشعارات' : 'Notifications'}</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] rounded-full text-[10px] font-bold">
              {unreadCount} {isAr ? 'جديد' : 'new'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] text-[#94A3B8] hover:text-[#D4AF37] transition-colors px-2 py-1 rounded"
              title={isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-1 px-3 py-2 border-b border-white/10 overflow-x-auto text-[11px] bg-black/20">
        {['all', 'order', 'payment', 'inventory', 'store', 'security'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
              activeCategoryFilter === cat 
                ? 'bg-[#D4AF37] text-[#07111F] font-bold' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat === 'all' ? (isAr ? 'الكل' : 'All') : cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {filteredNotifications.length === 0 ? (
          <div className="py-10 text-center text-slate-400 text-xs">
            {isAr ? 'لا توجد إشعارات جديدة.' : 'No new notifications.'}
          </div>
        ) : (
          filteredNotifications.map(item => (
            <div 
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 transition-colors cursor-pointer flex gap-3 items-start ${
                item.unread ? 'bg-white/[0.04] hover:bg-white/[0.07]' : 'hover:bg-white/[0.02] opacity-75'
              }`}
            >
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                item.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' :
                item.severity === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/30'
              }`}>
                {item.category === 'Order' && <ShoppingBag className="w-3.5 h-3.5" />}
                {item.category === 'Payment' && <CreditCard className="w-3.5 h-3.5" />}
                {item.category === 'Inventory' && <Package className="w-3.5 h-3.5" />}
                {item.category === 'Store' && <Store className="w-3.5 h-3.5" />}
                {item.category === 'Security' && <Shield className="w-3.5 h-3.5" />}
                {item.category === 'System' && <AlertTriangle className="w-3.5 h-3.5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <span className="text-[10px] text-slate-500 shrink-0">{item.timestamp}</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{item.description}</p>
              </div>
              {item.unread && (
                <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0 self-center mt-1" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-white/10 text-center bg-black/20">
        <button 
          onClick={() => { markAllAsRead(); onClose(); }}
          className="text-xs text-[#D4AF37] hover:underline font-medium"
        >
          {isAr ? 'تمييز الكل كمقروء' : 'Mark all read'}
        </button>
      </div>
    </div>
  );
};
