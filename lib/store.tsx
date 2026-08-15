'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Employee,
  SpecialEvent,
  WFHRequest,
  PayrollRecord,
  CalendarEntry,
  CurrentUser,
  UserRole,
  WFHStatus,
} from './types';
import {
  CURRENT_DATE_REFERENCE,
  CURRENT_USER_ADMIN,
  CURRENT_USER_EMPLOYEE,
} from './seed-data';
import { sanityService } from './sanity-service';

interface DepartmentHeadcount {
  department: string;
  employees: number;
  interns: number;
  total: number;
  color: string;
}

interface HRStoreContextType {
  // State
  employees: Employee[];
  events: SpecialEvent[];
  wfhRequests: WFHRequest[];
  payrollRecords: PayrollRecord[];
  calendarEntries: CalendarEntry[];
  currentUser: CurrentUser;
  currentDate: string;
  globalSearchQuery: string;
  isSearchOpen: boolean;
  isSanityConnected: boolean;

  // Search & Modals
  setGlobalSearchQuery: (query: string) => void;
  setIsSearchOpen: (open: boolean) => void;
  switchRole: (role: UserRole) => void;

  // Employee CRUD
  addEmployee: (employeeData: Omit<Employee, 'id'>) => Employee;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Event CRUD
  addEvent: (eventData: Omit<SpecialEvent, 'id'>) => SpecialEvent;
  updateEvent: (id: string, updates: Partial<SpecialEvent>) => void;
  deleteEvent: (id: string) => void;

  // WFH CRUD
  addWFHRequest: (requestData: Omit<WFHRequest, 'id' | 'status'>) => WFHRequest;
  approveWFHRequest: (id: string) => void;
  rejectWFHRequest: (id: string) => void;
  deleteWFHRequest: (id: string) => void;

  // Payroll CRUD
  addPayrollRecord: (recordData: Omit<PayrollRecord, 'id' | 'grossSalary' | 'netSalary'>) => PayrollRecord;
  updatePayrollRecord: (id: string, updates: Partial<PayrollRecord>) => void;
  deletePayrollRecord: (id: string) => void;

  // Calendar actions
  addCalendarEntry: (entry: Omit<CalendarEntry, 'id'>) => void;
  deleteCalendarEntry: (id: string) => void;

  // Reset demo data
  resetToDefault: () => void;

  // Dynamic Calculated Statistics
  stats: {
    totalEmployees: number;
    totalInterns: number;
    totalAllStaff: number;
    activeStaffCount: number;
    wfhPendingCount: number;
    wfhApprovedCount: number;
    headcountByDepartment: DepartmentHeadcount[];
    totalHeadcountSummary: { employees: number; interns: number; total: number };
  };
}

const HRStoreContext = createContext<HRStoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  EMPLOYEES: 'filna_hr_employees_v3_real',
  EVENTS: 'filna_hr_events_v3_real',
  WFH: 'filna_hr_wfh_v3_real',
  PAYROLL: 'filna_hr_payroll_v3_real',
  CALENDAR: 'filna_hr_calendar_v3_real',
  USER_ROLE: 'filna_hr_role_v3_real',
};

export const HRStoreProvider = ({ children }: { children: ReactNode }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [wfhRequests, setWfhRequests] = useState<WFHRequest[]>([]);
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(CURRENT_USER_ADMIN);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSanityConnected, setIsSanityConnected] = useState(false);

  // Initialize from LocalStorage & Sanity on mount
  useEffect(() => {
    try {
      const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
      if (storedEmployees) setEmployees(JSON.parse(storedEmployees));

      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) setEvents(JSON.parse(storedEvents));

      const storedWFH = localStorage.getItem(STORAGE_KEYS.WFH);
      if (storedWFH) setWfhRequests(JSON.parse(storedWFH));

      const storedPayroll = localStorage.getItem(STORAGE_KEYS.PAYROLL);
      if (storedPayroll) setPayrollRecords(JSON.parse(storedPayroll));

      const storedCalendar = localStorage.getItem(STORAGE_KEYS.CALENDAR);
      if (storedCalendar) setCalendarEntries(JSON.parse(storedCalendar));

      const storedRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
      if (storedRole === 'employee') {
        setCurrentUser(CURRENT_USER_EMPLOYEE);
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    } finally {
      setIsLoaded(true);
    }

    // Try fetching from Sanity if configured
    if (sanityService.isConfigured()) {
      setIsSanityConnected(true);
      Promise.all([
        sanityService.getEmployees(),
        sanityService.getEvents(),
        sanityService.getWFHRequests(),
        sanityService.getPayrollRecords(),
      ]).then(([sEmployees, sEvents, sWFH, sPayroll]) => {
        setEmployees(sEmployees || []);
        setEvents(sEvents || []);
        setWfhRequests(sWFH || []);
        setPayrollRecords(sPayroll || []);
      });
    }
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
    } catch (e) {
      console.error(e);
    }
  }, [employees, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    } catch (e) {
      console.error(e);
    }
  }, [events, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.WFH, JSON.stringify(wfhRequests));
    } catch (e) {
      console.error(e);
    }
  }, [wfhRequests, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrollRecords));
    } catch (e) {
      console.error(e);
    }
  }, [payrollRecords, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEntries));
    } catch (e) {
      console.error(e);
    }
  }, [calendarEntries, isLoaded]);

  const switchRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser(CURRENT_USER_ADMIN);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'admin');
      } catch {}
    } else {
      setCurrentUser(CURRENT_USER_EMPLOYEE);
      try {
        localStorage.setItem(STORAGE_KEYS.USER_ROLE, 'employee');
      } catch {}
    }
  };

  const resetToDefault = () => {
    setEmployees([]);
    setEvents([]);
    setWfhRequests([]);
    setPayrollRecords([]);
    setCalendarEntries([]);
    setCurrentUser(CURRENT_USER_ADMIN);
    try {
      localStorage.clear();
    } catch {}
  };

  // Employee actions
  const addEmployee = (employeeData: Omit<Employee, 'id'>): Employee => {
    const id = `emp-${Date.now()}`;
    const newEmp: Employee = { ...employeeData, id };
    setEmployees((prev) => [newEmp, ...prev]);

    // Optional async sync with Sanity
    sanityService.createEmployee(employeeData);

    const basic = Math.round((employeeData.salary / 12) * 0.7);
    const housing = Math.round(basic * 0.15);
    const transport = 350;
    const other = 200;
    const gross = basic + housing + transport + other;
    const deductions = Math.round(gross * 0.12);
    const net = gross - deductions;

    const newPayroll: PayrollRecord = {
      id: `pay-${Date.now()}`,
      employeeId: employeeData.employeeId,
      employeeName: `${employeeData.firstName} ${employeeData.lastName}`,
      department: employeeData.department,
      jobTitle: employeeData.jobTitle,
      basicSalary: basic,
      housingAllowance: housing,
      transportAllowance: transport,
      otherAllowance: other,
      grossSalary: gross,
      deductions: deductions,
      netSalary: net,
      status: 'Paid',
      paymentDate: '2026-08-01',
    };
    setPayrollRecords((prev) => [newPayroll, ...prev]);

    return newEmp;
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );

    sanityService.updateEmployee(id, updates);

    if (updates.firstName || updates.lastName || updates.department || updates.jobTitle) {
      setPayrollRecords((prev) =>
        prev.map((rec) => {
          const emp = employees.find((e) => e.id === id);
          if (emp && rec.employeeId === emp.employeeId) {
            return {
              ...rec,
              employeeName: `${updates.firstName ?? emp.firstName} ${updates.lastName ?? emp.lastName}`,
              department: updates.department ?? emp.department,
              jobTitle: updates.jobTitle ?? emp.jobTitle,
            };
          }
          return rec;
        })
      );
    }
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setPayrollRecords((prev) => prev.filter((rec) => rec.employeeId !== target.employeeId));
    setWfhRequests((prev) =>
      prev.filter(
        (req) =>
          req.employeeId !== id &&
          req.employeeName !== `${target.firstName} ${target.lastName}`
      )
    );

    sanityService.deleteEmployee(id);
  };

  // Event actions
  const addEvent = (eventData: Omit<SpecialEvent, 'id'>): SpecialEvent => {
    const newEvent: SpecialEvent = { ...eventData, id: `evt-${Date.now()}` };
    setEvents((prev) => [newEvent, ...prev]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<SpecialEvent>) => {
    setEvents((prev) => prev.map((ev) => (ev.id === id ? { ...ev, ...updates } : ev)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // WFH actions
  const addWFHRequest = (requestData: Omit<WFHRequest, 'id' | 'status'>): WFHRequest => {
    const newRequest: WFHRequest = {
      ...requestData,
      id: `wfh-${Date.now()}`,
      status: 'Pending',
    };
    setWfhRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const approveWFHRequest = (id: string) => {
    setWfhRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Approved' as WFHStatus,
              approvedBy: currentUser.name,
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : req
      )
    );

    const req = wfhRequests.find((r) => r.id === id);
    if (req) {
      setCalendarEntries((prev) => [
        ...prev.filter((c) => !(c.employeeName === req.employeeName && c.date === req.startDate)),
        {
          id: `cal-${Date.now()}`,
          employeeId: req.employeeId,
          employeeName: req.employeeName,
          date: req.startDate,
          type: 'Approved WFH',
          reason: req.reason,
        },
      ]);
    }
  };

  const rejectWFHRequest = (id: string) => {
    setWfhRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Rejected' as WFHStatus,
              approvedBy: currentUser.name,
              reviewedAt: new Date().toISOString().split('T')[0],
            }
          : req
      )
    );
  };

  const deleteWFHRequest = (id: string) => {
    setWfhRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Payroll actions
  const addPayrollRecord = (
    recordData: Omit<PayrollRecord, 'id' | 'grossSalary' | 'netSalary'>
  ): PayrollRecord => {
    const gross =
      recordData.basicSalary +
      recordData.housingAllowance +
      recordData.transportAllowance +
      recordData.otherAllowance;
    const net = gross - recordData.deductions;

    const newRecord: PayrollRecord = {
      ...recordData,
      id: `pay-${Date.now()}`,
      grossSalary: gross,
      netSalary: net,
    };
    setPayrollRecords((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const updatePayrollRecord = (id: string, updates: Partial<PayrollRecord>) => {
    setPayrollRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const merged = { ...rec, ...updates };
        const gross =
          (merged.basicSalary || 0) +
          (merged.housingAllowance || 0) +
          (merged.transportAllowance || 0) +
          (merged.otherAllowance || 0);
        const net = gross - (merged.deductions || 0);
        return {
          ...merged,
          grossSalary: gross,
          netSalary: net,
        };
      })
    );
  };

  const deletePayrollRecord = (id: string) => {
    setPayrollRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Calendar actions
  const addCalendarEntry = (entry: Omit<CalendarEntry, 'id'>) => {
    const newEntry: CalendarEntry = { ...entry, id: `cal-${Date.now()}` };
    setCalendarEntries((prev) => [...prev, newEntry]);
  };

  const deleteCalendarEntry = (id: string) => {
    setCalendarEntries((prev) => prev.filter((c) => c.id !== id));
  };

  // Compute dynamic live statistics
  const stats = useMemo(() => {
    const fullTimeEmployees = employees.filter(
      (e) => (e.employmentType === 'Full-time' || e.employmentType === 'Part-time') && e.status === 'Active'
    );
    const interns = employees.filter(
      (e) => e.employmentType === 'Intern' && e.status === 'Active'
    );
    const activeStaff = employees.filter((e) => e.status === 'Active');

    const pendingWFH = wfhRequests.filter((r) => r.status === 'Pending').length;
    const approvedWFH = wfhRequests.filter((r) => r.status === 'Approved').length;

    const deptMap: Record<string, { employees: number; interns: number; color: string }> = {
      Engineering: { employees: 0, interns: 0, color: '#f97316' },
      Product: { employees: 0, interns: 0, color: '#fb923c' },
      Design: { employees: 0, interns: 0, color: '#ea580c' },
      Finance: { employees: 0, interns: 0, color: '#c2410c' },
      Marketing: { employees: 0, interns: 0, color: '#fdba74' },
    };

    employees.forEach((emp) => {
      const dept = emp.department || 'Other';
      if (!deptMap[dept]) {
        deptMap[dept] = { employees: 0, interns: 0, color: '#f97316' };
      }
      if (emp.employmentType === 'Intern') {
        deptMap[dept].interns += 1;
      } else {
        deptMap[dept].employees += 1;
      }
    });

    const headcountByDepartment: DepartmentHeadcount[] = Object.keys(deptMap).map((dept) => ({
      department: dept,
      employees: deptMap[dept].employees,
      interns: deptMap[dept].interns,
      total: deptMap[dept].employees + deptMap[dept].interns,
      color: deptMap[dept].color,
    }));

    const totalHeadcountSummary = {
      employees: fullTimeEmployees.length,
      interns: interns.length,
      total: employees.length,
    };

    return {
      totalEmployees: fullTimeEmployees.length,
      totalInterns: interns.length,
      totalAllStaff: employees.length,
      activeStaffCount: activeStaff.length,
      wfhPendingCount: pendingWFH,
      wfhApprovedCount: approvedWFH,
      headcountByDepartment,
      totalHeadcountSummary,
    };
  }, [employees, wfhRequests]);

  return (
    <HRStoreContext.Provider
      value={{
        employees,
        events,
        wfhRequests,
        payrollRecords,
        calendarEntries,
        currentUser,
        currentDate: CURRENT_DATE_REFERENCE,
        globalSearchQuery,
        isSearchOpen,
        isSanityConnected,
        setGlobalSearchQuery,
        setIsSearchOpen,
        switchRole,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addEvent,
        updateEvent,
        deleteEvent,
        addWFHRequest,
        approveWFHRequest,
        rejectWFHRequest,
        deleteWFHRequest,
        addPayrollRecord,
        updatePayrollRecord,
        deletePayrollRecord,
        addCalendarEntry,
        deleteCalendarEntry,
        resetToDefault,
        stats,
      }}
    >
      {children}
    </HRStoreContext.Provider>
  );
};

export const useHRStore = () => {
  const context = useContext(HRStoreContext);
  if (!context) {
    throw new Error('useHRStore must be used within an HRStoreProvider');
  }
  return context;
};
