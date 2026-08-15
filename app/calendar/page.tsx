'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Palmtree,
  Home,
  PartyPopper,
  Briefcase,
  X,
  Plus,
  CalendarDays,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { CalendarEntry, LeaveType } from '@/lib/types';
import { formatDatePretty } from '@/lib/utils';
import { useToast } from '@/components/Toast';

export default function LeaveCalendarPage() {
  const { calendarEntries, addCalendarEntry, deleteCalendarEntry, employees, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Leave' | 'WFH' | 'Approved WFH' | 'Holiday'>('All');
  const [selectedDate, setSelectedDate] = useState<string>('2026-08-11');
  const [isDayBoxVisible, setIsDayBoxVisible] = useState<boolean>(true);

  // Month navigation (Defaults to August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 is August

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar grid for currentMonth and currentYear
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSunday: boolean;
      isSaturday: boolean;
    }[] = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
        isSunday: cells.length % 7 === 0,
        isSaturday: cells.length % 7 === 6,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dateStr === '2026-08-11';
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        isToday,
        isSunday: cells.length % 7 === 0,
        isSaturday: cells.length % 7 === 6,
      });
    }

    // Next month padding to fill 35 or 42 cells
    const remaining = (7 - (cells.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth + 2 > 12 ? 1 : currentMonth + 2;
      const y = currentMonth + 2 > 12 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isToday: false,
        isSunday: cells.length % 7 === 0,
        isSaturday: cells.length % 7 === 6,
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Selected date entries
  const selectedEntries = useMemo(() => {
    return calendarEntries.filter((e) => e.date === selectedDate);
  }, [calendarEntries, selectedDate]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Controls Bar: Navigation & Filter Pills (Faithful to Reference UI 4) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Month Picker Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrevMonth}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <span className="text-base sm:text-lg font-bold text-zinc-900 min-w-[130px] text-center">
            {monthNames[currentMonth]} {currentYear}
          </span>

          <button
            onClick={handleNextMonth}
            className="flex items-center gap-1 px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 shadow-2xs transition-colors cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills: All | Leave | WFH | Approved WFH | Holiday */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['All', 'Leave', 'WFH', 'Approved WFH', 'Holiday'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-[#FF7900] text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Badges (Faithful to Reference UI 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center text-xl shrink-0">
            🌴
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">32</div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              LEAVE DAYS
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shrink-0">
            🏠
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">29</div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              WFH DAYS
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center text-xl shrink-0">
            🎉
          </div>
          <div>
            <div className="text-2xl font-bold text-[#FF7900]">3</div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              HOLIDAYS
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
            💼
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">21</div>
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              WORKING DAYS
            </div>
          </div>
        </div>
      </div>

      {/* Selected Day Box (Faithful to Reference UI 4) */}
      {isDayBoxVisible && (
        <div className="bg-white rounded-3xl p-5 border-2 border-[#FF7900] shadow-xs flex flex-col gap-4 relative animate-fade-in">
          <button
            onClick={() => setIsDayBoxVisible(false)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FF7900] text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {selectedDate.split('-')[2]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-zinc-900">
                  {formatDatePretty(selectedDate)}
                </h3>
                {selectedDate === '2026-08-11' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF7900] text-white">
                    TODAY
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                {selectedEntries.length} record(s) on this date
              </p>
            </div>
          </div>

          {/* Cards for selected date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {selectedEntries.length === 0 ? (
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-400 col-span-full">
                No leave or WFH scheduled for this date.
              </div>
            ) : (
              selectedEntries.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 flex flex-col justify-between"
                >
                  <div className="text-xs font-bold text-zinc-900">
                    {item.employeeName || item.title}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.type === 'Approved WFH'
                          ? 'bg-emerald-500'
                          : item.type === 'WFH'
                          ? 'bg-blue-500'
                          : item.type === 'Holiday'
                          ? 'bg-[#FF7900]'
                          : 'bg-amber-500'
                      }`}
                    />
                    <span className="text-zinc-600 font-medium">{item.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Calendar Grid (Faithful to Reference UI 4) */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-zinc-200 bg-zinc-50/50 text-center text-xs font-bold py-3">
          <div className="text-[#FF7900]">SUN</div>
          <div className="text-zinc-700">MON</div>
          <div className="text-zinc-700">TUE</div>
          <div className="text-zinc-700">WED</div>
          <div className="text-zinc-700">THU</div>
          <div className="text-zinc-700">FRI</div>
          <div className="text-[#FF7900]">SAT</div>
        </div>

        {/* Month Grid Cells */}
        <div className="grid grid-cols-7 divide-x divide-y divide-zinc-100">
          {calendarGrid.map((cell, idx) => {
            const isSelected = cell.dateStr === selectedDate;
            const entriesForCell = calendarEntries.filter((e) => {
              if (e.date !== cell.dateStr) return false;
              if (activeFilter === 'All') return true;
              return e.type === activeFilter;
            });

            return (
              <div
                key={idx}
                onClick={() => {
                  setSelectedDate(cell.dateStr);
                  setIsDayBoxVisible(true);
                }}
                className={`min-h-[110px] sm:min-h-[125px] p-2 flex flex-col justify-between transition-colors cursor-pointer relative group ${
                  !cell.isCurrentMonth
                    ? 'bg-zinc-50/40 opacity-40'
                    : cell.isToday
                    ? 'bg-orange-50/20 ring-2 ring-inset ring-[#FF7900]'
                    : isSelected
                    ? 'bg-orange-50/30 ring-1 ring-inset ring-[#FF7900]/50'
                    : 'hover:bg-zinc-50/60'
                }`}
              >
                {/* Day Number and Holiday Badge */}
                <div className="flex items-start justify-between gap-1">
                  <span
                    className={`text-xs font-bold ${
                      cell.isSunday || cell.isSaturday
                        ? 'text-[#FF7900]'
                        : cell.isToday
                        ? 'text-white bg-[#FF7900] w-5 h-5 rounded-full flex items-center justify-center text-[10px]'
                        : 'text-zinc-700'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {/* Holiday Marker if any */}
                  {entriesForCell.some((e) => e.type === 'Holiday') && (
                    <span className="text-[9px] font-bold bg-[#FF7900] text-white px-1.5 py-0.5 rounded-md">
                      HOL
                    </span>
                  )}
                </div>

                {/* Event Tags inside Day Cell */}
                <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                  {entriesForCell.map((entry) => {
                    if (entry.type === 'Holiday') {
                      return (
                        <div
                          key={entry.id}
                          className="bg-[#FF7900] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm truncate"
                        >
                          {entry.title || 'Holiday'}
                        </div>
                      );
                    }
                    if (entry.type === 'Approved WFH') {
                      return (
                        <div
                          key={entry.id}
                          className="bg-[#10B981] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm truncate"
                        >
                          {entry.employeeName.split(' ')[0]}
                        </div>
                      );
                    }
                    if (entry.type === 'WFH') {
                      return (
                        <div
                          key={entry.id}
                          className="bg-[#2563EB] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-sm truncate"
                        >
                          {entry.employeeName.split(' ')[0]}
                        </div>
                      );
                    }
                    if (entry.type === 'Leave') {
                      return (
                        <div
                          key={entry.id}
                          className="border border-rose-400 text-rose-700 bg-rose-50/60 text-[10px] font-medium px-1.5 py-0.5 rounded-sm truncate"
                        >
                          {entry.employeeName.split(' ')[0]}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Bottom Legend (Faithful to Reference UI 4) */}
      <div className="flex items-center gap-6 flex-wrap text-xs font-medium text-zinc-600 px-2 py-1">
        <span className="font-bold text-zinc-400 uppercase tracking-wider text-[11px]">
          LEGEND
        </span>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs border border-rose-400 bg-rose-50" />
          <span>Leave</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[#2563EB]" />
          <span>WFH</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[#10B981]" />
          <span>Approved WFH</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs bg-[#FF7900]" />
          <span>Holiday</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-xs border-2 border-[#FF7900] bg-orange-50" />
          <span>Today / Holiday</span>
        </div>
      </div>
    </div>
  );
}
