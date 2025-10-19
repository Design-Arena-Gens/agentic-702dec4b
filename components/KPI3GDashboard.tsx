'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPIData } from '@/lib/types';
import DataImportExport from './DataImportExport';
import { generate3GKPIData } from '@/lib/mockData';

export default function KPI3GDashboard() {
  const [data, setData] = useState<KPIData[]>([]);

  useEffect(() => {
    setData(generate3GKPIData());
  }, []);

  const handleImport = (importedData: any[]) => {
    try {
      const newData = importedData.map((item) => ({
        timestamp: item.timestamp || new Date().toISOString(),
        callSetupSuccessRate: parseFloat(item.callSetupSuccessRate) || 96,
        dropCallRate: parseFloat(item.dropCallRate) || 0.8,
        handoverSuccessRate: parseFloat(item.handoverSuccessRate) || 97,
        dataSpeed: parseFloat(item.dataSpeed) || 10,
        voiceQuality: parseFloat(item.voiceQuality) || 4,
        networkRegistrationTime: parseFloat(item.networkRegistrationTime) || 3,
      }));
      setData(newData);
      alert(`Successfully imported ${newData.length} records`);
    } catch (error) {
      console.error('Error processing imported data:', error);
      alert('Error processing imported data');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const chartData = data.map((item) => ({
    ...item,
    time: formatTime(item.timestamp),
  }));

  const avgCallSetupSuccess = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.callSetupSuccessRate || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgDataSpeed = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.dataSpeed || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgVoiceQuality = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.voiceQuality || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgRegistrationTime = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.networkRegistrationTime || 0), 0) / data.length).toFixed(2)
    : '0';

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">3G KPI Dashboard</h2>
        <DataImportExport
          data={data}
          onImport={handleImport}
          filename="3g-kpi-data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Call Setup Success Rate</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{avgCallSetupSuccess}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Data Speed</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgDataSpeed} Mbps</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Voice Quality (MOS)</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{avgVoiceQuality}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Registration Time</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{avgRegistrationTime}s</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Call Performance (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="callSetupSuccessRate" stroke="#10B981" name="Setup Success (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="dropCallRate" stroke="#EF4444" name="Drop Rate (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="handoverSuccessRate" stroke="#3B82F6" name="Handover Success (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Data Speed (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="dataSpeed" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Data Speed (Mbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Voice Quality MOS (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="voiceQuality" stroke="#8B5CF6" name="Voice Quality (MOS)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Network Registration Time (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="networkRegistrationTime" stroke="#F59E0B" name="Registration Time (s)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">KPI Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Setup Success</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drop Call Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Speed</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voice Quality</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registration Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{item.callSetupSuccessRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.dropCallRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.dataSpeed?.toFixed(2)} Mbps</td>
                  <td className="px-4 py-3 text-sm">{item.voiceQuality?.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm">{item.networkRegistrationTime?.toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
