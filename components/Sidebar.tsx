'use client';

import React from 'react';
import { Activity, AlertTriangle, FileText, BarChart3, Radio, Smartphone, Wifi } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'NOC Dashboard', icon: Activity },
    { id: '2g-kpi', label: '2G KPIs', icon: Radio },
    { id: '3g-kpi', label: '3G KPIs', icon: Smartphone },
    { id: '4g-kpi', label: '4G KPIs', icon: Wifi },
    { id: 'alarms', label: 'Alarm Management', icon: AlertTriangle },
    { id: 'work-orders', label: 'Work Orders', icon: FileText },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <BarChart3 size={32} className="text-blue-400" />
          <h1 className="text-xl font-bold">NetMonitor Pro</h1>
        </div>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => onPageChange(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
