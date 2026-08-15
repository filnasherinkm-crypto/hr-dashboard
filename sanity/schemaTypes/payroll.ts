import { defineField, defineType } from 'sanity';

export const payrollType = defineType({
  name: 'payroll',
  title: 'Payroll Structure',
  type: 'document',
  fields: [
    defineField({
      name: 'employee',
      title: 'Employee',
      type: 'reference',
      to: [{ type: 'employee' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employeeId',
      title: 'Employee ID Code',
      type: 'string',
    }),
    defineField({
      name: 'employeeName',
      title: 'Employee Name',
      type: 'string',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
    }),
    defineField({
      name: 'jobTitle',
      title: 'Designation / Job Title',
      type: 'string',
    }),
    defineField({
      name: 'basicSalary',
      title: 'Basic Monthly Salary ($)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'housingAllowance',
      title: 'Housing Allowance ($)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'transportAllowance',
      title: 'Transport Allowance ($)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'otherAllowance',
      title: 'Other Allowances ($)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'deductions',
      title: 'Statutory Taxes & Deductions ($)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'grossSalary',
      title: 'Gross Salary ($)',
      type: 'number',
      description: 'Auto-calculated: Basic + Housing + Transport + Other',
    }),
    defineField({
      name: 'netSalary',
      title: 'Net Salary ($)',
      type: 'number',
      description: 'Auto-calculated: Gross - Deductions',
    }),
    defineField({
      name: 'status',
      title: 'Disbursement Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid', value: 'Paid' },
          { title: 'Processing', value: 'Processing' },
          { title: 'Pending', value: 'Pending' },
        ],
      },
      initialValue: 'Paid',
    }),
    defineField({
      name: 'paymentDate',
      title: 'Payment Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'employeeName',
      net: 'netSalary',
      status: 'status',
    },
    prepare(selection) {
      const { title, net, status } = selection;
      return {
        title: `${title} ($${net || 0})`,
        subtitle: `Status: ${status || 'Pending'}`,
      };
    },
  },
});
