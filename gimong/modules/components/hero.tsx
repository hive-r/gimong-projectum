"use client";

import Image from "next/image";

interface HeroProps {
  title: string;
  subtitle?: string;
  imageUrl: string;
  height?: string;
  overlayOpacity?: string;
  align?: "center" | "left" | "right";
  offset?: string; 
}

export default function Hero({
  title,
  subtitle,
  imageUrl,
  height = "h-[80vh]", 
  overlayOpacity = "bg-black/50",
  align = "center",
  offset = "mt-16", 
}: HeroProps) {
  const alignment =
    align === "center"
      ? "items-center justify-center text-center"
      : align === "left"
      ? "items-center justify-start text-left pl-10 md:pl-20"
      : "items-center justify-end text-right pr-10 md:pr-20";

  return (
    <section className={`relative w-full ${height} ${offset}`}>
      <Image
        src={imageUrl}
        alt={title}
        fill
        priority
        className="object-cover"
      />
      <div className={`absolute inset-0 ${overlayOpacity} flex ${alignment}`}>
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-base md:text-lg text-gray-200">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
