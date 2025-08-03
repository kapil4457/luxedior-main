"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Rating from "@mui/material/Rating";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar } from "@heroui/avatar";
import { useDebounceCallback } from "@/config/hooks";
import Loader from "@/components/loader";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import {
  addProductReview,
  getProductDetails,
} from "@/sanity/services/ProductService";
import { ProductDetails } from "@/interfaces/Product";
import { addOrUpdateProductInCart } from "@/sanity/services/CartService";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/modal";
import ReviewForm from "./ReviewForm";

import CheckoutForm from "@/components/check-out-form/CheckOutForm";
const ProductDescription = () => {
  const router = useRouter();
  const { slug } = useParams();
  const { isSignedIn, user, isLoaded } = useUser();
  const { openSignIn } = useClerk();
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const {
    isOpen: isReviewFormOpen,
    onOpen: onReviewFormOpen,
    onOpenChange: onReviewFormOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCheckoutFormOpen,
    onOpen: onCheckoutFormOpen,
    onOpenChange: onCheckoutFormOpenChange,
  } = useDisclosure();
  const [isBuying, setIsBuying] = useState(false);

  const handleAddToCart = useDebounceCallback(async () => {
    if (!isLoaded) return;
    if (isLoaded && !isSignedIn) {
      openSignIn();
      return;
    }
    var emailAddress = user?.primaryEmailAddress?.emailAddress;

    if (!emailAddress) return;
    await addOrUpdateProductInCart(
      emailAddress,
      slug as string,
      selectedQuantity
    );
    addToast({
      title: "Product added to cart",
      radius: "none",
      variant: "solid",
    });
  });

  const handleBuyNow = useDebounceCallback(async () => {
    if (!isLoaded) return;
    if (isLoaded && !isSignedIn) {
      openSignIn();
      return;
    }
    if (!user?.primaryEmailAddress?.emailAddress) {
      addToast({
        title: "Please add an email address to your profile to place order",
        variant: "solid",
        color: "danger",
      });
      return;
    }
    if (product?.stock == 0 || !product?._id) return;
    setIsBuying(true);
    onCheckoutFormOpen();
  });

  const incrementQty = () => {
    if (selectedQuantity < (product?.stock || 0)) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  const decrementQty = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const getProductDetailsHandler = async () => {
    try {
      if (!slug) return;
      var emailAddress = user?.primaryEmailAddress?.emailAddress || "";
      const res = await getProductDetails(slug as string, emailAddress);
      setProduct(res);
    } catch (err) {
      router.push("/not-found");
    }
  };
  const openReviewModal = useDebounceCallback(() => {
    if (!isLoaded) return;
    if (isLoaded && !isSignedIn) {
      openSignIn();
      return;
    }
    onReviewFormOpen();
  });
  const addReviewComment = async ({
    comment,
    rating,
  }: {
    comment: string;
    rating: number;
  }) => {
    if (!isLoaded || (isLoaded && !isSignedIn)) {
      return;
    }
    if (!slug) {
      return;
    }
    const firstName = user.firstName;
    const lastName = user.lastName;
    const emailId = user.primaryEmailAddress?.emailAddress;
    if (!emailId || !firstName) {
      addToast({
        title: "Please add email id and first name to your profile",
        radius: "none",
        color: "danger",
        variant: "solid",
      });
      return;
    }
    try {
      await addProductReview({
        comment: comment,
        emailId: emailId,
        firstName: firstName,
        lastName: lastName || "",
        rating: rating,
        slug: (slug as string) || "",
      });
      addToast({
        title: "Review added successfully",
        radius: "none",
        color: "success",
        variant: "solid",
      });
    } catch (err: any) {
      addToast({
        title: err?.message,
        radius: "none",
        color: "danger",
        variant: "solid",
      });
    }
  };

  useEffect(() => {
    getProductDetailsHandler();
  }, [slug, isLoaded]);

  if (!product) {
    return <Loader />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Images */}
        <div className="flex-1">
          <img
            alt={product?.title}
            className="w-full h-[300px] sm:h-[400px] object-cover rounded-lg shadow-lg"
            src={product?.images[mainImageIndex]}
          />
          <div className="flex mt-4 space-x-3 overflow-x-auto">
            {product?.images?.map((img, i) => (
              <img
                key={i}
                alt={`${product?.title} thumbnail ${i + 1}`}
                className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md cursor-pointer border-2 ${
                  i === mainImageIndex
                    ? "border-yellow-500"
                    : "border-transparent"
                }`}
                src={img}
                onClick={() => setMainImageIndex(i)}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              {product.title}
            </h1>
            <div className="flex mb-4 flex-col">
              <span className="text-yellow-400 font-semibold text-lg sm:text-xl">
                ₹{product.price.toLocaleString()} ({product?.volume} ml)
              </span>
              <span className="flex items-center space-x-1 text-yellow-400 mt-1">
                <Rating
                  readOnly
                  defaultValue={product?.rating || 0}
                  precision={0.1}
                />
                <span className="text-sm">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </span>
            </div>

            {product.stock > 0 && (
              <div className="mb-6">
                <label className="block mb-2 font-medium text-sm sm:text-base">
                  Select Quantity:
                </label>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                  <div className="flex items-center justify-start space-x-4">
                    <Button
                      className={`w-10 h-10 text-xl rounded-md text-white ${
                        selectedQuantity === 1
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      disabled={selectedQuantity === 1}
                      onPress={decrementQty}
                    >
                      –
                    </Button>
                    <span className="min-w-[40px] text-center text-lg">
                      {selectedQuantity}
                    </span>
                    <Button
                      className={`w-10 h-10 text-xl rounded-md text-white ${
                        selectedQuantity === product.stock
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                      disabled={selectedQuantity === product.stock}
                      onPress={incrementQty}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    className={`w-full sm:w-auto font-semibold py-3 px-6 rounded-md transition ${
                      product?.stock === 0 || product?.isAddedToCart
                        ? "bg-gray-500 cursor-not-allowed text-white"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                    }`}
                    disabled={product?.stock === 0 || product?.isAddedToCart}
                    onPress={handleAddToCart}
                  >
                    {product?.stock === 0
                      ? "Out of Stock"
                      : product?.isAddedToCart
                        ? "Already in Cart"
                        : "Add to Cart"}
                  </Button>
                  <Modal
                    className="max-h-[90vh] overflow-y-auto rounded-2xl bg-[#191A1C] text-white p-4"
                    isOpen={isCheckoutFormOpen}
                    onOpenChange={(open) => {
                      if (!open) {
                        setIsBuying(false);
                      }
                      onCheckoutFormOpenChange();
                    }}
                    size="2xl"
                  >
                    <ModalContent>
                      {() => (
                        <>
                          <ModalBody className="overflow-y-auto max-h-[90vh]">
                            <CheckoutForm
                              products={[
                                {
                                  _id: product?._id,
                                  quantity: selectedQuantity,
                                  title: product?.title,
                                  coverImage: product?.images[0],
                                  price: product?.price,
                                  slug: product?.slug,
                                  volume: product?.volume,
                                },
                              ]}
                            />
                          </ModalBody>
                        </>
                      )}
                    </ModalContent>
                  </Modal>
                </div>
              </div>
            )}

            <div className="mb-6 prose max-w-none">
              <PortableText value={product?.body} />
            </div>
          </div>

          <Button
            className={`w-full py-3 mt-4 sm:mt-0 rounded-md font-semibold text-black ${
              product.stock === 0 || isBuying
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500"
            }`}
            disabled={product.stock === 0 || isBuying}
            onPress={handleBuyNow}
          >
            {product.stock === 0 ? (
              "Out of Stock"
            ) : isBuying ? (
              <>
                <Spinner variant="default" color="warning" size="sm" />{" "}
                Redirecting
              </>
            ) : (
              "Buy Now"
            )}
          </Button>
        </div>
      </div>

      <div className="mt-12">
        {/* Add Review Button */}
        <div className="mb-6 flex w-full gap-10 items-center">
          <h2 className="text-2xl font-bold text-center">Customer Reviews</h2>
          <Button
            onPress={openReviewModal}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded-md"
          >
            Add a Review
          </Button>
          <ReviewForm
            isOpen={isReviewFormOpen}
            onOpenChange={onReviewFormOpenChange}
            onSubmit={addReviewComment}
          />
        </div>

        {product?.reviews?.length === 0 && (
          <p className="text-gray-400 w-full text-center">No reviews yet.</p>
        )}

        <div className="space-y-5">
          {product?.reviews?.map((review, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-medium text-base flex  gap-2 items-center">
                  <Avatar
                    name={`${review?.firstName[0]}${review?.lastName[0]}`}
                    radius="full"
                    showFallback
                    src="https://images.unsplash.com/broken"
                  />
                  {review?.firstName} {review?.lastName}
                </span>
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Rating
                    readOnly
                    defaultValue={review?.rating || 0}
                    precision={0.1}
                    size="small"
                    sx={{
                      color: "#facc15",
                      "& .MuiRating-iconEmpty": {
                        color: "#52525b",
                      },
                    }}
                  />
                  <span className="text-gray-300">{review?.rating}</span>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {review?.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
