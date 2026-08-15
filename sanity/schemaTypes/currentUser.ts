import { defineField, defineType } from 'sanity';

export const currentUserSchema = defineType({
  name: 'currentUser',
  title: 'Current User',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
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
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'Employee', value: 'employee' },
        ],
      },
      validation: (Rule) => Rule.required(),
      initialValue: 'employee',
    }),
    defineField({
      name: 'avatarUrl',
      title: 'Avatar URL',
      type: 'url',
    }),
    defineField({
      name: 'employeeId',
      title: 'Employee ID',
      type: 'string',
      description: 'Reference to the employee record code (e.g. EMP-001)',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle === 'admin' ? 'Administrator' : 'Employee',
      };
    },
  },
});
