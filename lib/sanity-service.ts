import { client, writeClient } from '@/sanity/lib/client';
import { isSanityConfigured, writeToken } from '@/sanity/env';
import {
  EMPLOYEES_QUERY,
  SPECIAL_EVENTS_QUERY,
  WFH_REQUESTS_QUERY,
  PAYROLL_RECORDS_QUERY,
  CURRENT_USERS_QUERY,
} from '@/sanity/lib/queries';
import { Employee, SpecialEvent, WFHRequest, PayrollRecord, CurrentUser } from './types';

export const sanityService = {
  isConfigured: () => isSanityConfigured,

  // Fetch all employees from Sanity
  getEmployees: async (): Promise<Employee[] | null> => {
    if (!isSanityConfigured) return null;
    try {
      const data = await client.fetch(EMPLOYEES_QUERY);
      if (Array.isArray(data) && data.length > 0) {
        return data as Employee[];
      }
      return null;
    } catch (err) {
      console.warn('Error fetching employees from Sanity:', err);
      return null;
    }
  },

  // Fetch special events from Sanity
  getEvents: async (): Promise<SpecialEvent[] | null> => {
    if (!isSanityConfigured) return null;
    try {
      const data = await client.fetch(SPECIAL_EVENTS_QUERY);
      if (Array.isArray(data) && data.length > 0) {
        return data as SpecialEvent[];
      }
      return null;
    } catch (err) {
      console.warn('Error fetching events from Sanity:', err);
      return null;
    }
  },

  // Fetch WFH requests from Sanity
  getWFHRequests: async (): Promise<WFHRequest[] | null> => {
    if (!isSanityConfigured) return null;
    try {
      const data = await client.fetch(WFH_REQUESTS_QUERY);
      if (Array.isArray(data) && data.length > 0) {
        return data as WFHRequest[];
      }
      return null;
    } catch (err) {
      console.warn('Error fetching WFH requests from Sanity:', err);
      return null;
    }
  },

  // Fetch Payroll records from Sanity
  getPayrollRecords: async (): Promise<PayrollRecord[] | null> => {
    if (!isSanityConfigured) return null;
    try {
      const data = await client.fetch(PAYROLL_RECORDS_QUERY);
      if (Array.isArray(data) && data.length > 0) {
        return data as PayrollRecord[];
      }
      return null;
    } catch (err) {
      console.warn('Error fetching payroll from Sanity:', err);
      return null;
    }
  },

  // Fetch Current Users from Sanity
  getCurrentUsers: async (): Promise<CurrentUser[] | null> => {
    if (!isSanityConfigured) return null;
    try {
      const data = await client.fetch(CURRENT_USERS_QUERY);
      if (Array.isArray(data) && data.length > 0) {
        return data as CurrentUser[];
      }
      return null;
    } catch (err) {
      console.warn('Error fetching current users from Sanity:', err);
      return null;
    }
  },

  // Mutations to Sanity when writeToken is available
  createEmployee: async (employee: Omit<Employee, 'id'>) => {
    if (!isSanityConfigured || !writeToken) return null;
    try {
      return await writeClient.create({
        _type: 'employee',
        ...employee,
      });
    } catch (err) {
      console.error('Failed to create employee in Sanity:', err);
      return null;
    }
  },

  updateEmployee: async (id: string, updates: Partial<Employee>) => {
    if (!isSanityConfigured || !writeToken) return null;
    try {
      return await writeClient.patch(id).set(updates).commit();
    } catch (err) {
      console.error('Failed to update employee in Sanity:', err);
      return null;
    }
  },

  deleteEmployee: async (id: string) => {
    if (!isSanityConfigured || !writeToken) return null;
    try {
      return await writeClient.delete(id);
    } catch (err) {
      console.error('Failed to delete employee in Sanity:', err);
      return null;
    }
  },
};
