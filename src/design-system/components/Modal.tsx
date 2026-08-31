import React, { useEffect } from 'react';
import { X, AlertTriangle, Info, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
}

const modalSizes = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[94vw] min-h-[85vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  hideCloseButton = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#07111F]/85 backdrop-blur-md transition-opacity duration-200"
      />

      {/* Modal Dialog */}
      <div
        className={`
          relative w-full ${modalSizes[size]} bg-[#0B1626] border border-white/12 rounded-2xl shadow-2xl z-10
          overflow-hidden flex flex-col max-h-[90vh] my-auto animate-in zoom-in-95 duration-150
        `}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-[#101C2C]/50">
            <div>
              {title && typeof title === 'string' ? (
                <h3 className="text-base font-bold text-[#F1F5F9]">{title}</h3>
              ) : (
                title
              )}
              {description && <p className="text-xs text-[#64748B] mt-0.5">{description}</p>}
            </div>
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[#64748B] hover:text-[#F1F5F9] hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 border-t border-white/10 bg-[#101C2C]/50 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hideCloseButton>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div
            className={`
              p-2.5 rounded-xl shrink-0
              ${variant === 'danger' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
              ${variant === 'warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : ''}
              ${variant === 'primary' ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20' : ''}
            `}
          >
            {variant === 'danger' && <AlertTriangle className="w-5 h-5" />}
            {variant === 'warning' && <AlertTriangle className="w-5 h-5" />}
            {variant === 'primary' && <Info className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F1F5F9]">{title}</h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  position?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  position = 'right',
  size = 'md',
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div onClick={onClose} className="fixed inset-0 bg-[#07111F]/80 backdrop-blur-sm transition-opacity" />
      <div
        className={`
          fixed inset-y-0 ${position === 'right' ? 'end-0' : 'start-0'} w-full ${sizeClasses[size]}
          bg-[#0B1626] border-${position === 'right' ? 's' : 'e'} border-white/10 shadow-2xl z-10 flex flex-col
        `}
      >
        {title && (
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#F1F5F9]">{title}</h3>
            <button onClick={onClose} className="p-1 text-[#64748B] hover:text-white rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
