export const GET_LATEST_PRODUCTS_QUERY = `*[
  _type == "product" && defined(slug.current)
]|order(_createdAt desc)[0...6]{
  title,
  slug,
  rating,
  price,
  volume,
  coverImage,
  hoverImage,
  "reviewCount": count(reviews)

}`;

export const GET_PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  price,
  volume,
  rating,
  "reviews": *[_type == "review" && product._ref == ^._id] | order(_createdAt desc){
    firstName,
    lastName,
    rating,
    comment,
    _createdAt
  },
  body,
  images,
  stock,
  body,
  slug,
  "isAddedToCart": count(*[
    _type == "cart" &&
    emailId == $emailId &&
    references(^._id)
  ]) > 0
}`;

export const GET_PRODUCTS_BY_KEYWORD_QUERY = `
 *[
  _type == "product" &&
  lower(title) match "*" + lower($keyword) + "*"
][0...4]{
  title,
  coverImage,
  "slug": slug.current
}
`;
