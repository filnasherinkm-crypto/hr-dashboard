'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, DollarSign, Calculator, User, Building2, CheckCircle2, Printer } from 'lucide-react';
import { PayrollRecord, PayrollStatus } from '@/lib/types';
import { useHRStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { useToast } from './Toast';
import { StatusBadge } from './StatusBadge';

interface PayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: PayrollRecord | null;
  mode?: 'edit' | 'payslip';
}

export const PayrollModal: React.FC<PayrollModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
  mode = 'edit',
}) => {
  const { addPayrollRecord, updatePayrollRecord, employees } = useHRStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: 'Engineering',
    jobTitle: '',
    basicSalary: 6000,
    housingAllowance: 1000,
    transportAllowance: 400,
    otherAllowance: 200,
    deductions: 800,
    status: 'Paid' as PayrollStatus,
    paymentDate: '2026-08-01',
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (recordToEdit) {
      setFormData({
        employeeId: recordToEdit.employeeId,
        employeeName: recordToEdit.employeeName,
        department: recordToEdit.department,
        jobTitle: recordToEdit.jobTitle,
        basicSalary: recordToEdit.basicSalary,
        housingAllowance: recordToEdit.housingAllowance,
        transportAllowance: recordToEdit.transportAllowance,
        otherAllowance: recordToEdit.otherAllowance,
        deductions: recordToEdit.deductions,
        status: recordToEdit.status,
        paymentDate: recordToEdit.paymentDate || '2026-08-01',
      });
    } else if (employees.length > 0) {
      const emp = employees[0];
      setFormData({
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        jobTitle: emp.jobTitle,
        basicSalary: 6000,
        housingAllowance: 1000,
        transportAllowance: 400,
        otherAllowance: 200,
        deductions: 800,
        status: 'Paid',
        paymentDate: '2026-08-01',
      });
    }
  }, [recordToEdit, isOpen, employees]);

  if (!isOpen || !mounted) return null;

  const handleEmployeeSelect = (empCode: string) => {
    const emp = employees.find((e) => e.employeeId === empCode);
    if (emp) {
      const basic = Math.round((emp.salary / 12) * 0.7);
      setFormData({
        ...formData,
        employeeId: emp.employeeId,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: emp.department,
        jobTitle: emp.jobTitle,
        basicSalary: basic,
        housingAllowance: Math.round(basic * 0.15),
        transportAllowance: 400,
        otherAllowance: 200,
        deductions: Math.round(basic * 0.12),
      });
    }
  };

  const grossCalculated =
    Number(formData.basicSalary || 0) +
    Number(formData.housingAllowance || 0) +
    Number(formData.transportAllowance || 0) +
    Number(formData.otherAllowance || 0);

  const netCalculated = grossCalculated - Number(formData.deductions || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (recordToEdit) {
      updatePayrollRecord(recordToEdit.id, {
        ...formData,
        basicSalary: Number(formData.basicSalary),
        housingAllowance: Number(formData.housingAllowance),
        transportAllowance: Number(formData.transportAllowance),
        otherAllowance: Number(formData.otherAllowance),
        deductions: Number(formData.deductions),
      });
      showToast('Payroll Updated', `Salary structure for ${formData.employeeName} updated.`, 'success');
    } else {
      addPayrollRecord({
        ...formData,
        basicSalary: Number(formData.basicSalary),
        housingAllowance: Number(formData.housingAllowance),
        transportAllowance: Number(formData.transportAllowance),
        otherAllowance: Number(formData.otherAllowance),
        deductions: Number(formData.deductions),
      });
      showToast('Payroll Added', `Salary structure for ${formData.employeeName} created.`, 'success');
    }

    onClose();
  };

  // Payslip Slip Preview Mode
  if (mode === 'payslip' && recordToEdit) {
    const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-slide-down"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-900 text-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FF7900] flex items-center justify-center font-bold text-white text-xs">
                F
              </div>
              <div>
                <h2 className="text-base font-bold">Acme Corp · Monthly Payslip</h2>
                <p className="text-xs text-zinc-400">Pay Period: August 2026</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex flex-col gap-6">
            {/* Employee info header */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs">
              <div>
                <span className="text-zinc-400">Employee Name</span>
                <p className="font-bold text-zinc-900 text-sm mt-0.5">{recordToEdit.employeeName}</p>
                <p className="text-zinc-500">{recordToEdit.employeeId}</p>
              </div>
              <div>
                <span className="text-zinc-400">Designation & Dept</span>
                <p className="font-bold text-zinc-900 mt-0.5">{recordToEdit.jobTitle}</p>
                <p className="text-[#FF7900] font-medium">{recordToEdit.department}</p>
              </div>
            </div>

            {/* Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Earnings Breakdown
              </h4>
              <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 text-xs">
                <div className="flex justify-between p-3 bg-zinc-50 font-semibold text-zinc-600">
                  <span>Item Description</span>
                  <span>Amount (USD)</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-zinc-700">Basic Salary</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(recordToEdit.basicSalary)}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-zinc-700">Housing Allowance</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(recordToEdit.housingAllowance)}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-zinc-700">Transport Allowance</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(recordToEdit.transportAllowance)}</span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-zinc-700">Other Allowances</span>
                  <span className="font-semibold text-zinc-900">{formatCurrency(recordToEdit.otherAllowance)}</span>
                </div>
                <div className="flex justify-between p-3 bg-orange-50/60 font-bold text-zinc-900">
                  <span>Gross Salary</span>
                  <span className="text-[#FF7900]">{formatCurrency(recordToEdit.grossSalary)}</span>
                </div>
              </div>
            </div>

            {/* Deductions & Net */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Deductions & Net Pay
              </h4>
              <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-100 text-xs">
                <div className="flex justify-between p-3">
                  <span className="text-zinc-700">Taxes & Statutory Deductions</span>
                  <span className="font-semibold text-rose-600">-{formatCurrency(recordToEdit.deductions)}</span>
                </div>
                <div className="flex justify-between p-4 bg-emerald-50 text-sm font-bold text-emerald-800">
                  <span>Total Net Disbursed</span>
                  <span className="text-emerald-700 text-base">{formatCurrency(recordToEdit.netSalary)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <StatusBadge status={recordToEdit.status} />
            <button
              onClick={() => {
                showToast('Printing Payslip', 'Sending document to printer/PDF...', 'info');
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-800 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#FF7900]" />
              Print / Export PDF
            </button>
          </div>
        </div>
      </div>
    );
    return createPortal(modalContent, document.body);
  }

  // Edit / Create Form Mode
  const formModalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-slide-down"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">
              {recordToEdit ? 'Edit Payroll Structure' : 'New Payroll Configuration'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Set monthly base pay, allowances, and tax deductions
            </p>
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
            {!recordToEdit && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Select Employee <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <select
                  value={formData.employeeId}
                  onChange={(e) => handleEmployeeSelect(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.employeeId}>
                      {emp.firstName} {emp.lastName} ({emp.employeeId} · {emp.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Basic Salary ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.basicSalary}
                onChange={(e) => setFormData({ ...formData, basicSalary: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Housing Allowance ($)
              </label>
              <input
                type="number"
                min={0}
                value={formData.housingAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, housingAllowance: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Transport Allowance ($)
              </label>
              <input
                type="number"
                min={0}
                value={formData.transportAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, transportAllowance: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Other Allowance ($)
              </label>
              <input
                type="number"
                min={0}
                value={formData.otherAllowance}
                onChange={(e) =>
                  setFormData({ ...formData, otherAllowance: Number(e.target.value) })
                }
                className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Monthly Deductions / Taxes ($)
            </label>
            <input
              type="number"
              min={0}
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
            />
          </div>

          {/* Auto Calculation Live Box */}
          <div className="p-4 bg-orange-50/70 rounded-2xl border border-orange-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-700">
              <span>Auto Gross Salary:</span>
              <span className="text-[#FF7900] text-sm font-bold">{formatCurrency(grossCalculated)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-900 border-t border-orange-200/60 pt-2">
              <span>Auto Net Payout:</span>
              <span className="text-emerald-600 text-base font-extrabold">{formatCurrency(netCalculated)}</span>
            </div>
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
              Save Structure
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(formModalContent, document.body);
};
