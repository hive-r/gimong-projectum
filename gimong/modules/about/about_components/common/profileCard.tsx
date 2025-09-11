"use client";

import Image from "next/image";

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

export default function ProfileCard({ imageUrl, name, role }: ProfileCardProps) {
  return (
    <div className="group rounded-xl border bg-white shadow-sm hover:shadow-md transition-all p-6 text-center">
      {/* Avatar */}
      <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 shadow-sm">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Name & Role */}
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{name}</h3>
      <p className="text-sm text-primary font-medium">{role}</p>
    </div>
  );
}
