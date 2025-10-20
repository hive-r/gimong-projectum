"use client";

interface SectionHeaderProps {
  subtitle?: string;
  title: string;
  align?: "center" | "left";
}

export default function SectionHeader({
  subtitle,
  title,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-4 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      {subtitle && (
        <p className="text-primary uppercase text-lg font-normal tracking-widest">
          {subtitle}
        </p>
      )}
      <h2 className="text-gray-900 text-4xl md:text-5xl uppercase font-bold mt-2">{title}</h2>
    </div>
  );
}
