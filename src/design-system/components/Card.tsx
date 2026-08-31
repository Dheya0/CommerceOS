import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Loader2 } from 'lucide-react';

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'glass' | 'warning' | 'danger';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3.5',
  md: 'p-5',
  lg: 'p-6 md:p-8',
};

const cardVariantStyles: Record<CardVariant, string> = {
  default: 'bg-[#101C2C] border border-white/10 shadow-sm text-[#F1F5F9]',
  elevated: 'bg-[#142238] border border-white/12 shadow-md text-[#F1F5F9]',
  interactive: 'bg-[#101C2C] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#142238] hover:shadow-[0_4px_20px_rgba(212,175,55,0.12)] cursor-pointer transition-all duration-200 text-[#F1F5F9]',
  glass: 'bg-[#101C2C]/70 backdrop-blur-md border border-white/10 shadow-md text-[#F1F5F9]',
  warning: 'bg-amber-950/20 border border-amber-500/30 text-amber-200',
  danger: 'bg-rose-950/20 border border-rose-500/30 text-rose-200',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`rounded-xl ${cardVariantStyles[variant]} ${paddingStyles[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  comparison?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  icon,
  comparison,
  isLoading = false,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        p-5 rounded-xl bg-[#101C2C] border border-white/10 shadow-xs
        ${onClick ? 'hover:border-[#D4AF37]/40 hover:bg-[#142238] cursor-pointer transition-all duration-200' : ''}
        ${className}
      `}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-[#94A3B8] tracking-wide">{label}</span>
        {icon && (
          <div className="p-2 rounded-lg bg-[#0B1626] border border-white/5 text-[#D4AF37] flex items-center justify-center shrink-0">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="h-8 w-28 bg-[#1E293B] animate-pulse rounded-md" />
        ) : (
          <p className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-[#F8FAFC]">
            {value}
          </p>
        )}
      </div>

      {(trend || comparison) && (
        <div className="mt-2.5 flex items-center gap-2 flex-wrap text-xs">
          {trend && (
            <span
              className={`
                inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md text-[11px] font-mono
                ${trend.direction === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}
                ${trend.direction === 'down' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : ''}
                ${trend.direction === 'neutral' ? 'bg-slate-800 text-slate-300' : ''}
              `}
            >
              {trend.direction === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trend.direction === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
              <span>{trend.value}</span>
            </span>
          )}
          {comparison && <span className="text-[#64748B] text-[11px]">{comparison}</span>}
        </div>
      )}
    </div>
  );
};

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  headerAction,
  isLoading = false,
  children,
  className = '',
}) => {
  return (
    <div className={`p-5 md:p-6 rounded-xl bg-[#101C2C] border border-white/10 shadow-sm ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-bold text-[#F1F5F9]">{title}</h3>
          {subtitle && <p className="text-xs text-[#64748B] mt-0.5">{subtitle}</p>}
        </div>
        {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
      </div>

      <div className="pt-4 relative min-h-[220px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#101C2C]/80 backdrop-blur-xs rounded-lg">
            <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};
