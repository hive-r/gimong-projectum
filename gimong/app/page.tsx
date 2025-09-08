import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to GIMONG
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Your church management and community engagement platform.
        </p>
        <Button size="lg">Get Started</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Announcements</h2>
            <p className="text-gray-600">Stay updated with the latest church news.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <p className="text-gray-600">Access sermons, teachings, and study guides.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-2">Membership</h2>
            <p className="text-gray-600">Join and grow with the church community.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
