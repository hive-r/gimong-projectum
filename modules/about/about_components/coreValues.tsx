"use client";

import Image from "next/image";
import SectionHeader from "@/modules/components/sectionHeader";

const values = [
  {
    title: "Faith",
    description:
      "We live by **faith**, trusting completely in God’s **promises** and **guidance**. Our faith fuels everything we do — from **worship** and **service** to how we love and forgive others. It is the foundation that strengthens us in times of uncertainty and gives us courage to follow God’s calling with **confidence** and **peace**.",
    image: "https://images.pexels.com/photos/1296720/pexels-photo-1296720.jpeg",
  },
  {
    title: "Community",
    description:
      "We believe that life is better **together**. In community, we find **strength**, **encouragement**, and **accountability** as we walk side by side, growing in **love** and **unity**. Together, we share each other’s burdens, celebrate victories, and reflect the **heart of Christ** through genuine relationships rooted in **compassion** and **grace**.",
    image: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
  },
  {
    title: "Service",
    description:
      "We serve with **humility** and **joy**, following the example of **Jesus**, who came not to be served but to serve. Every act of **kindness**, no matter how small, is a reflection of His heart for others. Through **service**, we demonstrate God’s **love in action**, bringing **light** and **hope** to those in need within our church and beyond.",
    image: "https://images.pexels.com/photos/2351719/pexels-photo-2351719.jpeg",
  },
  {
    title: "Integrity",
    description:
      "We live with **honesty**, **humility**, and **consistency**. Integrity means doing what is **right** — even when no one is watching — and letting our lives be a true reflection of **Christ**. We strive to honor God in every **word** and **action**, building **trust** and **credibility** as His representatives in our homes, and communities.",
    image: "https://images.pexels.com/photos/5997003/pexels-photo-5997003.jpeg",
  },
];

export default function CoreValues() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-linear-to-b from-white to-teal-50">
      {/* Section Header */}
      <SectionHeader subtitle="Core Values" title="What We Stand For" />

      <div className="grid gap-16 max-w-7xl mx-auto">
        {values.map((value, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 items-center gap-10 ${
              i % 2 === 1 ? "md:grid-flow-col-dense" : ""
            }`}
          >
            {/* Text */}
            <div
              className={`space-y-4 ${
                i % 2 === 1 ? "md:col-start-2 md:pl-8" : "md:pr-8"
              }`}
            >
              <h3 className="text-3xl font-bold text-primary uppercase">
                {value.title}
              </h3>
              <p
                className="text-gray-700 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: value.description.replace(
                    /\*\*(.*?)\*\*/g,
                    '<span class="text-grey-900 text-xl font-semibold">$1</span>'
                  ),
                }}
              />
            </div>

            {/* Image */}
            <div className="relative w-full h-64 md:h-72 group overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <Image
                src={value.image}
                alt={value.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
