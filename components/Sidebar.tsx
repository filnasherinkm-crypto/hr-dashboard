'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  UserCheck,
  Bell,
  Calendar,
  DollarSign,
  Clock,
  Database,
  X,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/overview',
    icon: Home,
  },
  {
    label: 'Employee Details',
    href: '/employees',
    icon: Users,
  },
  {
    label: 'Headcount',
    href: '/headcount',
    icon: UserCheck,
  },
  {
    label: 'Special Events',
    href: '/events',
    icon: Bell,
  },
  {
    label: 'WFH Tracker',
    href: '/wfh',
    icon: Calendar,
  },
  {
    label: 'Payroll Structure',
    href: '/payroll',
    icon: DollarSign,
  },
  {
    label: 'Leave Calendar',
    href: '/calendar',
    icon: Clock,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const pathname = usePathname();

  const isCurrentRoute = (href: string) => {
    if (href === '/overview' && (pathname === '/' || pathname === '/overview')) return true;
    return pathname.startsWith(href) && href !== '/';
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#050505] text-white p-5 justify-between select-none">
      {/* Brand Logo & Title */}
      <div>
        <div className="flex items-center justify-between pb-6 pt-1">
          <Link href="/overview" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#FF7900] flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <div className="w-5 h-5 flex flex-col justify-between items-center">
                <div className="w-4 h-2 bg-white rounded-full opacity-90" />
                <div className="w-4 h-2 bg-white rounded-full opacity-90" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-white tracking-tight">Dashboard</span>
            </div>
          </Link>

          {/* Close mobile button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="mt-4">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2">
            Navigation
          </div>
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isCurrentRoute(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 relative group',
                    active
                      ? 'bg-[#FF7900] text-white shadow-md shadow-orange-600/30'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-100'
                    )}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer & Sanity Studio Link */}
      <div className="pt-4 border-t border-zinc-900/80 flex flex-col gap-3">
        <Link
          href="/studio"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-all border border-zinc-800/80 group"
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#FF7900]" />
            <span>Sanity Studio</span>
          </div>
          <ExternalLink className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300" />
        </Link>

        <div className="px-3 text-xs text-zinc-400 font-medium">
          Acme Corp · HR Portal
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-[#141414] z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-fade-in">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
