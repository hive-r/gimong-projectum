"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Church,
  MapPin,
  Users,
  Heart,
  Scale,
  Cross,
  Gift,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "1. GOD LOVES YOU.",
    description:
      "He desires for you to have a meaningful life with Him now and eternal life with Him forever.",
    verse:
      "Know therefore that the Lord your God, He is God, the faithful God, who keeps His covenant and His lovingkindness – Deuteronomy 7:9",
    icon: Heart,
  },
  {
    title: "2. GOD IS HOLY.",
    description: "We are sinful, and our sin separates us from Him.",
    verse:
      "Everyone has sinned and is far away from God’s saving presence. – Romans 3:23",
    icon: Scale,
  },
  {
    title: "3. GOD IS MERCIFUL.",
    description:
      "In His love, He sent His Son Jesus Christ. Jesus died on the cross for our sins and rose again.",
    verse: "But God demonstrates His own love toward us... Christ died for us. – Romans 5:8",
    icon: Cross,
  },
  {
    title: "4. GOD IS GRACIOUS.",
    description:
      "By faith in Jesus Christ, we are forgiven of sin and receive eternal life.",
    verse:
      "For by grace you have been saved through faith... it is the gift of God. – Ephesians 2:8-9",
    icon: Gift,
  },
  {
    title: "5. GOD KEEPS HIS PROMISES.",
    description: "You can be sure of eternal life when you trust in Jesus.",
    verse:
      "And the testimony is this, that God has given us eternal life, and this life is in His Son. – 1 John 5:11-13",
    icon: ShieldCheck,
  },
  {
    title: "Would you like to place your faith in Jesus today?",
    description:
      "Lord Jesus, I need You. I confess that I am a sinner. I believe You died for my sins. Please come into my life and be my Savior. I accept Your gift of eternal life. Amen.",
    verse: "",
    icon: BookOpen,
    highlight: true,
  },
];

export default function HomePage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
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

      {/* Welcome Section */}
      <section className="py-20 px-6 md:px-12 lg:px-20 text-center">
        <p className="text-xs md:text-sm uppercase tracking-widest text-primary font-medium">
          Regardless of who you are, you are welcome here
        </p>
        <h2 className="mt-3 text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-snug">
          Growing Together in Faith and Love
        </h2>

        {/* Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Sunday Service */}
          <Link
            href="/sunday-service"
            className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <Church className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Sunday Service</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
              Join us every Sunday to worship, learn, and grow together as a family of believers.
            </p>
          </Link>

          {/* Where are we? */}
          <Link
            href="/location"
            className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Where are we?</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
              Find our church location and directions so you can easily join us in fellowship.
            </p>
          </Link>

          {/* Who are we? */}
          <Link
            href="/about"
            className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Who are we?</h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
              Learn more about our mission, vision, and the community that makes us who we are.
            </p>
          </Link>
        </div>
      </section>

      {/* Gospel Section */}
      <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 px-6 md:px-12 lg:px-20">
        {/* Heading */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-teal-700">
            Looking for Answers?
          </h2>
          <p className="mt-2 text-base md:text-lg font-medium text-teal-600">
            Your being here today is no accident!
          </p>
          <p className="mt-2 text-sm md:text-base text-gray-600">
            God brought you here for His purpose.
          </p>
        </div>

        {/* Steps Row 1: 1 2 3 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto mb-6">
          {steps.slice(0, 3).map((step, i) => (
            <Card
              key={i}
              className="rounded-lg border border-teal-100 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 mx-auto mb-3">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-teal-700 mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-snug mb-1">
                  {step.description}
                </p>
                <p className="text-[10px] sm:text-xs italic text-gray-500">{step.verse}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Steps Row 2: 4 5 */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto mb-6">
          {steps.slice(3, 5).map((step, i) => (
            <Card
              key={i}
              className="rounded-lg border border-teal-100 bg-white shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-4 sm:p-5 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100 text-teal-600 mx-auto mb-3">
                  <step.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-teal-700 mb-1">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-snug mb-1">{step.description}</p>
                <p className="text-[10px] sm:text-xs italic text-gray-500">{step.verse}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Step 6 */}
        <div className="mt-6 max-w-3xl mx-auto">
          {steps
            .filter((step) => step.highlight)
            .map((step, i) => (
              <Card
                key={i}
                className="bg-teal-600 text-white rounded-2xl shadow-md"
              >
                <CardContent className="p-5 sm:p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mx-auto mb-3">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto">{step.description}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </section>
    </main>
  );
}
