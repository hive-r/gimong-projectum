"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full h-[75vh] md:h-[85vh]">
      {/* Background Image */}
      <Image
        src="https://fra.cloud.appwrite.io/v1/storage/buckets/68ee4f3700317e582588/files/68f87f530014d33cd750/view?project=68ee4e2700281ded4a2b&mode=admin"
        alt="Hero Background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/50" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center px-4 sm:px-8 md:px-12 lg:px-20">
        <div className="max-w-4xl text-left text-white">
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            WELCOME TO THE FAMILY
          </h1>
          <p className="mt-6 sm:mt-8 md:mt-12 text-sm sm:text-base md:text-xl lg:text-2xl text-gray-200 leading-relaxed">
            A family of believers growing together in{" "}
            <span className="font-semibold text-teal-400">faith</span>,{" "}
            <span className="font-semibold text-teal-400">hope</span>, and{" "}
            <span className="font-semibold text-teal-400">love</span>. Join us as
            we follow Christ and live out His purpose in our lives!
          </p>
        </div>
      </div>
    </section>
  );
}
