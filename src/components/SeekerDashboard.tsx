'use client';

import React, { useState, useMemo } from 'react';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { CITIES_LIST } from '@/data/mockData';
import { 
  Search, 
  Warehouse, 
  Truck, 
  SlidersHorizontal, 
  MapPin, 
  ArrowUpDown, 
  XCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';

interface SeekerDashboardProps {
  listings: Listing[];
  onBookListing: (listing: Listing) => void;
  onSwitchToProvider: () => void;
}

export const SeekerDashboard: React.FC<SeekerDashboardProps> = ({
  listings,
  onBookListing,
  onSwitchToProvider,
}) => {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'warehouse' | 'truck'>('all');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedCapacityRange, setSelectedCapacityRange] = useState<'all' | 'small' | 'medium' | 'large'>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'capacity-desc' | 'rating-desc'>('recommended');

  // Filter listings based on active selections
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Status check (only active listings)
      if (item.status !== 'active') return false;

      // Category check
      if (selectedCategory !== 'all' && item.type !== selectedCategory) {
        return false;
      }

      // City filter
      if (selectedCity !== 'All Cities' && !item.city.toLowerCase().includes(selectedCity.toLowerCase().split(',')[0])) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesLocation = item.location.toLowerCase().includes(q);
        const matchesSubtype = item.subtype.toLowerCase().includes(q);
        const matchesProvider = item.providerName.toLowerCase().includes(q);
        const matchesFeatures = item.features.some((f) => f.toLowerCase().includes(q));
        if (!matchesTitle && !matchesLocation && !matchesSubtype && !matchesProvider && !matchesFeatures) {
          return false;
        }
      }

      // Capacity Range filter
      if (selectedCapacityRange !== 'all') {
        const cap = item.availableCapacity;
        if (selectedCapacityRange === 'small' && cap > 100) return false;
        if (selectedCapacityRange === 'medium' && (cap <= 100 || cap > 2000)) return false;
        if (selectedCapacityRange === 'large' && cap <= 2000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerDay - b.pricePerDay;
      if (sortBy === 'price-desc') return b.pricePerDay - a.pricePerDay;
      if (sortBy === 'capacity-desc') return b.availableCapacity - a.availableCapacity;
      if (sortBy === 'rating-desc') return b.providerRating - a.providerRating;
      return 0; // recommended preserves default order
    });
  }, [listings, selectedCategory, selectedCity, searchQuery, selectedCapacityRange, sortBy]);

  const warehouseCount = listings.filter((l) => l.type === 'warehouse' && l.status === 'active').length;
  const truckCount = listings.filter((l) => l.type === 'truck' && l.status === 'active').length;

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setSelectedCapacityRange('all');
    setSortBy('recommended');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedCity !== 'All Cities' || selectedCapacityRange !== 'all' || sortBy !== 'recommended';

  return (
    <div className="space-y-6">
      
      {/* Hero / Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Freight & Storage Exchange</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            Find & Share On-Demand Logistics Space
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            Reserve idle warehouse square footage and truckload capacity in real-time. Verified providers, direct pricing, zero broker markups.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Warehouse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">{warehouseCount}</span>
                <p className="text-slate-400">Warehouse Hubs</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">{truckCount}</span>
                <p className="text-slate-400">Active Freight Lanes</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white text-sm">100% Escrow</span>
                <p className="text-slate-400">Verified Contracts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Primary Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4">
        
        {/* Search Bar + Sort */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="marketplace-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, interstate route, facility name, pallet capacity, reefer..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <XCircle className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <div className="relative w-full sm:w-auto">
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recommended' | 'price-asc' | 'price-desc' | 'capacity-desc' | 'rating-desc')}
                aria-label="Sort marketplace listings"
                className="w-full sm:w-48 appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2.5 pl-3.5 pr-8 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden cursor-pointer"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="capacity-desc">Available Capacity: High</option>
                <option value="rating-desc">Provider Rating</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Tabs (Warehouse vs Truck vs All) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          
          {/* Main Category Tabs */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              type="button"
              id="category-all-tab"
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Listings ({listings.length})</span>
            </button>

            <button
              type="button"
              id="category-warehouse-tab"
              onClick={() => setSelectedCategory('warehouse')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'warehouse'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Warehouse className="w-3.5 h-3.5 text-blue-600" />
              <span>Warehouse Space ({warehouseCount})</span>
            </button>

            <button
              type="button"
              id="category-truck-tab"
              onClick={() => setSelectedCategory('truck')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'truck'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Truck Capacity ({truckCount})</span>
            </button>
          </div>

          {/* Reset Filters action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Clear all filters</span>
            </button>
          )}
        </div>

        {/* Filter Pills Section (City / Route & Capacity Size) */}
        <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          
          {/* City / Route Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="font-semibold text-slate-500 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Hubs:
            </span>
            {CITIES_LIST.map((cityName) => (
              <button
                key={cityName}
                type="button"
                onClick={() => setSelectedCity(cityName)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  selectedCity === cityName
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cityName}
              </button>
            ))}
          </div>

          {/* Capacity Size Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="font-semibold text-slate-500 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" /> Capacity:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCapacityRange('all')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCapacityRange === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setSelectedCapacityRange('small')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCapacityRange === 'small'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Small (1-100)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCapacityRange('medium')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCapacityRange === 'medium'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Medium (100-2K)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCapacityRange('large')}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                selectedCapacityRange === 'large'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Bulk / FTL (2K+)
            </button>
          </div>

        </div>

      </div>

      {/* Listings Count Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="text-sm font-semibold text-slate-700">
          Showing <span className="text-indigo-600 font-bold">{filteredListings.length}</span> available {selectedCategory === 'all' ? 'space & freight options' : selectedCategory === 'warehouse' ? 'warehouse facilities' : 'truck freight lanes'}
        </div>
        <div className="text-xs text-slate-500">
          Live instant booking enabled
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onBook={onBookListing}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base mb-1">
            No matching logistics spaces found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search terms, changing the city filter, or clearing capacity constraints.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetAllFilters}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Reset All Filters
            </button>
            <button
              type="button"
              onClick={onSwitchToProvider}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Have space to list? Switch to Provider
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
