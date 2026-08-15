'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Users,
  User,
  Calendar,
  Check,
  Cake,
  Star,
  Gift,
  ArrowRight,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { StatCard } from '@/components/StatCard';
import { StatusBadge } from '@/components/StatusBadge';
import { getRelativeTime, formatDatePretty } from '@/lib/utils';
import { useToast } from '@/components/Toast';
import { WFHModal } from '@/components/WFHModal';
import { EventModal } from '@/components/EventModal';

export default function OverviewPage() {
  const { stats, events, wfhRequests, currentUser, approveWFHRequest, rejectWFHRequest } = useHRStore();
  const { showToast } = useToast();
  const [isWfhModalOpen, setIsWfhModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Filter top 4 events and top 4 wfh requests matching reference order
  const displayEvents = events.slice(0, 4);
  const displayWFH = wfhRequests.slice(0, 4);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'Birthday':
        return <Cake className="w-4 h-4 text-white" />;
      case 'Work Anniversary':
        return <Star className="w-4 h-4 text-white" />;
      case 'Company Holiday':
        return <Gift className="w-4 h-4 text-white" />;
      default:
        return <Calendar className="w-4 h-4 text-white" />;
    }
  };

  const handleApprove = (id: string, name: string) => {
    approveWFHRequest(id);
    showToast('WFH Approved', `Approved request for ${name}`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    rejectWFHRequest(id);
    showToast('WFH Rejected', `Rejected request for ${name}`, 'info');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Hero Banner (Faithful to Reference UI 1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2B1202] via-[#3E1A04] to-[#5A2405] text-white p-6 sm:p-8 lg:p-10 shadow-lg">
        {/* Subtle background ambient glow */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-bold text-[#FF9E40] tracking-widest uppercase">
              ACME CORP · HR PORTAL
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1.5 tracking-tight">
              Good morning, {currentUser.name}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 mt-2 font-normal">
              Today is Tuesday, August 11, 2026
            </p>
          </div>

          {/* Right Side Stats Blocks */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#1A0A02]/80 border border-[#8C3A00]/40 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[110px] sm:min-w-[125px] shadow-inner">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {stats.totalEmployees}
              </span>
              <span className="text-xs text-zinc-300 mt-1 font-medium">Employees</span>
            </div>

            <div className="bg-[#1A0A02]/80 border border-[#8C3A00]/40 rounded-2xl px-6 py-4 flex flex-col items-center justify-center min-w-[110px] sm:min-w-[125px] shadow-inner">
              <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                {stats.totalInterns}
              </span>
              <span className="text-xs text-zinc-300 mt-1 font-medium">Interns</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 KPI Cards (Faithful to Reference UI 1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/employees" className="block">
          <StatCard
            title="TOTAL EMPLOYEES"
            value={stats.totalEmployees}
            subtitle="Full-time staff"
            icon={<Users className="w-5 h-5 text-white" />}
          />
        </Link>

        <Link href="/headcount" className="block">
          <StatCard
            title="TOTAL INTERNS"
            value={stats.totalInterns}
            subtitle="Current cohort"
            icon={<User className="w-5 h-5 text-white" />}
          />
        </Link>

        <Link href="/wfh" className="block">
          <StatCard
            title="WFH PENDING"
            value={stats.wfhPendingCount}
            subtitle="Awaiting approval"
            icon={<Calendar className="w-5 h-5 text-white" />}
          />
        </Link>

        <Link href="/wfh" className="block">
          <StatCard
            title="WFH APPROVED"
            value={stats.wfhApprovedCount}
            subtitle="This month"
            icon={<Check className="w-5 h-5 text-white stroke-[3]" />}
          />
        </Link>
      </div>

      {/* Bottom Row: Upcoming Events & WFH Requests (Faithful to Reference UI 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* UPCOMING EVENTS CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#f5dfce] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                UPCOMING EVENTS
              </h3>
              <div className="flex items-center gap-3">
                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => setIsEventModalOpen(true)}
                    className="text-xs text-[#FF7900] hover:text-[#E66C00] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                )}
                <Link
                  href="/events"
                  className="text-xs font-semibold text-[#FF7900] hover:text-[#E66C00] flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 mt-2">
              {displayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-orange-50/30 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FF7900] flex items-center justify-center shrink-0 shadow-xs">
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-zinc-900 truncate">
                        {evt.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {formatDatePretty(evt.date)}
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 text-xs font-medium text-zinc-600 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-md">
                    {getRelativeTime(evt.date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WFH REQUESTS CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#f5dfce] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                WFH REQUESTS
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWfhModalOpen(true)}
                  className="text-xs text-[#FF7900] hover:text-[#E66C00] font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Request
                </button>
                <Link
                  href="/wfh"
                  className="text-xs font-semibold text-[#FF7900] hover:text-[#E66C00] flex items-center gap-1 group"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-zinc-100 mt-2">
              {displayWFH.map((req) => (
                <div
                  key={req.id}
                  className="py-3.5 flex items-center justify-between gap-3 group hover:bg-orange-50/30 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#FF7900] flex items-center justify-center shrink-0 text-white font-bold text-xs">
                      {/* Orange rounded square matching reference */}
                    </div>
                    <div className="truncate">
                      <h4 className="text-sm font-semibold text-zinc-900 truncate">
                        {req.employeeName}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {req.displayDateRange || req.startDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Fast Approval Action for HR Admin on Pending items */}
                    {currentUser.role === 'admin' && req.status === 'Pending' && (
                      <div className="flex items-center gap-1 mr-1">
                        <button
                          onClick={() => handleApprove(req.id, req.employeeName)}
                          title="Quick Approve"
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(req.id, req.employeeName)}
                          title="Quick Reject"
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <WFHModal isOpen={isWfhModalOpen} onClose={() => setIsWfhModalOpen(false)} />
      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
    </div>
  );
}
