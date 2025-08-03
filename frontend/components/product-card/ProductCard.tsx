import React from "react";
import { Card, CardFooter } from "@heroui/card";
import Rating from "@mui/material/Rating";
import Link from "next/link";

import { HomeProduct } from "@/interfaces/Product";

const ProductCard = ({ product }: { product: HomeProduct }) => {
  return (
    <Link href={`/product/${product?.slug}`}>
      <Card
        isFooterBlurred
        className="group h-[30rem] bg-gradient-to-b from-[#1b1b1b] to-[#0f0f0f] border border-[#333] shadow-lg overflow-hidden rounded-none"
      >
        <div className="relative h-[75%] w-full">
          <img
            alt={product.title}
            className="h-full w-full object-cover transition-opacity duration-500"
            src={product?.coverImage}
          />
          <img
            alt={`${product.title} hover`}
            className="h-full w-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            src={product?.hoverImage}
          />
        </div>

        <CardFooter className="flex flex-col items-center justify-center gap-3 p-4 text-white rounded-none">
          <div className="text-center">
            <p className="text-xl font-serif font-semibold tracking-wide text-[#f3f3f3]">
              {product?.title}
            </p>
            <p className="text-sm text-[#d4af37] mt-1">
              ₹{product?.price} ({product?.volume} ml)
            </p>
          </div>
          <div className="flex justify-center items-center gap-1">
            <Rating
              readOnly
              defaultValue={product?.rating || 0}
              precision={0.1}
              size="medium"
            />
            <span className="text-xs text-white/60">
              {product?.rating?.toFixed(1)} ({product?.reviewCount || 0})
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProductCard;
