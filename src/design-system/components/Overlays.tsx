import React, { useState, useRef, useEffect } from 'react';

export interface TooltipProps {
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full start-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full start-1/2 -translate-x-1/2 mt-2',
    left: 'end-full top-1/2 -translate-y-1/2 me-2',
    right: 'start-full top-1/2 -translate-y-1/2 ms-2',
  }[position];

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-2.5 py-1 text-xs font-semibold text-[#F1F5F9] bg-[#07111F] border border-white/10
            rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-100
            ${positionStyles}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export interface PopoverProps {
  trigger: React.ReactNode;
  content: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
}

export const Popover: React.FC<PopoverProps> = ({
  trigger,
  content,
  align = 'end',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignStyles = {
    start: 'start-0',
    end: 'end-0',
    center: 'start-1/2 -translate-x-1/2',
  }[align];

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <div onClick={() => setIsOpen(prev => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`
            absolute top-full mt-2 z-50 bg-[#0B1626] border border-white/10 rounded-xl shadow-2xl p-4
            animate-in fade-in zoom-in-95 duration-150 min-w-[200px]
            ${alignStyles}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
};
