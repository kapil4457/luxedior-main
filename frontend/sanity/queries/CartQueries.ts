export const GET_CART_BY_EMAIL_QUERY = `
  *[_type == "cart" && emailId == $emailId][0]{
    products[]{
      quantity,
      product->{
        title,
        price,
        coverImage,
        slug,
        stock,
        _id
      }
    }
  }
`;
