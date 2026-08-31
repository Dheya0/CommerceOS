import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error = false, disabled, className = '', checked, onChange, ...props }, ref) => {
    return (
      <label
        className={`
          inline-flex items-start gap-3 select-none cursor-pointer group
          ${disabled ? 'opacity-50 !cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-4 h-4 rounded border transition-all duration-150 ease-out flex items-center justify-center
              bg-[#0B1626] border-white/20
              peer-checked:bg-[#D4AF37] peer-checked:border-[#D4AF37] peer-checked:text-[#07111F]
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#07111F]
              group-hover:border-white/40
              ${error ? '!border-rose-500' : ''}
            `}
          >
            {checked && <Check className="w-3 h-3 stroke-[3] text-[#07111F]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs font-semibold text-[#CBD5E1] group-hover:text-white transition-colors">{label}</span>}
            {description && <span className="text-[11px] text-[#64748B]">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, disabled, className = '', checked, onChange, ...props }, ref) => {
    return (
      <label
        className={`
          inline-flex items-start gap-3 select-none cursor-pointer group
          ${disabled ? 'opacity-50 !cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            ref={ref}
            type="radio"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={`
              w-4 h-4 rounded-full border transition-all duration-150 ease-out flex items-center justify-center
              bg-[#0B1626] border-white/20
              peer-checked:border-[#D4AF37]
              peer-focus-visible:ring-2 peer-focus-visible:ring-[#D4AF37] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#07111F]
              group-hover:border-white/40
            `}
          >
            {checked && <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-xs font-semibold text-[#CBD5E1] group-hover:text-white transition-colors">{label}</span>}
            {description && <span className="text-[11px] text-[#64748B]">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);
Radio.displayName = 'Radio';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const isSm = size === 'sm';

  return (
    <label
      className={`
        inline-flex items-center justify-between gap-3 select-none cursor-pointer group
        ${disabled ? 'opacity-50 !cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {(label || description) && (
        <div className="flex flex-col me-2">
          {label && <span className="text-xs font-semibold text-[#CBD5E1] group-hover:text-white transition-colors">{label}</span>}
          {description && <span className="text-[11px] text-[#64748B]">{description}</span>}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative inline-flex shrink-0 transition-colors duration-200 ease-out rounded-full border border-transparent outline-none
          focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
          ${checked ? 'bg-[#D4AF37]' : 'bg-[#1E293B] hover:bg-[#334155]'}
          ${isSm ? 'w-8 h-4.5 p-0.5' : 'w-11 h-6 p-0.5'}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block rounded-full bg-[#07111F] shadow-sm transform transition duration-200 ease-out
            ${checked ? (isSm ? 'translate-x-3.5' : 'translate-x-5') : 'translate-x-0'}
            ${isSm ? 'w-3.5 h-3.5' : 'w-5 h-5'}
          `}
        />
      </button>
    </label>
  );
};
