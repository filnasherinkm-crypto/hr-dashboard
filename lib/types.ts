import { Image } from "sanity";

export type EmploymentType = 'Full-time' | 'Part-time' | 'Intern' | 'Contract';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Inactive';
export type UserRole = 'admin' | 'employee';

export interface Employee {
  id: string;
  employeeId: string; // e.g. EMP-001, INT-001
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarColor?: string;
  department: string;
  jobTitle: string;
  employmentType: EmploymentType;
  joiningDate: string; // e.g. 12 Mar 2021
  joiningDateIso: string; // YYYY-MM-DD
  manager?: string;
  location: string;
  status: EmployeeStatus;
  salary: number;
  bankName?: string;
  accountNumber?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  avatarUrl?: string;
}

export type EventType = 'Birthday' | 'Work Anniversary' | 'Company Holiday' | 'Personal Event' | 'Other';

export interface SpecialEvent {
  id: string;
  employeeId?: string;
  employeeName: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  description?: string;
  years?: number; // for anniversary
}

export type WFHStatus = 'Pending' | 'Approved' | 'Rejected';

export interface WFHRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestDate: string; // YYYY-MM-DD
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  displayDateRange: string; // e.g. Aug 12–13, 2026
  reason: string;
  status: WFHStatus;
  approvedBy?: string;
  reviewedAt?: string;
}

export type PayrollStatus = 'Paid' | 'Processing' | 'Pending';

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  jobTitle: string;
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  grossSalary: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  paymentDate?: string;
}

export type LeaveType = 'Leave' | 'WFH' | 'Approved WFH' | 'Holiday';

export interface CalendarEntry {
  id: string;
  employeeId?: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  type: LeaveType;
  title?: string;
  reason?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  employeeId?: string;
  department?: string;
  title?: string;
  phone?: string;
  location?: string;
}

