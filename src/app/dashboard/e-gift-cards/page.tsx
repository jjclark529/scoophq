"use client";

import { useMemo, useState } from "react";

const businessBrand = {
  companyName: "Doctor Doo Pet Waste Removal",
  primaryColor: "#10B981",
  secondaryColor: "#2563EB",
  headingFont: "Poppins",
  bodyFont: "Inter",
  giftCardHeadline: "Give the gift of a cleaner yard",
  giftCardSubhead: "Buy a gift card and send it instantly by email.",
  logoUrl: "/logo.png",
};

const giftCardAmounts = Array.from({ length: 20 }, (_, i) => (i + 1) * 25);

const salesPlatforms = [
  { name: "Sweep&Go", status: "Connected", color: "bg-emerald-100 text-emerald-700", detail: "Gift card redemptions create CRM-ready coupon codes for onboarding." },
  { name: "Jobber", status: "Connected", color: "bg-emerald-100 text-emerald-700", detail: "Gift cards can map to promo/coupon tracking during client enrollment." },
  { name: "WordPress", status: "Connected", color: "bg-emerald-100 text-emerald-700", detail: "Publish a hosted purchase page or embed the purchase widget on your site." },
];

const issuedCards = [
  { code: "GIFT-250-7X2K", purchaser: "Megan Hill", recipient: "Sarah Mitchell", amount: "$250", status: "Redeemed", crm: "Sweep&Go", soldAt: "Today" },
  { code: "GIFT-100-3P9N", purchaser: "Jason Reed", recipient: "James Rodriguez", amount: "$100", status: "Sent", crm: "Jobber", soldAt: "Yesterday" },
  { code: "GIFT-050-8M1R", purchaser: "Karen Lopez", recipient: "Lisa Chen", amount: "$50", status: "Viewed", crm: "Sweep&Go", soldAt: "2 days ago" },
  { code: "GIFT-300-4T5W", purchaser: "Amy Johnson", recipient: "Mike Thompson", amount: "$300", status: "Pending", crm: "Jobber", soldAt: "3 days ago" },
];

const statusStyle: Record<string, string> = {
  Redeemed: "bg-emerald-100 text-emerald-700",
  Sent: "bg-blue-100 text-blue-700",
  Viewed: "bg-amber-100 text-amber-700",
  Pending: "bg-gray-100 text-gray-600",
};

export default function EGiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [activeCrm, setActiveCrm] = useState<"Sweep&Go" | "Jobber">("Sweep&Go");
  const [showPreview, setShowPreview] = useState(false);
  const [widgetHeadline, setWidgetHeadline] = useState(businessBrand.giftCardHeadline);
  const [widgetSubhead, setWidgetSubhead] = useState(businessBrand.giftCardSubhead);
  const embedSnippet = useMemo(
    () => `<div id="poopscoop-gift-card-widget"></div>\n<script src="https://app-pi-ashy-30.vercel.app/embed/gift-cards.js" data-account="demo" data-crm="${activeCrm.toLowerCase()}" data-brand-name="${businessBrand.companyName}" data-primary-color="${businessBrand.primaryColor}" data-secondary-color="${businessBrand.secondaryColor}" data-min="25" data-max="500" data-step="25"></script>`,
    [activeCrm]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">E-Gift Card Program</h1>
          <p className="text-gray-500 mt-1 text-sm">Sell digital gift cards inside the app, then issue coupon codes for redemption in Sweep&amp;Go or Jobber when a new customer enrolls.</p>
        </div>
        <button onClick={() => setShowPreview(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">Preview Purchase Page</button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-xl">🎁</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Brand-driven gift card experience</p>
          <p className="text-xs text-amber-700 mt-0.5">The landing page, popup, and embedded widget should use the company name and branding from My Business → Branding, while PoopScoop HQ stays behind the scenes handling payment, gift card issuance, and CRM sync.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Gift Cards Sold", value: "62", icon: "🎁", change: "+14 this month" },
          { label: "Revenue Collected", value: "$7,450", icon: "💳", change: "+$1,875 this month" },
          { label: "Redeemed", value: "31", icon: "✅", change: "50% redemption rate" },
          { label: "Average Value", value: "$120", icon: "📈", change: "Most popular: $100" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2"><span className="text-2xl">{stat.icon}</span></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Program Setup</h2>
              <p className="text-xs text-gray-500 mt-1">Choose gift card values, coupon redemption behavior, and the CRM that receives the redemption code.</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">$25 increments · Max $500</span>
          </div>

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Available gift card amounts</p>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
              {giftCardAmounts.map((amount) => (
                <button key={amount} onClick={() => setSelectedAmount(amount)} className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedAmount === amount ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}>
                  ${amount}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Redemption CRM</label>
              <select value={activeCrm} onChange={(e) => setActiveCrm(e.target.value as "Sweep&Go" | "Jobber")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>Sweep&Go</option>
                <option>Jobber</option>
              </select>
              <p className="text-[11px] text-gray-400 mt-1">This is the platform where the generated coupon code will be applied during enrollment.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Coupon behavior</label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-gray-50">Generate one-time coupon code equal to gift card value</div>
              <p className="text-[11px] text-gray-400 mt-1">Example: a $100 gift card issues a one-time $100 redemption code in {activeCrm}.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {salesPlatforms.map((platform) => (
              <div key={platform.name} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">{platform.name}</p>
                  <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${platform.color}`}>{platform.status}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{platform.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">WordPress purchase page plan</h2>
            <p className="text-xs text-gray-500 mt-1">Best approach: host the checkout and code issuance in the app, then embed or link it from WordPress using your business branding.</p>
          </div>
          <div className="space-y-3 text-xs text-gray-600">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="font-semibold text-blue-800 mb-1">Recommended</p>
              <p>Use a hosted gift card checkout page and place a WordPress button or embed widget on your site. This keeps payment, coupon creation, and CRM sync centralized while the customer only sees your business brand.</p>
            </div>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="font-semibold text-gray-800 mb-1">WordPress options</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Button linking to hosted gift card checkout page</li>
                <li>Embed widget inserted into a WordPress page block</li>
                <li>Dedicated /gift-cards landing page on your site</li>
              </ul>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">Embed snippet</label>
            <textarea readOnly value={embedSnippet} className="w-full h-36 px-3 py-2 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Issued e-gift cards</h2>
          <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">Export sales</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Gift Card", "Purchaser", "Recipient", "Amount", "Status", "CRM", "Sold"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {issuedCards.map((card) => (
                <tr key={card.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{card.code}</code></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{card.purchaser}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{card.recipient}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{card.amount}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyle[card.status]}`}>{card.status}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{card.crm}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{card.soldAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { step: "1", title: "Sell inside the app", desc: "Store payment, purchaser details, recipient details, and gift card balance centrally so the program stays portable across integrations.", icon: "🛒" },
          { step: "2", title: "Generate CRM coupon code", desc: "When a gift card is purchased, automatically create a coupon or promo code for the connected Sweep&Go or Jobber enrollment workflow.", icon: "🏷️" },
          { step: "3", title: "Publish with your branding", desc: "Expose the checkout with either a hosted link or an embeddable widget on WordPress using the company name and colors from My Business → Branding.", icon: "🌐" },
        ].map((item) => (
          <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
            <div className="text-2xl flex-shrink-0">{item.icon}</div>
            <div>
              <div className="flex items-center gap-2 mb-1"><span className="w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{item.step}</span><h3 className="text-sm font-semibold text-gray-900">{item.title}</h3></div>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Gift card purchase page preview</h2>
                <p className="text-sm text-gray-500">This customer-facing layout should use your business name and branding from My Business.</p>
              </div>
              <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="p-6 text-white" style={{ background: `linear-gradient(90deg, ${businessBrand.primaryColor}, ${businessBrand.secondaryColor})` }}>
                <p className="text-xs uppercase tracking-[0.3em] opacity-80" style={{ fontFamily: businessBrand.bodyFont }}>{businessBrand.companyName}</p>
                <input value={widgetHeadline} onChange={(e) => setWidgetHeadline(e.target.value)} className="mt-2 w-full bg-transparent text-2xl font-bold outline-none placeholder:text-white/70" style={{ fontFamily: businessBrand.headingFont }} />
                <input value={widgetSubhead} onChange={(e) => setWidgetSubhead(e.target.value)} className="mt-2 w-full bg-transparent text-sm outline-none placeholder:text-white/70" style={{ fontFamily: businessBrand.bodyFont }} />
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3" style={{ fontFamily: businessBrand.headingFont }}>Choose amount</p>
                  <div className="grid grid-cols-3 gap-2">
                    {giftCardAmounts.slice(0, 9).map((amount) => (
                      <button key={amount} className={`px-3 py-2 rounded-lg text-sm border ${selectedAmount === amount ? "text-white border-transparent" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`} style={selectedAmount === amount ? { backgroundColor: businessBrand.secondaryColor } : undefined}>${amount}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <input placeholder="Purchaser name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input placeholder="Recipient email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <input placeholder="Gift message (optional)" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <button className="w-full px-4 py-2.5 text-white rounded-lg text-sm font-semibold" style={{ backgroundColor: businessBrand.secondaryColor }}>Buy ${selectedAmount} Gift Card</button>
                  <p className="text-[11px] text-gray-400">After purchase, the gift card is issued and a {activeCrm} coupon code is prepared for redemption during enrollment.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
