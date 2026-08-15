'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  HeartHandshake,
  Clock,
  Edit,
  Trash2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Employee } from '@/lib/types';
import { useHRStore } from '@/lib/store';
import { formatCurrency, formatDatePretty } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';
import { useToast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';

interface EmployeeProfileDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
}

export const EmployeeProfileDrawer: React.FC<EmployeeProfileDrawerProps> = ({
  employee,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { deleteEmployee, wfhRequests, events, payrollRecords, currentUser } = useHRStore();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'compensation' | 'wfh' | 'events'>('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen || !employee) return null;

  const empWfh = wfhRequests.filter(
    (w) => w.employeeId === employee.id || w.employeeName === `${employee.firstName} ${employee.lastName}`
  );
  const empEvents = events.filter(
    (ev) => ev.employeeId === employee.id || ev.employeeName === `${employee.firstName} ${employee.lastName}`
  );
  const empPayroll = payrollRecords.find(
    (p) => p.employeeId === employee.employeeId || p.employeeName === `${employee.firstName} ${employee.lastName}`
  );

  const handleDelete = () => {
    deleteEmployee(employee.id);
    showToast('Employee Deleted', `${employee.firstName} ${employee.lastName} removed from directory.`, 'info');
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
        <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-down">
          {/* Top Banner & Header */}
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              {employee.avatarUrl ? (
                <img
                  src={employee.avatarUrl}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg shadow-orange-500/20 shrink-0"
                />
              ) : (
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/20 shrink-0"
                  style={{ backgroundColor: employee.avatarColor || '#FF7900' }}
                >
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/15 text-white/90">
                    {employee.employeeId}
                  </span>
                  <StatusBadge status={employee.status} />
                  <StatusBadge status={employee.employmentType} />
                </div>
                <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">
                  {employee.firstName} {employee.lastName}
                </h2>
                <p className="text-xs text-zinc-300 mt-0.5">
                  {employee.jobTitle} · <span className="text-orange-400 font-medium">{employee.department}</span>
                </p>
              </div>
            </div>

            {/* Quick Action Buttons */}
            {currentUser.role === 'admin' && (
              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    onEdit(employee);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors shadow-xs cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-[#FF7900]" />
                  Edit Details
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-xl transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-zinc-200 px-6 bg-zinc-50/50 gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-[#FF7900] text-[#FF7900]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('compensation')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'compensation'
                  ? 'border-[#FF7900] text-[#FF7900]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Payroll & Bank
            </button>
            <button
              onClick={() => setActiveTab('wfh')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'wfh'
                  ? 'border-[#FF7900] text-[#FF7900]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              WFH History ({empWfh.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'events'
                  ? 'border-[#FF7900] text-[#FF7900]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Events ({empEvents.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                {/* Contact Section */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-50 rounded-2xl p-4 border border-zinc-100">
                    <div className="flex items-start gap-2.5">
                      <Mail className="w-4 h-4 text-zinc-400 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-zinc-400">Work Email</div>
                        <div className="text-xs font-medium text-zinc-900">{employee.email}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-zinc-400 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-zinc-400">Phone</div>
                        <div className="text-xs font-medium text-zinc-900">{employee.phone || 'N/A'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-zinc-400">Location</div>
                        <div className="text-xs font-medium text-zinc-900">{employee.location}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Calendar className="w-4 h-4 text-zinc-400 mt-0.5" />
                      <div>
                        <div className="text-[11px] text-zinc-400">Joined Date</div>
                        <div className="text-xs font-medium text-zinc-900">{employee.joiningDate}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reporting & Structure */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Reporting & Structure
                  </h4>
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Reporting Manager</span>
                      <span className="font-semibold text-zinc-900">{employee.manager || 'Leadership Team'}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Department</span>
                      <span className="font-semibold text-zinc-900">{employee.department}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-500">Employment Category</span>
                      <span className="font-semibold text-zinc-900">{employee.employmentType}</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Emergency Contact
                  </h4>
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-zinc-900">
                        {employee.emergencyContact || 'Emergency Contact on File'}
                      </div>
                      <div className="text-xs text-zinc-500">{employee.emergencyPhone || '+1 (555) 000-0000'}</div>
                    </div>
                    <HeartHandshake className="w-5 h-5 text-[#FF7900]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'compensation' && (
              <div className="flex flex-col gap-6">
                {/* Annual Salary Box */}
                <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-orange-900/70 uppercase tracking-wider">
                      Annual Total Compensation
                    </span>
                    <div className="text-3xl font-bold text-[#FF7900] mt-1">
                      {formatCurrency(employee.salary)}
                    </div>
                    <span className="text-xs text-zinc-600">Standard salaried employee contract</span>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#FF7900]" />
                </div>

                {/* Monthly Breakdown */}
                {empPayroll ? (
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                      Monthly Payroll Breakdown
                    </h4>
                    <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Basic Monthly Salary</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(empPayroll.basicSalary)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Housing Allowance</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(empPayroll.housingAllowance)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Transport Allowance</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(empPayroll.transportAllowance)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Other Allowances</span>
                        <span className="font-medium text-zinc-900">{formatCurrency(empPayroll.otherAllowance)}</span>
                      </div>
                      <div className="border-t border-zinc-200 my-1 pt-2 flex items-center justify-between text-xs font-semibold">
                        <span className="text-zinc-800">Gross Monthly Salary</span>
                        <span className="text-zinc-900">{formatCurrency(empPayroll.grossSalary)}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-rose-600">
                        <span>Statutory Deductions</span>
                        <span>-{formatCurrency(empPayroll.deductions)}</span>
                      </div>
                      <div className="border-t border-zinc-200 pt-2 flex items-center justify-between text-sm font-bold text-emerald-700">
                        <span>Net Payout</span>
                        <span>{formatCurrency(empPayroll.netSalary)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">No monthly payroll record configured yet.</p>
                )}

                {/* Bank Details */}
                <div>
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                    Disbursement Bank Account
                  </h4>
                  <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-zinc-500" />
                      <div>
                        <div className="text-xs font-semibold text-zinc-900">{employee.bankName || 'Chase Bank'}</div>
                        <div className="text-xs text-zinc-500">{employee.accountNumber || '•••• •••• 9921'}</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'wfh' && (
              <div className="flex flex-col gap-3">
                {empWfh.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 text-xs">
                    No WFH requests submitted yet for this employee.
                  </div>
                ) : (
                  empWfh.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-900">
                          {req.displayDateRange || req.startDate}
                        </span>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-zinc-600">{req.reason}</p>
                      {req.approvedBy && (
                        <div className="text-[11px] text-zinc-400">
                          Reviewed by {req.approvedBy} on {req.reviewedAt || 'Aug 2026'}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="flex flex-col gap-3">
                {empEvents.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 text-xs">
                    No upcoming birthdays or anniversaries scheduled.
                  </div>
                ) : (
                  empEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{evt.title}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {formatDatePretty(evt.date)} · {evt.type}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#FF7900] bg-orange-50 px-2 py-1 rounded-md border border-orange-200">
                        {evt.type}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Footer Close */}
          <div className="p-4 border-t border-zinc-200 bg-zinc-50/50 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-zinc-700 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl transition-colors cursor-pointer"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Employee Record?"
        description={`Are you sure you want to remove ${employee.firstName} ${employee.lastName} (${employee.employeeId})? This will also remove their associated payroll records and WFH history.`}
        confirmLabel="Delete Record"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
};
