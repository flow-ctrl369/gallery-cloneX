import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-bold mb-4 inline-block">
              Abstra
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Discover extraordinary works from emerging and established artists at Abstra, your premier destination for contemporary art.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Instagram
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Twitter
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                Facebook
              </Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-muted-foreground hover:text-foreground">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/exhibitions" className="text-muted-foreground hover:text-foreground">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <address className="not-italic text-muted-foreground">
              <p>123 Gallery Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-2">info@abstra.com</p>
              <p>+1 (555) 123-4567</p>
            </address>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Abstra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
