"use client";

import Image from "next/image";
import { motion } from "framer-motion";

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
        className={`absolute inset-0 ${overlayOpacity} bg-gradient-to-b from-black/30 to-black/10 flex ${alignment}`}
      >
        <div className="max-w-3xl px-4 md:px-0">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-xl bg-clip-text bg-gradient-to-r from-teal-300 via-primary to-teal-500"
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-sm"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
