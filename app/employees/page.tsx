'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Plus,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Eye,
  Building,
} from 'lucide-react';
import { useHRStore } from '@/lib/store';
import { Employee, EmploymentType } from '@/lib/types';
import { getInitials, getAvatarColor } from '@/lib/utils';
import { EmployeeModal } from '@/components/EmployeeModal';
import { EmployeeProfileDrawer } from '@/components/EmployeeProfileDrawer';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useToast } from '@/components/Toast';

function EmployeeDetailsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const { employees, deleteEmployee, currentUser } = useHRStore();
  const { showToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<'All' | 'Employees' | 'Interns'>('All');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Auto-select highlighted employee from global search if any
  React.useEffect(() => {
    if (highlightId) {
      const found = employees.find((e) => e.id === highlightId);
      if (found) setSelectedEmployee(found);
    }
  }, [highlightId, employees]);

  // Filter and sort logic
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Type Filter
      if (activeFilter === 'Employees' && emp.employmentType === 'Intern') return false;
      if (activeFilter === 'Interns' && emp.employmentType !== 'Intern') return false;

      // Department Filter
      if (departmentFilter !== 'All' && emp.department !== departmentFilter) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const fullName = `${emp.firstName} ${emp.lastName}`.toLowerCase();
        const matchesName = fullName.includes(query);
        const matchesCode = emp.employeeId.toLowerCase().includes(query);
        const matchesDept = emp.department.toLowerCase().includes(query);
        const matchesRole = emp.jobTitle.toLowerCase().includes(query);
        if (!matchesName && !matchesCode && !matchesDept && !matchesRole) return false;
      }

      return true;
    });
  }, [employees, activeFilter, departmentFilter, searchTerm]);

  const handleDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      showToast(
        'Employee Deleted',
        `${employeeToDelete.firstName} ${employeeToDelete.lastName} removed from company directory.`,
        'info'
      );
      setEmployeeToDelete(null);
    }
  };

  const departments = useMemo(() => {
    const set = new Set<string>();
    employees.forEach((e) => {
      if (e.department) set.add(e.department);
    });
    return Array.from(set);
  }, [employees]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Controls: Filter Pills & Action Buttons (Faithful to Reference UI 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Pills: All | Employees | Interns */}
        <div className="flex items-center gap-2">
          {(['All', 'Employees', 'Interns'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${activeFilter === tab
                ? 'border border-[#FF7900] text-[#FF7900] bg-orange-50/40 shadow-2xs'
                : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search, Dept Filter & Add Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* In-page Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search directory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
            />
          </div>

          {/* Department Filter Dropdown */}
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

          {/* Add Employee Button (Only Admin or quick access) */}
          {currentUser.role === 'admin' && (
            <button
              onClick={() => {
                setEditingEmployee(null);
                setIsAddModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7900] hover:bg-[#E66C00] text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card (Faithful to Reference UI 2) */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs overflow-hidden">
        {/* Table Count Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/40">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            {filteredEmployees.length} TOTAL RECORDS
          </span>
          <span className="text-xs text-zinc-400">
            Click any row to view employee profile
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/20">
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  DEPARTMENT
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  DESIGNATION
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  JOINED
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-right">
                  {currentUser.role === 'admin' ? 'ACTIONS' : ''}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-400 text-sm">
                    No employee records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-orange-50/20 transition-colors cursor-pointer group"
                  >
                    {/* NAME & AVATAR */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        {emp.avatarUrl ? (
                          <img
                            src={emp.avatarUrl}
                            alt={`${emp.firstName} ${emp.lastName}`}
                            className="w-10 h-10 rounded-full object-cover shrink-0 shadow-xs border border-zinc-200"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                            style={{
                              backgroundColor: emp.avatarColor || getAvatarColor(emp.id),
                            }}
                          >
                            {getInitials(`${emp.firstName} ${emp.lastName}`)}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-bold text-zinc-900 group-hover:text-[#FF7900] transition-colors">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-xs text-zinc-400 font-mono mt-0.5">
                            {emp.employeeId}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-6 py-4 text-xs font-medium text-zinc-700">
                      {emp.department}
                    </td>

                    {/* DESIGNATION */}
                    <td className="px-6 py-4 text-xs font-medium text-zinc-700">
                      {emp.jobTitle}
                    </td>

                    {/* JOINED DATE */}
                    <td className="px-6 py-4 text-xs font-medium text-zinc-500 font-mono">
                      {emp.joiningDate}
                    </td>

                    {/* CHEVRON & ADMIN ACTIONS */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {currentUser.role === 'admin' && (
                          <div
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity mr-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setEditingEmployee(emp);
                                setIsAddModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-zinc-200/80 text-zinc-500 hover:text-zinc-900 transition-colors"
                              title="Edit Employee"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEmployeeToDelete(emp)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-zinc-500 hover:text-rose-600 transition-colors"
                              title="Delete Employee"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-[#FF7900] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Detail Drawer */}
      <EmployeeProfileDrawer
        employee={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Employee Modal */}
      <EmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingEmployee(null);
        }}
        employeeToEdit={editingEmployee}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!employeeToDelete}
        title="Delete Employee?"
        description={`Are you sure you want to delete ${employeeToDelete?.firstName} ${employeeToDelete?.lastName} (${employeeToDelete?.employeeId})? This action cannot be undone.`}
        confirmLabel="Delete Employee"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  );
}

export default function EmployeeDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-zinc-400 text-sm">
          Loading employee records...
        </div>
      }
    >
      <EmployeeDetailsContent />
    </Suspense>
  );
}
