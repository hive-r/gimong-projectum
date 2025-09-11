import { Card, CardContent } from "@/components/ui/card"

export default function AnnouncementsPage() {
  const announcements = [
    { title: "Sunday Worship", desc: "Join us every Sunday at 10 AM." },
    { title: "Bible Study", desc: "Every Wednesday at 7 PM." },
    { title: "Youth Camp", desc: "Registration is now open for this year’s youth camp." },
  ]

  return (
    <section className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">Announcements</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((item, idx) => (
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
