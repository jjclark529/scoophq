'use client'

import { useState, useEffect } from 'react'
import { UserCircle, Lock, Mail, Shield, Plus, Trash2, Check, AlertCircle, Eye, EyeOff, Save, Crown, ShieldCheck, Edit3 } from 'lucide-react'

type AdminUser = {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin'
  createdAt: string
  lastLogin: string
}

const initialAdmins: AdminUser[] = [
  { id: 'admin_001', name: 'Jackie', email: 'info@doctordoo.com', role: 'owner', createdAt: 'Jan 15, 2025', lastLogin: 'Mar 27, 2026' },
]

export default function AdminProfilePage() {
  // Profile state
  const [profileName, setProfileName] = useState('Jackie')
  const [profileEmail, setProfileEmail] = useState('info@doctordoo.com')
  const [profileSaved, setProfileSaved] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSuccess, setPwSuccess] = useState(false)

  // Admin management state
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [addError, setAddError] = useState<string | null>(null)

  // Load current admin from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('scoophq_admin')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setProfileName(parsed.name)
        setProfileEmail(parsed.email)
      } catch {}
    }
  }, [])

  const handleSaveProfile = () => {
    // Update localStorage
    const stored = localStorage.getItem('scoophq_admin')
    if (stored) {
      const parsed = JSON.parse(stored)
      parsed.name = profileName
      parsed.email = profileEmail
      localStorage.setItem('scoophq_admin', JSON.stringify(parsed))
    }
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(null)
    setPwSuccess(false)

    if (currentPassword !== 'May2004Riverside4106$') {
      setPwError('Current password is incorrect')
      return
    }
    if (newPassword.length < 8) {
      setPwError('New password must be at least 8 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError('New passwords do not match')
      return
    }

    // In production: API call to update password
    setPwSuccess(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPwSuccess(false), 3000)
  }

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setAddError(null)

    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) {
      setAddError('All fields are required')
      return
    }
    if (newAdminPassword.length < 8) {
      setAddError('Password must be at least 8 characters')
      return
    }
    if (admins.some(a => a.email === newAdminEmail)) {
      setAddError('An admin with this email already exists')
      return
    }

    const newAdmin: AdminUser = {
      id: `admin_${Date.now()}`,
      name: newAdminName,
      email: newAdminEmail,
      role: 'admin',
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastLogin: 'Never',
    }
    setAdmins([...admins, newAdmin])
    setNewAdminName('')
    setNewAdminEmail('')
    setNewAdminPassword('')
    setShowAddAdmin(false)
  }

  const handleRemoveAdmin = (id: string) => {
    if (admins.find(a => a.id === id)?.role === 'owner') return
    setAdmins(admins.filter(a => a.id !== id))
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><UserCircle className="text-blue-500" /> Profile & Admin Management</h1>
        <p className="text-gray-500">Manage your profile, change your password, and add other administrators</p>
      </div>

      {/* My Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Edit3 size={18} className="text-gray-500" /> My Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Save size={16} /> Save Profile
          </button>
          {profileSaved && (
            <span className="text-sm text-green-600 flex items-center gap-1"><Check size={14} /> Profile saved!</span>
          )}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Lock size={18} className="text-gray-500" /> Change Password</h2>

        {pwError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{pwError}</p>
          </div>
        )}
        {pwSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Check size={14} className="text-green-500 flex-shrink-0" />
            <p className="text-sm text-green-700">Password changed successfully!</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative max-w-md">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showCurrentPw ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showNewPw ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  required
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          <button type="submit" className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2">
            <Lock size={16} /> Update Password
          </button>
        </form>
      </div>

      {/* Admin Management */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2"><Shield size={18} className="text-red-500" /> Admin Users</h2>
          <button
            onClick={() => setShowAddAdmin(!showAddAdmin)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
          >
            <Plus size={16} /> Add Admin
          </button>
        </div>

        {/* Add Admin Form */}
        {showAddAdmin && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-red-800 mb-3">Add New Administrator</h3>
            {addError && (
              <div className="bg-white border border-red-200 rounded-lg p-2 mb-3 flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <p className="text-xs text-red-700">{addError}</p>
              </div>
            )}
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    placeholder="jane@pooppoopscoophq.com"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Temporary Password</label>
                  <input
                    type="text"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">Create Admin</button>
                <button type="button" onClick={() => { setShowAddAdmin(false); setAddError(null) }} className="border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-white">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Admin List */}
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${admin.role === 'owner' ? 'bg-red-600' : 'bg-slate-600'}`}>
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{admin.name}</p>
                    {admin.role === 'owner' ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Crown size={10} /> Owner</span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><ShieldCheck size={10} /> Admin</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{admin.email}</p>
                  <p className="text-xs text-gray-400">Added {admin.createdAt} • Last login: {admin.lastLogin}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {admin.role !== 'owner' && (
                  <button
                    onClick={() => handleRemoveAdmin(admin.id)}
                    className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                    title="Remove admin"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            💡 The <strong>Owner</strong> account cannot be removed. Admins have full access to the backoffice but cannot remove the owner or change owner credentials.
          </p>
        </div>
      </div>
    </div>
  )
}