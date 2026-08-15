import { defineField, defineType } from 'sanity';

export const wfhRequestType = defineType({
  name: 'wfhRequest',
  title: 'WFH Request',
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
      name: 'employeeName',
      title: 'Employee Name (Denormalized)',
      type: 'string',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
    }),
    defineField({
      name: 'requestDate',
      title: 'Request Submission Date',
      type: 'date',
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayDateRange',
      title: 'Display Date Range',
      type: 'string',
    }),
    defineField({
      name: 'reason',
      title: 'Reason for Request',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Approval Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'Pending' },
          { title: 'Approved', value: 'Approved' },
          { title: 'Rejected', value: 'Rejected' },
        ],
      },
      initialValue: 'Pending',
    }),
    defineField({
      name: 'approvedBy',
      title: 'Reviewed By',
      type: 'string',
    }),
    defineField({
      name: 'reviewedAt',
      title: 'Reviewed At Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'employeeName',
      subtitle: 'displayDateRange',
      status: 'status',
    },
    prepare(selection) {
      const { title, subtitle, status } = selection;
      return {
        title: `${title || 'Employee'} (${status})`,
        subtitle: subtitle || 'Remote Request',
      };
    },
  },
});
