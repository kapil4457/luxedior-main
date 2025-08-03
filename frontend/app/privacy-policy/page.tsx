import React from "react";

const PrivacyPolicyPage = () => {
  const policies = [
    {
      title: "Introduction",
      description: `This Privacy Policy describes how Luxe Dior and its affiliates (collectively "Luxe Dior", "we", "our", "us") collect, use, share, protect, or otherwise process your information/personal data through our website www.luxedior.in (from now on referred to as "Platform"). You may browse certain sections of the Platform without registering. By accessing or using our Platform, you agree to be bound by this Privacy Policy, Terms of Use, and applicable Indian laws related to privacy and data protection.`,
    },
    {
      title: "Collection",
      description: `We collect data when you use our Platform or interact with us. This includes personal information like your name, email id, contact details. We may also collect transaction data and data from our third-party partners. Please note: Luxe Dior will never ask for sensitive data like card PINs via email or phone. If this happens, report it immediately to law enforcement.`,
    },
    {
      title: "Usage",
      description: `We use your personal data to process orders, enhance experiences, resolve issues, detect fraud, and personalize marketing. We may use your data to inform you about offers, updates, and services. You may opt-out of non-essential communications at any time.`,
    },
    {
      title: "Sharing",
      description: `Your data may be shared internally across Luxe Dior's entities or with trusted partners such as logistics services, payment gateways, and legal authorities when necessary. We only disclose data when it is required for service delivery, legal compliance, fraud detection, or security reasons.`,
    },
    {
      title: "Security Precautions",
      description: `We use secure servers and adopt industry-standard practices to safeguard your personal data. However, internet transmissions may have security risks. It’s your responsibility to protect your login credentials.`,
    },
    {
      title: "Data Deletion and Retention",
      description: `You may delete your account from your profile settings. We may retain some data to comply with legal or business obligations. Once deleted, you’ll lose access to related account services. Retained data may be anonymized for research and analytics.`,
    },
    {
      title: "Your Rights",
      description: `You can access and update your personal information via your account dashboard on the Platform.`,
    },
    {
      title: "Consent",
      description: `By using our Platform, you consent to data processing as described in this policy. If you share data on behalf of others, ensure you have their consent. You may withdraw consent by writing to us. Withdrawal may affect access to some services.`,
    },
    {
      title: "Changes to this Privacy Policy",
      description: `Luxe Dior may update this Privacy Policy from time to time. We recommend reviewing it periodically. Significant changes will be communicated as per applicable legal requirements.`,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero section */}
      <div className="text-center py-16 bg-[#191A1C] text-white rounded-lg shadow-md mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide">
          Luxe Dior Privacy Policy
        </h1>
        <p className="mt-4 text-gray-300 text-lg max-w-2xl mx-auto">
          Learn how we collect, use, and protect your personal data while using
          our services.
        </p>
      </div>

      {/* Content section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <ul className="space-y-10">
          {policies.map((item, index) => (
            <li key={index}>
              <h2 className="text-2xl font-semibold text-[#FACC15] mb-2">
                {index + 1}. {item.title}
              </h2>
              <p className="text-base leading-relaxed text-gray-200 text-justify">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
