"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import sendOrderConfirmationMail from "@/utils/OrderUtils";
import {
  getOrderShippingAddressFromLocalStorage,
  getProductsToBuyFromLocalStorage,
  removeProductsToBuyFromLocalStorage,
} from "@/utils/PaymentUtil";
import { useUser } from "@clerk/nextjs";
import { updateProductQuantity } from "@/sanity/services/ProductService";
import { ShippingAddress } from "@/interfaces/Order";

const Page = () => {
  const { order_status } = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const isSuccess = order_status === "success";
  const [timer, setTimer] = useState(10);
  const sendOrderSuccessfullEmail = async () => {
    let products = getProductsToBuyFromLocalStorage();
    let transactionId = localStorage.getItem("ORDER_TRANSACTION_ID");
    let shippingAddress = getOrderShippingAddressFromLocalStorage();
    if (products == null || transactionId == null || shippingAddress == null) {
      return;
    }
    const emailId = user?.primaryEmailAddress?.emailAddress;
    if (!emailId) return;
    products.forEach(async (product) => {
      if (!product.slug || product.quantity == null) return;
      await updateProductQuantity({
        slug: product.slug,
        quantity: product.quantity,
      });
    });
    await sendOrderConfirmationMail({
      orderItems: products,
      email: emailId,
      shippingAddress: shippingAddress,
      name: `${user.firstName} ${user.lastName}`,
      orderValue: products
        .reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
        .toLocaleString(),
      transactionId: transactionId,
    });
    removeProductsToBuyFromLocalStorage();
  };
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSuccess) {
      sendOrderSuccessfullEmail();
    } else {
      removeProductsToBuyFromLocalStorage();
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSuccess]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191A1C] px-4 text-white">
      <div className="max-w-md w-full text-center space-y-6">
        {isSuccess ? (
          <>
            <IconCircleCheck className="mx-auto text-yellow-400 w-16 h-16" />
            <h1 className="text-2xl font-bold">Payment Successful</h1>
            <p className="text-gray-300">
              Thank you for your purchase! Your order has been placed
              successfully, and a confirmation email will be sent to you
              shortly.
            </p>
          </>
        ) : (
          <>
            <IconCircleX className="mx-auto text-red-500 w-16 h-16" />
            <h1 className="text-2xl font-bold">Payment Failed</h1>
            <p className="text-gray-300">
              Unfortunately, something went wrong. Please try again.
            </p>
          </>
        )}
        <div>Redirecting in {timer}...</div>
      </div>
    </div>
  );
};

export default Page;
