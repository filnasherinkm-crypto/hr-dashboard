'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, User, Calendar, Clock, DollarSign, X, ArrowRight } from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { formatCurrency, formatDatePretty } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { employees, events, wfhRequests, payrollRecords } = useHRStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open search
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchedEmployees = trimmed
    ? employees.filter(
        (e) =>
          e.firstName.toLowerCase().includes(trimmed) ||
          e.lastName.toLowerCase().includes(trimmed) ||
          e.email.toLowerCase().includes(trimmed) ||
          e.department.toLowerCase().includes(trimmed) ||
          e.jobTitle.toLowerCase().includes(trimmed) ||
          e.employeeId.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedEvents = trimmed
    ? events.filter(
        (ev) =>
          ev.title.toLowerCase().includes(trimmed) ||
          ev.employeeName.toLowerCase().includes(trimmed) ||
          ev.type.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedWFH = trimmed
    ? wfhRequests.filter(
        (r) =>
          r.employeeName.toLowerCase().includes(trimmed) ||
          r.department.toLowerCase().includes(trimmed) ||
          r.reason.toLowerCase().includes(trimmed)
      )
    : [];

  const matchedPayroll = trimmed
    ? payrollRecords.filter(
        (p) =>
          p.employeeName.toLowerCase().includes(trimmed) ||
          p.department.toLowerCase().includes(trimmed) ||
          p.jobTitle.toLowerCase().includes(trimmed)
      )
    : [];

  const totalResults =
    matchedEmployees.length + matchedEvents.length + matchedWFH.length + matchedPayroll.length;

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[80vh] animate-slide-down">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-100 gap-3">
          <Search className="w-5 h-5 text-[#FF7900] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search employees, events, WFH requests, payroll..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base outline-hidden text-zinc-900 placeholder:text-zinc-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold text-zinc-400 bg-zinc-100 rounded border border-zinc-200">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto flex flex-col gap-5">
          {!trimmed && (
            <div className="py-12 text-center text-zinc-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              <p className="text-sm">Type to search across the entire HR database...</p>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-400">
                <span className="px-2 py-1 bg-zinc-100 rounded-md">Employees</span>
                <span className="px-2 py-1 bg-zinc-100 rounded-md">Events</span>
                <span className="px-2 py-1 bg-zinc-100 rounded-md">WFH</span>
                <span className="px-2 py-1 bg-zinc-100 rounded-md">Payroll</span>
              </div>
            </div>
          )}

          {trimmed && totalResults === 0 && (
            <div className="py-12 text-center text-zinc-500">
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-zinc-400 mt-1">Try searching by name, department, or date</p>
            </div>
          )}

          {/* Employees Results */}
          {matchedEmployees.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Employees ({matchedEmployees.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {matchedEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => handleNavigate(`/employees?highlight=${emp.id}`)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50/60 cursor-pointer transition-colors border border-transparent hover:border-orange-200/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FF7900] text-white flex items-center justify-center text-xs font-bold">
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">
                          {emp.firstName} {emp.lastName}{' '}
                          <span className="text-xs text-zinc-400 font-normal">({emp.employeeId})</span>
                        </div>
                        <div className="text-xs text-zinc-500">
                          {emp.jobTitle} · {emp.department}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Results */}
          {matchedEvents.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Special Events ({matchedEvents.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {matchedEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => handleNavigate('/events')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50/60 cursor-pointer transition-colors border border-transparent hover:border-orange-200/60"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{evt.title}</div>
                      <div className="text-xs text-zinc-500">
                        {formatDatePretty(evt.date)} · {evt.type}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WFH Requests */}
          {matchedWFH.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> WFH Requests ({matchedWFH.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {matchedWFH.map((req) => (
                  <div
                    key={req.id}
                    onClick={() => handleNavigate('/wfh')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50/60 cursor-pointer transition-colors border border-transparent hover:border-orange-200/60"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{req.employeeName}</div>
                      <div className="text-xs text-zinc-500">
                        {req.displayDateRange || req.startDate} · {req.reason}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={req.status} />
                      <ArrowRight className="w-4 h-4 text-zinc-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payroll Results */}
          {matchedPayroll.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Payroll Records ({matchedPayroll.length})
              </div>
              <div className="flex flex-col gap-1.5">
                {matchedPayroll.map((pay) => (
                  <div
                    key={pay.id}
                    onClick={() => handleNavigate('/payroll')}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50/60 cursor-pointer transition-colors border border-transparent hover:border-orange-200/60"
                  >
                    <div>
                      <div className="text-sm font-semibold text-zinc-900">{pay.employeeName}</div>
                      <div className="text-xs text-zinc-500">
                        Gross: {formatCurrency(pay.grossSalary)} · Net: {formatCurrency(pay.netSalary)}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
