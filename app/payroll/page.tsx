'use client';

import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Search,
  FileText,
  Edit2,
  Trash2,
  TrendingUp,
  Wallet,
  Building,
  CheckCircle2,
  Download,
  Printer,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { PayrollRecord } from '@/lib/types';
import { formatCurrency, getInitials, getAvatarColor } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import { PayrollModal } from '@/components/PayrollModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';

export default function PayrollStructurePage() {
  const { payrollRecords, deletePayrollRecord, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'payslip'>('edit');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<PayrollRecord | null>(null);

  // Computed summary metrics
  const totalMonthlyGross = useMemo(() => {
    return payrollRecords.reduce((sum, r) => sum + r.grossSalary, 0);
  }, [payrollRecords]);

  const totalMonthlyNet = useMemo(() => {
    return payrollRecords.reduce((sum, r) => sum + r.netSalary, 0);
  }, [payrollRecords]);

  const totalDeductions = useMemo(() => {
    return payrollRecords.reduce((sum, r) => sum + r.deductions, 0);
  }, [payrollRecords]);

  const avgSalary = useMemo(() => {
    return payrollRecords.length > 0 ? Math.round(totalMonthlyNet / payrollRecords.length) : 0;
  }, [payrollRecords, totalMonthlyNet]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    payrollRecords.forEach((r) => {
      if (r.department) set.add(r.department);
    });
    return Array.from(set);
  }, [payrollRecords]);

  const filteredRecords = useMemo(() => {
    return payrollRecords.filter((rec) => {
      if (departmentFilter !== 'All' && rec.department !== departmentFilter) return false;
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = rec.employeeName.toLowerCase().includes(query);
        const matchesCode = rec.employeeId.toLowerCase().includes(query);
        const matchesDept = rec.department.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesDept) return false;
      }
      return true;
    });
  }, [payrollRecords, departmentFilter, searchTerm]);

  const handleDelete = () => {
    if (recordToDelete) {
      deletePayrollRecord(recordToDelete.id);
      showToast('Payroll Record Deleted', `Removed salary structure for ${recordToDelete.employeeName}.`, 'info');
      setRecordToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL MONTHLY GROSS
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-zinc-900 mt-1">
              {formatCurrency(totalMonthlyGross)}
            </div>
            <span className="text-xs text-zinc-500">Company payroll liability</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              TOTAL NET DISBURSED
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
              {formatCurrency(totalMonthlyNet)}
            </div>
            <span className="text-xs text-zinc-500">Take-home payout</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              STATUTORY DEDUCTIONS
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-rose-600 mt-1">
              {formatCurrency(totalDeductions)}
            </div>
            <span className="text-xs text-zinc-500">Taxes & withholdings</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              AVERAGE NET PAY
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-[#FF7900] mt-1">
              {formatCurrency(avgSalary)}
            </div>
            <span className="text-xs text-zinc-500">Per employee monthly</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7900] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Action and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search payroll records..."
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
        </div>

        {currentUser.role === 'admin' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedRecord(null);
                setModalMode('edit');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#E66C00] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Configure Payroll</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Payroll Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {filteredRecords.length} PAYROLL STRUCTURES
          </span>
          <span className="text-xs text-zinc-400">
            Auto-calculated: Gross = Basic + Allowances | Net = Gross - Deductions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/20 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                <th className="px-6 py-3.5">EMPLOYEE</th>
                <th className="px-4 py-3.5">BASIC</th>
                <th className="px-4 py-3.5">HOUSING</th>
                <th className="px-4 py-3.5">TRANSPORT</th>
                <th className="px-4 py-3.5">OTHER</th>
                <th className="px-4 py-3.5 text-[#FF7900]">GROSS</th>
                <th className="px-4 py-3.5 text-rose-500">DEDUCTIONS</th>
                <th className="px-6 py-3.5 text-emerald-600">NET PAY</th>
                <th className="px-6 py-3.5 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-zinc-400 text-sm">
                    No payroll records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-orange-50/20 transition-colors group">
                    {/* EMPLOYEE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                          style={{
                            backgroundColor: getAvatarColor(rec.employeeName),
                          }}
                        >
                          {getInitials(rec.employeeName)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-zinc-900 group-hover:text-[#FF7900] transition-colors">
                            {rec.employeeName}
                          </div>
                          <div className="text-[11px] text-zinc-400">
                            {rec.employeeId} · {rec.department}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* BASIC */}
                    <td className="px-4 py-4 font-mono font-medium text-zinc-700">
                      {formatCurrency(rec.basicSalary)}
                    </td>

                    {/* HOUSING */}
                    <td className="px-4 py-4 font-mono text-zinc-600">
                      {formatCurrency(rec.housingAllowance)}
                    </td>

                    {/* TRANSPORT */}
                    <td className="px-4 py-4 font-mono text-zinc-600">
                      {formatCurrency(rec.transportAllowance)}
                    </td>

                    {/* OTHER */}
                    <td className="px-4 py-4 font-mono text-zinc-600">
                      {formatCurrency(rec.otherAllowance)}
                    </td>

                    {/* GROSS */}
                    <td className="px-4 py-4 font-mono font-bold text-zinc-900">
                      {formatCurrency(rec.grossSalary)}
                    </td>

                    {/* DEDUCTIONS */}
                    <td className="px-4 py-4 font-mono font-medium text-rose-600">
                      -{formatCurrency(rec.deductions)}
                    </td>

                    {/* NET PAY */}
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 text-sm">
                      {formatCurrency(rec.netSalary)}
                    </td>

                    {/* ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedRecord(rec);
                            setModalMode('payslip');
                            setIsModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Payslip"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#FF7900]" />
                          Slip
                        </button>

                        {currentUser.role === 'admin' && (
                          <>
                            <button
                              onClick={() => {
                                setSelectedRecord(rec);
                                setModalMode('edit');
                                setIsModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                              title="Edit Structure"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setRecordToDelete(rec)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
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
      <PayrollModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRecord(null);
        }}
        recordToEdit={selectedRecord}
        mode={modalMode}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!recordToDelete}
        title="Delete Payroll Record?"
        description={`Are you sure you want to remove the salary configuration for ${recordToDelete?.employeeName}?`}
        confirmLabel="Delete Payroll"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
}
