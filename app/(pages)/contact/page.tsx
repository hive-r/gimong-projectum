"use client";

import { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/modules/components/sectionHeader";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID as string,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID as string,
        {
          name: form.name,
          email: form.email,
          message: form.message,
          title: "Contact Message",
          time: new Date().toLocaleString(),
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY as string
      );

      if (res.status === 200) {
        toast.success("✅ Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("❌ Something went wrong. Please try again later.");
      }
    } catch (error) {
      toast.error("❌ Failed to send message. Please try again later.");
      console.error("EmailJS Error:", error);
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
      {/* 🔹 Overlay */}
      <div className="absolute inset-0 bg-black/15 z-0" />

      {/* 🔹 Navbar */}
      <Navbar />

      {/* 🔹 Main Content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-20">
        <div className="bg-white/85 backdrop-blur-xl shadow-xl rounded-2xl p-10 w-full max-w-lg transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <SectionHeader
              subtitle="Get In Touch"
              title="We’d Love to Hear From You"
              align="center"
            />
            <p className="text-gray-700 mt-3">
              Have questions or prayer requests? Send us a message — we’ll reply
              as soon as possible.
            </p>
          </div>

          {/* Contact Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:outline-none transition"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-primary/50 focus:outline-none transition"
                placeholder="Write your message here..."
              />
            </div>

            <div className="pt-2 text-center">
              <Button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-3 rounded-full font-medium shadow-md bg-primary text-white hover:bg-primary/90 transition-all"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* 🔹 Footer */}
      <Footer />
    </div>
  );
}
