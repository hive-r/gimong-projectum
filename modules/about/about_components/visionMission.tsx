"use client";

export default function VisionMission() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-linear-to-b from-white to-teal-50">
      <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
        {/* Mission Card */}
        <div className="group bg-white p-10 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300">
          <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-teal-600 transition-colors">
            Our Mission
          </h4>
          <h3 className="text-3xl uppercase font-semibold text-gray-800 mb-4">
            To Glorify God by Establishing a Community
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To <span className="font-semibold text-primary">glorify God</span> by establishing a community responsible to{" "}
            <span className="font-semibold text-primary">evangelize</span>,{" "}
            <span className="font-semibold text-primary">equip</span>, and{" "}
            <span className="font-semibold text-primary">mobilize</span> members in{" "}
            <span className="font-semibold text-primary">making disciples</span>.
          </p>
        </div>

        {/* Vision Card */}
        <div className="group bg-white p-10 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300">
          <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-teal-600 transition-colors">
            Our Vision
          </h4>
          <h3 className="text-3xl uppercase font-semibold text-gray-800 mb-4">
            Center for Worship with Multiplying Churches
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            We envision <span className="font-semibold text-primary">LTCB</span> as a{" "}
            <span className="font-semibold text-primary">center for worship</span> with{" "}
            <span className="font-semibold text-primary">multiplying churches</span> that have{" "}
            <span className="font-semibold text-primary">strong and committed members</span> who{" "}
            <span className="font-semibold text-primary">make disciples</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
