"use client";

import { MapPin } from "lucide-react";
import SectionHeader from "@/modules/components/sectionHeader";

export default function Location() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-linear-to-b from-white to-teal-50 text-center">
      {/* Section Header */}
      <SectionHeader subtitle="Visit Us" title="Our Church Location" align="center" />

      {/* Map Container */}
      <div className="relative mt-10 w-full h-[450px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.217705708745!2d121.03244857474198!3d14.588578985906401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9a2b6a6b71b%3A0x1234567890abcdef!2sSample%20Church!5e0!3m2!1sen!2sph!4v1694151737290!5m2!1sen!2sph"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Overlay gradient for subtle polish */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none"></div>
      </div>

      {/* Description */}
      <div className="mt-10 max-w-3xl mx-auto text-gray-700 leading-relaxed text-xl">
         <div className="flex items-center text-2xl uppercase justify-center gap-3 mt-6 text-primary font-semibold">
          <MapPin className="w-5 h-5" />
          <span>MA-054 Palmaville, La Trinidad, Benguet</span>
        </div>
        <p>
          A place where faith and
          community come together. Easily accessible by both public and private
          transportation, it’s a peaceful space for worship, fellowship, and
          spiritual growth.
        </p>
      </div>
    </section>
  );
}
