"use server";
import { OrderProduct, ShippingAddress } from "@/interfaces/Order";
import { resend } from "./ResendUtil";
import { OrderSuccessAdminEmailTemplate } from "@/email-template/OrderSuccessEmailTemplate";
import { OrderSuccessEmailTemplateClient } from "@/email-template/OrderSuccessEmailTemplateClient";

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateShippingAddress = async (
  address: ShippingAddress
): Promise<ValidationResult> => {
  const { addressLine1, city, state, country, postalCode, phoneNumber } =
    address;

  if (
    !addressLine1.trim() ||
    !city.trim() ||
    !state.trim() ||
    !country.trim() ||
    !postalCode.trim() ||
    !phoneNumber.trim()
  ) {
    return {
      isValid: false,
      error: "Please fill in all required fields",
    };
  }

  if (!/^\d{6}$/.test(postalCode)) {
    return {
      isValid: false,
      error: "Enter a valid 6-digit Postal Code",
    };
  }

  if (!/^\d{10}$/.test(phoneNumber)) {
    return {
      isValid: false,
      error: "Enter a valid 10-digit Phone Number",
    };
  }

  return { isValid: true };
};

export default async function sendOrderConfirmationMail({
  name,
  email,
  orderItems,
  orderValue,
  transactionId,
  shippingAddress,
}: {
  name: string;
  email: string;
  orderValue: string;
  transactionId: string;
  shippingAddress: ShippingAddress;
  orderItems: OrderProduct[];
}) {
  try {
    await Promise.all([
      resend.emails.send({
        from: "Luxe Dior Order <jashanverma@luxedior.in>",
        to: ["perfumes.luxediore@gmail.com"],
        subject: "New Order",
        react: OrderSuccessAdminEmailTemplate({
          name: name,
          orderItems: orderItems,
          orderValue: orderValue,
          transactionId: transactionId,
          shippingAddress: shippingAddress,
        }),
      }),
      resend.emails.send({
        from: "Order Confirmation",
        to: [`${email}`],
        subject: "Thanks for placing your order !!",
        react: OrderSuccessEmailTemplateClient({
          name: name,
          orderItems: orderItems,
          orderValue: orderValue,
          transactionId: transactionId,
          shippingAddress: shippingAddress,
        }),
      }),
    ]);
    return {
      success: true,
      message: "Email sent successfully.",
    };
  } catch (err: any) {
    console.log("error : ", err);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
