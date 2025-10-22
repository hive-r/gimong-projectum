"use client";

import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-linear-to-br from-gray-50 to-gray-200 text-center">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <ShieldAlert className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 mb-8">
          You don’t have permission to view this page.
          <br /> Please contact the administrator if you think this is a mistake.
        </p>

        <Button
          onClick={() => router.push("/login")}
          className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg text-base font-medium"
        >
          Back to Login
        </Button>
      </div>

      <p className="mt-8 text-gray-400 text-sm">© 2025 Church Admin Panel</p>
    </div>
  );
}
