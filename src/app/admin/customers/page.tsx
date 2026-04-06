'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, Search, MoreVertical, X, User, Package, PauseCircle, XCircle, Mail, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

type Customer = {
  id: string
  name: string
  email: string
  company: string
  plan: string
  status: 'active' | 'trial' | 'past_due' | 'cancelled' | 'paused'
  mrr: number
  joinDate: string
  paymentMethod: 'stripe' | 'paypal'
  lastPayment: string
}

const initialCustomers: Customer[] = [
  { id: 'cust_001', name: 'Jackie', email: 'info@doctordoo.com', company: 'Doctor Doo', plan: 'Pro', status: 'active', mrr: 199, joinDate: 'Jan 15, 2025', paymentMethod: 'stripe', lastPayment: 'Mar 25, 2026' },
  { id: 'cust_002', name: 'Mike Chen', email: 'mike@pawsclaws.com', company: 'Paws & Claws Cleanup', plan: 'Starter', status: 'active', mrr: 99, joinDate: 'Mar 22, 2026', paymentMethod: 'stripe', lastPayment: 'Mar 22, 2026' },
  { id: 'cust_003', name: 'Sarah Wilson', email: 'sarah@desertdogs.com', company: 'Desert Dogs AZ', plan: 'Pro', status: 'active', mrr: 199, joinDate: 'Nov 10, 2025', paymentMethod: 'paypal', lastPayment: 'Mar 10, 2026' },
  { id: 'cust_004', name: 'Tom Davis', email: 'tom@cleanyards.com', company: 'Clean Yards Co', plan: 'Enterprise', status: 'active', mrr: 299, joinDate: 'Aug 5, 2025', paymentMethod: 'stripe', lastPayment: 'Mar 5, 2026' },
  { id: 'cust_005', name: 'Lisa Rodriguez', email: 'lisa@happytails.com', company: 'Happy Tails Service', plan: 'Pro', status: 'past_due', mrr: 199, joinDate: 'Jun 20, 2025', paymentMethod: 'stripe', lastPayment: 'Feb 20, 2026' },
  { id: 'cust_006', name: 'Kevin Park', email: 'kevin@swscoopers.com', company: 'Southwest Scoopers', plan: 'Starter', status: 'trial', mrr: 0, joinDate: 'Mar 24, 2026', paymentMethod: 'stripe', lastPayment: 'N/A' },
  { id: 'cust_007', name: 'Nancy Taylor', email: 'nancy@tucsonpoop.com', company: 'Tucson Poop Patrol', plan: 'Starter', status: 'cancelled', mrr: 0, joinDate: 'Sep 1, 2025', paymentMethod: 'paypal', lastPayment: 'Mar 1, 2026' },
  { id: 'cust_008', name: 'Robert Kim', email: 'robert@azpetwaste.com', company: 'AZ Pet Waste Pro', plan: 'Pro', status: 'active', mrr: 199, joinDate: 'Dec 12, 2025', paymentMethod: 'stripe', lastPayment: 'Mar 12, 2026' },
  { id: 'cust_009', name: 'Amanda Brooks', email: 'amanda@scooptown.com', company: 'Scoop Town LLC', plan: 'Enterprise', status: 'active', mrr: 299, joinDate: 'Jul 8, 2025', paymentMethod: 'stripe', lastPayment: 'Mar 8, 2026' },
  { id: 'cust_010', name: 'Chris White', email: 'chris@dogsquad.com', company: 'Dog Squad Services', plan: 'Starter', status: 'trial', mrr: 0, joinDate: 'Mar 25, 2026', paymentMethod: 'paypal', lastPayment: 'N/A' },
]

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: 'Active', color: 'bg-green-100 text-green-700' },
  trial: { label: 'Trial', color: 'bg-blue-100 text-blue-700' },
  past_due: { label: 'Past Due', color: 'bg-red-100 text-red-700' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500' },
  paused: { label: 'Paused', color: 'bg-orange-100 text-orange-700' },
}

const planColors: Record<string, string> = {
  Starter: 'bg-blue-50 text-blue-600',
  Pro: 'bg-purple-50 text-purple-600',
  Enterprise: 'bg-amber-50 text-amber-600',
}

const planPrices: Record<string, number> = {
  Starter: 99,
  Pro: 199,
  Enterprise: 299,
}

type ModalType = 'view' | 'changePlan' | 'pause' | 'cancel' | 'email' | 'delete' | null

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [deleteConfirmName, setDeleteConfirmName] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = customers.filter(c => {
    const matchesSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.company.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openAction = (customer: Customer, modal: ModalType) => {
    setOpenDropdown(null)
    setSelectedCustomer(customer)
    setActiveModal(modal)
    if (modal === 'changePlan') setSelectedPlan(customer.plan)
    if (modal === 'email') { setEmailSubject(''); setEmailMessage('') }
    if (modal === 'delete') setDeleteConfirmName('')
  }

  const closeModal = () => {
    setActiveModal(null)
    setSelectedCustomer(null)
  }

  const handleChangePlan = () => {
    if (!selectedCustomer) return
    setCustomers(prev => prev.map(c =>
      c.id === selectedCustomer.id
        ? { ...c, plan: selectedPlan, mrr: c.status === 'trial' ? 0 : planPrices[selectedPlan] }
        : c
    ))
    setSuccessMessage(`Plan changed to ${selectedPlan} for ${selectedCustomer.name}`)
    closeModal()
  }

  const handlePause = () => {
    if (!selectedCustomer) return
    setCustomers(prev => prev.map(c =>
      c.id === selectedCustomer.id ? { ...c, status: 'paused' as const } : c
    ))
    setSuccessMessage(`Subscription paused for ${selectedCustomer.name}`)
    closeModal()
  }

  const handleCancel = () => {
    if (!selectedCustomer) return
    setCustomers(prev => prev.map(c =>
      c.id === selectedCustomer.id ? { ...c, status: 'cancelled' as const, mrr: 0 } : c
    ))
    setSuccessMessage(`Subscription cancelled for ${selectedCustomer.name}`)
    closeModal()
  }

  const handleSendEmail = () => {
    if (!selectedCustomer) return
    setSuccessMessage(`Email sent to ${selectedCustomer.email}`)
    closeModal()
  }

  const handleDelete = () => {
    if (!selectedCustomer) return
    setCustomers(prev => prev.filter(c => c.id !== selectedCustomer.id))
    setSuccessMessage(`${selectedCustomer.name}'s account has been deleted`)
    closeModal()
  }

  return (
    <div className="p-6 max-w-7xl">
      {/* Success Banner */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-in">
          <CheckCircle size={16} />
          <span className="text-sm font-medium">{successMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Users className="text-blue-500" /> Customers</h1>
          <p className="text-gray-500">Manage PoopScoop HQ subscriber accounts</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Customer</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{customers.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{customers.filter(c => c.status === 'trial').length}</p>
          <p className="text-xs text-gray-500">Trials</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{customers.filter(c => c.status === 'past_due').length}</p>
          <p className="text-xs text-gray-500">Past Due</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search customers..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="past_due">Past Due</option>
          <option value="cancelled">Cancelled</option>
          <option value="paused">Paused</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-visible">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Plan</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">MRR</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Payment</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Joined</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cust) => (
              <tr key={cust.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium">{cust.name}</p>
                  <p className="text-xs text-gray-500">{cust.company}</p>
                  <p className="text-xs text-gray-400">{cust.email}</p>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${planColors[cust.plan]}`}>{cust.plan}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[cust.status]?.color}`}>{statusConfig[cust.status]?.label}</span>
                </td>
                <td className="py-3 px-4 font-medium">{cust.mrr > 0 ? `$${cust.mrr}/mo` : '\u2014'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-0.5 rounded ${cust.paymentMethod === 'stripe' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {cust.paymentMethod === 'stripe' ? '\uD83D\uDCB3 Stripe' : '\uD83C\uDD7F\uFE0F PayPal'}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-500">{cust.joinDate}</td>
                <td className="py-3 px-4 text-right">
                  <div className="relative inline-block" ref={openDropdown === cust.id ? dropdownRef : undefined}>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === cust.id ? null : cust.id)}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openDropdown === cust.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button onClick={() => openAction(cust, 'view')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <User size={14} /> View Details
                        </button>
                        <button onClick={() => openAction(cust, 'changePlan')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <Package size={14} /> Change Plan
                        </button>
                        <button onClick={() => openAction(cust, 'pause')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <PauseCircle size={14} /> Pause Subscription
                        </button>
                        <button onClick={() => openAction(cust, 'cancel')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <XCircle size={14} /> Cancel Subscription
                        </button>
                        <button onClick={() => openAction(cust, 'email')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                          <Mail size={14} /> Send Email
                        </button>
                        <div className="border-t border-gray-200 my-1" />
                        <button onClick={() => openAction(cust, 'delete')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600">
                          <Trash2 size={14} /> Delete Account
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {activeModal === 'view' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><User size={20} className="text-blue-500" /> Customer Details</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-gray-500">Name</p><p className="font-medium">{selectedCustomer.name}</p></div>
                <div><p className="text-xs text-gray-500">Company</p><p className="font-medium">{selectedCustomer.company}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedCustomer.email}</p></div>
                <div><p className="text-xs text-gray-500">Phone</p><p className="font-medium text-gray-400">Not provided</p></div>
                <div><p className="text-xs text-gray-500">Plan</p><p><span className={`text-xs font-medium px-2 py-1 rounded-full ${planColors[selectedCustomer.plan]}`}>{selectedCustomer.plan}</span></p></div>
                <div><p className="text-xs text-gray-500">Status</p><p><span className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig[selectedCustomer.status]?.color}`}>{statusConfig[selectedCustomer.status]?.label}</span></p></div>
                <div><p className="text-xs text-gray-500">MRR</p><p className="font-medium">{selectedCustomer.mrr > 0 ? `$${selectedCustomer.mrr}/mo` : '\u2014'}</p></div>
                <div><p className="text-xs text-gray-500">Payment Method</p><p className="font-medium">{selectedCustomer.paymentMethod === 'stripe' ? '\uD83D\uDCB3 Stripe' : '\uD83C\uDD7F\uFE0F PayPal'}</p></div>
                <div><p className="text-xs text-gray-500">Join Date</p><p className="font-medium">{selectedCustomer.joinDate}</p></div>
                <div><p className="text-xs text-gray-500">Last Payment</p><p className="font-medium">{selectedCustomer.lastPayment}</p></div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Change Plan Modal */}
      {activeModal === 'changePlan' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Package size={20} className="text-blue-500" /> Change Plan</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Select a new plan for {selectedCustomer.name}</p>
            <div className="space-y-2">
              {Object.entries(planPrices).map(([plan, price]) => (
                <label key={plan} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${selectedPlan === plan ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="plan" checked={selectedPlan === plan} onChange={() => setSelectedPlan(plan)} className="text-blue-600" />
                    <span className="font-medium text-sm">{plan}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">${price}/mo</span>
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleChangePlan} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Confirm Change</button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Subscription Modal */}
      {activeModal === 'pause' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><PauseCircle size={20} className="text-orange-500" /> Pause Subscription</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-orange-700">Pause subscription for <strong>{selectedCustomer.name}</strong>? Their access will be suspended and billing will stop until reactivated.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handlePause} className="px-4 py-2 text-sm font-medium bg-orange-500 text-white rounded-lg hover:bg-orange-600">Pause</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {activeModal === 'cancel' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><XCircle size={20} className="text-red-500" /> Cancel Subscription</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">Cancel subscription for <strong>{selectedCustomer.name}</strong>? They will retain access until their current billing period ends.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Keep Active</button>
              <button onClick={handleCancel} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700">Cancel Subscription</button>
            </div>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {activeModal === 'email' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2"><Mail size={20} className="text-blue-500" /> Send Email</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">To: {selectedCustomer.email}</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subject</label>
                <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder="Enter subject..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
                <textarea value={emailMessage} onChange={(e) => setEmailMessage(e.target.value)} placeholder="Enter message..." rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleSendEmail} disabled={!emailSubject || !emailMessage} className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">Send</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {activeModal === 'delete' && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-red-200 shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 text-red-600"><AlertTriangle size={20} /> Delete Account</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">Permanently delete <strong>{selectedCustomer.name}&apos;s</strong> account? This action cannot be undone. All data will be lost.</p>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Type <strong>{selectedCustomer.name}</strong> to confirm</label>
              <input type="text" value={deleteConfirmName} onChange={(e) => setDeleteConfirmName(e.target.value)} placeholder={selectedCustomer.name} className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:outline-none focus:border-red-500" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
              <button onClick={handleDelete} disabled={deleteConfirmName !== selectedCustomer.name} className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">Delete Account</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}