"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Scale, Cross, Gift, ShieldCheck, BookOpen } from "lucide-react";
import SectionHeader from "@/modules/components/sectionHeader";

const steps = [
  {
    title: "1. GOD LOVES YOU.",
    description: "He desires for you...",
    verse: "Deuteronomy 7:9",
    icon: Heart,
  },
  {
    title: "2. GOD IS HOLY.",
    description: "We are sinful...",
    verse: "Romans 3:23",
    icon: Scale,
  },
  {
    title: "3. GOD IS MERCIFUL.",
    description: "In His love, He sent...",
    verse: "Romans 5:8",
    icon: Cross,
  },
  {
    title: "4. GOD IS GRACIOUS.",
    description: "By faith in Jesus...",
    verse: "Ephesians 2:8-9",
    icon: Gift,
  },
  {
    title: "5. GOD KEEPS HIS PROMISES.",
    description: "You can be sure...",
    verse: "1 John 5:11-13",
    icon: ShieldCheck,
  },
  {
    title: "Would you like to place your faith in Jesus today?",
    description: "Lord Jesus, I need You...",
    verse: "",
    icon: BookOpen,
    highlight: true,
  },
];

export default function GospelSection() {
  return (
    <section className="relative bg-gradient-to-b from-teal-50 to-white py-20 px-6 md:px-12 lg:px-20">
      {/* Section Header */}
      <SectionHeader
        subtitle="Looking for Answers?"
        title="Your being here today is no accident!"
        align="center"
      />

      <p className="text-sm md:text-base text-gray-600 text-center max-w-2xl mx-auto mb-12">
        God brought you here for His purpose.
      </p>

      {/* Steps 1-3 */}
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
              <p className="text-[10px] sm:text-xs italic text-gray-500">
                {step.verse}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Steps 4-5 */}
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
              <h3 className="text-sm sm:text-base font-bold text-teal-700 mb-1">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-snug mb-1">
                {step.description}
              </p>
              <p className="text-[10px] sm:text-xs italic text-gray-500">
                {step.verse}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Step 6 */}
      <div className="mt-6 max-w-3xl mx-auto">
        {steps
          .filter((s) => s.highlight)
          .map((step, i) => (
            <Card
              key={i}
              className="bg-teal-600 text-white rounded-2xl shadow-md"
            >
              <CardContent className="p-5 sm:p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mx-auto mb-3">
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
}
