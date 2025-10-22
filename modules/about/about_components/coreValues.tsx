"use client";

import Image from "next/image";
import SectionHeader from "@/modules/components/sectionHeader";

const values = [
  {
    title: "Biblically Grounded & Spirit-Filled",
    description:
      "We derive all our **doctrines and practices** from the **Bible**, recognizing it as the **ultimate authority** for faith and life. We commit to **live by being sensitive** to the leading of the **Holy Spirit**, bearing His **fruit and gifts**, and allowing Him to bring out the **fullest potential** of the church. Through Scripture and the Spirit, we are guided, strengthened, and continually transformed to walk in God’s will.",
    image: "https://images.pexels.com/photos/1296720/pexels-photo-1296720.jpeg",
  },
  {
    title: "Prayerful",
    description:
      "We are a **praying church**, believing in the **power of the Holy Spirit** and the **promises of Christ**. Prayer is our way of **communing with God** — seeking His **guidance**, experiencing **intimacy**, and aligning ourselves with His **will**. As Christ promised that prayer can **move mountains**, we commit ourselves to a **life of prayer**, expecting great things to happen through faith.",
    image: "https://images.pexels.com/photos/5997003/pexels-photo-5997003.jpeg",
  },
  {
    title: "Christ-Centered",
    description:
      "Jesus Christ is the **center of everything** we do. He is the **manifestation of God’s glory**, and apart from Him, we can bear no fruit. We ensure that **Christ remains the focus** of all our **worship, ministry, and service**, so that every action we take glorifies Him and advances His kingdom.",
    image: "https://images.pexels.com/photos/2351719/pexels-photo-2351719.jpeg",
  },
  {
    title: "Community & Volunteerism",
    description:
      "We commit to nurture our **relationships as one family** through **sharing, hospitality, equality, affection, and respect**. By exercising our **God-given gifts**, showing **generosity**, and extending **service without expecting anything in return**, we make **Christ known in tangible ways**. We believe that serving one another in love strengthens our unity and reflects the **heart of Christ** to the world.",
    image: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
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
