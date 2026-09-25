export type ListingType = 'warehouse' | 'truck';

export type WarehouseSubtype = 'Pallet Racking' | 'Bulk Floor Space' | 'Cold Storage' | 'Bonded / Secure' | 'Cross-Dock';
export type TruckSubtype = 'Dry Van (53ft)' | 'Reefer (Temperature Controlled)' | 'Flatbed Trailer' | 'Box Truck (26ft)' | 'Sprinter Cargo Van';

export interface Listing {
  id: string;
  title: string;
  type: ListingType;
  subtype: WarehouseSubtype | TruckSubtype;
  location: string; // e.g. "Chicago, IL" or "Chicago, IL -> Atlanta, GA"
  city: string; // primary city tag for filtering
  pricePerDay: number;
  totalCapacity: number;
  availableCapacity: number;
  capacityUnit: 'sq ft' | 'pallets' | 'lbs' | 'tons' | 'linear ft';
  providerName: string;
  providerRating: number;
  providerVerified: boolean;
  minDurationDays: number;
  availableFrom: string;
  features: string[];
  description: string;
  imageUrl?: string;
  status: 'active' | 'paused' | 'booked';
  createdAt: string;
}

export interface BookingRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  listingType: ListingType;
  location: string;
  seekerName: string;
  seekerCompany: string;
  seekerContact: string;
  requestedCapacity: number;
  capacityUnit: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  totalPrice: number;
  cargoType: string;
  specialInstructions?: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export type Role = 'seeker' | 'provider';

export interface FilterState {
  searchQuery: string;
  category: 'all' | 'warehouse' | 'truck';
  city: string;
  capacityRange: 'all' | 'small' | 'medium' | 'large';
  sortBy: 'price-asc' | 'price-desc' | 'capacity-desc' | 'rating-desc';
}
