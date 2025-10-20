"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/services/firebase/auth";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { role } = await loginUser(email, password);
      if (!role) throw new Error("User role not found");

      toast.success(`Welcome, ${role}! ✨`);
      // Redirect based on role
      switch (role) {
        case "superadmin":
          router.push("/super_admin");
          break;
        case "admin":
          router.push("/admin");
          break;
        case "media":
          router.push("/media");
          break;
        case "finance":
          router.push("/finance_admin");
          break;
        case "pastor":
          router.push("/pastor");
          break;
        default:
          router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 p-6">
      <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-teal-900 mb-6 tracking-tight">
          Church Admin Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-teal-900 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                autoComplete="off"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@gimong.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-teal-900 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                autoComplete="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-gray-700 transition-all duration-200 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 Church Admin Panel
        </p>
      </div>
    </div>
  );
}
