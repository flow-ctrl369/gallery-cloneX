"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export default function LoadingSpinner({ size = 24, className = "" }: LoadingSpinnerProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className={`animate-spin ${className}`} size={size} />
    </div>
  )
} 