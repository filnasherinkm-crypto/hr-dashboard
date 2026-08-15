'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Phone, Building2, Briefcase, MapPin, DollarSign, Calendar } from 'lucide-react';
import { Employee, EmploymentType, EmployeeStatus } from '@/lib/types';
import { useHRStore } from '@/lib/store';
import { useToast } from './Toast';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  employeeToEdit,
}) => {
  const { addEmployee, updateEmployee, employees } = useHRStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    jobTitle: '',
    employmentType: 'Full-time' as EmploymentType,
    joiningDate: '11 Aug 2026',
    joiningDateIso: '2026-08-11',
    manager: '',
    location: 'San Francisco, CA',
    status: 'Active' as EmployeeStatus,
    salary: 85000,
    bankName: 'Chase Bank',
    accountNumber: '•••• •••• 1234',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (employeeToEdit) {
      setFormData({
        firstName: employeeToEdit.firstName,
        lastName: employeeToEdit.lastName,
        email: employeeToEdit.email,
        phone: employeeToEdit.phone,
        department: employeeToEdit.department,
        jobTitle: employeeToEdit.jobTitle,
        employmentType: employeeToEdit.employmentType,
        joiningDate: employeeToEdit.joiningDate,
        joiningDateIso: employeeToEdit.joiningDateIso || '2026-08-11',
        manager: employeeToEdit.manager || '',
        location: employeeToEdit.location,
        status: employeeToEdit.status,
        salary: employeeToEdit.salary,
        bankName: employeeToEdit.bankName || 'Chase Bank',
        accountNumber: employeeToEdit.accountNumber || '•••• •••• 1234',
        emergencyContact: employeeToEdit.emergencyContact || '',
        emergencyPhone: employeeToEdit.emergencyPhone || '',
      });
    } else {
      // Auto assign next employee ID
      const empCount = employees.filter((e) => e.employmentType !== 'Intern').length;
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+1 (555) ',
        department: 'Engineering',
        jobTitle: '',
        employmentType: 'Full-time',
        joiningDate: '11 Aug 2026',
        joiningDateIso: '2026-08-11',
        manager: 'Marcus Webb',
        location: 'San Francisco, CA',
        status: 'Active',
        salary: 95000,
        bankName: 'Chase Bank',
        accountNumber: '•••• •••• 5541',
        emergencyContact: '',
        emergencyPhone: '',
      });
    }
    setErrors({});
  }, [employeeToEdit, isOpen, employees]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.jobTitle.trim()) newErrors.jobTitle = 'Designation/Job title is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Valid annual salary is required';
    if (!formData.joiningDateIso) newErrors.joiningDateIso = 'Joining date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate readable date
    const d = new Date(formData.joiningDateIso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    const formattedDate = `${day} ${month} ${year}`;

    if (employeeToEdit) {
      updateEmployee(employeeToEdit.id, {
        ...formData,
        joiningDate: formattedDate,
      });
      showToast('Employee Updated', `${formData.firstName} ${formData.lastName} has been updated.`, 'success');
    } else {
      // Determine employee ID prefix
      const isIntern = formData.employmentType === 'Intern';
      const existingOfSameType = employees.filter((e) =>
        isIntern ? e.employmentType === 'Intern' : e.employmentType !== 'Intern'
      );
      const nextNum = existingOfSameType.length + 1;
      const generatedCode = `${isIntern ? 'INT' : 'EMP'}-${String(nextNum).padStart(3, '0')}`;

      addEmployee({
        ...formData,
        employeeId: generatedCode,
        joiningDate: formattedDate,
      });
      showToast(
        'Employee Created',
        `${formData.firstName} ${formData.lastName} (${generatedCode}) added to the organization.`,
        'success'
      );
    }

    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col animate-slide-down"
        style={{ maxHeight: 'calc(100vh - 3rem)' }}
      >
          {/* Header */}
          <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                {employeeToEdit ? 'Edit Employee Record' : 'Add New Employee'}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                {employeeToEdit
                  ? `Updating profile and contract info for ${employeeToEdit.employeeId}`
                  : 'Fill out employee details to register them in the system'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-800 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            {/* Scrollable Form Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              {/* Section: Basic Info */}
              <div>
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    First Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="e.g. Marcus"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs text-rose-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Last Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                    placeholder="e.g. Webb"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-rose-500 mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="name@acmecorp.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Role & Department */}
            <div className="pt-2 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Organization & Position
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Designation / Job Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  {errors.jobTitle && (
                    <p className="text-xs text-rose-500 mt-1">{errors.jobTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Employment Type <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) =>
                      setFormData({ ...formData, employmentType: e.target.value as EmploymentType })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Intern">Intern</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as EmployeeStatus })
                    }
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Joining Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      required
                      value={formData.joiningDateIso}
                      onChange={(e) => setFormData({ ...formData, joiningDateIso: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Location / Office
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Compensation & Bank Details */}
            <div className="pt-2 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Compensation & Bank Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Annual Salary ($ USD) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      required
                      min={1000}
                      step={1000}
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                      placeholder="95000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                    placeholder="Chase / Silicon Valley Bank"
                  />
                </div>
              </div>
            </div>

            {/* Section: Emergency Contact */}
            <div className="pt-2 border-t border-zinc-100">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Emergency Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Contact Name & Relation
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                    placeholder="e.g. Sarah Webb (Spouse)"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">
                    Emergency Phone
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                    placeholder="+1 (555) 000-1122"
                  />
                </div>
              </div>
            </div>

            </div>

            {/* Submit Footer */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold rounded-xl text-white bg-[#FF7900] hover:bg-[#E66C00] shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                {employeeToEdit ? 'Save Changes' : 'Create Employee'}
              </button>
            </div>
          </form>
        </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
