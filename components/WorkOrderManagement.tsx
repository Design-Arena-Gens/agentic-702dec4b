'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { WorkOrder, Team, TicketStatus, Vendor, Technology, Region } from '@/lib/types';
import DataImportExport from './DataImportExport';
import { generateWorkOrders } from '@/lib/mockData';

export default function WorkOrderManagement() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [teamFilter, setTeamFilter] = useState<Team | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'All'>('All');
  const [vendorFilter, setVendorFilter] = useState<Vendor | 'All'>('All');
  const [technologyFilter, setTechnologyFilter] = useState<Technology | 'All'>('All');
  const [regionFilter, setRegionFilter] = useState<Region | 'All'>('All');

  useEffect(() => {
    setWorkOrders(generateWorkOrders());
  }, []);

  const filteredWorkOrders = workOrders.filter((wo) => {
    if (teamFilter !== 'All' && wo.team !== teamFilter) return false;
    if (statusFilter !== 'All' && wo.status !== statusFilter) return false;
    if (vendorFilter !== 'All' && wo.vendor !== vendorFilter) return false;
    if (technologyFilter !== 'All' && wo.technology !== technologyFilter) return false;
    if (regionFilter !== 'All' && wo.region !== regionFilter) return false;
    return true;
  });

  const handleImport = (importedData: any[]) => {
    try {
      const newWorkOrders = importedData.map((item, index) => ({
        id: item.id || `IMP-WO-${Date.now()}-${index}`,
        ticketNumber: item.ticketNumber || `TKT-${Date.now()}-${index}`,
        description: item.description || 'Imported work order',
        status: (item.status as TicketStatus) || 'Open',
        team: (item.team as Team) || 'R&D',
        vendor: (item.vendor as Vendor) || 'Ericsson',
        technology: (item.technology as Technology) || '4G',
        region: (item.region as Region) || 'Central',
        priority: (item.priority as 'High' | 'Medium' | 'Low') || 'Medium',
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || new Date().toISOString(),
      }));
      setWorkOrders([...newWorkOrders, ...workOrders]);
      alert(`Successfully imported ${newWorkOrders.length} work orders`);
    } catch (error) {
      console.error('Error processing imported data:', error);
      alert('Error processing imported data');
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-orange-100 text-orange-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return <FileText className="text-blue-600" size={20} />;
      case 'In Progress':
        return <Clock className="text-yellow-600" size={20} />;
      case 'Resolved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Closed':
        return <XCircle className="text-gray-600" size={20} />;
    }
  };

  const teamCounts = {
    'R&D': workOrders.filter(wo => wo.team === 'R&D').length,
    'Transmission': workOrders.filter(wo => wo.team === 'Transmission').length,
    'Core': workOrders.filter(wo => wo.team === 'Core').length,
  };

  const statusCounts = {
    'Open': workOrders.filter(wo => wo.status === 'Open').length,
    'In Progress': workOrders.filter(wo => wo.status === 'In Progress').length,
    'Resolved': workOrders.filter(wo => wo.status === 'Resolved').length,
    'Closed': workOrders.filter(wo => wo.status === 'Closed').length,
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Work Order Management</h2>
        <DataImportExport
          data={filteredWorkOrders}
          onImport={handleImport}
          filename="work-orders-data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">R&D Team</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{teamCounts['R&D']}</p>
            </div>
            <FileText className="text-blue-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Transmission Team</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{teamCounts.Transmission}</p>
            </div>
            <FileText className="text-purple-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">Core Team</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{teamCounts.Core}</p>
            </div>
            <FileText className="text-green-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-medium">In Progress</h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{statusCounts['In Progress']}</p>
            </div>
            <Clock className="text-yellow-600" size={40} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value as Team | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Teams</option>
              <option value="R&D">R&D</option>
              <option value="Transmission">Transmission</option>
              <option value="Core">Core</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
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
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Technology</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Region</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkOrders.map((wo) => (
                <tr key={wo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(wo.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(wo.status)}`}>
                        {wo.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{wo.ticketNumber}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{wo.description}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {wo.team}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{wo.vendor}</td>
                  <td className="px-4 py-3 text-sm">{wo.technology}</td>
                  <td className="px-4 py-3 text-sm">{wo.region}</td>
                  <td className="px-4 py-3 text-sm">{new Date(wo.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">{new Date(wo.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
