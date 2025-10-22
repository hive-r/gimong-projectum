"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full">
      <Image
        src="https://fra.cloud.appwrite.io/v1/storage/buckets/68ee4f3700317e582588/files/68f87f530014d33cd750/view?project=68ee4e2700281ded4a2b&mode=admin"
        alt="Hero Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/15 to-black/30" />
      <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-3xl text-left text-white">
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-bold leading-tight tracking-tight drop-shadow-lg whitespace-nowrap">
            WELCOME TO THE FAMILY
          </h1>
          <p className="mt-12 text-base md:text-xl lg:text-3xl text-gray-200 max-w-3xl leading-relaxed">
            A family of believers growing together in{" "}
            <span className="font-semibold text-teal-500">faith</span>,{" "}
            <span className="font-semibold text-teal-500">hope</span>, and{" "}
            <span className="font-semibold text-teal-500">love</span>. Join us as
            we follow Christ and live out His purpose in our lives!.
          </p>
        </div>
      </div>
    </section>
  );
}
