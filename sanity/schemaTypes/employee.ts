import { defineField, defineType } from 'sanity';

export const employeeType = defineType({
  name: 'employee',
  title: 'Employee',
  type: 'document',
  fields: [
    defineField({
      name: 'employeeId',
      title: 'Employee ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Engineering', value: 'Engineering' },
          { title: 'Product', value: 'Product' },
          { title: 'Design', value: 'Design' },
          { title: 'Finance', value: 'Finance' },
          { title: 'Marketing', value: 'Marketing' },
          { title: 'Human Resources', value: 'Human Resources' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Designation / Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time', value: 'Full-time' },
          { title: 'Intern', value: 'Intern' },
          { title: 'Part-time', value: 'Part-time' },
          { title: 'Contract', value: 'Contract' },
        ],
      },
      initialValue: 'Full-time',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'joiningDate',
      title: 'Joining Date (Display)',
      type: 'string',
    }),
    defineField({
      name: 'joiningDateIso',
      title: 'Joining Date (ISO)',
      type: 'date',
    }),
    defineField({
      name: 'manager',
      title: 'Reporting Manager',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Office Location',
      type: 'string',
      initialValue: 'San Francisco, CA',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'Active' },
          { title: 'On Leave', value: 'On Leave' },
          { title: 'Inactive', value: 'Inactive' },
        ],
      },
      initialValue: 'Active',
    }),
    defineField({
      name: 'salary',
      title: 'Annual Salary ($ USD)',
      type: 'number',
    }),
    defineField({
      name: 'bankName',
      title: 'Bank Name',
      type: 'string',
    }),
    defineField({
      name: 'accountNumber',
      title: 'Bank Account Number (Masked)',
      type: 'string',
    }),
    defineField({
      name: 'emergencyContact',
      title: 'Emergency Contact Name',
      type: 'string',
    }),
    defineField({
      name: 'emergencyPhone',
      title: 'Emergency Contact Phone',
      type: 'string',
    }),
    defineField({
      name: 'avatarImage',
      title: 'Profile Photo',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'jobTitle',
      lastName: 'lastName',
      empId: 'employeeId',
      media: 'avatarImage',
    },
    prepare(selection) {
      const { title, lastName, subtitle, empId, media } = selection;
      return {
        title: `${title} ${lastName} (${empId})`,
        subtitle: subtitle,
        media: media,
      };
    },
  },
});
