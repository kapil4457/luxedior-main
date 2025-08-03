"use server";

import { CarouselImage } from "@/interfaces/CarouselImage";
import { client, urlFor } from "../client";
import { GET_CAROUSEL_IMAGES_QUERY } from "../queries/CarouselmageQueries";

export async function getCarouselImages() {
  var res = await client.fetch(GET_CAROUSEL_IMAGES_QUERY);
  var carouselImages: CarouselImage[] = res.map((item: any) => {
    var carouselImage: CarouselImage = {
      image: urlFor(item.image).url(),
      slug: item.slug,
    };
    return carouselImage;
  });
  return carouselImages;
}
