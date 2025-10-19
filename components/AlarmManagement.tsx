'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Bell } from 'lucide-react';
import { Alarm, AlarmStatus, Vendor, Technology, Region } from '@/lib/types';
import DataImportExport from './DataImportExport';
import { generateAlarms } from '@/lib/mockData';

export default function AlarmManagement() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [statusFilter, setStatusFilter] = useState<AlarmStatus | 'All'>('All');
  const [vendorFilter, setVendorFilter] = useState<Vendor | 'All'>('All');
  const [technologyFilter, setTechnologyFilter] = useState<Technology | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');
  const [acknowledgedFilter, setAcknowledgedFilter] = useState<'All' | 'Acknowledged' | 'Unacknowledged'>('All');

  useEffect(() => {
    setAlarms(generateAlarms());
  }, []);

  const filteredAlarms = alarms.filter((alarm) => {
    if (statusFilter !== 'All' && alarm.status !== statusFilter) return false;
    if (vendorFilter !== 'All' && alarm.vendor !== vendorFilter) return false;
    if (technologyFilter !== 'All' && alarm.technology !== technologyFilter) return false;
    if (regionFilter !== 'All' && alarm.region !== regionFilter) return false;
    if (acknowledgedFilter === 'Acknowledged' && !alarm.acknowledged) return false;
    if (acknowledgedFilter === 'Unacknowledged' && alarm.acknowledged) return false;
    return true;
  });

  const handleImport = (importedData: any[]) => {
    try {
      const newAlarms = importedData.map((item, index) => ({
        id: item.id || `IMP-${Date.now()}-${index}`,
        status: (item.status as AlarmStatus) || 'Minor',
        vendor: (item.vendor as Vendor) || 'Ericsson',
        technology: (item.technology as Technology) || '4G',
        region: (item.region as Region) || 'Central',
        siteName: item.siteName || `Site-${index}`,
        description: item.description || 'Imported alarm',
        timestamp: item.timestamp || new Date().toISOString(),
        acknowledged: item.acknowledged === 'true' || item.acknowledged === true || false,
      }));
      setAlarms([...newAlarms, ...alarms]);
      alert(`Successfully imported ${newAlarms.length} alarms`);
    } catch (error) {
      console.error('Error processing imported data:', error);
      alert('Error processing imported data');
    }
  };

  const toggleAcknowledge = (id: string) => {
    setAlarms(alarms.map(alarm =>
      alarm.id === id ? { ...alarm, acknowledged: !alarm.acknowledged } : alarm
    ));
  };

  const getStatusIcon = (status: AlarmStatus) => {
    switch (status) {
      case 'Critical':
        return <XCircle className="text-red-600" size={20} />;
      case 'Major':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'Minor':
        return <AlertCircle className="text-yellow-600" size={20} />;
      case 'Normal':
        return <CheckCircle className="text-green-600" size={20} />;
    }
  };

  const getStatusColor = (status: AlarmStatus) => {
    switch (status) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'Major':
        return 'bg-orange-100 text-orange-800';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'Normal':
        return 'bg-green-100 text-green-800';
    }
  };

  const statusCounts = {
    Critical: alarms.filter(a => a.status === 'Critical').length,
    Major: alarms.filter(a => a.status === 'Major').length,
    Minor: alarms.filter(a => a.status === 'Minor').length,
    Normal: alarms.filter(a => a.status === 'Normal').length,
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Alarm Management</h2>
        <DataImportExport
          data={filteredAlarms}
          onImport={handleImport}
          filename="alarms-data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Critical</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{statusCounts.Critical}</p>
            </div>
            <XCircle className="text-red-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Major</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{statusCounts.Major}</p>
            </div>
            <AlertTriangle className="text-orange-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Minor</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts.Minor}</p>
            </div>
            <AlertCircle className="text-yellow-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Normal</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{statusCounts.Normal}</p>
            </div>
            <CheckCircle className="text-green-600" size={40} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AlarmStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Critical">Critical</option>
              <option value="Major">Major</option>
              <option value="Minor">Minor</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendor</label>
            <select
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value as Vendor | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Vendors</option>
              <option value="Ericsson">Ericsson</option>
              <option value="Huawei">Huawei</option>
              <option value="Nokia">Nokia</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
            <select
              value={technologyFilter}
              onChange={(e) => setTechnologyFilter(e.target.value as Technology | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Technologies</option>
              <option value="2G">2G</option>
              <option value="3G">3G</option>
              <option value="4G">4G</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value as Region | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="West">West</option>
              <option value="Central">Central</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acknowledgment</label>
            <select
              value={acknowledgedFilter}
              onChange={(e) => setAcknowledgedFilter(e.target.value as 'All' | 'Acknowledged' | 'Unacknowledged')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="Unacknowledged">Unacknowledged</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alarm ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Site Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technology</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAlarms.map((alarm) => (
                <tr key={alarm.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(alarm.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(alarm.status)}`}>
                        {alarm.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{alarm.id}</td>
                  <td className="px-4 py-3 text-sm">{alarm.siteName}</td>
                  <td className="px-4 py-3 text-sm">{alarm.description}</td>
                  <td className="px-4 py-3 text-sm">{alarm.vendor}</td>
                  <td className="px-4 py-3 text-sm">{alarm.technology}</td>
                  <td className="px-4 py-3 text-sm">{alarm.region}</td>
                  <td className="px-4 py-3 text-sm">{new Date(alarm.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAcknowledge(alarm.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition ${
                        alarm.acknowledged
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {alarm.acknowledged ? 'Acknowledged' : 'Acknowledge'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
