import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">ArtGallery</span>
        </Link>
        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm">
          <Link href="/" className="transition-colors hover:text-foreground/80">
            Home
          </Link>
          <Link href="/gallery" className="transition-colors hover:text-foreground/80">
            Gallery
          </Link>
          <Link href="/artists" className="transition-colors hover:text-foreground/80">
            Artists
          </Link>
          <Link href="/exhibitions" className="transition-colors hover:text-foreground/80">
            Exhibitions
          </Link>
          <Link href="/about" className="transition-colors hover:text-foreground/80">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" size="sm" className="hidden md:flex">
            Sign In
          </Button>
          <Button size="sm" className="hidden md:flex">
            Sign Up
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="hover:text-foreground/80">
                  Home
                </Link>
                <Link href="/gallery" className="hover:text-foreground/80">
                  Gallery
                </Link>
                <Link href="/artists" className="hover:text-foreground/80">
                  Artists
                </Link>
                <Link href="/exhibitions" className="hover:text-foreground/80">
                  Exhibitions
                </Link>
                <Link href="/about" className="hover:text-foreground/80">
                  About
                </Link>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="outline">Sign In</Button>
                  <Button>Sign Up</Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
