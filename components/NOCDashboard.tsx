'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NetworkData, Vendor, Technology, Region } from '@/lib/types';
import FilterBar from './FilterBar';
import DataImportExport from './DataImportExport';
import { generateNetworkData } from '@/lib/mockData';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function NOCDashboard() {
  const [data, setData] = useState<NetworkData[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | 'All'>('All');
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'All'>('All');

  useEffect(() => {
    setData(generateNetworkData());
  }, []);

  const filteredData = data.filter((item) => {
    if (selectedVendor !== 'All' && item.vendor !== selectedVendor) return false;
    if (selectedTechnology !== 'All' && item.technology !== selectedTechnology) return false;
    if (selectedRegion !== 'All' && item.region !== selectedRegion) return false;
    return true;
  });

  const vendorData = ['Ericsson', 'Huawei', 'Nokia'].map((vendor) => {
    const vendorItems = filteredData.filter((item) => item.vendor === vendor);
    return {
      vendor,
      sites: vendorItems.length,
      avgAvailability: vendorItems.length > 0
        ? vendorItems.reduce((sum, item) => sum + item.availability, 0) / vendorItems.length
        : 0,
    };
  });

  const technologyData = ['2G', '3G', '4G'].map((tech) => {
    const techItems = filteredData.filter((item) => item.technology === tech);
    return {
      technology: tech,
      sites: techItems.length,
      avgThroughput: techItems.length > 0
        ? techItems.reduce((sum, item) => sum + item.throughput, 0) / techItems.length
        : 0,
    };
  });

  const regionData = ['North', 'South', 'East', 'West', 'Central'].map((region) => {
    const regionItems = filteredData.filter((item) => item.region === region);
    return {
      region,
      sites: regionItems.length,
    };
  });

  const handleImport = (importedData: any[]) => {
    try {
      const newData = importedData.map((item, index) => ({
        id: `imported-${Date.now()}-${index}`,
        vendor: item.vendor || 'Ericsson',
        technology: item.technology || '4G',
        region: item.region || 'Central',
        siteName: item.siteName || `Site-${index}`,
        availability: parseFloat(item.availability) || 95,
        throughput: parseFloat(item.throughput) || 50,
        latency: parseFloat(item.latency) || 20,
        packetLoss: parseFloat(item.packetLoss) || 0.5,
        timestamp: item.timestamp || new Date().toISOString(),
      }));
      setData([...data, ...newData]);
      alert(`Successfully imported ${newData.length} records`);
    } catch (error) {
      console.error('Error processing imported data:', error);
      alert('Error processing imported data');
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">NOC Operation Dashboard</h2>
        <DataImportExport
          data={filteredData}
          onImport={handleImport}
          filename="noc-dashboard-data"
        />
      </div>

      <FilterBar
        vendors={['Ericsson', 'Huawei', 'Nokia']}
        technologies={['2G', '3G', '4G']}
        regions={['North', 'South', 'East', 'West', 'Central']}
        selectedVendor={selectedVendor}
        selectedTechnology={selectedTechnology}
        selectedRegion={selectedRegion}
        onVendorChange={setSelectedVendor}
        onTechnologyChange={setSelectedTechnology}
        onRegionChange={setSelectedRegion}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Total Sites</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{filteredData.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Availability</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {filteredData.length > 0
              ? (filteredData.reduce((sum, item) => sum + item.availability, 0) / filteredData.length).toFixed(2)
              : 0}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Throughput</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">
            {filteredData.length > 0
              ? (filteredData.reduce((sum, item) => sum + item.throughput, 0) / filteredData.length).toFixed(2)
              : 0} Mbps
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Latency</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">
            {filteredData.length > 0
              ? (filteredData.reduce((sum, item) => sum + item.latency, 0) / filteredData.length).toFixed(2)
              : 0} ms
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Sites by Vendor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sites" fill="#3B82F6" name="Number of Sites" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Availability by Vendor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vendorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="vendor" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="avgAvailability" stroke="#10B981" name="Avg Availability (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Sites by Technology</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={technologyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="technology" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sites" fill="#F59E0B" name="Number of Sites" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Sites by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                dataKey="sites"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Site Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technology</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Availability</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Throughput</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.slice(0, 10).map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{item.siteName}</td>
                  <td className="px-4 py-3 text-sm">{item.vendor}</td>
                  <td className="px-4 py-3 text-sm">{item.technology}</td>
                  <td className="px-4 py-3 text-sm">{item.region}</td>
                  <td className="px-4 py-3 text-sm">{item.availability.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.throughput.toFixed(2)} Mbps</td>
                  <td className="px-4 py-3 text-sm">{item.latency.toFixed(2)} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
