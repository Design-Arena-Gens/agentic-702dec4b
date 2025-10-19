'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPIData } from '@/lib/types';
import DataImportExport from './DataImportExport';
import { generate2GKPIData } from '@/lib/mockData';

export default function KPI2GDashboard() {
  const [data, setData] = useState<KPIData[]>([]);

  useEffect(() => {
    setData(generate2GKPIData());
  }, []);

  const handleImport = (importedData: any[]) => {
    try {
      const newData = importedData.map((item) => ({
        timestamp: item.timestamp || new Date().toISOString(),
        callSetupSuccessRate: parseFloat(item.callSetupSuccessRate) || 95,
        dropCallRate: parseFloat(item.dropCallRate) || 1,
        handoverSuccessRate: parseFloat(item.handoverSuccessRate) || 96,
        signalStrength: parseFloat(item.signalStrength) || -80,
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

  const avgDropCallRate = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.dropCallRate || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgHandoverSuccess = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.handoverSuccessRate || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgSignalStrength = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.signalStrength || 0), 0) / data.length).toFixed(2)
    : '0';

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">2G KPI Dashboard</h2>
        <DataImportExport
          data={data}
          onImport={handleImport}
          filename="2g-kpi-data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Call Setup Success Rate</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{avgCallSetupSuccess}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Drop Call Rate</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{avgDropCallRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Handover Success Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgHandoverSuccess}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Signal Strength</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{avgSignalStrength} dBm</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Call Setup Success Rate (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="callSetupSuccessRate" stroke="#10B981" name="Success Rate (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Drop Call Rate (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 3]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="dropCallRate" stroke="#EF4444" name="Drop Rate (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Handover Success Rate (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="handoverSuccessRate" stroke="#3B82F6" name="Handover Success (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Signal Strength (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="signalStrength" fill="#8B5CF6" name="Signal Strength (dBm)" />
            </BarChart>
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Call Setup Success Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Drop Call Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handover Success Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signal Strength</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{item.callSetupSuccessRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.dropCallRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.handoverSuccessRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.signalStrength?.toFixed(2)} dBm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
