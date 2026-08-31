import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Loader2, RefreshCw, X } from 'lucide-react';
import { Button } from './Button';

// Skeleton Primitives
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-[#1E293B] rounded-md ${className}`}
      {...props}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3.5 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`p-5 rounded-xl bg-[#101C2C] border border-white/10 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-36" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

// Spinner Primitive
export interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const spinnerSizes = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  return (
    <Loader2
      className={`animate-spin text-[#D4AF37] ${spinnerSizes[size]} ${className}`}
    />
  );
};

// Progress Bar
export interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  variant?: 'gold' | 'emerald' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'gold',
  size = 'md',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const variantBar = {
    gold: 'bg-[#D4AF37]',
    emerald: 'bg-emerald-500',
    rose: 'bg-rose-500',
  }[variant];

  return (
    <div
      className={`w-full bg-[#1E293B] rounded-full overflow-hidden ${
        size === 'sm' ? 'h-1.5' : 'h-2.5'
      } ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ease-out ${variantBar}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

// Empty State
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`
        p-8 md:p-12 text-center rounded-2xl bg-[#101C2C]/50 border border-white/5
        flex flex-col items-center justify-center max-w-lg mx-auto
        ${className}
      `}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#0B1626] border border-white/10 text-[#D4AF37] flex items-center justify-center mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-[#F1F5F9]">{title}</h3>
      <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-sm">
        {description}
      </p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
          {primaryAction && (
            <Button
              variant="primary"
              size="sm"
              onClick={primaryAction.onClick}
              leftIcon={primaryAction.icon}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="secondary"
              size="sm"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Error State
export interface ErrorStateProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'حدث خطأ أثناء تحميل البيانات',
  description,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`
        p-6 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200
        flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-rose-100">{title}</h4>
          <p className="text-xs text-rose-300/80 mt-0.5">{description}</p>
        </div>
      </div>

      {onRetry && (
        <Button
          variant="danger"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          إعادة المحاولة
        </Button>
      )}
    </div>
  );
};
