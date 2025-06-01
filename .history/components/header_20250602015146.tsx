import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/logo"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Logo className="mr-6" />
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
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link href="/" className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/gallery" className="text-lg font-medium">
                  Gallery
                </Link>
                <Link href="/artists" className="text-lg font-medium">
                  Artists
                </Link>
                <Link href="/exhibitions" className="text-lg font-medium">
                  Exhibitions
                </Link>
                <Link href="/about" className="text-lg font-medium">
                  About
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
