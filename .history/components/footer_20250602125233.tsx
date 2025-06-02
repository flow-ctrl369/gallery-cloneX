'use client';

import Link from "next/link"
import Logo from "@/components/logo"
import { Instagram, Twitter, Facebook } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface MessageType {
  type: 'success' | 'error';
  text: string;
}

export default function Footer() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<MessageType | null>(null)

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      })

      if (response.ok) {
        setMessage({ type: "success", text: "Subscription successful!" })
        setEmail("")
      } else {
        setMessage({ type: "error", text: "Subscription failed. Please try again later." })
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred. Please try again later." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="border-t">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="">
            <Logo variant="minimal" className="mb-4" />
            <p className="text-muted-foreground mb-6 max-w-md">
              Discover extraordinary works from emerging and established artists at Abstra, your premier destination for contemporary art.
            </p>
            <div className="flex gap-6 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-6 border-t">
           <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">
               Subscribe to our newsletter for the latest updates on exhibitions and artists.
            </p>
             <form className="flex flex-col sm:flex-row gap-4 max-w-md" onSubmit={handleSubscribe}>
               <Input
                 type="email"
                 placeholder="Your email address"
                 className="flex-grow"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
               />
               <Button type="submit" disabled={loading}>
                {loading ? (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 ) : (
                  'Subscribe'
                 )}
               </Button>
             </form>
             {message && <p className={`text-sm mt-2 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message.text}</p>}
           </div>
           <div className="md:col-span-2"></div>
        </div>
        <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Abstra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
