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
        <p className="text-primary uppercase text-sm font-semibold tracking-widest">
          {subtitle}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold mt-2">{title}</h2>
    </div>
  );
}
