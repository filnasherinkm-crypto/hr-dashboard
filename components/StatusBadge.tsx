'use client';

import React from 'react';
import { WFHStatus, EmployeeStatus, EmploymentType, PayrollStatus, LeaveType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: WFHStatus | EmployeeStatus | EmploymentType | PayrollStatus | LeaveType | string;
  variant?: 'pill' | 'dot' | 'subtle';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'pill',
  className,
}) => {
  let bg = 'bg-zinc-100 text-zinc-700';
  let dotBg = 'bg-zinc-400';

  switch (status) {
    case 'Pending':
      bg = 'bg-[#FFF3E0] text-[#E65100] border border-orange-200/60';
      dotBg = 'bg-[#FF7900]';
      break;
    case 'Approved':
    case 'Approved WFH':
      bg = 'bg-[#E8F8F0] text-[#1B8057] border border-emerald-200/60';
      dotBg = 'bg-emerald-500';
      break;
    case 'Rejected':
    case 'Inactive':
      bg = 'bg-rose-50 text-rose-700 border border-rose-200/60';
      dotBg = 'bg-rose-500';
      break;
    case 'Active':
    case 'Paid':
      bg = 'bg-[#E8F8F0] text-[#1B8057] border border-emerald-200/60';
      dotBg = 'bg-emerald-500';
      break;
    case 'On Leave':
    case 'Leave':
      bg = 'bg-amber-50 text-amber-800 border border-amber-200/60';
      dotBg = 'bg-amber-500';
      break;
    case 'Holiday':
      bg = 'bg-[#FF7900] text-white font-medium';
      dotBg = 'bg-white';
      break;
    case 'WFH':
      bg = 'bg-blue-50 text-blue-700 border border-blue-200/60';
      dotBg = 'bg-blue-500';
      break;
    case 'Intern':
      bg = 'bg-purple-50 text-purple-700 border border-purple-200/60';
      dotBg = 'bg-purple-500';
      break;
    case 'Full-time':
      bg = 'bg-blue-50 text-blue-700 border border-blue-200/60';
      dotBg = 'bg-blue-500';
      break;
    default:
      bg = 'bg-zinc-100 text-zinc-700';
      dotBg = 'bg-zinc-400';
  }

  if (variant === 'dot') {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', className)}>
        <span className={cn('w-2 h-2 rounded-full', dotBg)} />
        <span>{status}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium tracking-wide transition-colors',
        bg,
        className
      )}
    >
      {status}
    </span>
  );
};
