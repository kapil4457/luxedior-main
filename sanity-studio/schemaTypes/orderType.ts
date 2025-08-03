import {defineField, defineType} from 'sanity'

export const orderType = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({
      name: 'transactionId',
      title: 'Transaction Id',
      type: 'string',
    }),
    defineField({
      name: 'orderStatus',
      title: 'Order Status',
      type: 'string',
      options: {
        list: [
          {title: 'PROCESSING', value: 'PROCESSING'},
          {title: 'SHIPPED', value: 'SHIPPED'},
          {title: 'DELIVERED', value: 'DELIVERED'},
          {title: 'CANCELLED', value: 'CANCELLED'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          {title: 'INITIALIZED', value: 'INITIALIZED'},
          {title: 'SUCCESSFULL', value: 'SUCCESSFULL'},
          {title: 'FAILED', value: 'FAILED'},
          {title: 'REFUNDED', value: 'REFUNDED'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'emailId',
      title: 'Customer Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),

    defineField({
      name: 'paymentMethod',
      title: 'Payment Method',
      type: 'string',
    }),

    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        {
          name: 'addressLine1',
          title: 'Address Line 1',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'addressLine2',
          title: 'Address Line 2',
          type: 'string',
        },
        {
          name: 'city',
          title: 'City',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'state',
          title: 'State',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'postalCode',
          title: 'Postal Code',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'country',
          title: 'Country',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'phoneNumber',
          title: 'Phone Number',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
  ],
})
