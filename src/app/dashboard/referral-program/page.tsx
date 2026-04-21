"use client";

import { useMemo, useState } from "react";

interface ReferralLink {
  id: number;
  clientName: string;
  clientEmail: string;
  uniqueCode: string;
  sentVia: "Email" | "SMS" | "Both" | "Pending";
  sharedAt: string;
  clicks: number;
  signups: number;
  rewarded: boolean;
  rewardAmount: string;
}

interface CustomerRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  source: "Sweep&Go" | "Jobber";
  status: "Active" | "Past Due" | "Lead";
}

const links: ReferralLink[] = [
  { id: 1, clientName: "Sarah Mitchell", clientEmail: "sarah.m@email.com", uniqueCode: "REF-SARAH-7X2K", sentVia: "Email", sharedAt: "2 days ago", clicks: 12, signups: 2, rewarded: true, rewardAmount: "$25" },
  { id: 2, clientName: "James Rodriguez", clientEmail: "j.rodriguez@email.com", uniqueCode: "REF-JAMES-4P9N", sentVia: "SMS", sharedAt: "4 days ago", clicks: 7, signups: 1, rewarded: true, rewardAmount: "$25" },
  { id: 3, clientName: "Lisa Chen", clientEmail: "lisa.chen@email.com", uniqueCode: "REF-LISA-2M3R", sentVia: "Both", sharedAt: "1 week ago", clicks: 21, signups: 3, rewarded: true, rewardAmount: "$50" },
  { id: 4, clientName: "Mike Thompson", clientEmail: "mthompson@email.com", uniqueCode: "REF-MIKE-8T5W", sentVia: "Email", sharedAt: "1 week ago", clicks: 4, signups: 0, rewarded: false, rewardAmount: "" },
  { id: 5, clientName: "Amy Johnson", clientEmail: "amy.j@email.com", uniqueCode: "REF-AMY-1L9Q", sentVia: "SMS", sharedAt: "2 weeks ago", clicks: 9, signups: 1, rewarded: true, rewardAmount: "$25" },
];

const customers: CustomerRecord[] = [
  { id: 101, name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(951) 555-0142", source: "Sweep&Go", status: "Active" },
  { id: 102, name: "James Rodriguez", email: "j.rodriguez@email.com", phone: "(951) 555-0198", source: "Jobber", status: "Active" },
  { id: 103, name: "Lisa Chen", email: "lisa.chen@email.com", phone: "(951) 555-0167", source: "Sweep&Go", status: "Active" },
  { id: 104, name: "Mike Thompson", email: "mthompson@email.com", phone: "(951) 555-0133", source: "Jobber", status: "Lead" },
  { id: 105, name: "Amy Johnson", email: "amy.j@email.com", phone: "(951) 555-0155", source: "Sweep&Go", status: "Past Due" },
  { id: 106, name: "David Park", email: "d.park@email.com", phone: "(951) 555-0110", source: "Jobber", status: "Active" },
];

export default function ReferralProgramPage() {
  const [rewardAmount, setRewardAmount] = useState("$25");
  const [couponEnabled, setCouponEnabled] = useState(true);
  const [couponType, setCouponType] = useState<"percentage" | "fixed">("fixed");
  const [couponValue, setCouponValue] = useState("$25");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [sendingLink, setSendingLink] = useState<number | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [crmSource, setCrmSource] = useState<"Sweep&Go" | "Jobber">("Sweep&Go");
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(101);
  const [form, setForm] = useState({ name: "Sarah Mitchell", email: "sarah.m@email.com", phone: "(951) 555-0142", sendEmail: true, sendSms: false });
  const [shareMessage, setShareMessage] = useState("Hi! I wanted to share my referral link with you. Use it to get started, and I’ll earn a referral reward when you sign up.");

  const filteredCustomers = useMemo(() => {
    const q = customerSearch.trim().toLowerCase();
    return customers.filter((customer) => {
      const matchesSource = customer.source === crmSource;
      const matchesSearch = !q || [customer.name, customer.email, customer.phone].some((value) => value.toLowerCase().includes(q));
      return matchesSource && matchesSearch;
    });
  }, [crmSource, customerSearch]);

  const applyCustomer = (customerId: number) => {
    const customer = customers.find((item) => item.id === customerId);
    if (!customer) return;
    setSelectedCustomerId(customerId);
    setForm((prev) => ({ ...prev, name: customer.name, email: customer.email, phone: customer.phone }));
  };

  const handleSend = (id: number) => {
    setSendingLink(id);
    setTimeout(() => {
      setSendingLink(null);
      setShowSuccessModal(true);
    }, 1200);
  };

  const handleExport = () => {
    setExportLoading(true);
    setTimeout(() => setExportLoading(false), 1500);
  };

  const sentViaStyle = (sentVia: string) =>
    sentVia === "Both" ? "bg-purple-100 text-purple-700" : sentVia === "Email" ? "bg-blue-100 text-blue-700" : sentVia === "SMS" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
          <p className="text-gray-500 mt-1 text-sm">Send unique referral links to existing customers from your connected sales platform and track shares, clicks, signups, and rewards.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
          + New Referral Link
        </button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
        <span className="text-xl flex-shrink-0">🔗</span>
        <div>
          <p className="text-sm font-semibold text-amber-800">Brand-driven referral experience</p>
          <p className="text-xs text-amber-700 mt-0.5">Customer-facing referral pages, popups, and widgets should use the company name and branding from My Business → Branding, while the app handles referral link generation, tracking, and CRM sync behind the scenes.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Links Shared", value: "47", icon: "🔗", change: "+12 this month" },
          { label: "Total Clicks", value: "234", icon: "👆", change: "+58 this month" },
          { label: "New Signups", value: "18", icon: "🎉", change: "+6 this month" },
          { label: "Rewards Given", value: "$425", icon: "💰", change: "$25 per referral" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2"><span className="text-2xl">{stat.icon}</span></div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Reward Settings</h2>
        <div className="flex flex-wrap gap-6 items-end">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1.5">Reward per successful referral</label>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input type="text" value={rewardAmount.replace("$", "")} onChange={(e) => setRewardAmount(`$${e.target.value}`)} className="pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-sm w-24" />
              </div>
              <span className="text-xs text-gray-500">paid to referrer when referral signs up</span>
            </div>
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-200" />
          <div className="flex items-start gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">Offer coupon to new signups</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setCouponEnabled(!couponEnabled)} className={`relative w-12 h-6 rounded-full transition-colors ${couponEnabled ? "bg-emerald-500" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${couponEnabled ? "translate-x-6" : "translate-x-0.5"}`} />
                </button>
                <span className="text-xs text-gray-500">{couponEnabled ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
            {couponEnabled && (
              <div className="flex items-center gap-2">
                <select value={couponType} onChange={(e) => setCouponType(e.target.value as "percentage" | "fixed")} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs">
                  <option value="fixed">Fixed $</option>
                  <option value="percentage">Percentage %</option>
                </select>
                <input type="text" value={couponValue} onChange={(e) => setCouponValue(e.target.value)} className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs w-20" />
              </div>
            )}
          </div>
          <div className="hidden md:block h-8 w-px bg-gray-200" />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />Sweep&amp;Go sync ready</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />Jobber sync ready</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />WordPress sync ready</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Referral Links</h2>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            {exportLoading ? <span className="animate-pulse">Exporting…</span> : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>Export to Excel</>}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                {["Client", "Referral Code", "Sent Via", "Shared", "Clicks", "Signups", "Reward", "Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase whitespace-nowrap">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><p className="text-sm font-medium text-gray-900">{link.clientName}</p><p className="text-xs text-gray-400">{link.clientEmail}</p></td>
                  <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">{link.uniqueCode}</code></td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium px-2 py-1 rounded-full ${sentViaStyle(link.sentVia)}`}>{link.sentVia}</span></td>
                  <td className="px-4 py-3"><p className="text-sm text-gray-700">{link.sharedAt}</p></td>
                  <td className="px-4 py-3"><span className="text-sm font-semibold text-gray-900">{link.clicks}</span></td>
                  <td className="px-4 py-3"><span className={`text-sm font-semibold ${link.signups > 0 ? "text-emerald-600" : "text-gray-400"}`}>{link.signups}</span></td>
                  <td className="px-4 py-3">{link.rewarded ? <span className="text-xs font-semibold text-emerald-600">{link.rewardAmount} ✓</span> : <span className="text-xs text-gray-400">—</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleSend(link.id)} disabled={sendingLink === link.id} className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium">{sendingLink === link.id ? "Sending…" : "Resend"}</button>
                      <button className="text-xs px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors font-medium">Copy Link</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { step: "1", title: "Pick a customer from your CRM", desc: "Search or choose an existing customer from the connected Sweep&Go or Jobber account before generating their referral link.", icon: "👥" },
          { step: "2", title: "Send via email or SMS", desc: "Deliver the referral link through the channel your customer prefers, using the contact info pulled from your sales platform.", icon: "📨" },
          { step: "3", title: "Track and sync automatically", desc: "Clicks, signups, rewards, and customer enrollment stay in the app and can sync into Sweep&Go, Jobber, and WordPress while the customer only sees your business branding.", icon: "📊" },
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

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 my-6 max-h-[calc(100vh-3rem)] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">New Referral Link</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Connected Sales Platform</label>
                <select value={crmSource} onChange={(e) => { const source = e.target.value as "Sweep&Go" | "Jobber"; setCrmSource(source); setCustomerSearch(""); const first = customers.find((c) => c.source === source); if (first) applyCustomer(first.id); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option>Sweep&Go</option>
                  <option>Jobber</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Choose which connected platform to load customers from.</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Search Current Customers</label>
                <input value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="Search by name, email, or phone" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                <p className="text-[11px] text-gray-400 mt-1">Results are filtered from your selected CRM connection.</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Choose Customer</label>
              <select value={selectedCustomerId} onChange={(e) => applyCustomer(Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {filteredCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name} — {customer.email} — {customer.source}</option>
                ))}
              </select>
            </div>

            {filteredCustomers.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-gray-900">Selected Customer</p>
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">{customers.find((c) => c.id === selectedCustomerId)?.source}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                  <div><span className="text-gray-400 block text-xs">Name</span>{form.name}</div>
                  <div><span className="text-gray-400 block text-xs">Email</span>{form.email}</div>
                  <div><span className="text-gray-400 block text-xs">Phone</span>{form.phone}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">Send Via</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={form.sendEmail} onChange={(e) => setForm({ ...form, sendEmail: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600" />📧 Email</label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"><input type="checkbox" checked={form.sendSms} onChange={(e) => setForm({ ...form, sendSms: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-blue-600" />💬 SMS</label>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Message to Send</label>
              <textarea value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <p className="text-[11px] text-gray-400 mt-1">This message will be included with the client&apos;s custom referral link when sent by email and/or text.</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShowCreateModal(false); setShowSuccessModal(true); }} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">Generate &amp; Send Link</button>
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4">
            <div className="text-5xl">🎉</div>
            <h2 className="text-lg font-bold text-gray-900">Referral Link Sent!</h2>
            <p className="text-sm text-gray-500">The referral link has been created in the app and sent to the selected customer using your business-branded referral experience and the selected delivery channels.</p>
            <button onClick={() => setShowSuccessModal(false)} className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
