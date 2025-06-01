"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
  fullScreen?: boolean
  variant?: "default" | "primary" | "secondary"
}

export default function LoadingSpinner({
  size = 24,
  className = "",
  text,
  fullScreen = false,
  variant = "default"
}: LoadingSpinnerProps) {
  const variantClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    secondary: "text-secondary"
  }

  const spinner = (
    <div className={cn(
      "flex items-center justify-center",
      fullScreen ? "fixed inset-0 bg-background/80 backdrop-blur-sm z-50" : "min-h-[400px]",
      className
    )}>
      <div className="flex flex-col items-center gap-4">
        <Loader2 
          className={cn(
            "animate-spin",
            variantClasses[variant]
          )} 
          size={size} 
        />
        {text && (
          <p className={cn(
            "text-sm animate-pulse",
            variantClasses[variant]
          )}>
            {text}
          </p>
        )}
      </div>
    </div>
  )

  return spinner
} 