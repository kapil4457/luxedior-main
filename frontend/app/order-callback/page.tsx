"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { addToast } from "@heroui/toast";
import { PAYMENT_STATUS } from "@/enums/OrderStatus";
import { Spinner } from "@heroui/spinner";

const Page = () => {
  const router = useRouter();
  const [requestCount, setRequestCount] = useState(0);
  useEffect(() => {
    setTimeout(async () => {
      const ORDER_ID = localStorage.getItem("ORDER_ID");
      const ORDER_TRANSACTION_ID = localStorage.getItem("ORDER_TRANSACTION_ID");
      if (!ORDER_TRANSACTION_ID || !ORDER_ID) {
        router.push("/payment/failed");
        return;
      }
      try {
        if (requestCount == 10) {
          addToast({
            title:
              "Failed to place order.If you have been credited with the order value, please contact us to initiate refund.",
            variant: "solid",
            color: "danger",
          });
          router.push("/payment/failed");
          return;
        }
        const res = await axios.get(
          `/order-callback/handler?transactionId=${ORDER_TRANSACTION_ID}`
        );

        if (res.status != 200) {
          addToast({
            title: res.data.paymentStatus,
            variant: "solid",
            color: "danger",
          });
          router.push("/");
          return;
        }

        const paymentStatus = res.data.paymentStatus;
        if (paymentStatus != null) {
          if (paymentStatus === PAYMENT_STATUS[PAYMENT_STATUS.SUCCESSFULL]) {
            addToast({
              title: "Payment Successful",
              variant: "solid",
              color: "success",
            });
            router.push("/payment/success");
          } else if (
            paymentStatus === PAYMENT_STATUS[PAYMENT_STATUS.INITIALIZED]
          ) {
            console.log("Not yet updated...");
          } else {
            addToast({
              title:
                "Payment failed.If you have been credited with the order value, please contact us to initiate refund.",
              variant: "solid",
              color: "danger",
            });
            router.push("/payment/failed");
          }
        }
      } catch (err) {
        console.error("Error sending data:", err);
        router.push("/payment/failed");
      } finally {
        setRequestCount(requestCount + 1);
      }
    }, 3000);
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#191A1C] px-4 text-white">
      <div className="max-w-md w-full text-center space-y-6">
        <Spinner color="warning" />
        <h3 className="font-semibold text-xl">Placing your order...</h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  );
};

export default Page;
