'use client';

import React, { useState } from 'react';
import { Role, Listing, BookingRequest } from '@/types';
import { INITIAL_LISTINGS, INITIAL_BOOKING_REQUESTS } from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { SeekerDashboard } from '@/components/SeekerDashboard';
import { ProviderDashboard } from '@/components/ProviderDashboard';
import { BookSpaceModal } from '@/components/BookSpaceModal';
import { AddListingModal } from '@/components/AddListingModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { 
  ShieldCheck, 
  Zap, 
  Lock
} from 'lucide-react';

export default function CargoShareApp() {
  const [role, setRole] = useState<Role>('seeker');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>(INITIAL_BOOKING_REQUESTS);
  
  // Modals
  const [selectedListingForBooking, setSelectedListingForBooking] = useState<Listing | null>(null);
  const [isAddListingModalOpen, setIsAddListingModalOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Switch role with feedback
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    addToast(
      'info',
      newRole === 'seeker' ? 'Switched to Seeker Mode' : 'Switched to Provider Mode',
      newRole === 'seeker' ? 'Browse warehouses and truckload capacity' : 'Manage your facilities, fleet, and booking approvals'
    );
  };

  // Open booking modal
  const handleOpenBooking = (listing: Listing) => {
    setSelectedListingForBooking(listing);
  };

  // Confirm booking reservation
  const handleConfirmBooking = (newBooking: BookingRequest, updatedListing: Listing) => {
    // Add to booking requests queue
    setBookingRequests((prev) => [newBooking, ...prev]);

    // Update listing capacity
    setListings((prev) =>
      prev.map((l) => (l.id === updatedListing.id ? updatedListing : l))
    );

    addToast(
      'success',
      'Reservation Request Sent!',
      `Booking ${newBooking.id} transmitted to provider (${updatedListing.availableCapacity} ${updatedListing.capacityUnit} remaining)`
    );
  };

  // Add new listing from Provider
  const handleAddListing = (newListing: Listing) => {
    setListings((prev) => [newListing, ...prev]);
    addToast(
      'success',
      'Asset Listed Successfully!',
      `"${newListing.title}" is now visible to all seekers on the marketplace.`
    );
  };

  // Toggle listing active/paused
  const handleToggleListingStatus = (id: string) => {
    setListings((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus = item.status === 'active' ? 'paused' : 'active';
          addToast(
            'info',
            nextStatus === 'active' ? 'Listing Activated' : 'Listing Paused',
            `Status updated to ${nextStatus}`
          );
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  // Delete listing
  const handleDeleteListing = (id: string) => {
    setListings((prev) => prev.filter((item) => item.id !== id));
    addToast('warning', 'Listing Removed', 'The asset was deleted from your portfolio.');
  };

  // Update booking request status (Approve or Decline)
  const handleUpdateBookingStatus = (requestId: string, newStatus: 'approved' | 'declined') => {
    setBookingRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: newStatus } : req))
    );

    addToast(
      newStatus === 'approved' ? 'success' : 'warning',
      newStatus === 'approved' ? 'Booking Approved!' : 'Booking Declined',
      `Reservation ${requestId} has been marked as ${newStatus}.`
    );
  };

  // Reset to initial mock data
  const handleResetData = () => {
    setListings(INITIAL_LISTINGS);
    setBookingRequests(INITIAL_BOOKING_REQUESTS);
    addToast('info', 'Demo Data Reset', 'Restored initial sample listings and requests.');
  };

  const pendingCount = bookingRequests.filter((r) => r.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Role Switcher Navbar */}
      <Navbar
        currentRole={role}
        onRoleChange={handleRoleChange}
        listingsCount={listings.filter((l) => l.status === 'active').length}
        pendingRequestsCount={pendingCount}
        onResetData={handleResetData}
        onOpenAddModal={() => setIsAddListingModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {role === 'seeker' ? (
          <SeekerDashboard
            listings={listings}
            onBookListing={handleOpenBooking}
            onSwitchToProvider={() => handleRoleChange('provider')}
          />
        ) : (
          <ProviderDashboard
            listings={listings}
            bookingRequests={bookingRequests}
            onOpenAddModal={() => setIsAddListingModalOpen(true)}
            onToggleListingStatus={handleToggleListingStatus}
            onDeleteListing={handleDeleteListing}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onQuickAddListing={handleAddListing}
          />
        )}
      </main>

      {/* Modals */}
      <BookSpaceModal
        listing={selectedListingForBooking}
        isOpen={Boolean(selectedListingForBooking)}
        onClose={() => setSelectedListingForBooking(null)}
        onConfirmBooking={handleConfirmBooking}
        onSwitchToProvider={() => handleRoleChange('provider')}
      />

      <AddListingModal
        isOpen={isAddListingModalOpen}
        onClose={() => setIsAddListingModalOpen(false)}
        onAddListing={handleAddListing}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              CS
            </div>
            <span className="font-bold text-slate-800">CargoShare Lite Prototype</span>
            <span className="text-slate-400">| Peer-to-Peer Logistics Marketplace</span>
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Escrow
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-600" />
              Insured Transit & Storage
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Booking API
            </span>
          </div>

          <div className="text-slate-400">
            © 2026 CargoShare Inc. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
