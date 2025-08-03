export const GET_ORDER_BY_EMAIL_QUERY = `
*[_type == "order" && emailId == $emailId]{
  orderStatus,
  _id,
  paymentStatus,
  emailId,
  shippingAddress,
  products[]{
    quantity,
    product->{
      title,
      price,
      coverImage,
      slug
    }
  },
  _createdAt
} | order(_createdAt desc)
`;
