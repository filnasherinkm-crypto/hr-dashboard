'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, Sparkles, User, FileText } from 'lucide-react';
import { SpecialEvent, EventType } from '@/lib/types';
import { useHRStore } from '@/lib/store';
import { useToast } from './Toast';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: SpecialEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, eventToEdit }) => {
  const { addEvent, updateEvent, employees } = useHRStore();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Birthday' as EventType,
    date: '2026-08-15',
    employeeId: '',
    employeeName: '',
    description: '',
    years: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        title: eventToEdit.title,
        type: eventToEdit.type,
        date: eventToEdit.date,
        employeeId: eventToEdit.employeeId || '',
        employeeName: eventToEdit.employeeName || '',
        description: eventToEdit.description || '',
        years: eventToEdit.years || 1,
      });
    } else {
      setFormData({
        title: '',
        type: 'Birthday',
        date: '2026-08-15',
        employeeId: employees[0]?.id || '',
        employeeName: employees[0] ? `${employees[0].firstName} ${employees[0].lastName}` : 'All Company',
        description: '',
        years: 1,
      });
    }
    setErrors({});
  }, [eventToEdit, isOpen, employees]);

  const handleEmployeeChange = (empId: string) => {
    if (empId === 'all') {
      setFormData({
        ...formData,
        employeeId: '',
        employeeName: 'All Company',
      });
    } else {
      const emp = employees.find((e) => e.id === empId);
      if (emp) {
        setFormData({
          ...formData,
          employeeId: emp.id,
          employeeName: `${emp.firstName} ${emp.lastName}`,
          title: formData.title || `${emp.firstName} ${emp.lastName} — ${formData.type}`,
        });
      }
    }
  };

  const handleTypeChange = (type: EventType) => {
    let autoTitle = formData.title;
    if (type === 'Company Holiday') {
      autoTitle = formData.title || 'Company Holiday';
    } else if (formData.employeeName && formData.employeeName !== 'All Company') {
      autoTitle = `${formData.employeeName} — ${type}`;
    }

    setFormData({
      ...formData,
      type,
      title: autoTitle,
      employeeName: type === 'Company Holiday' ? 'All Company' : formData.employeeName,
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) errs.title = 'Event title is required';
    if (!formData.date) errs.date = 'Event date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (eventToEdit) {
      updateEvent(eventToEdit.id, formData);
      showToast('Event Updated', `${formData.title} has been updated.`, 'success');
    } else {
      addEvent(formData);
      showToast('Event Scheduled', `${formData.title} added to special events.`, 'success');
    }

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
            <h2 className="text-lg font-bold text-zinc-900">
              {eventToEdit ? 'Edit Special Event' : 'Add Special Event'}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Record employee milestones, birthdays, or company holidays
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
          <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
            <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Event Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['Birthday', 'Work Anniversary', 'Company Holiday', 'Personal Event', 'Other'] as EventType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border text-left ${
                      formData.type === t
                        ? 'bg-orange-50 border-[#FF7900] text-[#FF7900] shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Sparkles className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                placeholder="e.g. Marcus Webb — Birthday"
              />
            </div>
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {formData.type !== 'Company Holiday' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Associated Employee
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <select
                  value={formData.employeeId || 'all'}
                  onChange={(e) => handleEmployeeChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-white"
                >
                  <option value="all">All Company / General</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Event Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              />
            </div>
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>

          {formData.type === 'Work Anniversary' && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Years of Service
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={formData.years}
                onChange={(e) => setFormData({ ...formData, years: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
                placeholder="e.g. 6"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Description / Notes
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 text-sm border rounded-xl border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900]"
              placeholder="Celebration details, cake order, or holiday guidelines..."
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
              {eventToEdit ? 'Save Changes' : 'Schedule Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
