'use client'

import { useState } from 'react'
import { Upload, Image, Film, Trash2, Download, Eye } from 'lucide-react'

const assets = [
  { name: 'spring-promo-banner.jpg', type: 'image', size: '245 KB', date: 'Mar 20, 2026', dimensions: '1200x628' },
  { name: 'testimonial-video-1.mp4', type: 'video', size: '12.4 MB', date: 'Mar 18, 2026', dimensions: '1080x1920' },
  { name: 'logo-primary.png', type: 'image', size: '89 KB', date: 'Mar 15, 2026', dimensions: '500x500' },
  { name: 'service-showcase.jpg', type: 'image', size: '312 KB', date: 'Mar 14, 2026', dimensions: '1080x1080' },
  { name: 'before-after-yard.jpg', type: 'image', size: '198 KB', date: 'Mar 12, 2026', dimensions: '1200x628' },
  { name: 'team-intro-reel.mp4', type: 'video', size: '8.7 MB', date: 'Mar 10, 2026', dimensions: '1080x1920' },
]

export default function CreativePage() {
  return (
    <div className="p-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Creative Assets</h1>
          <p className="text-gray-500">Manage your ad images, videos, and creative materials</p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 mb-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-white">
        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
        <p className="font-medium text-gray-700">Drop files here or click to upload</p>
        <p className="text-sm text-gray-400 mt-1">PNG, JPG, MP4 up to 50MB</p>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
              {asset.type === 'image' ? (
                <Image className="text-gray-400" size={40} />
              ) : (
                <Film className="text-gray-400" size={40} />
              )}
            </div>
            <div className="p-3">
              <p className="font-medium text-sm text-gray-900 truncate">{asset.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-gray-500">{asset.size} • {asset.dimensions}</span>
                <span className="text-xs text-gray-400">{asset.date}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 text-xs border border-gray-200 rounded py-1.5 hover:bg-gray-50 flex items-center justify-center gap-1">
                  <Eye size={12} /> Preview
                </button>
                <button className="flex-1 text-xs border border-gray-200 rounded py-1.5 hover:bg-gray-50 flex items-center justify-center gap-1">
                  <Download size={12} /> Download
                </button>
                <button className="text-xs border border-red-200 text-red-600 rounded py-1.5 px-2 hover:bg-red-50">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}