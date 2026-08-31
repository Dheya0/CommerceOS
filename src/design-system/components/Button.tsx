import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-[#D4AF37] hover:bg-[#C59B27] active:bg-[#A9801C] 
    text-[#07111F] font-bold 
    shadow-sm hover:shadow-[0_0_20px_rgba(212,175,55,0.25)]
    border border-[#E0C77A]/40
    focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
  `,
  secondary: `
    bg-[#101C2C] hover:bg-[#142238] active:bg-[#0B1626] 
    text-[#F1F5F9] font-semibold 
    border border-white/10 hover:border-white/20
    shadow-xs
    focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
  `,
  tertiary: `
    bg-transparent hover:bg-white/5 active:bg-white/10
    text-[#94A3B8] hover:text-[#F1F5F9] font-medium
    border border-transparent
    focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
  `,
  ghost: `
    bg-transparent hover:bg-white/5 active:bg-white/10
    text-[#CBD5E1] hover:text-white font-medium
    border border-transparent
    focus-visible:ring-2 focus-visible:ring-white/20
  `,
  danger: `
    bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30
    text-rose-400 font-semibold
    border border-rose-500/30 hover:border-rose-500/50
    focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
  `,
  success: `
    bg-emerald-500/10 hover:bg-emerald-500/20 active:bg-emerald-500/30
    text-emerald-400 font-semibold
    border border-emerald-500/30 hover:border-emerald-500/50
    focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07111F]
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-md min-h-[28px]',
  sm: 'px-3 py-1.5 text-xs gap-2 rounded-lg min-h-[34px]',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg min-h-[40px]',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl min-h-[48px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          transition-all duration-150 ease-out
          outline-none select-none
          whitespace-nowrap cursor-pointer
          disabled:opacity-45 disabled:cursor-not-allowed disabled:pointer-events-none
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        )}
        {!isLoading && leftIcon && (
          <span className="shrink-0 flex items-center">{leftIcon}</span>
        )}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && (
          <span className="shrink-0 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  ariaLabel: string;
  icon: React.ReactNode;
  tooltip?: string;
}

const iconSizeStyles: Record<ButtonSize, string> = {
  xs: 'w-7 h-7 p-1 rounded-md text-xs',
  sm: 'w-8 h-8 p-1.5 rounded-lg text-sm',
  md: 'w-10 h-10 p-2 rounded-lg text-base',
  lg: 'w-12 h-12 p-2.5 rounded-xl text-lg',
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      ariaLabel,
      icon,
      tooltip,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        title={tooltip || ariaLabel}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          transition-all duration-150 ease-out
          outline-none select-none cursor-pointer
          disabled:opacity-40 disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${iconSizeStyles[size]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
