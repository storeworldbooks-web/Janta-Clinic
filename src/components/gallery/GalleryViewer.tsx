import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { GalleryItem } from '../../types';
import { 
  Image as ImageIcon, 
  Sparkles, 
  Plus, 
  Search, 
  Split, 
  Tag, 
  Layers, 
  CheckCircle2, 
  Camera, 
  Maximize2,
  X
} from 'lucide-react';

export const GalleryViewer: React.FC = () => {
  const { gallery, addGalleryItem } = useClinic();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [selectedModalItem, setSelectedModalItem] = useState<GalleryItem | null>(null);

  const categories = ['Clinic Photos', 'Doctors Photos', 'Treatment Photos', 'Before After Cases'];

  const filteredGallery = gallery.filter(item => 
    selectedCategory === 'all' || item.category === selectedCategory
  );

  return (
    <div className="space-y-6">

      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-teal-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Clinical Portfolio & Before/After Smile Makeovers
            </h2>
            <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
              {gallery.length} Verified Media Cases
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ultra-high-definition clinical photography, operatory suites, cosmetic smile designs and before/after comparisons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedCategory === 'all' ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
              }`}
            >
              All Assets
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  selectedCategory === cat ? 'bg-white dark:bg-slate-700 text-teal-600 dark:text-teal-300 shadow-sm font-semibold' : 'text-slate-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Interactive Before/After Case Highlight */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                Interactive Smile Makeover Compare
              </span>
              <span className="text-xs text-slate-400">Dr. LP Diwakar & Team</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Midline Diastema Closure & 6-Unit Ceramic Veneers
            </h3>
            <p className="text-xs text-slate-400">
              Drag the interactive slider below to inspect the tooth restoration, shade brightening, and enamel margin closure.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Before: Severe Spacing & Discoloration
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-teal-950/80 border border-teal-800 text-teal-300 font-bold">
              After: Flawless Bright Smile
            </span>
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="relative aspect-video max-h-[460px] w-full rounded-2xl overflow-hidden select-none border border-slate-700 shadow-2xl">
          <img
            src="/src/assets/images/dental_before_after_1793105634531.jpg"
            alt="Smile Makeover Comparison"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {/* Slider line overlay */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10 pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
              ↔
            </div>
          </div>

          {/* Range input for slider dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />
        </div>
      </div>

      {/* Grid of Gallery Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGallery.map(item => (
          <div
            key={item.id}
            onClick={() => setSelectedModalItem(item)}
            className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-teal-500/50 transition-all duration-200 shadow-sm"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-950">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs">
                <span className="flex items-center gap-1 font-semibold">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Enlarge Photo</span>
                </span>
              </div>
            </div>

            <div className="p-3 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {item.branch === 'branch-1' ? 'Raghubir' : 'Nihal Vihar'}
                </span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white truncate">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Enlarged Modal */}
      {selectedModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedModalItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 mb-4">
              <img
                src={selectedModalItem.imageUrl}
                alt={selectedModalItem.title}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedModalItem.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {selectedModalItem.caption}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedModalItem.tags.map((t, idx) => (
                <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
