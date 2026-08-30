import React, { PropsWithChildren } from 'react';
import { CommerceProvider } from '../context/CommerceContext.tsx';

export const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <CommerceProvider>
      {children}
    </CommerceProvider>
  );
};
