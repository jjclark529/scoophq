'use client'

import { useState } from 'react'
import { Rocket, ArrowRight, Check } from 'lucide-react'

const steps = ['Platform', 'Budget', 'Audience', 'Creative', 'Review']

export default function QuickLaunchPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [platform, setPlatform] = useState('')

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Rocket className="text-blue-500" /> Ad Quick Launch</h1>
        <p className="text-gray-500">Launch an Ad Campaign in less than 5 minutes!</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < currentStep ? 'bg-green-500 text-white' : i === currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i < currentStep ? <Check size={16} /> : i + 1}
            </div>
            <span className={`text-sm ${i === currentStep ? 'font-medium text-gray-900' : 'text-gray-400'}`}>{step}</span>
            {i < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {currentStep === 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose Platform</h2>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPlatform('google')} className={`p-6 rounded-xl border-2 text-left ${platform === 'google' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-2xl mb-2 block">🔍</span>
                <h3 className="font-semibold">Google Ads</h3>
                <p className="text-sm text-gray-500">Search & display ads</p>
              </button>
              <button onClick={() => setPlatform('meta')} className={`p-6 rounded-xl border-2 text-left ${platform === 'meta' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                <span className="text-2xl mb-2 block">📱</span>
                <h3 className="font-semibold">Meta Ads</h3>
                <p className="text-sm text-gray-500">Facebook & Instagram</p>
              </button>
            </div>
          </div>
        )}
        {currentStep === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Set Your Budget</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Daily Budget</label>
                <input type="text" placeholder="$25.00" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Campaign Duration</label>
                <select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option>Ongoing</option>
                  <option>7 days</option>
                  <option>14 days</option>
                  <option>30 days</option>
                </select>
              </div>
            </div>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Define Audience</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" placeholder="Tucson, AZ" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Radius</label>
                <select className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                  <option>5 miles</option>
                  <option>10 miles</option>
                  <option>25 miles</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Interests</label>
                <input type="text" placeholder="Dog owners, pet services..." className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Create Your Ad</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <input type="text" placeholder="Reliable Pet Waste Removal in Tucson" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea rows={3} placeholder="Write your ad copy..." className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
              </div>
              <button className="text-sm text-purple-600 flex items-center gap-1">✨ Let Captain Scoop write this</button>
            </div>
          </div>
        )}
        {currentStep === 4 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-lg font-semibold mb-2">Ready to Launch!</h2>
            <p className="text-gray-500 mb-4">Captain Scoop has reviewed your campaign and everything looks good.</p>
            <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">Launch Campaign</button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${currentStep === 0 ? 'invisible' : 'border border-gray-200 hover:bg-gray-50'}`}
        >
          Back
        </button>
        <button
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
        >
          {currentStep === steps.length - 1 ? 'Done' : 'Next'} <ArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}