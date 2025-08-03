export const GET_CAROUSEL_IMAGES_QUERY = `
  *[_type == "carouselImage"]{
   slug,
   image
  }
`;
