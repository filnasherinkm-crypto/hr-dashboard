'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  className,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl p-6 border border-[#f5dfce] shadow-xs transition-all duration-200 hover:shadow-md hover:border-[#FF7900]/40 flex flex-col justify-between relative group',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-zinc-700 tracking-wider uppercase">
          {title}
        </span>
        <div className="w-10 h-10 rounded-xl bg-[#FF7900] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <div className="text-4xl font-bold text-[#FF7900] tracking-tight">
          {value}
        </div>
        <p className="text-xs text-zinc-600 mt-1 font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
