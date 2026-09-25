'use client';

import React, { useState } from 'react';
import { Listing, BookingRequest } from '@/types';
import { 
  X, 
  Warehouse, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';

interface BookSpaceModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmBooking: (newBooking: BookingRequest, updatedListing: Listing) => void;
  onSwitchToProvider: () => void;
}

export const BookSpaceModal: React.FC<BookSpaceModalProps> = ({
  listing,
  isOpen,
  onClose,
  onConfirmBooking,
  onSwitchToProvider,
}) => {
  // Form States (must be called before any early return)
  const [requestedCapacity, setRequestedCapacity] = useState<number>(50);
  const [durationDays, setDurationDays] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [cargoType, setCargoType] = useState<string>('Standard Commercial Dry Goods');
  const [seekerName, setSeekerName] = useState<string>('Alex Morgan');
  const [seekerCompany, setSeekerCompany] = useState<string>('SwiftStream Logistics');
  const [seekerContact, setSeekerContact] = useState<string>('amorgan@swiftstream.io');
  const [specialInstructions, setSpecialInstructions] = useState<string>('Dock high loading required. Deliver during standard business hours.');

  // Flow State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookedConfirmation, setBookedConfirmation] = useState<BookingRequest | null>(null);

  // Early return after hooks
  if (!isOpen || !listing) return null;

  const isWarehouse = listing.type === 'warehouse';

  // Calculations
  const dailyBase = listing.pricePerDay;
  const subtotal = dailyBase * durationDays;
  const serviceFee = Math.round(subtotal * 0.05);
  const totalPrice = subtotal + serviceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const start = new Date(startDate || '2026-10-01');
      const end = new Date(start);
      end.setDate(start.getDate() + durationDays);
      const endDateStr = end.toISOString().split('T')[0];

      const newBooking: BookingRequest = {
        id: generatedId,
        listingId: listing.id,
        listingTitle: listing.title,
        listingType: listing.type,
        location: listing.location,
        seekerName,
        seekerCompany,
        seekerContact,
        requestedCapacity: Number(requestedCapacity),
        capacityUnit: listing.capacityUnit,
        startDate: startDate || '2026-10-01',
        endDate: endDateStr,
        durationDays: Number(durationDays),
        totalPrice,
        cargoType,
        specialInstructions,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const newAvailable = Math.max(0, listing.availableCapacity - Number(requestedCapacity));
      const updatedListing: Listing = {
        ...listing,
        availableCapacity: newAvailable,
        status: newAvailable === 0 ? 'booked' : 'active',
      };

      setIsSubmitting(false);
      setBookedConfirmation(newBooking);
      onConfirmBooking(newBooking, updatedListing);
    }, 700);
  };

  const handleClose = () => {
    setBookedConfirmation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${isWarehouse ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {isWarehouse ? <Warehouse className="w-5 h-5" /> : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {bookedConfirmation ? 'Reservation Confirmed!' : 'Reserve Logistics Space'}
              </h2>
              <p className="text-xs text-slate-500">
                {bookedConfirmation ? 'Booking is queued and verified' : `Direct from ${listing.providerName}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Success Screen */}
        {bookedConfirmation ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              Reservation ID: {bookedConfirmation.id}
            </span>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Booking Request Submitted!
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              Your request for <strong className="text-slate-800">{listing.title}</strong> has been transmitted. The provider has 24 hours to accept.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200/80 mb-6 text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Asset & Location:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[240px]">{listing.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Reserved Capacity:</span>
                <span className="font-semibold text-slate-800">
                  {bookedConfirmation.requestedCapacity.toLocaleString()} {bookedConfirmation.capacityUnit}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Dates & Duration:</span>
                <span className="font-semibold text-slate-800">
                  {bookedConfirmation.startDate} ({bookedConfirmation.durationDays} days)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/50">
                <span className="text-slate-500">Freight Type:</span>
                <span className="font-semibold text-slate-800">{bookedConfirmation.cargoType}</span>
              </div>
              <div className="flex justify-between pt-1 font-bold text-sm text-slate-900">
                <span>Total Escrow Authorization:</span>
                <span className="text-indigo-600">${bookedConfirmation.totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                id="modal-done-btn"
                onClick={handleClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition cursor-pointer"
              >
                Back to Marketplace
              </button>
              
              <button
                type="button"
                id="modal-view-provider-btn"
                onClick={() => {
                  handleClose();
                  onSwitchToProvider();
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View in Provider Requests</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6">
            
            {/* Quick Listing Recap Header */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/70 mb-5">
              <h4 className="font-bold text-slate-900 text-sm">{listing.title}</h4>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> {listing.location}
                </span>
                <span>
                  Available: <strong className="text-emerald-700">{listing.availableCapacity.toLocaleString()} {listing.capacityUnit}</strong>
                </span>
                <span>
                  Rate: <strong className="text-slate-900">${listing.pricePerDay}/day</strong>
                </span>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Capacity Requested */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <label htmlFor="reserve-capacity">
                    Space / Capacity Needed ({listing.capacityUnit})
                  </label>
                  <span className="text-indigo-600 font-bold">
                    {requestedCapacity.toLocaleString()} {listing.capacityUnit}
                  </span>
                </div>
                
                <input
                  id="reserve-capacity"
                  type="number"
                  min="1"
                  max={listing.availableCapacity}
                  value={requestedCapacity}
                  onChange={(e) => setRequestedCapacity(Math.min(listing.availableCapacity, Math.max(1, Number(e.target.value))))}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
                <input
                  type="range"
                  min="1"
                  max={listing.availableCapacity}
                  value={requestedCapacity}
                  onChange={(e) => setRequestedCapacity(Number(e.target.value))}
                  className="w-full mt-2 accent-indigo-600"
                />
              </div>

              {/* Dates & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reserve-start-date" className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id="reserve-start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reserve-duration" className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Days)
                  </label>
                  <input
                    id="reserve-duration"
                    type="number"
                    min={listing.minDurationDays || 1}
                    max={180}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(listing.minDurationDays || 1, Number(e.target.value)))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Cargo Type */}
              <div>
                <label htmlFor="reserve-cargo-type" className="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo / Commodity Description
                </label>
                <input
                  id="reserve-cargo-type"
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  placeholder="e.g. Palletized packaged goods, automotive parts, food-grade..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              {/* Seeker Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="reserve-company" className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Company Name
                  </label>
                  <input
                    id="reserve-company"
                    type="text"
                    value={seekerCompany}
                    onChange={(e) => setSeekerCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="reserve-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    id="reserve-name"
                    type="text"
                    value={seekerName}
                    onChange={(e) => setSeekerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="reserve-contact" className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email / Phone
                </label>
                <input
                  id="reserve-contact"
                  type="text"
                  value={seekerContact}
                  onChange={(e) => setSeekerContact(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  required
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label htmlFor="reserve-instructions" className="block text-xs font-semibold text-slate-700 mb-1">
                  Handling / Logistics Notes (Optional)
                </label>
                <textarea
                  id="reserve-instructions"
                  rows={2}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Forklift required for offload, specific gate access code, temperature requirements..."
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Cost Calculation Box */}
              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Base Rate (${dailyBase}/day × {durationDays} days):</span>
                  <span className="font-semibold text-slate-800">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>CargoShare Service & Escrow (5%):</span>
                  <span className="font-semibold text-slate-800">${serviceFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-indigo-200/60 text-slate-900 font-bold text-sm">
                  <span>Total Estimated Reservation:</span>
                  <span className="text-indigo-700">${totalPrice.toLocaleString()}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="submit-booking-btn"
                disabled={isSubmitting || requestedCapacity <= 0}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Reservation</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
