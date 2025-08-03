"use server";
import { ContactUsEmailTemplate as ContactUsEmailTemplateClient } from "@/email-template/ContactUsEmailTemplateClient";
import { ContactUsEmailTemplate as ContactUsEmailTemplateAdmin } from "@/email-template/ContactUsEmailTemplateAdmin";
import { resend } from "@/utils/ResendUtil";

export default async function sendEmailServerHandler({
  name,
  email,
  query,
}: {
  name: string;
  email: string;
  query: string;
}) {
  try {
    await Promise.all([
      resend.emails.send({
        from: "Luxe Dior <jashanverma@luxedior.in>",
        to: [`${email}`],
        subject: "We have recieved your Query",
        react: ContactUsEmailTemplateClient({
          name: name,
          query: query,
        }),
      }),
      resend.emails.send({
        from: "Luxe Dior Enquiry <jashanverma@luxedior.in>",
        to: ["perfumes.luxediore@gmail.com"],
        subject: "New Enquiry",
        react: ContactUsEmailTemplateAdmin({
          name: name,
          query: query,
          email: email,
        }),
      }),
    ]);
    return {
      success: true,
      message: "Message sent successfully.",
    };
  } catch (err: any) {
    console.log("error : ", err);
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
