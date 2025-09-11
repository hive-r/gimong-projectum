import { Card, CardContent } from "@/components/ui/card"

export default function ResourcesPage() {
  const resources = [
    { title: "Sermons", desc: "Listen to past sermons and teachings." },
    { title: "Study Guides", desc: "Download Bible study materials." },
    { title: "Videos", desc: "Watch recorded events and messages." },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Resources</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
