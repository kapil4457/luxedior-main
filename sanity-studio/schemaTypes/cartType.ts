import {defineField, defineType} from 'sanity'

export const cartType = defineType({
  name: 'cart',
  title: 'Cart',
  type: 'document',
  fields: [
    defineField({
      name: 'emailId',
      title: 'Email ID',
      type: 'string',
      validation: (Rule) => Rule.required().email().error('A valid email is required'),
    }),
    defineField({
      name: 'products',
      title: 'Products in Cart',
      type: 'array',
      of: [
        defineField({
          name: 'cartItem',
          title: 'Cart Item',
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1).error('Quantity must be at least 1'),
            }),
          ],
        }),
      ],
    }),
  ],
})
