'use client';

import React, { useState } from 'react';
import { Listing, BookingRequest } from '@/types';
import { 
  Warehouse, 
  Truck, 
  MapPin, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  DollarSign, 
  Layers, 
  Calendar, 
  User, 
  Trash2, 
  Power,
  PackageCheck
} from 'lucide-react';

interface ProviderDashboardProps {
  listings: Listing[];
  bookingRequests: BookingRequest[];
  onOpenAddModal: () => void;
  onToggleListingStatus: (id: string) => void;
  onDeleteListing: (id: string) => void;
  onUpdateBookingStatus: (requestId: string, newStatus: 'approved' | 'declined') => void;
  onQuickAddListing: (newListing: Listing) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  listings,
  bookingRequests,
  onOpenAddModal,
  onToggleListingStatus,
  onDeleteListing,
  onUpdateBookingStatus,
  onQuickAddListing,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'requests'>('listings');
  const [showQuickAdd, setShowQuickAdd] = useState<boolean>(false);

  // Quick form state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickType, setQuickType] = useState<'warehouse' | 'truck'>('warehouse');
  const [quickLocation, setQuickLocation] = useState('');
  const [quickPrice, setQuickPrice] = useState<number>(180);
  const [quickCapacity, setQuickCapacity] = useState<number>(150);
  const [quickUnit, setQuickUnit] = useState<'pallets' | 'sq ft' | 'lbs'>('pallets');

  const pendingRequests = bookingRequests.filter((r) => r.status === 'pending');
  const approvedRequests = bookingRequests.filter((r) => r.status === 'approved');

  // Metrics calculation
  const totalDailyRevenue = listings.reduce((acc, curr) => acc + (curr.status === 'active' ? curr.pricePerDay : 0), 0);
  const totalApprovedEarnings = approvedRequests.reduce((acc, curr) => acc + curr.totalPrice, 0);

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cityCandidate = quickLocation.includes(',') ? quickLocation.split(',')[0].trim() + ', ' + quickLocation.split(',')[1].trim().slice(0, 2).toUpperCase() : 'Chicago, IL';

    const newListing: Listing = {
      id: `cs-prov-${Date.now().toString().slice(-4)}`,
      title: quickTitle || (quickType === 'warehouse' ? 'Flexible Storage Hub' : 'Regional Freight Haul'),
      type: quickType,
      subtype: quickType === 'warehouse' ? 'Pallet Racking' : 'Dry Van (53ft)',
      location: quickLocation || 'Greater Chicago Distribution Zone',
      city: cityCandidate,
      pricePerDay: Number(quickPrice) || 150,
      totalCapacity: Number(quickCapacity) || 100,
      availableCapacity: Number(quickCapacity) || 100,
      capacityUnit: quickUnit,
      providerName: 'My Logistics Ops (You)',
      providerRating: 5.0,
      providerVerified: true,
      minDurationDays: 2,
      availableFrom: 'Immediate',
      features: ['24/7 Security CCTV', 'Forklift Onsite'],
      description: 'Newly listed capacity ready for verified logistics partners.',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onQuickAddListing(newListing);
    setQuickTitle('');
    setQuickLocation('');
    setShowQuickAdd(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Welcome & KPI Metrics */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                Provider Hub
              </span>
              <span className="text-xs text-slate-500">Fleet & Storage Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Provider Asset Control
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Manage your active warehouse square footage, freight lanes, and incoming booking requests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              id="provider-quick-form-toggle"
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>{showQuickAdd ? 'Hide Quick Form' : 'Quick Add Bar'}</span>
            </button>

            <button
              type="button"
              id="provider-add-full-listing-btn"
              onClick={onOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List New Asset</span>
            </button>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Active Listings</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">{listings.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">
              {listings.filter(l => l.type === 'warehouse').length} Warehouses • {listings.filter(l => l.type === 'truck').length} Trucks
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Pending Requests</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">
              {pendingRequests.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Requires your approval</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Confirmed Bookings</span>
              <PackageCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {approvedRequests.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Fulfillment underway</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold">Confirmed Payouts</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              ${totalApprovedEarnings.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              +${totalDailyRevenue}/day potential
            </p>
          </div>

        </div>
      </div>

      {/* Quick Add Inline Form (Collapsible) */}
      {showQuickAdd && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-indigo-700" />
              <h3 className="text-sm font-bold text-indigo-950">Quick Space Publisher</h3>
            </div>
            <span className="text-xs text-indigo-600 font-medium">Simple 1-step add</span>
          </div>

          <form onSubmit={handleQuickAddSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="lg:col-span-2">
              <label htmlFor="quick-title" className="block text-[11px] font-semibold text-slate-700 mb-1">
                Asset Title
              </label>
              <input
                id="quick-title"
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="e.g. O'Hare Bay Racks 1-5"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="quick-type" className="block text-[11px] font-semibold text-slate-700 mb-1">
                Type
              </label>
              <select
                id="quick-type"
                value={quickType}
                onChange={(e) => {
                  const val = e.target.value as 'warehouse' | 'truck';
                  setQuickType(val);
                  setQuickUnit(val === 'warehouse' ? 'pallets' : 'lbs');
                }}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="warehouse">Warehouse</option>
                <option value="truck">Truck Capacity</option>
              </select>
            </div>

            <div>
              <label htmlFor="quick-location" className="block text-[11px] font-semibold text-slate-700 mb-1">
                City / Location
              </label>
              <input
                id="quick-location"
                type="text"
                required
                value={quickLocation}
                onChange={(e) => setQuickLocation(e.target.value)}
                placeholder="e.g. Dallas, TX"
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="quick-price" className="block text-[11px] font-semibold text-slate-700 mb-1">
                Price/Day ($)
              </label>
              <input
                id="quick-price"
                type="number"
                min="10"
                required
                value={quickPrice}
                onChange={(e) => setQuickPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label htmlFor="quick-cap" className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Capacity ({quickUnit})
                </label>
                <input
                  id="quick-cap"
                  type="number"
                  min="1"
                  required
                  value={quickCapacity}
                  onChange={(e) => setQuickCapacity(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                id="quick-add-submit-btn"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition shadow-xs cursor-pointer h-8 shrink-0"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Switcher: Active Listings vs Booking Requests */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Navigation Tabs Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="provider-tab-listings"
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'listings'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Active Assets & Listings</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">
                {listings.length}
              </span>
            </button>

            <button
              type="button"
              id="provider-tab-requests"
              onClick={() => setActiveTab('requests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                activeTab === 'requests'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Booking Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                pendingRequests.length > 0 ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {bookingRequests.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500">
            {activeTab === 'listings' ? 'Real-time sync with Seeker Marketplace' : 'Reservations pending review'}
          </div>
        </div>

        {/* TAB 1: Active Listings Table */}
        {activeTab === 'listings' && (
          <div className="overflow-x-auto">
            {listings.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Asset / Space</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Available Capacity</th>
                    <th className="py-3 px-4">Price / Day</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {listings.map((item) => {
                    const isWarehouse = item.type === 'warehouse';
                    const capPercent = Math.round((item.availableCapacity / item.totalCapacity) * 100);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Title & Classification */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl shrink-0 ${
                              isWarehouse ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                              {isWarehouse ? <Warehouse className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm line-clamp-1">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                <span className="font-medium text-slate-700">{item.subtype}</span>
                                <span>•</span>
                                <span>Min {item.minDurationDays}d</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 text-slate-600">
                          <div className="flex items-center gap-1.5 text-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-800 line-clamp-1">{item.location}</span>
                          </div>
                        </td>

                        {/* Capacity with Mini Progress Bar */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                              <span>{item.availableCapacity.toLocaleString()}</span>
                              <span className="text-[11px] text-slate-400">/ {item.totalCapacity.toLocaleString()} {item.capacityUnit}</span>
                            </div>
                            <div className="w-28 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${capPercent > 30 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${capPercent}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className="py-4 px-4 font-bold text-slate-900">
                          ${item.pricePerDay}
                          <span className="text-[11px] font-normal text-slate-500"> /day</span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-4">
                          {item.status === 'active' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              Active
                            </span>
                          ) : item.status === 'paused' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                              Paused
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                              Booked Out
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => onToggleListingStatus(item.id)}
                              title={item.status === 'active' ? 'Pause Listing' : 'Activate Listing'}
                              className={`p-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                item.status === 'active'
                                  ? 'border-slate-200 hover:bg-amber-50 hover:text-amber-700 text-slate-500'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteListing(item.id)}
                              title="Delete Listing"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-slate-500">
                <Layers className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-sm">No active listings yet</p>
                <p className="text-xs text-slate-400 mt-1">Use &quot;List New Asset&quot; to publish space to the marketplace.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Booking Requests Table */}
        {activeTab === 'requests' && (
          <div className="overflow-x-auto">
            {bookingRequests.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-6">Request ID & Asset</th>
                    <th className="py-3 px-4">Seeker / Company</th>
                    <th className="py-3 px-4">Reserved Space</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-6 text-right">Decision</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookingRequests.map((req) => {
                    const isWarehouse = req.listingType === 'warehouse';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Request ID & Asset */}
                        <td className="py-4 px-6">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                                {req.id}
                              </span>
                              <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                                isWarehouse ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                {isWarehouse ? 'Warehouse' : 'Truck'}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-sm line-clamp-1 max-w-[200px]">
                              {req.listingTitle}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span className="truncate max-w-[180px]">{req.location}</span>
                            </div>
                          </div>
                        </td>

                        {/* Seeker / Company */}
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900 text-xs">
                            {req.seekerCompany}
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>{req.seekerName}</span>
                          </div>
                          <div className="text-slate-400 text-[10px] font-mono">
                            {req.seekerContact}
                          </div>
                        </td>

                        {/* Requested Capacity & Cargo */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 text-xs">
                            {req.requestedCapacity.toLocaleString()} {req.capacityUnit}
                          </div>
                          <div className="text-[11px] text-slate-500 line-clamp-1 max-w-[160px] mt-0.5" title={req.cargoType}>
                            {req.cargoType}
                          </div>
                        </td>

                        {/* Dates */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800 text-xs flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.startDate}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {req.durationDays} {req.durationDays === 1 ? 'day' : 'days'}
                          </div>
                        </td>

                        {/* Payout */}
                        <td className="py-4 px-4">
                          <div className="font-extrabold text-slate-900 text-sm">
                            ${req.totalPrice.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            Escrow Ready
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {req.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-500" />
                              Pending Review
                            </span>
                          )}
                          {req.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          )}
                          {req.status === 'declined' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-500" />
                              Declined
                            </span>
                          )}
                        </td>

                        {/* Action Decision Buttons */}
                        <td className="py-4 px-6 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                id={`approve-req-${req.id}`}
                                onClick={() => onUpdateBookingStatus(req.id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Accept</span>
                              </button>

                              <button
                                type="button"
                                id={`decline-req-${req.id}`}
                                onClick={() => onUpdateBookingStatus(req.id, 'declined')}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                              >
                                <span>Decline</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Decision recorded</span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="p-10 text-center text-slate-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="font-semibold text-sm">No incoming booking requests</p>
                <p className="text-xs text-slate-400 mt-1">When seekers book your warehouse space or truck capacity, requests will populate here.</p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
