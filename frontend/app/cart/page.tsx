"use client";
import React, { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { Link } from "@heroui/link";

import { CartItem } from "@/interfaces/Cart";
import {
  getCartByEmail,
  removeProductFromCart,
  updateCartItemQuantity,
} from "@/sanity/services/CartService";
import { useDebounceCallback } from "@/config/hooks";
import Loader from "@/components/loader";
import { Order, OrderProduct, ShippingAddress } from "@/interfaces/Order";
import { redirectPayment } from "@/utils/serverActions";
import { validateShippingAddress } from "@/utils/OrderUtils";
import { addToast } from "@heroui/toast";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/enums/OrderStatus";
import { createOrder } from "@/sanity/services/OrderService";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import MyOrders from "@/components/my-orders/MyOrders";
import { storeProductsToBuyInLocalStorage } from "@/utils/PaymentUtil";

const Page = () => {
  const [selectedTab, setSelectedTab] = useState<"cart" | "orders">("cart");
  const { isLoaded, isSignedIn, user } = useUser();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    phoneNumber: "",
    postalCode: "",
    state: "",
  });
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { openSignIn } = useClerk();

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    var emailAddress = user?.primaryEmailAddress?.emailAddress;
    if (!emailAddress) return;
    const validation = await validateShippingAddress(shippingAddress);
    if (!cart) return;
    if (!validation.isValid) {
      addToast({
        title: validation.error,
        variant: "solid",
        color: "danger",
      });
      return;
    }
    let price = cart
      ?.map((product) => {
        return {
          quantity: product?.quantity,
          price: product?.price,
        };
      })
      .reduce((total, product) => {
        return total + product.quantity * (product.price ?? 0);
      }, 0);
    let products: OrderProduct[] = cart?.map((item) => {
      let product: OrderProduct = {
        _id: item._refId,
        quantity: item.quantity,
        coverImage: item.coverImage,
        price: item.price,
        slug: item.slug,
        title: item.title,
      };
      return product;
    });

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
        products: cart.map((product) => {
          return {
            _id: product?._refId,
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
  const fetchCart = async () => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;
    setisLoading(true);
    const res = await getCartByEmail(user.primaryEmailAddress.emailAddress);
    setCart(res);
    setisLoading(false);
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) fetchCart();
    if (isLoaded && !isSignedIn) {
      openSignIn();
    }
  }, [isLoaded]);

  const updateQuantity = useDebounceCallback(
    async (index: number, delta: number) => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;
      const updated = [...cart!];
      const newQty = updated[index].quantity + delta;

      if (newQty >= 1 && newQty <= updated[index].stockAvailable) {
        updated[index].quantity = newQty;
        setCart(updated);
        // setisLoading(true);
        await updateCartItemQuantity(
          user?.primaryEmailAddress?.emailAddress,
          updated[index]._refId,
          newQty
        ).then((res) => {
          // setisLoading(false);
        });
      }
    }
  );

  const removeItem = useDebounceCallback(async (index: number) => {
    if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;
    setCart(cart!.filter((_, i) => i !== index));
    // setisLoading(true);
    await removeProductFromCart(
      user?.primaryEmailAddress?.emailAddress,
      cart![index]._refId
    ).then((res) => {
      // setisLoading(false);
    });
  });

  const inputClass =
    "bg-[#2A2B2D] text-white placeholder-gray-400 border-none focus:ring-2 focus:ring-yellow-500";

  if (isLoaded && !isSignedIn) {
    router.push("/");
    addToast({
      title: "Please login to access this page",
      variant: "solid",
      color: "danger",
    });
  }
  if (isLoading || !isLoaded) return <Loader />;

  return (
    <div className="p-0 sm:p-6 w-[80%] xl:w-[60%]  text-white min-h-[80vh]">
      {/* Tabs */}
      <div className="flex justify-center gap-4 border-b border-gray-800 mb-6">
        {["cart", "orders"].map((key) => (
          <button
            key={key}
            className={`px-5 py-2 text-sm font-medium capitalize transition duration-200 rounded-t-md ${
              selectedTab === key
                ? "text-yellow-400 border-b-2 border-yellow-400"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setSelectedTab(key as "cart" | "orders")}
          >
            {key === "cart" ? "My Cart" : "My Orders"}
          </button>
        ))}
      </div>

      {/* Cart Tab */}
      {selectedTab === "cart" && (
        <div>
          {!cart || cart?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <p className="text-xl font-semibold text-gray-300">
                Your cart is empty.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Looks like you haven’t added anything yet.
              </p>
              <div className="h-1 w-20 bg-yellow-400 rounded mt-4" />
            </div>
          ) : (
            <div className="space-y-6">
              {cart?.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#111] shadow-lg p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 w-full max-w-5xl mx-auto rounded-lg"
                >
                  <div className="flex gap-6 items-start">
                    <img
                      alt={item.title}
                      className="w-24 h-24 object-cover"
                      src={item.coverImage}
                    />
                    <div>
                      <Link
                        className="group relative inline-block text-inherit"
                        href={`/product/${item.slug}`}
                      >
                        <h3 className="text-lg font-semibold relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-current after:transition-all after:duration-300 group-hover:after:w-full">
                          {item.title}
                        </h3>
                      </Link>

                      <p className="text-sm text-gray-400">
                        ₹{item.price.toLocaleString()} each
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-lg"
                          onClick={() => updateQuantity(index, -1)}
                        >
                          –
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          className="w-8 h-8 rounded bg-gray-700 hover:bg-gray-600 text-lg"
                          onClick={() => updateQuantity(index, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button
                        className="mt-2 text-sm text-red-400 hover:underline"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-medium">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <div className="bg-[#191A1C] text-white space-y-8 p-2 md:p-6 rounded-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    className={inputClass}
                    isRequired
                    label="Address Line 1"
                    value={shippingAddress.addressLine1}
                    onChange={(e) =>
                      handleChange("addressLine1", e.target.value)
                    }
                  />
                  <Input
                    className={inputClass}
                    label="Address Line 2"
                    value={shippingAddress.addressLine2}
                    onChange={(e) =>
                      handleChange("addressLine2", e.target.value)
                    }
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
              </div>

              {/* Subtotal & Checkout */}
              <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-lg font-semibold">
                  Subtotal: ₹
                  {cart
                    ?.reduce((acc, item) => acc + item.price * item.quantity, 0)
                    ?.toLocaleString()}
                </p>
                <button
                  onClick={handleContinue}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-lg transition w-full sm:w-auto"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {selectedTab === "orders" && <MyOrders />}
    </div>
  );
};

export default Page;
