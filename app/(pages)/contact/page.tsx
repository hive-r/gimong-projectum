"use client";

import { Button } from "@/components/ui/button";
import SectionHeader from "@/modules/components/sectionHeader";
import Navbar from "@/components/layout/navbar"; // ✅ adjust path as needed
import Footer from "@/components/layout/footer"; // ✅ adjust path as needed

export default function ContactPage() {
  return (
    <>
      {/* ✅ Navbar at the top */}
      <Navbar />

      <section className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 py-20 px-6 min-h-screen">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <SectionHeader
            subtitle="Get In Touch"
            title="We’d Love to Hear From You"
            align="center"
          />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Whether you have questions, prayer requests, or simply want to connect,
            our team is here to listen and help. Send us a message — we’ll get back
            to you as soon as possible.
          </p>
        </div>

        {/* Contact Form */}
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <form className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/40 transition-all"
                rows={5}
                placeholder="Write your message here..."
              />
            </div>

            <div className="pt-2 text-center">
              <Button
                type="submit"
                className="px-8 py-3 rounded-full font-medium shadow-md bg-primary text-white hover:bg-primary/90 transition-all"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* ✅ Footer at the bottom */}
      <Footer />
    </>
  );
}
