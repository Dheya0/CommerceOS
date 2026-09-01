import React from 'react';

interface StorefrontShellProps {
  children: React.ReactNode;
}

export const StorefrontShell: React.FC<StorefrontShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050B14] text-[#F4F6F8] selection:bg-[#C9A45C] selection:text-[#050B14] font-sans antialiased">
      {children}
    </div>
  );
};
