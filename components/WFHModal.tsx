'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { useToast } from './Toast';

interface WFHModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WFHModal: React.FC<WFHModalProps> = ({ isOpen, onClose }) => {
  const { addWFHRequest, employees, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [employeeId, setEmployeeId] = useState('');
  const [startDate, setStartDate] = useState('2026-08-12');
  const [endDate, setEndDate] = useState('2026-08-13');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      // Default to currentUser if employee mode, else first employee
      if (currentUser.role === 'employee' && currentUser.employeeId) {
        const emp = employees.find((e) => e.employeeId === currentUser.employeeId);
        if (emp) setEmployeeId(emp.id);
      } else if (employees.length > 0) {
        setEmployeeId(employees[0].id);
      }
      setStartDate('2026-08-12');
      setEndDate('2026-08-13');
      setReason('');
      setError('');
    }
  }, [isOpen, currentUser, employees]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) {
      setError('Please select an employee');
      return;
    }
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('End date cannot be earlier than start date');
      return;
    }
    if (!reason.trim()) {
      setError('Please provide a reason for the WFH request');
      return;
    }

    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    // Generate formatted date range e.g. "Aug 12–13, 2026" or "Aug 15, 2026"
    const startObj = new Date(startDate);
    const endObj = new Date(endDate);

    const startMonth = startObj.toLocaleString('en-US', { month: 'short' });
    const endMonth = endObj.toLocaleString('en-US', { month: 'short' });
    const startDay = startObj.getDate();
    const endDay = endObj.getDate();
    const year = startObj.getFullYear();

    let displayDateRange = `${startMonth} ${startDay}, ${year}`;
    if (startDate !== endDate) {
      if (startMonth === endMonth) {
        displayDateRange = `${startMonth} ${startDay}–${endDay}, ${year}`;
      } else {
        displayDateRange = `${startMonth} ${startDay} – ${endMonth} ${endDay}, ${year}`;
      }
    }

    addWFHRequest({
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: emp.department,
      requestDate: '2026-08-11',
      startDate,
      endDate,
      displayDateRange,
      reason,
    });

    showToast(
      'WFH Request Submitted',
      `Request for ${emp.firstName} ${emp.lastName} (${displayDateRange}) is awaiting approval.`,
      'success'
    );

    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-slide-down"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Request Work From Home</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Submit remote work days for manager approval</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
            {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 text-xs font-medium rounded-xl border border-rose-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Employee <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <select
                value={employeeId}
                disabled={currentUser.role === 'employee'}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white disabled:bg-zinc-100 disabled:text-zinc-500"
              >
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 text-xs sm:text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-2 py-2 text-xs sm:text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Reason for WFH <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Focused project milestone / client workshop / repair appointment..."
              className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
            />
          </div>

          </div>

          {/* Footer */}
          <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold rounded-xl text-white bg-[#FF7900] hover:bg-[#E66C00] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
