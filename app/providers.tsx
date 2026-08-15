'use client';

import React, { ReactNode } from 'react';
import { HRStoreProvider } from '@/lib/store';
import { ToastProvider } from '@/components/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HRStoreProvider>
      <ToastProvider>{children}</ToastProvider>
    </HRStoreProvider>
  );
}
