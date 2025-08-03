"use client";
import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Order, OrderProduct, ShippingAddress } from "@/interfaces/Order";

import { storeProductsToBuyInLocalStorage } from "@/utils/PaymentUtil";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { addToast } from "@heroui/toast";
import { createOrder } from "@/sanity/services/OrderService";
import { validateShippingAddress } from "@/utils/OrderUtils";
import { redirectPayment } from "@/utils/serverActions";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/enums/OrderStatus";

const CheckoutForm = ({ products }: { products: OrderProduct[] }) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    phoneNumber: "",
    postalCode: "",
    state: "",
  });

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    if (!isLoaded) return;
    if (isLoaded && !isSignedIn) {
    }
    var emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) return;
    const validation = await validateShippingAddress(shippingAddress);
    if (!validation.isValid) {
      addToast({
        title: validation.error,
        variant: "solid",
        color: "danger",
      });
      return;
    }
    let price = products
      ?.map((product) => {
        return {
          quantity: product?.quantity,
          price: product?.price,
        };
      })
      .reduce((total, product) => {
        return total + product.quantity * (product.price ?? 0);
      }, 0);
    const response = await redirectPayment(price, emailAddress);
    if (response.success) {
      const { redirectUrl, merchantTransactionId } = response;
      storeProductsToBuyInLocalStorage(products);
      localStorage.setItem("ORDER_TRANSACTION_ID", merchantTransactionId || "");
      localStorage.setItem(
        "ORDER_SHIPPING_ADDRESS",
        JSON.stringify(shippingAddress) || ""
      );
      let order: Order = {
        emailId: emailAddress,
        orderStatus: ORDER_STATUS[ORDER_STATUS.PROCESSING],
        paymentStatus: PAYMENT_STATUS[PAYMENT_STATUS.INITIALIZED],
        transactionId: merchantTransactionId!,
        products: products.map((product) => {
          return {
            _id: product?._id,
            quantity: product?.quantity,
          };
        }),
        shippingAddress: shippingAddress,
      };
      const orderId = await createOrder(order);
      localStorage.setItem("ORDER_ID", orderId);
      router.push(redirectUrl);
    } else {
      addToast({
        title: "Failed to initialize payment",
        variant: "solid",
        color: "danger",
      });
    }
  };

  const inputClass =
    "bg-[#2A2B2D] text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-yellow-500";

  return (
    <div className="w-full space-y-6 px-2 md:px-6 pb-6">
      <div className="bg-[#191A1C] text-white space-y-8 p-2 md:p-6 rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            className={inputClass}
            isRequired
            label="Address Line 1"
            value={shippingAddress.addressLine1}
            onChange={(e) => handleChange("addressLine1", e.target.value)}
          />
          <Input
            className={inputClass}
            label="Address Line 2"
            value={shippingAddress.addressLine2}
            onChange={(e) => handleChange("addressLine2", e.target.value)}
          />
          <Input
            className={inputClass}
            label="City"
            isRequired
            value={shippingAddress.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />
          <Input
            className={inputClass}
            label="State"
            isRequired
            value={shippingAddress.state}
            onChange={(e) => handleChange("state", e.target.value)}
          />
          <Input
            className={inputClass}
            label="Country"
            isRequired
            value={shippingAddress.country}
            onChange={(e) => handleChange("country", e.target.value)}
          />
          <Input
            className={inputClass}
            label="Postal Code"
            isRequired
            value={shippingAddress.postalCode}
            onChange={(e) => handleChange("postalCode", e.target.value)}
          />
        </div>
        <Input
          isRequired
          className={`${inputClass} w-full`}
          label="Phone Number"
          value={shippingAddress.phoneNumber}
          onChange={(e) => handleChange("phoneNumber", e.target.value)}
        />

        {/* Products Summary */}
        <div className="space-y-4">
          {products.map((product) => (
            <Card
              key={product._id}
              className="bg-[#2A2B2D] text-white shadow-xl w-full rounded-xl p-4"
            >
              <CardBody className="flex flex-row flex-wrap md:flex-nowrap items-center justify-between gap-4">
                {/* Product Info Block */}
                <div className="flex items-center gap-4">
                  {product.coverImage && (
                    <img
                      src={product.coverImage}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-white">{product.title}</p>
                    <p className="text-sm text-gray-400">
                      Qty: {product.quantity} | Volume: {product.volume}ml
                    </p>
                    <p className="text-yellow-500 font-medium">
                      ₹{product.price}
                    </p>
                  </div>
                </div>

                {/* Total Price Block */}
                <div className="hidden sm:flex text-right text-lg font-semibold text-white whitespace-nowrap">
                  ₹{product.quantity * (product.price || 0)}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
        {/* Total Section */}
        <div className="flex justify-between items-center text-lg font-semibold text-white px-2 md:px-4">
          <span>Total</span>
          <span className="text-yellow-400">
            ₹
            {products.reduce(
              (total, product) =>
                total + product.quantity * (product.price || 0),
              0
            )}
          </span>
        </div>

        {/* Continue Button */}
        <div className="text-right">
          <Button
            onPress={handleContinue}
            className="bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition px-6 py-2 rounded-lg"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
