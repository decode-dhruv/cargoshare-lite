'use client';

import React from 'react';
import { Role } from '@/types';
import { 
  Boxes, 
  Search, 
  PlusCircle, 
  RotateCcw 
} from 'lucide-react';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  listingsCount: number;
  pendingRequestsCount: number;
  onResetData: () => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  listingsCount,
  pendingRequestsCount,
  onResetData,
  onOpenAddModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-100">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  CargoShare <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Lite</span>
                </span>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 hidden sm:inline-block">
                  P2P Logistics
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                On-Demand Warehouse & Truck Capacity Exchange
              </p>
            </div>
          </div>

          {/* Center: Role Switcher Navbar */}
          <div className="flex items-center">
            <div className="bg-slate-100/90 p-1 rounded-xl border border-slate-200 flex items-center shadow-inner">
              <button
                type="button"
                id="role-seeker-btn"
                onClick={() => onRoleChange('seeker')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  currentRole === 'seeker'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Search className="w-4 h-4 text-indigo-600" />
                <span>Seeker</span>
                <span className="text-xs hidden md:inline font-normal text-slate-500">(Find Space)</span>
              </button>

              <button
                type="button"
                id="role-provider-btn"
                onClick={() => onRoleChange('provider')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 relative cursor-pointer ${
                  currentRole === 'provider'
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-900/5'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>Provider</span>
                <span className="text-xs hidden md:inline font-normal text-slate-500">(List Space)</span>
                
                {pendingRequestsCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-amber-500 rounded-full animate-pulse">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Right Actions: Quick Actions & Status */}
          <div className="flex items-center gap-2 sm:gap-3">
            {currentRole === 'provider' ? (
              <button
                type="button"
                id="navbar-add-listing-btn"
                onClick={onOpenAddModal}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-sm font-medium transition shadow-sm hover:shadow-md cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Asset</span>
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-semibold text-slate-800">{listingsCount}</span> Spaces Available
              </div>
            )}

            {/* Reset Demo State button */}
            <button
              type="button"
              id="reset-demo-btn"
              onClick={onResetData}
              title="Reset Demo Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition border border-transparent hover:border-slate-200 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
