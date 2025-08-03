"use client";
import Link from "next/link";
import { Button } from "@heroui/button";
import { IconArrowLeft as ArrowLeft } from "@tabler/icons-react";
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#191A1C] text-gray-100 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-5xl font-bold text-[#FACC15]">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <p className="text-gray-400 mt-2 max-w-md">
        The page you are looking for doesn’t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="mt-6 flex items-center gap-2 bg-[#FACC15] text-black hover:bg-yellow-400">
          <ArrowLeft className="w-4 h-4" />
          Go back home
        </Button>
      </Link>
    </div>
  );
}
