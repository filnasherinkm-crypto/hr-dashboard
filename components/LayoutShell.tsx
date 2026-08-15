'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const LayoutShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If on /studio route, render standalone Studio without HR Shell
  if (pathname.startsWith('/studio')) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-zinc-900">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#050505]">
        {/* Top Header */}
        <TopHeader onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Content Canvas (White rounded card matching reference UI) */}
        <main className="flex-1 bg-white md:rounded-tl-3xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-73px)] overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
