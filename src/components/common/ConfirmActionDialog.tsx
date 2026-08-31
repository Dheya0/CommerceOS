import React, { useEffect, useRef } from 'react';
import { AlertTriangle, AlertCircle, X, ShieldAlert, CheckCircle2, DollarSign, Trash2 } from 'lucide-react';

export type ConfirmVariant = 'danger' | 'warning' | 'info' | 'refund';

export interface RefundDetails {
  orderNumber: string;
  originalAmount: number;
  alreadyRefunded: number;
  refundAmount: number;
  remainingAmount: number;
  currency: string;
  reason: string;
}

interface ConfirmActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  isLoading?: boolean;
  refundDetails?: RefundDetails;
}

export const ConfirmActionDialog: React.FC<ConfirmActionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'تأكيد الإجراء',
  cancelText = 'إلغاء',
  variant = 'danger',
  isLoading = false,
  refundDetails
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        confirmButtonRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isLoading) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'refund':
        return {
          icon: DollarSign,
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          btnBg: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30',
          accentBorder: 'border-emerald-500/30'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          btnBg: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30',
          accentBorder: 'border-amber-500/30'
        };
      case 'info':
        return {
          icon: AlertCircle,
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          btnBg: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30',
          accentBorder: 'border-blue-500/30'
        };
      case 'danger':
      default:
        return {
          icon: Trash2,
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          btnBg: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30',
          accentBorder: 'border-rose-500/30'
        };
    }
  };

  const styles = getVariantStyles();
  const IconComponent = styles.icon;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading) onClose();
      }}
    >
      <div 
        ref={dialogRef}
        className={`w-full max-w-md bg-zinc-900 border ${styles.accentBorder} rounded-3xl p-6 shadow-2xl space-y-5 text-right animate-in zoom-in-95 duration-200`}
        dir="rtl"
      >
        {/* Header with Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${styles.iconBg}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-dialog-title" className="text-base font-black text-white">
                {title}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                تأكيد الإجراء الحساس
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-50"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p id="confirm-dialog-description" className="text-xs text-zinc-300 leading-relaxed">
          {description}
        </p>

        {/* Refund Details Breakdown (if applicable) */}
        {variant === 'refund' && refundDetails && (
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-zinc-400">
              <span>رقم الطلب:</span>
              <span className="font-mono font-bold text-zinc-200">{refundDetails.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>القيمة الإجمالية للطلب:</span>
              <span className="font-mono font-bold text-zinc-200">{refundDetails.originalAmount} {refundDetails.currency}</span>
            </div>
            {refundDetails.alreadyRefunded > 0 && (
              <div className="flex justify-between items-center text-amber-400">
                <span>تم استرجاعه سابقاً:</span>
                <span className="font-mono font-bold">{refundDetails.alreadyRefunded} {refundDetails.currency}</span>
              </div>
            )}
            <div className="border-t border-zinc-800/80 pt-2 flex justify-between items-center font-bold text-emerald-400">
              <span>المبلغ المراد استرجاعه الآن:</span>
              <span className="font-mono text-sm">{refundDetails.refundAmount} {refundDetails.currency}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>المتبقي بعد العملية:</span>
              <span className="font-mono text-zinc-300">{refundDetails.remainingAmount} {refundDetails.currency}</span>
            </div>
            {refundDetails.reason && (
              <div className="border-t border-zinc-800/80 pt-2 text-[11px] text-zinc-400">
                <span className="font-bold text-zinc-300">سبب الاسترجاع:</span> {refundDetails.reason}
              </div>
            )}
          </div>
        )}

        {/* Actions Button Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg flex items-center gap-2 ${styles.btnBg} disabled:opacity-50`}
          >
            {isLoading && (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
