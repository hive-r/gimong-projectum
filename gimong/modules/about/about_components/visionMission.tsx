"use client";

export default function VisionMission() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-gray-50">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Mission */}
        <div>
          <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
          <p className="text-gray-700 leading-relaxed">
            To lead people into a growing relationship with Jesus Christ,
            equipping them to live out their faith in love and service to others.
          </p>
        </div>

        {/* Vision */}
        <div>
          <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
          <p className="text-gray-700 leading-relaxed">
            To be a Christ-centered community where everyone experiences God’s
            love, grows in faith, and impacts the world through the Gospel.
          </p>
        </div>
      </div>
    </section>
  );
}
