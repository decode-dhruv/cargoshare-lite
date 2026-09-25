'use client';

import React from 'react';
import { Listing } from '@/types';
import { 
  Warehouse, 
  Truck, 
  MapPin, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Star,
  Layers
} from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onBook: (listing: Listing) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onBook
}) => {
  const isWarehouse = listing.type === 'warehouse';
  const capacityPercent = Math.round((listing.availableCapacity / listing.totalCapacity) * 100);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Top Banner & Badges */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {isWarehouse ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                Warehouse Space
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Truck Capacity
              </span>
            )}
            
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
              {listing.subtype}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{listing.providerRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {listing.title}
        </h3>

        {/* Location / Route */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium text-slate-700 truncate">{listing.location}</span>
        </div>

        {/* Provider info */}
        <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500">
          <span className="text-slate-400">Provider:</span>
          <span className="font-semibold text-slate-800">{listing.providerName}</span>
          {listing.providerVerified && (
            <span title="Verified CargoShare Partner">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
            </span>
          )}
        </div>
      </div>

      {/* Capacity & Availability Section */}
      <div className="px-5 py-3.5 bg-slate-50/70 border-y border-slate-100 flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Available Capacity
          </span>
          <span className="font-bold text-slate-900">
            {listing.availableCapacity.toLocaleString()} / {listing.totalCapacity.toLocaleString()} {listing.capacityUnit}
          </span>
        </div>

        {/* Capacity Progress Bar */}
        <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden mb-2">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              capacityPercent > 40 ? 'bg-emerald-500' : capacityPercent > 15 ? 'bg-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${capacityPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            Available: <strong className="text-slate-700">{listing.availableFrom}</strong>
          </span>
          <span>Min: {listing.minDurationDays} {listing.minDurationDays === 1 ? 'day' : 'days'}</span>
        </div>
      </div>

      {/* Feature tags */}
      <div className="p-5 pt-3">
        <div className="flex flex-wrap gap-1.5 mb-4 max-h-14 overflow-hidden">
          {listing.features.slice(0, 3).map((feat, idx) => (
            <span 
              key={idx} 
              className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50"
            >
              {feat}
            </span>
          ))}
          {listing.features.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
              +{listing.features.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing and Action button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-400">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">${listing.pricePerDay}</span>
              <span className="text-xs font-medium text-slate-500">/ day</span>
            </div>
          </div>

          <button
            type="button"
            id={`book-btn-${listing.id}`}
            onClick={() => onBook(listing)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer hover:translate-x-0.5"
          >
            <span>Book Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
