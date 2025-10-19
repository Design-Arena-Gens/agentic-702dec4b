'use client';

import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { KPIData } from '@/lib/types';
import DataImportExport from './DataImportExport';
import { generate4GKPIData } from '@/lib/mockData';

export default function KPI4GDashboard() {
  const [data, setData] = useState<KPIData[]>([]);

  useEffect(() => {
    setData(generate4GKPIData());
  }, []);

  const handleImport = (importedData: any[]) => {
    try {
      const newData = importedData.map((item) => ({
        timestamp: item.timestamp || new Date().toISOString(),
        rrcConnectionSetupRate: parseFloat(item.rrcConnectionSetupRate) || 98,
        attachSuccessRate: parseFloat(item.attachSuccessRate) || 97,
        erabSuccessRate: parseFloat(item.erabSuccessRate) || 96,
        throughput: parseFloat(item.throughput) || 75,
        latency: parseFloat(item.latency) || 20,
        spectralEfficiency: parseFloat(item.spectralEfficiency) || 3,
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

  const avgRrcConnection = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.rrcConnectionSetupRate || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgAttachSuccess = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.attachSuccessRate || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgThroughput = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.throughput || 0), 0) / data.length).toFixed(2)
    : '0';

  const avgLatency = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.latency || 0), 0) / data.length).toFixed(2)
    : '0';

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">4G LTE KPI Dashboard</h2>
        <DataImportExport
          data={data}
          onImport={handleImport}
          filename="4g-kpi-data"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">RRC Connection Setup Rate</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{avgRrcConnection}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Attach Success Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{avgAttachSuccess}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Throughput</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">{avgThroughput} Mbps</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium">Avg Latency</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">{avgLatency} ms</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Connection Success Rates (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rrcConnectionSetupRate" stroke="#10B981" name="RRC Connection (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="attachSuccessRate" stroke="#3B82F6" name="Attach Success (%)" strokeWidth={2} />
              <Line type="monotone" dataKey="erabSuccessRate" stroke="#8B5CF6" name="E-RAB Success (%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Throughput Performance (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="throughput" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Throughput (Mbps)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Latency (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="latency" stroke="#F59E0B" name="Latency (ms)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Spectral Efficiency (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="spectralEfficiency" fill="#EF4444" name="Spectral Efficiency (bps/Hz)" />
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">RRC Connection</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attach Success</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-RAB Success</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Throughput</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Latency</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spectral Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{new Date(item.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{item.rrcConnectionSetupRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.attachSuccessRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.erabSuccessRate?.toFixed(2)}%</td>
                  <td className="px-4 py-3 text-sm">{item.throughput?.toFixed(2)} Mbps</td>
                  <td className="px-4 py-3 text-sm">{item.latency?.toFixed(2)} ms</td>
                  <td className="px-4 py-3 text-sm">{item.spectralEfficiency?.toFixed(2)} bps/Hz</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
