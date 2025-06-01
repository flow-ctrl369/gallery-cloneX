import Link from "next/link"

interface LogoProps {
  className?: string
  variant?: "default" | "minimal"
}

export default function Logo({ className = "", variant = "default" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <span className="text-3xl font-bold uppercase tracking-wider">
          {variant === "default" ? (
            "Abstra"
          ) : (
            <span className="text-primary">A</span>
          )}
        </span>
        {variant === "default" && (
          <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary via-secondary to-accent" />
        )}
      </div>
    </Link>
  )
} 