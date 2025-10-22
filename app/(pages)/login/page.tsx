"use client";

export const dynamic = "force-static";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginUser } from "@/services/firebase/auth";
import { Mail, Lock, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://fra.cloud.appwrite.io/v1/storage/buckets/68ee4f3700317e582588/files/68f87f530014d33cd750/view?project=68ee4e2700281ded4a2b&mode=admin')",
      }}
    >
      {/* 🔹 Overlay for readability */}
      <div className="absolute inset-0 bg-black/15 z-0" />

      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
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
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}
