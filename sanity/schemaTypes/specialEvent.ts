import { defineField, defineType } from 'sanity';

export const specialEventType = defineType({
  name: 'specialEvent',
  title: 'Special Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Birthday', value: 'Birthday' },
          { title: 'Work Anniversary', value: 'Work Anniversary' },
          { title: 'Company Holiday', value: 'Company Holiday' },
          { title: 'Personal Event', value: 'Personal Event' },
          { title: 'Other', value: 'Other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'employee',
      title: 'Associated Employee',
      type: 'reference',
      to: [{ type: 'employee' }],
    }),
    defineField({
      name: 'employeeName',
      title: 'Employee / Recipient Name',
      type: 'string',
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'years',
      title: 'Years of Service (if Anniversary)',
      type: 'number',
    }),
    defineField({
      name: 'description',
      title: 'Description / Celebration Notes',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'type',
      date: 'date',
    },
    prepare(selection) {
      const { title, subtitle, date } = selection;
      return {
        title: title,
        subtitle: `${subtitle} · ${date || ''}`,
      };
    },
  },
});
