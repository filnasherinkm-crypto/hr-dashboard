import { type SchemaTypeDefinition } from 'sanity';
import { employeeType } from './employee';
import { specialEventType } from './specialEvent';
import { wfhRequestType } from './wfhRequest';
import { payrollType } from './payroll';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [employeeType, specialEventType, wfhRequestType, payrollType],
};
