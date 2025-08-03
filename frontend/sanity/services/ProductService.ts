"use server";

import { type SanityDocument } from "next-sanity";

import {
  GET_LATEST_PRODUCTS_QUERY,
  GET_PRODUCT_BY_SLUG_QUERY,
  GET_PRODUCTS_BY_KEYWORD_QUERY,
} from "../queries/ProductQueries";

import { client, urlFor } from "@/sanity/client";
import {
  HomeProduct,
  ProductDetails,
  SearchResultProduct,
} from "@/interfaces/Product";

const options = { next: { revalidate: 30 } };

export const getLatestArrivals = async (): Promise<HomeProduct[]> => {
  const res = await client.fetch<SanityDocument[]>(
    GET_LATEST_PRODUCTS_QUERY,
    {},
    options
  );

  const products: HomeProduct[] = res.map((prod) => {
    const product: HomeProduct = {
      coverImage: urlFor(prod.coverImage).url(),
      hoverImage: urlFor(prod.hoverImage).url(),
      price: prod.price,
      rating: prod.rating,
      slug: prod.slug.current,
      title: prod.title,
      volume: prod.volume,
      reviewCount: prod.reviewCount,
    };

    return product;
  });

  return products;
};

export const getProductDetails = async (
  slug: string,
  emailId: string
): Promise<ProductDetails> => {
  const res = await client.fetch<SanityDocument>(
    GET_PRODUCT_BY_SLUG_QUERY,
    { slug: slug, emailId: emailId },
    options
  );

  const product: ProductDetails = {
    body: res.body,
    images: res.images?.map((image: any) => urlFor(image).url()) || [],
    price: res.price,
    rating: res.rating,
    reviews: res.reviews,
    slug: res.slug.current,
    stock: res.stock,
    title: res.title,
    volume: res.volume,
    isAddedToCart: res.isAddedToCart,
    _id: res._id,
  };
  return product;
};
export const addProductReview = async ({
  firstName,
  lastName,
  emailId,
  rating,
  comment,
  slug,
}: {
  firstName: string;
  lastName: string;
  emailId: string;
  rating: number;
  comment: string;
  slug: string;
}) => {
  try {
    const productData = await client.fetch(
      `*[_type == "product" && slug.current == $slug][0]{ _id }`,
      { slug }
    );

    if (!productData?._id) {
      throw new Error("Product not found");
    }

    const productId = productData._id;

    const existingReview = await client.fetch(
      `*[_type == "review" && emailId == $emailId && product._ref == $productId][0]`,
      {
        emailId,
        productId,
      }
    );

    if (existingReview) {
      throw new Error("You have already reviewed this product.");
    }

    const newrReview = await client.create({
      _type: "review",
      firstName,
      lastName,
      emailId,
      rating,
      comment,
      product: {
        _type: "reference",
        _ref: productId,
      },
    });

    const allReviews = await client.fetch(
      `*[_type == "review" && product._ref == $productId]{ rating }`,
      { productId }
    );

    const totalRating = allReviews.reduce(
      (sum: number, r: { rating: number }) => sum + r.rating,
      0
    );
    const averageRating = totalRating / allReviews.length;

    await client.patch(productId).set({ rating: averageRating }).commit();

    return newrReview;
  } catch (error: any) {
    throw new Error(error.message || "Unable to add review");
  }
};

export const updateProductQuantity = async ({
  quantity,
  slug,
}: {
  slug: string;
  quantity: number;
}) => {
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ _id, stock }`,
    { slug }
  );

  if (!product?._id) {
    throw new Error("Product not found");
  }
  const newQuantity = Math.max(0, (product.stock || 0) - quantity);

  const updatedProduct = await client
    .patch(product._id)
    .set({ stock: newQuantity })
    .commit();

  return updatedProduct;
};

export const getProductsByKeyword = async ({
  keyword,
}: {
  keyword: string;
}) => {
  const res = await client.fetch(GET_PRODUCTS_BY_KEYWORD_QUERY, { keyword });
  const products: SearchResultProduct[] = res.map((item: any) => {
    return {
      title: item.title,
      coverImage: urlFor(item.coverImage).url(),
      slug: item.slug,
    };
  });
  return products;
};
