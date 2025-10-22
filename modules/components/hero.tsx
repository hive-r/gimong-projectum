"use client";

import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  height?: string;
  overlayOpacity?: string;
  align?: "center" | "left" | "right";
}

export default function Hero({
  title,
  subtitle,
  imageUrl,
  height = "h-[80vh]",
  overlayOpacity = "bg-black/15",
  align = "center",
}: HeroProps) {
  const alignment =
    align === "center"
      ? "items-center justify-center text-center uppercase"
      : align === "left"
      ? "items-center justify-start text-left pl-10 md:pl-20"
      : "items-center justify-end text-right pr-10 md:pr-20";

  return (
    <section className={`relative w-full ${height} overflow-hidden`}>
      {/* Background Image */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover object-center scale-105 transition-transform duration-700 ease-in-out hover:scale-110"
      />

      {/* Overlay & Glow */}
      <div
        className={`absolute inset-0 ${overlayOpacity} bg-linear-to-b from-black/30 to-black/10 flex ${alignment}`}
      >
        <div className="max-w-3xl px-4 md:px-0">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl bg-clip-text bg-linear-to-r from-teal-300 via-primary to-teal-500">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-sm">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
