import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Image src="/logo.png" alt="PoopScoop HQ" width={450} height={450} priority className="object-contain" />
        </div>
        <p className="text-xl text-blue-200 mb-8 max-w-lg mx-auto">
          AI-powered operations platform for pet waste removal businesses.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            Sign In <ArrowRight size={18} />
          </Link>
          <Link
            href="/register"
            className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
          >
            Create Account
          </Link>
        </div>
        <div className="mt-4">
          <Link
            href="/about"
            className="text-blue-300 hover:text-white text-sm font-medium transition-colors"
          >
            What&apos;s PoopScoop HQ? →
          </Link>
        </div>
      </div>
      <div className="mt-auto pb-6 text-center text-sm text-white/50">
        © 2026 PoopScoop HQ | info@poopscoophq.com | 877.357.7474
      </div>
    </div>
  )
}