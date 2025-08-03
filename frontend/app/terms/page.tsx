import React from "react";

const Page = () => {
  const terms = [
    {
      description:
        "This document is an electronic record as per the Information Technology Act, 2000. It does not require any physical or digital signatures.",
    },
    {
      description:
        "This document is published in accordance with Rule 3(1) of the Information Technology (Intermediaries Guidelines) Rules, 2011 and outlines the rules, privacy policy, and Terms of Use for accessing www.luxedior.in (the 'Website') and its mobile applications (collectively, the 'Platform').",
    },
    {
      description:
        "The Platform is solely owned and operated by Luxe Dior, a personal brand headquartered in Sirsa, Haryana, India. No third-party sellers are permitted to sell through this Platform.",
    },
    {
      description:
        "By using the Platform, you agree to these Terms of Use and related policies. These Terms apply to all transactions, services, and content on the Platform and may be updated at any time. You are responsible for reviewing them periodically.",
    },
    {
      description:
        "In these Terms, 'you', 'your', or 'user' refers to any individual who accesses or uses the Platform.",
    },
    {
      description:
        "ACCESSING, BROWSING, OR USING THE PLATFORM INDICATES YOUR AGREEMENT TO THESE TERMS. PLEASE READ THEM CAREFULLY BEFORE CONTINUING.",
    },
    {
      description:
        "Use of the Platform and Services is subject to the following conditions:",
      subpoints: [
        "You agree to provide accurate and complete information when creating an account and are responsible for all activity under your account.",
        "Luxe Dior does not guarantee the accuracy or completeness of content on the Platform and is not liable for any reliance placed on it.",
        "All use of the Platform is at your own risk. You must assess if our products and services meet your needs.",
        "All content on the Platform is the intellectual property of Luxe Dior. No license or right is granted to use it without permission.",
        "Unauthorized use of the Platform may result in legal action.",
        "You agree to pay all applicable fees or charges associated with your purchases.",
        "You must not use the Platform for any illegal or unauthorized purpose.",
        "We may link to third-party sites for your convenience, but we are not responsible for their terms or content.",
        "By placing an order, you enter a binding agreement with Luxe Dior.",
        "You agree to indemnify Luxe Dior and its team from any claims arising from your violation of these Terms.",
        "We are not liable for any delays or failures caused by force majeure events.",
        "These Terms are governed by Indian laws. Any disputes will be subject to the jurisdiction of courts in Sirsa, Haryana.",
        "For concerns related to these Terms, please reach out to us via the contact details provided on the website.",
      ],
    },
  ];

  return (
    <div className="pb-20 px-6 md:px-20 bg-[#191A1C] text-gray-200">
      <div className="pt-14 max-w-4xl mx-auto flex flex-col gap-10">
        <h1 className="text-3xl text-center font-extrabold text-[#FACC15] uppercase">
          Terms and Conditions
        </h1>

        <ul className="space-y-6">
          {terms.map((item, index) => (
            <li key={index} className="text-gray-300">
              <p>
                <strong>{index + 1}. </strong>
                {item.description}
              </p>
              {item.subpoints && (
                <ul className="list-disc list-inside pl-5 mt-3 space-y-2 text-gray-400">
                  {item.subpoints.map((point, subIndex) => (
                    <li key={subIndex}>{point}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Page;
