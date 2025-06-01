import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, MapPin, Phone } from "lucide-react"
import Image from "next/image"
import { teamMembers } from "@/lib/data"

export default function AboutPage() {
  return (
    <main className="min-h-screen py-16 px-4 md:px-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">About Our Gallery</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dedicated to showcasing exceptional contemporary art and supporting emerging and established artists.
        </p>
      </section>

      {/* Our Story */}
      <section className="max-w-7xl mx-auto mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2010, ArtGallery began as a small exhibition space dedicated to showcasing works by local
              artists. Over the years, we've grown into a premier destination for contemporary art, representing artists
              from around the world.
            </p>
            <p className="text-muted-foreground mb-4">
              Our mission is to make exceptional art accessible to everyone. We believe in the transformative power of
              art and its ability to inspire, challenge, and connect people across cultures and backgrounds.
            </p>
            <p className="text-muted-foreground">
              Today, our gallery hosts rotating exhibitions, educational programs, and community events that engage
              audiences of all ages and backgrounds. We're committed to supporting artists throughout their careers and
              helping collectors find works that resonate with them.
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=800&width=1200"
              alt="Gallery interior"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="max-w-7xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.position}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Gallery Information */}
      <section className="max-w-7xl mx-auto mb-16">
        <Tabs defaultValue="visit" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="visit">Visit Us</TabsTrigger>
            <TabsTrigger value="mission">Our Mission</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          <TabsContent value="visit" className="p-6 bg-muted rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Gallery Hours</h3>
                <p className="mb-1">
                  <span className="font-medium">Monday:</span> Closed
                </p>
                <p className="mb-1">
                  <span className="font-medium">Tuesday - Friday:</span> 10:00 AM - 6:00 PM
                </p>
                <p className="mb-1">
                  <span className="font-medium">Saturday:</span> 11:00 AM - 5:00 PM
                </p>
                <p className="mb-6">
                  <span className="font-medium">Sunday:</span> 12:00 PM - 4:00 PM
                </p>

                <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  <p>+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  <p>info@artgallery.com</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <p>
                    123 Gallery Street
                    <br />
                    New York, NY 10001
                  </p>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=600&width=600"
                  alt="Gallery map"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="mission" className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-bold mb-4">Our Mission & Values</h3>
            <p className="mb-4">
              At ArtGallery, our mission is to discover, promote, and celebrate exceptional contemporary art from around
              the world. We believe in the power of art to inspire dialogue, challenge perspectives, and enrich lives.
            </p>
            <h4 className="font-semibold mb-2">Our Core Values:</h4>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <span className="font-medium">Artistic Excellence</span> - We are committed to showcasing the highest
                quality of contemporary art.
              </li>
              <li>
                <span className="font-medium">Inclusivity</span> - We strive to make art accessible to diverse audiences
                and represent artists from varied backgrounds.
              </li>
              <li>
                <span className="font-medium">Education</span> - We believe in the importance of art education and offer
                programs to engage visitors of all ages.
              </li>
              <li>
                <span className="font-medium">Community</span> - We foster connections between artists, collectors, and
                art enthusiasts.
              </li>
              <li>
                <span className="font-medium">Innovation</span> - We embrace new ideas, technologies, and approaches in
                the art world.
              </li>
            </ul>
            <p>
              Through our exhibitions, educational programs, and community events, we aim to create meaningful
              experiences that connect people with art and with each other.
            </p>
          </TabsContent>
          <TabsContent value="faq" className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-bold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Do I need to purchase tickets in advance?</h4>
                <p className="text-muted-foreground">
                  General admission to the gallery is free. Special exhibitions may require tickets, which can be
                  purchased online or at the front desk.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Is photography allowed in the gallery?</h4>
                <p className="text-muted-foreground">
                  Non-flash photography is permitted in most areas for personal use. Some special exhibitions may have
                  restrictions. Please check with our staff.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Do you offer guided tours?</h4>
                <p className="text-muted-foreground">
                  Yes, we offer guided tours on Saturdays at 2:00 PM or by appointment for groups of 5 or more.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">How can I purchase artwork?</h4>
                <p className="text-muted-foreground">
                  All displayed works are available for purchase unless otherwise noted. Please speak with our gallery
                  staff who can assist you with the purchasing process.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Is the gallery accessible?</h4>
                <p className="text-muted-foreground">
                  Yes, our gallery is fully accessible with ramps, elevators, and accessible restrooms.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Can I submit my artwork for consideration?</h4>
                <p className="text-muted-foreground">
                  We review artist submissions twice a year. Please check our "Artists" page for submission guidelines
                  and deadlines.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Contact Form */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
        <div className="bg-muted rounded-lg p-6">
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Subject
              </label>
              <input
                id="subject"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Subject"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your message"
              />
            </div>
            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </main>
  )
}
