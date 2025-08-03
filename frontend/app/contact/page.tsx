"use client";
import React, { useEffect, useState } from "react";

import { addToast } from "@heroui/toast";
import { useUser } from "@clerk/nextjs";
import sendEmailServerHandler from "./action";
import { Spinner } from "@heroui/spinner";

const page = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      addToast({
        title: "Please fill out all fields",
        variant: "solid",
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { message, success } = await sendEmailServerHandler({
        email: form.email,
        name: form.name,
        query: form.message,
      });
      setForm({ ...form, message: "" });
      if (success) {
        addToast({
          title: message,
          variant: "solid",
          color: "success",
        });
      } else {
        addToast({
          title: message,
          variant: "solid",
          color: "danger",
        });
      }
      setIsSubmitting(false);
    } catch (err) {
      setIsSubmitting(false);
      addToast({
        title: "Failed to send message",
        variant: "solid",
        color: "danger",
      });
    }
  };
  useEffect(() => {
    if (user) {
      setForm({
        ...form,
        name: `${user?.firstName} ${user?.lastName}`,
        email: user?.primaryEmailAddress?.emailAddress || "",
      });
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-[#191A1C] flex items-center justify-center px-4 py-12">
      <div className="bg-[#121212] rounded-2xl shadow-lg w-full max-w-md p-6 sm:p-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-yellow-400 mb-6">
          Contact Us
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-md px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            onChange={handleChange}
            value={form.email}
            className="w-full rounded-md px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <textarea
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="w-full rounded-md px-4 py-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`w-full flex items-center justify-center bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition duration-200 ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2 text-black" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
