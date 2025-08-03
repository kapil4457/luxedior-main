import React from "react";

const Page = () => {
  const refundCancellation = [
    "Cancellations will only be considered if the request is made within 7 days of placing the order. However, if your order has already been processed for shipping or is out for delivery, cancellations may not be accepted. You may choose to reject the product at the time of delivery in such cases.",
    "In case you receive a damaged or defective item, please reach out to our customer support team within 7 days of receiving the product. After inspecting the issue, we will make a decision on the next steps. Please ensure you provide relevant details and photos, if applicable.",
    "We do not work with any third-party sellers or resellers. All products are curated, packed, and shipped directly by Luxe Dior. If you believe you received a product that does not match your expectations, contact us within 7 days, and we will do our best to resolve the concern.",
    "Any approved refund will be initiated by Luxe Dior and may take up to 5 business days to reflect in your original payment method.",
  ];

  const returnPolicy = [
    "We offer returns or exchanges within 7 days from the date of delivery. Beyond this period, returns or exchanges will not be accepted. To be eligible, the item must be unused, in its original condition, and include the original packaging.",
    "Please note, products purchased on sale or under special promotions are not eligible for return or exchange unless defective. Only items found damaged or defective are eligible for a replacement or refund after proper verification.",
    "Some product categories may be marked as non-returnable at the time of purchase. If your return/exchange is approved, we will notify you by email after inspection, and proceed accordingly.",
  ];

  return (
    <div className="pb-20 px-6 md:px-20 bg-[#191A1C] text-gray-200">
      {/* Refund & Cancellation Section */}
      <section className="pt-14 max-w-4xl mx-auto">
        <h1 className="text-3xl text-center font-extrabold text-[#FACC15] uppercase mb-6">
          Refund and Cancellation Policy
        </h1>
        <p className="mb-4">
          This policy outlines how cancellations and refunds are handled for
          purchases made directly from Luxe Dior.
        </p>
        <ul className="space-y-4 list-decimal list-inside">
          {refundCancellation.map((item, idx) => (
            <li key={idx} className="text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Return Policy Section */}
      <section className="pt-16 max-w-4xl mx-auto">
        <h1 className="text-3xl text-center font-extrabold text-[#FACC15] uppercase mb-6">
          Return Policy
        </h1>
        <ul className="space-y-4 list-decimal list-inside">
          {returnPolicy.map((item, idx) => (
            <li key={idx} className="text-gray-300">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Shipping Policy Section */}
      <section className="pt-16 max-w-4xl mx-auto">
        <h1 className="text-3xl text-center font-extrabold text-[#FACC15] uppercase mb-6">
          Shipping Policy
        </h1>
        <p className="text-gray-300 leading-relaxed">
          All orders are processed and shipped directly by Luxe Dior using
          trusted domestic courier services. Orders are typically shipped within
          1 business day of confirmation. Luxe Dior is not responsible for
          delays caused by courier services or incorrect delivery details
          provided by the customer.
          <br />
          <br />
          Orders are delivered to the address specified at checkout. Shipping
          confirmation and tracking details will be sent to your registered
          email address. Please note that any shipping charges are
          non-refundable unless due to an error from our end.
        </p>
      </section>
    </div>
  );
};

export default Page;
