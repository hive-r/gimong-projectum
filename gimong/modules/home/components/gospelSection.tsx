"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Scale,
  Cross,
  Gift,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import SectionHeader from "@/modules/components/sectionHeader";
import { motion } from "framer-motion";

const steps = [
  {
    title: "God Loves You",
    description:
      "He desires a relationship with you and offers His love and eternal life through Jesus Christ.",
    verse: "Deuteronomy 7:9",
    icon: Heart,
  },
  {
    title: "God Is Holy",
    description:
      "We have all sinned and fall short of His glory, separating us from Him.",
    verse: "Romans 3:23",
    icon: Scale,
  },
  {
    title: "God Is Merciful",
    description:
      "In His mercy, He sent His Son Jesus to die for our sins so we could be forgiven.",
    verse: "Romans 5:8",
    icon: Cross,
  },
  {
    title: "God Is Gracious",
    description:
      "Salvation is a free gift received through faith in Jesus Christ — not by works.",
    verse: "Ephesians 2:8-9",
    icon: Gift,
  },
  {
    title: "God's Promise",
    description:
      "Those who trust in Jesus have eternal life and assurance of His presence forever.",
    verse: "1 John 5:11-13",
    icon: ShieldCheck,
  },
  {
    title: "Would You Like to Place Your Faith in Jesus Today?",
    description:
      "Lord Jesus, I need You. I believe You died for my sins and rose again. I receive You as my Savior and Lord. Thank You for forgiving me and giving me eternal life. Amen.",
    verse: "",
    icon: BookOpen,
    highlight: true,
  },
];

export default function GospelSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-gradient-to-b from-white via-gray-50 to-teal-50 overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-80 pointer-events-none" />

      {/* Section Header */}
      <div className="relative mb-14">
        <SectionHeader
          subtitle="Looking for Answers?"
          title="Your Being Here Today Is No Accident!"
          align="center"
        />
        <p className="text-lg md:text-xl text-gray-600 text-center max-w-2xl mx-auto mt-4">
          God brought you here for His purpose.
        </p>
      </div>

      {/* Step Cards */}
      <div className="relative space-y-12 max-w-7xl mx-auto">
        {/* Row 1 */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.slice(0, 3).map(({ title, description, verse, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center p-8 rounded-none">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5 mx-auto hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
                <h3 className="text-4xl uppercase font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-2">{description}</p>
                <p className="text-md italic text-gray-500">{verse}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {steps.slice(3, 5).map(({ title, description, verse, icon: Icon }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center p-8 rounded-none">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-5 mx-auto hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                >
                  <Icon className="h-8 w-8" />
                </motion.div>
                <h3 className="text-4xl uppercase font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-2">{description}</p>
                <p className="text-md italic text-gray-500">{verse}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Final Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {steps
            .filter((s) => s.highlight)
            .map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="bg-primary text-white shadow-lg border-none rounded-none hover:shadow-2xl transition-all duration-300"
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mx-auto mb-6"
                  >
                    <Icon className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">{title}</h3>
                  <p className="text-md md:text-lg leading-relaxed max-w-2xl mx-auto text-white/90">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
