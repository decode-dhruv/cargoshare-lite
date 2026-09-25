'use client';

import React, { useState } from 'react';
import { Listing, ListingType, WarehouseSubtype, TruckSubtype } from '@/types';
import { 
  X, 
  Warehouse, 
  Truck, 
  MapPin, 
  Plus, 
  Check
} from 'lucide-react';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (newListing: Listing) => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  // Call all hooks at top of component before any condition
  const [type, setType] = useState<ListingType>('warehouse');
  const [title, setTitle] = useState('');
  const [subtype, setSubtype] = useState<string>('Pallet Racking');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Chicago, IL');
  const [pricePerDay, setPricePerDay] = useState<number>(200);
  const [availableCapacity, setAvailableCapacity] = useState<number>(200);
  const [totalCapacity, setTotalCapacity] = useState<number>(200);
  const [capacityUnit, setCapacityUnit] = useState<'pallets' | 'sq ft' | 'lbs' | 'tons'>('pallets');
  const [minDurationDays, setMinDurationDays] = useState<number>(3);
  const [availableFrom, setAvailableFrom] = useState('Immediate');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'Forklift Onsite',
    '24/7 Security CCTV',
  ]);
  const [description, setDescription] = useState('');

  // Early return after hooks
  if (!isOpen) return null;

  const warehouseSubtypes: WarehouseSubtype[] = [
    'Pallet Racking',
    'Bulk Floor Space',
    'Cold Storage',
    'Bonded / Secure',
    'Cross-Dock',
  ];

  const truckSubtypes: TruckSubtype[] = [
    'Dry Van (53ft)',
    'Reefer (Temperature Controlled)',
    'Flatbed Trailer',
    'Box Truck (26ft)',
    'Sprinter Cargo Van',
  ];

  const featureOptions = type === 'warehouse' ? [
    '24/7 Security CCTV',
    'Dock-High Loading Doors',
    'Forklift Onsite',
    'Climate Controlled',
    'Sprinkler System',
    'Cross-Docking',
    'Hazmat Certified',
    'Inventory Barcode API'
  ] : [
    'Liftgate Equipped',
    'GPS Real-time Tracking',
    'Air-Ride Suspension',
    'Team Drivers (Expedited)',
    'E-Track Tie Downs',
    '-20°F to 70°F Multi-Temp',
    'Hazmat Endorsed',
    'Pallet Jack Onboard'
  ];

  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const handleTypeChange = (newType: ListingType) => {
    setType(newType);
    if (newType === 'warehouse') {
      setSubtype('Pallet Racking');
      setCapacityUnit('pallets');
      setSelectedFeatures(['Forklift Onsite', '24/7 Security CCTV']);
    } else {
      setSubtype('Dry Van (53ft)');
      setCapacityUnit('lbs');
      setSelectedFeatures(['GPS Real-time Tracking', 'Liftgate Equipped']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `cs-${type === 'warehouse' ? 'wh' : 'tr'}-${Math.floor(100 + Math.random() * 900)}`;

    const newListing: Listing = {
      id: newId,
      title: title || (type === 'warehouse' ? `${city} Logistics Storage Bay` : `${location || city} Capacity Run`),
      type,
      subtype: subtype as WarehouseSubtype | TruckSubtype,
      location: location || `${city} Distribution Corridor`,
      city: city || 'Chicago, IL',
      pricePerDay: Number(pricePerDay) || 150,
      totalCapacity: Number(totalCapacity) || Number(availableCapacity) || 100,
      availableCapacity: Number(availableCapacity) || 100,
      capacityUnit,
      providerName: 'My Logistics Ops (You)',
      providerRating: 5.0,
      providerVerified: true,
      minDurationDays: Number(minDurationDays) || 1,
      availableFrom: availableFrom || 'Immediate',
      features: selectedFeatures.length > 0 ? selectedFeatures : ['Standard Access'],
      description: description || `Verified ${type} asset available for peer-to-peer sharing. Direct commercial contract and insured operations.`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">List Logistics Asset</h2>
              <p className="text-xs text-slate-500">Monetize idle warehouse racks or return-trip truck capacity</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Asset Type Selector Pill */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Asset Classification
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-type-warehouse-btn"
                onClick={() => handleTypeChange('warehouse')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  type === 'warehouse'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Warehouse className="w-4 h-4 text-blue-600" />
                <span>Warehouse Space</span>
              </button>

              <button
                type="button"
                id="select-type-truck-btn"
                onClick={() => handleTypeChange('truck')}
                className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  type === 'truck'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-700 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Truck Capacity</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="listing-title" className="block text-xs font-semibold text-slate-700 mb-1">
              Listing Title
            </label>
            <input
              id="listing-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'warehouse' ? 'e.g. O’Hare Logistics High-Cube Bays (A1-A4)' : 'e.g. 53ft Dry Van Expedited (Chicago ➔ Dallas)'}
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Subtype & Hub City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="listing-subtype" className="block text-xs font-semibold text-slate-700 mb-1">
                Sub-Type / Configuration
              </label>
              <select
                id="listing-subtype"
                value={subtype}
                onChange={(e) => setSubtype(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {(type === 'warehouse' ? warehouseSubtypes : truckSubtypes).map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="listing-city" className="block text-xs font-semibold text-slate-700 mb-1">
                Metro Hub Region
              </label>
              <select
                id="listing-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                <option value="Chicago, IL">Chicago, IL</option>
                <option value="Dallas, TX">Dallas, TX</option>
                <option value="Ontario, CA">Ontario, CA</option>
                <option value="Atlanta, GA">Atlanta, GA</option>
                <option value="Newark, NJ">Newark, NJ</option>
              </select>
            </div>
          </div>

          {/* Exact Location / Route */}
          <div>
            <label htmlFor="listing-location" className="block text-xs font-semibold text-slate-700 mb-1">
              Exact Address or Highway Transit Route
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="listing-location"
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={type === 'warehouse' ? 'e.g. 1420 Busse Rd, Elk Grove Village, IL' : 'e.g. I-55 South: Chicago, IL ➔ St. Louis ➔ Dallas, TX'}
                className="w-full pl-9 pr-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Pricing & Capacities */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="listing-price" className="block text-xs font-semibold text-slate-700 mb-1">
                Price Per Day ($)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
                <input
                  id="listing-price"
                  type="number"
                  min="10"
                  required
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label htmlFor="listing-capacity" className="block text-xs font-semibold text-slate-700 mb-1">
                Available Capacity
              </label>
              <input
                id="listing-capacity"
                type="number"
                min="1"
                required
                value={availableCapacity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAvailableCapacity(val);
                  if (val > totalCapacity) setTotalCapacity(val);
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="listing-unit" className="block text-xs font-semibold text-slate-700 mb-1">
                Capacity Unit
              </label>
              <select
                id="listing-unit"
                value={capacityUnit}
                onChange={(e) => setCapacityUnit(e.target.value as 'pallets' | 'sq ft' | 'lbs' | 'tons')}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              >
                {type === 'warehouse' ? (
                  <>
                    <option value="pallets">pallets</option>
                    <option value="sq ft">sq ft</option>
                  </>
                ) : (
                  <>
                    <option value="lbs">lbs (weight)</option>
                    <option value="pallets">pallet spots</option>
                    <option value="tons">tons</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Minimum duration & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="listing-min-days" className="block text-xs font-semibold text-slate-700 mb-1">
                Minimum Rental Duration (Days)
              </label>
              <input
                id="listing-min-days"
                type="number"
                min="1"
                max="90"
                value={minDurationDays}
                onChange={(e) => setMinDurationDays(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="listing-avail-from" className="block text-xs font-semibold text-slate-700 mb-1">
                Availability Timing
              </label>
              <input
                id="listing-avail-from"
                type="text"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                placeholder="e.g. Immediate, Tomorrow, Next Monday"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Amenities / Features Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Included Features & Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {featureOptions.map((feat) => {
                const isSelected = selectedFeatures.includes(feat);
                return (
                  <button
                    key={feat}
                    type="button"
                    onClick={() => toggleFeature(feat)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-600" />}
                    <span>{feat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="listing-desc" className="block text-xs font-semibold text-slate-700 mb-1">
              Facility or Route Notes
            </label>
            <textarea
              id="listing-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail dock access, operating hours, lift heights, or specific route waypoints..."
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              id="submit-new-listing-btn"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Listing</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
