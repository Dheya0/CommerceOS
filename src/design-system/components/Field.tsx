import React from 'react';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

export interface FieldProps {
  id?: string;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  id,
  label,
  description,
  error,
  success,
  required,
  tooltip,
  className = '',
  children,
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold text-[#CBD5E1] flex items-center gap-1.5 select-none"
          >
            <span>{label}</span>
            {required && <span className="text-[#D4AF37] font-bold">*</span>}
            {tooltip && (
              <span className="text-[#64748B] hover:text-[#94A3B8] cursor-help" title={tooltip}>
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </label>
        </div>
      )}

      <div>{children}</div>

      {description && !error && !success && (
        <p className="text-[11px] text-[#64748B] leading-relaxed">{description}</p>
      )}

      {error && (
        <div className="flex items-center gap-1 text-[11px] font-medium text-rose-400">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
