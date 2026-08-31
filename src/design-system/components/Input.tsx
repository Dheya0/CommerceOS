import React, { useState } from 'react';
import { Search, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', leftIcon, rightIcon, error, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute start-3.5 text-[#94A3B8] pointer-events-none flex items-center justify-center">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full bg-[#07111F] text-white placeholder-[#64748B] text-sm rounded-lg border ${
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
          } ${
            leftIcon ? 'ps-10' : 'ps-4'
          } ${
            rightIcon ? 'pe-10' : 'pe-4'
          } py-2.5 focus:outline-none focus:ring-2 transition-all duration-200 ${
            disabled ? 'opacity-50 cursor-not-allowed bg-black/20' : ''
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute end-3.5 text-[#94A3B8] flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onSearch?: (val: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ className = '', ...props }) => {
  return (
    <Input
      leftIcon={<Search className="w-4 h-4 text-[#94A3B8]" />}
      placeholder="بحث (Search)..."
      className={className}
      {...props}
    />
  );
};

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

export const PasswordInput: React.FC<PasswordInputProps> = ({ className = '', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      leftIcon={<Lock className="w-4 h-4 text-[#94A3B8]" />}
      rightIcon={
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[#94A3B8] hover:text-white transition-colors focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
      className={className}
      {...props}
    />
  );
};

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', error, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full bg-[#07111F] text-white placeholder-[#64748B] text-sm rounded-lg border ${
          error
            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
        } p-3.5 focus:outline-none focus:ring-2 transition-all duration-200 resize-y min-h-[100px] ${
          disabled ? 'opacity-50 cursor-not-allowed bg-black/20' : ''
        } ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', options, error, disabled, ...props }, ref) => {
    return (
      <div className="relative flex items-center w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full bg-[#07111F] text-white text-sm rounded-lg border appearance-none ${
            error
              ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-white/10 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
          } px-4 py-2.5 pe-10 focus:outline-none focus:ring-2 transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed bg-black/20' : ''
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0B1626] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute end-3.5 text-[#94A3B8] pointer-events-none flex items-center justify-center">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';
