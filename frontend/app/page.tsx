"use client";
import { useEffect, useState } from "react";

import Loader from "@/components/loader";
import ProductCard from "@/components/product-card/ProductCard";
import { HomeProduct } from "@/interfaces/Product";
import { getLatestArrivals } from "@/sanity/services/ProductService";
import { getCarouselImages } from "@/sanity/services/CarouselImageService";
import { CarouselImage } from "@/interfaces/CarouselImage";

export default function Home() {
  const [currIdx, setCurrIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const [newArrivals, setNewArrivals] = useState<HomeProduct[] | null>(null);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[] | null>(
    null
  );
  const getNewArrivals = async () => {
    const products = await getLatestArrivals();
    setNewArrivals(products);
  };
  const getCarouselImagesFromSanity = async () => {
    const images = await getCarouselImages();
    setCarouselImages(images);
  };
  // First effect: data fetching
  useEffect(() => {
    getNewArrivals();
    getCarouselImagesFromSanity();
  }, []);

  // Second effect: rotation logic (runs only when images are loaded)
  useEffect(() => {
    if (!carouselImages || carouselImages.length === 0) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrIdx((prev) => (prev + 1) % carouselImages.length);
        setFade(true);
      }, 600);
    }, 4000);

    return () => clearInterval(interval);
  }, [carouselImages]);

  const handleDotClick = (idx: number) => {
    setFade(false);
    setTimeout(() => {
      setCurrIdx(idx);
      setFade(true);
    }, 200);
  };

  if (!newArrivals || !carouselImages) {
    return <Loader />;
  }

  return (
    <div className="w-full h-full">
      {/* Carousel */}
      <div className="relative w-full h-[50vh] md:h-[80vh] overflow-hidden rounded-xl shadow-2xl">
        <a href={`/product/${carouselImages[currIdx]?.slug}`}>
          <img
            alt={`Perfume ${currIdx + 1}`}
            className={`w-full h-full transition-opacity duration-[900ms] ease-in-out transform ${
              fade ? "opacity-100 scale-100" : "opacity-80 scale-[1.03]"
            }`}
            src={carouselImages[currIdx]?.image}
            style={{ transitionProperty: "opacity, transform" }}
          />
        </a>

        <div className="absolute bottom-5 w-full flex justify-center gap-2">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                currIdx === idx ? "bg-slate-700 w-6" : "bg-slate-700/50"
              }`}
              onClick={() => handleDotClick(idx)}
            />
          ))}
        </div>
      </div>
      {/* Product */}
      <div className="px-[1rem] sm:px-[2rem] md:px-[3rem] bg-inherit py-[2rem]">
        <div className="flex flex-col gap-2">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl  font-bold text-white tracking-widest uppercase relative mb-6 sm:mb-8">
            <span className="text-[#d4af37]">New Arrivals</span>
            <span className="block w-12 sm:w-16 h-[2px] bg-[#d4af37] mx-auto mt-2 sm:mt-3" />
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {newArrivals?.map((product, key) => {
              return <ProductCard key={key} product={product} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
