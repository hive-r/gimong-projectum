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
            Leading People Closer to Christ
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To lead people into a deeper and lasting relationship with Jesus
            Christ — helping them grow in{" "}
            <span className="font-semibold text-primary">faith</span>, walk in{" "}
            <span className="font-semibold text-primary">love</span>, and serve
            others with compassion and purpose. We aim to build disciples who
            reflect Christ in their families, communities, and the world.
          </p>
        </div>

        {/* Vision Card */}
        <div className="group bg-white p-10 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300">
          <h4 className="text-xl font-bold text-primary mb-2 group-hover:text-teal-600 transition-colors">
            Our Vision
          </h4>
          <h3 className="text-3xl uppercase font-semibold text-gray-800 mb-4">
            A Church Alive in Faith and Love
          </h3>
          <p className="text-gray-700 text-base md:text-lg leading-relaxed">
            To be a vibrant, Christ-centered community where everyone
            experiences God’s{" "}
            <span className="font-semibold text-primary">grace</span> and{" "}
            <span className="font-semibold text-primary">truth</span>. We
            envision a church united in{" "}
            <span className="font-semibold text-primary">faith</span>,
            overflowing with{" "}
            <span className="font-semibold text-primary">love</span>, and
            passionately sharing the{" "}
            <span className="font-semibold text-primary">Gospel</span> to impact
            generations for God’s glory.
          </p>
        </div>
      </div>
    </section>
  );
}
