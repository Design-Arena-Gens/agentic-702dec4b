'use client';

import React from 'react';
import { Vendor, Technology, Region } from '@/lib/types';

interface FilterBarProps {
  vendors: Vendor[];
  technologies: Technology[];
  regions: Region[];
  selectedVendor: Vendor | 'All';
  selectedTechnology: Technology | 'All';
  selectedRegion: Region | 'All';
  onVendorChange: (vendor: Vendor | 'All') => void;
  onTechnologyChange: (technology: Technology | 'All') => void;
  onRegionChange: (region: Region | 'All') => void;
}

export default function FilterBar({
  vendors,
  technologies,
  regions,
  selectedVendor,
  selectedTechnology,
  selectedRegion,
  onVendorChange,
  onTechnologyChange,
  onRegionChange,
}: FilterBarProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
          <select
            value={selectedVendor}
            onChange={(e) => onVendorChange(e.target.value as Vendor | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Vendors</option>
            {vendors.map((vendor) => (
              <option key={vendor} value={vendor}>
                {vendor}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
          <select
            value={selectedTechnology}
            onChange={(e) => onTechnologyChange(e.target.value as Technology | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Technologies</option>
            {technologies.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value as Region | 'All')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Regions</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
