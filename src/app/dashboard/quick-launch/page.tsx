"use client";

import Link from "next/link";

const actions = [
  { icon: "🗺️", label: "Optimize Today's Route", desc: "Get the most efficient stop order for today", href: "/dashboard/route-optimizer", color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100" },
  { icon: "📍", label: "Generate Leads", desc: "Find new customers near your routes", href: "/dashboard/lead-response", color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
  { icon: "⭐", label: "Send Review Requests", desc: "Request reviews from recent clients", href: "/dashboard/reviews", color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
  { icon: "📱", label: "Build an Ad", desc: "Create a Facebook or Google ad", href: "/dashboard/campaigns", color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
  { icon: "💰", label: "Create a Quote", desc: "Generate a pricing quote for a prospect", href: "/dashboard/quotes", color: "bg-green-50 border-green-200 hover:bg-green-100" },
  { icon: "📅", label: "Schedule a Post", desc: "Plan your next social media post", href: "/dashboard/post-scheduler", color: "bg-pink-50 border-pink-200 hover:bg-pink-100" },
  { icon: "🏆", label: "View Missions", desc: "Check your AI coaching missions", href: "/dashboard/missions", color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
  { icon: "🔍", label: "Check Competitors", desc: "See what competitors are doing", href: "/dashboard/competitors", color: "bg-red-50 border-red-200 hover:bg-red-100" },
];

export default function QuickLaunchPage() {
  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Quick Launch</h1>
        <p className="text-gray-500 text-sm">Jump to any action in one click.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className={`flex items-center gap-4 p-5 rounded-xl border transition-all hover:shadow-sm ${action.color}`}
          >
            <span className="text-3xl">{action.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{action.label}</h3>
              <p className="text-sm text-gray-500">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
