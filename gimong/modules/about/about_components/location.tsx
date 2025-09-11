"use client";

import SectionHeader from "@/modules/components/sectionHeader";

export default function Location() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 text-center">
      {/* Section header */}
      <SectionHeader subtitle="Visit Us" title="Our Church Location" align="center" />

      {/* Map */}
      <div className="mt-10 w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3859.217705708745!2d121.03244857474198!3d14.588578985906401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9a2b6a6b71b%3A0x1234567890abcdef!2sSample%20Church!5e0!3m2!1sen!2sph!4v1694151737290!5m2!1sen!2sph"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Description */}
      <p className="mt-6 max-w-3xl mx-auto text-gray-700 leading-relaxed">
        We are located at the heart of the city, easily accessible by public and
        private transportation. Whether you are a first-time visitor or a
        regular attendee, we welcome you to come and join us in worship and
        fellowship.
      </p>
    </section>
  );
}
