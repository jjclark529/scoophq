'use client'

import Sidebar from '@/components/layout/Sidebar'
import CaptainScoop from '@/components/chat/CaptainScoop'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
      <CaptainScoop />
    </div>
  )
}