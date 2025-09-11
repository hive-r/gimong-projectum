"use client";

import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full">
      <Image
        src="https://images.pexels.com/photos/212324/pexels-photo-212324.jpeg"
        alt="Green landscape"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
      <div className="relative z-10 flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl text-left text-white">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            Welcome to the Family
          </h1>
          <p className="mt-6 text-base md:text-lg lg:text-xl text-gray-200 max-w-xl leading-relaxed">
            A community of believers growing together in{" "}
            <span className="font-semibold text-primary">faith</span>,{" "}
            <span className="font-semibold text-primary">hope</span>, and{" "}
            <span className="font-semibold text-primary">love</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
