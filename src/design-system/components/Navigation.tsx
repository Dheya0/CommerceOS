import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, X, Bell, Search, User } from 'lucide-react';
import { Button } from './Button';

export interface PageContainerProps {
  maxWidth?: 'narrow' | 'default' | 'wide' | 'full';
  className?: string;
  children: React.ReactNode;
}

const maxWidthStyles = {
  narrow: 'max-w-4xl',
  default: 'max-w-7xl',
  wide: 'max-w-[1600px]',
  full: 'max-w-full',
};

export const PageContainer: React.FC<PageContainerProps> = ({
  maxWidth = 'default',
  className = '',
  children,
}) => {
  return (
    <div className={`w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 ${maxWidthStyles[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export interface PageSectionProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export const PageSection: React.FC<PageSectionProps> = ({
  title,
  subtitle,
  action,
  className = '',
  children,
}) => {
  return (
    <section className={`space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            {title && <h2 className="text-lg font-bold text-[#F1F5F9]">{title}</h2>}
            {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
};

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav className={`flex items-center gap-1.5 text-xs text-[#64748B] ${className}`}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronLeft className="w-3.5 h-3.5 text-[#475569] rtl:rotate-0 ltr:rotate-180" />}
          {item.active || !item.onClick ? (
            <span className={item.active ? 'text-[#F1F5F9] font-semibold' : ''}>
              {item.label}
            </span>
          ) : (
            <button
              onClick={item.onClick}
              className="hover:text-[#CBD5E1] transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    isLoading?: boolean;
  };
  secondaryActions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
  badge?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  primaryAction,
  secondaryActions,
  badge,
  className = '',
}) => {
  return (
    <div className={`space-y-3 pb-6 border-b border-white/5 ${className}`}>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F8FAFC]">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {(primaryAction || secondaryActions) && (
          <div className="flex items-center gap-2.5 flex-wrap">
            {secondaryActions?.map((act, i) => (
              <Button key={i} variant="secondary" size="sm" onClick={act.onClick} leftIcon={act.icon}>
                {act.label}
              </Button>
            ))}
            {primaryAction && (
              <Button
                variant="primary"
                size="sm"
                onClick={primaryAction.onClick}
                leftIcon={primaryAction.icon}
                isLoading={primaryAction.isLoading}
              >
                {primaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  badge?: string | number;
  onClick?: () => void;
  collapsed?: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  active = false,
  badge,
  onClick,
  collapsed = false,
}) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold
        transition-all duration-150 ease-out select-none
        ${
          active
            ? 'bg-[#D4AF37]/15 text-[#E0C77A] border border-[#D4AF37]/30 shadow-[0_0_12px_rgba(212,175,55,0.12)]'
            : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-white/5 border border-transparent'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <span className={`shrink-0 ${active ? 'text-[#D4AF37]' : 'text-[#64748B]'}`}>
          {icon}
        </span>
        {!collapsed && <span className="truncate">{label}</span>}
      </div>

      {!collapsed && badge !== undefined && (
        <span
          className={`
            px-2 py-0.5 rounded-full text-[10px] font-bold font-mono
            ${active ? 'bg-[#D4AF37] text-[#07111F]' : 'bg-[#1E293B] text-[#CBD5E1]'}
          `}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

export interface AppShellProps {
  sidebarContent?: React.ReactNode;
  topbarContent?: React.ReactNode;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  sidebarContent,
  topbarContent,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111F] text-[#F1F5F9] flex flex-col antialiased">
      {/* Topbar */}
      {topbarContent && (
        <header className="sticky top-0 z-40 h-16 bg-[#0B1626]/90 backdrop-blur-md border-b border-white/10 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {sidebarContent && (
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex-1 flex items-center justify-between">{topbarContent}</div>
        </header>
      )}

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        {sidebarContent && (
          <aside className="hidden md:flex w-64 flex-col bg-[#0B1626] border-e border-white/10 shrink-0 p-4 space-y-6">
            {sidebarContent}
          </aside>
        )}

        {/* Mobile Drawer Sidebar */}
        {sidebarContent && mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#07111F]/80 backdrop-blur-sm"
            />
            <div className="relative w-72 max-w-[85vw] bg-[#0B1626] border-e border-white/10 p-4 flex flex-col z-10">
              <div className="flex justify-end pb-2">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 text-[#64748B] hover:text-white rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden min-w-0 bg-[#07111F]">{children}</main>
      </div>
    </div>
  );
};
