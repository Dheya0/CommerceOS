import React from 'react';

export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'gold';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  gold: 'bg-[#D4AF37]/15 text-[#E0C77A] border-[#D4AF37]/40 shadow-[0_0_12px_rgba(212,175,55,0.15)]',
};

const badgeSizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1 rounded-md font-semibold',
  md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-bold',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  icon,
  children,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center select-none border whitespace-nowrap
        ${badgeVariants[variant]}
        ${badgeSizes[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`
            w-1.5 h-1.5 rounded-full shrink-0
            ${variant === 'success' ? 'bg-emerald-400 animate-pulse' : ''}
            ${variant === 'warning' ? 'bg-amber-400' : ''}
            ${variant === 'danger' ? 'bg-rose-400' : ''}
            ${variant === 'info' ? 'bg-sky-400' : ''}
            ${variant === 'gold' ? 'bg-[#D4AF37]' : ''}
            ${variant === 'neutral' ? 'bg-slate-400' : ''}
          `}
        />
      )}
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};

export type HealthStatus = 'healthy' | 'degraded' | 'failed' | 'pending' | 'offline';

export interface StatusBadgeProps {
  status: HealthStatus;
  label?: string;
  className?: string;
}

const statusConfig: Record<HealthStatus, { variant: BadgeVariant; defaultLabel: string }> = {
  healthy: { variant: 'success', defaultLabel: 'نشط / سليم' },
  degraded: { variant: 'warning', defaultLabel: 'أداء منخفض' },
  failed: { variant: 'danger', defaultLabel: 'معطل / خطأ' },
  pending: { variant: 'info', defaultLabel: 'قيد الانتظار' },
  offline: { variant: 'neutral', defaultLabel: 'غير متصل' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, className = '' }) => {
  const cfg = statusConfig[status];
  return (
    <Badge variant={cfg.variant} dot size="sm" className={className}>
      {label || cfg.defaultLabel}
    </Badge>
  );
};
