"use client";

import React, { useEffect, useState } from "react";
import { auth } from "@/services/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { getUserRole, Role } from "@/services/firebase/users";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const role = await getUserRole(user.uid);

      if (role && allowedRoles.includes(role)) {
        setAuthorized(true);
      } else {
        router.push("/unauthorized");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [allowedRoles, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-200">
        {/* Spinner */}
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-gray-800 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-semibold text-gray-800 animate-pulse">
          Loading your dashboard...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we verify your access.
        </p>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};
