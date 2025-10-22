"use client";

import Image from "next/image";

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  role: string;
}

export default function ProfileCard({ imageUrl, name, role }: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-primary/30 p-8 text-center">
      {/* Glow Background Effect */}
      <div className="absolute inset-0 bg-linear-to-br from-teal-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

      {/* Avatar */}
      <div className="mt-5 relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-primary/30 shadow-md group-hover:scale-105 transition-transform duration-500">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
      </div>

      {/* Name & Role */}
      <div className="mt-10 relative z-10">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <p className="text-md text-gray-600 mt-1 tracking-wide">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
            {role}
          </span>
        </p>
      </div>
      <div className="mt-5 mb-10 mx-auto w-16 h-[3px] bg-linear-to-r from-primary to-teal-400 group-hover:w-24 transition-all duration-500"></div>
    </div>
  );
}
