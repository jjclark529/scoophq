'use client'

// PoopScoop HQ logo — uses the uploaded logo image
import Image from 'next/image'

export function ScoopLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="PoopScoop HQ"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  )
}

// Simpler inline version for sidebar
export function ScoopIcon({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="PoopScoop HQ"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  )
}