'use client';

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Check,
  X,
  Building,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { WFHRequest, WFHStatus } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDatePretty, getInitials, getAvatarColor } from '@/lib/utils';
import { WFHModal } from '@/components/WFHModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';

export default function WFHTrackerPage() {
  const { wfhRequests, approveWFHRequest, rejectWFHRequest, deleteWFHRequest, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [activeStatusFilter, setActiveStatusFilter] = useState<'All' | WFHStatus>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isWfhModalOpen, setIsWfhModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<WFHRequest | null>(null);

  // Counters
  const pendingCount = wfhRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = wfhRequests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = wfhRequests.filter((r) => r.status === 'Rejected').length;

  const departments = useMemo(() => {
    const set = new Set<string>();
    wfhRequests.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set);
  }, [wfhRequests]);

  const filteredRequests = useMemo(() => {
    return wfhRequests.filter((req) => {
      if (activeStatusFilter !== 'All' && req.status !== activeStatusFilter) return false;
      if (departmentFilter !== 'All' && req.department !== departmentFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = req.employeeName.toLowerCase().includes(query);
        const matchesDept = req.department.toLowerCase().includes(query);
        const matchesReason = req.reason.toLowerCase().includes(query);
        if (!matchesName && !matchesDept && !matchesReason) return false;
      }
      return true;
    });
  }, [wfhRequests, activeStatusFilter, departmentFilter, searchTerm]);

  const handleApprove = (id: string, name: string) => {
    approveWFHRequest(id);
    showToast('WFH Approved', `Request for ${name} has been approved.`, 'success');
  };

  const handleReject = (id: string, name: string) => {
    rejectWFHRequest(id);
    showToast('WFH Rejected', `Request for ${name} was rejected.`, 'info');
  };

  const handleDelete = () => {
    if (requestToDelete) {
      deleteWFHRequest(requestToDelete.id);
      showToast('Request Deleted', `WFH request removed.`, 'info');
      setRequestToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              PENDING APPROVAL
            </span>
            <div className="text-3xl font-bold text-[#FF7900] mt-1">{pendingCount}</div>
            <span className="text-xs text-zinc-500">Requires review</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              APPROVED REQUESTS
            </span>
            <div className="text-3xl font-bold text-emerald-600 mt-1">{approvedCount}</div>
            <span className="text-xs text-zinc-500">Scheduled remote</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              REJECTED REQUESTS
            </span>
            <div className="text-3xl font-bold text-rose-600 mt-1">{rejectedCount}</div>
            <span className="text-xs text-zinc-500">Not approved</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <XCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL REQUESTS
            </span>
            <div className="text-3xl font-bold text-zinc-900 mt-1">{wfhRequests.length}</div>
            <span className="text-xs text-zinc-500">All submissions</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-2">
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeStatusFilter === st
                  ? 'border border-[#FF7900] text-[#FF7900] bg-orange-50/40 shadow-2xs'
                  : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search, Dept Filter & Add Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search WFH requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 bg-white"
            />
          </div>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 bg-white text-zinc-700 font-medium cursor-pointer"
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsWfhModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#E66C00] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Request WFH</span>
          </button>
        </div>
      </div>

      {/* Main WFH Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {filteredRequests.length} WFH APPLICATIONS
          </span>
          <span className="text-xs text-zinc-400">
            Real-time status updates sync across Calendar and Overview
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/20">
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  EMPLOYEE
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  WFH DATE(S)
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  REASON
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 text-sm">
                    No WFH requests found matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-orange-50/20 transition-colors">
                    {/* EMPLOYEE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs"
                          style={{
                            backgroundColor: getAvatarColor(req.employeeName),
                          }}
                        >
                          {getInitials(req.employeeName)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-zinc-900">{req.employeeName}</div>
                          <div className="text-xs text-zinc-400">
                            Requested on {formatDatePretty(req.requestDate)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-6 py-4 text-xs font-medium text-zinc-700">
                      {req.department}
                    </td>

                    {/* DATES */}
                    <td className="px-6 py-4 text-xs font-bold text-zinc-900">
                      {req.displayDateRange || req.startDate}
                    </td>

                    {/* REASON */}
                    <td className="px-6 py-4 text-xs text-zinc-600 max-w-xs truncate">
                      {req.reason}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <StatusBadge status={req.status} />
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {currentUser.role === 'admin' && req.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id, req.employeeName)}
                              className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req.id, req.employeeName)}
                              className="px-2.5 py-1 text-xs font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}

                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => setRequestToDelete(req)}
                            className="p-1.5 rounded-lg hover:bg-rose-100 text-zinc-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Request"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <WFHModal isOpen={isWfhModalOpen} onClose={() => setIsWfhModalOpen(false)} />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!requestToDelete}
        title="Delete WFH Request?"
        description={`Are you sure you want to delete the WFH request for ${requestToDelete?.employeeName}?`}
        confirmLabel="Delete Request"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setRequestToDelete(null)}
      />
    </div>
  );
}
